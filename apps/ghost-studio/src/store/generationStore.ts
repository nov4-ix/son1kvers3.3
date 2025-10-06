// apps/ghost-studio/src/store/generationStore.ts
import { create } from 'zustand';
import type { SunoTaskStatus } from '../types/suno';

interface GenState { 
  status: SunoTaskStatus|null; 
  setStatus:(s:SunoTaskStatus|null)=>void 
}
export const useGenerationStore = create<GenState>((set)=>({ 
  status:null, 
  setStatus:(s)=>set({ status:s }) 
}));
