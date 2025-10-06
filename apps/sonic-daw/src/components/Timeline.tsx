import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSonicStore } from '../store/useSonicStore';

export const Timeline: React.FC = () => {
  const {
    tracks,
    timelineRegions,
    playheadPosition,
    selectedTrackId,
    selectTrack,
    setPlayheadPosition
  } = useSonicStore();

  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const timelineWidth = rect.width;
      const newPosition = (x / timelineWidth) * 120; // 120 seconds max
      setPlayheadPosition(newPosition);
    }
  };

  const handleTrackClick = (trackId: string) => {
    selectTrack(trackId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="timeline-container"
    >
      {/* Timeline Header */}
      <div className="timeline-header">
        <div className="track-header">
          <span className="track-label">TRACKS</span>
        </div>
        <div className="time-ruler">
          {Array.from({ length: 13 }, (_, i) => (
            <div key={i} className="time-marker">
              <span className="time-label">{i * 10}s</span>
              <div className="time-line"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="timeline-content" ref={timelineRef} onClick={handleTimelineClick}>
        {/* Playhead */}
        <div
          className="playhead"
          style={{ left: `${(playheadPosition / 120) * 100}%` }}
        >
          <div className="playhead-line"></div>
          <div className="playhead-handle"></div>
        </div>

        {/* Tracks */}
        <div className="tracks-container">
          {tracks.map((track, index) => (
            <motion.div
              key={track.id}
              className={`track ${selectedTrackId === track.id ? 'selected' : ''}`}
              onClick={() => handleTrackClick(track.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Track Info */}
              <div className="track-info">
                <div className="track-color" style={{ backgroundColor: track.color }}></div>
                <div className="track-name">{track.name}</div>
                <div className="track-controls">
                  <button
                    className={`track-btn mute-btn ${track.mute ? 'active' : ''}`}
                    title="Mute"
                  >
                    M
                  </button>
                  <button
                    className={`track-btn solo-btn ${track.solo ? 'active' : ''}`}
                    title="Solo"
                  >
                    S
                  </button>
                  <button
                    className={`track-btn record-btn ${track.isRecording ? 'active' : ''}`}
                    title="Record"
                  >
                    R
                  </button>
                </div>
              </div>

              {/* Track Lane */}
              <div className="track-lane">
                {/* Regions */}
                {timelineRegions
                  .filter(region => region.trackId === track.id)
                  .map((region) => (
                    <motion.div
                      key={region.id}
                      className="region"
                      style={{
                        left: `${(region.startTime / 120) * 100}%`,
                        width: `${((region.endTime - region.startTime) / 120) * 100}%`,
                        backgroundColor: region.color
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="region-name">{region.name}</span>
                    </motion.div>
                  ))}

                {/* Waveform Placeholder */}
                {!timelineRegions.some(region => region.trackId === track.id) && (
                  <div className="waveform-placeholder">
                    <div className="waveform-line"></div>
                    <div className="waveform-line"></div>
                    <div className="waveform-line"></div>
                    <div className="waveform-line"></div>
                    <div className="waveform-line"></div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Empty State */}
          {tracks.length === 0 && (
            <motion.div
              className="empty-timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="empty-icon">🎵</div>
              <h3>No tracks yet</h3>
              <p>Add your first track to start creating music</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};