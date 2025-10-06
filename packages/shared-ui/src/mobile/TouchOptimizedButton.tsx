// Touch Optimized Button - Botón optimizado para touch del universo Son1kVerse

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../shared-utils';

export interface TouchOptimizedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  onSwipe?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  haptic?: boolean;
  ripple?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  fullWidth?: boolean;
  rounded?: boolean;
  glow?: boolean;
  glitch?: boolean;
  cyberpunk?: boolean;
  matrix?: boolean;
  nexus?: boolean;
  son1kverse?: boolean;
}

export function TouchOptimizedButton({
  children,
  onClick,
  onLongPress,
  onDoubleTap,
  onSwipe,
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  haptic = true,
  ripple = true,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = false,
  glow = false,
  glitch = false,
  cyberpunk = false,
  matrix = false,
  nexus = false,
  son1kverse = false
}: TouchOptimizedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [rippleEffect, setRippleEffect] = useState<{ x: number; y: number } | null>(null);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [matrixEffect, setMatrixEffect] = useState(false);
  
  const buttonRef = useRef<HTMLButtonElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const lastTapTime = useRef<number>(0);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const touchStartTime = useRef<number>(0);

  // Haptic feedback
  const triggerHaptic = () => {
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  // Ripple effect
  const createRipple = (event: React.MouseEvent | React.TouchEvent) => {
    if (!ripple || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = (event as any).clientX ? (event as any).clientX - rect.left : 
              (event as any).touches?.[0]?.clientX - rect.left || rect.width / 2;
    const y = (event as any).clientY ? (event as any).clientY - rect.top : 
              (event as any).touches?.[0]?.clientY - rect.top || rect.height / 2;

    setRippleEffect({ x, y });
    setTimeout(() => setRippleEffect(null), 600);
  };

  // Glitch effect
  const triggerGlitch = () => {
    if (glitch) {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }
  };

  // Matrix effect
  const triggerMatrix = () => {
    if (matrix) {
      setMatrixEffect(true);
      setTimeout(() => setMatrixEffect(false), 300);
    }
  };

  // Handle touch start
  const handleTouchStart = (event: React.TouchEvent) => {
    if (disabled || loading) return;

    setIsPressed(true);
    triggerHaptic();
    createRipple(event);
    
    const touch = event.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    touchStartTime.current = Date.now();

    // Long press detection
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        setIsLongPressing(true);
        triggerHaptic();
        onLongPress();
      }, 500);
    }
  };

  // Handle touch end
  const handleTouchEnd = (event: React.TouchEvent) => {
    if (disabled || loading) return;

    setIsPressed(false);
    setIsLongPressing(false);

    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Double tap detection
    const currentTime = Date.now();
    const tapLength = currentTime - touchStartTime.current;
    
    if (tapLength < 200 && onDoubleTap) {
      const timeSinceLastTap = currentTime - lastTapTime.current;
      if (timeSinceLastTap < 300) {
        onDoubleTap();
        triggerGlitch();
        triggerMatrix();
      }
    }
    
    lastTapTime.current = currentTime;

    // Swipe detection
    if (onSwipe && touchStartPos.current) {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartPos.current.x;
      const deltaY = touch.clientY - touchStartPos.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance > 50) {
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        
        if (angle > -45 && angle < 45) {
          onSwipe('right');
        } else if (angle > 45 && angle < 135) {
          onSwipe('down');
        } else if (angle > 135 || angle < -135) {
          onSwipe('left');
        } else if (angle > -135 && angle < -45) {
          onSwipe('up');
        }
      }
    }

    // Regular click
    if (tapLength < 200 && !isLongPressing && onClick) {
      onClick();
      triggerGlitch();
      triggerMatrix();
    }
  };

  // Handle mouse events for desktop
  const handleMouseDown = (event: React.MouseEvent) => {
    if (disabled || loading) return;
    setIsPressed(true);
    createRipple(event);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    if (onClick && !disabled && !loading) {
      onClick();
      triggerGlitch();
      triggerMatrix();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  // Generate class names
  const buttonClasses = cn(
    'touch-button',
    `touch-button--${variant}`,
    `touch-button--${size}`,
    {
      'touch-button--disabled': disabled,
      'touch-button--loading': loading,
      'touch-button--pressed': isPressed,
      'touch-button--long-pressing': isLongPressing,
      'touch-button--full-width': fullWidth,
      'touch-button--rounded': rounded,
      'touch-button--glow': glow,
      'touch-button--glitch': glitchEffect,
      'touch-button--matrix': matrixEffect,
      'touch-button--cyberpunk': cyberpunk,
      'touch-button--matrix': matrix,
      'touch-button--nexus': nexus,
      'touch-button--son1kverse': son1kverse,
      'touch-button--with-icon': icon,
      'touch-button--icon-left': iconPosition === 'left',
      'touch-button--icon-right': iconPosition === 'right',
      'touch-button--icon-top': iconPosition === 'top',
      'touch-button--icon-bottom': iconPosition === 'bottom'
    },
    className
  );

  return (
    <button
      ref={buttonRef}
      className={buttonClasses}
      disabled={disabled || loading}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsPressed(false)}
      style={{
        '--ripple-x': rippleEffect?.x || 0,
        '--ripple-y': rippleEffect?.y || 0
      } as React.CSSProperties}
    >
      {/* Ripple Effect */}
      {rippleEffect && (
        <span 
          className="touch-button__ripple"
          style={{
            left: rippleEffect.x,
            top: rippleEffect.y
          }}
        />
      )}

      {/* Glitch Effect */}
      {glitchEffect && (
        <span className="touch-button__glitch" />
      )}

      {/* Matrix Effect */}
      {matrixEffect && (
        <span className="touch-button__matrix" />
      )}

      {/* Button Content */}
      <span className="touch-button__content">
        {/* Icon */}
        {icon && (
          <span className={`touch-button__icon touch-button__icon--${iconPosition}`}>
            {icon}
          </span>
        )}

        {/* Text */}
        <span className="touch-button__text">
          {loading ? (
            <span className="touch-button__loading">
              <span className="touch-button__spinner" />
              <span className="touch-button__loading-text">Loading...</span>
            </span>
          ) : (
            children
          )}
        </span>
      </span>

      {/* Long Press Indicator */}
      {isLongPressing && (
        <span className="touch-button__long-press-indicator" />
      )}
    </button>
  );
}

// Hook for touch gestures
export function useTouchGestures(
  onSwipe?: (direction: 'up' | 'down' | 'left' | 'right') => void,
  onPinch?: (scale: number) => void,
  onRotate?: (rotation: number) => void
) {
  const [gestures, setGestures] = useState({
    isSwiping: false,
    isPinching: false,
    isRotating: false,
    startDistance: 0,
    startAngle: 0
  });

  const handleTouchStart = (event: React.TouchEvent) => {
    if (event.touches.length === 1) {
      // Single touch - swipe
      setGestures(prev => ({ ...prev, isSwiping: true }));
    } else if (event.touches.length === 2) {
      // Two touches - pinch/rotate
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      const angle = Math.atan2(
        touch2.clientY - touch1.clientY,
        touch2.clientX - touch1.clientX
      );

      setGestures(prev => ({
        ...prev,
        isPinching: true,
        isRotating: true,
        startDistance: distance,
        startAngle: angle
      }));
    }
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (gestures.isSwiping && event.touches.length === 1 && onSwipe) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - (event as any).startX;
      const deltaY = touch.clientY - (event as any).startY;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        onSwipe(deltaX > 0 ? 'right' : 'left');
      } else {
        onSwipe(deltaY > 0 ? 'down' : 'up');
      }
    }

    if (gestures.isPinching && event.touches.length === 2 && onPinch) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      const scale = distance / gestures.startDistance;
      onPinch(scale);
    }

    if (gestures.isRotating && event.touches.length === 2 && onRotate) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      
      const angle = Math.atan2(
        touch2.clientY - touch1.clientY,
        touch2.clientX - touch1.clientX
      );
      
      const rotation = angle - gestures.startAngle;
      onRotate(rotation);
    }
  };

  const handleTouchEnd = () => {
    setGestures({
      isSwiping: false,
      isPinching: false,
      isRotating: false,
      startDistance: 0,
      startAngle: 0
    });
  };

  return {
    gestures,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}