#!/usr/bin/env bash
# Build an episode end to end: cues + captions → soundtrack → loudness → clean & captioned
# masters → crop previews → QC report. Usage: tools/build-episode.sh episodes/<slug>
# Needs: PYTHON (venv with numpy, scipy, soundfile) — defaults to python3.
set -euo pipefail
EP=${1:?episode folder}; ROOT=$(cd "$(dirname "$0")/.." && pwd); cd "$ROOT"
PY=${PYTHON:-python3}; B=$EP/build; OUT=renders/$(basename "$EP"); mkdir -p "$B" "$OUT"
COMP=$EP/composition.html

echo "▸ cues + captions"; node tools/export-cues.mjs "$COMP" "$B"
DUR=$(cat "$B/duration.txt")
echo "▸ soundtrack"; "$PY" -I tools/py/mix.py "$EP/audio/narration.wav" "$B/cues.json" "$B/mix_raw.wav" "$DUR"
echo "▸ loudness (-14 LUFS, -1.5 dBTP, two-pass)"
M=$(ffmpeg -hide_banner -i "$B/mix_raw.wav" -af loudnorm=I=-14:TP=-2:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
j() { echo "$M" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -hide_banner -loglevel error -y -i "$B/mix_raw.wav" -af "loudnorm=I=-14:TP=-2:LRA=11:measured_I=$(j input_i):measured_TP=$(j input_tp):measured_LRA=$(j input_lra):measured_thresh=$(j input_thresh):offset=$(j target_offset):linear=true" -ar 48000 "$B/mix.wav"
cp "$B/captions.srt" "$OUT/captions.srt"
echo "▸ render captioned"; node tools/render-video.mjs "$COMP?captions=1" "$OUT/master_captioned.mp4" --audio "$B/mix.wav"
echo "▸ render clean master"; node tools/render-video.mjs "$COMP?captions=0" "$OUT/master_clean.mp4" --audio "$B/mix.wav"
echo "▸ crop previews + QC"; node tools/qc.mjs "$EP" "$OUT"
