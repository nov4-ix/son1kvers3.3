// apps/nova-post-pilot/src/components/MusicGenerator.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useSunoMusic } from '../hooks/useSunoMusic';
import { MusicPlayer } from './MusicPlayer';

export function MusicGenerator() {
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [instrumental, setInstrumental] = useState(false);
  const [customToken, setCustomToken] = useState('');
  
  const { tracks, isLoading, error, generateMusic, clearResults, setToken } = useSunoMusic();

  const handleGenerate = async () => {
    if (!title.trim() || !style.trim() || !lyrics.trim()) {
      return;
    }

    if (customToken.trim()) {
      setToken(customToken.trim());
    }

    await generateMusic({
      title: title.trim(),
      style: style.trim(),
      lyrics: lyrics.trim(),
      prompt: `Style: ${style.trim()}\n\nLyrics:\n${lyrics.trim()}`,
      customMode: true,
      instrumental,
      tags: [style.trim()],
      duration: 180
    });
  };

  const handleClear = () => {
    setTitle('');
    setStyle('');
    setLyrics('');
    setInstrumental(false);
    setCustomToken('');
    clearResults();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-[#00FFE7] to-[#B84DFF] rounded-lg flex items-center justify-center">
          <Music className="w-5 h-5 text-[#0A0C10]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Generador de Música AI</h2>
          <p className="text-sm text-[#9AF7EE]">Crea música con inteligencia artificial</p>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Título <span className="text-[#ff6b6b]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Mi Canción"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00FFE7] focus:ring-1 focus:ring-[#00FFE7]"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Estilo <span className="text-[#ff6b6b]">*</span>
            </label>
            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="rock, pop, electronic, etc."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00FFE7] focus:ring-1 focus:ring-[#00FFE7]"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Letra <span className="text-[#ff6b6b]">*</span>
          </label>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Escribe la letra de tu canción aquí..."
            rows={6}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00FFE7] focus:ring-1 focus:ring-[#00FFE7] resize-none"
            disabled={isLoading}
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={instrumental}
              onChange={(e) => setInstrumental(e.target.checked)}
              className="w-4 h-4 text-[#00FFE7] bg-white/10 border-white/20 rounded focus:ring-[#00FFE7] focus:ring-2"
              disabled={isLoading}
            />
            <span className="text-sm text-white">Solo instrumental (sin voces)</span>
          </label>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Token personalizado (opcional)
          </label>
          <input
            type="password"
            value={customToken}
            onChange={(e) => setCustomToken(e.target.value)}
            placeholder="Dejar vacío para usar token por defecto"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00FFE7] focus:ring-1 focus:ring-[#00FFE7]"
            disabled={isLoading}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={isLoading || !title.trim() || !style.trim() || !lyrics.trim()}
            className="flex-1 bg-gradient-to-r from-[#00FFE7] to-[#B84DFF] text-[#0A0C10] font-semibold py-3 px-6 rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Music className="w-5 h-5 mr-2" />
                Generar Música
              </>
            )}
          </button>
          
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            Limpiar
          </button>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#ff6b6b]" />
            <div>
              <h4 className="font-medium text-[#ff6b6b]">Error</h4>
              <p className="text-sm text-[#ff6b6b]/80">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success */}
      {tracks.length > 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#00FFE7]/10 border border-[#00FFE7]/20 rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-[#00FFE7]" />
            <div>
              <h4 className="font-medium text-[#00FFE7]">¡Música generada!</h4>
              <p className="text-sm text-[#00FFE7]/80">
                Se generaron {tracks.length} track{tracks.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Music Player */}
      {tracks.length > 0 && (
        <MusicPlayer tracks={tracks} />
      )}
    </div>
  );
}
