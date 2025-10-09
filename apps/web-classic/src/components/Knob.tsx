import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface KnobProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'gold' | 'white';
  className?: string;
}

export const Knob: React.FC<KnobProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  size = 'md',
  color = 'cyan',
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const knobRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const colorClasses = {
    cyan: {
      knob: 'border-cyan-400',
      indicator: 'bg-cyan-400',
      glow: 'shadow-cyan-400/50'
    },
    purple: {
      knob: 'border-purple-400',
      indicator: 'bg-purple-400',
      glow: 'shadow-purple-400/50'
    },
    gold: {
      knob: 'border-yellow-400',
      indicator: 'bg-yellow-400',
      glow: 'shadow-yellow-400/50'
    },
    white: {
      knob: 'border-white',
      indicator: 'bg-white',
      glow: 'shadow-white/50'
    }
  };

  // Calcular rotación basada en el valor
  useEffect(() => {
    const range = max - min;
    const normalizedValue = (value - min) / range;
    const newRotation = normalizedValue * 270 - 135; // -135° a +135°
    setRotation(newRotation);
  }, [value, min, max]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!knobRef.current || !isDragging) return;

    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360; // Normalizar a 0-360
    
    // Convertir ángulo a valor
    let normalizedAngle = (angle - 135 + 360) % 360;
    if (normalizedAngle > 270) normalizedAngle = 270;
    
    const newValue = min + (normalizedAngle / 270) * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    
    onChange(Math.max(min, Math.min(max, steppedValue)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      {label && (
        <label className="text-xs text-gray-400 font-mono">{label}</label>
      )}
      
      <div className="relative">
        {/* Knob principal */}
        <motion.div
          ref={knobRef}
          className={`
            ${sizeClasses[size]} 
            rounded-full 
            border-2 
            ${colorClasses[color].knob}
            bg-gray-800/50
            backdrop-blur-sm
            cursor-pointer
            relative
            overflow-hidden
            ${isDragging ? 'scale-105' : ''}
            transition-all duration-200
          `}
          style={{
            transform: `rotate(${rotation}deg)`,
            boxShadow: isDragging 
              ? `0 0 20px ${colorClasses[color].glow}` 
              : '0 4px 12px rgba(0,0,0,0.3)'
          }}
          onMouseDown={handleMouseDown}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Indicador */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
            <div 
              className={`w-1 h-3 ${colorClasses[color].indicator} rounded-full`}
              style={{
                transform: 'rotate(0deg)',
                transformOrigin: '50% 100%'
              }}
            />
          </div>
          
          {/* Marcas de escala */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-1 bg-gray-600 rounded-full"
              style={{
                top: '8%',
                left: '50%',
                transformOrigin: '50% 400%',
                transform: `rotate(${i * 67.5 - 135}deg)`
              }}
            />
          ))}
          
          {/* Efecto de brillo interno */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
        </motion.div>
        
        {/* Valor numérico */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="text-xs text-gray-400 font-mono bg-gray-800/80 px-2 py-1 rounded">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Knob;
