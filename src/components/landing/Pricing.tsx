import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CheckCircle, Star, Zap, Crown, Users } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/mes',
    description: 'Perfecto para empezar',
    features: [
      '5 posts programados por mes',
      '1 cuenta de Instagram',
      'Analytics básicos',
      'Soporte por email',
      'Templates básicos'
    ],
    cta: 'Comenzar Gratis',
    popular: false,
    icon: Users,
    color: 'border-white/20',
    bgColor: 'bg-white/5'
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mes',
    description: 'Para creadores profesionales',
    features: [
      'Posts ilimitados',
      '3 cuentas sociales',
      'IA generadora de contenido',
      'Analytics avanzados',
      'Programación automática',
      'Soporte prioritario',
      'Templates premium'
    ],
    cta: 'Probar Pro',
    popular: true,
    icon: Zap,
    color: 'border-cyan/50',
    bgColor: 'bg-cyan/10'
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/mes',
    description: 'Para equipos y empresas',
    features: [
      'Todo lo de Pro',
      'Cuentas ilimitadas',
      'Colaboración en equipo',
      'API personalizada',
      'Integraciones avanzadas',
      'Soporte 24/7',
      'White-label disponible'
    ],
    cta: 'Contactar Ventas',
    popular: false,
    icon: Crown,
    color: 'border-magenta/50',
    bgColor: 'bg-magenta/10'
  }
]

export function Pricing() {
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
            Planes que se adaptan a
            <span className="block bg-gradient-to-r from-cyan to-magenta bg-clip-text text-transparent">
              tu crecimiento
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Elige el plan perfecto para tu negocio. Puedes cambiar o cancelar en cualquier momento.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-cyan to-magenta text-carbon px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Más Popular
                  </div>
                </div>
              )}
              
              <Card className={`p-8 h-full glass border ${plan.color} ${plan.bgColor} relative overflow-hidden ${
                plan.popular ? 'scale-105' : ''
              }`}>
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/70 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-white/70 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={plan.popular ? 'primary' : 'secondary'}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-white/60 mb-4">
            ¿Necesitas un plan personalizado?
          </p>
          <Button variant="ghost" size="lg">
            Contactar Ventas
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
