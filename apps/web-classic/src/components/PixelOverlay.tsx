import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export const PixelOverlay: React.FC = () => {
  const { pixelMessages, pixelVisible, togglePixel } = useAppStore();

  const latestMessage = pixelMessages[pixelMessages.length - 1];

  return (
    <AnimatePresence>
      {pixelVisible && latestMessage && (
        <motion.div
          className="pixel-overlay"
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="pixel-title">Pixel AI</h4>
            <button
              onClick={togglePixel}
              className="text-gray-400 hover:text-cyan transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="pixel-message">{latestMessage.message}</p>
          <div className="mt-2 text-xs text-gray-500">
            {new Date(latestMessage.timestamp).toLocaleTimeString()}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};