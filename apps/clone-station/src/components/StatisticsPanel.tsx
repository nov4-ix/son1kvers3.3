// Statistics Panel - Panel de estadísticas de Clone Station del universo Son1kVerse

import React from 'react';
import { useCloneStore } from '../store/useCloneStore';

export function StatisticsPanel() {
  const { statistics } = useCloneStore();

  return (
    <div className="statistics-panel">
      <h3>📊 Statistics</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Datasets</span>
          <span className="stat-value">{statistics.totalDatasets}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Models</span>
          <span className="stat-value">{statistics.totalModels}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Training Jobs</span>
          <span className="stat-value">{statistics.totalTrainingJobs}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Conversions</span>
          <span className="stat-value">{statistics.totalConversionJobs}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Success Rate</span>
          <span className="stat-value">{statistics.successRate.toFixed(1)}%</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Avg Training</span>
          <span className="stat-value">{statistics.averageTrainingTime.toFixed(1)}m</span>
        </div>
      </div>
      
      <style jsx>{`
        .statistics-panel {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-md);
        }
        
        .statistics-panel h3 {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--accent-primary);
          font-size: 14px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-sm);
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .stat-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .stat-value {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          font-family: var(--font-mono);
        }
      `}</style>
    </div>
  );
}