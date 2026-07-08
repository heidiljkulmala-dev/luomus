#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

export PATH="/Users/heidikulmala/Projects/.node-tools/node-v22.16.0-darwin-arm64/bin:$PATH"

if command -v lsof >/dev/null 2>&1; then
  PIDS=$(lsof -ti tcp:3000 -sTCP:LISTEN 2>/dev/null || true)
  if [ -n "${PIDS}" ]; then
    echo "Stopping process(es) on port 3000: ${PIDS}"
    kill ${PIDS} 2>/dev/null || true
    sleep 1
  fi
fi

exec npm run dev
