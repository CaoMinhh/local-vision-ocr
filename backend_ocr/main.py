"""FastAPI: upload image/PDF → OCR via Ollama (vision) → Markdown or JSON.

Copy ``.env.example`` to ``.env`` in the project root to override defaults (loaded when this module is imported).

Run the server (from the project root that contains ``backend_ocr/``)::

    uvicorn backend_ocr.main:app --host 0.0.0.0 --port 8000

Or from project root: ``python -m backend_ocr.main`` / ``python backend_ocr/main.py`` (starts uvicorn in code).
"""

from __future__ import annotations

import asyncio
import base64
import contextlib
import csv
from contextlib import asynccontextmanager
import functools
import io
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from collections.abc import AsyncIterator
from typing import Annotated, Any, Literal

OcrStreamChunkKind = Literal["content", "thinking"]

from dotenv import load_dotenv

_PROJECT_ROOT = Path(__file__).resolve().parent.parent
# Running `python backend_ocr/main.py` puts only .../backend_ocr on sys.path; package `backend_ocr` needs repo root.
_root_s = str(_PROJECT_ROOT)
if _root_s not in sys.path:
    sys.path.insert(0, _root_s)
load_dotenv(_PROJECT_ROOT / ".env")
from backend_ocr.runtime_config import (
    load_app_settings_file_into_environ,
    migrate_legacy_runtime_settings_if_needed,
)

migrate_legacy_runtime_settings_if_needed()
load_app_settings_file_into_environ()

import pymupdf as fitz  # PyMuPDF (do not `pip install fitz` — wrong package on PyPI)
import httpx
from fastapi import (
    BackgroundTasks,
    FastAPI,
    File,
    Form,
    HTTPException,
    UploadFile,
    WebSocket,
    WebSocketDisconnect,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image


def _parse_jpeg_quality() -> int | None:
    raw = (os.environ.get("OCR_JPEG_QUALITY") or "").strip()
    if not raw:
        return None
    try:
        q = int(raw)
    except ValueError:
        return None
    return max(1, min(100, q))


def _ollama_keep_alive_for_request() -> int | str | None:
    """Value for Ollama ``/api/chat`` field ``keep_alive``. Empty env → omit (server default). ``0`` unloads model from VRAM after the request."""
    s = (os.environ.get("OLLAMA_KEEP_ALIVE") or "").strip()
    if not s:
        return None
    if s == "0":
        return 0
    if s.isdigit():
        return int(s)
    return s


def _parse_cors_origins(raw: str) -> list[str]:
    s = raw.strip()
    if not s or s == "*":
        return ["*"]
    return [x.strip() for x in s.split(",") if x.strip()]


OLLAMA_HOST: str
DEFAULT_MODEL: str
PDF_DPI_SCALE: float
OCR_MAX_PARALLEL: int
OCR_MAX_EDGE: int
OCR_JPEG_QUALITY: int | None
REQUEST_TIMEOUT: float
NVIDIA_SMI_PATH: str
NVIDIA_SMI_TIMEOUT: float
GPU_WS_INTERVAL_SEC: float
APP_TITLE: str
APP_VERSION: str
SERVER_HOST: str
SERVER_PORT: int
CORS_ALLOW_ORIGINS: list[str]
OLLAMA_THINK: bool


def _sync_settings_from_environ() -> None:
    global OLLAMA_HOST, DEFAULT_MODEL, OLLAMA_THINK, PDF_DPI_SCALE, OCR_MAX_PARALLEL, OCR_MAX_EDGE
    global OCR_JPEG_QUALITY, REQUEST_TIMEOUT, NVIDIA_SMI_PATH, NVIDIA_SMI_TIMEOUT, GPU_WS_INTERVAL_SEC
    global APP_TITLE, APP_VERSION, SERVER_HOST, SERVER_PORT, CORS_ALLOW_ORIGINS
    OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://127.0.0.1:11434")
    DEFAULT_MODEL = os.environ.get("OLLAMA_MODEL", "nemotron3:33b")
    OLLAMA_THINK = str(os.environ.get("OLLAMA_THINK", "1")).strip().lower() in ("1", "true", "yes", "on")
    try:
        PDF_DPI_SCALE = float(os.environ.get("OCR_PDF_SCALE", "2.0"))
    except ValueError:
        PDF_DPI_SCALE = 2.0
    try:
        OCR_MAX_PARALLEL = max(1, int(os.environ.get("OCR_MAX_PARALLEL", "1")))
    except ValueError:
        OCR_MAX_PARALLEL = 1
    try:
        OCR_MAX_EDGE = max(0, int(os.environ.get("OCR_MAX_EDGE", "0")))
    except ValueError:
        OCR_MAX_EDGE = 0
    OCR_JPEG_QUALITY = _parse_jpeg_quality()
    try:
        REQUEST_TIMEOUT = float(os.environ.get("OLLAMA_TIMEOUT_SEC", "600"))
    except ValueError:
        REQUEST_TIMEOUT = 600.0
    NVIDIA_SMI_PATH = os.environ.get("NVIDIA_SMI_PATH", "nvidia-smi")
    try:
        NVIDIA_SMI_TIMEOUT = float(os.environ.get("NVIDIA_SMI_TIMEOUT_SEC", "8"))
    except ValueError:
        NVIDIA_SMI_TIMEOUT = 8.0
    try:
        GPU_WS_INTERVAL_SEC = float(os.environ.get("GPU_WS_INTERVAL_SEC", "1.5"))
    except ValueError:
        GPU_WS_INTERVAL_SEC = 1.5
    APP_TITLE = os.environ.get("APP_TITLE", "OCR → MD/JSON")
    APP_VERSION = os.environ.get("APP_VERSION", "0.1.0")
    SERVER_HOST = os.environ.get("SERVER_HOST", "0.0.0.0")
    try:
        SERVER_PORT = max(1, min(65535, int(os.environ.get("SERVER_PORT", "8000"))))
    except ValueError:
        SERVER_PORT = 8000
    CORS_ALLOW_ORIGINS = _parse_cors_origins(os.environ.get("CORS_ALLOW_ORIGINS", "*"))


_sync_settings_from_environ()


@asynccontextmanager
async def _app_lifespan(_app: FastAPI):
    from backend_ocr.app_settings import (
        ensure_app_settings_seeded_in_mongo,
        refresh_persisted_app_settings_into_environ,
    )
    from backend_ocr.mongo_store import mongo_connect, mongo_disconnect
    from backend_ocr.ocr_history_service import migrate_file_history_to_mongodb_if_needed

    await mongo_connect()
    await ensure_app_settings_seeded_in_mongo()
    await migrate_file_history_to_mongodb_if_needed()
    await refresh_persisted_app_settings_into_environ()
    _sync_settings_from_environ()
    try:
        yield
    finally:
        await mongo_disconnect()


app = FastAPI(title=APP_TITLE, version=APP_VERSION, lifespan=_app_lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_OCR_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend_ocr")
OCR_MODELS_JSON = os.path.join(FRONTEND_OCR_DIR, "config", "ocr-models.json")


def _load_ocr_models_config() -> tuple[list[str], str | None]:
    """
    Read ``frontend_ocr/config/ocr-models.json`` — sole source for the model dropdown (``preferred`` or ``models`` array).

    Returns ``(preferred_names, default_override)`` where ``default_override`` is a string or ``None``.
    """
    preferred: list[str] = []
    default_override: str | None = None
    if not os.path.isfile(OCR_MODELS_JSON):
        return preferred, default_override
    try:
        with open(OCR_MODELS_JSON, encoding="utf-8") as fp:
            data = json.load(fp)
        if isinstance(data.get("default"), str) and data["default"].strip():
            default_override = data["default"].strip()
        raw = data.get("preferred")
        if raw is None:
            raw = data.get("models")
        if isinstance(raw, list):
            for x in raw:
                if isinstance(x, str) and x.strip():
                    preferred.append(x.strip())
    except Exception:
        pass
    return preferred, default_override


async def _nvidia_smi_exec(extra_args: list[str]) -> tuple[bool, str, str, str]:
    """
    Run ``nvidia-smi`` with ``extra_args`` appended.

    Returns ``(ok, stdout_combined, error_message, fetched_at_utc_iso)``.
    """
    fetched_at = datetime.now(timezone.utc).isoformat()
    try:
        proc = await asyncio.create_subprocess_exec(
            NVIDIA_SMI_PATH,
            *extra_args,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.STDOUT,
        )
    except FileNotFoundError:
        return (
            False,
            "",
            f"Không tìm thấy `{NVIDIA_SMI_PATH}`. Cài driver NVIDIA hoặc đặt NVIDIA_SMI_PATH.",
            fetched_at,
        )
    try:
        raw, _ = await asyncio.wait_for(proc.communicate(), timeout=NVIDIA_SMI_TIMEOUT)
    except asyncio.TimeoutError:
        with contextlib.suppress(ProcessLookupError):
            proc.kill()
        await asyncio.sleep(0)
        return False, "", f"nvidia-smi vượt quá {NVIDIA_SMI_TIMEOUT}s.", fetched_at
    text = raw.decode("utf-8", errors="replace").strip()
    code = proc.returncode if proc.returncode is not None else -1
    if code != 0:
        return False, text, f"nvidia-smi thoát mã {code}.", fetched_at
    return True, text, "", fetched_at


def _maybe_downscale(im: Image.Image) -> Image.Image:
    if OCR_MAX_EDGE <= 0:
        return im
    w, h = im.size
    m = max(w, h)
    if m <= OCR_MAX_EDGE:
        return im
    scale = OCR_MAX_EDGE / float(m)
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    return im.resize((nw, nh), Image.Resampling.LANCZOS)


def _pil_to_vision_b64(im: Image.Image) -> str:
    """Encode RGB image → base64 (PNG or JPEG depending on OCR_JPEG_QUALITY)."""
    buf = io.BytesIO()
    if OCR_JPEG_QUALITY is not None:
        if im.mode != "RGB":
            im = im.convert("RGB")
        im.save(buf, format="JPEG", quality=OCR_JPEG_QUALITY, optimize=True)
    else:
        if im.mode not in ("RGB", "L"):
            im = im.convert("RGB")
        im.save(buf, format="PNG", optimize=True)
    return base64.b64encode(buf.getvalue()).decode("ascii")


def _image_to_vision_b64(raw: bytes, content_type: str | None) -> str:
    """Normalize uploaded image → base64 for Ollama vision."""
    try:
        im = Image.open(io.BytesIO(raw))
        if im.mode not in ("RGB", "L"):
            im = im.convert("RGB")
        im = _maybe_downscale(im)
        return _pil_to_vision_b64(im)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Không đọc được ảnh: {e}. Hỗ trợ PNG, JPEG, WebP, GIF, v.v.",
        ) from e


def _pdf_pages_to_vision_b64_list(pdf_bytes: bytes) -> list[str]:
    """PDF → one base64 string per page (after downscale / JPEG if enabled)."""
    out: list[str] = []
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF không hợp lệ: {e}") from e
    try:
        mat = fitz.Matrix(PDF_DPI_SCALE, PDF_DPI_SCALE)
        for i in range(doc.page_count):
            page = doc.load_page(i)
            pix = page.get_pixmap(matrix=mat, alpha=False)
            im = Image.open(io.BytesIO(pix.tobytes("png")))
            if im.mode not in ("RGB", "L"):
                im = im.convert("RGB")
            im = _maybe_downscale(im)
            out.append(_pil_to_vision_b64(im))
    finally:
        doc.close()
    if not out:
        raise HTTPException(status_code=400, detail="PDF không có trang nào.")
    return out


OcrFmt = Literal["md", "json", "latex"]

_SYSTEMS_PROMPT_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "systems_prompt"))


@functools.lru_cache(maxsize=32)
def _read_system_prompt(rel: str) -> str:
    path = os.path.join(_SYSTEMS_PROMPT_DIR, rel)
    if not os.path.isfile(path):
        raise RuntimeError(f"Missing system prompt file: {path}")
    with open(path, encoding="utf-8") as fp:
        return fp.read().replace("\r\n", "\n").strip()


def _expand_prompt(template: str, mapping: dict[str, str]) -> str:
    out = template
    for key, value in mapping.items():
        out = out.replace(f"__{key.upper()}__", value)
    return out


def _prompt_for_format(fmt: OcrFmt) -> str:
    spell = _read_system_prompt("spelling_hint.md")
    struct = _read_system_prompt("structure_visual_elements_hint.md")
    if fmt == "md":
        return _expand_prompt(
            _read_system_prompt("ocr_markdown.md"),
            {"spelling_hint": spell, "structure_visual_elements_hint": struct},
        )
    if fmt == "latex":
        return _expand_prompt(
            _read_system_prompt("ocr_latex.md"),
            {
                "spelling_hint": spell,
                "structure_visual_elements_hint": struct,
                "latex_preamble_hint": _read_system_prompt("latex_preamble_hint.md"),
            },
        )
    return _expand_prompt(
        _read_system_prompt("ocr_json.md"),
        {"spelling_hint": spell, "structure_visual_elements_hint": struct},
    )


def _strip_latex_outer_document_if_present(text: str) -> str:
    """
    Strip the full document wrapper if the model still returns \\documentclass…\\begin{document}.

    Used for later pages after requesting body-only output.
    """
    t = text.strip()
    if not t.startswith("\\documentclass"):
        return text
    m = re.search(r"\\begin\{document\}", t)
    if not m:
        return text
    inner = t[m.end() :].lstrip()
    inner = re.sub(r"\s*\\end\{document\}\s*\Z", "", inner, flags=re.DOTALL)
    return inner.strip() or text


def _prompt_for_ocr_page(fmt: OcrFmt, page_1based: int, total_pages: int) -> str:
    """Per-page prompt: multi-page PDF LaTeX — page 1 omits \\end{document}; page 2+ is body only."""
    if fmt == "latex" and total_pages > 1 and page_1based == 1:
        return _expand_prompt(
            _read_system_prompt("ocr_latex_multipage_first.md"),
            {
                "spelling_hint": _read_system_prompt("spelling_hint.md"),
                "structure_visual_elements_hint": _read_system_prompt("structure_visual_elements_hint.md"),
                "latex_preamble_hint": _read_system_prompt("latex_preamble_hint.md"),
                "total_pages": str(total_pages),
            },
        )
    if fmt == "latex" and total_pages > 1 and page_1based > 1:
        return _expand_prompt(
            _read_system_prompt("ocr_latex_multipage_following.md"),
            {
                "spelling_hint": _read_system_prompt("spelling_hint.md"),
                "structure_visual_elements_hint": _read_system_prompt("structure_visual_elements_hint.md"),
                "page_1based": str(page_1based),
                "total_pages": str(total_pages),
            },
        )
    return _prompt_for_format(fmt)


def _latex_multipage_strip_end_then_close(parts: list[str]) -> list[str]:
    """
    Given merged LaTeX parts: strip trailing ``\\end{document}`` from each part,
    then append exactly one ``\\end{document}`` after the last part.
    """
    if len(parts) <= 1:
        return parts
    out: list[str] = []
    for p in parts[:-1]:
        s = re.sub(r"\s*\\end\{document\}\s*\Z", "", p.strip(), flags=re.DOTALL | re.IGNORECASE).rstrip()
        out.append(s)
    last = parts[-1].strip()
    last = re.sub(r"\s*\\end\{document\}\s*\Z", "", last, flags=re.DOTALL | re.IGNORECASE).rstrip()
    out.append(last + "\n\n\\end{document}")
    return out


def _coerce_nonneg_usage_int(v: Any) -> int | None:
    """Ollama may send token counts as int or float in JSON; exclude bool."""
    if v is None or isinstance(v, bool):
        return None
    if isinstance(v, int):
        return max(0, v)
    if isinstance(v, float):
        if v != v or v in (float("inf"), float("-inf")):
            return None
        return max(0, int(v))
    if isinstance(v, str) and v.strip().lstrip("-").isdigit():
        try:
            return max(0, int(v.strip()))
        except ValueError:
            return None
    return None


def _ollama_extract_assistant_text(data: dict[str, Any]) -> str | None:
    """Extract assistant text from an Ollama ``/api/chat`` response."""
    msg = data.get("message") or {}
    c = msg.get("content")
    if isinstance(c, str) and c.strip():
        return c.strip()
    if isinstance(c, list):
        parts: list[str] = []
        for block in c:
            if isinstance(block, dict) and isinstance(block.get("text"), str):
                parts.append(block["text"])
        if parts:
            return "\n".join(parts).strip()
    resp = data.get("response")
    if isinstance(resp, str) and resp.strip():
        return resp.strip()
    think = msg.get("thinking")
    if isinstance(think, str) and think.strip():
        return think.strip()
    return None


def _thinking_stream_delta(prev_snapshot: str, incoming: str) -> tuple[str, str]:
    """
    Ollama / many thinking models send **cumulative** ``thinking`` (each chunk repeats the prefix).
    Return only the new suffix for the UI, and the snapshot to compare on the next chunk.

    If ``incoming`` is not an extension of ``prev_snapshot``, treat ``incoming`` as a true delta
    and extend the snapshot (token-at-a-time streaming).
    """
    if not incoming:
        return "", prev_snapshot
    if incoming.startswith(prev_snapshot):
        return incoming[len(prev_snapshot) :], incoming
    return incoming, prev_snapshot + incoming


async def _ollama_ocr_one_image_stream(
    client: httpx.AsyncClient,
    model: str,
    image_b64: str,
    fmt: OcrFmt,
    think: bool,
    prompt: str | None = None,
    usage_sink: dict[str, int] | None = None,
) -> AsyncIterator[tuple[OcrStreamChunkKind, str]]:
    """Stream chunks from Ollama ``/api/chat`` (``stream: true``) as they arrive.

    Yields ``("content", delta)`` for assistant text and ``("thinking", delta)`` for models
    that expose ``message.thinking`` / ``message.reasoning`` in the stream.
    Thinking chunks are normalized so cumulative repeats from the API are not re-sent in full.

    When the final packet has ``done: true``, write ``prompt_eval_count`` / ``eval_count`` into
    ``usage_sink`` (once per request).
    """
    thinking_snap = ""
    thinking_chunks = 0
    content_chunks = 0
    started_ts = datetime.now(timezone.utc).timestamp()
    think_only_abort_sec_raw = os.environ.get("OCR_THINK_ONLY_ABORT_SEC", "25")
    think_only_abort_chunks_raw = os.environ.get("OCR_THINK_ONLY_ABORT_CHUNKS", "400")
    try:
        think_only_abort_sec = max(5.0, float(think_only_abort_sec_raw))
    except ValueError:
        think_only_abort_sec = 25.0
    try:
        think_only_abort_chunks = max(50, int(think_only_abort_chunks_raw))
    except ValueError:
        think_only_abort_chunks = 400
    text_prompt = prompt if prompt is not None else _prompt_for_format(fmt)
    url = f"{OLLAMA_HOST.rstrip('/')}/api/chat"
    body: dict[str, Any] = {
        "model": model,
        "stream": True,
        "think": think,
        "options": {"temperature": 0},
        "messages": [
            {
                "role": "user",
                "content": text_prompt,
                "images": [image_b64],
            }
        ],
    }
    ka = _ollama_keep_alive_for_request()
    if ka is not None:
        body["keep_alive"] = ka
    try:
        async with client.stream(
            "POST",
            url,
            json=body,
            timeout=REQUEST_TIMEOUT,
        ) as resp:
            if resp.status_code != 200:
                err = (await resp.aread()).decode("utf-8", errors="replace")[:2000]
                raise HTTPException(
                    status_code=502,
                    detail=f"Ollama lỗi HTTP {resp.status_code}: {err}",
                )
            async for raw_line in resp.aiter_lines():
                line = (raw_line or "").strip()
                if not line:
                    continue
                try:
                    data = json.loads(line)
                except json.JSONDecodeError:
                    continue
                msg = data.get("message") or {}
                think_piece: str | None = None
                for think_key in ("thinking", "reasoning"):
                    raw_t = msg.get(think_key)
                    if isinstance(raw_t, str) and raw_t.strip():
                        think_piece = raw_t
                        break
                if think_piece is not None:
                    td, thinking_snap = _thinking_stream_delta(thinking_snap, think_piece)
                    if td:
                        thinking_chunks += 1
                        if (
                            think is True
                            and content_chunks == 0
                            and thinking_chunks >= think_only_abort_chunks
                            and (datetime.now(timezone.utc).timestamp() - started_ts) >= think_only_abort_sec
                        ):
                            raise HTTPException(
                                status_code=504,
                                detail=(
                                    "Model đang trả về thinking liên tục nhưng chưa có nội dung OCR. "
                                    "Đã dừng để tránh chạy vô tận; hãy tắt think hoặc đổi model."
                                ),
                            )
                        yield ("thinking", td)
                delta = msg.get("content")
                if isinstance(delta, str) and delta:
                    content_chunks += 1
                    yield ("content", delta)
                if data.get("done") is True:
                    if usage_sink is not None:
                        pt = _coerce_nonneg_usage_int(data.get("prompt_eval_count"))
                        ct = _coerce_nonneg_usage_int(data.get("eval_count"))
                        if pt is not None:
                            usage_sink["prompt_tokens"] = pt
                        if ct is not None:
                            usage_sink["completion_tokens"] = ct
                    break
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=502,
            detail=f"Không kết nối được Ollama tại {OLLAMA_HOST}: {e}",
        ) from e


async def _ollama_ocr_one_image(
    client: httpx.AsyncClient,
    model: str,
    image_b64: str,
    fmt: OcrFmt,
    think: bool,
) -> str:
    """OCR a single image (concatenate full stream — used by ``POST /api/ocr``)."""
    parts: list[str] = []
    async for kind, piece in _ollama_ocr_one_image_stream(client, model, image_b64, fmt, think):
        if kind == "content":
            parts.append(piece)
    text = "".join(parts).strip()
    if not text:
        raise HTTPException(
            status_code=502,
            detail="Phản hồi Ollama stream không có nội dung.",
        )
    return text


def _strip_json_fence(text: str) -> str:
    t = text.strip()
    m = re.match(r"^```(?:json)?\s*\n?(.*?)\n?```\s*$", t, re.DOTALL | re.IGNORECASE)
    if m:
        return m.group(1).strip()
    return t


def _safe_zip_entry_stem(original: str | None, index: int) -> str:
    base = (original or "").strip() or f"file{index + 1}"
    base = base.replace("\\", "/").split("/")[-1]
    dot = base.rfind(".")
    if dot > 0:
        base = base[:dot]
    base = re.sub(r"[^\w\-. ()\[\]]+", "_", base).strip("._- ") or f"file{index + 1}"
    return base[:160]


def _dedupe_zip_filenames(items: list[dict[str, Any]]) -> None:
    used: set[str] = set()
    for it in items:
        orig = (it.get("filename") or "file.bin").strip() or "file.bin"
        name = orig
        n = 2
        while name in used:
            stem, ext = os.path.splitext(orig)
            name = f"{stem} ({n}){ext}"
            n += 1
        used.add(name)
        it["filename"] = name


def _build_source_outputs_for_zip(
    fmt: OcrFmt,
    parts: list[str],
    json_objects: list[Any],
    source_spans: list[tuple[str | None, int, int]],
    parts_latex_slice: list[str],
) -> list[dict[str, Any]] | None:
    """One entry per uploaded file when multiple sources; pages of a PDF are merged into one file."""
    if len(source_spans) <= 1:
        return None
    out: list[dict[str, Any]] = []
    slice_src = parts_latex_slice if fmt == "latex" else parts
    for i, (fname, a, b) in enumerate(source_spans):
        if b <= a:
            continue
        stem = _safe_zip_entry_stem(fname, i)
        if fmt == "md":
            body = "\n\n".join(slice_src[a:b])
            out.append({"filename": f"{stem}.md", "markdown": body})
        elif fmt == "latex":
            body = "\n\n".join(slice_src[a:b])
            out.append({"filename": f"{stem}.tex", "latex": body})
        else:
            sub = json_objects[a : min(b, len(json_objects))] if a < len(json_objects) else []
            body = json.dumps({"pages": sub}, ensure_ascii=False, indent=2)
            out.append({"filename": f"{stem}.json", "json": body})
    if len(out) <= 1:
        return None
    _dedupe_zip_filenames(out)
    return out


def _ocr_build_result_dict(
    fmt: OcrFmt,
    merge: bool,
    model: str,
    parts: list[str],
    json_objects: list[Any],
) -> dict[str, Any]:
    """JSON payload matching ``/api/ocr`` (single object, not wrapped in Response)."""
    if fmt == "md":
        body = "\n".join(parts) if merge else (parts[0] if parts else "")
        if not merge and len(parts) > 1:
            return {
                "format": "md",
                "model": model,
                "pages": [{"page": i + 1, "markdown": p} for i, p in enumerate(parts)],
            }
        return {"format": "md", "model": model, "markdown": body}
    if fmt == "latex":
        if len(parts) > 1:
            parts_adj = _latex_multipage_strip_end_then_close(parts)
        else:
            parts_adj = parts
        body = "\n".join(parts_adj) if merge else (parts_adj[0] if parts_adj else "")
        if not merge and len(parts_adj) > 1:
            return {
                "format": "latex",
                "model": model,
                "pages": [{"page": i + 1, "latex": p} for i, p in enumerate(parts_adj)],
            }
        return {"format": "latex", "model": model, "latex": body}
    if merge and len(json_objects) == 1:
        return {"format": "json", "model": model, "data": json_objects[0]}
    return {
        "format": "json",
        "model": model,
        "pages": [{"page": i + 1, "data": obj} for i, obj in enumerate(json_objects)],
    }


def _ocr_partial_preview_text(
    fmt: OcrFmt,
    merge: bool,
    model: str,
    parts: list[str],
    json_objects: list[Any],
    *,
    max_chars: int = 400_000,
) -> str:
    """Text snapshot for background job polling (capped). Empty until at least one page is done."""
    if not parts and not json_objects:
        return ""
    try:
        d = _ocr_build_result_dict(fmt, merge, model, parts, json_objects)
    except Exception:
        return ""
    if fmt == "md":
        if isinstance(d.get("markdown"), str):
            s = d["markdown"]
        elif isinstance(d.get("pages"), list):
            s = "\n\n".join(str((p or {}).get("markdown") or "") for p in d["pages"])
        else:
            s = json.dumps(d, ensure_ascii=False, indent=2)
    elif fmt == "latex":
        if isinstance(d.get("latex"), str):
            s = d["latex"]
        elif isinstance(d.get("pages"), list):
            s = "\n\n".join(str((p or {}).get("latex") or "") for p in d["pages"])
        else:
            s = json.dumps(d, ensure_ascii=False, indent=2)
    else:
        s = json.dumps(d, ensure_ascii=False, indent=2)
    if len(s) > max_chars:
        return s[: max_chars - 80] + "\n\n… [truncated]"
    return s


def _http_exc_payload(exc: HTTPException) -> dict[str, Any]:
    d = exc.detail
    detail = json.dumps(d, ensure_ascii=False) if not isinstance(d, str) else d
    return {"event": "error", "detail": detail, "status": exc.status_code}


async def _uploads_to_sources(
    file: UploadFile | None,
    files: list[UploadFile] | None,
) -> list[tuple[bytes, str | None, str | None]]:
    """Read upload bodies: single legacy ``file`` and/or ``files`` (multiple images/PDFs)."""
    items: list[UploadFile] = []
    if file is not None:
        items.append(file)
    if files:
        items.extend(files)
    out: list[tuple[bytes, str | None, str | None]] = []
    for uf in items:
        raw = await uf.read()
        out.append((raw, uf.filename, uf.content_type))
    return out


async def _ocr_page_producer(
    queue: asyncio.Queue,
    page_idx: int,
    total_pages: int,
    b64: str,
    client: httpx.AsyncClient,
    model: str,
    fmt: OcrFmt,
    think: bool,
    sem: asyncio.Semaphore,
) -> None:
    """Run one page OCR; push Ollama stream chunks to ``queue`` as they arrive."""
    async with sem:
        page_usage: dict[str, Any] = {}
        content_buf: list[str] = []
        page_prompt_base = _prompt_for_ocr_page(fmt, page_idx + 1, total_pages)
        page_prompt = page_prompt_base
        if think:
            page_prompt = page_prompt + "\n\n" + _read_system_prompt("ocr_thinking_hint.md")
        tried_without_think = False
        try:
            while True:
                page_usage = {}
                content_buf = []
                run_think = think and not tried_without_think
                run_prompt = page_prompt if run_think else page_prompt_base
                try:
                    async for kind, piece in _ollama_ocr_one_image_stream(
                        client,
                        model,
                        b64,
                        fmt,
                        run_think,
                        prompt=run_prompt,
                        usage_sink=page_usage,
                    ):
                        if kind == "thinking":
                            await queue.put(("thinking", piece))
                        else:
                            content_buf.append(piece)
                            await queue.put(("content", piece))
                    await queue.put(("done", "".join(content_buf), page_usage))
                    break
                except HTTPException as exc:
                    detail_s = str(exc.detail or "")
                    can_retry_without_think = (
                        run_think
                        and not tried_without_think
                        and exc.status_code == 504
                        and "thinking liên tục" in detail_s
                    )
                    if can_retry_without_think:
                        tried_without_think = True
                        continue
                    raise
        except HTTPException as exc:
            d = exc.detail
            ds = json.dumps(d, ensure_ascii=False) if not isinstance(d, str) else d
            await queue.put(("fail", exc.status_code, ds))
        except Exception as exc:
            await queue.put(("fail", 500, str(exc)))


async def ocr_events_iter(
    sources: list[tuple[bytes, str | None, str | None]],
    fmt: OcrFmt,
    model: str,
    merge: bool,
    think: bool,
) -> AsyncIterator[dict[str, Any]]:
    """OCR event stream: meta → page_start/page_done (per page/image) → complete | error."""
    if not sources:
        yield {"event": "error", "detail": "Không có file.", "status": 400}
        return

    images_b64: list[str] = []
    source_spans: list[tuple[str | None, int, int]] = []
    try:
        for raw, filename, content_type in sources:
            if not raw:
                continue
            start = len(images_b64)
            fn = (filename or "").lower()
            ct = (content_type or "").lower()
            if ct == "application/pdf" or fn.endswith(".pdf"):
                images_b64.extend(_pdf_pages_to_vision_b64_list(raw))
            else:
                images_b64.append(_image_to_vision_b64(raw, content_type))
            source_spans.append((filename, start, len(images_b64)))
    except HTTPException as e:
        yield _http_exc_payload(e)
        return

    if not images_b64:
        yield {"event": "error", "detail": "Không đọc được ảnh/PDF nào.", "status": 400}
        return

    total = len(images_b64)
    yield {
        "event": "meta",
        "total_pages": total,
        "format": fmt,
        "merge": merge,
        "model": model,
        "ollama_think": think,
        "ocr_max_parallel": OCR_MAX_PARALLEL,
        "ollama_keep_alive": _ollama_keep_alive_for_request(),
    }

    parts: list[str] = []
    json_objects: list[Any] = []
    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            sem = asyncio.Semaphore(OCR_MAX_PARALLEL)
            queues: list[asyncio.Queue] = [asyncio.Queue() for _ in images_b64]
            page_workers = [
                asyncio.create_task(
                    _ocr_page_producer(queues[i], i, total, images_b64[i], client, model, fmt, think, sem)
                )
                for i in range(len(images_b64))
            ]
            usage_prompt_total = 0
            usage_completion_total = 0
            try:
                for idx, _b64 in enumerate(images_b64):
                    yield {"event": "page_start", "page": idx + 1, "total_pages": total}
                    header = ""
                    if fmt == "md" and total > 1:
                        header = f"\n\n## Trang {idx + 1}\n\n"
                    elif fmt == "latex" and total > 1:
                        header = f"\n\n% --- Trang {idx + 1} ---\n\n"
                    if header:
                        yield {
                            "event": "delta",
                            "text": header,
                            "page": idx + 1,
                            "total_pages": total,
                        }
                    q = queues[idx]
                    body_text = ""
                    page_usage: dict[str, int] = {}
                    while True:
                        item = await q.get()
                        tag = item[0]
                        if tag == "content":
                            yield {
                                "event": "delta",
                                "text": item[1],
                                "page": idx + 1,
                                "total_pages": total,
                            }
                        elif tag == "thinking":
                            yield {
                                "event": "thinking_delta",
                                "text": item[1],
                                "page": idx + 1,
                                "total_pages": total,
                            }
                        elif tag == "done":
                            body_text = item[1]
                            page_usage = item[2]
                            break
                        elif tag == "fail":
                            status_code, detail = item[1], item[2]
                            for w in page_workers:
                                if not w.done():
                                    w.cancel()
                            with contextlib.suppress(Exception):
                                await asyncio.gather(*page_workers, return_exceptions=True)
                            yield {"event": "error", "detail": detail, "status": int(status_code)}
                            return
                    pt = page_usage.get("prompt_tokens")
                    ct = page_usage.get("completion_tokens")
                    pti = _coerce_nonneg_usage_int(pt)
                    cti = _coerce_nonneg_usage_int(ct)
                    if pti is not None:
                        usage_prompt_total += pti
                    if cti is not None:
                        usage_completion_total += cti
                    if fmt == "latex" and total > 1 and idx > 0:
                        body_text = _strip_latex_outer_document_if_present(body_text)
                    text = header + body_text
                    if fmt == "md":
                        parts.append(text)
                    elif fmt == "latex":
                        parts.append(text)
                    else:
                        cleaned = _strip_json_fence(text)
                        try:
                            json_objects.append(json.loads(cleaned))
                        except json.JSONDecodeError:
                            json_objects.append(
                                {"raw": text, "page": idx + 1, "parse_error": True}
                            )
                    partial_preview = _ocr_partial_preview_text(fmt, merge, model, parts, json_objects)
                    yield {
                        "event": "page_done",
                        "page": idx + 1,
                        "total_pages": total,
                        "usage": {
                            "prompt_tokens": usage_prompt_total,
                            "completion_tokens": usage_completion_total,
                        },
                        "partial_preview": partial_preview,
                    }
                with contextlib.suppress(Exception):
                    await asyncio.gather(*page_workers, return_exceptions=True)
            except BaseException:
                for w in page_workers:
                    if not w.done():
                        w.cancel()
                with contextlib.suppress(Exception):
                    await asyncio.gather(*page_workers, return_exceptions=True)
                raise
        parts_latex_slice = (
            _latex_multipage_strip_end_then_close(parts)
            if fmt == "latex" and len(parts) > 1
            else parts
        )
        zip_entries = _build_source_outputs_for_zip(
            fmt, parts, json_objects, source_spans, parts_latex_slice
        )
        result = _ocr_build_result_dict(fmt, merge, model, parts, json_objects)
        if zip_entries:
            result["source_outputs"] = zip_entries
        result["usage"] = {
            "prompt_tokens": usage_prompt_total,
            "completion_tokens": usage_completion_total,
        }
        yield {
            "event": "complete",
            "result": result,
            "usage": result["usage"],
        }
    except HTTPException as e:
        yield _http_exc_payload(e)
    except Exception as e:
        yield {"event": "error", "detail": str(e), "status": 500}


async def _run_ocr_background_job(
    job_id: str,
    sources: list[tuple[bytes, str | None, str | None]],
    fmt: OcrFmt,
    model: str,
    merge: bool,
    think: bool,
) -> None:
    from backend_ocr.ocr_history_service import persist_ocr_run
    from backend_ocr.ocr_jobs import run_ocr_job

    await run_ocr_job(job_id, sources, fmt, model, merge, think, ocr_events_iter, persist_ocr_run)


async def _gpu_nvidia_smi_data() -> dict[str, Any]:
    """Payload matching ``GET /api/gpu/nvidia-smi`` (dict object, not Response)."""
    ok, text, err, fetched_at = await _nvidia_smi_exec([])
    if not ok:
        return {"ok": False, "error": err, "text": text, "fetched_at": fetched_at}
    return {"ok": True, "text": text, "fetched_at": fetched_at}


async def _gpu_memory_data() -> dict[str, Any]:
    """Payload matching ``GET /api/gpu/memory``."""
    ok, out, err, fetched_at = await _nvidia_smi_exec(
        [
            "--query-gpu=index,name,memory.used,memory.total,utilization.gpu",
            "--format=csv,noheader,nounits",
        ]
    )
    if not ok:
        return {
            "ok": False,
            "error": err,
            "text": out,
            "gpus": [],
            "fetched_at": fetched_at,
        }
    gpus: list[dict[str, Any]] = []
    for row in csv.reader(io.StringIO(out)):
        if len(row) < 4:
            continue
        try:
            idx = int(row[0].strip())
            name = row[1].strip()
            used_mib = int(row[2].strip())
            total_mib = int(row[3].strip())
            util_gpu = 0
            if len(row) > 4 and row[4].strip():
                try:
                    util_gpu = int(row[4].strip().split()[0])
                except ValueError:
                    util_gpu = 0
        except ValueError:
            continue
        gpus.append(
            {
                "index": idx,
                "name": name,
                "used_mib": used_mib,
                "total_mib": total_mib,
                "utilization_gpu": util_gpu,
            }
        )
    if not gpus:
        return {
            "ok": False,
            "error": "Không parse được CSV từ nvidia-smi.",
            "text": out,
            "gpus": [],
            "fetched_at": fetched_at,
        }
    return {"ok": True, "gpus": gpus, "fetched_at": fetched_at}


@app.get("/api/gpu/nvidia-smi")
async def api_nvidia_smi() -> JSONResponse:
    """Run ``nvidia-smi`` on the server; return stdout as text (for realtime UI updates)."""
    return JSONResponse(await _gpu_nvidia_smi_data())


@app.get("/api/gpu/memory")
async def api_gpu_memory() -> JSONResponse:
    """Per-GPU VRAM (MiB) via ``nvidia-smi --query-gpu``."""
    return JSONResponse(await _gpu_memory_data())


@app.get("/api/ollama/models")
async def api_ollama_models() -> JSONResponse:
    """
    Model dropdown: **only** from ``frontend_ocr/config/ocr-models.json`` (does not call Ollama ``/api/tags``).
    """
    preferred, json_default = _load_ocr_models_config()
    models = list(preferred)
    from_json = bool(models)
    if not models:
        models = [DEFAULT_MODEL]

    default = DEFAULT_MODEL
    if json_default and json_default in models:
        default = json_default
    elif DEFAULT_MODEL in models:
        default = DEFAULT_MODEL
    else:
        default = models[0]

    return JSONResponse(
        {
            "ok": from_json,
            "models": models,
            "default": default,
            "source": "ocr-models.json",
        },
    )


@app.websocket("/ws/gpu")
async def ws_gpu(websocket: WebSocket) -> None:
    """
    One-way stream: server sends JSON ``{type, fetched_at, nvidia_smi, memory}`` on an interval.
    Client closes the socket when paused; reconnects when resumed.
    """
    await websocket.accept()
    try:
        while True:
            smi, mem = await asyncio.gather(_gpu_nvidia_smi_data(), _gpu_memory_data())
            tick: dict[str, Any] = {
                "type": "tick",
                "fetched_at": datetime.now(timezone.utc).isoformat(),
                "nvidia_smi": smi,
                "memory": mem,
            }
            await websocket.send_json(tick)
            await asyncio.sleep(GPU_WS_INTERVAL_SEC)
    except WebSocketDisconnect:
        pass
    except Exception:
        with contextlib.suppress(Exception):
            await websocket.close(code=1011)


def _read_index_html() -> str:
    index_path = os.path.join(FRONTEND_OCR_DIR, "index.html")
    if not os.path.isfile(index_path):
        return "<h1>Thiếu frontend_ocr/index.html</h1>"
    with open(index_path, encoding="utf-8") as f:
        return f.read()


@app.get("/", response_class=HTMLResponse)
async def root() -> str:
    return _read_index_html()


@app.get("/history", response_class=HTMLResponse)
async def page_history() -> str:
    return _read_index_html()


@app.get("/config", response_class=HTMLResponse)
async def page_config() -> str:
    return _read_index_html()


def _normalize_config_updates(body: dict[str, Any]) -> dict[str, Any]:
    from backend_ocr.runtime_config import APP_SETTINGS_PERSISTED_KEYS

    out: dict[str, Any] = {}
    for k, raw in body.items():
        if k not in APP_SETTINGS_PERSISTED_KEYS:
            continue
        if raw is None:
            out[k] = None
            continue
        if k in ("OCR_MAX_PARALLEL",):
            try:
                out[k] = max(1, int(raw))
            except (TypeError, ValueError):
                continue
        elif k in ("OCR_MAX_EDGE", "OCR_HISTORY_MAX_INPUT_BYTES"):
            try:
                out[k] = max(0, int(raw))
            except (TypeError, ValueError):
                continue
        elif k == "OCR_JPEG_QUALITY":
            s = str(raw).strip()
            out[k] = s if s else None
        elif k == "OCR_HISTORY_STORE_INPUT_B64":
            out[k] = str(raw).strip().lower() in ("1", "true", "yes", "on")
        elif k == "OLLAMA_THINK":
            out[k] = str(raw).strip().lower() in ("1", "true", "yes", "on")
        elif k in ("OCR_PDF_SCALE", "OLLAMA_TIMEOUT_SEC", "NVIDIA_SMI_TIMEOUT_SEC", "GPU_WS_INTERVAL_SEC"):
            try:
                out[k] = float(raw)
            except (TypeError, ValueError):
                continue
        elif isinstance(raw, str):
            s = raw.strip()
            out[k] = s if s else None
        else:
            out[k] = raw
    return out


@app.get("/api/config")
async def api_config_get() -> JSONResponse:
    from backend_ocr.app_settings import settings_storage_hint
    from backend_ocr.mongo_store import mongo_connection_ok, mongo_enabled
    from backend_ocr.runtime_config import public_config_snapshot, read_app_settings_file_dict

    eff = public_config_snapshot()
    eff["_mongodb_connected"] = "1" if mongo_connection_ok() else "0"
    return JSONResponse(
        {
            "ok": True,
            "effective": eff,
            "settings_storage": settings_storage_hint(),
            "settings_file_keys": sorted(read_app_settings_file_dict().keys()),
            "mongodb_configured": mongo_enabled(),
            "note": "MongoDB connection only via .env. App settings are stored in MongoDB when connected, else data/app_settings.json. Changing CORS_ALLOW_ORIGINS needs a server restart.",
        },
    )


@app.post("/api/config")
async def api_config_post(body: dict[str, Any]) -> JSONResponse:
    from backend_ocr.app_settings import persist_app_settings_updates, refresh_persisted_app_settings_into_environ
    from backend_ocr.mongo_store import mongo_connection_ok, mongo_enabled
    from backend_ocr.runtime_config import public_config_snapshot

    if not isinstance(body, dict):
        raise HTTPException(status_code=400, detail="Expected a JSON object.")
    updates = _normalize_config_updates(body)
    await persist_app_settings_updates(updates)
    load_dotenv(_PROJECT_ROOT / ".env", override=True)
    await refresh_persisted_app_settings_into_environ()
    _sync_settings_from_environ()
    app.title = APP_TITLE
    eff = public_config_snapshot()
    eff["_mongodb_connected"] = "1" if mongo_connection_ok() else "0"
    eff["_mongodb_configured"] = "1" if mongo_enabled() else "0"
    return JSONResponse({"ok": True, "effective": eff, "settings_storage": "mongo" if mongo_connection_ok() else "file"})


def _ollama_think_from_form(raw: str | None) -> bool:
    """Per-request override; empty / missing uses ``OLLAMA_THINK`` from env / persisted settings."""
    if raw is None:
        return OLLAMA_THINK
    s = str(raw).strip().lower()
    if not s:
        return OLLAMA_THINK
    return s in ("1", "true", "yes", "on")


def _parse_ocr_form(output: str, merge_pages: str) -> tuple[OcrFmt, bool]:
    o = output.lower().strip()
    if o in ("md", "markdown"):
        fmt: OcrFmt = "md"
    elif o == "json":
        fmt = "json"
    elif o in ("latex", "tex"):
        fmt = "latex"
    else:
        raise HTTPException(
            status_code=400,
            detail='output phải là "md", "json" hoặc "latex"',
        )
    merge = merge_pages.lower() in ("1", "true", "yes", "on")
    return fmt, merge


@app.post("/api/ocr")
async def api_ocr(
    output: str = Form("md"),
    model: str = Form(DEFAULT_MODEL),
    merge_pages: str = Form("true"),
    ollama_think: str | None = Form(None),
    file: Annotated[UploadFile | None, File()] = None,
    files: Annotated[list[UploadFile] | None, File()] = None,
):
    """
    Upload one or more files: images (png, jpg, …) and/or PDF (order preserved).
    Send repeated ``files`` in multipart, or a single ``file`` (legacy compatibility).
    """
    fmt, merge = _parse_ocr_form(output, merge_pages)
    think = _ollama_think_from_form(ollama_think)
    sources = await _uploads_to_sources(file, files)
    if not sources:
        raise HTTPException(status_code=400, detail="Cần ít nhất một file (ảnh hoặc PDF).")
    final: dict[str, Any] | None = None
    async for ev in ocr_events_iter(sources, fmt, model, merge, think):
        if ev.get("event") == "error":
            raise HTTPException(status_code=int(ev.get("status", 400)), detail=ev.get("detail", "Lỗi"))
        if ev.get("event") == "complete":
            final = ev.get("result")
            break
    if final is None:
        raise HTTPException(status_code=500, detail="OCR không trả kết quả.")
    out_body: dict[str, Any] = dict(final)
    from backend_ocr.ocr_history_service import persist_ocr_run

    hid = await persist_ocr_run(sources, final, fmt, merge)
    if hid:
        out_body["history_id"] = hid
    return JSONResponse(out_body)


@app.post("/api/ocr/stream")
async def api_ocr_stream(
    output: str = Form("md"),
    model: str = Form(DEFAULT_MODEL),
    merge_pages: str = Form("true"),
    ollama_think: str | None = Form(None),
    file: Annotated[UploadFile | None, File()] = None,
    files: Annotated[list[UploadFile] | None, File()] = None,
):
    """Same as ``/api/ocr`` but returns NDJSON: ``meta`` → ``page_*`` → ``complete`` (or ``error``)."""
    fmt, merge = _parse_ocr_form(output, merge_pages)
    think = _ollama_think_from_form(ollama_think)
    sources = await _uploads_to_sources(file, files)
    if not sources:
        raise HTTPException(status_code=400, detail="Cần ít nhất một file (ảnh hoặc PDF).")

    async def ndjson() -> AsyncIterator[bytes]:
        from backend_ocr.ocr_history_service import persist_ocr_run

        async for ev in ocr_events_iter(sources, fmt, model, merge, think):
            if ev.get("event") == "complete" and ev.get("result"):
                hid = await persist_ocr_run(sources, ev["result"], fmt, merge)
                if hid:
                    ev = {**ev, "history_id": hid}
            line = json.dumps(ev, ensure_ascii=False) + "\n"
            yield line.encode("utf-8")

    return StreamingResponse(
        ndjson(),
        media_type="application/x-ndjson; charset=utf-8",
    )


@app.post("/api/ocr/job")
async def api_ocr_job_create(
    background_tasks: BackgroundTasks,
    output: str = Form("md"),
    model: str = Form(DEFAULT_MODEL),
    merge_pages: str = Form("true"),
    ollama_think: str | None = Form(None),
    file: Annotated[UploadFile | None, File()] = None,
    files: Annotated[list[UploadFile] | None, File()] = None,
) -> JSONResponse:
    """
    Start OCR in the background: returns ``job_id`` immediately; poll ``GET /api/ocr/job/{id}`` then
    ``GET /api/ocr/job/{id}/result`` when status is ``done``. State is stored under ``data/ocr_jobs/``.
    """
    from backend_ocr.ocr_jobs import new_job_id

    fmt, merge = _parse_ocr_form(output, merge_pages)
    think = _ollama_think_from_form(ollama_think)
    sources = await _uploads_to_sources(file, files)
    if not sources:
        raise HTTPException(status_code=400, detail="Cần ít nhất một file (ảnh hoặc PDF).")
    job_id = new_job_id()
    background_tasks.add_task(_run_ocr_background_job, job_id, sources, fmt, model, merge, think)
    return JSONResponse({"ok": True, "job_id": job_id})


@app.get("/api/ocr/job/{job_id}")
async def api_ocr_job_status(job_id: str) -> JSONResponse:
    from backend_ocr.ocr_jobs import read_job_state

    st = read_job_state(job_id)
    if not st:
        raise HTTPException(status_code=404, detail="Job not found.")
    return JSONResponse({"ok": True, "job": st})


@app.get("/api/ocr/job/{job_id}/result")
async def api_ocr_job_result(job_id: str) -> JSONResponse:
    from backend_ocr.ocr_jobs import read_job_result, read_job_state

    st = read_job_state(job_id)
    if not st:
        raise HTTPException(status_code=404, detail="Job not found.")
    status = st.get("status")
    if status in ("pending", "running"):
        return JSONResponse({"ok": False, "status": status, "job": st}, status_code=202)
    if status == "error":
        raise HTTPException(
            status_code=int(st.get("http_status") or 500),
            detail=str(st.get("detail") or "OCR job failed."),
        )
    data = read_job_result(job_id)
    if not data:
        raise HTTPException(status_code=404, detail="Result not available.")
    return JSONResponse(data)


@app.get("/api/ocr/history")
async def api_ocr_history(limit: int = 50, skip: int = 0) -> JSONResponse:
    from backend_ocr.ocr_history_service import history_backend_label, list_ocr_runs

    items = await list_ocr_runs(limit=limit, skip=skip)
    return JSONResponse(
        {"ok": True, "items": items, "backend": history_backend_label(), "disabled": False},
    )


@app.get("/api/ocr/history/token-totals")
async def api_ocr_history_token_totals() -> JSONResponse:
    from backend_ocr.ocr_history_service import history_backend_label, sum_history_usage_totals

    t = await sum_history_usage_totals()
    return JSONResponse(
        {
            "ok": True,
            "backend": history_backend_label(),
            "prompt_tokens": t["prompt_tokens"],
            "completion_tokens": t["completion_tokens"],
            "runs_count": t["runs_count"],
        },
    )


@app.get("/api/ocr/history/{history_id}")
async def api_ocr_history_detail(history_id: str) -> JSONResponse:
    from backend_ocr.ocr_history_service import get_ocr_run

    doc = await get_ocr_run(history_id)
    if not doc:
        raise HTTPException(status_code=404, detail="History record not found.")
    return JSONResponse({"ok": True, "record": doc})


app.mount("/assets", StaticFiles(directory=FRONTEND_OCR_DIR), name="assets")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=SERVER_HOST, port=SERVER_PORT)
