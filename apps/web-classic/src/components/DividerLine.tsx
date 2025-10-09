import React from 'react';
import { motion } from 'framer-motion';

interface DividerLineProps {
  orientation?: 'horizontal' | 'vertical';
  length?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  animated?: boolean;
  className?: string;
}

export const DividerLine: React.FC<DividerLineProps> = ({
  orientation = 'horizontal',
  length = 'md',
  animated = false,
  className = ''
}) => {
  const lengthClasses = {
    sm: orientation === 'horizontal' ? 'w-8' : 'h-8',
    md: orientation === 'horizontal' ? 'w-32' : 'h-32',
    lg: orientation === 'horizontal' ? 'w-48' : 'h-48',
    xl: orientation === 'horizontal' ? 'w-64' : 'h-64',
    full: orientation === 'horizontal' ? 'w-full' : 'h-full'
  };

  const LineComponent = () => (
    <div className={`${lengthClasses[length]} ${className}`}>
      {orientation === 'horizontal' ? (
        <div className="relative w-full h-0.5">
          {/* Línea principal sólida */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          
          {/* Efecto de brillo intenso */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-60 blur-sm"></div>
          
          {/* Efecto de pulso */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40 animate-pulse"></div>
          
          {/* Puntos de luz más grandes */}
          <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
          <div className="absolute right-1/4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-xl shadow-cyan-400/70"></div>
        </div>
      ) : (
        <div className="relative h-full w-0.5">
          {/* Línea principal sólida */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400 to-transparent"></div>
          
          {/* Efecto de brillo intenso */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-300 to-transparent opacity-60 blur-sm"></div>
          
          {/* Efecto de pulso */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-40 animate-pulse"></div>
          
          {/* Puntos de luz más grandes */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
          <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-xl shadow-cyan-400/70"></div>
        </div>
      )}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut"
        }}
        className="overflow-hidden"
      >
        <LineComponent />
      </motion.div>
    );
  }

  return <LineComponent />;
};

export default DividerLine;
