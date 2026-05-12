"""Async MongoDB helpers for persisting OCR runs (Motor)."""

from __future__ import annotations

import base64
import copy
import json
import os
import uuid
from datetime import datetime, timezone
from typing import Any

from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection, AsyncIOMotorDatabase

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None
_mongo_connection_ok: bool = False


def mongo_enabled() -> bool:
    return bool((os.environ.get("MONGODB_URI") or "").strip())


def mongo_connection_ok() -> bool:
    return _mongo_connection_ok


def get_mongo_db() -> AsyncIOMotorDatabase | None:
    return _db


def get_mongo_collection() -> AsyncIOMotorCollection | None:
    return _collection()


def _db_name() -> str:
    return (os.environ.get("MONGODB_DB_NAME") or "nemotron3_ocr").strip() or "nemotron3_ocr"


def _collection_name() -> str:
    return (os.environ.get("MONGODB_COLLECTION_OCR") or "ocr_runs").strip() or "ocr_runs"


def _collection() -> AsyncIOMotorCollection | None:
    if _db is None:
        return None
    return _db[_collection_name()]


async def mongo_connect() -> None:
    global _client, _db, _mongo_connection_ok
    _mongo_connection_ok = False
    uri = (os.environ.get("MONGODB_URI") or "").strip()
    if not uri:
        if _client is not None:
            _client.close()
        _client, _db = None, None
        return
    client = AsyncIOMotorClient(uri)
    try:
        await client.admin.command("ping")
    except Exception:
        client.close()
        _client, _db = None, None
        return
    _client = client
    _db = client[_db_name()]
    _mongo_connection_ok = True
    coll = _collection()
    if coll is not None:
        await coll.create_index([("created_at", -1)])


async def mongo_disconnect() -> None:
    global _client, _db, _mongo_connection_ok
    _mongo_connection_ok = False
    if _client is not None:
        _client.close()
    _client, _db = None, None


def _env_truthy(key: str, default: bool = True) -> bool:
    raw = (os.environ.get(key) or "").strip().lower()
    if not raw:
        return default
    return raw in ("1", "true", "yes", "on")


def _history_max_input_raw_bytes() -> int:
    try:
        return max(0, int(os.environ.get("OCR_HISTORY_MAX_INPUT_BYTES", "6000000")))
    except ValueError:
        return 6_000_000


def _approx_bson_json_bytes(doc: dict[str, Any]) -> int:
    try:
        return len(json.dumps(doc, default=str).encode("utf-8"))
    except (TypeError, ValueError):
        return 0


def _shrink_inputs_base64_for_cap(doc: dict[str, Any], max_bytes: int = 14_000_000) -> None:
    """Drop largest input base64 blobs until JSON estimate fits under MongoDB ~16MB BSON limit."""
    guard = 0
    while _approx_bson_json_bytes(doc) > max_bytes and guard < 64:
        guard += 1
        inputs = doc.get("inputs") or []
        best_i = -1
        best_len = 0
        for i, inp in enumerate(inputs):
            b = inp.get("content_base64")
            if isinstance(b, str) and len(b) > best_len:
                best_len = len(b)
                best_i = i
        if best_i < 0:
            break
        inputs[best_i]["content_base64"] = None
        inputs[best_i]["input_omit_reason"] = (
            "pdf_document_cap" if inputs[best_i].get("is_pdf") else "document_size_cap"
        )


def inputs_payload_from_sources(sources: list[tuple[bytes, str | None, str | None]]) -> list[dict[str, Any]]:
    """Metadata + optional standard base64 of each original upload (image or whole PDF file)."""
    store_b64 = _env_truthy("OCR_HISTORY_STORE_INPUT_B64", True)
    max_raw = _history_max_input_raw_bytes()
    out: list[dict[str, Any]] = []
    for raw, fn, ct in sources:
        if not raw:
            continue
        fn_l = (fn or "").lower()
        ct_l = (ct or "").lower()
        is_pdf = ct_l == "application/pdf" or fn_l.endswith(".pdf")
        item: dict[str, Any] = {
            "filename": fn or "",
            "content_type": ct or "",
            "size_bytes": len(raw),
            "is_pdf": is_pdf,
            "content_base64": None,
        }
        if not store_b64:
            item["input_omit_reason"] = "disabled"
        elif max_raw <= 0:
            item["input_omit_reason"] = "size_limit"
        elif len(raw) > max_raw:
            item["input_omit_reason"] = "pdf_size_limit" if is_pdf else "size_limit"
        else:
            item["content_base64"] = base64.standard_b64encode(raw).decode("ascii")
        out.append(item)
    return out


def _rendered_page_count(result: dict[str, Any]) -> int:
    pages = result.get("pages")
    if isinstance(pages, list) and pages:
        return len(pages)
    return 1


def _dt_iso_utc(dt: datetime) -> str:
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()


def build_ocr_run_document(
    sources: list[tuple[bytes, str | None, str | None]],
    result: dict[str, Any],
    fmt: str,
    merge: bool,
) -> dict[str, Any]:
    return {
        "created_at": datetime.now(timezone.utc),
        "ocr_id": str(uuid.uuid4()),
        "format": fmt,
        "merge_pages": merge,
        "model": result.get("model") or "",
        "inputs": inputs_payload_from_sources(sources),
        "rendered_pages": _rendered_page_count(result),
        "result": copy.deepcopy(result),
    }


async def insert_ocr_run_document(doc: dict[str, Any]) -> str | None:
    coll = _collection()
    if coll is None:
        return None
    doc = copy.deepcopy(doc)
    _shrink_inputs_base64_for_cap(doc)
    ins = await coll.insert_one(doc)
    return str(ins.inserted_id)


async def insert_ocr_run(
    sources: list[tuple[bytes, str | None, str | None]],
    result: dict[str, Any],
    fmt: str,
    merge: bool,
) -> str | None:
    doc = build_ocr_run_document(sources, result, fmt, merge)
    return await insert_ocr_run_document(doc)


async def list_ocr_runs(limit: int = 50, skip: int = 0) -> list[dict[str, Any]]:
    coll = _collection()
    if coll is None:
        return []
    limit = max(1, min(200, limit))
    skip = max(0, skip)
    projection = {
        "created_at": 1,
        "ocr_id": 1,
        "model": 1,
        "format": 1,
        "merge_pages": 1,
        "inputs": 1,
        "rendered_pages": 1,
    }
    cursor = coll.find({}, projection=projection).sort("created_at", -1).skip(skip).limit(limit)
    items: list[dict[str, Any]] = []
    async for d in cursor:
        d["_id"] = str(d["_id"])
        ca = d.get("created_at")
        if isinstance(ca, datetime):
            d["created_at"] = _dt_iso_utc(ca)
        for inp in d.get("inputs") or []:
            inp.pop("content_base64", None)
        names = ", ".join((str(i.get("filename") or "") or "(unnamed)") for i in (d.get("inputs") or []))
        d["input_summary"] = names[:800] if names else "—"
        items.append(d)
    return items


async def sum_ocr_runs_usage_totals() -> dict[str, int]:
    """
    Sum ``prompt_tokens`` / ``completion_tokens`` across all documents.

    Supports both top-level ``usage`` and nested ``result.usage`` (persisted OCR payload).
    """
    coll = _collection()
    if coll is None:
        return {"prompt_tokens": 0, "completion_tokens": 0, "runs_count": 0}

    def _as_int(v: Any) -> int:
        if v is None or isinstance(v, bool):
            return 0
        if isinstance(v, int):
            return max(0, v)
        if isinstance(v, float):
            if v != v or v in (float("inf"), float("-inf")):
                return 0
            return max(0, int(v))
        return 0

    pipeline: list[dict[str, Any]] = [
        {
            "$project": {
                "pt": {
                    "$ifNull": [
                        "$usage.prompt_tokens",
                        {"$ifNull": ["$result.usage.prompt_tokens", 0]},
                    ]
                },
                "ct": {
                    "$ifNull": [
                        "$usage.completion_tokens",
                        {"$ifNull": ["$result.usage.completion_tokens", 0]},
                    ]
                },
            }
        },
        {
            "$group": {
                "_id": None,
                "prompt_tokens": {
                    "$sum": {
                        "$convert": {
                            "input": "$pt",
                            "to": "double",
                            "onError": 0.0,
                            "onNull": 0.0,
                        }
                    }
                },
                "completion_tokens": {
                    "$sum": {
                        "$convert": {
                            "input": "$ct",
                            "to": "double",
                            "onError": 0.0,
                            "onNull": 0.0,
                        }
                    }
                },
                "runs_count": {"$sum": 1},
            }
        },
    ]
    cur = coll.aggregate(pipeline)
    rows = await cur.to_list(length=1)
    if not rows:
        return {"prompt_tokens": 0, "completion_tokens": 0, "runs_count": 0}
    d0 = rows[0]
    return {
        "prompt_tokens": _as_int(d0.get("prompt_tokens")),
        "completion_tokens": _as_int(d0.get("completion_tokens")),
        "runs_count": _as_int(d0.get("runs_count")),
    }


async def get_ocr_run(oid_str: str) -> dict[str, Any] | None:
    coll = _collection()
    if coll is None:
        return None
    try:
        oid = ObjectId(oid_str)
    except InvalidId:
        return None
    d = await coll.find_one({"_id": oid})
    if not d:
        return None
    d["_id"] = str(d["_id"])
    ca = d.get("created_at")
    if isinstance(ca, datetime):
        d["created_at"] = _dt_iso_utc(ca)
    return d
