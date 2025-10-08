// src/components/AudioPreview.tsx
import { useGeneratorStore } from '../store/generatorStore';

export function AudioPreview() {
  const { streamUrl, downloadUrl } = useGeneratorStore();
  
  if (!streamUrl) return null;
  
  return (
    <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
      <audio controls src={streamUrl} className="w-full" />
      {downloadUrl && (
        <a 
          className="text-cyan underline hover:text-cyan/80 transition-colors" 
          href={downloadUrl} 
          download
        >
          Descargar
        </a>
      )}
    </div>
  );
}
