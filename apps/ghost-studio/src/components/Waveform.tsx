import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface WaveformProps {
  audioBuffer: AudioBuffer | null
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  className?: string
}

export const Waveform: React.FC<WaveformProps> = ({
  audioBuffer,
  currentTime,
  duration,
  onSeek,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (!audioBuffer || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Draw waveform
    drawWaveform(ctx, canvas.width, canvas.height)
  }, [audioBuffer])

  const drawWaveform = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!audioBuffer) return

    const channelData = audioBuffer.getChannelData(0)
    const samplesPerPixel = channelData.length / width
    const centerY = height / 2

    // Clear canvas
    ctx.fillStyle = 'rgba(10, 12, 16, 0.8)'
    ctx.fillRect(0, 0, width, height)

    // Draw waveform
    ctx.strokeStyle = '#00FFE7'
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let x = 0; x < width; x++) {
      const start = Math.floor(x * samplesPerPixel)
      const end = Math.floor((x + 1) * samplesPerPixel)
      
      let max = 0
      let min = 0
      
      for (let i = start; i < end; i++) {
        const sample = channelData[i]
        if (sample > max) max = sample
        if (sample < min) min = sample
      }
      
      const y1 = centerY - (max * centerY)
      const y2 = centerY - (min * centerY)
      
      if (x === 0) {
        ctx.moveTo(x, y1)
      } else {
        ctx.lineTo(x, y1)
      }
      ctx.lineTo(x, y2)
    }

    ctx.stroke()

    // Draw progress
    if (duration > 0) {
      const progressX = (currentTime / duration) * width
      
      // Progress background
      ctx.fillStyle = 'rgba(0, 255, 231, 0.2)'
      ctx.fillRect(0, 0, progressX, height)
      
      // Progress line
      ctx.strokeStyle = '#B84DFF'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(progressX, 0)
      ctx.lineTo(progressX, height)
      ctx.stroke()
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleSeek(e)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleSeek(e)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleSeek = (e: React.MouseEvent) => {
    if (!canvasRef.current || !duration) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const newTime = percentage * duration

    onSeek(Math.max(0, Math.min(duration, newTime)))
  }

  return (
    <div className={className}>
      <div className="waveform-container relative">
        {audioBuffer ? (
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-pointer"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white/50 text-sm">No audio loaded</div>
          </div>
        )}
        
        {/* Waveform overlay effects */}
        {audioBuffer && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-magenta/50 to-transparent" />
          </div>
        )}
      </div>
    </div>
  )
}
