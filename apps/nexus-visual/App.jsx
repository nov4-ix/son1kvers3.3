import React, { useState, useCallback } from 'react';
import MatrixRain from './components/MatrixRain';
import NexusScene from './components/NexusScene';
import AudioManager from './components/AudioManager';
import PerformanceControls from './components/PerformanceControls';

function App() {
  const [quality, setQuality] = useState('high');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  const handleIconClick = useCallback((icon, index) => {
    console.log(`Icon clicked: ${icon.label} (${index})`);
    // Reproducir sonido de ícono si está habilitado
    if (audioEnabled && window.nexusAudio) {
      window.nexusAudio.iconClick(index);
    }
  }, [audioEnabled]);

  const handleQualityChange = useCallback((newQuality) => {
    setQuality(newQuality);
    console.log(`Quality changed to: ${newQuality}`);
  }, []);

  const handleAudioToggle = useCallback((enabled) => {
    setAudioEnabled(enabled);
    console.log(`Audio ${enabled ? 'enabled' : 'disabled'}`);
  }, []);

  const handleAnimationsToggle = useCallback((enabled) => {
    setAnimationsEnabled(enabled);
    console.log(`Animations ${enabled ? 'enabled' : 'disabled'}`);
  }, []);

  return (
    <div className="App">
      {/* Canvas de Matrix Rain mejorado */}
      <MatrixRain 
        color="#00FFE7"
        fontSize={18}
        stepMs={34}
        settleAfterMs={5000}
        transitionMs={1000}
        trailInitial={0.12}
        trailCalm={0.06}
        glyphAlphaInitial={1.0}
        glyphAlphaCalm={0.65}
        enableGlitch={animationsEnabled}
        enableParticles={animationsEnabled}
        quality={quality}
      />
      
      {/* Overlay de barras glitch horizontales */}
      <div className="glitch-lines"></div>
      
      {/* Escena NEXUS con interactividad avanzada */}
      <NexusScene 
        onIconClick={handleIconClick}
        enableAnimations={animationsEnabled}
      />
      
      {/* Gestor de audio */}
      <AudioManager 
        enableAmbient={audioEnabled}
        enableSFX={audioEnabled}
        volume={0.3}
      />
      
      {/* Controles de rendimiento */}
      <PerformanceControls
        onQualityChange={handleQualityChange}
        onAudioToggle={handleAudioToggle}
        onAnimationsToggle={handleAnimationsToggle}
        initialQuality={quality}
        initialAudio={audioEnabled}
        initialAnimations={animationsEnabled}
      />
    </div>
  );
}

export default App;