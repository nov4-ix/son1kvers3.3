// Templates Manager - Gestor de plantillas de Nova Post Pilot del universo Son1kVerse

import React from 'react';
import { useNovaStore } from '../store/useNovaStore';

export function TemplatesManager() {
  const { templates } = useNovaStore();

  return (
    <div className="templates-manager">
      <h2>📋 Templates Manager</h2>
      <p>Manage your content templates</p>
      <div className="templates-grid">
        {templates.map((template) => (
          <div key={template.id} className="template-card">
            <div className="template-header">
              <h3>{template.name}</h3>
              <span className="template-category">{template.category}</span>
            </div>
            <p className="template-description">{template.description}</p>
            <div className="template-content">
              <p>{template.content}</p>
            </div>
            <div className="template-platforms">
              {template.platforms.map(platform => (
                <span key={platform} className="platform-tag">
                  {platform}
                </span>
              ))}
            </div>
            <div className="template-meta">
              <span>Usage: {template.usage}</span>
              <span>Rating: {template.rating}/5</span>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .templates-manager {
          padding: var(--spacing-lg);
        }
        
        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-lg);
          margin-top: var(--spacing-lg);
        }
        
        .template-card {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
        }
        
        .template-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }
        
        .template-category {
          padding: var(--spacing-xs) var(--spacing-sm);
          background: rgba(0, 255, 231, 0.2);
          border: 1px solid rgba(0, 255, 231, 0.4);
          border-radius: var(--border-radius-sm);
          font-size: 10px;
          color: var(--accent-primary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .template-content {
          background: rgba(0, 0, 0, 0.3);
          border-radius: var(--border-radius-md);
          padding: var(--spacing-md);
          margin: var(--spacing-md) 0;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        .template-platforms {
          display: flex;
          gap: var(--spacing-xs);
          margin: var(--spacing-md) 0;
        }
        
        .platform-tag {
          padding: 2px var(--spacing-xs);
          background: rgba(0, 255, 231, 0.2);
          border: 1px solid rgba(0, 255, 231, 0.4);
          border-radius: var(--border-radius-sm);
          font-size: 10px;
          color: var(--accent-primary);
        }
        
        .template-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}