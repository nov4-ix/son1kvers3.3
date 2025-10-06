import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ 
  className, 
  label, 
  error, 
  disabled,
  ...props 
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-white/90">
          {label}
        </label>
      )}
      
      <motion.input
        whileFocus={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'w-full px-4 py-3 rounded-lg glass border border-white/10',
          'bg-white/5 backdrop-blur-xl',
          'text-white placeholder-white/50',
          'focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan/50',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
          className
        )}
        disabled={disabled}
        {...props}
      />
      
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
  )
}
