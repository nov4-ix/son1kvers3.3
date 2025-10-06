// Header - Header de Nova Post Pilot del universo Son1kVerse

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNovaStore } from '../store/useNovaStore';

export function Header() {
  const {
    activeTab,
    setActiveTab,
    toggleSidebar,
    theme,
    setTheme,
    language,
    setLanguage,
    statistics,
    performance,
  } = useNovaStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'posts', label: 'Posts', icon: '📝' },
    { id: 'campaigns', label: 'Campaigns', icon: '🎯' },
    { id: 'templates', label: 'Templates', icon: '📋' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'ai', label: 'AI Generator', icon: '🤖' },
    { id: 'media', label: 'Media', icon: '🎨' },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId as any);
    setIsMenuOpen(false);
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLanguageToggle = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <motion.header
      className="nova-post-pilot__header"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="header__container">
        {/* Logo and Title */}
        <div className="header__brand">
          <button
            className="header__menu-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <span className="menu-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          
          <div className="header__logo">
            <span className="logo-icon">🚀</span>
            <h1 className="logo-text">
              <span className="logo-text__primary">Nova</span>
              <span className="logo-text__secondary">Post Pilot</span>
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="header__nav">
          <div className="nav__tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav__tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                <span className="tab__icon">{tab.icon}</span>
                <span className="tab__label">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    className="tab__indicator"
                    layoutId="tab-indicator"
                    initial={false}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Right Controls */}
        <div className="header__controls">
          {/* Status Indicators */}
          <div className="header__status">
            <div className="status__item">
              <span className="status__icon">📝</span>
              <span className="status__value">{statistics.totalPosts}</span>
              <span className="status__label">Posts</span>
            </div>
            
            <div className="status__item">
              <span className="status__icon">🎯</span>
              <span className="status__value">{statistics.totalCampaigns}</span>
              <span className="status__label">Campaigns</span>
            </div>
            
            <div className="status__item">
              <span className="status__icon">📊</span>
              <span className="status__value">{statistics.averageEngagementRate.toFixed(1)}%</span>
              <span className="status__label">Engagement</span>
            </div>
          </div>

          {/* Settings */}
          <div className="header__settings">
            <button
              className="settings__button"
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
            >
              <span className="settings__icon">
                {theme === 'dark' ? '☀️' : '🌙'}
              </span>
            </button>
            
            <button
              className="settings__button"
              onClick={handleLanguageToggle}
              aria-label="Toggle language"
            >
              <span className="settings__icon">
                {language === 'es' ? '🇪🇸' : '🇺🇸'}
              </span>
            </button>
            
            <button
              className="settings__button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Open menu"
            >
              <span className="settings__icon">⚙️</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          className="header__mobile-menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mobile-menu__content">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`mobile-menu__item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                <span className="item__icon">{tab.icon}</span>
                <span className="item__label">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Styles */}
      <style jsx>{`
        .nova-post-pilot__header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: rgba(26, 29, 38, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 255, 231, 0.3);
          z-index: 1000;
        }

        .header__container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          padding: 0 var(--spacing-lg);
          max-width: 100%;
        }

        .header__brand {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .header__menu-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--spacing-sm);
          border-radius: var(--border-radius-sm);
          transition: background-color var(--transition-fast);
        }

        .header__menu-toggle:hover {
          background: rgba(0, 255, 231, 0.1);
        }

        .menu-icon {
          display: flex;
          flex-direction: column;
          gap: 3px;
          width: 20px;
          height: 15px;
        }

        .menu-icon span {
          width: 100%;
          height: 2px;
          background: var(--accent-primary);
          border-radius: 1px;
          transition: all var(--transition-fast);
        }

        .header__logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .logo-icon {
          font-size: 24px;
          animation: logo-pulse 2s ease-in-out infinite;
        }

        .logo-text {
          font-family: var(--font-mono);
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        .logo-text__primary {
          color: var(--accent-primary);
        }

        .logo-text__secondary {
          color: var(--accent-secondary);
        }

        .header__nav {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .nav__tabs {
          display: flex;
          gap: var(--spacing-sm);
        }

        .nav__tab {
          position: relative;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          background: none;
          border: none;
          border-radius: var(--border-radius-md);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-family: var(--font-primary);
          font-size: 14px;
          font-weight: 500;
        }

        .nav__tab:hover {
          background: rgba(0, 255, 231, 0.1);
          color: var(--text-primary);
        }

        .nav__tab.active {
          color: var(--accent-primary);
          background: rgba(0, 255, 231, 0.15);
        }

        .tab__icon {
          font-size: 16px;
        }

        .tab__label {
          font-size: 14px;
        }

        .tab__indicator {
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--accent-primary);
          border-radius: 1px;
        }

        .header__controls {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
        }

        .header__status {
          display: flex;
          gap: var(--spacing-md);
        }

        .status__item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          min-width: 50px;
        }

        .status__icon {
          font-size: 14px;
        }

        .status__value {
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 600;
          color: var(--accent-primary);
        }

        .status__label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .header__settings {
          display: flex;
          gap: var(--spacing-sm);
        }

        .settings__button {
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--spacing-sm);
          border-radius: var(--border-radius-sm);
          transition: background-color var(--transition-fast);
        }

        .settings__button:hover {
          background: rgba(0, 255, 231, 0.1);
        }

        .settings__icon {
          font-size: 16px;
        }

        .header__mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(26, 29, 38, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 255, 231, 0.3);
          z-index: 999;
        }

        .mobile-menu__content {
          display: flex;
          flex-direction: column;
          padding: var(--spacing-md);
        }

        .mobile-menu__item {
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
          font-size: 16px;
          text-align: left;
        }

        .mobile-menu__item:hover {
          background: rgba(0, 255, 231, 0.1);
          color: var(--text-primary);
        }

        .mobile-menu__item.active {
          color: var(--accent-primary);
          background: rgba(0, 255, 231, 0.15);
        }

        .item__icon {
          font-size: 20px;
        }

        .item__label {
          font-size: 16px;
        }

        @keyframes logo-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @media (max-width: 768px) {
          .header__nav {
            display: none;
          }
          
          .header__status {
            display: none;
          }
          
          .header__controls {
            gap: var(--spacing-sm);
          }
        }

        @media (max-width: 480px) {
          .header__container {
            padding: 0 var(--spacing-md);
          }
          
          .logo-text {
            font-size: 18px;
          }
          
          .logo-icon {
            font-size: 20px;
          }
        }
      `}</style>
    </motion.header>
  );
}