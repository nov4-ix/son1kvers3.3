import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function Playground() {
  const [pixels, setPixels] = useState<boolean[][]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<'realistic' | 'simple' | 'ml'>('simple')

  // Initialize pixel grid
  useEffect(() => {
    const grid: boolean[][] = []
    for (let i = 0; i < 20; i++) {
      grid[i] = []
      for (let j = 0; j < 20; j++) {
        grid[i][j] = Math.random() > 0.5
      }
    }
    setPixels(grid)
  }, [])

  // Simple animation
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setPixels(prev => {
        const newPixels = [...prev]
        for (let i = 0; i < newPixels.length; i++) {
          for (let j = 0; j < newPixels[i].length; j++) {
            // Simple rule: flip based on neighbors
            const neighbors = [
              newPixels[i-1]?.[j-1], newPixels[i-1]?.[j], newPixels[i-1]?.[j+1],
              newPixels[i]?.[j-1], newPixels[i]?.[j+1],
              newPixels[i+1]?.[j-1], newPixels[i+1]?.[j], newPixels[i+1]?.[j+1]
            ].filter(Boolean).length

            if (mode === 'simple') {
              newPixels[i][j] = neighbors % 2 === 0
            } else if (mode === 'realistic') {
              newPixels[i][j] = neighbors >= 2 && neighbors <= 3
            } else {
              // ML mode - random for now
              newPixels[i][j] = Math.random() > 0.5
            }
          }
        }
        return newPixels
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning, mode])

  return (
    <div className="min-h-screen bg-carbon text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">Nexus Visual</h1>
          <p className="text-white/70 text-lg">Adaptive Pixels System</p>
        </motion.div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isRunning 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gradient-to-r from-cyan to-magenta text-carbon hover:opacity-90'
            }`}
          >
            {isRunning ? 'Stop' : 'Start'} Animation
          </button>
          
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="simple">Simple Rules</option>
            <option value="realistic">Realistic</option>
            <option value="ml">ML Hook</option>
          </select>
        </div>

        {/* Pixel Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-20 gap-1 p-4 bg-white/5 rounded-xl border border-white/10">
            {pixels.map((row, i) =>
              row.map((pixel, j) => (
                <motion.div
                  key={`${i}-${j}`}
                  className={`w-4 h-4 rounded-sm ${
                    pixel ? 'bg-gradient-to-r from-cyan to-magenta' : 'bg-white/10'
                  }`}
                  animate={{
                    scale: pixel ? [1, 1.1, 1] : 1,
                    opacity: pixel ? [0.8, 1, 0.8] : 0.3
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))
            )}
          </div>
        </div>

        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan mb-2">
                {pixels.flat().filter(Boolean).length}
              </div>
              <div className="text-white/70">Active Pixels</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-magenta mb-2">
                {mode.toUpperCase()}
              </div>
              <div className="text-white/70">Learning Mode</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-cyan mb-2">
                {isRunning ? 'ON' : 'OFF'}
              </div>
              <div className="text-white/70">Animation</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}