"""Build the episode soundtrack: narration + original music (ducked under the voice) + SFX cues.
Writes a 48 kHz stereo WAV (pre-loudness) plus a stems folder for later re-balancing.

usage: python -I mix.py <narration.wav> <cues.json> <out.wav> <duration_s>
"""
import json, os, sys
import numpy as np, soundfile as sf
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import audio_synth as A

SR = A.SR
DB = lambda d: 10 ** (d / 20)


def main(vo_path, cues_path, out_path, duration):
    duration = float(duration)
    n = int(duration * SR)
    vo, sr = sf.read(vo_path, dtype='float64', always_2d=True)
    assert sr == SR, f'narration must be {SR} Hz'
    vo = vo.mean(axis=1)
    vo = np.pad(vo, (0, max(0, n - len(vo))))[:n]
    cues = json.load(open(cues_path))
    marks = {'resolve': next((c['time'] for c in cues if c['name'] == 'end_tone'), duration) - 0.1}
    dip = next((c['time'] for c in cues if c['name'] == 'music_dip'), None)
    if dip: marks['dip'] = dip; marks['drums_out'] = dip

    music = A.music(duration, marks)

    # side-chain ducking from the narration envelope (fast attack, slow release)
    win = int(0.03 * SR)
    rms = np.sqrt(np.convolve(vo ** 2, np.ones(win) / win, mode='same'))
    gate = (rms > 0.012).astype(float)
    env = np.empty(n); acc = 0.0
    att, rel = np.exp(-1 / (0.05 * SR)), np.exp(-1 / (0.45 * SR))
    for i in range(n):
        a = att if gate[i] > acc else rel
        acc = a * acc + (1 - a) * gate[i]
        env[i] = acc
    duck = DB(-10) * (1 - env) + DB(-17) * env
    music *= duck[:, None]

    sfx = np.zeros((n, 2))
    for i, c in enumerate(cues):
        if c['name'] in A.MARKERS: continue
        x = A.SFX[c['name']]()
        s = int(c['time'] * SR)
        if s >= n: continue
        x = x[: n - s] * c.get('gain', 1) * DB(-9)
        pan = 0.5 + 0.12 * np.sin(i * 2.3)  # gentle, deterministic stereo spread
        sfx[s:s + len(x), 0] += x * (1 - pan) * 1.4
        sfx[s:s + len(x), 1] += x * pan * 1.4
    sfx = A.reverb(sfx, 1.4, 0.18)

    voice = np.stack([vo, vo], axis=1) * DB(-1)
    mix = voice + music + sfx
    peak = np.abs(mix).max()
    if peak > 0.98: mix *= 0.98 / peak
    stems = os.path.join(os.path.dirname(out_path), 'stems'); os.makedirs(stems, exist_ok=True)
    for name, x in (('voice', voice), ('music', music), ('sfx', sfx)):
        sf.write(os.path.join(stems, f'{name}.wav'), x.astype(np.float32), SR, subtype='PCM_24')
    sf.write(out_path, mix.astype(np.float32), SR, subtype='PCM_24')
    print(f'mixed {duration:.2f}s, {sum(c["name"] not in A.MARKERS for c in cues)} sfx cues → {out_path}')


if __name__ == '__main__':
    main(*sys.argv[1:5])
