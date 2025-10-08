import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

export function NotFound() {
  return (
    <div className="min-h-screen bg-carbon flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-32 h-32 bg-gradient-to-r from-cyan to-magenta rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-carbon font-bold text-6xl">404</span>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-white/70 text-lg mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan to-magenta text-carbon font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </a>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center space-x-2 bg-white/5 border border-white/10 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}