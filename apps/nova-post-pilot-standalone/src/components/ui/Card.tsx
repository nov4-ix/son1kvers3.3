import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  title?: string
  footer?: React.ReactNode
}

export function Card({ children, className, title, footer }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'glass rounded-xl border border-white/10',
        'backdrop-blur-xl bg-white/5',
        className
      )}
    >
      {title && (
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">
            {title}
          </h3>
        </div>
      )}
      
      <div className="p-6">
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 border-t border-white/10">
          {footer}
        </div>
      )}
    </motion.div>
  )
}
