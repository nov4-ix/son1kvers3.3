// src/types/generator.ts
export interface LiteraryKnobs {
  metaphor: number;     // 0–100 profundidad simbólica e imágenes
  intensity: number;    // 0–100 carga sentimental / polaridad
  lexicon: number;      // 0–100 vocabulario/estructuras
  hook: number;         // 0–100 insistencia de hooks
  flow: number;         // 0–100 rimas internas/cadencia/métrica
}

export type GenStatus = 'idle' | 'thinking' | 'generating' | 'ready' | 'error';

export interface GeneratorState {
  idea: string;              // input libre del usuario
  lyrics: string;            // lyrics actuales
  generatedLyrics: string;   // última salida AI
  stylePrompt: string;       // estilo elegido
  generatedStyle: string;    // estilo sugerido por IA
  knobs: LiteraryKnobs;
  status: GenStatus;         // estado del lyric engine
  audioStatus: GenStatus;    // estado de generación de audio
  streamUrl?: string;        // preview
  downloadUrl?: string;      // descarga
}

export interface GeneratorActions {
  setIdea: (s: string) => void;
  setLyrics: (s: string) => void;
  setStylePrompt: (s: string) => void;
  setGeneratedLyrics: (s: string) => void;
  setGeneratedStyle: (s: string) => void;
  setKnobs: (k: Partial<LiteraryKnobs>) => void;
  setStatus: (s: GenStatus) => void;
  setAudioStatus: (s: GenStatus) => void;
  setStream: (u?: string) => void;
  setDownload: (u?: string) => void;
}

export type DevicesUsed = Array<'metaphor' | 'simile' | 'hyperbole' | 'personification' | 'alliteration' | 'repetition'>;

export interface LiteraryResult {
  text: string;
  devices: DevicesUsed;
}

export interface StyleAnalysis {
  mood: 'melancholic' | 'uplifting' | 'intimate';
  pace: 'fast' | 'slow' | 'mid';
  imageryTags: string[];
}

export interface StyleProposal {
  genre: string;
  subgenre?: string;
  bpm: number;
  instruments: string[];
  mix: string[];
  eraTag?: string;
  references?: string[];
}
