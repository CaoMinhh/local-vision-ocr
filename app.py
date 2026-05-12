"""Entry point at repo root: ``python app.py``.

Run from the directory that contains both this file and the ``backend_ocr/`` package
(so ``import backend_ocr.main`` resolves). Equivalent to ``python -m backend_ocr.main``.
"""

from __future__ import annotations

if __name__ == "__main__":
    import uvicorn

    from backend_ocr.main import SERVER_HOST, SERVER_PORT, app

    uvicorn.run(app, host=SERVER_HOST, port=SERVER_PORT)
