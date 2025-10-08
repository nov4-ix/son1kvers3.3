import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const NexusVisual: React.FC = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [glitchEffect, setGlitchEffect] = useState(false);

  useEffect(() => {
    // Activar efectos de glitch periódicamente
    const interval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const modules = [
    {
      id: 'ghost-studio',
      name: 'GHOST STUDIO',
      icon: '💎',
      position: 'top-left',
      color: 'cyan',
      description: 'Producción musical con IA'
    },
    {
      id: 'codex',
      name: 'CODEX',
      icon: '👤',
      position: 'top-right',
      color: 'cyan',
      description: 'Base de conocimiento'
    },
    {
      id: 'clone-station',
      name: 'CLONE STATION',
      icon: '🔧',
      position: 'bottom-left',
      color: 'magenta',
      description: 'Clonación de voz'
    },
    {
      id: 'la-liga',
      name: 'LA LIGA',
      icon: '📖',
      position: 'bottom-right',
      color: 'magenta',
      description: 'Comunidad colaborativa'
    }
  ];

  const floatingElements = [
    { text: 'ALVAE', position: 'left', delay: 0 },
    { text: 'Resistencia', position: 'right', delay: 0.5 },
    { text: 'Son1kVers3', position: 'bottom-left', delay: 1 }
  ];

  const handleModuleClick = (moduleId: string) => {
    setSelectedModule(moduleId);
    setIsActive(true);
    
    // Navegar después de la animación
    setTimeout(() => {
      switch (moduleId) {
        case 'ghost-studio':
          navigate('/ghost-studio');
          break;
        case 'clone-station':
          navigate('/clone-station');
          break;
        case 'la-liga':
          navigate('/sanctuary-social');
          break;
        default:
          break;
      }
    }, 1000);
  };

  const getModulePosition = (position: string) => {
    switch (position) {
      case 'top-left': return 'top-1/4 left-1/4';
      case 'top-right': return 'top-1/4 right-1/4';
      case 'bottom-left': return 'bottom-1/4 left-1/4';
      case 'bottom-right': return 'bottom-1/4 right-1/4';
      default: return '';
    }
  };

  const getFloatingPosition = (position: string) => {
    switch (position) {
      case 'left': return 'left-1/4 top-1/2';
      case 'right': return 'right-1/4 top-1/2';
      case 'bottom-left': return 'left-1/4 bottom-1/3';
      default: return '';
    }
  };

  return (
    <div className="nexus-visual-container">
      {/* Background Effects */}
      <div className="nexus-background">
        <div className="digital-noise"></div>
        <div className="glitch-lines"></div>
        <div className="particles"></div>
      </div>

      {/* Main Nexus Ring */}
      <motion.div
        className="nexus-ring"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <div className="ring-core">
          <div className="ring-particles"></div>
          <div className="ring-energy"></div>
        </div>
        <div className="ring-glow"></div>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="nexus-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        NEXUS
      </motion.h1>

      {/* Floating Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={element.text}
          className={`floating-element ${getFloatingPosition(element.position)}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: element.delay }}
        >
          <span className={`floating-text ${glitchEffect ? 'glitch' : ''}`}>
            {element.text}
          </span>
        </motion.div>
      ))}

      {/* Modules */}
      {modules.map((module, index) => (
        <motion.div
          key={module.id}
          className={`nexus-module ${getModulePosition(module.position)}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 + index * 0.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleModuleClick(module.id)}
        >
          <div className={`module-frame ${module.color} ${glitchEffect ? 'glitch-border' : ''}`}>
            <div className="module-icon">{module.icon}</div>
            <div className="module-name">{module.name}</div>
            <div className="module-description">{module.description}</div>
          </div>
        </motion.div>
      ))}

      {/* Energy Streams */}
      <motion.div
        className="energy-streams"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
      >
        <div className="stream stream-1"></div>
        <div className="stream stream-2"></div>
        <div className="stream stream-3"></div>
        <div className="stream stream-4"></div>
      </motion.div>

      {/* Activation Overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="activation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="activation-text">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                ACTIVANDO NEXUS...
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {selectedModule && modules.find(m => m.id === selectedModule)?.name}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Panel */}
      <motion.div
        className="nexus-controls"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <button
          className="control-btn"
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? 'DESACTIVAR' : 'ACTIVAR'} NEXUS
        </button>
        <button
          className="control-btn secondary"
          onClick={() => navigate('/dashboard')}
        >
          VOLVER AL DASHBOARD
        </button>
      </motion.div>
    </div>
  );
};
