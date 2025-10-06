import React from 'react';
import { motion } from 'framer-motion';
import { useSonicStore } from '../store/useSonicStore';

export const Mixer: React.FC = () => {
  const {
    mixerChannels,
    tracks,
    selectedTrackId,
    selectTrack
  } = useSonicStore();

  const handleVolumeChange = (channelId: string, volume: number) => {
    // Update volume logic would go here
    console.log(`Volume changed for ${channelId}: ${volume}`);
  };

  const handlePanChange = (channelId: string, pan: number) => {
    // Update pan logic would go here
    console.log(`Pan changed for ${channelId}: ${pan}`);
  };

  const toggleMute = (channelId: string) => {
    // Toggle mute logic would go here
    console.log(`Mute toggled for ${channelId}`);
  };

  const toggleSolo = (channelId: string) => {
    // Toggle solo logic would go here
    console.log(`Solo toggled for ${channelId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mixer-container"
    >
      <div className="mixer-header">
        <h3 className="mixer-title">MIXER</h3>
        <div className="mixer-controls">
          <button className="mixer-btn">MASTER</button>
          <button className="mixer-btn">AUX</button>
          <button className="mixer-btn">FX</button>
        </div>
      </div>

      <div className="mixer-channels">
        {/* Master Channel */}
        <div className="mixer-channel master-channel">
          <div className="channel-header">
            <div className="channel-name">MASTER</div>
            <div className="channel-controls">
              <button className="channel-btn">M</button>
              <button className="channel-btn">S</button>
            </div>
          </div>
          
          <div className="channel-fader">
            <div className="fader-track">
              <div className="fader-handle" style={{ bottom: '50%' }}></div>
            </div>
            <div className="fader-value">0.0</div>
          </div>
          
          <div className="channel-meter">
            <div className="meter-track">
              <div className="meter-bar" style={{ height: '60%' }}></div>
            </div>
            <div className="meter-labels">
              <span>0</span>
              <span>-6</span>
              <span>-12</span>
              <span>-18</span>
            </div>
          </div>
        </div>

        {/* Track Channels */}
        {mixerChannels.map((channel, index) => {
          const track = tracks.find(t => t.id === channel.trackId);
          if (!track) return null;

          return (
            <motion.div
              key={channel.id}
              className={`mixer-channel ${selectedTrackId === track.id ? 'selected' : ''}`}
              onClick={() => selectTrack(track.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Channel Header */}
              <div className="channel-header">
                <div className="channel-name">{track.name}</div>
                <div className="channel-controls">
                  <button
                    className={`channel-btn mute-btn ${track.mute ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute(channel.id);
                    }}
                  >
                    M
                  </button>
                  <button
                    className={`channel-btn solo-btn ${track.solo ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSolo(channel.id);
                    }}
                  >
                    S
                  </button>
                  <button
                    className={`channel-btn record-btn ${track.isRecording ? 'active' : ''}`}
                  >
                    R
                  </button>
                </div>
              </div>

              {/* Channel Color */}
              <div 
                className="channel-color" 
                style={{ backgroundColor: track.color }}
              ></div>

              {/* Volume Fader */}
              <div className="channel-fader">
                <div className="fader-track">
                  <div 
                    className="fader-handle" 
                    style={{ bottom: `${track.volume * 100}%` }}
                  ></div>
                </div>
                <div className="fader-value">
                  {Math.round(track.volume * 100)}
                </div>
              </div>

              {/* Pan Control */}
              <div className="channel-pan">
                <div className="pan-track">
                  <div 
                    className="pan-handle" 
                    style={{ left: `${50 + track.pan * 50}%` }}
                  ></div>
                </div>
                <div className="pan-labels">
                  <span>L</span>
                  <span>C</span>
                  <span>R</span>
                </div>
              </div>

              {/* Channel Meter */}
              <div className="channel-meter">
                <div className="meter-track">
                  <div className="meter-bar" style={{ height: '45%' }}></div>
                </div>
                <div className="meter-labels">
                  <span>0</span>
                  <span>-6</span>
                  <span>-12</span>
                  <span>-18</span>
                </div>
              </div>

              {/* Plugin Slots */}
              <div className="plugin-slots">
                {track.plugins.slice(0, 4).map((plugin, pluginIndex) => (
                  <div
                    key={plugin.id}
                    className={`plugin-slot ${plugin.isActive ? 'active' : ''}`}
                    style={{ backgroundColor: plugin.color }}
                    title={plugin.name}
                  >
                    {plugin.icon}
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 4 - track.plugins.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="plugin-slot empty">
                    +
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* Empty State */}
        {mixerChannels.length === 0 && (
          <motion.div
            className="empty-mixer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="empty-icon">🎛️</div>
            <h3>No channels</h3>
            <p>Add tracks to see them in the mixer</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};