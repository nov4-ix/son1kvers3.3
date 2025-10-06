import React from 'react';
import { motion } from 'framer-motion';
import { useGhostStore } from '../store/useGhostStore';

export const MusicGenerator: React.FC = () => {
  const {
    currentMusicPrompt,
    currentMusicStyle,
    setCurrentMusicPrompt,
    setCurrentMusicStyle,
    generateMusic,
    isGenerating
  } = useGhostStore();

  const musicStyles = [
    { value: 'electronic', label: 'Electronic' },
    { value: 'ambient', label: 'Ambient' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'synthwave', label: 'Synthwave' },
    { value: 'drum-and-bass', label: 'Drum & Bass' },
    { value: 'techno', label: 'Techno' },
    { value: 'house', label: 'House' },
    { value: 'trance', label: 'Trance' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateMusic();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-bold text-cyan mb-2">Generar Música</h3>
        <p className="text-accent text-sm">
          Usa Suno API para crear música con IA basada en tu descripción
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cyan mb-2">
            Descripción de la música
          </label>
          <textarea
            value={currentMusicPrompt}
            onChange={(e) => setCurrentMusicPrompt(e.target.value)}
            placeholder="Describe el tipo de música que quieres generar... (ej: 'Una canción cyberpunk con sintetizadores oscuros y ritmo acelerado')"
            className="daw-textarea"
            rows={4}
            disabled={isGenerating}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan mb-2">
            Estilo musical
          </label>
          <select
            value={currentMusicStyle}
            onChange={(e) => setCurrentMusicStyle(e.target.value)}
            className="daw-select"
            disabled={isGenerating}
          >
            {musicStyles.map((style) => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="daw-btn daw-btn-primary flex-1"
            disabled={isGenerating || !currentMusicPrompt.trim()}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Generando...
              </>
            ) : (
              <>
                🎵 Generar Música
              </>
            )}
          </button>
        </div>
      </form>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-cyan mb-2">💡 Consejos para mejores resultados:</h4>
        <ul className="text-xs text-accent space-y-1">
          <li>• Sé específico sobre el género y mood</li>
          <li>• Menciona instrumentos específicos</li>
          <li>• Incluye referencias de tempo (lento, rápido, moderado)</li>
          <li>• Describe la atmósfera emocional</li>
        </ul>
      </div>
    </motion.div>
  );
};