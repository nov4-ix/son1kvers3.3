import React, { useState, useEffect } from 'react';

const NexusScene = ({ onIconClick, enableAnimations = true }) => {
  const [activeIcon, setActiveIcon] = useState(null);
  const [pulsePhase, setPulsePhase] = useState(0);
  
  // Íconos de módulos del Son1kVerse
  const icons = [
    { 
      symbol: '🎵', 
      label: 'Ghost Studio', 
      description: 'Producción musical con Suno API',
      color: '#00FFE7',
      status: 'online',
      url: '/ghost-studio'
    },
    { 
      symbol: '🎭', 
      label: 'Clone Station', 
      description: 'Clonación de voz y datasets',
      color: '#B84DFF',
      status: 'online',
      url: '/clone-station'
    },
    { 
      symbol: '🚀', 
      label: 'Nova Post Pilot', 
      description: 'Automatización de redes sociales',
      color: '#9AF7EE',
      status: 'online',
      url: '/nova-post-pilot'
    },
    { 
      symbol: '🏛️', 
      label: 'Sanctuary Social', 
      description: 'Red social colaborativa',
      color: '#00FFE7',
      status: 'online',
      url: '/sanctuary-social'
    },
    { 
      symbol: '🏠', 
      label: 'Web Classic', 
      description: 'Dashboard principal',
      color: '#B84DFF',
      status: 'online',
      url: '/web-classic'
    },
    { 
      symbol: '⚙️', 
      label: 'System Core', 
      description: 'Configuración del sistema',
      color: '#9AF7EE',
      status: 'operational',
      url: '/settings'
    }
  ];
  
  // Animación de pulso para el aro
  useEffect(() => {
    if (!enableAnimations) return;
    
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 0.1) % (Math.PI * 2));
    }, 50);
    
    return () => clearInterval(interval);
  }, [enableAnimations]);

  // Calcular posiciones de los íconos alrededor del círculo
  const iconPositions = icons.map((icon, index) => {
    const angle = (index * 60) * (Math.PI / 180); // 60 grados entre cada ícono
    const radius = 120; // Radio del círculo donde se colocan los íconos
    const pulseOffset = enableAnimations ? Math.sin(pulsePhase + index) * 2 : 0;
    
    return {
      ...icon,
      x: Math.cos(angle) * (radius + pulseOffset),
      y: Math.sin(angle) * (radius + pulseOffset),
      angle: angle,
      isActive: activeIcon === index
    };
  });
  
  const handleIconClick = (icon, index) => {
    setActiveIcon(activeIcon === index ? null : index);
    
    // Navegación a módulos
    if (icon.url) {
      // En un entorno real, esto sería navegación con React Router
      console.log(`Navegando a ${icon.label}: ${icon.url}`);
      
      // Simular navegación
      if (icon.url.startsWith('/')) {
        // Cambiar la URL del navegador
        window.location.href = icon.url;
      }
    }
    
    if (onIconClick) {
      onIconClick(icon, index);
    }
  };

  return (
    <div className="nexus-scene">
      {/* Aro morado único con efectos glitch */}
      <div className="ring-container">
        <div className="ring"></div>
        {enableAnimations && (
          <div 
            className="ring-pulse"
            style={{
              transform: `scale(${1 + Math.sin(pulsePhase) * 0.05})`,
              opacity: 0.3 + Math.sin(pulsePhase) * 0.2
            }}
          ></div>
        )}
      </div>

      {/* Contenido centrado */}
      <div className="nexus-center">
        <h1 className="nexus-title">NEXUS ACTIVADO</h1>
        <p className="nexus-sub">¡Bienvenido a la Resistencia!</p>
        {activeIcon !== null && (
          <div className="icon-info">
            <h3 style={{ color: iconPositions[activeIcon]?.color }}>
              {iconPositions[activeIcon]?.label}
            </h3>
            <p>{iconPositions[activeIcon]?.description}</p>
            <span className="status-indicator">
              Status: {iconPositions[activeIcon]?.status}
            </span>
          </div>
        )}
      </div>

      {/* Íconos alrededor del aro */}
      <div className="icons-container">
        {iconPositions.map((icon, index) => (
          <div
            key={index}
            className={`nexus-icon ${icon.isActive ? 'active' : ''}`}
            style={{
              position: 'absolute',
              left: `calc(50% + ${icon.x}px)`,
              top: `calc(50% + ${icon.y}px)`,
              transform: 'translate(-50%, -50%)',
              '--icon-color': icon.color
            }}
            title={`${icon.label} - ${icon.description}`}
            onClick={() => handleIconClick(icon, index)}
          >
            <span className="icon-symbol">{icon.symbol}</span>
            <span className="icon-glow"></span>
            <span className="status-dot"></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NexusScene;