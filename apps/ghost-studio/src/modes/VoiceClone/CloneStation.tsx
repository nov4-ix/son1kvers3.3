// Clone Station - Página principal de Clone Station del universo Son1kVerse

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCloneStore } from '../store/useCloneStore';
import { DatasetManager } from '../components/DatasetManager';
import { ModelManager } from '../components/ModelManager';
import { TrainingManager } from '../components/TrainingManager';
import { ConversionManager } from '../components/ConversionManager';
import { QualityManager } from '../components/QualityManager';
import { PerformanceMonitor } from '../components/PerformanceMonitor';
import { StatisticsPanel } from '../components/StatisticsPanel';
import { SettingsPanel } from '../components/SettingsPanel';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { StatusBar } from '../components/StatusBar';
import { NotificationCenter } from '../components/NotificationCenter';

export function CloneStation() {
  const {
    activeTab,
    sidebarOpen,
    theme,
    language,
    performance,
    statistics,
    settings,
    startPerformanceMonitoring,
    stopPerformanceMonitoring,
  } = useCloneStore();

  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>>([]);

  // Start performance monitoring on mount
  useEffect(() => {
    startPerformanceMonitoring();
    return () => stopPerformanceMonitoring();
  }, [startPerformanceMonitoring, stopPerformanceMonitoring]);

  // Add sample data for demonstration
  useEffect(() => {
    const { datasets, models } = useCloneStore.getState();
    
    if (datasets.length === 0) {
      // Add sample datasets
      useCloneStore.getState().addDataset({
        name: 'Sample Voice Dataset',
        description: 'High-quality voice samples for training',
        type: 'voice',
        size: 150.5,
        duration: 3600,
        quality: 'high',
        format: 'wav',
        language: 'es',
        accent: 'neutral',
        gender: 'female',
        age: 'adult',
        emotion: 'neutral',
        tags: ['voice', 'spanish', 'female', 'neutral'],
        status: 'ready',
        progress: 100,
        metadata: {
          sampleRate: 44100,
          bitDepth: 24,
          channels: 2,
          duration: 3600,
          format: 'wav',
          language: 'es',
          accent: 'neutral',
          gender: 'female',
          age: 'adult',
          emotion: 'neutral',
        },
      });

      useCloneStore.getState().addDataset({
        name: 'Music Samples Collection',
        description: 'Diverse music samples for training',
        type: 'music',
        size: 500.2,
        duration: 7200,
        quality: 'ultra',
        format: 'flac',
        genre: 'electronic',
        instruments: ['synthesizer', 'drum', 'bass'],
        tags: ['music', 'electronic', 'samples'],
        status: 'ready',
        progress: 100,
        metadata: {
          sampleRate: 48000,
          bitDepth: 32,
          channels: 2,
          duration: 7200,
          format: 'flac',
          genre: 'electronic',
          instruments: ['synthesizer', 'drum', 'bass'],
        },
      });
    }

    if (models.length === 0) {
      // Add sample models
      useCloneStore.getState().addModel({
        name: 'Phantom Voice Model',
        description: 'Advanced voice cloning model',
        type: 'voice_clone',
        datasetId: 'sample-dataset-1',
        datasetName: 'Sample Voice Dataset',
        status: 'ready',
        progress: 100,
        accuracy: 92.5,
        quality: 'ultra',
        trainingTime: 45,
        epochs: 100,
        loss: 0.08,
        validationLoss: 0.12,
        learningRate: 0.001,
        batchSize: 32,
        modelSize: 125.5,
        parameters: 2500000,
        architecture: 'transformer',
        framework: 'pytorch',
        version: '1.0.0',
        config: {
          learningRate: 0.001,
          batchSize: 32,
          epochs: 100,
          optimizer: 'adam',
          lossFunction: 'mse',
          activationFunction: 'relu',
          dropout: 0.1,
          regularization: 'l2',
          earlyStopping: true,
          patience: 10,
          minDelta: 0.001,
          dataAugmentation: true,
          normalization: 'zscore',
          featureScaling: true,
          crossValidation: true,
          testSplit: 0.2,
          validationSplit: 0.2,
          randomSeed: 42,
          gpuAcceleration: true,
          mixedPrecision: true,
          gradientClipping: true,
          maxGradientNorm: 1.0,
          weightDecay: 0.0001,
          momentum: 0.9,
          beta1: 0.9,
          beta2: 0.999,
          epsilon: 1e-8,
        },
        metrics: {
          accuracy: 92.5,
          precision: 90.2,
          recall: 88.7,
          f1Score: 89.4,
          auc: 0.95,
          mse: 0.08,
          mae: 0.05,
          rmse: 0.09,
          r2Score: 0.92,
          trainingLoss: Array.from({ length: 100 }, (_, i) => 1 - (i / 100) + Math.random() * 0.1),
          validationLoss: Array.from({ length: 100 }, (_, i) => 1 - (i / 100) + Math.random() * 0.15),
          trainingAccuracy: Array.from({ length: 100 }, (_, i) => (i / 100) * 0.9 + Math.random() * 0.1),
          validationAccuracy: Array.from({ length: 100 }, (_, i) => (i / 100) * 0.85 + Math.random() * 0.15),
          learningRateHistory: Array.from({ length: 100 }, () => 0.001),
          epochTime: Array.from({ length: 100 }, () => 30 + Math.random() * 20),
          totalTrainingTime: 45,
          bestEpoch: 85,
          overfitting: false,
          convergence: true,
          stability: 95,
          generalization: 88,
          robustness: 92,
          efficiency: 90,
        },
      });
    }
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'datasets':
        return <DatasetManager />;
      case 'models':
        return <ModelManager />;
      case 'training':
        return <TrainingManager />;
      case 'conversion':
        return <ConversionManager />;
      case 'quality':
        return <QualityManager />;
      default:
        return <DatasetManager />;
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
    <div className={`clone-station ${theme}`}>
      {/* Background Effects */}
      <div className="clone-station__background">
        <div className="matrix-bg" />
        <div className="cyberpunk-grid" />
        <div className="nexus-particles" />
      </div>

      {/* Header */}
      <Header />

      {/* Main Layout */}
      <div className="clone-station__layout">
        {/* Sidebar */}
        <motion.div
          className={`clone-station__sidebar ${sidebarOpen ? 'open' : 'closed'}`}
          initial={false}
          animate={{ width: sidebarOpen ? 280 : 60 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Sidebar />
        </motion.div>

        {/* Main Content */}
        <div className="clone-station__main">
          {/* Status Bar */}
          <StatusBar />

          {/* Tab Content */}
          <motion.div
            className="clone-station__content"
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
        <div className="clone-station__right-panel">
          {/* Performance Monitor */}
          <PerformanceMonitor />

          {/* Statistics Panel */}
          <StatisticsPanel />

          {/* Settings Panel */}
          <SettingsPanel />
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
        .clone-station {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: var(--font-primary);
        }

        .clone-station__background {
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

        .clone-station__layout {
          display: flex;
          height: 100vh;
          padding-top: 60px; /* Header height */
        }

        .clone-station__sidebar {
          background: rgba(26, 29, 38, 0.9);
          backdrop-filter: blur(10px);
          border-right: 1px solid rgba(0, 255, 231, 0.3);
          overflow: hidden;
        }

        .clone-station__main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .clone-station__content {
          flex: 1;
          padding: var(--spacing-lg);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .clone-station__right-panel {
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

        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        @keyframes particles-float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-20px, -20px) rotate(180deg); }
        }

        @media (max-width: 1024px) {
          .clone-station__right-panel {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .clone-station__layout {
            flex-direction: column;
          }
          
          .clone-station__sidebar {
            width: 100%;
            height: auto;
            border-right: none;
            border-bottom: 1px solid rgba(0, 255, 231, 0.3);
          }
          
          .clone-station__content {
            padding: var(--spacing-md);
          }
        }
      `}</style>
    </div>
  );
}