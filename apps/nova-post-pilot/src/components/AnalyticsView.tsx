// Analytics View - Vista de analytics de Nova Post Pilot del universo Son1kVerse

import React from 'react';
import { useNovaStore } from '../store/useNovaStore';

export function AnalyticsView() {
  const { statistics, performance } = useNovaStore();

  return (
    <div className="analytics-view">
      <h2>📊 Analytics Dashboard</h2>
      <p>Track your social media performance</p>
      
      <div className="analytics-grid">
        <div className="metric-card">
          <h3>Total Reach</h3>
          <div className="metric-value">{statistics.totalReach.toLocaleString()}</div>
          <div className="metric-change">+12.5% from last month</div>
        </div>
        
        <div className="metric-card">
          <h3>Total Engagement</h3>
          <div className="metric-value">{statistics.totalEngagement.toLocaleString()}</div>
          <div className="metric-change">+8.3% from last month</div>
        </div>
        
        <div className="metric-card">
          <h3>Engagement Rate</h3>
          <div className="metric-value">{statistics.averageEngagementRate.toFixed(1)}%</div>
          <div className="metric-change">+2.1% from last month</div>
        </div>
        
        <div className="metric-card">
          <h3>Total Posts</h3>
          <div className="metric-value">{statistics.totalPosts}</div>
          <div className="metric-change">+15 posts this month</div>
        </div>
      </div>
      
      <div className="analytics-charts">
        <div className="chart-card">
          <h3>Engagement Over Time</h3>
          <div className="chart-placeholder">
            📈 Chart visualization would go here
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Platform Performance</h3>
          <div className="chart-placeholder">
            📊 Platform comparison chart
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .analytics-view {
          padding: var(--spacing-lg);
        }
        
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
          margin: var(--spacing-lg) 0;
        }
        
        .metric-card {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
          text-align: center;
        }
        
        .metric-card h3 {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--text-secondary);
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .metric-value {
          font-size: 32px;
          font-weight: 700;
          color: var(--accent-primary);
          margin-bottom: var(--spacing-sm);
        }
        
        .metric-change {
          font-size: 12px;
          color: var(--text-muted);
        }
        
        .analytics-charts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: var(--spacing-lg);
          margin-top: var(--spacing-lg);
        }
        
        .chart-card {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
        }
        
        .chart-card h3 {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--accent-primary);
        }
        
        .chart-placeholder {
          height: 200px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: var(--border-radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-size: 16px;
        }
      `}</style>
    </div>
  );
}