// Mobile Sonic DAW - Sonic DAW optimizado para móviles y tablets del universo Son1kVerse

import React, { useState, useEffect, useRef } from 'react';
import { MobileLayout, TouchOptimizedButton, useDeviceInfo } from './index';
import { cn } from '../../shared-utils';

export interface MobileSonicDAWProps {
  className?: string;
  onBack?: () => void;
  onSettings?: () => void;
  onExport?: () => void;
  onFullscreen?: () => void;
}

export function MobileSonicDAW({
  className,
  onBack,
  onSettings,
  onExport,
  onFullscreen
}: MobileSonicDAWProps) {
  const deviceInfo = useDeviceInfo();
  const [activeView, setActiveView] = useState<'timeline' | 'mixer' | 'plugins' | 'browser'>('timeline');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240); // 4 minutes
  const [bpm, setBpm] = useState(120);
  const [timeSignature, setTimeSignature] = useState('4/4');
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [tracks, setTracks] = useState([
    { id: 1, name: 'Track 1', type: 'audio', muted: false, solo: false, volume: 0.8, pan: 0 },
    { id: 2, name: 'Track 2', type: 'midi', muted: false, solo: false, volume: 0.8, pan: 0 },
    { id: 3, name: 'Track 3', type: 'audio', muted: false, solo: false, volume: 0.8, pan: 0 }
  ]);
  const [plugins, setPlugins] = useState([
    { id: 1, name: 'Nexus Spectrum', category: 'EQ', active: false },
    { id: 2, name: 'Cyber Compressor', category: 'Dynamics', active: false },
    { id: 3, name: 'Dimensional Reverb', category: 'Reverb', active: false },
    { id: 4, name: 'Temporal Delay', category: 'Delay', active: false },
    { id: 5, name: 'Quantum Distortion', category: 'Distortion', active: false }
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Handle device orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      if (deviceInfo.orientation === 'landscape') {
        onFullscreen?.();
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, [deviceInfo.orientation, onFullscreen]);

  // Handle touch gestures for timeline
  const handleTimelineSwipe = (direction: 'up' | 'down' | 'left' | 'right') => {
    switch (direction) {
      case 'left':
        setCurrentTime(Math.max(0, currentTime - 10));
        break;
      case 'right':
        setCurrentTime(Math.min(duration, currentTime + 10));
        break;
      case 'up':
        setBpm(Math.min(200, bpm + 5));
        break;
      case 'down':
        setBpm(Math.max(60, bpm - 5));
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

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <MobileLayout
      className={cn('mobile-sonic-daw', className)}
      orientation="auto"
      deviceType="auto"
      safeArea={true}
      statusBar={true}
      navigationBar={true}
      keyboardAvoidance={true}
      scrollable={true}
      theme="dark"
      animations={true}
      gestures={true}
      haptics={true}
      performance={deviceInfo.deviceType === 'mobile' ? 'medium' : 'high'}
    >
      {/* Header */}
      <div className="mobile-sonic-daw__header">
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

        <div className="mobile-sonic-daw__title">
          <h1>🎛️ Sonic DAW</h1>
          <p>DAW Profesional</p>
        </div>

        <div className="mobile-sonic-daw__actions">
          <TouchOptimizedButton
            variant="ghost"
            size="sm"
            onClick={onExport}
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

      {/* View Navigation */}
      <div className="mobile-sonic-daw__views">
        {[
          { id: 'timeline', label: 'Timeline', icon: '📊' },
          { id: 'mixer', label: 'Mixer', icon: '🎚️' },
          { id: 'plugins', label: 'Plugins', icon: '🔌' },
          { id: 'browser', label: 'Browser', icon: '📁' }
        ].map((view) => (
          <TouchOptimizedButton
            key={view.id}
            variant={activeView === view.id ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveView(view.id as any)}
            icon={view.icon}
            iconPosition="top"
            fullWidth={true}
            haptic={true}
            glitch={activeView === view.id}
          >
            {view.label}
          </TouchOptimizedButton>
        ))}
      </div>

      {/* Transport Controls */}
      <div className="mobile-sonic-daw__transport">
        <div className="mobile-sonic-daw__transport-left">
          <TouchOptimizedButton
            variant="ghost"
            size="md"
            onClick={() => setCurrentTime(0)}
            icon="⏮️"
            haptic={true}
          />
          <TouchOptimizedButton
            variant="ghost"
            size="md"
            onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
            icon="⏪"
            haptic={true}
          />
        </div>

        <div className="mobile-sonic-daw__transport-center">
          <TouchOptimizedButton
            variant="primary"
            size="lg"
            onClick={() => setIsPlaying(!isPlaying)}
            icon={isPlaying ? "⏸️" : "▶️"}
            iconPosition="left"
            haptic={true}
            onDoubleTap={handleDoubleTap}
            cyberpunk={true}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </TouchOptimizedButton>

          <TouchOptimizedButton
            variant="secondary"
            size="lg"
            onClick={() => setIsRecording(!isRecording)}
            icon="🎤"
            iconPosition="left"
            haptic={true}
            onLongPress={handleLongPress}
            glitch={isRecording}
            son1kverse={true}
          >
            {isRecording ? 'Stop' : 'Record'}
          </TouchOptimizedButton>
        </div>

        <div className="mobile-sonic-daw__transport-right">
          <TouchOptimizedButton
            variant="ghost"
            size="md"
            onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
            icon="⏩"
            haptic={true}
          />
          <TouchOptimizedButton
            variant="ghost"
            size="md"
            onClick={() => setCurrentTime(duration)}
            icon="⏭️"
            haptic={true}
          />
        </div>
      </div>

      {/* Time Display */}
      <div className="mobile-sonic-daw__time-display">
        <div className="mobile-sonic-daw__time-info">
          <span className="mobile-sonic-daw__current-time">{formatTime(currentTime)}</span>
          <span className="mobile-sonic-daw__time-separator">/</span>
          <span className="mobile-sonic-daw__total-time">{formatTime(duration)}</span>
        </div>
        <div className="mobile-sonic-daw__tempo-info">
          <span className="mobile-sonic-daw__bpm">{bpm} BPM</span>
          <span className="mobile-sonic-daw__time-signature">{timeSignature}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="mobile-sonic-daw__content">
        {activeView === 'timeline' && (
          <div className="mobile-sonic-daw__timeline-view">
            <div className="mobile-sonic-daw__timeline-header">
              <h3>📊 Timeline</h3>
              <TouchOptimizedButton
                variant="secondary"
                size="sm"
                onClick={() => {}}
                icon="➕"
                iconPosition="left"
                haptic={true}
                nexus={true}
              >
                Add Track
              </TouchOptimizedButton>
            </div>

            <div className="mobile-sonic-daw__timeline-tracks">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className={cn(
                    'mobile-sonic-daw__track',
                    { 'mobile-sonic-daw__track--selected': selectedTrack === track.id }
                  )}
                >
                  <div className="mobile-sonic-daw__track-header">
                    <TouchOptimizedButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTrack(track.id)}
                      icon={track.type === 'audio' ? '🎵' : '🎹'}
                      iconPosition="left"
                      haptic={true}
                    >
                      {track.name}
                    </TouchOptimizedButton>
                  </div>

                  <div className="mobile-sonic-daw__track-controls">
                    <TouchOptimizedButton
                      variant={track.muted ? 'danger' : 'ghost'}
                      size="sm"
                      onClick={() => setTracks(prev => prev.map(t => 
                        t.id === track.id ? { ...t, muted: !t.muted } : t
                      ))}
                      icon="🔇"
                      haptic={true}
                    />
                    <TouchOptimizedButton
                      variant={track.solo ? 'warning' : 'ghost'}
                      size="sm"
                      onClick={() => setTracks(prev => prev.map(t => 
                        t.id === track.id ? { ...t, solo: !t.solo } : t
                      ))}
                      icon="🎧"
                      haptic={true}
                    />
                    <TouchOptimizedButton
                      variant="ghost"
                      size="sm"
                      onClick={() => {}}
                      icon="🎤"
                      haptic={true}
                    />
                  </div>

                  <div className="mobile-sonic-daw__track-regions">
                    <div className="mobile-sonic-daw__region">
                      <span className="mobile-sonic-daw__region-name">Region 1</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'mixer' && (
          <div className="mobile-sonic-daw__mixer-view">
            <div className="mobile-sonic-daw__mixer-header">
              <h3>🎚️ Mixer</h3>
            </div>

            <div className="mobile-sonic-daw__mixer-channels">
              {tracks.map((track) => (
                <div key={track.id} className="mobile-sonic-daw__channel">
                  <div className="mobile-sonic-daw__channel-header">
                    <span className="mobile-sonic-daw__channel-name">{track.name}</span>
                    <TouchOptimizedButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setTracks(prev => prev.map(t => 
                        t.id === track.id ? { ...t, muted: !t.muted } : t
                      ))}
                      icon={track.muted ? "🔇" : "🔊"}
                      haptic={true}
                    />
                  </div>

                  <div className="mobile-sonic-daw__channel-fader">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={track.volume}
                      onChange={(e) => setTracks(prev => prev.map(t => 
                        t.id === track.id ? { ...t, volume: parseFloat(e.target.value) } : t
                      ))}
                      className="mobile-sonic-daw__volume-fader"
                    />
                    <span className="mobile-sonic-daw__volume-value">
                      {Math.round(track.volume * 100)}%
                    </span>
                  </div>

                  <div className="mobile-sonic-daw__channel-pan">
                    <input
                      type="range"
                      min="-1"
                      max="1"
                      step="0.1"
                      value={track.pan}
                      onChange={(e) => setTracks(prev => prev.map(t => 
                        t.id === track.id ? { ...t, pan: parseFloat(e.target.value) } : t
                      ))}
                      className="mobile-sonic-daw__pan-fader"
                    />
                    <span className="mobile-sonic-daw__pan-value">
                      {track.pan > 0 ? `R${Math.round(track.pan * 100)}` : 
                       track.pan < 0 ? `L${Math.round(Math.abs(track.pan) * 100)}` : 'C'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'plugins' && (
          <div className="mobile-sonic-daw__plugins-view">
            <div className="mobile-sonic-daw__plugins-header">
              <h3>🔌 Plugins</h3>
            </div>

            <div className="mobile-sonic-daw__plugins-list">
              {plugins.map((plugin) => (
                <div key={plugin.id} className="mobile-sonic-daw__plugin">
                  <div className="mobile-sonic-daw__plugin-info">
                    <span className="mobile-sonic-daw__plugin-name">{plugin.name}</span>
                    <span className="mobile-sonic-daw__plugin-category">{plugin.category}</span>
                  </div>
                  <TouchOptimizedButton
                    variant={plugin.active ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setPlugins(prev => prev.map(p => 
                      p.id === plugin.id ? { ...p, active: !p.active } : p
                    ))}
                    icon={plugin.active ? "✅" : "➕"}
                    haptic={true}
                    nexus={plugin.active}
                  >
                    {plugin.active ? 'Active' : 'Add'}
                  </TouchOptimizedButton>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'browser' && (
          <div className="mobile-sonic-daw__browser-view">
            <div className="mobile-sonic-daw__browser-header">
              <h3>📁 Browser</h3>
            </div>

            <div className="mobile-sonic-daw__browser-content">
              <TouchOptimizedButton
                variant="secondary"
                size="md"
                onClick={() => {}}
                icon="📁"
                iconPosition="left"
                fullWidth={true}
                haptic={true}
                nexus={true}
              >
                Browse Samples
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
                Browse Loops
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
                Browse Instruments
              </TouchOptimizedButton>
            </div>
          </div>
        )}
      </div>

      {/* Visualizer */}
      <div className="mobile-sonic-daw__visualizer">
        <canvas
          ref={canvasRef}
          className="mobile-sonic-daw__canvas"
          width={deviceInfo.width}
          height={150}
        />
      </div>
    </MobileLayout>
  );
}

// Hook for mobile DAW controls
export function useMobileDAWControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240);
  const [bpm, setBpm] = useState(120);
  const [timeSignature, setTimeSignature] = useState('4/4');

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const stop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };
  const record = () => setIsRecording(true);
  const stopRecording = () => setIsRecording(false);

  const setBpmLevel = (level: number) => setBpm(Math.max(60, Math.min(200, level)));
  const setTimeLevel = (level: number) => setCurrentTime(Math.max(0, Math.min(duration, level)));

  return {
    isPlaying,
    isRecording,
    currentTime,
    duration,
    bpm,
    timeSignature,
    play,
    pause,
    stop,
    record,
    stopRecording,
    setBpmLevel,
    setTimeLevel,
    setCurrentTime,
    setDuration,
    setBpm,
    setTimeSignature
  };
}

// Hook for mobile track management
export function useMobileTrackManagement() {
  const [tracks, setTracks] = useState([
    { id: 1, name: 'Track 1', type: 'audio', muted: false, solo: false, volume: 0.8, pan: 0 },
    { id: 2, name: 'Track 2', type: 'midi', muted: false, solo: false, volume: 0.8, pan: 0 }
  ]);
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);

  const addTrack = (type: 'audio' | 'midi') => {
    const newTrack = {
      id: tracks.length + 1,
      name: `Track ${tracks.length + 1}`,
      type,
      muted: false,
      solo: false,
      volume: 0.8,
      pan: 0
    };
    setTracks(prev => [...prev, newTrack]);
  };

  const removeTrack = (id: number) => {
    setTracks(prev => prev.filter(track => track.id !== id));
    if (selectedTrack === id) {
      setSelectedTrack(null);
    }
  };

  const updateTrack = (id: number, updates: Partial<typeof tracks[0]>) => {
    setTracks(prev => prev.map(track => 
      track.id === id ? { ...track, ...updates } : track
    ));
  };

  return {
    tracks,
    selectedTrack,
    setSelectedTrack,
    addTrack,
    removeTrack,
    updateTrack
  };
}