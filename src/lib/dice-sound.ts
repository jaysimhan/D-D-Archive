/**
 * The clatter the roller makes, synthesised rather than shipped: a handful of
 * short noise bursts through a bandpass is close enough to dice on a table,
 * and it keeps an audio file out of the bundle.
 */

let context: AudioContext | null = null;
let noise: AudioBuffer | null = null;

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

/** Built on the first roll, because browsers only allow it after a gesture. */
function ensureContext(): AudioContext | null {
    if (context) return context;
    if (typeof window === "undefined") return null;

    const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
    if (!Ctor) return null;

    try {
        context = new Ctor();
    } catch {
        // Autoplay policy, a locked-down browser, no output device — any of
        // them just means this roll is a silent one.
        return null;
    }

    const seconds = 0.2;
    noise = context.createBuffer(1, Math.floor(context.sampleRate * seconds), context.sampleRate);
    const samples = noise.getChannelData(0);
    for (let i = 0; i < samples.length; i++) {
        // Decaying white noise: the bite of a die landing, then nothing.
        samples[i] = (Math.random() * 2 - 1) * (1 - i / samples.length);
    }

    return context;
}

/** One die-on-wood tick at `at`, pitched by `tone` and faded over `length`. */
function tick(ctx: AudioContext, at: number, tone: number, length: number, level: number): void {
    if (!noise) return;

    const source = ctx.createBufferSource();
    source.buffer = noise;
    source.playbackRate.value = 0.8 + Math.random() * 0.6;

    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = tone;
    band.Q.value = 1.4;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(level, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + length);

    source.connect(band).connect(gain).connect(ctx.destination);
    source.start(at);
    source.stop(at + length);
}

/**
 * Plays a tumble whose length tracks the number of dice, so a fistful of d6s
 * rattles longer than a lone d20 — capped, so 99 dice do not go on for a
 * minute.
 */
export function playDiceSound(diceCount = 1): void {
    const ctx = ensureContext();
    if (!ctx) return;

    if (ctx.state === "suspended") void ctx.resume();

    const ticks = Math.min(8, 2 + Math.floor(diceCount / 2));
    const now = ctx.currentTime;

    for (let i = 0; i < ticks; i++) {
        const at = now + i * (0.035 + Math.random() * 0.045);
        // Later bounces sit lower and quieter, the way a settling die does.
        tick(ctx, at, 1400 + Math.random() * 1800 - i * 90, 0.05 + Math.random() * 0.05, 0.28 - i * 0.02);
    }
}
