// Settings Panel - Panel de configuración de Clone Station del universo Son1kVerse

import React from 'react';
import { useCloneStore } from '../store/useCloneStore';

export function SettingsPanel() {
  const { settings, updateSettings } = useCloneStore();

  const handleSettingChange = (key: string, value: any) => {
    updateSettings({ [key]: value });
  };

  return (
    <div className="settings-panel">
      <h3>⚙️ Settings</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label>Auto Start Training</label>
          <input
            type="checkbox"
            checked={settings.autoStartTraining}
            onChange={(e) => handleSettingChange('autoStartTraining', e.target.checked)}
          />
        </div>
        
        <div className="setting-item">
          <label>GPU Acceleration</label>
          <input
            type="checkbox"
            checked={settings.gpuAcceleration}
            onChange={(e) => handleSettingChange('gpuAcceleration', e.target.checked)}
          />
        </div>
        
        <div className="setting-item">
          <label>Notifications</label>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => handleSettingChange('notifications', e.target.checked)}
          />
        </div>
        
        <div className="setting-item">
          <label>Haptic Feedback</label>
          <input
            type="checkbox"
            checked={settings.hapticFeedback}
            onChange={(e) => handleSettingChange('hapticFeedback', e.target.checked)}
          />
        </div>
        
        <div className="setting-item">
          <label>Default Quality</label>
          <select
            value={settings.defaultQuality}
            onChange={(e) => handleSettingChange('defaultQuality', e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="ultra">Ultra</option>
          </select>
        </div>
        
        <div className="setting-item">
          <label>Performance Mode</label>
          <select
            value={settings.performanceMode}
            onChange={(e) => handleSettingChange('performanceMode', e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      
      <style jsx>{`
        .settings-panel {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-md);
        }
        
        .settings-panel h3 {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--accent-primary);
          font-size: 14px;
        }
        
        .settings-grid {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        
        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .setting-item label {
          font-size: 12px;
          color: var(--text-primary);
        }
        
        .setting-item input,
        .setting-item select {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-sm);
          color: var(--text-primary);
          padding: 2px 6px;
          font-size: 12px;
        }
        
        .setting-item input[type="checkbox"] {
          width: 16px;
          height: 16px;
        }
      `}</style>
    </div>
  );
}