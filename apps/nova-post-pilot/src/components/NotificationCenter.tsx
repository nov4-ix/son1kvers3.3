// Notification Center - Centro de notificaciones de Nova Post Pilot del universo Son1kVerse

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClear: () => void;
}

export function NotificationCenter({ notifications, onMarkAsRead, onClear }: NotificationCenterProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  if (notifications.length === 0) return null;

  return (
    <div className="notification-center">
      <div className="notification-center__header">
        <h3>🔔 Notifications ({unreadCount})</h3>
        <button onClick={onClear} className="clear-button">
          Clear All
        </button>
      </div>
      
      <div className="notification-center__list">
        <AnimatePresence>
          {notifications.slice(0, 5).map((notification) => (
            <motion.div
              key={notification.id}
              className={`notification ${notification.read ? 'read' : 'unread'} ${notification.type}`}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ duration: 0.3 }}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="notification__icon">
                {notification.type === 'success' && '✅'}
                {notification.type === 'error' && '❌'}
                {notification.type === 'warning' && '⚠️'}
                {notification.type === 'info' && 'ℹ️'}
              </div>
              
              <div className="notification__content">
                <h4 className="notification__title">{notification.title}</h4>
                <p className="notification__message">{notification.message}</p>
                <span className="notification__time">
                  {notification.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <style jsx>{`
        .notification-center {
          position: fixed;
          top: 80px;
          right: 20px;
          width: 350px;
          background: rgba(26, 29, 38, 0.95);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          backdrop-filter: blur(10px);
          z-index: 1000;
          max-height: 400px;
          overflow: hidden;
        }
        
        .notification-center__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md);
          border-bottom: 1px solid rgba(0, 255, 231, 0.2);
        }
        
        .notification-center__header h3 {
          margin: 0;
          color: var(--accent-primary);
          font-size: 14px;
        }
        
        .clear-button {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 12px;
          padding: var(--spacing-xs);
        }
        
        .clear-button:hover {
          color: var(--text-primary);
        }
        
        .notification-center__list {
          max-height: 300px;
          overflow-y: auto;
        }
        
        .notification {
          display: flex;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          border-bottom: 1px solid rgba(0, 255, 231, 0.1);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .notification:hover {
          background: rgba(0, 255, 231, 0.05);
        }
        
        .notification.unread {
          background: rgba(0, 255, 231, 0.05);
        }
        
        .notification.success {
          border-left: 3px solid #00ff00;
        }
        
        .notification.error {
          border-left: 3px solid #ff6b6b;
        }
        
        .notification.warning {
          border-left: 3px solid #ffaa00;
        }
        
        .notification.info {
          border-left: 3px solid #00d4ff;
        }
        
        .notification__icon {
          font-size: 20px;
          min-width: 20px;
        }
        
        .notification__content {
          flex: 1;
        }
        
        .notification__title {
          margin: 0 0 var(--spacing-xs) 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .notification__message {
          margin: 0 0 var(--spacing-xs) 0;
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        
        .notification__time {
          font-size: 10px;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }
        
        @media (max-width: 768px) {
          .notification-center {
            right: 10px;
            width: calc(100vw - 20px);
            max-width: 350px;
          }
        }
      `}</style>
    </div>
  );
}