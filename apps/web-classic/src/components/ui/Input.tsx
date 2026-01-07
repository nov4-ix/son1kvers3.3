import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'ghost' | 'nexus';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  variant = 'default',
  className,
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-3 text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';

  const variants = {
    default: 'bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg focus:border-cyan-500 focus:ring-cyan-500',
    ghost: 'bg-transparent border-b border-gray-700 rounded-none focus:border-cyan-500 focus:ring-cyan-500',
    nexus: 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-500/30 rounded-lg focus:border-purple-400 focus:ring-purple-500'
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <motion.input
          {...({
            whileFocus: { scale: 1.02 }

          } as any)}
          className={cn(
            baseClasses,
            variants[variant],
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;
