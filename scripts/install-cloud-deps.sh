#!/usr/bin/env bash
# Cursor Cloud Agent install script (idempotent).
# Runs on every agent boot via .cursor/environment.json
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
export PATH="${HOME}/.bun/bin:${HOME}/.local/bin:${PATH}"

echo "==> [1/2] Project dependencies (Bun)"

if ! command -v bun >/dev/null 2>&1; then
  echo "==> Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  export PATH="${HOME}/.bun/bin:${PATH}"
fi

if [[ -f bun.lock ]]; then
  bun install
elif [[ -f package-lock.json ]]; then
  npm install --legacy-peer-deps
else
  bun install
fi

echo "==> [2/2] seoscout (https://github.com/libin257/seoscout)"
bash "$ROOT/scripts/setup-seoscout.sh"

echo "==> Cloud install complete."
