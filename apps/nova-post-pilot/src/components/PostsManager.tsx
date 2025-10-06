// Posts Manager - Gestor de posts de Nova Post Pilot del universo Son1kVerse

import React from 'react';
import { useNovaStore } from '../store/useNovaStore';

export function PostsManager() {
  const { posts } = useNovaStore();

  return (
    <div className="posts-manager">
      <h2>📝 Posts Manager</h2>
      <p>Manage your social media posts</p>
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <h3>{post.title}</h3>
              <span className={`post-status ${post.status}`}>{post.status}</span>
            </div>
            <p className="post-content">{post.content}</p>
            <div className="post-platforms">
              {post.platforms.map(platform => (
                <span key={platform.name} className="platform-tag">
                  {platform.icon} {platform.displayName}
                </span>
              ))}
            </div>
            <div className="post-meta">
              <span>Scheduled: {new Date(post.scheduledDate).toLocaleDateString()}</span>
              <span>Engagement: {post.engagement.engagementRate.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .posts-manager {
          padding: var(--spacing-lg);
        }
        
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-lg);
          margin-top: var(--spacing-lg);
        }
        
        .post-card {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
        }
        
        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }
        
        .post-status {
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--border-radius-sm);
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        .post-status.draft {
          background: rgba(255, 170, 0, 0.2);
          color: #ffaa00;
        }
        
        .post-status.scheduled {
          background: rgba(0, 212, 255, 0.2);
          color: #00d4ff;
        }
        
        .post-status.published {
          background: rgba(0, 255, 0, 0.2);
          color: #00ff00;
        }
        
        .post-platforms {
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
        
        .post-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}