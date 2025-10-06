import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSonicStore } from '../store/useSonicStore';
import { SONIC_PLUGINS } from '../types/sonicPlugins';
import { Transport } from '../components/Transport';
import { Timeline } from '../components/Timeline';
import { Mixer } from '../components/Mixer';
import { PluginRack } from '../components/PluginRack';

export const SonicDAW: React.FC = () => {
  const {
    activeView,
    setActiveView,
    createProject,
    addTrack,
    availablePlugins,
    currentProject
  } = useSonicStore();

  // Initialize plugins and create default project
  useEffect(() => {
    // Set available plugins
    useSonicStore.setState({ availablePlugins: SONIC_PLUGINS });
    
    // Create default project if none exists
    if (!currentProject) {
      createProject('Untitled Project');
    }
  }, [createProject, currentProject]);

  const views = [
    { id: 'timeline', label: 'Timeline', icon: '🎵' },
    { id: 'mixer', label: 'Mixer', icon: '🎛️' },
    { id: 'plugins', label: 'Plugins', icon: '🎚️' },
    { id: 'browser', label: 'Browser', icon: '📁' }
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case 'timeline':
        return <Timeline />;
      case 'mixer':
        return <Mixer />;
      case 'plugins':
        return <PluginRack />;
      case 'browser':
        return <div className="browser-view">Browser View Coming Soon</div>;
      default:
        return <Timeline />;
    }
  };

  return (
    <div className="sonic-daw">
      {/* Header */}
      <header className="daw-header">
        <div className="daw-header-content">
          <a href="/" className="daw-logo">Sonic DAW</a>
          <nav>
            <ul className="daw-nav">
              <li><a href="/web-classic" className="daw-nav-link">Dashboard</a></li>
              <li><a href="/nexus-visual" className="daw-nav-link">Nexus</a></li>
              <li><a href="/ghost-studio" className="daw-nav-link">Ghost Studio</a></li>
              <li><a href="/sanctuary-social" className="daw-nav-link">Sanctuary</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="daw-layout">
        <main className="daw-main">
          {/* Left Sidebar */}
          <aside className="daw-sidebar">
            <div className="sidebar-header">
              <h3 className="sidebar-title">PROJECT</h3>
              <div className="project-info">
                <div className="project-name">{currentProject?.name || 'Untitled'}</div>
                <div className="project-details">
                  <span>BPM: {currentProject?.bpm || 120}</span>
                  <span>Key: {currentProject?.key || 'C'}</span>
                </div>
              </div>
            </div>

            <div className="sidebar-content">
              <div className="track-actions">
                <h4 className="section-title">TRACKS</h4>
                <div className="action-buttons">
                  <button
                    className="action-btn"
                    onClick={() => addTrack('audio')}
                    title="Add Audio Track"
                  >
                    🎤 Audio Track
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => addTrack('midi')}
                    title="Add MIDI Track"
                  >
                    🎹 MIDI Track
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => addTrack('generated')}
                    title="Add Generated Track"
                  >
                    🤖 Generated Track
                  </button>
                </div>
              </div>

              <div className="view-selector">
                <h4 className="section-title">VIEWS</h4>
                <div className="view-buttons">
                  {views.map(view => (
                    <button
                      key={view.id}
                      className={`view-btn ${activeView === view.id ? 'active' : ''}`}
                      onClick={() => setActiveView(view.id as any)}
                    >
                      <span className="view-icon">{view.icon}</span>
                      <span className="view-label">{view.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="quick-actions">
                <h4 className="section-title">QUICK ACTIONS</h4>
                <div className="quick-buttons">
                  <button className="quick-btn">💾 Save</button>
                  <button className="quick-btn">📁 Load</button>
                  <button className="quick-btn">🎵 Import</button>
                  <button className="quick-btn">📤 Export</button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="daw-content">
            <div className="content-header">
              <h2 className="content-title">
                {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
              </h2>
              <div className="content-actions">
                <button className="content-btn">⚙️ Settings</button>
                <button className="content-btn">❓ Help</button>
              </div>
            </div>
            
            <div className="content-body">
              {renderActiveView()}
            </div>
          </section>

          {/* Right Panel */}
          <aside className="daw-panel">
            <div className="panel-header">
              <h3 className="panel-title">INSPECTOR</h3>
            </div>
            
            <div className="panel-content">
              <div className="inspector-section">
                <h4 className="inspector-title">SELECTED TRACK</h4>
                <div className="track-inspector">
                  <div className="track-properties">
                    <div className="property">
                      <label>Name</label>
                      <input type="text" className="property-input" placeholder="Track Name" />
                    </div>
                    <div className="property">
                      <label>Volume</label>
                      <input type="range" className="property-slider" min="0" max="1" step="0.01" />
                    </div>
                    <div className="property">
                      <label>Pan</label>
                      <input type="range" className="property-slider" min="-1" max="1" step="0.01" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="inspector-section">
                <h4 className="inspector-title">EFFECTS</h4>
                <div className="effects-list">
                  <div className="effect-item">
                    <div className="effect-icon">🌀</div>
                    <div className="effect-name">Nexus Spectrum</div>
                    <button className="effect-toggle active">ON</button>
                  </div>
                  <div className="effect-item">
                    <div className="effect-icon">⚡</div>
                    <div className="effect-name">Cyber Compressor</div>
                    <button className="effect-toggle">OFF</button>
                  </div>
                </div>
              </div>

              <div className="inspector-section">
                <h4 className="inspector-title">METERS</h4>
                <div className="meters">
                  <div className="meter">
                    <div className="meter-label">L</div>
                    <div className="meter-bar">
                      <div className="meter-fill" style={{ height: '60%' }}></div>
                    </div>
                  </div>
                  <div className="meter">
                    <div className="meter-label">R</div>
                    <div className="meter-bar">
                      <div className="meter-fill" style={{ height: '45%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </main>

        {/* Transport Bar */}
        <Transport />
      </div>
    </div>
  );
};