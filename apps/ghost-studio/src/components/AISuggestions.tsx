import React from 'react';
import { motion } from 'framer-motion';

export const AISuggestions: React.FC = () => {
  const suggestions = [
    {
      id: '1',
      type: 'music',
      title: 'Sugerencia Musical',
      content: 'Basándome en tus generaciones recientes, podrías probar con un estilo "dark ambient" para crear atmósferas más inmersivas.',
      icon: '🎵'
    },
    {
      id: '2',
      type: 'voice',
      title: 'Optimización de Voz',
      content: 'Para mejores resultados en clonación de voz, asegúrate de que el audio tenga al menos 30 segundos de habla clara.',
      icon: '🎭'
    },
    {
      id: '3',
      type: 'workflow',
      title: 'Flujo de Trabajo',
      content: 'Considera exportar tus generaciones musicales a Sanctuary Social para colaboraciones con otros artistas.',
      icon: '🔄'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div>
        <h3 className="text-lg font-bold text-cyan mb-2">Sugerencias IA</h3>
        <p className="text-accent text-sm">
          Recomendaciones inteligentes de Oracle Mind para mejorar tu flujo de trabajo
        </p>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="ai-suggestion"
          >
            <div className="ai-suggestion-header">
              <span className="ai-suggestion-icon">{suggestion.icon}</span>
              <h4 className="ai-suggestion-title">{suggestion.title}</h4>
            </div>
            <p className="ai-suggestion-content">{suggestion.content}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <button className="daw-btn daw-btn-secondary text-xs">
          🔄 Actualizar Sugerencias
        </button>
      </div>
    </motion.div>
  );
};