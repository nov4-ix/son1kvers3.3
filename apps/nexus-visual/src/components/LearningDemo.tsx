// Learning Demo - Demostración del sistema de aprendizaje adaptativo
// Muestra cómo cada pixel aprende del comportamiento del usuario

import React, { useState, useEffect } from 'react';
import { AdaptivePixelGrid, useAdaptiveLearning, PixelLearningUtils } from '@son1k/shared-ui';
import { cn } from '@son1k/shared-utils';

export function LearningDemo() {
  const { recordBehavior, getLearningStats, registerProAccount } = useAdaptiveLearning();
  const [stats, setStats] = useState<any>(null);
  const [isProAccount, setIsProAccount] = useState(false);
  const [selectedPixel, setSelectedPixel] = useState<any>(null);
  const [interactionCount, setInteractionCount] = useState(0);

  // Actualizar estadísticas
  useEffect(() => {
    const updateStats = () => {
      const currentStats = getLearningStats();
      setStats(currentStats);
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [getLearningStats]);

  // Registrar cuenta profesional de demostración
  useEffect(() => {
    const proAccountData = PixelLearningUtils.createProAccountData(
      'demo_user',
      'pro',
      'premium',
      true,
      true
    );
    registerProAccount(proAccountData);
    setIsProAccount(true);
  }, [registerProAccount]);

  // Simular comportamiento del usuario
  const simulateUserBehavior = () => {
    const actions = ['click', 'hover', 'drag', 'scroll', 'keypress'];
    const contexts = ['nexus-visual', 'ghost-studio', 'sonic-daw', 'clone-station', 'nova-post-pilot'];
    
    const action = actions[Math.floor(Math.random() * actions.length)];
    const context = contexts[Math.floor(Math.random() * contexts.length)];
    
    recordBehavior(PixelLearningUtils.createUserBehavior(
      'demo_user',
      'demo_session',
      action,
      context,
      Math.random() * 5000,
      Math.random(),
      Math.random() > 0.2, // 80% success rate
      { simulated: true, timestamp: Date.now() }
    ));
    
    setInteractionCount(prev => prev + 1);
  };

  // Simular comportamiento automáticamente
  useEffect(() => {
    const interval = setInterval(simulateUserBehavior, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="learning-demo">
      <div className="demo-header">
        <h2>🧠 Adaptive Learning Demo</h2>
        <p>Watch as pixels learn from user behavior and adapt in real-time</p>
      </div>

      <div className="demo-content">
        <div className="demo-grid">
          <AdaptivePixelGrid
            width={50}
            height={50}
            pixelSize={6}
            learningEnabled={true}
            showLearningStats={true}
            onPixelClick={(pixel) => setSelectedPixel(pixel)}
            className="demo-pixel-grid"
          />
        </div>

        <div className="demo-controls">
          <div className="control-section">
            <h3>🎮 Interactive Controls</h3>
            <div className="control-buttons">
              <button
                onClick={simulateUserBehavior}
                className="demo-button"
              >
                Simulate Interaction
              </button>
              
              <button
                onClick={() => {
                  // Simular múltiples interacciones
                  for (let i = 0; i < 10; i++) {
                    setTimeout(() => simulateUserBehavior(), i * 100);
                  }
                }}
                className="demo-button"
              >
                Simulate Batch (10x)
              </button>
            </div>
          </div>

          <div className="control-section">
            <h3>📊 Learning Statistics</h3>
            {stats && (
              <div className="stats-display">
                <div className="stat-row">
                  <span className="stat-label">Total Pixels:</span>
                  <span className="stat-value">{stats.totalPixels}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Adapted Pixels:</span>
                  <span className="stat-value">{stats.adaptedPixels}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Adaptation Rate:</span>
                  <span className="stat-value">{(stats.adaptationRate * 100).toFixed(1)}%</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Total Patterns:</span>
                  <span className="stat-value">{stats.totalPatterns}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Avg Confidence:</span>
                  <span className="stat-value">{(stats.avgConfidence * 100).toFixed(1)}%</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Pro Accounts:</span>
                  <span className="stat-value">{stats.proAccounts}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Interactions:</span>
                  <span className="stat-value">{interactionCount}</span>
                </div>
              </div>
            )}
          </div>

          <div className="control-section">
            <h3>🔍 Selected Pixel Info</h3>
            {selectedPixel ? (
              <div className="pixel-details">
                <div className="pixel-id">Pixel: {selectedPixel.pixelId}</div>
                <div className="pixel-position">
                  Position: ({selectedPixel.position.x}, {selectedPixel.position.y})
                </div>
                <div className="pixel-behavior">
                  Behavior: {selectedPixel.behavior}
                </div>
                <div className="pixel-adaptation">
                  Adaptation: {(selectedPixel.adaptationLevel * 100).toFixed(1)}%
                </div>
                <div className="pixel-patterns">
                  Learned Patterns: {selectedPixel.learnedPatterns.length}
                </div>
                <div className="pixel-personalized">
                  Personalized: {selectedPixel.userPreferences.personalized ? 'Yes' : 'No'}
                </div>
                {selectedPixel.learnedPatterns.length > 0 && (
                  <div className="patterns-preview">
                    <h4>Recent Patterns:</h4>
                    {selectedPixel.learnedPatterns.slice(0, 3).map((pattern: any, index: number) => (
                      <div key={pattern.id} className="pattern-item">
                        <span className="pattern-name">{pattern.pattern}</span>
                        <span className="pattern-confidence">
                          {(pattern.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p>Click on a pixel to see its learning data</p>
            )}
          </div>
        </div>
      </div>

      <div className="demo-explanation">
        <h3>🎯 How It Works</h3>
        <div className="explanation-grid">
          <div className="explanation-item">
            <h4>1. Behavior Tracking</h4>
            <p>Every user interaction is recorded and analyzed in real-time</p>
          </div>
          <div className="explanation-item">
            <h4>2. Pattern Learning</h4>
            <p>Pixels learn from repeated behaviors and build confidence patterns</p>
          </div>
          <div className="explanation-item">
            <h4>3. Adaptive Response</h4>
            <p>Pixels respond differently based on learned user preferences</p>
          </div>
          <div className="explanation-item">
            <h4>4. Pro Account Benefits</h4>
            <p>Professional accounts get enhanced learning and personalization</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .learning-demo {
          padding: var(--spacing-lg);
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .demo-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }
        
        .demo-header h2 {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--accent-primary);
          font-size: 28px;
        }
        
        .demo-header p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 16px;
        }
        
        .demo-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
        }
        
        .demo-grid {
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        
        .demo-pixel-grid {
          max-width: 400px;
        }
        
        .demo-controls {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }
        
        .control-section {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-md);
        }
        
        .control-section h3 {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--accent-primary);
          font-size: 16px;
        }
        
        .control-buttons {
          display: flex;
          gap: var(--spacing-sm);
        }
        
        .demo-button {
          padding: var(--spacing-sm) var(--spacing-md);
          background: rgba(0, 255, 231, 0.1);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-md);
          color: var(--text-primary);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-family: var(--font-mono);
          font-size: 12px;
        }
        
        .demo-button:hover {
          background: rgba(0, 255, 231, 0.2);
          border-color: var(--accent-primary);
        }
        
        .stats-display {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        
        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .stat-label {
          font-size: 12px;
          color: var(--text-muted);
        }
        
        .stat-value {
          font-size: 14px;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-weight: 600;
        }
        
        .pixel-details {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        
        .pixel-id {
          font-weight: 600;
          color: var(--accent-primary);
        }
        
        .pixel-position,
        .pixel-behavior,
        .pixel-adaptation,
        .pixel-patterns,
        .pixel-personalized {
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        .patterns-preview {
          margin-top: var(--spacing-sm);
          padding-top: var(--spacing-sm);
          border-top: 1px solid rgba(0, 255, 231, 0.2);
        }
        
        .patterns-preview h4 {
          margin: 0 0 var(--spacing-xs) 0;
          color: var(--text-primary);
          font-size: 12px;
        }
        
        .pattern-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10px;
          color: var(--text-muted);
        }
        
        .pattern-name {
          font-family: var(--font-mono);
        }
        
        .pattern-confidence {
          color: var(--accent-primary);
        }
        
        .demo-explanation {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
        }
        
        .demo-explanation h3 {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--accent-primary);
          text-align: center;
        }
        
        .explanation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-md);
        }
        
        .explanation-item {
          text-align: center;
        }
        
        .explanation-item h4 {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--text-primary);
          font-size: 14px;
        }
        
        .explanation-item p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 12px;
          line-height: 1.5;
        }
        
        @media (max-width: 1024px) {
          .demo-content {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
          }
          
          .demo-controls {
            order: -1;
          }
        }
        
        @media (max-width: 768px) {
          .learning-demo {
            padding: var(--spacing-md);
          }
          
          .explanation-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}