// Campaigns Manager - Gestor de campañas de Nova Post Pilot del universo Son1kVerse

import React from 'react';
import { useNovaStore } from '../store/useNovaStore';

export function CampaignsManager() {
  const { campaigns } = useNovaStore();

  return (
    <div className="campaigns-manager">
      <h2>🎯 Campaigns Manager</h2>
      <p>Manage your marketing campaigns</p>
      <div className="campaigns-grid">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="campaign-card">
            <div className="campaign-header">
              <h3>{campaign.name}</h3>
              <span className={`campaign-status ${campaign.status}`}>{campaign.status}</span>
            </div>
            <p className="campaign-description">{campaign.description}</p>
            <div className="campaign-goals">
              {campaign.goals.map(goal => (
                <div key={goal.id} className="goal-item">
                  <span className="goal-label">{goal.type}</span>
                  <div className="goal-progress">
                    <div 
                      className="goal-progress-fill"
                      style={{ width: `${(goal.current / goal.target) * 100}%` }}
                    />
                  </div>
                  <span className="goal-value">{goal.current}/{goal.target}</span>
                </div>
              ))}
            </div>
            <div className="campaign-meta">
              <span>Budget: ${campaign.budget?.toLocaleString()}</span>
              <span>Posts: {campaign.posts.length}</span>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .campaigns-manager {
          padding: var(--spacing-lg);
        }
        
        .campaigns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: var(--spacing-lg);
          margin-top: var(--spacing-lg);
        }
        
        .campaign-card {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
        }
        
        .campaign-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }
        
        .campaign-status {
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--border-radius-sm);
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        .campaign-status.active {
          background: rgba(0, 255, 0, 0.2);
          color: #00ff00;
        }
        
        .campaign-status.planning {
          background: rgba(255, 170, 0, 0.2);
          color: #ffaa00;
        }
        
        .campaign-goals {
          margin: var(--spacing-md) 0;
        }
        
        .goal-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
        }
        
        .goal-label {
          font-size: 12px;
          color: var(--text-secondary);
          min-width: 80px;
          text-transform: capitalize;
        }
        
        .goal-progress {
          flex: 1;
          height: 6px;
          background: rgba(0, 255, 231, 0.2);
          border-radius: 3px;
          overflow: hidden;
        }
        
        .goal-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-tertiary));
          transition: width var(--transition-normal);
        }
        
        .goal-value {
          font-size: 12px;
          color: var(--text-primary);
          font-family: var(--font-mono);
          min-width: 60px;
          text-align: right;
        }
        
        .campaign-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}