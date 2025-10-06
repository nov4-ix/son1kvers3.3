import React from 'react';
import { motion } from 'framer-motion';
import { useGhostStore } from '../store/useGhostStore';

export const GenerationHistory: React.FC = () => {
  const {
    musicGenerations,
    textToSpeechGenerations,
    voiceClones,
    exportToSanctuary,
    exportToNova
  } = useGhostStore();

  const allGenerations = [
    ...musicGenerations.map(g => ({ ...g, type: 'music' as const })),
    ...textToSpeechGenerations.map(g => ({ ...g, type: 'tts' as const })),
    ...voiceClones.map(g => ({ ...g, type: 'voice' as const }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'music': return '🎵';
      case 'voice': return '🎭';
      case 'tts': return '🔊';
      default: return '📁';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'ready':
        return 'text-success';
      case 'generating':
      case 'uploading':
      case 'processing':
        return 'text-warning';
      case 'failed':
        return 'text-error';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'ready': return 'Listo';
      case 'generating': return 'Generando...';
      case 'uploading': return 'Subiendo...';
      case 'processing': return 'Procesando...';
      case 'failed': return 'Error';
      default: return 'Desconocido';
    }
  };

  const handleExport = (generation: any, platform: 'sanctuary' | 'nova') => {
    if (platform === 'sanctuary') {
      exportToSanctuary(generation.id);
    } else {
      exportToNova(generation.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div>
        <h3 className="text-lg font-bold text-cyan mb-2">Historial de Generaciones</h3>
        <p className="text-accent text-sm">
          Tus creaciones recientes y opciones de exportación
        </p>
      </div>

      <div className="space-y-3">
        {allGenerations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎵</div>
            <p>No hay generaciones recientes</p>
            <p className="text-sm">Crea tu primera pieza musical o de voz</p>
          </div>
        ) : (
          allGenerations.map((generation) => (
            <motion.div
              key={`${generation.type}-${generation.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="daw-history-item"
            >
              <div className="daw-history-icon">
                {getTypeIcon(generation.type)}
              </div>
              
              <div className="daw-history-info">
                <div className="daw-history-title">
                  {generation.type === 'music' && generation.prompt}
                  {generation.type === 'tts' && generation.text?.substring(0, 50) + '...'}
                  {generation.type === 'voice' && generation.name}
                </div>
                <div className="daw-history-details">
                  {generation.type === 'music' && `Estilo: ${generation.style}`}
                  {generation.type === 'tts' && `Voz: ${generation.voice}`}
                  {generation.type === 'voice' && 'Clon de voz'}
                  <span className="mx-2">•</span>
                  <span className={getStatusColor(generation.status)}>
                    {getStatusText(generation.status)}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="text-gray-500">
                    {new Date(generation.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="daw-history-actions">
                {generation.status === 'completed' || generation.status === 'ready' ? (
                  <>
                    <button
                      onClick={() => handleExport(generation, 'sanctuary')}
                      className="daw-history-btn"
                      title="Exportar a Sanctuary Social"
                    >
                      🏛️
                    </button>
                    <button
                      onClick={() => handleExport(generation, 'nova')}
                      className="daw-history-btn"
                      title="Exportar a Nova Post Pilot"
                    >
                      🚀
                    </button>
                    {generation.audioUrl && (
                      <button
                        onClick={() => window.open(generation.audioUrl, '_blank')}
                        className="daw-history-btn"
                        title="Reproducir"
                      >
                        ▶️
                      </button>
                    )}
                  </>
                ) : (
                  <div className="daw-history-btn">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};