import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { getModuleLore, getFactionInfo } from '../lib/lore';

export const GhostStudio: React.FC = () => {
  const { addProject } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  
  // Obtener información de lore del módulo
  const moduleLore = getModuleLore('ghost-studio');
  const factionInfo = moduleLore ? getFactionInfo(moduleLore.faction) : null;

  const handleGenerateTrack = async () => {
    setIsGenerating(true);
    // Simular generación de track
    setTimeout(() => {
      setCurrentTrack('Track generado exitosamente');
      setIsGenerating(false);
      addProject({
        name: 'Track Generado',
        type: 'music',
        status: 'active'
      });
    }, 3000);
  };

  const musicStyles = [
    { name: 'Cyberpunk', icon: '🤖', description: 'Ambiente futurista con sintetizadores' },
    { name: 'Ambient', icon: '🌌', description: 'Música ambiental relajante' },
    { name: 'Electronic', icon: '⚡', description: 'Electrónica moderna y dance' },
    { name: 'Lo-Fi', icon: '🎧', description: 'Hip-hop relajante y nostálgico' },
    { name: 'Synthwave', icon: '🌆', description: 'Retro-futurismo de los 80s' },
    { name: 'Experimental', icon: '🔬', description: 'Exploración sonora avanzada' }
  ];

  return (
    <div className="ghost-studio-container">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="module-header">
            <h1 className="text-4xl font-bold text-cyan mb-2">
              🎵 Ghost Studio
            </h1>
            <div className="module-faction">
              <span className={`faction-badge ${factionInfo?.color}`}>
                {factionInfo?.name}
              </span>
            </div>
          </div>
          <p className="text-accent text-lg mb-4">
            {moduleLore?.purpose}
          </p>
          <div className="module-history">
            <p className="text-sm text-gray-400 italic">
              "{moduleLore?.history}"
            </p>
          </div>
        </motion.div>

        {/* Quick Generate Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="quick-generate-card">
            <h2 className="text-2xl font-bold text-cyan mb-4">
              Generación Rápida
            </h2>
            <div className="generate-controls">
              <div className="input-group">
                <label className="input-label">Descripción del track</label>
                <input
                  type="text"
                  placeholder="Ej: Una canción cyberpunk con sintetizadores y beats electrónicos"
                  className="generate-input"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Duración</label>
                <select className="generate-select">
                  <option value="30">30 segundos</option>
                  <option value="60">1 minuto</option>
                  <option value="120">2 minutos</option>
                  <option value="180">3 minutos</option>
                </select>
              </div>
              <button
                className="generate-btn"
                onClick={handleGenerateTrack}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="spinner"></div>
                    Generando...
                  </>
                ) : (
                  <>
                    🎵 Generar Track
                  </>
                )}
              </button>
            </div>
            {currentTrack && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="track-result"
              >
                <h3 className="text-lg font-bold text-green-400 mb-2">
                  Track Generado
                </h3>
                <p className="text-accent">{currentTrack}</p>
                <div className="track-actions">
                  <button className="action-btn primary">▶️ Reproducir</button>
                  <button className="action-btn secondary">💾 Descargar</button>
                  <button className="action-btn secondary">🔄 Regenerar</button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Music Styles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-cyan mb-6">
            Estilos Musicales
          </h2>
          <div className="styles-grid">
            {musicStyles.map((style, index) => (
              <motion.div
                key={style.name}
                className="style-card"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="style-icon">{style.icon}</div>
                <h3 className="style-name">{style.name}</h3>
                <p className="style-description">{style.description}</p>
                <button className="style-btn">Usar Estilo</button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-cyan mb-6">
            Proyectos Recientes
          </h2>
          <div className="projects-list">
            <div className="project-item">
              <div className="project-info">
                <h3 className="project-name">Cyberpunk Ambient Album</h3>
                <p className="project-description">Álbum completo de música cyberpunk</p>
                <span className="project-date">Hace 2 horas</span>
              </div>
              <div className="project-actions">
                <button className="action-btn primary">▶️</button>
                <button className="action-btn secondary">✏️</button>
                <button className="action-btn secondary">🗑️</button>
              </div>
            </div>
            <div className="project-item">
              <div className="project-info">
                <h3 className="project-name">Synthwave Track</h3>
                <p className="project-description">Track retro-futurista</p>
                <span className="project-date">Hace 1 día</span>
              </div>
              <div className="project-actions">
                <button className="action-btn primary">▶️</button>
                <button className="action-btn secondary">✏️</button>
                <button className="action-btn secondary">🗑️</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
