import { motion } from 'framer-motion'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Pricing } from '@/components/landing/Pricing'
import { CTA } from '@/components/landing/CTA'
import { Footer } from '@/components/landing/Footer'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import { Zap, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-carbon">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-carbon/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan to-magenta rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Nova Post Pilot</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white/70 hover:text-cyan transition-colors">
                Características
              </a>
              <a href="#pricing" className="text-white/70 hover:text-cyan transition-colors">
                Precios
              </a>
              <a href="#demo" className="text-white/70 hover:text-cyan transition-colors">
                Demo
              </a>
              <Link to="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link to="/signup">
                <Button>Comenzar Gratis</Button>
              </Link>
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-white/10"
            >
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-white/70 hover:text-cyan transition-colors">
                  Características
                </a>
                <a href="#pricing" className="text-white/70 hover:text-cyan transition-colors">
                  Precios
                </a>
                <a href="#demo" className="text-white/70 hover:text-cyan transition-colors">
                  Demo
                </a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                  <Link to="/login">
                    <Button variant="ghost" className="w-full">Iniciar Sesión</Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="w-full">Comenzar Gratis</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Hero />
        <Features />
        <Pricing />
        <CTA />
      </main>

      <Footer />
    </div>
  )
}
