import React from 'react';
import { motion } from 'framer-motion';

interface AlvaeSymbolProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'white' | 'gold' | 'cyan' | 'purple';
  animated?: boolean;
  className?: string;
}

export const AlvaeSymbol: React.FC<AlvaeSymbolProps> = ({
  size = 'md',
  color = 'gold',
  animated = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-6',
    md: 'w-6 h-10',
    lg: 'w-8 h-16',
    xl: 'w-12 h-24'
  };

  const colorClasses = {
    white: 'text-white',
    gold: 'text-yellow-400',
    cyan: 'text-cyan-400',
    purple: 'text-purple-400'
  };

  const SymbolComponent = () => (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      <svg
        viewBox="0 0 24 40"
        className="w-full h-full"
        fill="currentColor"
      >
        {/* Rayo principal */}
        <path
          d="M12 2 L8 18 L16 18 L12 38"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Rayos secundarios */}
        <path
          d="M6 12 L10 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M14 12 L18 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M6 28 L10 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M14 28 L18 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        whileHover={{ scale: 1.2 }}
        className="cursor-pointer"
      >
        <SymbolComponent />
      </motion.div>
    );
  }

  return <SymbolComponent />;
};

export default AlvaeSymbol;
