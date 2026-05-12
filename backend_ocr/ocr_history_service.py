"""OCR run history: MongoDB when connected, else local JSON file; migrate file → Mongo on connect."""

from __future__ import annotations

import asyncio
import copy
import uuid
from datetime import datetime, timezone
from typing import Any

from backend_ocr import local_ocr_history


def _use_mongo_for_history() -> bool:
    from backend_ocr.mongo_store import mongo_connection_ok

    return mongo_connection_ok()


async def persist_ocr_run(
    sources: list[tuple[bytes, str | None, str | None]],
    result: dict[str, Any],
    fmt: str,
    merge: bool,
) -> str | None:
    from backend_ocr.mongo_store import build_ocr_run_document, insert_ocr_run_document

    result_for_store = copy.deepcopy(result)
    result_for_store.pop("source_outputs", None)
    doc = build_ocr_run_document(sources, result_for_store, fmt, merge)
    if _use_mongo_for_history():
        return await insert_ocr_run_document(doc)
    return await asyncio.to_thread(local_ocr_history.append_run, doc)


async def list_ocr_runs(limit: int = 50, skip: int = 0) -> list[dict[str, Any]]:
    from backend_ocr.mongo_store import list_ocr_runs as mongo_list

    if _use_mongo_for_history():
        return await mongo_list(limit=limit, skip=skip)
    return await asyncio.to_thread(local_ocr_history.list_runs, limit, skip)


async def get_ocr_run(rid: str) -> dict[str, Any] | None:
    from backend_ocr.mongo_store import get_ocr_run as mongo_get

    if _use_mongo_for_history():
        return await mongo_get(rid)
    return await asyncio.to_thread(local_ocr_history.get_run, rid)


async def sum_history_usage_totals() -> dict[str, int]:
    """Aggregate ``usage`` across all stored OCR runs (Mongo or local file)."""
    from backend_ocr.mongo_store import sum_ocr_runs_usage_totals

    if _use_mongo_for_history():
        return await sum_ocr_runs_usage_totals()
    return await asyncio.to_thread(local_ocr_history.sum_usage_totals_sync)


async def migrate_file_history_to_mongodb_if_needed() -> int:
    """Insert local file history into MongoDB (dedupe by ``local_history_id``). Returns migrated count."""
    from backend_ocr.mongo_store import (
        get_mongo_collection,
        insert_ocr_run_document,
        mongo_connection_ok,
    )

    if not mongo_connection_ok():
        return 0
    coll = get_mongo_collection()
    if coll is None:
        return 0
    await coll.create_index("local_history_id", unique=False, sparse=True)

    raw_items = await asyncio.to_thread(local_ocr_history.read_all_runs_sync)
    if not raw_items:
        return 0

    remaining: list[dict[str, Any]] = []
    migrated = 0
    for row in raw_items:
        lid = str(row.get("_id") or "")
        if not lid:
            remaining.append(row)
            continue
        exists = await coll.find_one({"local_history_id": lid})
        if exists:
            migrated += 1
            continue
        doc = copy.deepcopy(row)
        doc.pop("_id", None)
        if not (isinstance(doc.get("ocr_id"), str) and doc["ocr_id"].strip()):
            doc["ocr_id"] = str(uuid.uuid4())
        ca = doc.get("created_at")
        if isinstance(ca, str) and ca:
            try:
                doc["created_at"] = datetime.fromisoformat(ca.replace("Z", "+00:00"))
            except ValueError:
                doc["created_at"] = datetime.now(timezone.utc)
        elif not isinstance(ca, datetime):
            doc["created_at"] = datetime.now(timezone.utc)
        doc["local_history_id"] = lid
        try:
            await insert_ocr_run_document(doc)
            migrated += 1
        except Exception:
            remaining.append(row)
    if len(remaining) != len(raw_items):
        await asyncio.to_thread(local_ocr_history.replace_all_runs, remaining)
    return migrated


def history_backend_label() -> str:
    return "mongo" if _use_mongo_for_history() else "file"
