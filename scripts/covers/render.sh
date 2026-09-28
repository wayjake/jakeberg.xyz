#!/bin/bash
# Render each covers/<name>.html to out/<name>.png (2x) and out/<name>.jpg (1200x630)
set -uo pipefail
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
names=("$@")
if [ ${#names[@]} -eq 0 ]; then
  names=($(ls *.html | sed 's/\.html$//'))
fi
for n in "${names[@]}"; do
  rm -f "out/$n.png"
  # Headless Chrome writes the screenshot and then sometimes never exits, so poll for the file and kill it
  "$CHROME" --headless=new --no-first-run --no-default-browser-check \
    --user-data-dir="$PWD/.profile" --hide-scrollbars \
    --window-size=1200,630 --force-device-scale-factor=2 \
    --allow-file-access-from-files --virtual-time-budget=15000 \
    --screenshot="$PWD/out/$n.png" "file://$PWD/$n.html" >/dev/null 2>&1 &
  pid=$!
  for _ in $(seq 1 60); do
    [ -s "out/$n.png" ] && sleep 0.5 && break
    sleep 0.5
  done
  kill $pid 2>/dev/null; wait $pid 2>/dev/null
  pkill -f "$PWD/.profile" 2>/dev/null
  if [ ! -s "out/$n.png" ]; then echo "$n: FAILED"; continue; fi
  ffmpeg -v error -y -i "out/$n.png" -vf "scale=1200:630:flags=lanczos" -q:v 2 "out/$n.jpg"
  echo "$n: $(sips -g pixelWidth -g pixelHeight "out/$n.png" | awk '/pixel/{printf "%s ", $2}') -> $(du -h "out/$n.jpg" | cut -f1)"
done
