// Nova Post Pilot - Página principal de Nova Post Pilot del universo Son1kVerse

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNovaStore } from '../store/useNovaStore';
import { CalendarView } from '../components/CalendarView';
import { PostsManager } from '../components/PostsManager';
import { CampaignsManager } from '../components/CampaignsManager';
import { TemplatesManager } from '../components/TemplatesManager';
import { AnalyticsView } from '../components/AnalyticsView';
import { AIGenerator } from '../components/AIGenerator';
import { MediaLibrary } from '../components/MediaLibrary';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { StatusBar } from '../components/StatusBar';
import { NotificationCenter } from '../components/NotificationCenter';

export function NovaPostPilot() {
  const {
    activeTab,
    sidebarOpen,
    theme,
    language,
    performance,
    statistics,
    settings,
    calculatePerformance,
    calculateStatistics,
  } = useNovaStore();

  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>>([]);

  // Calculate performance and statistics on mount
  useEffect(() => {
    calculatePerformance();
    calculateStatistics();
  }, [calculatePerformance, calculateStatistics]);

  // Add sample data for demonstration
  useEffect(() => {
    const { posts, platforms, campaigns, templates } = useNovaStore.getState();
    
    if (platforms.length === 0) {
      // Add sample platforms
      useNovaStore.getState().addPlatform({
        name: 'instagram',
        displayName: 'Instagram',
        icon: '📸',
        color: '#E4405F',
        enabled: true,
        connected: true,
        accountId: 'instagram_account_1',
        accountName: '@son1kverse',
        followers: 12500,
        engagement: 4.2,
        lastSync: new Date(),
        settings: {
          autoPost: true,
          optimalTimes: [
            { day: 'monday', time: '09:00', engagement: 85 },
            { day: 'tuesday', time: '14:00', engagement: 92 },
            { day: 'wednesday', time: '18:00', engagement: 88 },
            { day: 'thursday', time: '12:00', engagement: 90 },
            { day: 'friday', time: '16:00', engagement: 95 },
            { day: 'saturday', time: '11:00', engagement: 78 },
            { day: 'sunday', time: '15:00', engagement: 82 },
          ],
          hashtagLimit: 30,
          characterLimit: 2200,
          imageSize: 'square',
          videoLength: 60,
          quality: 'high',
          captions: true,
          altText: true,
          location: false,
          mentions: true,
          hashtags: true,
        },
      });

      useNovaStore.getState().addPlatform({
        name: 'twitter',
        displayName: 'Twitter',
        icon: '🐦',
        color: '#1DA1F2',
        enabled: true,
        connected: true,
        accountId: 'twitter_account_1',
        accountName: '@son1kverse',
        followers: 8500,
        engagement: 3.8,
        lastSync: new Date(),
        settings: {
          autoPost: true,
          optimalTimes: [
            { day: 'monday', time: '08:00', engagement: 88 },
            { day: 'tuesday', time: '13:00', engagement: 92 },
            { day: 'wednesday', time: '17:00', engagement: 85 },
            { day: 'thursday', time: '11:00', engagement: 90 },
            { day: 'friday', time: '15:00', engagement: 94 },
            { day: 'saturday', time: '10:00', engagement: 75 },
            { day: 'sunday', time: '14:00', engagement: 80 },
          ],
          hashtagLimit: 10,
          characterLimit: 280,
          imageSize: 'landscape',
          videoLength: 140,
          quality: 'high',
          captions: true,
          altText: true,
          location: false,
          mentions: true,
          hashtags: true,
        },
      });
    }

    if (posts.length === 0) {
      // Add sample posts
      useNovaStore.getState().addPost({
        title: 'Welcome to Son1kVerse',
        content: '🚀 Welcome to the future of music production! Experience the power of AI-driven creativity with our revolutionary tools. #son1kverse #cyberpunk #ai #music',
        platforms: [
          useNovaStore.getState().platforms.find(p => p.name === 'instagram')!,
          useNovaStore.getState().platforms.find(p => p.name === 'twitter')!,
        ],
        scheduledDate: new Date(),
        status: 'published',
        type: 'text',
        hashtags: ['#son1kverse', '#cyberpunk', '#ai', '#music'],
        mentions: [],
        author: 'Son1kVerse Team',
        tags: ['welcome', 'announcement'],
        aiGenerated: false,
        quality: 'high',
      });

      useNovaStore.getState().addPost({
        title: 'Ghost Studio Update',
        content: '🎵 New features in Ghost Studio! Enhanced AI processing, improved voice cloning, and seamless integration with our ecosystem. Try it now! #ghoststudio #ai #musicproduction',
        platforms: [
          useNovaStore.getState().platforms.find(p => p.name === 'instagram')!,
          useNovaStore.getState().platforms.find(p => p.name === 'twitter')!,
        ],
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        status: 'scheduled',
        type: 'text',
        hashtags: ['#ghoststudio', '#ai', '#musicproduction'],
        mentions: [],
        author: 'Son1kVerse Team',
        tags: ['update', 'ghoststudio'],
        aiGenerated: false,
        quality: 'high',
      });
    }

    if (campaigns.length === 0) {
      // Add sample campaign
      useNovaStore.getState().addCampaign({
        name: 'Son1kVerse Launch',
        description: 'Launch campaign for Son1kVerse platform',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: 'active',
        budget: 5000,
        currency: 'USD',
        targetAudience: {
          ageRange: { min: 18, max: 35 },
          genders: ['male', 'female', 'non-binary'],
          locations: ['United States', 'Canada', 'United Kingdom'],
          interests: ['music', 'technology', 'ai', 'cyberpunk'],
          languages: ['English', 'Spanish'],
          behaviors: ['early_adopters', 'tech_enthusiasts'],
          demographics: {},
        },
        goals: [
          {
            id: 'goal_1',
            type: 'reach',
            target: 100000,
            current: 25000,
            unit: 'people',
            priority: 'high',
            achieved: false,
            description: 'Reach 100,000 people',
          },
          {
            id: 'goal_2',
            type: 'engagement',
            target: 5000,
            current: 1200,
            unit: 'engagements',
            priority: 'high',
            achieved: false,
            description: 'Generate 5,000 engagements',
          },
          {
            id: 'goal_3',
            type: 'conversion',
            target: 500,
            current: 85,
            unit: 'signups',
            priority: 'critical',
            achieved: false,
            description: 'Convert 500 users',
          },
        ],
        posts: [],
        performance: {
          totalReach: 25000,
          totalEngagement: 1200,
          totalConversions: 85,
          totalSpend: 1250,
          costPerReach: 0.05,
          costPerEngagement: 1.04,
          costPerConversion: 14.71,
          returnOnInvestment: 0,
          clickThroughRate: 2.1,
          conversionRate: 0.34,
          engagementRate: 4.8,
          reachRate: 25,
          impressions: 50000,
          clicks: 1050,
          shares: 180,
          saves: 320,
          comments: 450,
          likes: 250,
          goalsAchieved: 0,
          goalsTotal: 3,
          lastUpdated: new Date(),
        },
        createdBy: 'Son1kVerse Team',
        tags: ['launch', 'platform'],
        color: '#00d4ff',
        icon: '🚀',
      });
    }

    if (templates.length === 0) {
      // Add sample templates
      useNovaStore.getState().addTemplate({
        name: 'Product Announcement',
        description: 'Template for announcing new products or features',
        type: 'post',
        platforms: ['instagram', 'twitter'],
        content: '🎉 Exciting news! We\'re thrilled to announce [PRODUCT_NAME] - [PRODUCT_DESCRIPTION]. Get ready to experience the future! #announcement #innovation #technology',
        mediaPlaceholders: [
          {
            id: 'media_1',
            type: 'image',
            position: 1,
            description: 'Product image or screenshot',
            required: true,
            dimensions: { width: 1080, height: 1080 },
            quality: 'high',
          },
        ],
        hashtags: ['#announcement', '#innovation', '#technology'],
        mentions: [],
        variables: [
          {
            id: 'var_1',
            name: 'PRODUCT_NAME',
            type: 'text',
            required: true,
            placeholder: 'Enter product name',
            description: 'Name of the product or feature',
          },
          {
            id: 'var_2',
            name: 'PRODUCT_DESCRIPTION',
            type: 'text',
            required: true,
            placeholder: 'Enter product description',
            description: 'Brief description of the product',
          },
        ],
        category: 'announcement',
        tags: ['product', 'announcement', 'template'],
        usage: 0,
        rating: 4.5,
        createdBy: 'Son1kVerse Team',
        aiGenerated: false,
      });

      useNovaStore.getState().addTemplate({
        name: 'Behind the Scenes',
        description: 'Template for sharing behind-the-scenes content',
        type: 'story',
        platforms: ['instagram'],
        content: '🔍 Behind the scenes at Son1kVerse! Here\'s a glimpse into our creative process and the amazing team making it all happen. #behindthescenes #team #creativity',
        mediaPlaceholders: [
          {
            id: 'media_1',
            type: 'image',
            position: 1,
            description: 'Behind the scenes photo',
            required: true,
            dimensions: { width: 1080, height: 1920 },
            quality: 'high',
          },
        ],
        hashtags: ['#behindthescenes', '#team', '#creativity'],
        mentions: [],
        variables: [],
        category: 'behindthescenes',
        tags: ['behindthescenes', 'team', 'template'],
        usage: 0,
        rating: 4.2,
        createdBy: 'Son1kVerse Team',
        aiGenerated: false,
      });
    }
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'calendar':
        return <CalendarView />;
      case 'posts':
        return <PostsManager />;
      case 'campaigns':
        return <CampaignsManager />;
      case 'templates':
        return <TemplatesManager />;
      case 'analytics':
        return <AnalyticsView />;
      case 'ai':
        return <AIGenerator />;
      case 'media':
        return <MediaLibrary />;
      default:
        return <CalendarView />;
    }
  };

  const addNotification = (notification: Omit<typeof notifications[0], 'id'>) => {
    const newNotification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className={`nova-post-pilot ${theme}`}>
      {/* Background Effects */}
      <div className="nova-post-pilot__background">
        <div className="matrix-bg" />
        <div className="cyberpunk-grid" />
        <div className="nexus-particles" />
      </div>

      {/* Header */}
      <Header />

      {/* Main Layout */}
      <div className="nova-post-pilot__layout">
        {/* Sidebar */}
        <motion.div
          className={`nova-post-pilot__sidebar ${sidebarOpen ? 'open' : 'closed'}`}
          initial={false}
          animate={{ width: sidebarOpen ? 280 : 60 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Sidebar />
        </motion.div>

        {/* Main Content */}
        <div className="nova-post-pilot__main">
          {/* Status Bar */}
          <StatusBar />

          {/* Tab Content */}
          <motion.div
            className="nova-post-pilot__content"
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveTab()}
          </motion.div>
        </div>

        {/* Right Panel */}
        <div className="nova-post-pilot__right-panel">
          {/* Performance Summary */}
          <div className="performance-summary">
            <h3>📊 Performance</h3>
            <div className="performance-metrics">
              <div className="metric">
                <span className="metric-label">Posts</span>
                <span className="metric-value">{statistics.totalPosts}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Reach</span>
                <span className="metric-value">{statistics.totalReach.toLocaleString()}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Engagement</span>
                <span className="metric-value">{statistics.totalEngagement.toLocaleString()}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Rate</span>
                <span className="metric-value">{statistics.averageEngagementRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>⚡ Quick Actions</h3>
            <div className="actions-grid">
              <button className="action-button">
                <span className="action-icon">📝</span>
                <span className="action-label">New Post</span>
              </button>
              <button className="action-button">
                <span className="action-icon">🎯</span>
                <span className="action-label">New Campaign</span>
              </button>
              <button className="action-button">
                <span className="action-icon">📋</span>
                <span className="action-label">New Template</span>
              </button>
              <button className="action-button">
                <span className="action-icon">🤖</span>
                <span className="action-label">AI Generate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Center */}
      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={markNotificationAsRead}
        onClear={clearNotifications}
      />

      {/* Global Styles */}
      <style jsx>{`
        .nova-post-pilot {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: var(--font-primary);
        }

        .nova-post-pilot__background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        .cyberpunk-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 255, 231, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 231, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
        }

        .nexus-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255, 0, 128, 0.1) 0%, transparent 50%);
          animation: particles-float 15s ease-in-out infinite;
        }

        .nova-post-pilot__layout {
          display: flex;
          height: 100vh;
          padding-top: 60px; /* Header height */
        }

        .nova-post-pilot__sidebar {
          background: rgba(26, 29, 38, 0.9);
          backdrop-filter: blur(10px);
          border-right: 1px solid rgba(0, 255, 231, 0.3);
          overflow: hidden;
        }

        .nova-post-pilot__main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .nova-post-pilot__content {
          flex: 1;
          padding: var(--spacing-lg);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .nova-post-pilot__right-panel {
          width: 300px;
          background: rgba(26, 29, 38, 0.9);
          backdrop-filter: blur(10px);
          border-left: 1px solid rgba(0, 255, 231, 0.3);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          overflow-y: auto;
        }

        .performance-summary {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-md);
        }

        .performance-summary h3 {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--accent-primary);
          font-size: 14px;
        }

        .performance-metrics {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-sm);
        }

        .metric {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .metric-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-value {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          font-family: var(--font-mono);
        }

        .quick-actions {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-md);
        }

        .quick-actions h3 {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--accent-primary);
          font-size: 14px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-sm);
        }

        .action-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-sm);
          background: rgba(0, 255, 231, 0.1);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-md);
          color: var(--text-primary);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-family: var(--font-primary);
        }

        .action-button:hover {
          background: rgba(0, 255, 231, 0.2);
          border-color: var(--accent-primary);
        }

        .action-icon {
          font-size: 20px;
        }

        .action-label {
          font-size: 10px;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        @keyframes particles-float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, -20px) rotate(180deg); }
        }

        @media (max-width: 1024px) {
          .nova-post-pilot__right-panel {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .nova-post-pilot__layout {
            flex-direction: column;
          }
          
          .nova-post-pilot__sidebar {
            width: 100%;
            height: auto;
            border-right: none;
            border-bottom: 1px solid rgba(0, 255, 231, 0.3);
          }
          
          .nova-post-pilot__content {
            padding: var(--spacing-md);
          }
        }
      `}</style>
    </div>
  );
}