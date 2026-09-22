#!/usr/bin/env bash
# Stamp content-hash versions onto local CSS/JS references in every HTML file so
# browsers/CDNs re-fetch only when a file actually changes. Run before deploy:
#   ./version-assets.sh && git add -A && git commit ...
set -euo pipefail
cd "$(dirname "$0")"

# assets to version: <path>  (add more here as needed)
assets=("css/rotting.css" "js/rotting.js")

for asset in "${assets[@]}"; do
  [ -f "$asset" ] || { echo "skip (missing): $asset"; continue; }
  hash=$(md5sum "$asset" | cut -c1-10)
  esc=${asset//\//\\/}   # escape slashes for sed
  for html in *.html; do
    [ -f "$html" ] || continue
    # match href="asset" or src="asset" with an optional existing ?v=...
    sed -i -E "s/((href|src)=\"${esc})(\?v=[a-f0-9]+)?\"/\1?v=${hash}\"/g" "$html"
  done
  echo "${asset}  ->  ?v=${hash}"
done
