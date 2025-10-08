// src/components/StylePromptInput.tsx
import { useGeneratorStore } from '../store/generatorStore';

export function StylePromptInput() {
  const { stylePrompt, setStylePrompt } = useGeneratorStore();
  
  return (
    <textarea 
      value={stylePrompt} 
      onChange={e => setStylePrompt(e.target.value)} 
      placeholder="Ej: indie-electro balad, ~92 BPM, analog polysynth, plate reverb…" 
      className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/50 focus:border-cyan focus:outline-none" 
    />
  );
}
