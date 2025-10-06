import React from 'react';
import { motion } from 'framer-motion';
import { useGhostStore } from '../store/useGhostStore';

export const TextToSpeech: React.FC = () => {
  const {
    currentText,
    currentVoice,
    setCurrentText,
    setCurrentVoice,
    generateTextToSpeech,
    isGenerating
  } = useGhostStore();

  const voices = [
    { value: 'default', label: 'Voz por defecto' },
    { value: 'male-deep', label: 'Masculina profunda' },
    { value: 'female-smooth', label: 'Femenina suave' },
    { value: 'robotic', label: 'Robótica' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'narrator', label: 'Narrador' },
    { value: 'child', label: 'Infantil' },
    { value: 'elderly', label: 'Anciana' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateTextToSpeech();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-bold text-cyan mb-2">Texto a Voz</h3>
        <p className="text-accent text-sm">
          Convierte texto en audio usando Quantum Speaker con diferentes voces
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cyan mb-2">
            Texto a convertir
          </label>
          <textarea
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            placeholder="Escribe el texto que quieres convertir a voz..."
            className="daw-textarea"
            rows={6}
            disabled={isGenerating}
          />
          <div className="text-xs text-gray-500 mt-1">
            {currentText.length} caracteres
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan mb-2">
            Seleccionar voz
          </label>
          <select
            value={currentVoice}
            onChange={(e) => setCurrentVoice(e.target.value)}
            className="daw-select"
            disabled={isGenerating}
          >
            {voices.map((voice) => (
              <option key={voice.value} value={voice.value}>
                {voice.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="daw-btn daw-btn-primary flex-1"
            disabled={isGenerating || !currentText.trim()}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Generando...
              </>
            ) : (
              <>
                🔊 Generar Audio
              </>
            )}
          </button>
        </div>
      </form>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-cyan mb-2">💡 Consejos para mejor calidad:</h4>
        <ul className="text-xs text-accent space-y-1">
          <li>• Usa puntuación adecuada para pausas naturales</li>
          <li>• Evita caracteres especiales y símbolos</li>
          <li>• Textos largos pueden tardar más en procesar</li>
          <li>• Cada voz tiene características únicas</li>
        </ul>
      </div>
    </motion.div>
  );
};