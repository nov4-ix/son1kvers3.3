import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { 
  Zap, 
  Brain, 
  Calendar, 
  BarChart3, 
  Instagram, 
  Twitter, 
  Facebook,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Clock,
  Target
} from 'lucide-react'

export function Hero() {
  return (
    <section className="min-h-screen bg-carbon flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-transparent to-magenta/10" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-magenta/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full glass border border-cyan/30 text-cyan text-sm font-medium"
              >
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered Marketing Platform
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Nova Post
                <span className="block bg-gradient-to-r from-cyan via-magenta to-accent bg-clip-text text-transparent">
                  Pilot
                </span>
              </h1>
              
              <p className="text-xl text-white/80 leading-relaxed max-w-lg">
                Automatiza tu contenido en redes sociales con IA. Programa, publica y analiza 
                el rendimiento de tus posts en Instagram, Twitter y Facebook.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group">
                Comenzar Gratis
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="secondary" size="lg">
                Ver Demo
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-white/60">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span>Setup en 2 minutos</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <Card className="p-8 glass border border-white/20">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Dashboard Preview</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 glass border border-white/10 rounded-lg">
                    <Instagram className="w-5 h-5 text-pink-500" />
                    <div className="flex-1">
                      <div className="h-2 bg-white/20 rounded-full w-3/4" />
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 glass border border-white/10 rounded-lg">
                    <Twitter className="w-5 h-5 text-blue-400" />
                    <div className="flex-1">
                      <div className="h-2 bg-white/20 rounded-full w-1/2" />
                    </div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 glass border border-white/10 rounded-lg">
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="h-2 bg-white/20 rounded-full w-2/3" />
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
