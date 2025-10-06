// Adaptive Pixel Grid - Grid de píxeles adaptativos del universo Son1kVerse
// Cada pixel aprende del comportamiento del usuario y se adapta en tiempo real

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdaptiveLearning, PixelLearningUtils, type PixelLearning, type AdaptiveResponse } from '../../shared-utils';
import { cn } from '../../shared-utils';

export interface AdaptivePixelGridProps {
  width?: number;
  height?: number;
  pixelSize?: number;
  learningEnabled?: boolean;
  showLearningStats?: boolean;
  onPixelClick?: (pixel: PixelLearning) => void;
  onPixelHover?: (pixel: PixelLearning) => void;
  className?: string;
}

export function AdaptivePixelGrid({
  width = 100,
  height = 100,
  pixelSize = 4,
  learningEnabled = true,
  showLearningStats = true,
  onPixelClick,
  onPixelHover,
  className
}: AdaptivePixelGridProps) {
  const { recordBehavior, getPixelResponse, getLearningStats } = useAdaptiveLearning();
  const [pixels, setPixels] = useState<PixelLearning[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [hoveredPixel, setHoveredPixel] = useState<PixelLearning | null>(null);
  const [selectedPixel, setSelectedPixel] = useState<PixelLearning | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Inicializar píxeles
  useEffect(() => {
    const initializePixels = () => {
      const newPixels: PixelLearning[] = [];
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const pixelId = PixelLearningUtils.generatePixelId(x, y);
          newPixels.push({
            pixelId,
            position: { x, y },
            color: '#00FFE7',
            intensity: Math.random(),
            behavior: 'glitch',
            learnedPatterns: [],
            adaptationLevel: 0,
            lastUpdated: new Date(),
            userPreferences: {
              colorScheme: 'cyberpunk',
              intensity: 'medium',
              speed: 'normal',
              effects: ['glitch', 'matrix'],
              interactions: ['hover', 'click'],
              personalized: false
            }
          });
        }
      }
      setPixels(newPixels);
    };

    initializePixels();
  }, [width, height]);

  // Actualizar estadísticas
  useEffect(() => {
    if (showLearningStats) {
      const updateStats = () => {
        const currentStats = getLearningStats();
        setStats(currentStats);
      };

      updateStats();
      const interval = setInterval(updateStats, 1000);
      return () => clearInterval(interval);
    }
  }, [showLearningStats, getLearningStats]);

  // Renderizar píxeles en canvas
  const renderPixels = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Renderizar cada píxel
    pixels.forEach(pixel => {
      const x = pixel.position.x * pixelSize;
      const y = pixel.position.y * pixelSize;
      
      // Color basado en preferencias del usuario
      let color = pixel.color;
      if (pixel.userPreferences.personalized) {
        switch (pixel.userPreferences.colorScheme) {
          case 'cyberpunk':
            color = '#00FFE7';
            break;
          case 'matrix':
            color = '#00FF00';
            break;
          case 'nexus':
            color = '#00D4FF';
            break;
          case 'son1kverse':
            color = '#B84DFF';
            break;
        }
      }

      // Intensidad basada en nivel de adaptación
      const alpha = 0.3 + (pixel.adaptationLevel * 0.7);
      const intensity = pixel.intensity * (pixel.userPreferences.intensity === 'high' ? 1.5 : 1);
      
      // Efectos visuales basados en comportamiento aprendido
      if (pixel.behavior === 'glitch') {
        // Efecto glitch
        ctx.fillStyle = `rgba(255, 0, 128, ${alpha * intensity})`;
        ctx.fillRect(x + Math.random() * 2 - 1, y + Math.random() * 2 - 1, pixelSize, pixelSize);
      } else if (pixel.behavior === 'matrix') {
        // Efecto matrix
        ctx.fillStyle = `rgba(0, 255, 0, ${alpha * intensity})`;
        ctx.fillRect(x, y, pixelSize, pixelSize);
      } else if (pixel.behavior === 'cyberpunk') {
        // Efecto cyberpunk
        ctx.fillStyle = `rgba(0, 255, 231, ${alpha * intensity})`;
        ctx.fillRect(x, y, pixelSize, pixelSize);
      } else if (pixel.behavior === 'nexus') {
        // Efecto nexus
        ctx.fillStyle = `rgba(0, 212, 255, ${alpha * intensity})`;
        ctx.fillRect(x, y, pixelSize, pixelSize);
      } else if (pixel.behavior === 'son1kverse') {
        // Efecto son1kverse
        ctx.fillStyle = `rgba(184, 77, 255, ${alpha * intensity})`;
        ctx.fillRect(x, y, pixelSize, pixelSize);
      }

      // Resaltar píxeles con alto nivel de adaptación
      if (pixel.adaptationLevel > 0.7) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${pixel.adaptationLevel})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, pixelSize, pixelSize);
      }
    });
  }, [pixels, pixelSize]);

  // Loop de animación
  useEffect(() => {
    const animate = () => {
      renderPixels();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [renderPixels]);

  // Manejar click en píxel
  const handlePixelClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / pixelSize);
    const y = Math.floor((event.clientY - rect.top) / pixelSize);
    
    if (x >= 0 && x < width && y >= 0 && y < height) {
      const pixelId = PixelLearningUtils.generatePixelId(x, y);
      const pixel = pixels.find(p => p.pixelId === pixelId);
      
      if (pixel) {
        setSelectedPixel(pixel);
        onPixelClick?.(pixel);
        
        // Registrar comportamiento
        if (learningEnabled) {
          recordBehavior(PixelLearningUtils.createUserBehavior(
            'user_1', // En una app real, esto vendría del contexto de usuario
            'session_1',
            'click',
            'pixel_grid',
            Date.now() - (pixel.lastUpdated?.getTime() || 0),
            pixel.intensity,
            true,
            { pixelId, position: { x, y } }
          ));
        }
      }
    }
  };

  // Manejar hover en píxel
  const handlePixelHover = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / pixelSize);
    const y = Math.floor((event.clientY - rect.top) / pixelSize);
    
    if (x >= 0 && x < width && y >= 0 && y < height) {
      const pixelId = PixelLearningUtils.generatePixelId(x, y);
      const pixel = pixels.find(p => p.pixelId === pixelId);
      
      if (pixel) {
        setHoveredPixel(pixel);
        onPixelHover?.(pixel);
        
        // Registrar comportamiento
        if (learningEnabled) {
          recordBehavior(PixelLearningUtils.createUserBehavior(
            'user_1',
            'session_1',
            'hover',
            'pixel_grid',
            100, // Duración estimada de hover
            pixel.intensity,
            true,
            { pixelId, position: { x, y } }
          ));
        }
      }
    } else {
      setHoveredPixel(null);
    }
  };

  return (
    <div className={cn('adaptive-pixel-grid', className)}>
      <canvas
        ref={canvasRef}
        width={width * pixelSize}
        height={height * pixelSize}
        onClick={handlePixelClick}
        onMouseMove={handlePixelHover}
        className="pixel-canvas"
      />
      
      {/* Estadísticas de aprendizaje */}
      {showLearningStats && stats && (
        <div className="learning-stats">
          <h3>🧠 Pixel Learning Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Pixels</span>
              <span className="stat-value">{stats.totalPixels}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Adapted Pixels</span>
              <span className="stat-value">{stats.adaptedPixels}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Adaptation Rate</span>
              <span className="stat-value">{(stats.adaptationRate * 100).toFixed(1)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Patterns</span>
              <span className="stat-value">{stats.totalPatterns}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg Confidence</span>
              <span className="stat-value">{(stats.avgConfidence * 100).toFixed(1)}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pro Accounts</span>
              <span className="stat-value">{stats.proAccounts}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Información del píxel hovered */}
      <AnimatePresence>
        {hoveredPixel && (
          <motion.div
            className="pixel-info"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <h4>Pixel {hoveredPixel.pixelId}</h4>
            <div className="pixel-details">
              <div className="detail-item">
                <span>Position:</span>
                <span>{hoveredPixel.position.x}, {hoveredPixel.position.y}</span>
              </div>
              <div className="detail-item">
                <span>Behavior:</span>
                <span>{hoveredPixel.behavior}</span>
              </div>
              <div className="detail-item">
                <span>Adaptation:</span>
                <span>{(hoveredPixel.adaptationLevel * 100).toFixed(1)}%</span>
              </div>
              <div className="detail-item">
                <span>Patterns:</span>
                <span>{hoveredPixel.learnedPatterns.length}</span>
              </div>
              <div className="detail-item">
                <span>Personalized:</span>
                <span>{hoveredPixel.userPreferences.personalized ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Información del píxel seleccionado */}
      <AnimatePresence>
        {selectedPixel && (
          <motion.div
            className="selected-pixel-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h4>Selected Pixel: {selectedPixel.pixelId}</h4>
            <div className="pixel-patterns">
              <h5>Learned Patterns:</h5>
              {selectedPixel.learnedPatterns.length > 0 ? (
                <div className="patterns-list">
                  {selectedPixel.learnedPatterns.map((pattern, index) => (
                    <div key={pattern.id} className="pattern-item">
                      <div className="pattern-header">
                        <span className="pattern-name">{pattern.pattern}</span>
                        <span className="pattern-confidence">
                          {(pattern.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="pattern-details">
                        <span>Frequency: {pattern.frequency}</span>
                        <span>Effectiveness: {(pattern.effectiveness * 100).toFixed(1)}%</span>
                        <span>Context: {pattern.context}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No patterns learned yet</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx>{`
        .adaptive-pixel-grid {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .pixel-canvas {
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-md);
          cursor: crosshair;
          background: rgba(0, 0, 0, 0.5);
        }
        
        .learning-stats {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-md);
        }
        
        .learning-stats h3 {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--accent-primary);
          font-size: 16px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--spacing-sm);
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .stat-label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .stat-value {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          font-family: var(--font-mono);
        }
        
        .pixel-info {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(26, 29, 38, 0.95);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-md);
          padding: var(--spacing-sm);
          backdrop-filter: blur(10px);
          z-index: 10;
        }
        
        .pixel-info h4 {
          margin: 0 0 var(--spacing-xs) 0;
          color: var(--accent-primary);
          font-size: 14px;
        }
        
        .pixel-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          gap: var(--spacing-sm);
          font-size: 12px;
        }
        
        .detail-item span:first-child {
          color: var(--text-muted);
        }
        
        .detail-item span:last-child {
          color: var(--text-primary);
          font-family: var(--font-mono);
        }
        
        .selected-pixel-info {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-md);
        }
        
        .selected-pixel-info h4 {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--accent-primary);
        }
        
        .pixel-patterns h5 {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--text-primary);
          font-size: 14px;
        }
        
        .patterns-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        
        .pattern-item {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(0, 255, 231, 0.2);
          border-radius: var(--border-radius-md);
          padding: var(--spacing-sm);
        }
        
        .pattern-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xs);
        }
        
        .pattern-name {
          font-weight: 600;
          color: var(--text-primary);
        }
        
        .pattern-confidence {
          font-size: 12px;
          color: var(--accent-primary);
          font-family: var(--font-mono);
        }
        
        .pattern-details {
          display: flex;
          gap: var(--spacing-sm);
          font-size: 10px;
          color: var(--text-muted);
        }
        
        @media (max-width: 768px) {
          .pixel-info {
            position: static;
            margin-top: var(--spacing-md);
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}