#!/usr/bin/env bash
# split-commits.sh — Commit từng file một theo Conventional Commits
# Sử dụng: bash scripts/split-commits.sh
set -euo pipefail

# ── Cấu hình remote (điền token cá nhân vào đây) ──────────────────────────
GITHUB_TOKEN="${GITHUB_TOKEN:-}"   # export GITHUB_TOKEN=ghp_xxx trước khi chạy
REPO_URL="https://${GITHUB_TOKEN}@github.com/CaoMinhh/local-vision-ocr.git"

# ── Kiểm tra token ─────────────────────────────────────────────────────────
if [[ -z "$GITHUB_TOKEN" ]]; then
  echo "❌  Chưa set GITHUB_TOKEN. Chạy: export GITHUB_TOKEN=ghp_xxx"
  exit 1
fi

# ── Đặt remote (thêm nếu chưa có) ─────────────────────────────────────────
if git remote get-url origin &>/dev/null; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

# ══════════════════════════════════════════════════════════════════════════
# Danh sách commit: (file  "message theo Conventional Commits")
# Thứ tự: infra/config → backend → frontend → docs/prompts → assets
# ══════════════════════════════════════════════════════════════════════════
declare -a FILES=(
  ".gitignore"
  ".env.example"
  "requirements.txt"
  "LICENSE"
  "app.py"
  "backend_ocr/__init__.py"
  "backend_ocr/app_settings.py"
  "backend_ocr/runtime_config.py"
  "backend_ocr/mongo_store.py"
  "backend_ocr/ocr_history_service.py"
  "backend_ocr/local_ocr_history.py"
  "backend_ocr/ocr_jobs.py"
  "backend_ocr/main.py"
  "frontend_ocr/config/ocr-models.json"
  "frontend_ocr/css/ocr-app.css"
  "frontend_ocr/js/ocr-app.js"
  "frontend_ocr/index.html"
  "systems_prompt/ocr_json.md"
  "systems_prompt/ocr_markdown.md"
  "systems_prompt/ocr_latex.md"
  "systems_prompt/ocr_latex_multipage_first.md"
  "systems_prompt/ocr_latex_multipage_following.md"
  "systems_prompt/ocr_thinking_hint.md"
  "systems_prompt/latex_preamble_hint.md"
  "systems_prompt/spelling_hint.md"
  "systems_prompt/structure_visual_elements_hint.md"
  "scripts/init-split-commits.sh"
  "scripts/split-commits.sh"
  "Fig/1.png"
  "Fig/2.png"
  "Fig/3.png"
  "README.md"
)

declare -A MESSAGES=(
  [".gitignore"]="chore: add .gitignore for Python, venv, env secrets and editor files"
  [".env.example"]="chore: add .env.example with required environment variable templates"
  ["requirements.txt"]="chore: add Python dependency list (requirements.txt)"
  ["LICENSE"]="chore: add MIT license"
  ["app.py"]="feat: add FastAPI entry point that mounts backend and frontend"
  ["backend_ocr/__init__.py"]="feat(backend): expose backend_ocr package init"
  ["backend_ocr/app_settings.py"]="feat(backend): add Pydantic-based application settings loader"
  ["backend_ocr/runtime_config.py"]="feat(backend): add runtime config singleton for dynamic model selection"
  ["backend_ocr/mongo_store.py"]="feat(backend): add MongoDB async store for OCR history persistence"
  ["backend_ocr/ocr_history_service.py"]="feat(backend): add OCR history service with CRUD operations"
  ["backend_ocr/local_ocr_history.py"]="feat(backend): add local JSON-file fallback store for OCR history"
  ["backend_ocr/ocr_jobs.py"]="feat(backend): add async OCR job runner with model routing logic"
  ["backend_ocr/main.py"]="feat(backend): add FastAPI router with OCR endpoints and history API"
  ["frontend_ocr/config/ocr-models.json"]="feat(frontend): add OCR model configuration manifest"
  ["frontend_ocr/css/ocr-app.css"]="feat(frontend): add full application stylesheet with dark-mode support"
  ["frontend_ocr/js/ocr-app.js"]="feat(frontend): add OCR client app with upload, polling and result rendering"
  ["frontend_ocr/index.html"]="feat(frontend): add main HTML shell for OCR web application"
  ["systems_prompt/ocr_json.md"]="feat(prompts): add system prompt for structured JSON OCR output"
  ["systems_prompt/ocr_markdown.md"]="feat(prompts): add system prompt for Markdown OCR output"
  ["systems_prompt/ocr_latex.md"]="feat(prompts): add system prompt for LaTeX OCR output"
  ["systems_prompt/ocr_latex_multipage_first.md"]="feat(prompts): add system prompt for first page of multi-page LaTeX OCR"
  ["systems_prompt/ocr_latex_multipage_following.md"]="feat(prompts): add system prompt for subsequent pages of multi-page LaTeX OCR"
  ["systems_prompt/ocr_thinking_hint.md"]="feat(prompts): add thinking-mode hint for OCR reasoning improvement"
  ["systems_prompt/latex_preamble_hint.md"]="feat(prompts): add LaTeX preamble hint for consistent document structure"
  ["systems_prompt/spelling_hint.md"]="feat(prompts): add spelling correction hint for OCR post-processing"
  ["systems_prompt/structure_visual_elements_hint.md"]="feat(prompts): add hint for structuring visual elements in OCR output"
  ["scripts/init-split-commits.sh"]="chore(scripts): add initial split-commits helper script"
  ["scripts/split-commits.sh"]="chore(scripts): add automated per-file conventional-commit push script"
  ["Fig/1.png"]="docs(fig): add screenshot 1 for README illustration"
  ["Fig/2.png"]="docs(fig): add screenshot 2 for README illustration"
  ["Fig/3.png"]="docs(fig): add screenshot 3 for README illustration"
  ["README.md"]="docs: add project README with setup and usage instructions"
)

# ══════════════════════════════════════════════════════════════════════════
# Vòng lặp commit từng file
# ══════════════════════════════════════════════════════════════════════════
for FILE in "${FILES[@]}"; do
  if [[ ! -e "$FILE" ]]; then
    echo "⚠️   Bỏ qua (không tồn tại): $FILE"
    continue
  fi
  MSG="${MESSAGES[$FILE]:-"chore: add $FILE"}"
  git add "$FILE"
  # Chỉ commit nếu có thay đổi trong staging
  if git diff --cached --quiet; then
    echo "⏭️   Bỏ qua (không có thay đổi): $FILE"
  else
    git commit -m "$MSG"
    echo "✅  Committed: $FILE"
    echo "    → $MSG"
  fi
done

# ══════════════════════════════════════════════════════════════════════════
# Push lên remote
# ══════════════════════════════════════════════════════════════════════════
echo ""
echo "🚀  Đang push lên origin/main..."
git push -u origin main

echo ""
echo "📋  Git log (10 commit gần nhất):"
git log --oneline -20
