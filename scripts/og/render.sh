#!/bin/sh
# Renders scripts/og/og.html to public/og-image.png (1200×630), the share image every page links (src/lib/metadata.ts).
# Run on macOS: the heading's brand word uses Georgia, a system font the site cannot ship, so the image is
# rendered once here and committed as a static file instead of being generated during the build.
set -eu
cd "$(dirname "$0")/../.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
OUT="$(pwd)/public/og-image.png"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --allow-file-access-from-files --virtual-time-budget=3000 \
  --window-size=1200,630 --screenshot="$OUT" "file://$(pwd)/scripts/og/og.html" >/dev/null 2>&1
echo "Wrote $OUT"
