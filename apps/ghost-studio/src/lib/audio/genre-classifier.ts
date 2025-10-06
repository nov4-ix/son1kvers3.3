// apps/ghost-studio/src/lib/audio/genre-classifier.ts
export function classifyGenre({ bpm, energy, spectralCentroid }: { bpm: number; energy: number; spectralCentroid: number }) {
  // Heurísticas muy simples para MVP
  let genre = 'pop';
  if (bpm > 150 && energy > 0.7) genre = 'edm';
  else if (bpm < 90 && spectralCentroid < 1500) genre = 'r&b';
  else if (energy > 0.8 && spectralCentroid > 2500) genre = 'rock';
  else if (bpm >= 85 && bpm <= 110 && spectralCentroid < 2000) genre = 'hip-hop';
  const genreConfidence = 0.6;
  return { genre, genreConfidence };
}
