import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ArrowRight, Zap, Users, TrendingUp } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-20 bg-carbon relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-transparent to-magenta/10" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-magenta/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            ¿Listo para transformar tu
            <span className="block bg-gradient-to-r from-cyan to-magenta bg-clip-text text-transparent">
              presencia digital?
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
            Únete a miles de creadores y empresas que ya están automatizando 
            su contenido con Nova Post Pilot.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-cyan/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-cyan" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Setup en 2 minutos</h3>
                  <p className="text-white/70">Conecta tus redes sociales y comienza a programar</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-magenta/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-magenta" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Únete a 10K+ usuarios</h3>
                  <p className="text-white/70">Creadores y empresas confían en nosotros</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">300% más engagement</h3>
                  <p className="text-white/70">Mejora promedio en el rendimiento</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group">
                Comenzar Gratis Ahora
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="secondary" size="lg">
                Ver Demo en Vivo
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 glass border border-white/20">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white text-center">
                  Testimonios Reales
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 glass border border-white/10 rounded-lg">
                    <p className="text-white/80 mb-3">
                      "Nova Post Pilot revolucionó mi estrategia de contenido. 
                      Ahora puedo mantener una presencia constante sin esfuerzo."
                    </p>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan to-magenta rounded-full mr-3" />
                      <div>
                        <div className="text-white font-semibold">María González</div>
                        <div className="text-white/60 text-sm">Influencer Digital</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 glass border border-white/10 rounded-lg">
                    <p className="text-white/80 mb-3">
                      "La IA generadora de contenido es increíble. 
                      Ahorro horas cada semana en crear posts."
                    </p>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-magenta to-accent rounded-full mr-3" />
                      <div>
                        <div className="text-white font-semibold">Carlos Ruiz</div>
                        <div className="text-white/60 text-sm">CEO, TechStart</div>
                      </div>
                    </div>
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
