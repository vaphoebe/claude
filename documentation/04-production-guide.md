# Production guide

How an episode goes from topic to publish-ready files. Every step that needs a human is marked **(approval)**. Nothing is published automatically.

## Folder layout
```
brand/brand.config.json   locked colors, type, subtitle spec, safe areas, narration voice
brand/fonts/              Inter Regular (SIL OFL)
character/rig/            approved robot rig, expressions, poses — shared by all episodes
animations/actions.js     reusable robot actions (point, walk, react, type, wave…)
scenes/components.js      basic diagram parts (chat card, token row, bars…)
scenes/fx.js              cinematic parts (glows, bokeh, glass, neon, globe, corridor, chip, network)
templates/                stage, subtitle renderer, storyboard + thumbnail templates
tools/                    renderers, cue export, QC, build script; tools/py = TTS + audio
research/                 per-episode source logs
episodes/<slug>/          script, lines.json, storyboard.js, episode.js, audio/, build/
renders/<slug>/           master_clean.mp4, master_captioned.mp4, captions.srt, thumbnail.png, QC
```

## Workflow per episode
1. **Topic → research.** Make `research/<slug>-sources.md`. Cross-check each significant claim against 2 independent sources. Never invent sources or numbers.
2. **Script** (`episodes/<slug>/script.md`, about 150–170 words for 60 s, plus 3 hook options). **(approval)**
3. **Storyboard.** Write `storyboard.js` and render it: `node tools/render-page.mjs templates/storyboard.html episodes/<slug>/storyboard.png`. **(approval)**
4. **Narration.** In ElevenLabs, use the locked voice and settings from `brand.config.json`. Export WAV, or the highest-bitrate MP3. Put it in `episodes/<slug>/audio/source/`, convert it to 48 kHz `audio/narration.wav`, and write `audio/narration.timing.json`: one entry per script line with start/end and optional `phrases` (see EP001). Find the line boundaries with `ffmpeg -i file -af silencedetect=noise=-38dB:d=0.25 -f null -`.
5. **Animation.** Write `episodes/<slug>/episode.js`. Anchor every beat to `at(lineId, fraction)` so the animation re-times automatically when the voiceover changes. Reuse rig actions and fx parts, but design the scenes for the episode. Each episode needs original visuals, not a template swap.
6. **Build:** `PYTHON=<venv python> tools/build-episode.sh episodes/<slug>`. This runs cues/captions export, original music + SFX mix, two-pass loudness to -14 LUFS / -1.5 dBTP, clean and captioned masters, crop previews and the QC report.
7. **Thumbnail:** render `templates/thumbnail-<slug>.html` with `tools/render-still.mjs`.
8. **Human QC + final approval** using `renders/<slug>/qc-report.md`. **(approval)**
9. **Publishing** is manual, done by the owner. See below.

## Quick commands
- Preview the animation live in a browser: serve the repo root and open `/episodes/<slug>/composition.html?play`.
- Spot-check frames: `node tools/contact-sheet.mjs episodes/<slug>/composition.html out.png 1,5,10,20 4`.
- Render part of the video: `node tools/render-video.mjs episodes/<slug>/composition.html out.mp4 --from 10 --to 20`.

## Python environment (audio)
`python3 -m venv .venv && .venv/bin/pip install numpy scipy soundfile` (plus `kokoro-onnx` only for placeholder voices). Run with `PYTHON=.venv/bin/python`.

## Publishing notes
- **YouTube Shorts:** upload `master_clean.mp4`, then add `captions.srt` under Subtitles. Shorts covers are normally picked from a video frame. The opening frame is designed to work as the cover. The "altered or synthetic content" setting is meant for realistic content. Record the decision per episode, and include the narration note in the description: "Narration voiced with licensed AI text-to-speech."
- **Facebook Reels:** upload `master_clean.mp4`, upload `thumbnail.png` as the cover, and add the SRT or reviewed auto-captions. Use the same description note.
- If the platform's own captions aren't used, upload `master_captioned.mp4` instead.

## Troubleshooting
| Problem | Fix |
|---|---|
| `Composition errors` when rendering | Open the composition with `?play` in a browser and check the console. Usually it's a typo in episode.js or a missing file path. |
| Element appears in the top-left corner | `st.node()` owns the element's transform. Pass `x`/`y` in its init instead of a `transform` attribute. |
| Captions break awkwardly | Adjust the phrase splits in `narration.timing.json`, or tune `buildCues` in `templates/subtitles.js`. |
| Music too loud or quiet | Change the duck levels in `tools/py/mix.py` (currently -10 dB, ducking to -17 dB under the voice). Check the stems in `build/stems/`. |
| Loudness QC fails | Re-run the build. The loudness pass is two-pass, so check `mix_raw.wav` for clipping. |
| Slow renders | About 3 fps at 1080×1920 with full effects. Use `--from/--to` for previews. |
| Placeholder TTS returns silence for a sentence | Known Kokoro quirk with some contractions. The tool retries with the contraction expanded. |
| Blocked hosts (ElevenLabs, YouTube…) | Add them to the environment's allowed domains in the cloud environment settings. |
