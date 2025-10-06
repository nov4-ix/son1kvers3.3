// Mobile Layout - Layout responsive para móviles y tablets del universo Son1kVerse

import React, { useState, useEffect } from 'react';
import { cn } from '../../shared-utils';

export interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'portrait' | 'landscape' | 'auto';
  deviceType?: 'mobile' | 'tablet' | 'desktop' | 'auto';
  safeArea?: boolean;
  statusBar?: boolean;
  navigationBar?: boolean;
  keyboardAvoidance?: boolean;
  scrollable?: boolean;
  fullscreen?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  animations?: boolean;
  gestures?: boolean;
  haptics?: boolean;
  performance?: 'low' | 'medium' | 'high' | 'auto';
}

export function MobileLayout({
  children,
  className,
  orientation = 'auto',
  deviceType = 'auto',
  safeArea = true,
  statusBar = true,
  navigationBar = true,
  keyboardAvoidance = true,
  scrollable = true,
  fullscreen = false,
  theme = 'auto',
  animations = true,
  gestures = true,
  haptics = true,
  performance = 'auto'
}: MobileLayoutProps) {
  const [deviceInfo, setDeviceInfo] = useState({
    width: 0,
    height: 0,
    orientation: 'portrait' as 'portrait' | 'landscape',
    deviceType: 'mobile' as 'mobile' | 'tablet' | 'desktop',
    isTouch: false,
    pixelRatio: 1,
    platform: 'unknown' as 'ios' | 'android' | 'web' | 'unknown'
  });

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const currentOrientation = width > height ? 'landscape' : 'portrait';
      const currentDeviceType = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const pixelRatio = window.devicePixelRatio || 1;
      
      // Detect platform
      let platform: 'ios' | 'android' | 'web' | 'unknown' = 'unknown';
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        platform = 'ios';
      } else if (/Android/.test(navigator.userAgent)) {
        platform = 'android';
      } else {
        platform = 'web';
      }

      setDeviceInfo({
        width,
        height,
        orientation: currentOrientation,
        deviceType: currentDeviceType,
        isTouch,
        pixelRatio,
        platform
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    // Keyboard detection
    const handleKeyboardChange = () => {
      const initialHeight = window.innerHeight;
      const currentHeight = window.innerHeight;
      setIsKeyboardVisible(currentHeight < initialHeight * 0.75);
    };

    window.addEventListener('resize', handleKeyboardChange);

    // Fullscreen detection
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
      window.removeEventListener('resize', handleKeyboardChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Determine effective settings
  const effectiveOrientation = orientation === 'auto' ? deviceInfo.orientation : orientation;
  const effectiveDeviceType = deviceType === 'auto' ? deviceInfo.deviceType : deviceType;
  const effectiveTheme = theme === 'auto' ? (deviceInfo.platform === 'ios' ? 'light' : 'dark') : theme;
  const effectivePerformance = performance === 'auto' ? 
    (deviceInfo.deviceType === 'mobile' ? 'medium' : 'high') : performance;

  // Generate CSS variables for device-specific styling
  const deviceCSSVars = {
    '--device-width': `${deviceInfo.width}px`,
    '--device-height': `${deviceInfo.height}px`,
    '--device-pixel-ratio': deviceInfo.pixelRatio,
    '--device-orientation': effectiveOrientation,
    '--device-type': effectiveDeviceType,
    '--device-platform': deviceInfo.platform,
    '--device-touch': deviceInfo.isTouch ? '1' : '0',
    '--keyboard-visible': isKeyboardVisible ? '1' : '0',
    '--fullscreen': isFullscreen ? '1' : '0'
  } as React.CSSProperties;

  // Generate class names
  const layoutClasses = cn(
    'mobile-layout',
    `mobile-layout--${effectiveDeviceType}`,
    `mobile-layout--${effectiveOrientation}`,
    `mobile-layout--${effectiveTheme}`,
    `mobile-layout--${effectivePerformance}`,
    {
      'mobile-layout--safe-area': safeArea,
      'mobile-layout--status-bar': statusBar,
      'mobile-layout--navigation-bar': navigationBar,
      'mobile-layout--keyboard-avoidance': keyboardAvoidance,
      'mobile-layout--scrollable': scrollable,
      'mobile-layout--fullscreen': fullscreen,
      'mobile-layout--animations': animations,
      'mobile-layout--gestures': gestures,
      'mobile-layout--haptics': haptics,
      'mobile-layout--touch': deviceInfo.isTouch,
      'mobile-layout--keyboard-visible': isKeyboardVisible,
      'mobile-layout--ios': deviceInfo.platform === 'ios',
      'mobile-layout--android': deviceInfo.platform === 'android',
      'mobile-layout--web': deviceInfo.platform === 'web'
    },
    className
  );

  return (
    <div 
      className={layoutClasses}
      style={deviceCSSVars}
      data-device-type={effectiveDeviceType}
      data-orientation={effectiveOrientation}
      data-platform={deviceInfo.platform}
      data-touch={deviceInfo.isTouch}
    >
      {/* Safe Area Insets */}
      {safeArea && (
        <>
          <div className="mobile-layout__safe-area-top" />
          <div className="mobile-layout__safe-area-bottom" />
          <div className="mobile-layout__safe-area-left" />
          <div className="mobile-layout__safe-area-right" />
        </>
      )}

      {/* Status Bar */}
      {statusBar && (
        <div className="mobile-layout__status-bar">
          <div className="mobile-layout__status-bar-content">
            <div className="mobile-layout__status-bar-left">
              <span className="mobile-layout__time">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="mobile-layout__status-bar-center">
              <div className="mobile-layout__signal-strength">
                <div className="mobile-layout__signal-bar" />
                <div className="mobile-layout__signal-bar" />
                <div className="mobile-layout__signal-bar" />
                <div className="mobile-layout__signal-bar" />
              </div>
            </div>
            <div className="mobile-layout__status-bar-right">
              <div className="mobile-layout__battery">
                <div className="mobile-layout__battery-level" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mobile-layout__content">
        {children}
      </div>

      {/* Navigation Bar */}
      {navigationBar && (
        <div className="mobile-layout__navigation-bar">
          <div className="mobile-layout__navigation-bar-content">
            <div className="mobile-layout__home-indicator" />
          </div>
        </div>
      )}

      {/* Keyboard Avoidance Spacer */}
      {keyboardAvoidance && isKeyboardVisible && (
        <div className="mobile-layout__keyboard-spacer" />
      )}
    </div>
  );
}

// Hook for device information
export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState({
    width: 0,
    height: 0,
    orientation: 'portrait' as 'portrait' | 'landscape',
    deviceType: 'mobile' as 'mobile' | 'tablet' | 'desktop',
    isTouch: false,
    pixelRatio: 1,
    platform: 'unknown' as 'ios' | 'android' | 'web' | 'unknown'
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const currentOrientation = width > height ? 'landscape' : 'portrait';
      const currentDeviceType = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const pixelRatio = window.devicePixelRatio || 1;
      
      let platform: 'ios' | 'android' | 'web' | 'unknown' = 'unknown';
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        platform = 'ios';
      } else if (/Android/.test(navigator.userAgent)) {
        platform = 'android';
      } else {
        platform = 'web';
      }

      setDeviceInfo({
        width,
        height,
        orientation: currentOrientation,
        deviceType: currentDeviceType,
        isTouch,
        pixelRatio,
        platform
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
}

// Hook for keyboard visibility
export function useKeyboardVisibility() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const handleKeyboardChange = () => {
      const initialHeight = window.innerHeight;
      const currentHeight = window.innerHeight;
      setIsKeyboardVisible(currentHeight < initialHeight * 0.75);
    };

    window.addEventListener('resize', handleKeyboardChange);
    return () => window.removeEventListener('resize', handleKeyboardChange);
  }, []);

  return isKeyboardVisible;
}

// Hook for fullscreen state
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      await document.exitFullscreen();
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  };

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen
  };
}