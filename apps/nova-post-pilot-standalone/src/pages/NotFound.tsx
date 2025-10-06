import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-cyan mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Página no encontrada
          </h2>
          <p className="text-white/70 mb-8">
            La página que buscas no existe o ha sido movida.
          </p>
        </div>
        
        <Link to="/">
          <Button>
            Volver al Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
