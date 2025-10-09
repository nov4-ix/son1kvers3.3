import { useState } from 'react';
import { useSunoService } from '@/hooks/useSunoService';
import { DualMusicPlayer } from './DualMusicPlayer';

export function SimpleGenerator() {
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [instrumental, setInstrumental] = useState(false);

  const { generate, isGenerating, progress, error, result, reset } = useSunoService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!lyrics.trim() && !instrumental) {
      alert('Por favor ingresa letra o marca como instrumental');
      return;
    }

    await generate({
      prompt: lyrics,
      style: style || 'pop',
      title: title || 'Sin título',
      customMode: true,
      instrumental,
      lyrics: lyrics
    });
  };

  const getAudioUrl = () => {
    if (!result) return null;
    return result.audio_url || result.data?.audio_url || null;
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4">
          Son1kvers3
        </h1>
        <p className="text-gray-300 text-lg">
          Democratización musical global 🎵
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Título de la canción
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Mi Canción Increíble"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Estilo musical
            </label>
            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="indie rock, urban textures"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Letra de la canción
            </label>
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Escribe tu letra aquí..."
              rows={8}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
              disabled={isGenerating || instrumental}
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="instrumental"
              checked={instrumental}
              onChange={(e) => setInstrumental(e.target.checked)}
              className="w-5 h-5 rounded"
              disabled={isGenerating}
            />
            <label htmlFor="instrumental" className="text-white text-sm">
              Versión instrumental (sin letra)
            </label>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? '🎵 Generando...' : '✨ Generar Música'}
          </button>
        </form>

        {isGenerating && (
          <div className="mt-6">
            <div className="flex justify-between text-sm text-white mb-2">
              <span>Generando tu música...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm">❌ {error}</p>
            <button
              onClick={reset}
              className="mt-2 text-red-300 hover:text-red-200 text-sm underline"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>

      {result && getAudioUrl() && (
        <DualMusicPlayer
          audioUrl={getAudioUrl()!}
          title={title || result.data?.title || 'Tu Canción'}
          artist="Son1kvers3 AI"
          onReset={reset}
        />
      )}
    </div>
  );
}
