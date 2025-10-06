import React, { useRef, useEffect, useState } from 'react';

const AudioManager = ({ 
  enableAmbient = true, 
  enableSFX = true, 
  volume = 0.3,
  onIconClick = null 
}) => {
  const audioContextRef = useRef(null);
  const ambientGainRef = useRef(null);
  const sfxGainRef = useRef(null);
  const oscillatorsRef = useRef([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar Web Audio API
  useEffect(() => {
    if (!enableAmbient && !enableSFX) return;

    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      if (enableAmbient) {
        ambientGainRef.current = audioContextRef.current.createGain();
        ambientGainRef.current.connect(audioContextRef.current.destination);
        ambientGainRef.current.gain.value = volume * 0.5; // Ambient más suave
      }
      
      if (enableSFX) {
        sfxGainRef.current = audioContextRef.current.createGain();
        sfxGainRef.current.connect(audioContextRef.current.destination);
        sfxGainRef.current.gain.value = volume;
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [enableAmbient, enableSFX, volume]);

  // Crear sonido ambiental de fondo
  const createAmbientSound = () => {
    if (!audioContextRef.current || !ambientGainRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    const filter = audioContextRef.current.createBiquadFilter();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(60, audioContextRef.current.currentTime);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, audioContextRef.current.currentTime);
    filter.Q.setValueAtTime(1, audioContextRef.current.currentTime);

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.05, audioContextRef.current.currentTime + 2);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ambientGainRef.current);

    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 2);

    return oscillator;
  };

  // Crear efecto de sonido para íconos
  const createIconSound = (frequency = 440, duration = 0.2) => {
    if (!audioContextRef.current || !sfxGainRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    const filter = audioContextRef.current.createBiquadFilter();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(frequency * 2, audioContextRef.current.currentTime);

    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(sfxGainRef.current);

    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + duration);

    return oscillator;
  };

  // Crear sonido de Matrix Rain
  const createMatrixSound = () => {
    if (!audioContextRef.current || !sfxGainRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    const filter = audioContextRef.current.createBiquadFilter();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(100, audioContextRef.current.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContextRef.current.currentTime + 0.1);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, audioContextRef.current.currentTime);

    gainNode.gain.setValueAtTime(0.2, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(sfxGainRef.current);

    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.1);

    return oscillator;
  };

  // Crear sonido de glitch
  const createGlitchSound = () => {
    if (!audioContextRef.current || !sfxGainRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    const filter = audioContextRef.current.createBiquadFilter();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
    oscillator.frequency.setValueAtTime(200, audioContextRef.current.currentTime + 0.05);
    oscillator.frequency.setValueAtTime(1200, audioContextRef.current.currentTime + 0.1);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, audioContextRef.current.currentTime);
    filter.Q.setValueAtTime(10, audioContextRef.current.currentTime);

    gainNode.gain.setValueAtTime(0.15, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.15);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(sfxGainRef.current);

    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.15);

    return oscillator;
  };

  // Loop de sonido ambiental
  useEffect(() => {
    if (!isInitialized || !enableAmbient) return;

    const playAmbient = () => {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      createAmbientSound();
    };

    const interval = setInterval(playAmbient, 3000);
    playAmbient(); // Reproducir inmediatamente

    return () => clearInterval(interval);
  }, [isInitialized, enableAmbient]);

  // Exponer funciones de sonido globalmente
  useEffect(() => {
    if (!isInitialized) return;

    window.nexusAudio = {
      iconClick: (iconIndex) => {
        const frequencies = [440, 523, 659, 784, 880, 1047]; // Do, Mi, Sol, Si, Do, Mi
        createIconSound(frequencies[iconIndex % frequencies.length]);
      },
      matrixRain: createMatrixSound,
      glitch: createGlitchSound,
      ambient: createAmbientSound
    };

    return () => {
      delete window.nexusAudio;
    };
  }, [isInitialized]);

  return null; // Este componente no renderiza nada visual
};

export default AudioManager;