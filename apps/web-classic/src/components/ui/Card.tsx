import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'nexus' | 'elevated';
  hover?: boolean;
  glow?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  hover = true,
  glow = false
}) => {
  const baseClasses = 'rounded-xl transition-all duration-300';
  
  const variants = {
    default: 'bg-gray-900/50 backdrop-blur-sm border border-gray-800',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
    nexus: 'bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-red-900/20 backdrop-blur-sm border border-purple-500/30',
    elevated: 'bg-gray-800/80 backdrop-blur-sm border border-gray-700 shadow-2xl'
  };

  const hoverClasses = hover ? 'hover:bg-gray-800/60 hover:border-gray-600 hover:transform hover:scale-105' : '';
  const glowClasses = glow ? 'shadow-[0_0_20px_rgba(0,255,231,0.3)] hover:shadow-[0_0_30px_rgba(0,255,231,0.5)]' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { scale: 1.02 } : {}}
      className={cn(
        baseClasses,
        variants[variant],
        hoverClasses,
        glowClasses,
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default Card;

