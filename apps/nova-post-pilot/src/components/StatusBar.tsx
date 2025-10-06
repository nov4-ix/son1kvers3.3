// Status Bar - Barra de estado de Nova Post Pilot del universo Son1kVerse

import React from 'react';
import { useNovaStore } from '../store/useNovaStore';

export function StatusBar() {
  const { statistics, performance } = useNovaStore();

  return (
    <div className="status-bar">
      <div className="status-bar__content">
        <div className="status-bar__left">
          <span className="status-item">
            <span className="status-icon">📝</span>
            <span className="status-text">{statistics.totalPosts} Posts</span>
          </span>
          
          <span className="status-item">
            <span className="status-icon">🎯</span>
            <span className="status-text">{statistics.totalCampaigns} Campaigns</span>
          </span>
          
          <span className="status-item">
            <span className="status-icon">📊</span>
            <span className="status-text">{statistics.averageEngagementRate.toFixed(1)}% Engagement</span>
          </span>
        </div>
        
        <div className="status-bar__right">
          <span className="status-item">
            <span className="status-icon">🕒</span>
            <span className="status-text">{new Date().toLocaleTimeString()}</span>
          </span>
        </div>
      </div>
      
      <style jsx>{`
        .status-bar {
          background: rgba(26, 29, 38, 0.8);
          border-bottom: 1px solid rgba(0, 255, 231, 0.2);
          padding: var(--spacing-sm) var(--spacing-lg);
          font-size: 12px;
        }
        
        .status-bar__content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .status-bar__left,
        .status-bar__right {
          display: flex;
          gap: var(--spacing-md);
        }
        
        .status-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: var(--text-secondary);
        }
        
        .status-icon {
          font-size: 14px;
        }
        
        .status-text {
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );
}