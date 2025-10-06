// Adaptive Matrix Rain - Lluvia Matrix adaptativa que aprende del usuario
// Cada píxel se adapta basado en el comportamiento del usuario

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AdaptivePixelGrid, useAdaptiveLearning, PixelLearningUtils } from '@son1k/shared-ui';
import { cn } from '@son1k/shared-utils';

export interface AdaptiveMatrixRainProps {
  width?: number;
  height?: number;
  intensity?: number;
  speed?: number;
  learningEnabled?: boolean;
  className?: string;
}

export function AdaptiveMatrixRain({
  width = 100,
  height = 100,
  intensity = 1,
  speed = 1,
  learningEnabled = true,
  className
}: AdaptiveMatrixRainProps) {
  const { recordBehavior, getPixelResponse } = useAdaptiveLearning();
  const [isActive, setIsActive] = useState(true);
  const [userInteractions, setUserInteractions] = useState(0);
  const [learningStats, setLearningStats] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastInteractionRef = useRef<number>(0);

  // Caracteres katakana para la lluvia Matrix
  const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  const characters = katakana.split('');

  // Estado de la lluvia Matrix
  const [drops, setDrops] = useState<Array<{
    x: number;
    y: number;
    speed: number;
    character: string;
    opacity: number;
    learningLevel: number;
  }>>([]);

  // Inicializar gotas
  useEffect(() => {
    const initializeDrops = () => {
      const newDrops: Array<{
        x: number;
        y: number;
        speed: number;
        character: string;
        opacity: number;
        learningLevel: number;
      }> = [];

      for (let i = 0; i < width; i++) {
        newDrops.push({
          x: i,
          y: Math.random() * height,
          speed: Math.random() * 2 + 1,
          character: characters[Math.floor(Math.random() * characters.length)],
          opacity: Math.random(),
          learningLevel: 0
        });
      }

      setDrops(newDrops);
    };

    initializeDrops();
  }, [width, height, characters]);

  // Renderizar lluvia Matrix
  const renderMatrixRain = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Configurar fuente
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';

    // Renderizar cada gota
    drops.forEach((drop, index) => {
      // Obtener respuesta adaptativa del píxel
      const pixelId = PixelLearningUtils.generatePixelId(drop.x, drop.y);
      const response = getPixelResponse(pixelId, 'matrix_rain');
      
      // Aplicar aprendizaje adaptativo
      if (response.personalized) {
        drop.learningLevel = response.confidence;
        drop.speed = response.intensity * speed;
        drop.opacity = response.intensity;
      }

      // Color basado en nivel de aprendizaje
      const greenIntensity = Math.min(255, 50 + (drop.learningLevel * 205));
      ctx.fillStyle = `rgba(0, ${greenIntensity}, 0, ${drop.opacity})`;
      
      // Efecto de brillo para píxeles altamente adaptados
      if (drop.learningLevel > 0.7) {
        ctx.shadowColor = `rgba(0, ${greenIntensity}, 0, 0.8)`;
        ctx.shadowBlur = 10;
      } else {
        ctx.shadowBlur = 0;
      }

      // Renderizar carácter
      ctx.fillText(drop.character, drop.x * 10, drop.y * 20);

      // Actualizar posición
      drop.y += drop.speed * speed;

      // Reiniciar gota si sale de la pantalla
      if (drop.y > height) {
        drop.y = 0;
        drop.character = characters[Math.floor(Math.random() * characters.length)];
        drop.learningLevel = Math.max(0, drop.learningLevel - 0.1); // Decaimiento gradual
      }
    });

    // Aplicar efecto de desvanecimiento
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [drops, width, height, speed, characters, getPixelResponse]);

  // Loop de animación
  useEffect(() => {
    const animate = () => {
      if (isActive) {
        renderMatrixRain();
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, renderMatrixRain]);

  // Manejar interacciones del usuario
  const handleUserInteraction = useCallback((type: string, x: number, y: number) => {
    const now = Date.now();
    const timeSinceLastInteraction = now - lastInteractionRef.current;
    
    // Registrar comportamiento
    if (learningEnabled) {
      recordBehavior(PixelLearningUtils.createUserBehavior(
        'user_1',
        'session_1',
        type,
        'nexus-visual',
        timeSinceLastInteraction,
        intensity,
        true,
        { x, y, matrixRain: true }
      ));
    }

    setUserInteractions(prev => prev + 1);
    lastInteractionRef.current = now;

    // Afectar gotas cercanas
    const nearbyDrops = drops.filter(drop => 
      Math.abs(drop.x - x) < 5 && Math.abs(drop.y - y) < 10
    );

    nearbyDrops.forEach(drop => {
      drop.learningLevel = Math.min(1, drop.learningLevel + 0.2);
      drop.speed = Math.min(5, drop.speed + 0.5);
      drop.opacity = Math.min(1, drop.opacity + 0.3);
    });
  }, [drops, learningEnabled, recordBehavior, intensity]);

  // Manejar click
  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / 10;
    const y = (event.clientY - rect.top) / 20;
    
    handleUserInteraction('click', x, y);
  };

  // Manejar hover
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / 10;
    const y = (event.clientY - rect.top) / 20;
    
    // Solo registrar hover ocasionalmente para no saturar
    if (Math.random() < 0.1) {
      handleUserInteraction('hover', x, y);
    }
  };

  // Manejar teclado
  const handleKeyPress = (event: React.KeyboardEvent) => {
    const key = event.key;
    if (key === ' ') {
      event.preventDefault();
      setIsActive(!isActive);
      handleUserInteraction('toggle', width / 2, height / 2);
    } else if (key === 'r') {
      event.preventDefault();
      setDrops(prev => prev.map(drop => ({
        ...drop,
        y: Math.random() * height,
        character: characters[Math.floor(Math.random() * characters.length)],
        learningLevel: 0
      })));
      handleUserInteraction('reset', width / 2, height / 2);
    }
  };

  return (
    <div className={cn('adaptive-matrix-rain', className)}>
      <div className="matrix-controls">
        <button
          onClick={() => setIsActive(!isActive)}
          className={cn('control-button', isActive && 'active')}
        >
          {isActive ? '⏸️ Pause' : '▶️ Play'}
        </button>
        
        <button
          onClick={() => {
            setDrops(prev => prev.map(drop => ({
              ...drop,
              y: Math.random() * height,
              character: characters[Math.floor(Math.random() * characters.length)],
              learningLevel: 0
            })));
            handleUserInteraction('reset', width / 2, height / 2);
          }}
          className="control-button"
        >
          🔄 Reset
        </button>
        
        <div className="stats">
          <span>Interactions: {userInteractions}</span>
          <span>Learning: {learningEnabled ? 'ON' : 'OFF'}</span>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={width * 10}
        height={height * 20}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onKeyDown={handleKeyPress}
        tabIndex={0}
        className="matrix-canvas"
      />

      <div className="instructions">
        <p>Click to interact • Space to pause • R to reset</p>
        <p>Each pixel learns from your behavior and adapts in real-time</p>
      </div>

      <style jsx>{`
        .adaptive-matrix-rain {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          align-items: center;
        }
        
        .matrix-controls {
          display: flex;
          gap: var(--spacing-md);
          align-items: center;
        }
        
        .control-button {
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
        
        .control-button:hover {
          background: rgba(0, 255, 231, 0.2);
          border-color: var(--accent-primary);
        }
        
        .control-button.active {
          background: rgba(0, 255, 231, 0.3);
          border-color: var(--accent-primary);
        }
        
        .stats {
          display: flex;
          gap: var(--spacing-md);
          font-size: 12px;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }
        
        .matrix-canvas {
          border: 1px solid rgba(0, 255, 0, 0.3);
          border-radius: var(--border-radius-md);
          background: rgba(0, 0, 0, 0.8);
          cursor: crosshair;
        }
        
        .matrix-canvas:focus {
          outline: 2px solid var(--accent-primary);
          outline-offset: 2px;
        }
        
        .instructions {
          text-align: center;
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.5;
        }
        
        .instructions p {
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .matrix-controls {
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .matrix-canvas {
            width: 100%;
            max-width: 400px;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
}