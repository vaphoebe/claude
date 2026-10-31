# Technical Plan — Steps 1 & 2

Working name: `{{BRAND_NAME}}` (placeholder; "The Curious Circuit" is not approved — see `02-brand-name-review.md`).
Status: **plan only. Nothing beyond the folder skeleton has been built yet.**
Date: 2026-10-31

---

## Step 1 — Environment review (verified by running commands)

This session runs in an **ephemeral cloud container**, not on your own computer.

| Item | Status |
|---|---|
| OS / hardware | Linux x86_64, 4 CPU cores, 15 GB RAM, about 31 GB free disk |
| Node.js / npm | v22.23.4 / 10.9.9 ✅ |
| Python | 3.13.18 ✅ |
| FFmpeg / ffprobe | 6.1.1 with libx264 + AAC ✅ |
| Headless Chromium + Playwright | Installed and working ✅ |
| ImageMagick | 6.9.12 ✅ |
| Inter font | Installed system-wide (we will still bundle it in the project) ✅ |
| Blender, Inkscape | Not installed. Not needed for the recommended architecture. |
| npm and PyPI registries | Reachable ✅ (GSAP 3.15.0 can be installed) |
| GitHub CLI | Installed, but **the token is invalid**. Work can't be pushed yet. |
| Blocked by the network policy | `api.elevenlabs.io`, `elevenlabs.io`, `www.youtube.com`, `www.facebook.com`, `support.google.com`, `tmsearch.uspto.gov`, `euipo.europa.eu`, `rdap.verisign.com`. DNS lookups for domain checks also fail. |

**What this means**
1. **Persistence:** the container is deleted when it's idle. Every file must be committed to a Git repository to survive. I need a GitHub repo, which you can create or let me attach, and a working GitHub connection.
2. **Narration:** the ElevenLabs API is blocked, so I can't generate real voiceover in this session yet. To fix this, add `api.elevenlabs.io` to the environment's allowed domains, and add `ELEVENLABS_API_KEY` as an environment secret. Docs: https://code.claude.com/docs/en/cloud-environments#network-access
3. **Name research:** I couldn't query trademark databases, registrars, YouTube, or Facebook directly. The name review relies on web search only. Those checks are marked unverified.

---

## Step 2 — Recommended architecture (the simplest reliable option)

**One technology for everything visual:** a TypeScript scene description, rendered with SVG and GSAP inside headless Chromium. Each frame is captured deterministically and FFmpeg encodes the video. There's no Blender, no React, and no cloud renderer.

```
episode.yaml (script beats, timings, scenes)
   │
   ├─► narration: ElevenLabs TTS (with character timestamps) ──► audio/narration.wav + alignment.json
   │
   ├─► scenes/*.ts + character rig (SVG + GSAP timelines, timed to the alignment)
   │        │
   │        ▼
   │   renderer: Playwright opens the page, pauses the GSAP master timeline,
   │   seeks to frame n/30 s, screenshots it, and pipes PNG frames to FFmpeg
   │
   ├─► subtitles: alignment → 2-line chunks → .srt + a burned-in caption layer (optional)
   ├─► audio mix: FFmpeg filtergraph (VO + music ducked under the voice + SFX cues) → -14 LUFS, -1 dBTP
   │
   ▼
renders/: master_clean.mp4 · master_captioned.mp4 · captions.srt · thumbnail.png
quality-control/: crop previews (1:1, 4:5, platform UI overlays) · automated QC report
```

### Component decisions

| Need | Choice | Why |
|---|---|---|
| Character rig | **Hand-built layered SVG**. Each body part is a named group with a pivot point (head, display, eyes, torso, upper/lower arms, hands, pelvis, legs, feet). There's one rig per view (front, ¾, side, back), and expressions are made by swapping the eye and display shapes. | Every episode uses the same rig, so the character can't drift between episodes. It's vector, so it stays sharp at any size. It's text, so changes can be reviewed in Git. |
| Animation | **GSAP 3** timelines. A library of reusable actions (point, walk cycle, present, examine, type, turn, react) plus scene transitions (match cut, shape morph, push-in, reveal, parallax). | It's the industry standard for timeline animation and can jump to any exact frame, which makes rendering repeatable. GSAP is free for commercial use under Webflow's license since 2025. Confirm the license text before launch. |
| Diagrams and motion graphics | SVG components in TypeScript (token stream, data packet, server stack, probability bars) | Same pipeline, same colors. |
| 3D cutaways | Three.js, *only when depth makes a concept clearer*. It runs inside the same browser renderer. | No separate 3D pipeline to maintain. |
| Renderer | **A small custom Playwright + FFmpeg renderer** (about 200 lines of code). Output: 1080×1920, 30 fps, H.264 High, yuv420p, CRF about 16, AAC 192 kbps. | It's small and fully under our control. A 60 s video is 1,800 frames, which I estimate at a few minutes to render. |
| HyperFrames (HeyGen) | Evaluated. It's Apache-2.0 open source and does the same HTML + GSAP → MP4 job. **Kept as a fallback, not the default.** | It works the same way as our renderer but adds an outside dependency we don't need. If our renderer causes trouble, we can switch to it with little rework. |
| Remotion | Not recommended | It requires React and uses a custom source-available license. More complexity for no benefit here. |
| Subtitles | Built from TTS character timestamps. Inter 400, 44 px, #F5F3EE, max 2 lines, centered, lower-middle safe zone, a soft shadow only when needed. Outputs: SRT plus a captioned export. | Captions stay accurately in sync without manual timing. |
| Music | **Original music generated in code** (soft ambient synth beds rendered to WAV), or a licensed library track with its license on file | Original music means we own it outright, with no Content ID claims and no subscription. |
| SFX | Original sounds synthesized in code (clicks, whooshes, soft impacts). Freesound only for CC0 clips, logged. | Same reasons. |
| Thumbnail | The same rig and scene code, rendered as a still at 1080×1920. A 1280×720 variant comes later for long-form. | The thumbnail matches the video exactly. |
| Crop previews | An automatic 1:1 and 4:5 center crop plus approximate YouTube Shorts and Facebook Reels interface overlays, saved as a contact sheet | Catches anything placed too close to the edges. |
| QC | Automated: ffprobe specs, loudness (ebur128), black and frozen frames, subtitle rules (line length, overlap, min/max duration), safe-zone bounding boxes of important elements logged from the page. Then a human checklist (facts, rights, policy, disclosure). | Catches problems before you review each video. |
| Secrets | `ELEVENLABS_API_KEY` in environment variables or `.env` (git-ignored). No keys in code. | |
| Long-form 16:9 | The same scene system with a separate 1920×1080 layout. Built after the vertical system is done. | |

### Narration — text-to-speech options

Prices are from third-party 2026 reporting. **The official ElevenLabs page is blocked here, so check it before buying.**

| Option | Approx. cost | Commercial use | Notes |
|---|---|---|---|
| **ElevenLabs Starter** | ~$6/mo (30k credits ≈ 25–30 min of audio, enough for a few episodes with retakes) | Yes on paid plans. The free plan is **not** licensed for commercial use. Reportedly the license covers audio generated *while subscribed*. | Best quality for natural documentary narration. Returns character timestamps, which our subtitle system uses. Good for the prototype. |
| **ElevenLabs Creator** | ~$22/mo (~100k+ credits) | Yes | Recommended once you publish regularly (about 8–15 shorts a month plus retakes). Also offers higher-quality audio output. |
| Other options worth considering | WellSaid Labs (pricier, clear commercial terms), Microsoft Azure Neural TTS, Google Cloud TTS, OpenAI TTS (pay per use, cheap, less expressive) | Generally yes under paid API terms; check each | Backup options if ElevenLabs terms change. |
| ❌ Not allowed | `edge-tts` and similar free endpoints that scrape a service, voice cloning of any real person | No commercial licence / not permitted | |

Use only a **premade or Voice Design (synthetic) voice**, never a clone of a real person. We'll pick one voice, save its voice ID in the brand config, and lock its settings so the narrator sounds the same every episode.

### AI-content disclosure (summary; the official help pages were blocked, so verify before launch)
- **YouTube:** the "altered or synthetic content" setting is for *realistic* content a viewer could mistake for real people, places, or events. A clearly animated robot with a generic synthetic narrator, explaining facts, likely does **not** require the label. To be safe, I recommend a one-line note in the description: *"Narration voiced with licensed AI text-to-speech."* The bigger risk is YouTube's **inauthentic (mass-produced/repetitive) content** policy. That is why every episode needs original research, an original script, and original animation.
- **Meta (Facebook):** Meta applies "AI info" labels to photorealistic AI video and audio, and requires disclosure for realistic AI content. Our animated content is low-risk, but we'll use the same description note.

### Monetization — an honest expectation check
- **YouTube $10–15+ RPM** is a *long-form* figure for topics like tech, finance, and business. **Shorts are paid from a shared revenue pool, and Shorts RPM is widely reported to be a small fraction of long-form RPM.** I couldn't verify an exact figure. Shorts alone are unlikely to reach that target. That's a reason to move the 16:9 long-form system up the schedule once the vertical pipeline works.
- **Facebook $7+ per 1,000 qualified views:** 2026 third-party reports put typical Reels earnings far lower, mostly in cents per 1,000 views. Meta doesn't publish rates, and eligibility is invite-based with conflicting reported thresholds. Treat $7 as a stretch target, not a plan.
- I won't make revenue predictions. We'll track real numbers from YouTube Studio and Meta's Professional Dashboard.

### Publishing workflow (manual upload, after your approval)
- **YouTube Shorts:** upload in YouTube Studio. Custom thumbnail upload for Shorts has been limited or inconsistent. Normally you choose a frame from the video in the mobile app. So **the thumbnail design will also be the opening frame**, which works with either method. Upload the SRT under Subtitles. Set the disclosure toggle if it's ever needed.
- **Facebook Reels:** upload in Meta Business Suite or the Professional Dashboard. Reels let you upload or choose a cover image. Upload the SRT as captions, or use auto-captions and correct them. Tick the AI label if it ever applies.
- I will never publish or schedule anything. You upload the approved files.

### Estimated costs

| Item | Cost | Required? |
|---|---|---|
| ElevenLabs Starter → Creator | $6 → $22 / month | Yes (narration) |
| GSAP, Playwright, FFmpeg, Node, Inter (SIL Open Font License) | $0 | Yes |
| Music and SFX | $0 if original. A licensed library is optional, about $10–20/month (e.g. Epidemic Sound, Artlist; check that their plan covers monetized YouTube + Facebook). | Optional |
| GitHub private repo | $0 | Yes (persistence) |
| Domain | about $10–25/year | After name approval |
| USPTO trademark application | Federal filing fees, per class; check the current USPTO fee schedule. A professional clearance search or attorney is often $500–2,000+. | Recommended before investing heavily in the brand |
| Claude subscription | What you already pay | Yes |
| **Typical running cost** | **about $6–45/month** | |

---

## What I need from you before Step 5
1. **Approve or adjust this architecture.**
2. **Choose a name** from `02-brand-name-review.md`, or keep using the placeholder for now.
3. **Upload the robot reference image.** If you have vector or layered source files (SVG, AI, PSD), those are better.
4. **Persistence:** give me a GitHub repo for this project and fix the GitHub connection (the current token is invalid).
5. **Narration access:** allow `api.elevenlabs.io` in the environment's network settings and add `ELEVENLABS_API_KEY` as a secret, after you choose and buy a plan. Until then, the prototype can only be built silent, or with a clearly labelled placeholder voice.
