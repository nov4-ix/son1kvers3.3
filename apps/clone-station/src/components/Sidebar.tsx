// Sidebar - Sidebar de Clone Station del universo Son1kVerse

import React from 'react';
import { motion } from 'framer-motion';
import { useCloneStore } from '../store/useCloneStore';

export function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    sidebarOpen,
    statistics,
    performance,
  } = useCloneStore();

  const menuItems = [
    { id: 'datasets', label: 'Datasets', icon: '📊', count: statistics.totalDatasets },
    { id: 'models', label: 'Models', icon: '🤖', count: statistics.totalModels },
    { id: 'training', label: 'Training', icon: '🏋️', count: statistics.totalTrainingJobs },
    { id: 'conversion', label: 'Conversion', icon: '🔄', count: statistics.totalConversionJobs },
    { id: 'quality', label: 'Quality', icon: '📈', count: 0 },
  ];

  const handleItemClick = (itemId: string) => {
    setActiveTab(itemId as any);
  };

  return (
    <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar__content">
        {/* Menu Items */}
        <nav className="sidebar__nav">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleItemClick(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="nav-item__icon">
                <span>{item.icon}</span>
              </div>
              
              {sidebarOpen && (
                <div className="nav-item__content">
                  <span className="nav-item__label">{item.label}</span>
                  <span className="nav-item__count">{item.count}</span>
                </div>
              )}
              
              {activeTab === item.id && (
                <motion.div
                  className="nav-item__indicator"
                  layoutId="nav-indicator"
                  initial={false}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Performance Summary */}
        {sidebarOpen && (
          <div className="sidebar__performance">
            <h4 className="performance__title">Performance</h4>
            <div className="performance__metrics">
              <div className="metric">
                <span className="metric__label">GPU</span>
                <div className="metric__bar">
                  <div 
                    className="metric__fill"
                    style={{ width: `${performance.gpuUsage}%` }}
                  />
                </div>
                <span className="metric__value">{Math.round(performance.gpuUsage)}%</span>
              </div>
              
              <div className="metric">
                <span className="metric__label">Memory</span>
                <div className="metric__bar">
                  <div 
                    className="metric__fill"
                    style={{ width: `${performance.memoryUsage}%` }}
                  />
                </div>
                <span className="metric__value">{Math.round(performance.memoryUsage)}%</span>
              </div>
              
              <div className="metric">
                <span className="metric__label">CPU</span>
                <div className="metric__bar">
                  <div 
                    className="metric__fill"
                    style={{ width: `${performance.cpuUsage}%` }}
                  />
                </div>
                <span className="metric__value">{Math.round(performance.cpuUsage)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Styles */}
      <style jsx>{`
        .sidebar {
          height: 100%;
          background: rgba(26, 29, 38, 0.9);
          backdrop-filter: blur(10px);
          border-right: 1px solid rgba(0, 255, 231, 0.3);
          transition: width var(--transition-normal);
          overflow: hidden;
        }

        .sidebar__content {
          padding: var(--spacing-lg);
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .sidebar__nav {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          background: none;
          border: none;
          border-radius: var(--border-radius-md);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          width: 100%;
        }

        .nav-item:hover {
          background: rgba(0, 255, 231, 0.1);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: rgba(0, 255, 231, 0.15);
          color: var(--accent-primary);
        }

        .nav-item__icon {
          font-size: 20px;
          min-width: 20px;
        }

        .nav-item__content {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .nav-item__label {
          font-size: 14px;
          font-weight: 500;
        }

        .nav-item__count {
          font-size: 12px;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .nav-item__indicator {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: var(--accent-primary);
          border-radius: 2px;
        }

        .sidebar__performance {
          margin-top: auto;
          padding: var(--spacing-md);
          background: rgba(0, 0, 0, 0.3);
          border-radius: var(--border-radius-md);
          border: 1px solid rgba(0, 255, 231, 0.2);
        }

        .performance__title {
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 var(--spacing-md) 0;
        }

        .performance__metrics {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .metric {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .metric__label {
          font-size: 10px;
          color: var(--text-muted);
          min-width: 40px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric__bar {
          flex: 1;
          height: 4px;
          background: rgba(0, 255, 231, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }

        .metric__fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary), var(--accent-tertiary));
          transition: width var(--transition-normal);
        }

        .metric__value {
          font-size: 10px;
          color: var(--text-primary);
          font-family: var(--font-mono);
          min-width: 30px;
          text-align: right;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100% !important;
            height: auto;
            border-right: none;
            border-bottom: 1px solid rgba(0, 255, 231, 0.3);
          }
          
          .sidebar__content {
            padding: var(--spacing-md);
            flex-direction: row;
            gap: var(--spacing-md);
            overflow-x: auto;
          }
          
          .sidebar__nav {
            flex-direction: row;
            gap: var(--spacing-sm);
          }
          
          .nav-item {
            min-width: 120px;
            flex-direction: column;
            gap: var(--spacing-xs);
            padding: var(--spacing-sm);
          }
          
          .nav-item__content {
            align-items: center;
            gap: 2px;
          }
          
          .nav-item__indicator {
            bottom: 0;
            top: auto;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 3px;
          }
          
          .sidebar__performance {
            margin-top: 0;
            min-width: 200px;
          }
        }
      `}</style>
    </div>
  );
}