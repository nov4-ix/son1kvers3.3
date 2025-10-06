// Performance Monitor - Monitor de rendimiento de Clone Station del universo Son1kVerse

import React from 'react';
import { useCloneStore } from '../store/useCloneStore';

export function PerformanceMonitor() {
  const { performance } = useCloneStore();

  return (
    <div className="performance-monitor">
      <h3>⚡ Performance</h3>
      <div className="performance-metrics">
        <div className="metric">
          <span className="metric-label">GPU</span>
          <div className="metric-bar">
            <div 
              className="metric-fill"
              style={{ width: `${performance.gpuUsage}%` }}
            />
          </div>
          <span className="metric-value">{Math.round(performance.gpuUsage)}%</span>
        </div>
        
        <div className="metric">
          <span className="metric-label">Memory</span>
          <div className="metric-bar">
            <div 
              className="metric-fill"
              style={{ width: `${performance.memoryUsage}%` }}
            />
          </div>
          <span className="metric-value">{Math.round(performance.memoryUsage)}%</span>
        </div>
        
        <div className="metric">
          <span className="metric-label">CPU</span>
          <div className="metric-bar">
            <div 
              className="metric-fill"
              style={{ width: `${performance.cpuUsage}%` }}
            />
          </div>
          <span className="metric-value">{Math.round(performance.cpuUsage)}%</span>
        </div>
      </div>
      
      <style jsx>{`
        .performance-monitor {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-md);
        }
        
        .performance-monitor h3 {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--accent-primary);
          font-size: 14px;
        }
        
        .performance-metrics {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        
        .metric {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }
        
        .metric-label {
          font-size: 10px;
          color: var(--text-muted);
          min-width: 40px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .metric-bar {
          flex: 1;
          height: 4px;
          background: rgba(0, 255, 231, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .metric-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-tertiary));
          transition: width var(--transition-normal);
        }
        
        .metric-value {
          font-size: 10px;
          color: var(--text-primary);
          font-family: var(--font-mono);
          min-width: 30px;
          text-align: right;
        }
      `}</style>
    </div>
  );
}