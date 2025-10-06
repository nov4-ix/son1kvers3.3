import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  if (lines === 1) {
    return (
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`bg-white/10 rounded-lg ${className || 'h-4 w-full'}`}
        aria-label="Cargando contenido"
      />
    )
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          className={`bg-white/10 rounded-lg h-4 ${className || 'w-full'}`}
          aria-label="Cargando contenido"
        />
      ))}
    </div>
  )
}
