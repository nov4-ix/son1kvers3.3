import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SignupForm } from '@/components/auth/SignupForm'
import { Card } from '@/components/ui/Card'

export function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-cyan mb-2">
              Nova Post Pilot
            </h1>
            <p className="text-white/70">
              Crea tu cuenta para empezar
            </p>
          </div>
          
          <SignupForm />
          
          <div className="mt-6 text-center">
            <p className="text-white/70">
              ¿Ya tienes cuenta?{' '}
              <Link 
                to="/login" 
                className="text-cyan hover:text-accent transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
