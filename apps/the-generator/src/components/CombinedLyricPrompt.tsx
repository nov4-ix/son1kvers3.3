// src/components/CombinedLyricPrompt.tsx
import { useGeneratorStore } from '../store/generatorStore';
import { useLyricGenerator } from '../hooks/useLyricGenerator';
import { useStyleGenerator } from '../hooks/useStyleGenerator';

export function CombinedLyricPrompt() {
  const { 
    idea, 
    knobs, 
    generatedLyrics, 
    generatedStyle, 
    setGeneratedLyrics, 
    setGeneratedStyle 
  } = useGeneratorStore();
  
  const generateLyrics = useLyricGenerator();
  const generateStyle = useStyleGenerator();
  
  const handleGenerateCombined = async () => {
    try {
      // Generar letra
      const lyrics = await generateLyrics();
      
      // Generar estilo basado en la letra
      const style = await generateStyle();
      
      // Combinar letra + prompt musical
      const combined = `${lyrics}\n\n--- PROMPT MUSICAL ---\n${style}`;
      setGeneratedLyrics(combined);
    } catch (error) {
      console.error('Error generating combined content:', error);
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    
    // Separar letra del prompt musical si existe
    const parts = text.split('\n\n--- PROMPT MUSICAL ---\n');
    if (parts.length === 2) {
      setGeneratedLyrics(parts[0]);
      setGeneratedStyle(parts[1]);
    } else {
      setGeneratedLyrics(text);
    }
  };
  
  return (
    <div className="space-y-3">
      <textarea 
        value={generatedLyrics + (generatedStyle ? `\n\n--- PROMPT MUSICAL ---\n${generatedStyle}` : '')}
        onChange={handleTextChange}
        placeholder="Aquí aparecerá tu letra generada con el prompt musical integrado, o escribe tu propia letra..."
        className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/50 focus:border-cyan focus:outline-none"
      />
      
      <div className="flex gap-3">
        <button 
          onClick={handleGenerateCombined}
          className="px-4 py-2 bg-cyan text-black rounded-lg hover:bg-cyan/80 transition-colors"
        >
          Generar Letra + Prompt Musical
        </button>
        
        <button 
          onClick={generateLyrics}
          className="px-4 py-2 bg-magenta text-white rounded-lg hover:bg-magenta/80 transition-colors"
        >
          Solo Generar Letra
        </button>
      </div>
    </div>
  );
}
