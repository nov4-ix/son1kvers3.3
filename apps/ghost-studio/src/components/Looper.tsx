import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoopLayer {
  id: string;
  name: string;
  audioData: Blob | null;
  duration: number;
  volume: number;
  mute: boolean;
  solo: boolean;
  color: string;
  isRecording: boolean;
  waveform?: number[];
}

interface LooperProps {
  onLoopCreated?: (loop: LoopLayer) => void;
  onLoopExported?: (loop: LoopLayer) => void;
}

export const Looper: React.FC<LooperProps> = ({ 
  onLoopCreated, 
  onLoopExported 
}) => {
  const [layers, setLayers] = useState<LoopLayer[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<string | null>(null);
  const [loopLength, setLoopLength] = useState(4); // in beats
  const [currentBeat, setCurrentBeat] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [metronome, setMetronome] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const loopIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const metronomeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  // Beat counter for loop
  useEffect(() => {
    if (isPlaying) {
      const beatDuration = (60 / bpm) * 1000; // ms per beat
      loopIntervalRef.current = setInterval(() => {
        setCurrentBeat(prev => (prev + 1) % loopLength);
      }, beatDuration);
    } else {
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
      }
    }

    return () => {
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
      }
    };
  }, [isPlaying, bpm, loopLength]);

  // Metronome
  useEffect(() => {
    if (metronome && isPlaying) {
      const beatDuration = (60 / bpm) * 1000;
      metronomeIntervalRef.current = setInterval(() => {
        // Create metronome click
        if (audioContextRef.current) {
          const oscillator = audioContextRef.current.createOscillator();
          const gainNode = audioContextRef.current.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContextRef.current.destination);
          
          oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
          gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);
          
          oscillator.start(audioContextRef.current.currentTime);
          oscillator.stop(audioContextRef.current.currentTime + 0.1);
        }
      }, beatDuration);
    } else {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
      }
    }

    return () => {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
      }
    };
  }, [metronome, isPlaying, bpm]);

  const addLayer = () => {
    const layerId = `layer_${Date.now()}`;
    const newLayer: LoopLayer = {
      id: layerId,
      name: `Layer ${layers.length + 1}`,
      audioData: null,
      duration: 0,
      volume: 0.8,
      mute: false,
      solo: false,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      isRecording: false
    };
    
    setLayers(prev => [...prev, newLayer]);
    setCurrentLayer(layerId);
  };

  const removeLayer = (layerId: string) => {
    setLayers(prev => prev.filter(l => l.id !== layerId));
    if (currentLayer === layerId) {
      setCurrentLayer(layers.length > 1 ? layers[0].id : null);
    }
  };

  const startRecording = async () => {
    if (!currentLayer) {
      alert('Please select a layer to record');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      const chunks: BlobPart[] = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        
        setLayers(prev => prev.map(layer => 
          layer.id === currentLayer
            ? { 
                ...layer, 
                audioData: blob, 
                duration: (loopLength * 60) / bpm,
                isRecording: false
              }
            : layer
        ));
        
        if (onLoopCreated) {
          const layer = layers.find(l => l.id === currentLayer);
          if (layer) {
            onLoopCreated({ ...layer, audioData: blob });
          }
        }
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Update layer recording state
      setLayers(prev => prev.map(layer => 
        layer.id === currentLayer
          ? { ...layer, isRecording: true }
          : layer
      ));
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      setLayers(prev => prev.map(layer => 
        layer.id === currentLayer
          ? { ...layer, isRecording: false }
          : layer
      ));
    }
  };

  const play = () => {
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const stop = () => {
    setIsPlaying(false);
    setCurrentBeat(0);
  };

  const overdub = () => {
    if (currentLayer && layers.find(l => l.id === currentLayer)?.audioData) {
      startRecording();
    } else {
      alert('Please record a base layer first');
    }
  };

  const clearLayer = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId
        ? { ...layer, audioData: null, duration: 0 }
        : layer
    ));
  };

  const toggleLayerMute = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId
        ? { ...layer, mute: !layer.mute }
        : layer
    ));
  };

  const toggleLayerSolo = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId
        ? { ...layer, solo: !layer.solo }
        : layer
    ));
  };

  const updateLayerVolume = (layerId: string, volume: number) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId
        ? { ...layer, volume }
        : layer
    ));
  };

  const selectedLayer = layers.find(l => l.id === currentLayer);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="looper"
    >
      {/* Looper Header */}
      <div className="looper-header">
        <h3 className="looper-title">🔄 Looper</h3>
        <div className="looper-actions">
          <button
            className="action-btn"
            onClick={addLayer}
            title="Add Layer"
          >
            ➕ Layer
          </button>
        </div>
      </div>

      {/* Loop Controls */}
      <div className="loop-controls">
        <div className="transport-buttons">
          <button
            onClick={stop}
            className="transport-btn stop-btn"
            title="Stop"
          >
            ⏹️
          </button>
          
          <button
            onClick={isPlaying ? pause : play}
            className={`transport-btn play-btn ${isPlaying ? 'playing' : ''}`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`transport-btn record-btn ${isRecording ? 'recording' : ''}`}
            title={isRecording ? 'Stop Recording' : 'Start Recording'}
          >
            🔴
          </button>
          
          <button
            onClick={overdub}
            className="transport-btn overdub-btn"
            title="Overdub"
          >
            🔄
          </button>
        </div>

        <div className="loop-info">
          <div className="beat-display">
            <div className="beat-counter">
              {Array.from({ length: loopLength }, (_, i) => (
                <div
                  key={i}
                  className={`beat-dot ${i === currentBeat ? 'active' : ''}`}
                ></div>
              ))}
            </div>
            <div className="beat-text">
              {currentBeat + 1} / {loopLength}
            </div>
          </div>
          
          <div className="bpm-control">
            <label className="bpm-label">BPM</label>
            <input
              type="number"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value) || 120)}
              className="bpm-input"
              min="60"
              max="200"
            />
          </div>
          
          <div className="loop-length-control">
            <label className="length-label">Length</label>
            <select
              value={loopLength}
              onChange={(e) => setLoopLength(parseInt(e.target.value))}
              className="length-select"
            >
              <option value={1}>1 Beat</option>
              <option value={2}>2 Beats</option>
              <option value={4}>4 Beats</option>
              <option value={8}>8 Beats</option>
              <option value={16}>16 Beats</option>
            </select>
          </div>
          
          <button
            className={`metronome-btn ${metronome ? 'active' : ''}`}
            onClick={() => setMetronome(!metronome)}
            title="Metronome"
          >
            🎵
          </button>
        </div>
      </div>

      {/* Layers */}
      <div className="loop-layers">
        {layers.length === 0 ? (
          <div className="empty-layers">
            <div className="empty-icon">🔄</div>
            <p>No layers yet</p>
            <p>Add layers to start looping</p>
          </div>
        ) : (
          layers.map((layer, index) => (
            <motion.div
              key={layer.id}
              className={`loop-layer ${currentLayer === layer.id ? 'selected' : ''}`}
              onClick={() => setCurrentLayer(layer.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Layer Header */}
              <div className="layer-header">
                <div className="layer-info">
                  <div 
                    className="layer-color" 
                    style={{ backgroundColor: layer.color }}
                  ></div>
                  <div className="layer-name">{layer.name}</div>
                  {layer.isRecording && (
                    <div className="recording-indicator">
                      <div className="pulse-dot"></div>
                      REC
                    </div>
                  )}
                </div>
                
                <div className="layer-controls">
                  <button
                    className={`layer-btn mute-btn ${layer.mute ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerMute(layer.id);
                    }}
                    title="Mute"
                  >
                    M
                  </button>
                  <button
                    className={`layer-btn solo-btn ${layer.solo ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerSolo(layer.id);
                    }}
                    title="Solo"
                  >
                    S
                  </button>
                  <button
                    className="layer-btn clear-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearLayer(layer.id);
                    }}
                    title="Clear Layer"
                  >
                    🗑️
                  </button>
                  <button
                    className="layer-btn remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLayer(layer.id);
                    }}
                    title="Remove Layer"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Layer Content */}
              <div className="layer-content">
                {layer.audioData ? (
                  <div className="layer-waveform">
                    <div className="waveform-visualization">
                      {Array.from({ length: 20 }, (_, i) => (
                        <div
                          key={i}
                          className="waveform-bar"
                          style={{ 
                            height: `${Math.random() * 100}%`,
                            backgroundColor: layer.color
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="layer-duration">
                      {layer.duration.toFixed(1)}s
                    </div>
                  </div>
                ) : (
                  <div className="empty-layer">
                    <span className="empty-text">
                      {layer.isRecording ? 'Recording...' : 'Click record to start'}
                    </span>
                  </div>
                )}
              </div>

              {/* Layer Volume */}
              <div className="layer-volume">
                <label className="volume-label">Vol</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={layer.volume}
                  onChange={(e) => updateLayerVolume(layer.id, parseFloat(e.target.value))}
                  className="volume-slider"
                />
                <span className="volume-value">{Math.round(layer.volume * 100)}%</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Selected Layer Inspector */}
      {selectedLayer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="layer-inspector"
        >
          <h4 className="inspector-title">Layer Inspector</h4>
          
          <div className="inspector-content">
            <div className="property-group">
              <label className="property-label">Layer Name</label>
              <input
                type="text"
                value={selectedLayer.name}
                onChange={(e) => {
                  setLayers(prev => prev.map(layer => 
                    layer.id === selectedLayer.id 
                      ? { ...layer, name: e.target.value }
                      : layer
                  ));
                }}
                className="property-input"
              />
            </div>

            <div className="property-group">
              <label className="property-label">Volume</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={selectedLayer.volume}
                onChange={(e) => updateLayerVolume(selectedLayer.id, parseFloat(e.target.value))}
                className="property-slider"
              />
              <span className="property-value">{Math.round(selectedLayer.volume * 100)}%</span>
            </div>

            {selectedLayer.audioData && (
              <div className="property-group">
                <button
                  className="export-btn"
                  onClick={() => {
                    if (onLoopExported) {
                      onLoopExported(selectedLayer);
                    }
                    // Also create download link
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(selectedLayer.audioData!);
                    link.download = `${selectedLayer.name}.wav`;
                    link.click();
                  }}
                  title="Export Layer"
                >
                  📤 Export Layer
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Recording Status */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="recording-status"
          >
            <div className="recording-indicator">
              <div className="pulse-dot"></div>
              <span>Recording Layer...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};