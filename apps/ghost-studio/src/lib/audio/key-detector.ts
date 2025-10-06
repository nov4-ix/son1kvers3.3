// apps/ghost-studio/src/lib/audio/key-detector.ts
// Detector de tonalidad súper simple basado en histogramas de pitch class
const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'] as const;

export function detectKey(channel: Float32Array, sampleRate: number) {
  // FFT rápida y sucia por ventanas (no-precisa pero útil para MVP)
  const size = 4096, hop = 2048;
  const hist = new Array(12).fill(0);

  for (let i = 0; i + size <= channel.length; i += hop) {
    const frame = channel.slice(i, i + size);
    // Hanning + naive DFT para 12 bins equivalentes a pitch classes
    for (let k = 0; k < 12; k++) {
      let re = 0, im = 0;
      const freq = 55 * Math.pow(2, k / 12); // ancla baja
      const omega = 2 * Math.PI * freq / sampleRate;
      for (let n = 0; n < frame.length; n++) {
        const w = 0.5 - 0.5 * Math.cos(2 * Math.PI * n / (frame.length - 1));
        const x = frame[n] * w;
        re += x * Math.cos(omega * n);
        im += -x * Math.sin(omega * n);
      }
      hist[k] += Math.sqrt(re * re + im * im);
    }
  }
  const idx = hist.indexOf(Math.max(...hist));
  const key = NOTE_NAMES[idx];
  const scale = 'major' as const; // MVP (mejorar con perfiles Krumhansl)
  return { key, scale };
}
