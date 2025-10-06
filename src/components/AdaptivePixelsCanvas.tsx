import { useEffect, useRef, useCallback } from 'react'
import { usePixelStore } from '@/store/pixelStore'
import { useAdaptivePixels } from '@/hooks/useAdaptivePixels'
import { useBehaviorTracker } from '@/hooks/useBehaviorTracker'
import { useSimpleAdaptation } from '@/hooks/useSimpleAdaptation'
import { usePixelML } from '@/hooks/usePixelML'
import type { Interaction } from '@/types/pixels'

interface AdaptivePixelsCanvasProps {
  width?: number
  height?: number
  density?: number
  showHeatmap?: boolean
}

export function AdaptivePixelsCanvas({ 
  width = window.innerWidth, 
  height = window.innerHeight,
  density = 1,
  showHeatmap = false 
}: AdaptivePixelsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { 
    pixels, 
    mode, 
    context, 
    isAnimating, 
    isPaused,
    setAnimating 
  } = usePixelStore()
  
  const { notifyNearbyPixels } = useAdaptivePixels()
  const { throttledTrackClick, throttledTrackHover } = useBehaviorTracker()
  const { applySimpleAdaptation } = useSimpleAdaptation()
  const { predictPreferences } = usePixelML()

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    // Set canvas styles
    ctx.fillStyle = 'rgba(10, 12, 16, 0.1)'
    ctx.fillRect(0, 0, width, height)
  }, [width, height])

  // Render loop
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Render pixels
    pixels.forEach(pixel => {
      const { x, y, currentColor, preferences } = pixel
      const { opacity, glowIntensity, size } = preferences

      // Skip if pixel is outside canvas
      if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) return

      // Set pixel properties
      ctx.globalAlpha = opacity
      ctx.fillStyle = currentColor

      // Apply glow effect
      if (glowIntensity > 1) {
        ctx.shadowColor = currentColor
        ctx.shadowBlur = glowIntensity * 10
      } else {
        ctx.shadowBlur = 0
      }

      // Draw pixel
      const pixelSize = size * density
      ctx.fillRect(x - pixelSize/2, y - pixelSize/2, pixelSize, pixelSize)
    })

    // Reset shadow
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
  }, [pixels, density])

  // Animation loop
  useEffect(() => {
    if (!isAnimating || isPaused) return

    let animationId: number

    const animate = () => {
      render()
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isAnimating, isPaused, render])

  // Handle canvas interactions
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Track behavior
    throttledTrackClick(x, y)

    // Notify nearby pixels
    const interaction: Interaction = {
      type: 'click',
      intensity: 1,
      timestamp: Date.now()
    }
    notifyNearbyPixels(x, y, interaction)
  }, [throttledTrackClick, notifyNearbyPixels])

  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Track behavior
    throttledTrackHover(x, y)

    // Notify nearby pixels
    const interaction: Interaction = {
      type: 'hover',
      intensity: 0.3,
      timestamp: Date.now()
    }
    notifyNearbyPixels(x, y, interaction)
  }, [throttledTrackHover, notifyNearbyPixels])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'p':
          setAnimating(!isAnimating)
          break
        case 'r':
          // Reset pixels
          break
        case 'd':
          // Toggle dashboard
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isAnimating, setAnimating])

  // Start animation when pixels are ready
  useEffect(() => {
    if (pixels.length > 0 && !isAnimating) {
      setAnimating(true)
    }
  }, [pixels.length, isAnimating, setAnimating])

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        style={{
          background: 'transparent',
          imageRendering: 'pixelated'
        }}
      />
      
      {/* Mode indicator */}
      <div className="absolute top-4 left-4 glass border border-white/20 rounded-lg px-3 py-2">
        <div className="flex items-center space-x-2 text-sm text-white/80">
          <div className={`w-2 h-2 rounded-full ${
            isAnimating ? 'bg-green-400' : 'bg-gray-400'
          }`} />
          <span>Mode: {mode}</span>
          <span>Context: {context}</span>
          <span>Pixels: {pixels.length.toLocaleString()}</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 glass border border-white/20 rounded-lg px-3 py-2">
        <div className="text-xs text-white/60">
          <div>Click to interact • Hover to influence • P: pause • R: reset</div>
        </div>
      </div>
    </div>
  )
}
