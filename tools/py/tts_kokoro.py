"""Placeholder narration with Kokoro-82M (Apache-2.0), used until the ElevenLabs voice is approved.
Synthesises each script line separately so subtitle cue times are exact.

usage: python -I tts_kokoro.py <lines.json> <out.wav> <timing.json>
env:   KOKORO_MODEL, KOKORO_VOICES (paths), KOKORO_VOICE (default af_heart), KOKORO_SPEED (default 1.0)
lines.json: [{"id": "l1", "text": "...", "pauseAfter": 0.3}, ...]
"""
import json, os, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

SR_OUT = 48000

def main(lines_path, out_wav, timing_path):
    lines = json.load(open(lines_path))
    k = Kokoro(os.environ['KOKORO_MODEL'], os.environ['KOKORO_VOICES'])
    voice = os.environ.get('KOKORO_VOICE', 'af_heart')
    speed = float(os.environ.get('KOKORO_SPEED', '1.0'))
    chunks, timing, t = [], [], float(lines[0].get('leadIn', 0.15)) if lines else 0
    chunks.append(np.zeros(int(t * SR_OUT), dtype=np.float32))
    for ln in lines:
        audio, sr = k.create(ln['text'], voice=voice, speed=speed, lang='en-us')
        audio = trim(audio.astype(np.float32), sr)
        audio = resample(audio, sr, SR_OUT)
        dur = len(audio) / SR_OUT
        timing.append({'id': ln['id'], 'text': ln['text'], 'start': round(t, 3), 'end': round(t + dur, 3)})
        chunks.append(audio)
        pause = float(ln.get('pauseAfter', 0.3))
        chunks.append(np.zeros(int(pause * SR_OUT), dtype=np.float32))
        t += dur + pause
    sf.write(out_wav, np.concatenate(chunks), SR_OUT, subtype='PCM_24')
    json.dump({'voice': voice, 'speed': speed, 'engine': 'kokoro-82m-fp16 (placeholder)', 'duration': round(t, 3), 'lines': timing}, open(timing_path, 'w'), indent=2)
    print(f'{len(lines)} lines, {t:.2f}s → {out_wav}')

def trim(a, sr, thresh=0.01):
    idx = np.where(np.abs(a) > thresh)[0]
    if not len(idx): return a
    pad = int(0.03 * sr)
    return a[max(0, idx[0] - pad): idx[-1] + pad]

def resample(a, sr_in, sr_out):
    if sr_in == sr_out: return a
    n = int(len(a) * sr_out / sr_in)
    return np.interp(np.linspace(0, len(a) - 1, n), np.arange(len(a)), a).astype(np.float32)

if __name__ == '__main__':
    main(*sys.argv[1:4])
