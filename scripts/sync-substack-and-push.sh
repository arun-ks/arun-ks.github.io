#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cache_file="src/data/substack-posts.json"

cd "$repo_root"

if [[ "$(git branch --show-current)" != "main" ]]; then
  echo "Substack sync must run from the main branch." >&2
  exit 1
fi

if ! git diff --quiet -- "$cache_file" || ! git diff --cached --quiet -- "$cache_file"; then
  echo "$cache_file already has local changes; refusing to overwrite them." >&2
  exit 1
fi

git pull --ff-only origin main

SUBSTACK_SYNC_STRICT=true npm run sync:writing

if git diff --quiet -- "$cache_file"; then
  echo "Substack article cache is already current."
  exit 0
fi

npm test
git add -- "$cache_file"
git commit -m "Refresh Substack article cache"
git push origin main

