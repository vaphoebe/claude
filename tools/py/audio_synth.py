"""Original music bed + sound-effect library, synthesised in code (fully owned, no licences).

Music: calm cinematic A-minor bed — soft pad, plucked arpeggio, sub bass and light
percussion that enter in stages, dip under the key reveal and resolve on the end card.
SFX: short, restrained UI/motion sounds keyed by name (see SFX dict).
"""
import numpy as np
from scipy.signal import lfilter

SR = 48000
rng = np.random.default_rng(7)


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def env(n, a=0.005, d=0.2, s_level=0.0, curve=6.0):
    """Attack then exponential decay envelope of n samples."""
    t = np.arange(n) / SR
    e = np.minimum(1.0, t / max(a, 1e-4))
    e *= np.where(t < a, 1.0, s_level + (1 - s_level) * np.exp(-curve * (t - a) / max(d, 1e-4)))
    return e


def lowpass(x, cutoff):
    """One-pole low-pass with a time-varying cutoff (used for short SFX sweeps)."""
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x, dtype=float); acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def lowpass_fast(x, cutoff, passes=2):
    """Fixed-cutoff one-pole low-pass, applied `passes` times (IIR via scipy)."""
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.asarray(x, dtype=float)
    for _ in range(passes):
        y = lfilter([1 - a], [1, -a], y)
    return y


def highpass_fast(x, cutoff):
    return x - lowpass_fast(x, cutoff, passes=1)


def noise(n):
    return rng.standard_normal(n)


def note_hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


# ---------------------------------------------------------------- reverb
def reverb(stereo, seconds=2.6, wet=0.28):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros_like(stereo)
    for ch in range(2):
        ir = rng.standard_normal(n) * np.exp(-3.2 * t / seconds)
        ir = lowpass_fast(ir, 5200, passes=1)
        ir /= np.sqrt(np.sum(ir ** 2))
        L = len(stereo) + n
        nfft = 1 << (L - 1).bit_length()
        conv = np.fft.irfft(np.fft.rfft(stereo[:, ch], nfft) * np.fft.rfft(ir, nfft), nfft)[:len(stereo)]
        out[:, ch] = conv
    return stereo * (1 - wet) + out * wet * 1.6


# ---------------------------------------------------------------- music
def music(duration, marks):
    """marks: dict with optional 'drums_in', 'drums_out', 'dip', 'resolve' times (s)."""
    n = int(duration * SR)
    L = np.zeros(n); R = np.zeros(n)
    bpm = 96; beat = 60 / bpm; bar = 4 * beat
    prog = [  # (root midi, chord tones) — Am9, Fmaj7, C(add9), Em7
        (45, [57, 60, 64, 71]), (41, [57, 60, 64, 65]), (48, [55, 60, 62, 64]), (40, [55, 59, 62, 64]),
    ]
    resolve = marks.get('resolve', duration)
    chord_len = 2 * bar
    # pad
    t0 = 0.0; k = 0
    while t0 < duration:
        root, tones = prog[k % 4] if t0 < resolve else (48, [55, 60, 64, 67])
        dur = min(chord_len + 1.5, duration - t0)
        m = int(dur * SR); tt = np.arange(m) / SR
        e = np.minimum(1, tt / 1.4) * np.minimum(1, np.maximum(0, (dur - tt) / 1.4))
        for j, tone in enumerate(tones):
            f = note_hz(tone)
            for det, pan in ((-0.0025, 0.75), (0.0025, 0.25)):
                ff = f * (1 + det)
                wave = sum(np.sin(2 * np.pi * ff * h * tt + j) / h ** 1.6 for h in range(1, 6))
                s = int(t0 * SR)
                seg = wave * e * 0.05
                L[s:s + m] += seg * pan; R[s:s + m] += seg * (1 - pan)
        t0 += chord_len; k += 1
    pad_l, pad_r = lowpass_fast(L, 1800), lowpass_fast(R, 1800)

    # arpeggio (enters after the hook)
    arp = np.zeros(n)
    start = marks.get('arp_in', 3.7)
    step = beat / 2; t0 = start; i = 0
    while t0 < duration - 0.5:
        k = int(t0 // chord_len)
        _, tones = prog[k % 4] if t0 < resolve else (48, [55, 60, 64, 67])
        pattern = [0, 2, 1, 3, 2, 1, 3, 2]
        tone = tones[pattern[i % 8]] + 12
        m = int(0.6 * SR); tt = np.arange(m) / SR
        f = note_hz(tone)
        pl = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt * 7) * np.minimum(1, tt / 0.004)
        s = int(t0 * SR); e_ = min(n, s + m)
        vel = 0.75 + 0.25 * ((i % 4) == 0)
        arp[s:e_] += pl[:e_ - s] * 0.045 * vel
        t0 += step; i += 1
    arp = lowpass_fast(arp, 3200, passes=1)

    # sub bass
    sub = np.zeros(n)
    t0 = marks.get('bass_in', 8.7)
    while t0 < duration:
        k = int(t0 // chord_len)
        root = prog[k % 4][0] if t0 < resolve else 48
        dur = min(beat * 2, duration - t0); m = int(dur * SR); tt = np.arange(m) / SR
        s = int(t0 * SR)
        sub[s:s + m] += np.sin(2 * np.pi * note_hz(root) * tt) * np.minimum(1, tt / 0.02) * np.exp(-tt * 1.2) * 0.12
        t0 += beat * 2

    # light percussion
    drums = np.zeros(n)
    din, dout = marks.get('drums_in', 10.7), marks.get('drums_out', duration)
    t0 = din; i = 0
    while t0 < dout:
        s = int(t0 * SR)
        if i % 4 in (0, 2):
            m = int(0.35 * SR); tt = np.arange(m) / SR
            f = 50 + 70 * np.exp(-tt * 30)
            kick = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) * 0.16
            drums[s:s + m] += kick[:max(0, min(m, n - s))]
        m = int(0.06 * SR)
        hat = highpass_fast(noise(m), 7000) * np.exp(-np.arange(m) / SR * 70) * (0.02 if i % 2 else 0.012)
        hs = s + int(beat / 2 * SR)
        if hs + m < n: drums[hs:hs + m] += hat
        t0 += beat; i += 1

    mix = np.stack([pad_l + arp * 0.6 + sub + drums, pad_r + arp * 0.4 + sub + drums], axis=1)
    mix = reverb(mix, 2.8, 0.3)

    # global shape: fade in, dip at the reveal, gentle fade out
    t = np.arange(n) / SR
    g = np.minimum(1, t / 0.8) * np.minimum(1, (duration - t) / 1.2)
    if 'dip' in marks:
        d = marks['dip']
        g *= 1 - 0.65 * np.exp(-((t - d - 0.6) / 0.9) ** 2)
    return mix * g[:, None]


# ---------------------------------------------------------------- sfx
def _fade(x, ms=4):
    k = int(ms / 1000 * SR)
    if len(x) > 2 * k:
        x[:k] *= np.linspace(0, 1, k); x[-k:] *= np.linspace(1, 0, k)
    return x


def sfx_tap():
    m = int(0.12 * SR); t = np.arange(m) / SR
    click = highpass_fast(noise(m), 2500) * np.exp(-t * 180) * 0.5
    body = np.sin(2 * np.pi * 1250 * t) * np.exp(-t * 45) * 0.35
    return _fade(click + body)


def sfx_tick():
    m = int(0.07 * SR); t = np.arange(m) / SR
    return _fade(np.sin(2 * np.pi * 2100 * t) * np.exp(-t * 90) * 0.28 + highpass_fast(noise(m), 5000) * np.exp(-t * 300) * 0.15)


def sfx_blip():
    m = int(0.18 * SR); t = np.arange(m) / SR
    f = 880 + 440 * np.minimum(1, t / 0.05)
    return _fade(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 22) * 0.3)


def sfx_pop():
    m = int(0.22 * SR); t = np.arange(m) / SR
    f = 620 * np.exp(-t * 8) + 300
    return _fade(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 18) * 0.42)


def _sweep_noise(dur, f0, f1, peak=0.5, shape=2.0):
    m = int(dur * SR); t = np.arange(m) / SR
    x = noise(m)
    cut = f0 * (f1 / f0) ** (t / dur)
    y = lowpass(x, cut) - lowpass(x, cut * 0.25)
    e = np.sin(np.pi * np.minimum(1, t / dur)) ** shape
    return _fade(y * e * peak * 3)


def sfx_whoosh():
    return _sweep_noise(0.5, 400, 5200, 0.55)


def sfx_swish():
    return _sweep_noise(0.32, 900, 4200, 0.3)


def sfx_drawer():
    m = int(0.5 * SR); t = np.arange(m) / SR
    x = lowpass(noise(m), np.full(m, 1400)) * (0.6 + 0.4 * np.sin(2 * np.pi * 31 * t))
    e = np.minimum(1, t / 0.05) * np.exp(-t * 4)
    stop = np.zeros(m); s = int(0.42 * SR); k = m - s; tt = np.arange(k) / SR
    stop[s:] = np.sin(2 * np.pi * 140 * tt) * np.exp(-tt * 40) * 0.5
    return _fade(x * e * 0.7 + stop)


def sfx_thud():
    m = int(0.6 * SR); t = np.arange(m) / SR
    f = 55 + 60 * np.exp(-t * 25)
    return _fade(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) * 0.55 + lowpass(noise(m), np.full(m, 600)) * np.exp(-t * 30) * 0.4)


def sfx_impact():
    m = int(2.2 * SR); t = np.arange(m) / SR
    f = 42 + 50 * np.exp(-t * 12)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2) * 0.65
    air = (lowpass(noise(m), np.full(m, 2200)) - lowpass(noise(m), np.full(m, 300))) * np.exp(-t * 3) * 0.25
    tone = sum(np.sin(2 * np.pi * note_hz(n_) * t) for n_ in (57, 64)) * np.exp(-t * 1.4) * 0.05
    return _fade(boom + air + tone)


def sfx_shimmer():
    m = int(1.2 * SR); t = np.arange(m) / SR; y = np.zeros(m)
    for i, n_ in enumerate([76, 79, 83, 88, 91]):
        s = int(i * 0.06 * SR); tt = t[: m - s]
        y[s:] += np.sin(2 * np.pi * note_hz(n_) * tt) * np.exp(-tt * 4.5) * 0.09
    return _fade(y)


def sfx_sparkle():
    m = int(1.4 * SR); t = np.arange(m) / SR; y = np.zeros(m)
    r = np.random.default_rng(3)
    for i in range(14):
        s = int(r.uniform(0, 0.9) * SR); tt = t[: m - s]
        y[s:] += np.sin(2 * np.pi * note_hz(r.choice([81, 84, 88, 91, 93])) * tt) * np.exp(-tt * 14) * 0.06
    return _fade(y)


def sfx_pulse():
    m = int(0.45 * SR); t = np.arange(m) / SR
    y = np.sin(2 * np.pi * 330 * t) * np.exp(-t * 9) * 0.28 + np.sin(2 * np.pi * 660 * t) * np.exp(-t * 14) * 0.12
    return _fade(y)


def sfx_hum():
    m = int(2.6 * SR); t = np.arange(m) / SR
    y = (np.sin(2 * np.pi * 110 * t) * 0.5 + np.sin(2 * np.pi * 220 * t) * 0.2 + lowpass(noise(m), np.full(m, 900)) * 0.4)
    e = np.minimum(1, t / 0.4) * np.minimum(1, (2.6 - t) / 0.6)
    return _fade(y * e * 0.18)


def sfx_powerup():
    m = int(0.9 * SR); t = np.arange(m) / SR
    f = 180 * (4 ** (t / 0.9))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.9) * 0.18
    return _fade(y + _sweep_noise(0.9, 300, 6000, 0.12)[:m])


def sfx_scan():
    m = int(0.6 * SR); t = np.arange(m) / SR
    y = np.sin(2 * np.pi * 1800 * t) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 24 * t))) * np.sin(np.pi * t / 0.6) * 0.07
    return _fade(y)


def sfx_paper():
    m = int(0.7 * SR); t = np.arange(m) / SR
    x = highpass_fast(noise(m), 1800) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 9 * t)))
    return _fade(x * np.sin(np.pi * t / 0.7) * 0.18)


def sfx_rise():
    m = int(1.1 * SR); t = np.arange(m) / SR; y = np.zeros(m)
    for i, n_ in enumerate([69, 72, 76, 79]):
        s = int(i * 0.18 * SR); tt = t[: m - s]
        y[s:] += np.sin(2 * np.pi * note_hz(n_) * tt) * np.exp(-tt * 5) * 0.12
    return _fade(y)


def sfx_confirm():
    m = int(0.9 * SR); t = np.arange(m) / SR; y = np.zeros(m)
    for i, n_ in enumerate([76, 83]):
        s = int(i * 0.09 * SR); tt = t[: m - s]
        y[s:] += (np.sin(2 * np.pi * note_hz(n_) * tt) + 0.25 * np.sin(4 * np.pi * note_hz(n_) * tt)) * np.exp(-tt * 6) * 0.16
    return _fade(y)


def sfx_end_tone():
    m = int(2.5 * SR); t = np.arange(m) / SR
    y = sum(np.sin(2 * np.pi * note_hz(n_) * t) * a for n_, a in ((60, 0.1), (67, 0.07), (72, 0.06), (76, 0.04)))
    return _fade(y * np.minimum(1, t / 0.05) * np.exp(-t * 1.3))


SFX = {
    'tap': sfx_tap, 'tick': sfx_tick, 'blip': sfx_blip, 'pop': sfx_pop, 'whoosh': sfx_whoosh, 'swish': sfx_swish,
    'drawer': sfx_drawer, 'thud': sfx_thud, 'impact': sfx_impact, 'shimmer': sfx_shimmer, 'sparkle': sfx_sparkle,
    'pulse': sfx_pulse, 'hum': sfx_hum, 'powerup': sfx_powerup, 'scan': sfx_scan, 'paper': sfx_paper,
    'rise': sfx_rise, 'confirm': sfx_confirm, 'end_tone': sfx_end_tone,
}
MARKERS = {'music_start', 'music_dip'}
