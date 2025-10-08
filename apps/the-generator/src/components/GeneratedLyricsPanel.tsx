// src/components/GeneratedLyricsPanel.tsx
import { useGeneratorStore } from '../store/generatorStore';

export function GeneratedLyricsPanel() {
  const { generatedLyrics } = useGeneratorStore();
  
  return (
    <pre className="whitespace-pre-wrap text-white/90 p-4 bg-white/5 rounded-xl min-h-[8rem] border border-white/10">
      {generatedLyrics || '— Aún no hay letra generada —'}
    </pre>
  );
}
