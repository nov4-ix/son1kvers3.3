import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIProcessor } from './AIProcessor';
import { Looper } from './Looper';
import './AIProcessor.css';
import './Looper.css';

interface AudioTrack {
  id: string;
  name: string;
  type: 'audio' | 'midi';
  source: string;
  volume: number;
  pan: number;
  mute: boolean;
  solo: boolean;
  isRecording: boolean;
  waveform?: number[];
  duration: number;
  color: string;
}

interface MiniDAWProps {
  onTrackRecorded?: (track: AudioTrack) => void;
  onTrackProcessed?: (trackId: string, processedAudio: string) => void;
}

export const MiniDAW: React.FC<MiniDAWProps> = ({ 
  onTrackRecorded, 
  onTrackProcessed 
}) => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [currentBpm, setCurrentBpm] = useState(120);
  const [activeView, setActiveView] = useState<'tracks' | 'looper'>('tracks');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const addTrack = (type: 'audio' | 'midi') => {
    const trackId = `track_${Date.now()}`;
    const newTrack: AudioTrack = {
      id: trackId,
      name: `${type === 'audio' ? 'Audio' : 'MIDI'} Track ${tracks.length + 1}`,
      type,
      source: '',
      volume: 0.8,
      pan: 0,
      mute: false,
      solo: false,
      isRecording: false,
      duration: 0,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };
    
    setTracks(prev => [...prev, newTrack]);
    setSelectedTrackId(trackId);
  };

  const removeTrack = (trackId: string) => {
    setTracks(prev => prev.filter(t => t.id !== trackId));
    if (selectedTrackId === trackId) {
      setSelectedTrackId(null);
    }
  };

  const startRecording = async () => {
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
        const audioUrl = URL.createObjectURL(blob);
        
        // Create new track with recorded audio
        const trackId = `track_${Date.now()}`;
        const recordedTrack: AudioTrack = {
          id: trackId,
          name: `Recorded Track ${tracks.length + 1}`,
          type: 'audio',
          source: audioUrl,
          volume: 0.8,
          pan: 0,
          mute: false,
          solo: false,
          isRecording: false,
          duration: playheadPosition,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`
        };
        
        setTracks(prev => [...prev, recordedTrack]);
        setSelectedTrackId(trackId);
        
        if (onTrackRecorded) {
          onTrackRecorded(recordedTrack);
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start playhead movement
      const startTime = Date.now();
      const interval = setInterval(() => {
        setPlayheadPosition((Date.now() - startTime) / 1000);
      }, 100);
      
      // Store interval for cleanup
      (mediaRecorderRef.current as any).interval = interval;
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear interval
      if ((mediaRecorderRef.current as any).interval) {
        clearInterval((mediaRecorderRef.current as any).interval);
      }
    }
  };

  const play = () => {
    setIsPlaying(true);
    // Simulate playback
    const startTime = Date.now();
    const interval = setInterval(() => {
      setPlayheadPosition((Date.now() - startTime) / 1000);
    }, 100);
    
    // Store interval for cleanup
    (window as any).playInterval = interval;
  };

  const pause = () => {
    setIsPlaying(false);
    if ((window as any).playInterval) {
      clearInterval((window as any).playInterval);
    }
  };

  const stop = () => {
    setIsPlaying(false);
    setPlayheadPosition(0);
    if ((window as any).playInterval) {
      clearInterval((window as any).playInterval);
    }
  };

  const processWithAI = async (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    // Simulate AI processing
    const processedAudio = `processed_${track.source}`;
    
    if (onTrackProcessed) {
      onTrackProcessed(trackId, processedAudio);
    }
    
    // Update track with processed audio
    setTracks(prev => prev.map(t => 
      t.id === trackId 
        ? { ...t, source: processedAudio, name: `AI Processed - ${t.name}` }
        : t
    ));
  };

  const selectedTrack = tracks.find(t => t.id === selectedTrackId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mini-daw"
    >
      {/* Mini DAW Header */}
      <div className="mini-daw-header">
        <h3 className="mini-daw-title">🎛️ Mini DAW</h3>
        <div className="mini-daw-actions">
          <button
            className={`view-btn ${activeView === 'tracks' ? 'active' : ''}`}
            onClick={() => setActiveView('tracks')}
            title="Tracks View"
          >
            🎵 Tracks
          </button>
          <button
            className={`view-btn ${activeView === 'looper' ? 'active' : ''}`}
            onClick={() => setActiveView('looper')}
            title="Looper View"
          >
            🔄 Looper
          </button>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="mini-transport">
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
        </div>

        <div className="transport-info">
          <div className="time-display">
            {Math.floor(playheadPosition / 60)}:{(playheadPosition % 60).toFixed(1).padStart(4, '0')}
          </div>
          <div className="bpm-display">
            {currentBpm} BPM
          </div>
        </div>
      </div>

      {/* Content based on active view */}
      {activeView === 'tracks' ? (
        <div className="mini-tracks">
          <div className="tracks-header">
            <h4 className="tracks-title">Audio Tracks</h4>
            <div className="tracks-actions">
              <button
                className="action-btn"
                onClick={() => addTrack('audio')}
                title="Add Audio Track"
              >
                🎤 Audio
              </button>
              <button
                className="action-btn"
                onClick={() => addTrack('midi')}
                title="Add MIDI Track"
              >
                🎹 MIDI
              </button>
            </div>
          </div>

          {tracks.length === 0 ? (
            <div className="empty-tracks">
              <div className="empty-icon">🎵</div>
              <p>No tracks yet</p>
              <p>Add tracks to start recording</p>
            </div>
          ) : (
            tracks.map((track, index) => (
            <motion.div
              key={track.id}
              className={`mini-track ${selectedTrackId === track.id ? 'selected' : ''}`}
              onClick={() => setSelectedTrackId(track.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Track Header */}
              <div className="track-header">
                <div className="track-info">
                  <div 
                    className="track-color" 
                    style={{ backgroundColor: track.color }}
                  ></div>
                  <div className="track-name">{track.name}</div>
                </div>
                
                <div className="track-controls">
                  <button
                    className={`track-btn mute-btn ${track.mute ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTracks(prev => prev.map(t => 
                        t.id === track.id ? { ...t, mute: !t.mute } : t
                      ));
                    }}
                    title="Mute"
                  >
                    M
                  </button>
                  <button
                    className={`track-btn solo-btn ${track.solo ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTracks(prev => prev.map(t => 
                        t.id === track.id ? { ...t, solo: !t.solo } : t
                      ));
                    }}
                    title="Solo"
                  >
                    S
                  </button>
                  <button
                    className="track-btn remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTrack(track.id);
                    }}
                    title="Remove Track"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Track Lane */}
              <div className="track-lane">
                {track.source ? (
                  <div className="audio-region">
                    <div className="region-waveform">
                      <div className="waveform-bar"></div>
                      <div className="waveform-bar"></div>
                      <div className="waveform-bar"></div>
                      <div className="waveform-bar"></div>
                      <div className="waveform-bar"></div>
                    </div>
                    <div className="region-info">
                      <span className="region-name">{track.name}</span>
                      <span className="region-duration">{track.duration.toFixed(1)}s</span>
                    </div>
                  </div>
                ) : (
                  <div className="empty-lane">
                    <span className="empty-text">Click record to start</span>
                  </div>
                )}
              </div>

              {/* Track Actions */}
              <div className="track-actions">
                <button
                  className="action-btn process-btn"
                  onClick={() => processWithAI(track.id)}
                  disabled={!track.source}
                  title="Process with AI"
                >
                  🤖 Process with AI
                </button>
                
                {track.source && (
                  <button
                    className="action-btn export-btn"
                    onClick={() => {
                      // Simulate export
                      const link = document.createElement('a');
                      link.href = track.source;
                      link.download = `${track.name}.wav`;
                      link.click();
                    }}
                    title="Export Track"
                  >
                    📤 Export
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
        </div>
      ) : (
        <Looper
          onLoopCreated={(loop) => {
            console.log('Loop created:', loop);
            // Convert loop to track
            const track: AudioTrack = {
              id: `track_${Date.now()}`,
              name: loop.name,
              type: 'audio',
              source: loop.audioData ? URL.createObjectURL(loop.audioData) : '',
              volume: loop.volume,
              pan: 0,
              mute: loop.mute,
              solo: loop.solo,
              isRecording: false,
              duration: loop.duration,
              color: loop.color
            };
            setTracks(prev => [...prev, track]);
            setSelectedTrackId(track.id);
          }}
          onLoopExported={(loop) => {
            console.log('Loop exported:', loop);
            // Handle loop export
          }}
        />
      )}

      {/* Selected Track Inspector */}
      {selectedTrack && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="track-inspector"
        >
          <h4 className="inspector-title">Track Inspector</h4>
          
          <div className="inspector-content">
            <div className="property-group">
              <label className="property-label">Volume</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={selectedTrack.volume}
                onChange={(e) => {
                  setTracks(prev => prev.map(t => 
                    t.id === selectedTrack.id 
                      ? { ...t, volume: parseFloat(e.target.value) }
                      : t
                  ));
                }}
                className="property-slider"
              />
              <span className="property-value">{Math.round(selectedTrack.volume * 100)}%</span>
            </div>

            <div className="property-group">
              <label className="property-label">Pan</label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={selectedTrack.pan}
                onChange={(e) => {
                  setTracks(prev => prev.map(t => 
                    t.id === selectedTrack.id 
                      ? { ...t, pan: parseFloat(e.target.value) }
                      : t
                  ));
                }}
                className="property-slider"
              />
              <span className="property-value">{selectedTrack.pan.toFixed(2)}</span>
            </div>

            <div className="property-group">
              <label className="property-label">Track Name</label>
              <input
                type="text"
                value={selectedTrack.name}
                onChange={(e) => {
                  setTracks(prev => prev.map(t => 
                    t.id === selectedTrack.id 
                      ? { ...t, name: e.target.value }
                      : t
                  ));
                }}
                className="property-input"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Processor for Selected Track */}
      {selectedTrack && selectedTrack.source && (
        <AIProcessor
          track={selectedTrack}
          onProcessingComplete={(processedTrack) => {
            setTracks(prev => prev.map(t => 
              t.id === processedTrack.id ? processedTrack : t
            ));
          }}
        />
      )}

      {/* AI Processing Status */}
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
              <span>Recording...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};