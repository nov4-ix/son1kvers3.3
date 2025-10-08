import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface RitualSystemProps {
  onRitualComplete: () => void;
}

const RitualSystem: React.FC<RitualSystemProps> = ({ onRitualComplete }) => {
  const [isRitualActive, setIsRitualActive] = useState(false);
  const [ritualPhase, setRitualPhase] = useState(0);
  const [matrixRain, setMatrixRain] = useState<string[]>([]);

  useEffect(() => {
    // Escuchar eventos de activación del ritual
    const handleRitualTrigger = (event: CustomEvent) => {
      console.log('🔥 RITUAL TRIGGERED:', event.detail);
      activateRitual(event.detail.source);
    };

    // Escuchar atajo de teclado CTRL+ALT+H
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'h') {
        event.preventDefault();
        activateRitual('desktop-keyboard');
      }
    };

    window.addEventListener('nexus-ritual-triggered', handleRitualTrigger as EventListener);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('nexus-ritual-triggered', handleRitualTrigger as EventListener);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const activateRitual = (source: string) => {
    console.log(`🔥 ACTIVANDO RITUAL DESDE: ${source}`);
    setIsRitualActive(true);
    setRitualPhase(0);
    startRitualSequence();
  };

  const startRitualSequence = () => {
    // Fase 1: Preparación (1 segundo)
    setTimeout(() => {
      setRitualPhase(1);
      generateMatrixRain();
    }, 1000);

    // Fase 2: Activación del símbolo ALVAE (2 segundos)
    setTimeout(() => {
      setRitualPhase(2);
    }, 3000);

    // Fase 3: Lluvia de Matrix (3 segundos)
    setTimeout(() => {
      setRitualPhase(3);
    }, 5000);

    // Fase 4: Transición al Nexus (2 segundos)
    setTimeout(() => {
      setRitualPhase(4);
    }, 8000);

    // Completar ritual (1 segundo)
    setTimeout(() => {
      setIsRitualActive(false);
      onRitualComplete();
    }, 10000);
  };

  const generateMatrixRain = () => {
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const rain: string[] = [];
    
    for (let i = 0; i < 50; i++) {
      let column = '';
      for (let j = 0; j < 20; j++) {
        column += characters[Math.floor(Math.random() * characters.length)];
      }
      rain.push(column);
    }
    
    setMatrixRain(rain);
  };

  const renderRitualPhase = () => {
    switch (ritualPhase) {
      case 0:
        return (
          <div className="flex flex-col items-center space-y-8">
            <LoadingSpinner size="xl" variant="nexus" text="Iniciando ritual..." />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-purple-400 text-lg font-mono"
            >
              CTRL+ALT+HUMANITY
            </motion.p>
          </div>
        );

      case 1:
        return (
          <div className="flex flex-col items-center space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
              className="w-32 h-32 border-4 border-purple-500 rounded-full flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-6xl text-purple-400"
              >
                ⚡
              </motion.div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-cyan-400 text-xl font-bold"
            >
              Preparando la Grieta...
            </motion.p>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col items-center space-y-8">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 8 }}
              className="relative"
            >
              {/* Símbolo ALVAE */}
              <div className="text-8xl text-purple-400 font-bold">
                ◯⚡
              </div>
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(139, 69, 255, 0.5)",
                    "0 0 40px rgba(139, 69, 255, 0.8)",
                    "0 0 20px rgba(139, 69, 255, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-purple-400 text-2xl font-bold"
            >
              ALVAE ACTIVADO
            </motion.p>
          </div>
        );

      case 3:
        return (
          <div className="relative w-full h-96 overflow-hidden">
            {/* Matrix Rain */}
            <div className="absolute inset-0 flex">
              {matrixRain.map((column, index) => (
                <motion.div
                  key={index}
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 400, opacity: 1 }}
                  transition={{ 
                    duration: 3,
                    delay: index * 0.1,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                  className="text-green-400 text-sm font-mono leading-tight mr-2"
                  style={{ 
                    writingMode: 'vertical-rl',
                    textOrientation: 'upright'
                  }}
                >
                  {column}
                </motion.div>
              ))}
            </div>
            
            {/* Overlay con símbolo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-6xl text-cyan-400 font-bold"
              >
                ◯⚡
              </motion.div>
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-green-400 text-lg font-mono"
            >
              La Resistencia se activa...
            </motion.p>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col items-center space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 6 }}
              className="text-7xl text-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent"
            >
              NEXUS
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-cyan-400 text-xl font-bold"
            >
              Bienvenido al Universo Inmersivo
            </motion.p>
            <LoadingSpinner size="lg" variant="nexus" text="Transicionando..." />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isRitualActive && (
        <Modal
          isOpen={isRitualActive}
          onClose={() => {}} // No se puede cerrar durante el ritual
          size="full"
          variant="ritual"
        >
          <div className="min-h-screen flex items-center justify-center">
            {renderRitualPhase()}
          </div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default RitualSystem;
