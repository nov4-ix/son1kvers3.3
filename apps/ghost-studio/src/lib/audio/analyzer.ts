// apps/ghost-studio/src/lib/audio/analyzer.ts
import Meyda from 'meyda';
import { estimateBPM } from './bpm-detector';
import { detectKey } from './key-detector';
import { classifyGenre } from './genre-classifier';
import type { AudioAnalysis } from '../../types/audio';

export const audioAnalyzer = {
  async analyzeFile(buffer: AudioBuffer): Promise<AudioAnalysis> {
    const sampleRate = buffer.sampleRate;
    const channel = buffer.getChannelData(0);

    // 1) BPM
    const { bpm, confidence } = estimateBPM(channel, sampleRate);

    // 2) Key
    const { key, scale } = detectKey(channel, sampleRate);

    // 3) Features con Meyda
    const frameSize = 2048;
    const hopSize = 1024;
    let energyAcc = 0, specCentroidAcc = 0, frames = 0, zcrAcc = 0;

    for (let i = 0; i + frameSize <= channel.length; i += hopSize) {
      const frame = channel.slice(i, i + frameSize);
      const features = Meyda.extract(['rms', 'spectralCentroid', 'zcr'], frame);
      if (!features) continue;
      energyAcc += features.rms ?? 0;
      specCentroidAcc += features.spectralCentroid ?? 0;
      zcrAcc += features.zcr ?? 0;
      frames++;
    }

    const energy = frames ? Math.min(1, energyAcc / frames * 3) : 0.5;
    const spectralCentroid = frames ? specCentroidAcc / frames : 0;

    // 4) Género y mood heurístico
    const { genre, genreConfidence } = classifyGenre({ bpm, energy, spectralCentroid });
    const mood = energy > 0.65 ? 'energetic' : energy < 0.35 ? 'intimate' : 'balanced';

    // 5) Danceability & acousticness proxies
    const danceability = Math.max(0, Math.min(1, (bpm - 60) / 120));
    const acousticness = Math.max(0, Math.min(1, 1 - energy));

    return {
      bpm: Math.round(bpm),
      confidence,
      key,
      scale,
      genre,
      genreConfidence,
      energy,
      danceability,
      acousticness,
      mood,
      detectedInstruments: [],
      timeSignature: '4/4',
      spectralCentroid,
    };
  }
};
