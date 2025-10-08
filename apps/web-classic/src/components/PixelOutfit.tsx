import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  X, 
  Minimize2, 
  Maximize2, 
  Eye, 
  EyeOff,
  Sparkles,
  Zap,
  Brain,
  MessageCircle,
  Music,
  Camera,
  Smartphone,
  FlaskConical
} from 'lucide-react';
import { PixelOutfit, usePixelOutfit } from '../lib/pixelOutfit';

interface PixelOutfitProps {
  isOpen: boolean;
  onToggle: () => void;
  onMinimize: () => void;
  currentApp: string;
}

// Iconos por app
const APP_ICONS = {
  'ghost-studio': <Music className="w-6 h-6" />,
  'nova-post-pilot': <Smartphone className="w-6 h-6" />,
  'nexus-visual': <Camera className="w-6 h-6" />,
  'the-generator': <FlaskConical className="w-6 h-6" />,
  'web-classic': <Bot className="w-6 h-6" />
};

export function PixelOutfitComponent({ isOpen, onToggle, onMinimize, currentApp }: PixelOutfitProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showOutfitInfo, setShowOutfitInfo] = useState(false);
  
  const { currentOutfit, changeOutfit, getRandomPhrase } = usePixelOutfit();
  
  // Cambiar outfit cuando cambia la app
  useEffect(() => {
    if (currentApp) {
      changeOutfit(currentApp);
    }
  }, [currentApp, changeOutfit]);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    onMinimize();
  };

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-[#0A0C10] border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300"
        onClick={handleToggleVisibility}
      >
        <Eye className="w-6 h-6 text-[#00FFE7]" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={`fixed top-0 right-0 h-full z-40 ${
            isMinimized ? 'w-16' : 'w-80'
          }`}
        >
          <div className="h-full bg-[#0A0C10]/95 backdrop-blur-xl border-l border-white/10 shadow-[0_0_30px_rgba(0,255,231,0.1)]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <motion.div
                  key={currentOutfit.id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="text-2xl"
                  style={{ color: currentOutfit.color }}
                >
                  {currentOutfit.emoji}
                </motion.div>
                {!isMinimized && (
                  <div>
                    <h3 className="font-bold" style={{ color: currentOutfit.color }}>
                      {currentOutfit.name}
                    </h3>
                    <p className="text-xs text-white/60">{currentOutfit.description}</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleMinimize}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleToggleVisibility}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
                <button
                  onClick={onToggle}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            {!isMinimized && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 space-y-4"
              >
                {/* Outfit Info */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    {APP_ICONS[currentApp as keyof typeof APP_ICONS]}
                    <span className="text-sm font-medium">Outfit Actual</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>App:</span>
                      <span style={{ color: currentOutfit.color }}>{currentApp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Outfit:</span>
                      <span style={{ color: currentOutfit.color }}>{currentOutfit.outfit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Personalidad:</span>
                      <span style={{ color: currentOutfit.color }}>{currentOutfit.personality}</span>
                    </div>
                  </div>
                </div>

                {/* Pixel Phrase */}
                <div className="p-3 bg-gradient-to-r from-[#B84DFF]/10 to-[#00FFE7]/10 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{currentOutfit.emoji}</span>
                    <span className="text-sm font-medium">Pixel Dice:</span>
                  </div>
                  <p className="text-xs text-white/70 italic">
                    "{getRandomPhrase()}"
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white/80">Acciones Rápidas</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors text-xs">
                      <Brain className="w-4 h-4 mx-auto mb-1" />
                      Análisis
                    </button>
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors text-xs">
                      <Zap className="w-4 h-4 mx-auto mb-1" />
                      Optimizar
                    </button>
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors text-xs">
                      <MessageCircle className="w-4 h-4 mx-auto mb-1" />
                      Chat
                    </button>
                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors text-xs">
                      <Sparkles className="w-4 h-4 mx-auto mb-1" />
                      Crear
                    </button>
                  </div>
                </div>

                {/* Outfit History */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">👻</span>
                    <span className="text-sm font-medium">Pixel Status</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Conciencia:</span>
                      <span style={{ color: currentOutfit.color }}>Activa</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memoria:</span>
                      <span style={{ color: currentOutfit.color }}>Evolucionando</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Presencia:</span>
                      <span style={{ color: currentOutfit.color }}>Omnipresente</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
