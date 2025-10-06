import React, { useState, useEffect } from 'react';

const PerformanceControls = ({ 
  onQualityChange, 
  onAudioToggle, 
  onAnimationsToggle,
  initialQuality = 'high',
  initialAudio = true,
  initialAnimations = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [quality, setQuality] = useState(initialQuality);
  const [audioEnabled, setAudioEnabled] = useState(initialAudio);
  const [animationsEnabled, setAnimationsEnabled] = useState(initialAnimations);
  const [fps, setFps] = useState(60);
  const [lastFrameTime, setLastFrameTime] = useState(0);

  // Monitoreo de FPS
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    measureFPS();
  }, []);

  // Detectar tecla de acceso rápido (Ctrl+Shift+P)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleQualityChange = (newQuality) => {
    setQuality(newQuality);
    if (onQualityChange) {
      onQualityChange(newQuality);
    }
  };

  const handleAudioToggle = () => {
    const newAudioState = !audioEnabled;
    setAudioEnabled(newAudioState);
    if (onAudioToggle) {
      onAudioToggle(newAudioState);
    }
  };

  const handleAnimationsToggle = () => {
    const newAnimationsState = !animationsEnabled;
    setAnimationsEnabled(newAnimationsState);
    if (onAnimationsToggle) {
      onAnimationsToggle(newAnimationsState);
    }
  };

  if (!isVisible) {
    return (
      <div className="performance-toggle">
        <button 
          onClick={() => setIsVisible(true)}
          className="perf-toggle-btn"
          title="Performance Controls (Ctrl+Shift+P)"
        >
          ⚙️
        </button>
      </div>
    );
  }

  return (
    <div className="performance-controls">
      <div className="perf-header">
        <h3>Performance Controls</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="perf-close-btn"
        >
          ✕
        </button>
      </div>

      <div className="perf-section">
        <label>Quality Level:</label>
        <div className="quality-buttons">
          {['low', 'medium', 'high'].map(level => (
            <button
              key={level}
              className={`quality-btn ${quality === level ? 'active' : ''}`}
              onClick={() => handleQualityChange(level)}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="perf-section">
        <label>Audio:</label>
        <button
          className={`toggle-btn ${audioEnabled ? 'active' : ''}`}
          onClick={handleAudioToggle}
        >
          {audioEnabled ? '🔊' : '🔇'}
          {audioEnabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      <div className="perf-section">
        <label>Animations:</label>
        <button
          className={`toggle-btn ${animationsEnabled ? 'active' : ''}`}
          onClick={handleAnimationsToggle}
        >
          {animationsEnabled ? '🎬' : '⏸️'}
          {animationsEnabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      <div className="perf-section">
        <label>Performance:</label>
        <div className="fps-indicator">
          <span className={`fps-value ${fps < 30 ? 'low' : fps < 50 ? 'medium' : 'high'}`}>
            {fps} FPS
          </span>
        </div>
      </div>

      <div className="perf-info">
        <small>
          Press Ctrl+Shift+P to toggle this panel
        </small>
      </div>
    </div>
  );
};

export default PerformanceControls;