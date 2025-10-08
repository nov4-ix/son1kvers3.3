import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SON1KVERSE_LORE, MODULES_LORE } from '../lib/lore';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userFaction, setUserFaction] = useState<'ALVAE' | 'Resistencia' | 'Neutral'>('Neutral');
  const [preferredEra, setPreferredEra] = useState('Nexus Era');

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: '👤' },
    { id: 'lore', label: 'Lore', icon: '📚' },
    { id: 'preferences', label: 'Preferencias', icon: '⚙️' },
    { id: 'connections', label: 'Conexiones', icon: '🔗' }
  ];

  const handleFactionChange = (faction: 'ALVAE' | 'Resistencia' | 'Neutral') => {
    setUserFaction(faction);
    // Aquí se podría guardar la preferencia del usuario
  };

  return (
    <div className="settings-container">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-cyan mb-2">
            ⚙️ Configuración
          </h1>
          <p className="text-accent text-lg">
            Personaliza tu experiencia en el Son1kVerse
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="settings-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2 className="text-2xl font-bold text-cyan mb-6">
                Perfil de Usuario
              </h2>
              <div className="profile-settings">
                <div className="setting-group">
                  <label className="setting-label">Nombre de Usuario</label>
                  <input
                    type="text"
                    placeholder="Tu nombre en el Son1kVerse"
                    className="setting-input"
                  />
                </div>
                <div className="setting-group">
                  <label className="setting-label">Bio</label>
                  <textarea
                    placeholder="Cuéntanos sobre tu creatividad..."
                    className="setting-textarea"
                    rows={3}
                  />
                </div>
                <div className="setting-group">
                  <label className="setting-label">Avatar</label>
                  <div className="avatar-selector">
                    <div className="avatar-option">🤖</div>
                    <div className="avatar-option">🎵</div>
                    <div className="avatar-option">🎭</div>
                    <div className="avatar-option">🚀</div>
                    <div className="avatar-option">🏛️</div>
                    <div className="avatar-option">🌀</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lore' && (
            <div className="settings-section">
              <h2 className="text-2xl font-bold text-cyan mb-6">
                Configuración de Lore
              </h2>
              <div className="lore-settings">
                <div className="setting-group">
                  <label className="setting-label">Alineación de Facción</label>
                  <div className="faction-selector">
                    {Object.entries(SON1KVERSE_LORE.factions).map(([key, faction]) => (
                      <div
                        key={key}
                        className={`faction-option ${userFaction === key ? 'selected' : ''}`}
                        onClick={() => handleFactionChange(key as any)}
                      >
                        <div className="faction-icon" style={{ color: faction.color === 'cyan' ? '#00FFE7' : '#B84DFF' }}>
                          {key === 'ALVAE' ? '🤖' : '👥'}
                        </div>
                        <div className="faction-info">
                          <h3 className="faction-name">{faction.name}</h3>
                          <p className="faction-description">{faction.description}</p>
                          <p className="faction-philosophy">"{faction.philosophy}"</p>
                        </div>
                      </div>
                    ))}
                    <div
                      className={`faction-option ${userFaction === 'Neutral' ? 'selected' : ''}`}
                      onClick={() => handleFactionChange('Neutral')}
                    >
                      <div className="faction-icon" style={{ color: '#9AF7EE' }}>⚖️</div>
                      <div className="faction-info">
                        <h3 className="faction-name">Neutral</h3>
                        <p className="faction-description">Colaborador independiente</p>
                        <p className="faction-philosophy">"La creatividad trasciende las facciones"</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="setting-group">
                  <label className="setting-label">Era Preferida</label>
                  <select
                    value={preferredEra}
                    onChange={(e) => setPreferredEra(e.target.value)}
                    className="setting-select"
                  >
                    {Object.entries(SON1KVERSE_LORE.timeline).map(([era, info]) => (
                      <option key={era} value={era}>
                        {era}: {info.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="setting-group">
                  <label className="setting-label">Módulos de Interés</label>
                  <div className="modules-interest">
                    {MODULES_LORE.map((module) => (
                      <div key={module.id} className="module-interest-item">
                        <input
                          type="checkbox"
                          id={module.id}
                          defaultChecked
                          className="module-checkbox"
                        />
                        <label htmlFor={module.id} className="module-interest-label">
                          <span className="module-interest-name">{module.name}</span>
                          <span className="module-interest-faction">{module.faction}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="settings-section">
              <h2 className="text-2xl font-bold text-cyan mb-6">
                Preferencias de Interfaz
              </h2>
              <div className="preferences-settings">
                <div className="setting-group">
                  <label className="setting-label">Tema Visual</label>
                  <div className="theme-selector">
                    <div className="theme-option active">
                      <div className="theme-preview cyberpunk"></div>
                      <span>Cyberpunk</span>
                    </div>
                    <div className="theme-option">
                      <div className="theme-preview matrix"></div>
                      <span>Matrix</span>
                    </div>
                    <div className="theme-option">
                      <div className="theme-preview neon"></div>
                      <span>Neon</span>
                    </div>
                  </div>
                </div>

                <div className="setting-group">
                  <label className="setting-label">Efectos de Sonido</label>
                  <div className="toggle-switch">
                    <input type="checkbox" id="sound-effects" defaultChecked />
                    <label htmlFor="sound-effects">Activar efectos de sonido</label>
                  </div>
                </div>

                <div className="setting-group">
                  <label className="setting-label">Animaciones</label>
                  <div className="toggle-switch">
                    <input type="checkbox" id="animations" defaultChecked />
                    <label htmlFor="animations">Activar animaciones</label>
                  </div>
                </div>

                <div className="setting-group">
                  <label className="setting-label">Pixel Assistant</label>
                  <div className="toggle-switch">
                    <input type="checkbox" id="pixel-assistant" defaultChecked />
                    <label htmlFor="pixel-assistant">Activar asistente Pixel</label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="settings-section">
              <h2 className="text-2xl font-bold text-cyan mb-6">
                Conexiones del NEXUS
              </h2>
              <div className="connections-settings">
                <div className="connection-item">
                  <div className="connection-info">
                    <h3 className="connection-name">Ghost Studio</h3>
                    <p className="connection-status">Conectado</p>
                  </div>
                  <div className="connection-actions">
                    <button className="connection-btn">Configurar</button>
                    <button className="connection-btn secondary">Desconectar</button>
                  </div>
                </div>
                
                <div className="connection-item">
                  <div className="connection-info">
                    <h3 className="connection-name">Clone Station</h3>
                    <p className="connection-status">Conectado</p>
                  </div>
                  <div className="connection-actions">
                    <button className="connection-btn">Configurar</button>
                    <button className="connection-btn secondary">Desconectar</button>
                  </div>
                </div>

                <div className="connection-item">
                  <div className="connection-info">
                    <h3 className="connection-name">Nova Post Pilot</h3>
                    <p className="connection-status">Conectado</p>
                  </div>
                  <div className="connection-actions">
                    <button className="connection-btn">Configurar</button>
                    <button className="connection-btn secondary">Desconectar</button>
                  </div>
                </div>

                <div className="connection-item">
                  <div className="connection-info">
                    <h3 className="connection-name">Sanctuary Social</h3>
                    <p className="connection-status">Conectado</p>
                  </div>
                  <div className="connection-actions">
                    <button className="connection-btn">Configurar</button>
                    <button className="connection-btn secondary">Desconectar</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
