// Mobile Ghost Studio - Ghost Studio optimizado para móviles y tablets del universo Son1kVerse

import React, { useState, useEffect, useRef } from 'react';
import { MobileLayout, TouchOptimizedButton, useDeviceInfo } from './index';
import { cn } from '../../shared-utils';

export interface MobileGhostStudioProps {
  className?: string;
  onBack?: () => void;
  onSettings?: () => void;
  onShare?: () => void;
  onFullscreen?: () => void;
}

export function MobileGhostStudio({
  className,
  onBack,
  onSettings,
  onShare,
  onFullscreen
}: MobileGhostStudioProps) {
  const deviceInfo = useDeviceInfo();
  const [activeTab, setActiveTab] = useState<'music' | 'voice' | 'text' | 'daw' | 'looper'>('music');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [bpm, setBpm] = useState(120);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle device orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      if (deviceInfo.orientation === 'landscape' && !isFullscreen) {
        setIsFullscreen(true);
        onFullscreen?.();
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, [deviceInfo.orientation, isFullscreen, onFullscreen]);

  // Handle touch gestures for audio controls
  const handleSwipeGesture = (direction: 'up' | 'down' | 'left' | 'right') => {
    switch (direction) {
      case 'up':
        setVolume(Math.min(1, volume + 0.1));
        break;
      case 'down':
        setVolume(Math.max(0, volume - 0.1));
        break;
      case 'left':
        setBpm(Math.max(60, bpm - 5));
        break;
      case 'right':
        setBpm(Math.min(200, bpm + 5));
        break;
    }
  };

  // Handle long press for recording
  const handleLongPress = () => {
    setIsRecording(!isRecording);
  };

  // Handle double tap for play/pause
  const handleDoubleTap = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <MobileLayout
      className={cn('mobile-ghost-studio', className)}
      orientation="auto"
      deviceType="auto"
      safeArea={true}
      statusBar={true}
      navigationBar={true}
      keyboardAvoidance={true}
      scrollable={true}
      fullscreen={isFullscreen}
      theme="dark"
      animations={true}
      gestures={true}
      haptics={true}
      performance={deviceInfo.deviceType === 'mobile' ? 'medium' : 'high'}
    >
      {/* Header */}
      <div className="mobile-ghost-studio__header">
        <TouchOptimizedButton
          variant="ghost"
          size="sm"
          onClick={onBack}
          icon="←"
          iconPosition="left"
          haptic={true}
        >
          Back
        </TouchOptimizedButton>

        <div className="mobile-ghost-studio__title">
          <h1>🎵 Ghost Studio</h1>
          <p>IA Musical</p>
        </div>

        <div className="mobile-ghost-studio__actions">
          <TouchOptimizedButton
            variant="ghost"
            size="sm"
            onClick={onShare}
            icon="📤"
            haptic={true}
          />
          <TouchOptimizedButton
            variant="ghost"
            size="sm"
            onClick={onSettings}
            icon="⚙️"
            haptic={true}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mobile-ghost-studio__tabs">
        {[
          { id: 'music', label: 'Música', icon: '🎵' },
          { id: 'voice', label: 'Voz', icon: '🎤' },
          { id: 'text', label: 'Texto', icon: '📝' },
          { id: 'daw', label: 'DAW', icon: '🎛️' },
          { id: 'looper', label: 'Looper', icon: '🔄' }
        ].map((tab) => (
          <TouchOptimizedButton
            key={tab.id}
            variant={activeTab === tab.id ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.id as any)}
            icon={tab.icon}
            iconPosition="top"
            fullWidth={true}
            haptic={true}
            glitch={activeTab === tab.id}
          >
            {tab.label}
          </TouchOptimizedButton>
        ))}
      </div>

      {/* Main Content */}
      <div className="mobile-ghost-studio__content">
        {activeTab === 'music' && (
          <div className="mobile-ghost-studio__music-tab">
            {/* Music Generation */}
            <div className="mobile-ghost-studio__section">
              <h3>🎼 Generación Musical</h3>
              <div className="mobile-ghost-studio__controls">
                <TouchOptimizedButton
                  variant="primary"
                  size="lg"
                  onClick={() => {}}
                  icon="🎵"
                  iconPosition="left"
                  fullWidth={true}
                  haptic={true}
                  cyberpunk={true}
                >
                  Generar Música
                </TouchOptimizedButton>
              </div>
            </div>

            {/* AI Processing */}
            <div className="mobile-ghost-studio__section">
              <h3>🤖 Procesamiento IA</h3>
              <div className="mobile-ghost-studio__ai-buttons">
                <TouchOptimizedButton
                  variant="secondary"
                  size="md"
                  onClick={() => {}}
                  icon="🌀"
                  iconPosition="left"
                  fullWidth={true}
                  haptic={true}
                  nexus={true}
                >
                  Nexus Enhancement
                </TouchOptimizedButton>
                <TouchOptimizedButton
                  variant="secondary"
                  size="md"
                  onClick={() => {}}
                  icon="👻"
                  iconPosition="left"
                  fullWidth={true}
                  haptic={true}
                  nexus={true}
                >
                  Phantom Cloning
                </TouchOptimizedButton>
                <TouchOptimizedButton
                  variant="secondary"
                  size="md"
                  onClick={() => {}}
                  icon="🔊"
                  iconPosition="left"
                  fullWidth={true}
                  haptic={true}
                  nexus={true}
                >
                  Quantum Speech
                </TouchOptimizedButton>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="mobile-ghost-studio__voice-tab">
            {/* Voice Cloning */}
            <div className="mobile-ghost-studio__section">
              <h3>🎤 Clonación de Voz</h3>
              <div className="mobile-ghost-studio__controls">
                <TouchOptimizedButton
                  variant="primary"
                  size="lg"
                  onClick={() => {}}
                  icon="🎤"
                  iconPosition="left"
                  fullWidth={true}
                  haptic={true}
                  cyberpunk={true}
                >
                  Clonar Voz
                </TouchOptimizedButton>
              </div>
            </div>

            {/* Text to Speech */}
            <div className="mobile-ghost-studio__section">
              <h3>📝 Texto a Voz</h3>
              <div className="mobile-ghost-studio__controls">
                <TouchOptimizedButton
                  variant="primary"
                  size="lg"
                  onClick={() => {}}
                  icon="📝"
                  iconPosition="left"
                  fullWidth={true}
                  haptic={true}
                  cyberpunk={true}
                >
                  Convertir Texto
                </TouchOptimizedButton>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="mobile-ghost-studio__text-tab">
            {/* Text Generation */}
            <div className="mobile-ghost-studio__section">
              <h3>📝 Generación de Texto</h3>
              <div className="mobile-ghost-studio__controls">
                <TouchOptimizedButton
                  variant="primary"
                  size="lg"
                  onClick={() => {}}
                  icon="📝"
                  iconPosition="left"
                  fullWidth={true}
                  haptic={true}
                  cyberpunk={true}
                >
                  Generar Texto
                </TouchOptimizedButton>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="mobile-ghost-studio__section">
              <h3>💡 Sugerencias IA</h3>
              <div className="mobile-ghost-studio__controls">
                <TouchOptimizedButton
                  variant="secondary"
                  size="md"
                  onClick={() => {}}
                  icon="💡"
                  iconPosition="left"
                  fullWidth={true}
                  haptic={true}
                  nexus={true}
                >
                  Oracle Mind
                </TouchOptimizedButton>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'daw' && (
          <div className="mobile-ghost-studio__daw-tab">
            {/* Mini DAW */}
            <div className="mobile-ghost-studio__section">
              <h3>🎛️ Mini DAW</h3>
              <div className="mobile-ghost-studio__daw-controls">
                <TouchOptimizedButton
                  variant="primary"
                  size="lg"
                  onClick={() => {}}
                  icon="🎵"
                  iconPosition="left"
                  fullWidth={true}
                  haptic={true}
                  cyberpunk={true}
                >
                  Nueva Pista
                </TouchOptimizedButton>
                <TouchOptimizedButton
                  variant="secondary"
                  size="md"
                  onClick={() => {}}
                  icon="🎤"
                  iconPosition="left"
                  fullWidth={true}
                  haptic={true}
                  nexus={true}
                >
                  Grabar Audio
                </TouchOptimizedButton>
                <TouchOptimizedButton
                  variant="secondary"
                  size="md"
                  onClick={() => {}}
                  icon="🎹"
                  iconPosition="left"
                  fullWidth={true}
                  haptic={true}
                  nexus={true}
                >
                  Grabar MIDI
                </TouchOptimizedButton>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'looper' && (
          <div className="mobile-ghost-studio__looper-tab">
            {/* Looper */}
            <div className="mobile-ghost-studio__section">
              <h3>🔄 Looper</h3>
              <div className="mobile-ghost-studio__looper-controls">
                <TouchOptimizedButton
                  variant="primary"
                  size="lg"
                  onClick={() => {}}
                  icon="🔄"
                  iconPosition="left"
                  fullWidth={true}
                  haptic={true}
                  cyberpunk={true}
                >
                  Nuevo Loop
                </TouchOptimizedButton>
                <TouchOptimizedButton
                  variant="secondary"
                  size="md"
                  onClick={() => {}}
                  icon="🎵"
                  iconPosition="left"
                  fullWidth={true}
                  haptic={true}
                  nexus={true}
                >
                  Overdub
                </TouchOptimizedButton>
                <TouchOptimizedButton
                  variant="secondary"
                  size="md"
                  onClick={() => {}}
                  icon="⏯️"
                  iconPosition="left"
                  fullWidth={true}
                  haptic={true}
                  nexus={true}
                >
                  Play/Pause
                </TouchOptimizedButton>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audio Controls */}
      <div className="mobile-ghost-studio__audio-controls">
        <div className="mobile-ghost-studio__transport">
          <TouchOptimizedButton
            variant="ghost"
            size="md"
            onClick={() => setIsPlaying(!isPlaying)}
            icon={isPlaying ? "⏸️" : "▶️"}
            iconPosition="left"
            haptic={true}
            onDoubleTap={handleDoubleTap}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </TouchOptimizedButton>

          <TouchOptimizedButton
            variant="ghost"
            size="md"
            onClick={() => setIsRecording(!isRecording)}
            icon="🎤"
            iconPosition="left"
            haptic={true}
            onLongPress={handleLongPress}
            glitch={isRecording}
          >
            {isRecording ? 'Stop' : 'Record'}
          </TouchOptimizedButton>

          <TouchOptimizedButton
            variant="ghost"
            size="md"
            onClick={() => {}}
            icon="⏹️"
            iconPosition="left"
            haptic={true}
          >
            Stop
          </TouchOptimizedButton>
        </div>

        <div className="mobile-ghost-studio__volume-control">
          <label>Volume: {Math.round(volume * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="mobile-ghost-studio__volume-slider"
          />
        </div>

        <div className="mobile-ghost-studio__bpm-control">
          <label>BPM: {bpm}</label>
          <input
            type="range"
            min="60"
            max="200"
            step="5"
            value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value))}
            className="mobile-ghost-studio__bpm-slider"
          />
        </div>
      </div>

      {/* Visualizer */}
      <div className="mobile-ghost-studio__visualizer">
        <canvas
          ref={canvasRef}
          className="mobile-ghost-studio__canvas"
          width={deviceInfo.width}
          height={200}
        />
      </div>
    </MobileLayout>
  );
}

// Hook for mobile audio controls
export function useMobileAudioControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [bpm, setBpm] = useState(120);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const stop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };
  const record = () => setIsRecording(true);
  const stopRecording = () => setIsRecording(false);

  const setVolumeLevel = (level: number) => setVolume(Math.max(0, Math.min(1, level)));
  const setBpmLevel = (level: number) => setBpm(Math.max(60, Math.min(200, level)));

  return {
    isPlaying,
    isRecording,
    volume,
    bpm,
    currentTime,
    duration,
    play,
    pause,
    stop,
    record,
    stopRecording,
    setVolumeLevel,
    setBpmLevel,
    setCurrentTime,
    setDuration
  };
}

// Hook for mobile gestures
export function useMobileGestures() {
  const [gestures, setGestures] = useState({
    swipeUp: 0,
    swipeDown: 0,
    swipeLeft: 0,
    swipeRight: 0,
    pinch: 1,
    rotation: 0
  });

  const handleSwipe = (direction: 'up' | 'down' | 'left' | 'right') => {
    setGestures(prev => ({
      ...prev,
      [`swipe${direction.charAt(0).toUpperCase() + direction.slice(1)}`]: prev[`swipe${direction.charAt(0).toUpperCase() + direction.slice(1)}` as keyof typeof prev] + 1
    }));
  };

  const handlePinch = (scale: number) => {
    setGestures(prev => ({ ...prev, pinch: scale }));
  };

  const handleRotation = (rotation: number) => {
    setGestures(prev => ({ ...prev, rotation }));
  };

  return {
    gestures,
    handleSwipe,
    handlePinch,
    handleRotation
  };
}