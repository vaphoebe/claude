# QC report — ep001-ask-ai

Generated 2026-10-31T08:46:26.924Z. Automated checks: **19/19 passed**.

| Check | Result | Detail |
|---|---|---|
| master_clean.mp4: 1080×1920 | ✅ | 1080×1920 |
| master_clean.mp4: 30 fps | ✅ | 30/1 |
| master_clean.mp4: H.264 yuv420p | ✅ | h264 yuv420p |
| master_clean.mp4: AAC 48 kHz stereo | ✅ | aac 48000 2ch |
| master_clean.mp4: duration | ✅ | 65.50s (timeline 65.51s) |
| master_captioned.mp4: 1080×1920 | ✅ | 1080×1920 |
| master_captioned.mp4: 30 fps | ✅ | 30/1 |
| master_captioned.mp4: H.264 yuv420p | ✅ | h264 yuv420p |
| master_captioned.mp4: AAC 48 kHz stereo | ✅ | aac 48000 2ch |
| master_captioned.mp4: duration | ✅ | 65.50s (timeline 65.51s) |
| Integrated loudness ≈ -14 LUFS (±1) | ✅ | -14.7 LUFS |
| True peak ≤ -1 dBTP | ✅ | -1.7 dBTP |
| No black gaps (>0.25 s) | ✅ | none |
| No frozen shots (>2.5 s) | ✅ | none |
| Visual change at least every ~4 s | ✅ | 1 major changes; longest hold 0.0s |
| Subtitles fit 2 lines × 32 chars | ✅ | 37 cues OK |
| Subtitle min duration ~0.8s (±0.1, phrase-timed) | ✅ | OK |
| Subtitles do not overlap | ✅ | OK |
| Crop preview generated | ✅ | renders/ep001-ask-ai/crop-preview.png |

## Crop preview
Rows = moments in the video. Columns: full 9:16 frame with platform UI zones (red), 1:1 crop (orange box), 4:5 crop (blue box); then the 1:1 and 4:5 crops themselves.

## Human review still required
- [ ] Facts and wording match the approved script and source log
- [ ] No third-party logos, trademarks or likenesses
- [ ] Narration voice is the approved licensed voice (placeholder voices must not be published)
- [ ] Music/SFX licence record complete (this pipeline: original, generated in code)
- [ ] AI-content disclosure decision recorded for YouTube and Facebook
- [ ] Owner final approval