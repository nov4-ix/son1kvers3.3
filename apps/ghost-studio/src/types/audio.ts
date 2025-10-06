export interface AudioFile {
  id: string;
  file: File;
  url: string;
  duration: number;
  format: 'mp3' | 'wav';
  size: number;
  sampleRate: number;
  channels: number;
}

export interface AudioAnalysis {
  bpm: number;
  confidence: number; // 0-1 para BPM detection
  key: string; // "C", "D#", etc
  scale: 'major' | 'minor';
  genre: string;
  genreConfidence: number;
  energy: number; // 0-1
  danceability: number; // 0-1
  acousticness: number; // 0-1
  mood: string;
  detectedInstruments: string[];
  timeSignature: string;
  spectralCentroid: number;
}
