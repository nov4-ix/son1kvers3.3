import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

export function Dashboard() {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-white/70">
            Resumen de tu actividad de marketing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Posts Programados
              </h3>
              <div className="w-8 h-8 bg-cyan/20 rounded-full flex items-center justify-center">
                <span className="text-cyan text-sm">📅</span>
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Hooks Generados
              </h3>
              <div className="w-8 h-8 bg-magenta/20 rounded-full flex items-center justify-center">
                <span className="text-magenta text-sm">✨</span>
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Próxima Publicación
              </h3>
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                <span className="text-accent text-sm">🚀</span>
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        </div>

        <Card className="glass p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-cyan text-2xl">⚙️</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Completa tu perfil para empezar
            </h3>
            <p className="text-white/70 mb-6">
              Configura tus plataformas sociales y preferencias de contenido para generar hooks personalizados.
            </p>
            <Button disabled className="opacity-50">
              Configurar Perfil
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
