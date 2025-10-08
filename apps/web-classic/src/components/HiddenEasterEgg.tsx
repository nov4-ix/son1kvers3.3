import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HiddenEasterEggProps {
  children: React.ReactNode;
  triggerSequence?: string[];
  onTrigger?: () => void;
}

const HiddenEasterEgg: React.FC<HiddenEasterEggProps> = ({
  children,
  triggerSequence = ['ctrl', 'alt', 'h'],
  onTrigger
}) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const newSequence = [...sequence, key];
      
      // Mantener solo los últimos elementos de la secuencia
      const trimmedSequence = newSequence.slice(-triggerSequence.length);
      setSequence(trimmedSequence);
      
      // Verificar si la secuencia coincide
      if (JSON.stringify(trimmedSequence) === JSON.stringify(triggerSequence)) {
        setIsVisible(true);
        onTrigger?.();
        setSequence([]);
        
        // Ocultar después de 3 segundos
        setTimeout(() => setIsVisible(false), 3000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sequence, triggerSequence, onTrigger]);

  return (
    <>
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-8xl text-cyan-400"
            >
              ◯⚡
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-20 text-center"
            >
              <p className="text-2xl font-bold text-purple-400 mb-2">
                CTRL+ALT+HUMANITY
              </p>
              <p className="text-gray-300">
                La Resistencia se activa...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HiddenEasterEgg;
