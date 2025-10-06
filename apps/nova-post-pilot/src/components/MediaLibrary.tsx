// Media Library - Biblioteca de medios de Nova Post Pilot del universo Son1kVerse

import React from 'react';
import { useNovaStore } from '../store/useNovaStore';

export function MediaLibrary() {
  const { mediaLibrary } = useNovaStore();

  return (
    <div className="media-library">
      <h2>🎨 Media Library</h2>
      <p>Manage your media files</p>
      
      <div className="media-grid">
        {mediaLibrary.map((media) => (
          <div key={media.id} className="media-card">
            <div className="media-preview">
              {media.type === 'image' ? (
                <img src={media.url} alt={media.altText || media.filename} />
              ) : media.type === 'video' ? (
                <video src={media.url} />
              ) : (
                <div className="media-placeholder">
                  {media.type === 'audio' ? '🎵' : '📁'}
                </div>
              )}
            </div>
            
            <div className="media-info">
              <h3>{media.filename}</h3>
              <div className="media-meta">
                <span>Type: {media.type}</span>
                <span>Size: {(media.size / 1024 / 1024).toFixed(2)} MB</span>
                <span>Quality: {media.quality}</span>
              </div>
              
              {media.tags.length > 0 && (
                <div className="media-tags">
                  {media.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .media-library {
          padding: var(--spacing-lg);
        }
        
        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: var(--spacing-lg);
          margin-top: var(--spacing-lg);
        }
        
        .media-card {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
        }
        
        .media-preview {
          height: 150px;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .media-preview img,
        .media-preview video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .media-placeholder {
          font-size: 48px;
          color: var(--text-muted);
        }
        
        .media-info {
          padding: var(--spacing-md);
        }
        
        .media-info h3 {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--text-primary);
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .media-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-bottom: var(--spacing-sm);
        }
        
        .media-meta span {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .media-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
        }
        
        .tag {
          padding: 2px var(--spacing-xs);
          background: rgba(0, 255, 231, 0.2);
          border: 1px solid rgba(0, 255, 231, 0.4);
          border-radius: var(--border-radius-sm);
          font-size: 10px;
          color: var(--accent-primary);
        }
      `}</style>
    </div>
  );
}