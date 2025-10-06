import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { 
  Brain, 
  Calendar, 
  BarChart3, 
  Zap, 
  Target, 
  Clock,
  Instagram,
  Twitter,
  Facebook,
  Users,
  TrendingUp,
  Shield
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'IA Generadora de Contenido',
    description: 'Crea posts únicos y atractivos usando inteligencia artificial avanzada.',
    color: 'text-cyan',
    bgColor: 'bg-cyan/10',
    borderColor: 'border-cyan/30'
  },
  {
    icon: Calendar,
    title: 'Programación Automática',
    description: 'Planifica y programa tus publicaciones con anticipación.',
    color: 'text-magenta',
    bgColor: 'bg-magenta/10',
    borderColor: 'border-magenta/30'
  },
  {
    icon: BarChart3,
    title: 'Analytics Avanzados',
    description: 'Mide el rendimiento y optimiza tu estrategia de contenido.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/30'
  },
  {
    icon: Zap,
    title: 'Publicación Multi-Red',
    description: 'Publica simultáneamente en Instagram, Twitter y Facebook.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/30'
  },
  {
    icon: Target,
    title: 'Audiencia Inteligente',
    description: 'Identifica y conecta con tu audiencia ideal automáticamente.',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/30'
  },
  {
    icon: Shield,
    title: 'Seguridad Garantizada',
    description: 'Tus datos están protegidos con encriptación de nivel empresarial.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/30'
  }
]

const stats = [
  { icon: Users, value: '10K+', label: 'Usuarios Activos' },
  { icon: Instagram, value: '50M+', label: 'Posts Publicados' },
  { icon: TrendingUp, value: '300%', label: 'Mejora en Engagement' },
  { icon: Clock, value: '24/7', label: 'Soporte Disponible' }
]

export function Features() {
  return (
    <section className="py-20 bg-carbon relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Potencia tu
            <span className="block bg-gradient-to-r from-cyan to-magenta bg-clip-text text-transparent">
              Marketing Digital
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Herramientas profesionales diseñadas para creadores de contenido, 
            marketers y empresas que buscan maximizar su presencia en redes sociales.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`p-6 h-full glass border ${feature.borderColor} hover:scale-105 transition-transform duration-300`}>
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-cyan/20 to-magenta/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-cyan" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-white/70">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
