import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Pixel } from './Pixel';
import { getModuleLore } from '../lib/lore';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import RitualSystem from './RitualSystem';
import HiddenEasterEgg from './HiddenEasterEgg';
import Button from './ui/Button';

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContent: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar, pixelVisible, togglePixel, unlockNexus } = useAppStore();
  const { theme, toggleTheme, clickCount } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRitual, setShowRitual] = useState(false);
  
  // Obtener información del módulo actual para Pixel
  const currentPath = location.pathname;
  const currentModule = currentPath.replace('/', '') || 'dashboard';

  const navigationItems = [
    { path: '/dashboard', label: 'Historia', icon: '📜' },
    { path: '/ghost-studio', label: 'Ghost Studio', icon: '🎵' },
    { path: '/clone-station', label: 'Generación', icon: '🎭' },
    { path: '/nova-post-pilot', label: 'Archivo', icon: '📁' },
    { path: '/sanctuary-social', label: 'Santuario', icon: '🏛️' },
    { path: '/nexus-visual', label: 'Planes', icon: '🌀' },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleRitualComplete = () => {
    unlockNexus();
    setShowRitual(false);
    // Redirigir al Nexus Visual
    window.location.href = '/nexus-visual';
  };

  const handleEasterEggTrigger = () => {
    console.log('🔥 EASTER EGG ACTIVADO!');
    setShowRitual(true);
  };

  return (
    <HiddenEasterEgg onTrigger={handleEasterEggTrigger}>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                  <span className="text-cyan-400 font-bold text-lg">◯</span>
                </div>
                <span className="text-xl font-bold text-white">SON1KVERS3</span>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`transition-colors ${
                      isActiveRoute(item.path)
                        ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1'
                        : 'text-white hover:text-cyan-400'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Status y Botón */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-sm text-gray-400">Backend Offline</span>
                </div>
                
                {/* Theme Toggle Button con Easter Egg */}
                <Button
                  onClick={handleThemeToggle}
                  variant="ghost"
                  size="sm"
                  className="mr-2"
                >
                  {theme === 'dark' ? '🌙' : '☀️'}
                  {clickCount > 0 && (
                    <span className="ml-2 text-xs text-purple-400">
                      {clickCount}/5
                    </span>
                  )}
                </Button>
                
                <Button 
                  onClick={togglePixel}
                  variant="nexus"
                  size="sm"
                >
                  {pixelVisible ? 'Desactivar Pixel' : 'Activar Pixel'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                className="fixed left-0 top-0 h-full w-80 bg-gray-900 border-r border-gray-800"
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", damping: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                        <span className="text-cyan-400 font-bold">◯</span>
                      </div>
                      <span className="text-lg font-bold text-white">SON1KVERS3</span>
                    </div>
                    <button 
                      className="text-gray-400 hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ✕
                    </button>
                  </div>
                  <nav className="space-y-4">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                          isActiveRoute(item.path)
                            ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                            : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Pixel Assistant */}
        <Pixel 
          isVisible={pixelVisible} 
          onToggle={togglePixel}
          currentModule={currentModule}
        />

        {/* Ritual System */}
        <RitualSystem onRitualComplete={handleRitualComplete} />
      </div>
    </HiddenEasterEgg>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <LayoutContent>{children}</LayoutContent>
    </ThemeProvider>
  );
};