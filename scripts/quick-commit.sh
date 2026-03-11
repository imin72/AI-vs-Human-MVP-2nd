#!/usr/bin/env bash
set -euo pipefail

if [[ $# -eq 0 ]]; then
  echo "Usage: npm run commit:quick -- \"<commit message>\" [--skip-build]"
  exit 1
fi

SKIP_BUILD=false
ARGS=()
for arg in "$@"; do
  if [[ "$arg" == "--skip-build" ]]; then
    SKIP_BUILD=true
  else
    ARGS+=("$arg")
  fi
done

COMMIT_MSG="${ARGS[*]}"

if [[ -z "$COMMIT_MSG" ]]; then
  echo "Error: commit message is required."
  exit 1
fi

if ! $SKIP_BUILD; then
  echo "[quick-commit] Running build check..."
  npm run -s build
fi

if [[ -z "$(git status --porcelain)" ]]; then
  echo "[quick-commit] No changes to commit."
  exit 1
fi

echo "[quick-commit] Staging changes..."
git add -A

echo "[quick-commit] Committing..."
git commit -m "$COMMIT_MSG"

echo "[quick-commit] Done."
