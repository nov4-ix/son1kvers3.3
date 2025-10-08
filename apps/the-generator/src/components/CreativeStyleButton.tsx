// src/components/CreativeStyleButton.tsx
import { useStyleGenerator } from '../hooks/useStyleGenerator';

export function CreativeStyleButton() {
  const gen = useStyleGenerator();
  
  return (
    <button 
      onClick={() => gen()} 
      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
    >
      Creative Style
    </button>
  );
}
