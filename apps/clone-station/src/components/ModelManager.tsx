// Model Manager - Gestor de modelos de Clone Station del universo Son1kVerse

import React from 'react';
import { useCloneStore } from '../store/useCloneStore';

export function ModelManager() {
  const { models } = useCloneStore();

  return (
    <div className="model-manager">
      <h2>🤖 Model Manager</h2>
      <p>Manage your AI models here</p>
      <div className="models-grid">
        {models.map((model) => (
          <div key={model.id} className="model-card">
            <h3>{model.name}</h3>
            <p>{model.description}</p>
            <div className="model-stats">
              <span>Accuracy: {model.accuracy.toFixed(1)}%</span>
              <span>Quality: {model.quality}</span>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .model-manager {
          padding: var(--spacing-lg);
        }
        
        .models-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-lg);
          margin-top: var(--spacing-lg);
        }
        
        .model-card {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
        }
        
        .model-stats {
          display: flex;
          gap: var(--spacing-md);
          margin-top: var(--spacing-md);
          font-size: 12px;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}