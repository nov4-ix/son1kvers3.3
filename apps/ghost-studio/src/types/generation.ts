import type { SunoTaskStatus } from './suno';
import type { AudioFile, AudioAnalysis } from './audio';
import type { KnobSettings } from './suno';

export interface GenerationState {
  isGenerating: boolean;
  taskId: string | null;
  status: SunoTaskStatus | null;
  error: string | null;
}

export interface SessionData {
  id: string;
  audioFile: AudioFile;
  analysis: AudioAnalysis;
  knobs: KnobSettings;
  userDescription: string;
  generatedUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
