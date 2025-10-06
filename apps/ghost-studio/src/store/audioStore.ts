// apps/ghost-studio/src/store/audioStore.ts
import { create } from 'zustand';
import type { AudioFile } from '../types/audio';

interface State { 
  audioFile: AudioFile | null; 
  setAudioFile: (f: AudioFile|null)=>void 
}
export const useAudioStore = create<State>((set)=>({ 
  audioFile: null, 
  setAudioFile: (f)=>set({ audioFile: f }) 
}));
