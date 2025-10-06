import React from 'react'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface HeaderProps {
  title?: string
  actions?: React.ReactNode
}

export function Header({ title = 'Dashboard', actions }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass border-b border-white/10 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
          >
            <Menu size={20} />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-white">
              {title}
            </h1>
          </div>
        </div>
        
        {actions && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {actions}
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
