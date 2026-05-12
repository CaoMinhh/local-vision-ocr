"""App settings file path, legacy migration, and public config snapshot (MongoDB only via ``.env``)."""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

_PROJECT_ROOT = Path(__file__).resolve().parent.parent
APP_SETTINGS_JSON_PATH = _PROJECT_ROOT / "data" / "app_settings.json"
LEGACY_RUNTIME_SETTINGS_PATH = _PROJECT_ROOT / "data" / "runtime_settings.json"

# Keys editable in UI / persisted to MongoDB or ``app_settings.json`` (never includes Mongo connection).
APP_SETTINGS_PERSISTED_KEYS: frozenset[str] = frozenset(
    {
        "OLLAMA_HOST",
        "OLLAMA_MODEL",
        "OLLAMA_KEEP_ALIVE",
        "OLLAMA_THINK",
        "OCR_PDF_SCALE",
        "OCR_MAX_PARALLEL",
        "OCR_MAX_EDGE",
        "OCR_JPEG_QUALITY",
        "OLLAMA_TIMEOUT_SEC",
        "NVIDIA_SMI_PATH",
        "NVIDIA_SMI_TIMEOUT_SEC",
        "GPU_WS_INTERVAL_SEC",
        "OCR_HISTORY_STORE_INPUT_B64",
        "OCR_HISTORY_MAX_INPUT_BYTES",
        "CORS_ALLOW_ORIGINS",
        "APP_TITLE",
        "APP_VERSION",
    }
)


def migrate_legacy_runtime_settings_if_needed() -> None:
    """If ``app_settings.json`` is missing, import non-Mongo keys from legacy ``runtime_settings.json``."""
    if APP_SETTINGS_JSON_PATH.is_file():
        return
    if not LEGACY_RUNTIME_SETTINGS_PATH.is_file():
        return
    try:
        with open(LEGACY_RUNTIME_SETTINGS_PATH, encoding="utf-8") as fp:
            data = json.load(fp)
    except (OSError, json.JSONDecodeError):
        return
    if not isinstance(data, dict):
        return
    migrated: dict[str, Any] = {}
    for k, v in data.items():
        if k in APP_SETTINGS_PERSISTED_KEYS and v is not None:
            migrated[k] = v
    if not migrated:
        return
    APP_SETTINGS_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(APP_SETTINGS_JSON_PATH, encoding="utf-8", newline="\n") as fp:
        json.dump(migrated, fp, ensure_ascii=False, indent=2)
        fp.write("\n")


def read_app_settings_file_dict() -> dict[str, Any]:
    if not APP_SETTINGS_JSON_PATH.is_file():
        return {}
    try:
        with open(APP_SETTINGS_JSON_PATH, encoding="utf-8") as fp:
            data = json.load(fp)
    except (OSError, json.JSONDecodeError):
        return {}
    if not isinstance(data, dict):
        return {}
    return {k: v for k, v in data.items() if k in APP_SETTINGS_PERSISTED_KEYS}


def write_app_settings_file_merged(updates: dict[str, Any]) -> None:
    existing = read_app_settings_file_dict()
    for k, v in updates.items():
        if k not in APP_SETTINGS_PERSISTED_KEYS:
            continue
        if v is None or (isinstance(v, str) and not v.strip()):
            existing.pop(k, None)
        elif isinstance(v, bool):
            existing[k] = v
        elif isinstance(v, (int, float)):
            existing[k] = v
        else:
            existing[k] = str(v).strip()
    APP_SETTINGS_JSON_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(APP_SETTINGS_JSON_PATH, encoding="utf-8", newline="\n") as fp:
        json.dump(existing, fp, ensure_ascii=False, indent=2)
        fp.write("\n")


def load_app_settings_file_into_environ() -> None:
    """Apply ``data/app_settings.json`` onto the environment (``.env`` should be loaded first)."""
    data = read_app_settings_file_dict()
    for k, v in data.items():
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


def mask_mongodb_uri(uri: str) -> str:
    if not uri or not uri.strip():
        return ""
    u = uri.strip()
    if "@" not in u:
        return u[:24] + "…" if len(u) > 24 else u
    try:
        scheme, rest = u.split("://", 1)
        if "@" not in rest:
            return scheme + "://****"
        creds, hostpart = rest.rsplit("@", 1)
        if ":" in creds:
            user, _pw = creds.split(":", 1)
            return f"{scheme}://{user}:****@{hostpart}"
        return f"{scheme}://****@{hostpart}"
    except ValueError:
        return "***"


def public_config_snapshot() -> dict[str, str]:
    """Effective string values from the environment for UI (MongoDB fields come only from ``.env``)."""
    snap: dict[str, str] = {}
    for k in sorted(APP_SETTINGS_PERSISTED_KEYS):
        v = os.environ.get(k)
        snap[k] = v if v is not None else ""
    uri = (os.environ.get("MONGODB_URI") or "").strip()
    snap["_mongodb_uri_masked"] = mask_mongodb_uri(uri) if uri else ""
    snap["_mongodb_configured"] = "1" if uri else "0"
    snap["MONGODB_DB_NAME"] = os.environ.get("MONGODB_DB_NAME") or ""
    snap["MONGODB_COLLECTION_OCR"] = os.environ.get("MONGODB_COLLECTION_OCR") or ""
    return snap
