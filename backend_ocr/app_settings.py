"""Persisted app settings (Ollama, OCR, …): MongoDB when connected, else ``data/app_settings.json``."""

from __future__ import annotations

import json
import os
from typing import Any

from backend_ocr.runtime_config import (
    APP_SETTINGS_PERSISTED_KEYS,
    read_app_settings_file_dict,
    write_app_settings_file_merged,
)


def _app_settings_collection_name() -> str:
    return (os.environ.get("MONGODB_COLLECTION_APP_SETTINGS") or "ocr_app_settings").strip() or "ocr_app_settings"


def _settings_coll():
    from backend_ocr.mongo_store import get_mongo_db

    db = get_mongo_db()
    if db is None:
        return None
    return db[_app_settings_collection_name()]


async def read_app_settings_from_mongo() -> dict[str, Any]:
    coll = _settings_coll()
    if coll is None:
        return {}
    doc = await coll.find_one({"_id": "singleton"})
    if not doc:
        return {}
    v = doc.get("values")
    return dict(v) if isinstance(v, dict) else {}


async def write_app_settings_to_mongo(updates: dict[str, Any]) -> None:
    coll = _settings_coll()
    if coll is None:
        return
    cur = await read_app_settings_from_mongo()
    for k, v in updates.items():
        if k not in APP_SETTINGS_PERSISTED_KEYS:
            continue
        if v is None or (isinstance(v, str) and not v.strip()):
            cur.pop(k, None)
        elif isinstance(v, bool):
            cur[k] = v
        elif isinstance(v, (int, float)):
            cur[k] = v
        else:
            cur[k] = str(v).strip()
    await coll.update_one(
        {"_id": "singleton"},
        {"$set": {"values": cur}},
        upsert=True,
    )


def _apply_values_to_environ(values: dict[str, Any]) -> None:
    for k, v in values.items():
        if k not in APP_SETTINGS_PERSISTED_KEYS:
            continue
        if v is None:
            continue
        if isinstance(v, bool):
            os.environ[k] = "1" if v else "0"
        elif isinstance(v, (int, float)):
            os.environ[k] = str(v)
        else:
            s = str(v).strip()
            if s:
                os.environ[k] = s


async def refresh_persisted_app_settings_into_environ() -> None:
    """Overlay ``app_settings.json`` then MongoDB (if connected) onto ``os.environ``."""
    from backend_ocr.mongo_store import mongo_connection_ok

    file_vals = read_app_settings_file_dict()
    _apply_values_to_environ(file_vals)
    if mongo_connection_ok():
        db_vals = await read_app_settings_from_mongo()
        _apply_values_to_environ(db_vals)


async def ensure_app_settings_seeded_in_mongo() -> None:
    """If Mongo is up and has no settings doc, copy current JSON file into Mongo once."""
    from backend_ocr.mongo_store import mongo_connection_ok

    if not mongo_connection_ok():
        return
    coll = _settings_coll()
    if coll is None:
        return
    existing = await coll.find_one({"_id": "singleton"})
    if existing:
        return
    file_vals = read_app_settings_file_dict()
    if not file_vals:
        return
    clean = {k: v for k, v in file_vals.items() if k in APP_SETTINGS_PERSISTED_KEYS}
    if not clean:
        return
    await coll.insert_one({"_id": "singleton", "values": clean})


async def persist_app_settings_updates(updates: dict[str, Any]) -> str:
    """Write updates to Mongo if connected, else to JSON file. Returns ``\"mongo\"`` or ``\"file\"``."""
    from backend_ocr.mongo_store import mongo_connection_ok

    if mongo_connection_ok():
        await write_app_settings_to_mongo(updates)
        return "mongo"
    write_app_settings_file_merged(updates)
    return "file"


def settings_storage_hint() -> str:
    from backend_ocr.mongo_store import mongo_connection_ok

    return "mongo" if mongo_connection_ok() else "file"
