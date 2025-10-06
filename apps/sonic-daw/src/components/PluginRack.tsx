import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSonicStore } from '../store/useSonicStore';
import { SONIC_PLUGINS, CATEGORY_COLORS } from '../types/sonicPlugins';

export const PluginRack: React.FC = () => {
  const {
    selectedTrackId,
    tracks,
    addPluginToTrack,
    removePluginFromTrack,
    updatePluginParameter
  } = useSonicStore();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPlugin, setSelectedPlugin] = useState<string | null>(null);

  const selectedTrack = tracks.find(t => t.id === selectedTrackId);

  const categories = Array.from(new Set(SONIC_PLUGINS.map(p => p.category)));
  const filteredPlugins = selectedCategory 
    ? SONIC_PLUGINS.filter(p => p.category === selectedCategory)
    : SONIC_PLUGINS;

  const handleAddPlugin = (pluginId: string) => {
    if (selectedTrackId) {
      addPluginToTrack(selectedTrackId, pluginId);
    }
  };

  const handleRemovePlugin = (pluginId: string) => {
    if (selectedTrackId) {
      removePluginFromTrack(selectedTrackId, pluginId);
    }
  };

  const handleParameterChange = (pluginId: string, parameterId: string, value: any) => {
    if (selectedTrackId) {
      updatePluginParameter(selectedTrackId, pluginId, parameterId, value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="plugin-rack"
    >
      <div className="plugin-rack-header">
        <h3 className="plugin-rack-title">PLUGIN RACK</h3>
        {selectedTrack && (
          <div className="selected-track">
            <div 
              className="track-color-indicator" 
              style={{ backgroundColor: selectedTrack.color }}
            ></div>
            <span>{selectedTrack.name}</span>
          </div>
        )}
      </div>

      {!selectedTrack ? (
        <div className="no-track-selected">
          <div className="no-track-icon">🎵</div>
          <h3>Select a track</h3>
          <p>Choose a track to add plugins</p>
        </div>
      ) : (
        <div className="plugin-rack-content">
          {/* Plugin Browser */}
          <div className="plugin-browser">
            <div className="category-filters">
              <button
                className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                ALL
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                  style={{ 
                    borderColor: selectedCategory === category ? CATEGORY_COLORS[category] : 'transparent',
                    color: selectedCategory === category ? CATEGORY_COLORS[category] : 'inherit'
                  }}
                >
                  {category.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="plugin-list">
              {filteredPlugins.map(plugin => (
                <motion.div
                  key={plugin.id}
                  className="plugin-item"
                  onClick={() => setSelectedPlugin(plugin.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="plugin-icon" 
                    style={{ backgroundColor: plugin.color }}
                  >
                    {plugin.icon}
                  </div>
                  <div className="plugin-info">
                    <div className="plugin-name">{plugin.name}</div>
                    <div className="plugin-description">{plugin.description}</div>
                    <div className="plugin-author">{plugin.author}</div>
                  </div>
                  <button
                    className="add-plugin-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddPlugin(plugin.id);
                    }}
                  >
                    +
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Active Plugins */}
          <div className="active-plugins">
            <h4 className="active-plugins-title">ACTIVE PLUGINS</h4>
            <div className="active-plugins-list">
              {selectedTrack.plugins.map((plugin, index) => (
                <motion.div
                  key={plugin.id}
                  className="active-plugin"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="active-plugin-header">
                    <div 
                      className="plugin-color-bar" 
                      style={{ backgroundColor: plugin.color }}
                    ></div>
                    <div className="plugin-name">{plugin.name}</div>
                    <button
                      className="remove-plugin-btn"
                      onClick={() => handleRemovePlugin(plugin.id)}
                    >
                      ×
                    </button>
                  </div>

                  <div className="plugin-parameters">
                    {plugin.parameters.map(parameter => (
                      <div key={parameter.id} className="parameter-control">
                        <label className="parameter-label">
                          {parameter.name}
                          {parameter.unit && <span className="parameter-unit">{parameter.unit}</span>}
                        </label>
                        
                        {parameter.type === 'float' || parameter.type === 'int' ? (
                          <div className="parameter-slider">
                            <input
                              type="range"
                              min={parameter.min}
                              max={parameter.max}
                              value={parameter.currentValue}
                              onChange={(e) => handleParameterChange(
                                plugin.id, 
                                parameter.id, 
                                parameter.type === 'int' ? parseInt(e.target.value) : parseFloat(e.target.value)
                              )}
                              className="slider"
                            />
                            <div className="parameter-value">{parameter.currentValue}</div>
                          </div>
                        ) : parameter.type === 'enum' ? (
                          <select
                            value={parameter.currentValue}
                            onChange={(e) => handleParameterChange(plugin.id, parameter.id, e.target.value)}
                            className="parameter-select"
                          >
                            {parameter.options?.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : parameter.type === 'boolean' ? (
                          <button
                            className={`parameter-toggle ${parameter.currentValue ? 'active' : ''}`}
                            onClick={() => handleParameterChange(plugin.id, parameter.id, !parameter.currentValue)}
                          >
                            {parameter.currentValue ? 'ON' : 'OFF'}
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>

                  {/* Plugin Presets */}
                  {plugin.presets.length > 0 && (
                    <div className="plugin-presets">
                      <label className="presets-label">PRESETS</label>
                      <select className="presets-select">
                        <option value="">Select Preset</option>
                        {plugin.presets.map(preset => (
                          <option key={preset.id} value={preset.id}>
                            {preset.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </motion.div>
              ))}

              {selectedTrack.plugins.length === 0 && (
                <div className="no-plugins">
                  <div className="no-plugins-icon">🎛️</div>
                  <p>No plugins loaded</p>
                  <p>Add plugins from the browser</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};