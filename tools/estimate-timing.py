"""Estimated narration timing from a script (used for storyboards before the real voiceover exists).
Pace is calibrated on EP001's ElevenLabs "Brian" take (~3.3 words/s while speaking, ~0.65 s between lines,
~0.4 s between phrases). Replace with measured timing once the audio arrives.

usage: python3 tools/estimate-timing.py <lines.json> <out timing.json>
lines.json: [{"id": "01", "phrases": ["...", "..."]}, ...]
"""
import json, sys

WPS, LINE_GAP, PHRASE_GAP = 3.3, 0.65, 0.4
lines = json.load(open(sys.argv[1]))
t, out = 0.0, []
for ln in lines:
    items = []
    for i, p in enumerate(ln['phrases']):
        d = max(0.7, len(p.split()) / WPS)
        items.append({'text': p, 'start': round(t, 2), 'end': round(t + d, 2)})
        t += d + (PHRASE_GAP if i < len(ln['phrases']) - 1 else LINE_GAP)
    out.append({'id': ln['id'], 'text': ' '.join(ln['phrases']), 'start': items[0]['start'], 'end': items[-1]['end'], 'phrases': items})
json.dump({'estimated': True, 'voice': 'none (estimated timing)', 'duration': round(t, 2), 'lines': out}, open(sys.argv[2], 'w'), indent=1)
print(f'estimated {t:.1f}s, {len(out)} lines')
