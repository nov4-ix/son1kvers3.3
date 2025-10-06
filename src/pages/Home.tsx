import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Calendar, 
  Sparkles, 
  BarChart3, 
  Plus,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react'

export function Home() {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            ¡Bienvenido a Nova Post Pilot!
          </h1>
          <p className="text-white/70">
            Tu plataforma de marketing inteligente con IA
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cyan/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-cyan" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-white/70">Posts Programados</p>
              </div>
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-magenta/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-magenta" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-white/70">Hooks Generados</p>
              </div>
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-white/70">Alcance Total</p>
              </div>
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-white/70">Seguidores</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Acciones Rápidas
              </h3>
              <Plus className="w-5 h-5 text-cyan" />
            </div>
            <div className="space-y-3">
              <Button className="w-full justify-start">
                <Sparkles className="w-4 h-4 mr-2" />
                Generar Hook con IA
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Programar Post
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Ver Analytics
              </Button>
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Próximas Publicaciones
              </h3>
              <Clock className="w-5 h-5 text-cyan" />
            </div>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white/50" />
              </div>
              <p className="text-white/70 mb-4">
                No tienes publicaciones programadas
              </p>
              <Button variant="secondary" size="sm">
                Programar Primera Publicación
              </Button>
            </div>
          </Card>
        </div>

        {/* Getting Started */}
        <Card className="glass p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-cyan" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              ¡Comienza tu estrategia de marketing!
            </h3>
            <p className="text-white/70 mb-6">
              Configura tu perfil de contenido y conecta tus redes sociales para empezar a generar hooks personalizados con IA.
            </p>
            <div className="flex gap-3 justify-center">
              <Button>
                Configurar Perfil
              </Button>
              <Button variant="secondary">
                Ver Tutorial
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
