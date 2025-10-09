import { useState } from 'react';
import { useSunoService } from '../hooks/useSunoService';

export function SimpleGenerator() {
  const [lyrics, setLyrics] = useState('');
  const [prompt, setPrompt] = useState('');
  const { generate, isGenerating, progress, error, result, reset } = useSunoService();

  const handleGenerateMusic = async () => {
    if (!lyrics.trim() && !prompt.trim()) {
      alert('Por favor escribe algo en los cuadros de texto');
      return;
    }

    try {
      const params = {
        prompt: prompt || lyrics,
        lyrics: lyrics,
        style: 'pop',
        title: 'Generated Song',
        customMode: true,
        instrumental: false
      };

      await generate(params);
    } catch (err) {
      console.error('Error generating music:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* CUADRO 1: Letra */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-2">Letra</h2>
        <div className="space-y-3">
          <textarea 
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Escribe tu letra aquí..."
            className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/50 focus:border-cyan focus:outline-none"
          />
        </div>
      </div>
      
      {/* CUADRO 2: Prompt Musical */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-2">Prompt Musical</h2>
        <div className="space-y-3">
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Escribe tu prompt musical aquí..."
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/50 focus:border-cyan focus:outline-none"
          />
        </div>
      </div>
      
      {/* Botón Generar */}
      <div className="text-center">
        <button 
          onClick={handleGenerateMusic}
          disabled={isGenerating}
          className="px-8 py-3 bg-gradient-to-r from-cyan to-magenta text-white rounded-xl hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {isGenerating ? `Generando... ${progress}%` : 'Generar Música'}
        </button>
      </div>

      {/* Progress Bar */}
      {isGenerating && (
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-cyan to-magenta h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300">
          Error: {error}
        </div>
      )}

      {/* Result */}
      {result && result.audio_url && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
          <h3 className="text-green-300 font-semibold mb-2">¡Música generada!</h3>
          <audio controls className="w-full">
            <source src={result.audio_url} type="audio/mpeg" />
            Tu navegador no soporta el elemento de audio.
          </audio>
        </div>
      )}
    </div>
  );
}

