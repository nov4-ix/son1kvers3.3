// src/components/LyricInput.tsx
import { useGeneratorStore } from '../store/generatorStore';

export function LyricInput() {
  const { idea, setIdea } = useGeneratorStore();
  
  return (
    <textarea 
      value={idea} 
      onChange={e => setIdea(e.target.value)} 
      placeholder="Escribe tu idea base aquí…" 
      className="w-full h-40 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/50 focus:border-cyan focus:outline-none" 
    />
  );
}
