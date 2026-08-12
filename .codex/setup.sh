#!/usr/bin/env bash
# Codex environment setup entry point. Keep the actual installation logic shared
# with Cursor Cloud so both hosted environments receive identical dependencies.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

exec bash "$ROOT/scripts/install-cloud-deps.sh"
