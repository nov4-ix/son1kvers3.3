// Mobile Nexus Visual - Nexus Visual optimizado para móviles y tablets del universo Son1kVerse

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MobileLayout, TouchOptimizedButton, useDeviceInfo } from './index';
import { cn } from '../../shared-utils';

export interface MobileNexusVisualProps {
  className?: string;
  onBack?: () => void;
  onSettings?: () => void;
  onShare?: () => void;
  onFullscreen?: () => void;
}

export function MobileNexusVisual({
  className,
  onBack,
  onSettings,
  onShare,
  onFullscreen
}: MobileNexusVisualProps) {
  const deviceInfo = useDeviceInfo();
  const [activeMode, setActiveMode] = useState<'matrix' | 'glitch' | 'cyberpunk' | 'nexus' | 'son1kverse'>('matrix');
  const [isPlaying, setIsPlaying] = useState(false);
  const [intensity, setIntensity] = useState(0.5);
  const [speed, setSpeed] = useState(1);
  const [colorScheme, setColorScheme] = useState<'green' | 'blue' | 'purple' | 'rainbow'>('green');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchPoints, setTouchPoints] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const matrixRef = useRef<{
    chars: string[];
    drops: number[];
    fontSize: number;
    columns: number;
  }>({
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?',
    drops: [],
    fontSize: 14,
    columns: 0
  });

  // Handle device orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      if (deviceInfo.orientation === 'landscape') {
        setIsFullscreen(true);
        onFullscreen?.();
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, [deviceInfo.orientation, onFullscreen]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = deviceInfo.width;
    canvas.height = deviceInfo.height;

    // Initialize matrix rain
    matrixRef.current.columns = Math.floor(canvas.width / matrixRef.current.fontSize);
    matrixRef.current.drops = Array(matrixRef.current.columns).fill(1);

    // Set font
    ctx.font = `${matrixRef.current.fontSize}px 'JetBrains Mono', monospace`;
  }, [deviceInfo.width, deviceInfo.height]);

  // Matrix rain animation
  const drawMatrixRain = useCallback((ctx: CanvasRenderingContext2D) => {
    const { chars, drops, fontSize, columns } = matrixRef.current;
    
    // Black background with opacity for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw characters
    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Color based on scheme
      let color: string;
      switch (colorScheme) {
        case 'green':
          color = `rgba(0, 255, 0, ${Math.random()})`;
          break;
        case 'blue':
          color = `rgba(0, 212, 255, ${Math.random()})`;
          break;
        case 'purple':
          color = `rgba(255, 0, 128, ${Math.random()})`;
          break;
        case 'rainbow':
          const hue = (i * 360) / columns;
          color = `hsla(${hue}, 100%, 50%, ${Math.random()})`;
          break;
        default:
          color = `rgba(0, 255, 0, ${Math.random()})`;
      }

      ctx.fillStyle = color;
      ctx.fillText(char, x, y);

      // Reset drop if it reaches bottom or randomly
      if (y > ctx.canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i] += speed;
    }
  }, [colorScheme, speed]);

  // Glitch effect animation
  const drawGlitchEffect = useCallback((ctx: CanvasRenderingContext2D) => {
    // Create glitch effect with random rectangles
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * ctx.canvas.width;
      const y = Math.random() * ctx.canvas.height;
      const width = Math.random() * 100;
      const height = Math.random() * 100;

      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`;
      ctx.fillRect(x, y, width, height);
    }

    // Add scan lines
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < ctx.canvas.height; i += 4) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(ctx.canvas.width, i);
      ctx.stroke();
    }
  }, []);

  // Cyberpunk effect animation
  const drawCyberpunkEffect = useCallback((ctx: CanvasRenderingContext2D) => {
    // Neon grid
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    
    for (let x = 0; x < ctx.canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < ctx.canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }

    // Floating particles
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * ctx.canvas.width;
      const y = Math.random() * ctx.canvas.height;
      const size = Math.random() * 4;

      ctx.fillStyle = `rgba(255, 0, 128, ${Math.random()})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  // Nexus effect animation
  const drawNexusEffect = useCallback((ctx: CanvasRenderingContext2D) => {
    // Central nexus point
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const time = Date.now() * 0.001;

    // Draw concentric circles
    for (let i = 0; i < 10; i++) {
      const radius = (i + 1) * 30;
      const alpha = Math.sin(time + i) * 0.5 + 0.5;
      
      ctx.strokeStyle = `rgba(0, 212, 255, ${alpha * 0.3})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw energy lines
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + time;
      const endX = centerX + Math.cos(angle) * 200;
      const endY = centerY + Math.sin(angle) * 200;
      
      ctx.strokeStyle = `rgba(255, 0, 128, 0.5)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }, []);

  // Son1kVerse effect animation
  const drawSon1kVerseEffect = useCallback((ctx: CanvasRenderingContext2D) => {
    // Quantum field simulation
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * ctx.canvas.width;
      const y = Math.random() * ctx.canvas.height;
      const size = Math.sin(time + i) * 10 + 10;
      
      const hue = (time * 50 + i * 3.6) % 360;
      ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.3)`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Text overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.font = '24px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SON1KVERSE', ctx.canvas.width / 2, ctx.canvas.height / 2);
  }, []);

  // Touch interaction
  const handleTouchStart = (event: React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const newTouchPoints: Array<{ x: number; y: number; id: number }> = [];

    for (let i = 0; i < event.touches.length; i++) {
      const touch = event.touches[i];
      newTouchPoints.push({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        id: touch.identifier
      });
    }

    setTouchPoints(newTouchPoints);
  };

  const handleTouchEnd = () => {
    setTouchPoints([]);
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      if (!isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw active effect
      switch (activeMode) {
        case 'matrix':
          drawMatrixRain(ctx);
          break;
        case 'glitch':
          drawGlitchEffect(ctx);
          break;
        case 'cyberpunk':
          drawCyberpunkEffect(ctx);
          break;
        case 'nexus':
          drawNexusEffect(ctx);
          break;
        case 'son1kverse':
          drawSon1kVerseEffect(ctx);
          break;
      }

      // Draw touch points
      touchPoints.forEach(point => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, activeMode, drawMatrixRain, drawGlitchEffect, drawCyberpunkEffect, drawNexusEffect, drawSon1kVerseEffect, touchPoints]);

  // Handle swipe gestures
  const handleSwipeGesture = (direction: 'up' | 'down' | 'left' | 'right') => {
    switch (direction) {
      case 'up':
        setIntensity(Math.min(1, intensity + 0.1));
        break;
      case 'down':
        setIntensity(Math.max(0, intensity - 0.1));
        break;
      case 'left':
        setSpeed(Math.max(0.1, speed - 0.1));
        break;
      case 'right':
        setSpeed(Math.min(3, speed + 0.1));
        break;
    }
  };

  // Handle long press for fullscreen
  const handleLongPress = () => {
    setIsFullscreen(!isFullscreen);
    onFullscreen?.();
  };

  // Handle double tap for play/pause
  const handleDoubleTap = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <MobileLayout
      className={cn('mobile-nexus-visual', className)}
      orientation="auto"
      deviceType="auto"
      safeArea={true}
      statusBar={true}
      navigationBar={true}
      keyboardAvoidance={true}
      scrollable={false}
      fullscreen={isFullscreen}
      theme="dark"
      animations={true}
      gestures={true}
      haptics={true}
      performance={deviceInfo.deviceType === 'mobile' ? 'medium' : 'high'}
    >
      {/* Header */}
      <div className="mobile-nexus-visual__header">
        <TouchOptimizedButton
          variant="ghost"
          size="sm"
          onClick={onBack}
          icon="←"
          iconPosition="left"
          haptic={true}
        >
          Back
        </TouchOptimizedButton>

        <div className="mobile-nexus-visual__title">
          <h1>🌀 Nexus Visual</h1>
          <p>Efectos Visuales</p>
        </div>

        <div className="mobile-nexus-visual__actions">
          <TouchOptimizedButton
            variant="ghost"
            size="sm"
            onClick={onShare}
            icon="📤"
            haptic={true}
          />
          <TouchOptimizedButton
            variant="ghost"
            size="sm"
            onClick={onSettings}
            icon="⚙️"
            haptic={true}
          />
        </div>
      </div>

      {/* Mode Selection */}
      <div className="mobile-nexus-visual__modes">
        {[
          { id: 'matrix', label: 'Matrix', icon: '🌧️' },
          { id: 'glitch', label: 'Glitch', icon: '⚡' },
          { id: 'cyberpunk', label: 'Cyberpunk', icon: '🌃' },
          { id: 'nexus', label: 'Nexus', icon: '🌀' },
          { id: 'son1kverse', label: 'Son1kVerse', icon: '✨' }
        ].map((mode) => (
          <TouchOptimizedButton
            key={mode.id}
            variant={activeMode === mode.id ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveMode(mode.id as any)}
            icon={mode.icon}
            iconPosition="top"
            fullWidth={true}
            haptic={true}
            glitch={activeMode === mode.id}
            cyberpunk={activeMode === mode.id}
            nexus={activeMode === mode.id}
            son1kverse={activeMode === mode.id}
          >
            {mode.label}
          </TouchOptimizedButton>
        ))}
      </div>

      {/* Controls */}
      <div className="mobile-nexus-visual__controls">
        <div className="mobile-nexus-visual__transport">
          <TouchOptimizedButton
            variant="primary"
            size="lg"
            onClick={() => setIsPlaying(!isPlaying)}
            icon={isPlaying ? "⏸️" : "▶️"}
            iconPosition="left"
            haptic={true}
            onDoubleTap={handleDoubleTap}
            cyberpunk={true}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </TouchOptimizedButton>

          <TouchOptimizedButton
            variant="secondary"
            size="lg"
            onClick={() => setIsFullscreen(!isFullscreen)}
            icon="🔍"
            iconPosition="left"
            haptic={true}
            onLongPress={handleLongPress}
            glitch={isFullscreen}
            son1kverse={true}
          >
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </TouchOptimizedButton>
        </div>

        <div className="mobile-nexus-visual__settings">
          <div className="mobile-nexus-visual__setting">
            <label>Intensity: {Math.round(intensity * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={intensity}
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
              className="mobile-nexus-visual__slider"
            />
          </div>

          <div className="mobile-nexus-visual__setting">
            <label>Speed: {speed.toFixed(1)}x</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="mobile-nexus-visual__slider"
            />
          </div>

          <div className="mobile-nexus-visual__setting">
            <label>Color Scheme:</label>
            <div className="mobile-nexus-visual__color-schemes">
              {[
                { id: 'green', label: 'Green', color: '#00ff00' },
                { id: 'blue', label: 'Blue', color: '#00d4ff' },
                { id: 'purple', label: 'Purple', color: '#ff0080' },
                { id: 'rainbow', label: 'Rainbow', color: 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)' }
              ].map((scheme) => (
                <TouchOptimizedButton
                  key={scheme.id}
                  variant={colorScheme === scheme.id ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setColorScheme(scheme.id as any)}
                  haptic={true}
                  nexus={colorScheme === scheme.id}
                >
                  {scheme.label}
                </TouchOptimizedButton>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="mobile-nexus-visual__canvas-container">
        <canvas
          ref={canvasRef}
          className="mobile-nexus-visual__canvas"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            width: '100%',
            height: '100%',
            touchAction: 'none'
          }}
        />
      </div>
    </MobileLayout>
  );
}

// Hook for mobile visual effects
export function useMobileVisualEffects() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [intensity, setIntensity] = useState(0.5);
  const [speed, setSpeed] = useState(1);
  const [colorScheme, setColorScheme] = useState<'green' | 'blue' | 'purple' | 'rainbow'>('green');

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);
  const stop = () => setIsPlaying(false);

  const setIntensityLevel = (level: number) => setIntensity(Math.max(0, Math.min(1, level)));
  const setSpeedLevel = (level: number) => setSpeed(Math.max(0.1, Math.min(3, level)));

  return {
    isPlaying,
    intensity,
    speed,
    colorScheme,
    play,
    pause,
    stop,
    setIntensityLevel,
    setSpeedLevel,
    setColorScheme
  };
}

// Hook for mobile touch interactions
export function useMobileTouchInteractions() {
  const [touchPoints, setTouchPoints] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleTouchStart = (event: React.TouchEvent) => {
    const newTouchPoints: Array<{ x: number; y: number; id: number }> = [];

    for (let i = 0; i < event.touches.length; i++) {
      const touch = event.touches[i];
      newTouchPoints.push({
        x: touch.clientX,
        y: touch.clientY,
        id: touch.identifier
      });
    }

    setTouchPoints(newTouchPoints);
  };

  const handleTouchEnd = () => {
    setTouchPoints([]);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    const newTouchPoints: Array<{ x: number; y: number; id: number }> = [];

    for (let i = 0; i < event.touches.length; i++) {
      const touch = event.touches[i];
      newTouchPoints.push({
        x: touch.clientX,
        y: touch.clientY,
        id: touch.identifier
      });
    }

    setTouchPoints(newTouchPoints);
  };

  return {
    touchPoints,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove
  };
}