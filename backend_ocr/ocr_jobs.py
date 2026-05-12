"""Background OCR jobs: state on disk under ``data/ocr_jobs/`` (works across uvicorn workers)."""

from __future__ import annotations

import asyncio
import json
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

_PROJECT_ROOT = Path(__file__).resolve().parent.parent
JOBS_DIR = _PROJECT_ROOT / "data" / "ocr_jobs"

_job_run_sem = asyncio.Semaphore(max(1, int(os.environ.get("OCR_BACKGROUND_MAX_CONCURRENT", "2"))))


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _job_paths(job_id: str) -> tuple[Path, Path]:
    safe = job_id.replace("/", "").replace("..", "")[:80]
    return JOBS_DIR / f"{safe}.json", JOBS_DIR / f"{safe}_result.json"


def write_job_state(job_id: str, state: dict[str, Any]) -> None:
    JOBS_DIR.mkdir(parents=True, exist_ok=True)
    path, _ = _job_paths(job_id)
    state = {**state, "updated_at": _utc_now_iso()}
    tmp = path.with_suffix(".json.tmp")
    with open(tmp, "w", encoding="utf-8", newline="\n") as fp:
        json.dump(state, fp, ensure_ascii=False, indent=2)
        fp.write("\n")
    tmp.replace(path)


def read_job_state(job_id: str) -> dict[str, Any] | None:
    path, _ = _job_paths(job_id)
    if not path.is_file():
        return None
    try:
        with open(path, encoding="utf-8") as fp:
            data = json.load(fp)
    except (OSError, json.JSONDecodeError):
        return None
    return data if isinstance(data, dict) else None


def read_job_result(job_id: str) -> dict[str, Any] | None:
    _, rpath = _job_paths(job_id)
    if not rpath.is_file():
        return None
    try:
        with open(rpath, encoding="utf-8") as fp:
            return json.load(fp)
    except (OSError, json.JSONDecodeError):
        return None


def write_job_result(job_id: str, result: dict[str, Any]) -> None:
    _, rpath = _job_paths(job_id)
    JOBS_DIR.mkdir(parents=True, exist_ok=True)
    tmp = rpath.with_suffix(".json.tmp")
    with open(tmp, "w", encoding="utf-8", newline="\n") as fp:
        json.dump(result, fp, ensure_ascii=False, indent=2)
        fp.write("\n")
    tmp.replace(rpath)


def new_job_id() -> str:
    return str(uuid.uuid4())


def _first_source_label(sources: list[tuple[bytes, str | None, str | None]]) -> str:
    if not sources:
        return ""
    _b, fn, _ct = sources[0]
    return (fn or "").strip() or "(upload)"


async def run_ocr_job(
    job_id: str,
    sources: list[tuple[bytes, str | None, str | None]],
    fmt: Any,
    model: str,
    merge: bool,
    think: bool,
    ocr_events_iter: Any,
    persist_ocr_run: Any,
) -> None:
    """Run ``ocr_events_iter``; update disk state; persist history on success."""
    label = _first_source_label(sources)
    total_pages = 0
    current_page = 0
    last_partial_preview: str | None = None

    def snapshot_running(usage: dict[str, Any] | None = None) -> None:
        d: dict[str, Any] = {
            "job_id": job_id,
            "status": "running",
            "label": label,
            "page": current_page,
            "total_pages": total_pages,
            "model": model,
            "format": str(fmt),
            "merge_pages": merge,
            "detail": None,
        }
        if usage is not None:
            d["usage"] = usage
        if last_partial_preview:
            d["partial_preview"] = last_partial_preview
        write_job_state(job_id, d)

    write_job_state(
        job_id,
        {
            "job_id": job_id,
            "status": "pending",
            "label": label,
            "page": 0,
            "total_pages": 0,
            "model": model,
            "format": str(fmt),
            "merge_pages": merge,
            "detail": None,
        },
    )

    async with _job_run_sem:
        snapshot_running()
        final: dict[str, Any] | None = None
        err_status = 500
        err_detail: str | None = None
        try:
            async for ev in ocr_events_iter(sources, fmt, model, merge, think):
                et = ev.get("event")
                if et == "meta":
                    total_pages = int(ev.get("total_pages") or 0)
                    current_page = 0
                    snapshot_running()
                elif et == "page_start":
                    current_page = int(ev.get("page") or 0)
                    total_pages = int(ev.get("total_pages") or total_pages)
                    snapshot_running()
                elif et == "page_done":
                    current_page = int(ev.get("page") or current_page)
                    total_pages = int(ev.get("total_pages") or total_pages)
                    usage = ev.get("usage") if isinstance(ev.get("usage"), dict) else None
                    pv = ev.get("partial_preview")
                    if isinstance(pv, str) and pv.strip():
                        last_partial_preview = pv
                    snapshot_running(usage)
                elif et == "complete":
                    res = ev.get("result")
                    final = res if isinstance(res, dict) else None
                    if final:
                        write_job_result(job_id, final)
                        hid = await persist_ocr_run(sources, final, str(fmt), merge)
                        if hid:
                            final = {**final, "history_id": hid}
                            write_job_result(job_id, final)
                elif et == "error":
                    err_status = int(ev.get("status") or 500)
                    d = ev.get("detail")
                    err_detail = d if isinstance(d, str) else json.dumps(d, ensure_ascii=False)
                    break
        except Exception as e:
            err_detail = str(e)

        if err_detail is not None:
            write_job_state(
                job_id,
                {
                    "job_id": job_id,
                    "status": "error",
                    "label": label,
                    "page": current_page,
                    "total_pages": total_pages,
                    "detail": err_detail,
                    "http_status": err_status,
                    "model": model,
                    "format": str(fmt),
                    "merge_pages": merge,
                },
            )
            return

        if final is None:
            write_job_state(
                job_id,
                {
                    "job_id": job_id,
                    "status": "error",
                    "label": label,
                    "page": current_page,
                    "total_pages": total_pages,
                    "detail": "OCR không trả kết quả.",
                    "http_status": 500,
                    "model": model,
                    "format": str(fmt),
                    "merge_pages": merge,
                },
            )
            return

        usage = final.get("usage") if isinstance(final.get("usage"), dict) else {}
        write_job_state(
            job_id,
            {
                "job_id": job_id,
                "status": "done",
                "label": label,
                "page": total_pages,
                "total_pages": total_pages,
                "model": model,
                "format": str(fmt),
                "merge_pages": merge,
                "usage": usage,
                "detail": None,
            },
        )
