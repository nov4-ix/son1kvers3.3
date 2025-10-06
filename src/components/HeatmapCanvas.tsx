import { useRef, useEffect, useCallback } from 'react'
import { usePixelStore } from '@/store/pixelStore'
import { useBehaviorTracker } from '@/hooks/useBehaviorTracker'
import { lerpColor } from '@/lib/utils'

interface HeatmapCanvasProps {
  width?: number
  height?: number
  maxIntensity?: number
}

export function HeatmapCanvas({ 
  width = 400, 
  height = 300,
  maxIntensity = 10 
}: HeatmapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { getHeatmapData } = useBehaviorTracker()

  const renderHeatmap = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const heatmapData = getHeatmapData()
    const { clicks, hovers } = heatmapData

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Create heatmap data structure
    const heatmap = new Map<string, number>()
    
    // Process click data
    clicks.forEach(([key, intensity]) => {
      const current = heatmap.get(key) || 0
      heatmap.set(key, current + intensity)
    })

    // Process hover data
    hovers.forEach(([key, intensity]) => {
      const current = heatmap.get(key) || 0
      heatmap.set(key, current + intensity * 0.3)
    })

    // Render heatmap
    const cellSize = 20
    const cols = Math.floor(width / cellSize)
    const rows = Math.floor(height / cellSize)

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const key = `${col}-${row}`
        const intensity = heatmap.get(key) || 0
        
        if (intensity > 0) {
          // Normalize intensity
          const normalizedIntensity = Math.min(intensity / maxIntensity, 1)
          
          // Create color gradient from transparent to red
          const color = lerpColor('#00000000', '#ff0000ff', normalizedIntensity)
          
          ctx.fillStyle = color
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)
        }
      }
    }

    // Add grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    
    for (let i = 0; i <= cols; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cellSize, 0)
      ctx.lineTo(i * cellSize, height)
      ctx.stroke()
    }
    
    for (let i = 0; i <= rows; i++) {
      ctx.beginPath()
      ctx.moveTo(0, i * cellSize)
      ctx.lineTo(width, i * cellSize)
      ctx.stroke()
    }
  }, [width, height, maxIntensity, getHeatmapData])

  // Render on mount and when data changes
  useEffect(() => {
    renderHeatmap()
  }, [renderHeatmap])

  // Re-render periodically to show live updates
  useEffect(() => {
    const interval = setInterval(renderHeatmap, 1000)
    return () => clearInterval(interval)
  }, [renderHeatmap])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-white/20 rounded-lg"
        style={{
          background: 'rgba(10, 12, 16, 0.8)',
          imageRendering: 'pixelated'
        }}
      />
      
      {/* Legend */}
      <div className="absolute top-2 right-2 glass border border-white/20 rounded px-2 py-1">
        <div className="text-xs text-white/80">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span>High Activity</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-3 h-3 bg-gray-500 rounded" />
            <span>Low Activity</span>
          </div>
        </div>
      </div>
    </div>
  )
}
