// src/store/generatorStore.ts
import { create } from 'zustand';
import type { LiteraryKnobs, GenStatus, GeneratorState, GeneratorActions } from '../types/generator';

const defaultKnobs: LiteraryKnobs = {
  metaphor: 40,
  intensity: 50,
  lexicon: 40,
  hook: 35,
  flow: 50
};

export const useGeneratorStore = create<GeneratorState & GeneratorActions>((set, get) => ({
  // State
  idea: '',
  lyrics: '',
  generatedLyrics: '',
  stylePrompt: '',
  generatedStyle: '',
  knobs: defaultKnobs,
  status: 'idle',
  audioStatus: 'idle',
  streamUrl: undefined,
  downloadUrl: undefined,

  // Actions
  setIdea: (s) => set({ idea: s }),
  setLyrics: (s) => set({ lyrics: s }),
  setStylePrompt: (s) => set({ stylePrompt: s }),
  setGeneratedLyrics: (s) => set({ generatedLyrics: s }),
  setGeneratedStyle: (s) => set({ generatedStyle: s }),
  setKnobs: (patch) => set({ knobs: { ...get().knobs, ...patch } }),
  setStatus: (s) => set({ status: s }),
  setAudioStatus: (s) => set({ audioStatus: s }),
  setStream: (u) => set({ streamUrl: u }),
  setDownload: (u) => set({ downloadUrl: u }),
}));
