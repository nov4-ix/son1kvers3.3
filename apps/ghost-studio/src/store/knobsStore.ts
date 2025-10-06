// apps/ghost-studio/src/store/knobsStore.ts
import { create } from 'zustand';
import type { KnobSettings } from '../types/suno';

export const useKnobsStore = create<{ 
  values: KnobSettings; 
  set:(v:KnobSettings)=>void 
}>((set)=>({
  values: { expressivity:50, rareza:50, garage:30, trash:30 },
  set: (v)=>set({ values: v })
}));
