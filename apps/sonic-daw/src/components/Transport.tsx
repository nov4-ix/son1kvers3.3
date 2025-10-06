import React from 'react';
import { motion } from 'framer-motion';
import { useSonicStore } from '../store/useSonicStore';

export const Transport: React.FC = () => {
  const {
    isPlaying,
    isRecording,
    currentBpm,
    currentTimeSignature,
    playheadPosition,
    play,
    pause,
    stop,
    record,
    setBpm,
    setTimeSignature
  } = useSonicStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="transport-bar"
    >
      <div className="transport-controls">
        {/* Transport Buttons */}
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
            onClick={record}
            className={`transport-btn record-btn ${isRecording ? 'recording' : ''}`}
            title="Record"
          >
            🔴
          </button>
        </div>

        {/* Time Display */}
        <div className="time-display">
          <div className="current-time">
            {formatTime(playheadPosition)}
          </div>
          <div className="time-signature">
            {currentTimeSignature[0]}/{currentTimeSignature[1]}
          </div>
        </div>

        {/* BPM Control */}
        <div className="bpm-control">
          <label className="bpm-label">BPM</label>
          <input
            type="number"
            value={currentBpm}
            onChange={(e) => setBpm(parseInt(e.target.value) || 120)}
            className="bpm-input"
            min="60"
            max="200"
          />
        </div>

        {/* Time Signature Control */}
        <div className="time-signature-control">
          <label className="ts-label">Time Sig</label>
          <div className="ts-inputs">
            <input
              type="number"
              value={currentTimeSignature[0]}
              onChange={(e) => {
                const numerator = parseInt(e.target.value) || 4;
                setTimeSignature([numerator, currentTimeSignature[1]]);
              }}
              className="ts-input"
              min="1"
              max="16"
            />
            <span className="ts-separator">/</span>
            <input
              type="number"
              value={currentTimeSignature[1]}
              onChange={(e) => {
                const denominator = parseInt(e.target.value) || 4;
                setTimeSignature([currentTimeSignature[0], denominator]);
              }}
              className="ts-input"
              min="1"
              max="16"
            />
          </div>
        </div>

        {/* Status Indicators */}
        <div className="status-indicators">
          {isPlaying && (
            <div className="status-indicator playing">
              <div className="pulse-dot"></div>
              PLAYING
            </div>
          )}
          {isRecording && (
            <div className="status-indicator recording">
              <div className="pulse-dot"></div>
              REC
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};