// src/components/GenerateButtons.tsx
import { useLyricGenerator } from '../hooks/useLyricGenerator';
import { useAudioGenerator } from '../hooks/useAudioGenerator';

export function GenerateButtons() {
  const genLyrics = useLyricGenerator();
  const genAudio = useAudioGenerator();
  
  return (
    <div className="flex gap-3">
      <button 
        onClick={() => genLyrics()} 
        className="px-4 py-2 bg-cyan text-black rounded-lg hover:bg-cyan/80 transition-colors"
      >
        Generar Letra
      </button>
      <button 
        onClick={() => genAudio()} 
        className="px-4 py-2 bg-magenta text-white rounded-lg hover:bg-magenta/80 transition-colors"
      >
        Generar Audio
      </button>
    </div>
  );
}
