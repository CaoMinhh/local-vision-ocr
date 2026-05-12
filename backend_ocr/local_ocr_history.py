"""File-backed OCR history when MongoDB is unavailable (``data/ocr_history.json``)."""

from __future__ import annotations

import copy
import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

_PROJECT_ROOT = Path(__file__).resolve().parent.parent
LOCAL_HISTORY_PATH = _PROJECT_ROOT / "data" / "ocr_history.json"


def _dt_iso_utc(dt: datetime) -> str:
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()


def _read_all_sync() -> list[dict[str, Any]]:
    if not LOCAL_HISTORY_PATH.is_file():
        return []
    try:
        with open(LOCAL_HISTORY_PATH, encoding="utf-8") as fp:
            data = json.load(fp)
    except (OSError, json.JSONDecodeError):
        return []
    if not isinstance(data, list):
        return []
    return [x for x in data if isinstance(x, dict)]


def _write_all_sync(items: list[dict[str, Any]]) -> None:
    LOCAL_HISTORY_PATH.parent.mkdir(parents=True, exist_ok=True)
    tmp = LOCAL_HISTORY_PATH.with_suffix(".json.tmp")
    with open(tmp, "w", encoding="utf-8", newline="\n") as fp:
        json.dump(items, fp, ensure_ascii=False, indent=2)
        fp.write("\n")
    tmp.replace(LOCAL_HISTORY_PATH)


def _serialize_for_file(doc: dict[str, Any], lid: str) -> dict[str, Any]:
    d = copy.deepcopy(doc)
    d["_id"] = lid
    ca = d.get("created_at")
    if isinstance(ca, datetime):
        d["created_at"] = _dt_iso_utc(ca)
    return d


def _deserialize_created_at(d: dict[str, Any]) -> None:
    ca = d.get("created_at")
    if isinstance(ca, str) and ca:
        try:
            raw = ca.replace("Z", "+00:00")
            d["created_at"] = datetime.fromisoformat(raw)
        except ValueError:
            pass


def append_run(doc: dict[str, Any]) -> str:
    lid = str(uuid.uuid4())
    row = _serialize_for_file(doc, lid)
    items = _read_all_sync()
    items.append(row)
    _write_all_sync(items)
    return lid


def list_runs(limit: int = 50, skip: int = 0) -> list[dict[str, Any]]:
    items = _read_all_sync()

    def sort_key(x: dict[str, Any]) -> str:
        ca = x.get("created_at")
        return ca if isinstance(ca, str) else ""

    items.sort(key=sort_key, reverse=True)
    limit = max(1, min(200, limit))
    skip = max(0, skip)
    slice_ = items[skip : skip + limit]
    out: list[dict[str, Any]] = []
    for d in slice_:
        e = copy.deepcopy(d)
        for inp in e.get("inputs") or []:
            if isinstance(inp, dict):
                inp.pop("content_base64", None)
        names = ", ".join((str(i.get("filename") or "") or "(unnamed)") for i in (e.get("inputs") or []))
        e["input_summary"] = names[:800] if names else "—"
        out.append(e)
    return out


def get_run(rid: str) -> dict[str, Any] | None:
    for d in _read_all_sync():
        if str(d.get("_id")) == rid:
            e = copy.deepcopy(d)
            _deserialize_created_at(e)
            if isinstance(e.get("created_at"), datetime):
                e["created_at"] = _dt_iso_utc(e["created_at"])
            return e
    return None


def replace_all_runs(items: list[dict[str, Any]]) -> None:
    _write_all_sync(items)


def count_runs() -> int:
    return len(_read_all_sync())


def read_all_runs_sync() -> list[dict[str, Any]]:
    return _read_all_sync()


def _nonneg_usage_int(v: Any) -> int:
    if v is None or isinstance(v, bool):
        return 0
    if isinstance(v, int):
        return max(0, v)
    if isinstance(v, float):
        if v != v or v in (float("inf"), float("-inf")):
            return 0
        return max(0, int(v))
    if isinstance(v, str) and v.strip().lstrip("-").isdigit():
        try:
            return max(0, int(v.strip()))
        except ValueError:
            return 0
    return 0


def sum_usage_totals_sync() -> dict[str, int]:
    """Sum token fields from every file-backed history row (same rules as Mongo aggregation)."""
    pt_total = 0
    ct_total = 0
    n = 0
    for row in _read_all_sync():
        if not isinstance(row, dict):
            continue
        n += 1
        u_top = row["usage"] if isinstance(row.get("usage"), dict) else {}
        r = row.get("result")
        u_res = r["usage"] if isinstance(r, dict) and isinstance(r.get("usage"), dict) else {}

        def _pick(key: str) -> int:
            if key in u_top and u_top[key] is not None:
                return _nonneg_usage_int(u_top[key])
            return _nonneg_usage_int(u_res.get(key))

        pt_total += _pick("prompt_tokens")
        ct_total += _pick("completion_tokens")
    return {"prompt_tokens": pt_total, "completion_tokens": ct_total, "runs_count": n}
