#!/usr/bin/env bash
# Khởi tạo lại Git + nhiều commit nhỏ (theo từng file / phần).
# KHÔNG thêm Co-authored-by. Chạy từ thư mục gốc repo: bash scripts/init-split-commits.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REMOTE="${1:-https://github.com/CaoMinhh/local-vision-ocr.git}"

if [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
  echo "Có thay đổi chưa commit. Hãy stash hoặc commit trước." >&2
  exit 1
fi

read -r -p "Xóa .git hiện tại và tạo lại toàn bộ lịch sử? [y/N] " ans
[[ "${ans:-N}" =~ ^[yY]$ ]] || { echo "Đã hủy."; exit 0; }

rm -rf .git
git init -b main

# Chỉnh tên/email committer (đổi cho đúng của bạn)
git config user.name "Tran Cao Minh"
git config user.email "CaoMinhh@users.noreply.github.com"

git remote add origin "$REMOTE"

git add .gitignore
git commit -m "chore(git): add .gitignore for env, venv, caches, data"

git add .env.example
git commit -m "chore(env): add .env.example for Ollama, OCR, MongoDB"

git add requirements.txt
git commit -m "build(deps): add Python requirements"

git add app.py
git commit -m "feat(app): add uvicorn entry point"

git add backend_ocr/__init__.py
git commit -m "feat(backend): add backend_ocr package marker"

git add backend_ocr/runtime_config.py
git commit -m "feat(backend): add runtime config and env loading"

git add backend_ocr/mongo_store.py
git commit -m "feat(backend): add MongoDB store helpers"

git add backend_ocr/app_settings.py
git commit -m "feat(backend): add app settings persistence"

git add backend_ocr/local_ocr_history.py
git commit -m "feat(backend): add local file OCR history"

git add backend_ocr/ocr_history_service.py
git commit -m "feat(backend): add OCR history service"

git add backend_ocr/ocr_jobs.py
git commit -m "feat(backend): add background OCR job queue"

git add backend_ocr/main.py
git commit -m "feat(backend): add FastAPI app, OCR stream, Ollama client"

git add frontend_ocr/config/ocr-models.json
git commit -m "feat(frontend): add OCR model list config"

git add frontend_ocr/css/ocr-app.css
git commit -m "feat(frontend): add OCR app styles"

git add frontend_ocr/index.html
git commit -m "feat(frontend): add OCR SPA shell"

git add frontend_ocr/js/ocr-app.js
git commit -m "feat(frontend): add OCR client logic and i18n"

for f in systems_prompt/*.md; do
  git add "$f"
  git commit -m "docs(prompt): add $(basename "$f")"
done

git add README.md
git commit -m "docs(readme): add project overview and setup"

git add Fig/1.png Fig/2.png Fig/3.png
git commit -m "docs(fig): add README screenshots"

if [[ -f scripts/init-split-commits.sh ]]; then
  git add scripts/init-split-commits.sh
  git commit -m "chore(scripts): add init-split-commits helper"
fi

echo ""
echo "Xong. Lịch sử:"
git log --oneline
echo ""
echo "Push (remote repo mới / trống):"
echo "  git push -u origin main"
