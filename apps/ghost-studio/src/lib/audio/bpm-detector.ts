// apps/ghost-studio/src/lib/audio/bpm-detector.ts
export function estimateBPM(channel: Float32Array, sampleRate: number) {
  // Downsample sencillo para mejor performance
  const ratio = Math.floor(sampleRate / 11025) || 1;
  const down: number[] = [];
  for (let i = 0; i < channel.length; i += ratio) down.push(channel[i]);

  // Onset strength vía diferencia absoluta
  const onsetEnv: number[] = [];
  for (let i = 1; i < down.length; i++) onsetEnv.push(Math.abs(down[i] - down[i - 1]));

  // Simple tempo estimation using autocorrelation
  const minBPM = 60;
  const maxBPM = 200;
  const minPeriod = Math.floor(60 * sampleRate / maxBPM);
  const maxPeriod = Math.floor(60 * sampleRate / minBPM);
  
  let bestBPM = 100;
  let bestScore = 0;

  for (let period = minPeriod; period <= maxPeriod; period++) {
    let score = 0;
    for (let i = period; i < onsetEnv.length; i++) {
      score += onsetEnv[i] * onsetEnv[i - period];
    }
    
    const bpm = 60 * sampleRate / period;
    if (score > bestScore) {
      bestScore = score;
      bestBPM = bpm;
    }
  }

  const confidence = Math.min(1, bestScore / (onsetEnv.length * 0.1));
  return { bpm: bestBPM, confidence };
}
