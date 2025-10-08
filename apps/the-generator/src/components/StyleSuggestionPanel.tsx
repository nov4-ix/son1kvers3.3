// src/components/StyleSuggestionPanel.tsx
import { useGeneratorStore } from '../store/generatorStore';

export function StyleSuggestionPanel() {
  const { generatedStyle, setStylePrompt } = useGeneratorStore();
  
  if (!generatedStyle) return null;
  
  return (
    <div className="mt-3 p-4 bg-white/5 rounded-xl text-white/90 border border-white/10">
      <pre className="whitespace-pre-wrap">{generatedStyle}</pre>
      <div className="mt-2 flex gap-2">
        <button 
          onClick={() => navigator.clipboard.writeText(generatedStyle)} 
          className="px-3 py-1 bg-white/10 rounded hover:bg-white/20 transition-colors"
        >
          Copiar
        </button>
        <button 
          onClick={() => setStylePrompt(generatedStyle)} 
          className="px-3 py-1 bg-cyan text-black rounded hover:bg-cyan/80 transition-colors"
        >
          Usar este estilo
        </button>
      </div>
    </div>
  );
}
