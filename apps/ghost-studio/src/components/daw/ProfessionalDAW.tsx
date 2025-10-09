// ProfessionalDAW.tsx - Interfaz profesional de DAW
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, Square, Play, Pause, RotateCcw, Layers, Trash2, 
  Volume2, VolumeX, Settings, Scissors, Copy,
  Zap, Music, Sliders, Target, Mic2, Headphones, Disc
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { useDAW } from '../../hooks/useDAW'
import type { AudioFile } from '../../types/audio'

interface Track {
  id: string
  name: string
  blob: Blob
  url: string
  duration: number
  waveform: number[]
  isMuted: boolean
  volume: number
  pan: number
  effects: AudioEffect[]
}

interface AudioEffect {
  id: string
  name: string
  type: 'eq' | 'compressor' | 'reverb' | 'delay' | 'distortion' | 'chorus'
  enabled: boolean
  params: Record<string, number>
}

interface LoopRegion {
  id: string
  start: number
  end: number
  trackId: string
  name: string
}

export function ProfessionalDAW({ onRecordingComplete }: { onRecordingComplete: (file: AudioFile) => void }) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
  const [loopRegions, setLoopRegions] = useState<LoopRegion[]>([])
  const [masterVolume, setMasterVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chunksRef = useRef<Blob[]>([])
  const animationRef = useRef<number>()
  
  const { start: startTone } = useDAW()

  // Generar waveform simulada
  const generateWaveform = useCallback((duration: number): number[] => {
    const samples = Math.floor(duration * 100) // 100 samples per second
    return Array.from({ length: samples }, () => Math.random() * 0.8 + 0.1)
  }, [])

  // Dibujar espectrograma en canvas
  const drawSpectrogram = useCallback(() => {
    if (!canvasRef.current || !analyserRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      analyserRef.current?.getByteFrequencyData(dataArray)
      
      ctx.fillStyle = '#0A0C10'
      ctx.fillRect(0, 0, width, height)

      // Dibujar barras de frecuencia
      const barWidth = width / bufferLength
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height
        const hue = (i / bufferLength) * 360
        
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`
        ctx.fillRect(i * barWidth, height - barHeight, barWidth, barHeight)
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()
  }, [])

  // Iniciar grabación profesional
  const startRecording = async () => {
    try {
      await startTone()
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      })
      
      // Crear AudioContext para análisis
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      
      analyserRef.current.fftSize = 2048
      analyserRef.current.smoothingTimeConstant = 0.8
      
      source.connect(analyserRef.current)
      
      // Iniciar visualización del espectrograma
      drawSpectrogram()
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        
        const newTrack: Track = {
          id: Math.random().toString(36).substr(2, 9),
          name: `Track ${tracks.length + 1}`,
          blob,
          url,
          duration: 0,
          waveform: [],
          isMuted: false,
          volume: 0.8,
          pan: 0,
          effects: []
        }

        // Calcular duración y generar waveform
        const audio = new Audio()
        audio.onloadedmetadata = () => {
          newTrack.duration = audio.duration
          newTrack.waveform = generateWaveform(audio.duration)
          setTracks(prev => [...prev, newTrack])
        }
        audio.src = url
        
        // Limpiar recursos
        stream.getTracks().forEach(track => track.stop())
        if (audioContextRef.current) {
          audioContextRef.current.close()
        }
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Agregar efecto a track
  const addEffect = (trackId: string, effectType: AudioEffect['type']) => {
    const newEffect: AudioEffect = {
      id: Math.random().toString(36).substr(2, 9),
      name: effectType.charAt(0).toUpperCase() + effectType.slice(1),
      type: effectType,
      enabled: true,
      params: getDefaultEffectParams(effectType)
    }

    setTracks(prev => prev.map(track => 
      track.id === trackId 
        ? { ...track, effects: [...track.effects, newEffect] }
        : track
    ))
  }

  const getDefaultEffectParams = (type: AudioEffect['type']): Record<string, number> => {
    switch (type) {
      case 'eq':
        return { low: 0, mid: 0, high: 0 }
      case 'compressor':
        return { threshold: -20, ratio: 4, attack: 0.003, release: 0.1 }
      case 'reverb':
        return { roomSize: 0.5, damping: 0.5, wet: 0.3 }
      case 'delay':
        return { time: 0.25, feedback: 0.3, mix: 0.2 }
      case 'distortion':
        return { drive: 0.5, tone: 0.5, level: 0.5 }
      case 'chorus':
        return { rate: 0.5, depth: 0.5, mix: 0.3 }
      default:
        return {}
    }
  }

  // Crear loop region
  const createLoopRegion = (trackId: string, start: number, end: number) => {
    const newLoop: LoopRegion = {
      id: Math.random().toString(36).substr(2, 9),
      start,
      end,
      trackId,
      name: `Loop ${loopRegions.length + 1}`
    }
    setLoopRegions(prev => [...prev, newLoop])
  }

  // Exportar mezcla final
  const exportMix = () => {
    if (tracks.length === 0) return
    
    // Simular mezcla (en producción real usaría Web Audio API)
    const firstTrack = tracks[0]
    const audioFile: AudioFile = {
      id: Math.random().toString(36).substr(2, 9),
      file: new File([firstTrack.blob], 'daw-mix.webm', { type: 'audio/webm' }),
      url: firstTrack.url,
      duration: firstTrack.duration,
      format: 'wav',
      size: firstTrack.blob.size,
      sampleRate: 44100,
      channels: 2
    }
    
    onRecordingComplete(audioFile)
  }

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Disc className="w-5 h-5 mr-2 text-magenta" />
            <h2 className="text-lg font-semibold text-white">Professional DAW</h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-white/70" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterVolume}
                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                className="w-20"
              />
              <span className="text-white/70 text-sm w-8">{(masterVolume * 100).toFixed(0)}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Controles de grabación */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {!isRecording ? (
              <Button
                variant="primary"
                size="lg"
                icon={<Mic className="w-5 h-5" />}
                onClick={startRecording}
              >
                Start Recording
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="lg"
                icon={<Square className="w-5 h-5" />}
                onClick={stopRecording}
              >
                Stop Recording
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="lg"
              icon={isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              icon={<RotateCcw className="w-5 h-5" />}
              onClick={() => setCurrentTime(0)}
            >
              Rewind
            </Button>
          </div>

          {/* Espectrograma en tiempo real */}
          {isRecording && (
            <div className="bg-black rounded-lg p-2">
              <canvas
                ref={canvasRef}
                width={800}
                height={200}
                className="w-full h-48 rounded"
              />
            </div>
          )}
        </div>

        {/* Timeline y tracks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-semibold text-white">Tracks</h3>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => setTracks([])}
              >
                Clear All
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Layers className="w-4 h-4" />}
                onClick={exportMix}
              >
                Export Mix
              </Button>
            </div>
          </div>

          {/* Lista de tracks */}
          <div className="space-y-3">
            {tracks.map((track) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border transition-colors ${
                  selectedTrack === track.id
                    ? 'border-cyan bg-cyan/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={!track.isMuted}
                      onChange={(e) => setTracks(prev => prev.map(t => 
                        t.id === track.id ? { ...t, isMuted: !e.target.checked } : t
                      ))}
                      className="w-4 h-4"
                    />
                    <span className="text-white font-medium">{track.name}</span>
                    <span className="text-white/50 text-sm">{track.duration.toFixed(1)}s</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Volume2 className="w-3 h-3 text-white/70" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={track.volume}
                        onChange={(e) => setTracks(prev => prev.map(t => 
                          t.id === track.id ? { ...t, volume: parseFloat(e.target.value) } : t
                        ))}
                        className="w-16"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <span className="text-white/70 text-xs">Pan</span>
                      <input
                        type="range"
                        min="-1"
                        max="1"
                        step="0.01"
                        value={track.pan}
                        onChange={(e) => setTracks(prev => prev.map(t => 
                          t.id === track.id ? { ...t, pan: parseFloat(e.target.value) } : t
                        ))}
                        className="w-16"
                      />
                    </div>
                  </div>
                </div>

                {/* Waveform visual */}
                <div className="bg-black rounded-lg p-2 mb-3">
                  <div className="flex items-center h-16 space-x-1">
                    {track.waveform.map((amplitude, index) => (
                      <div
                        key={index}
                        className="bg-cyan rounded-sm"
                        style={{
                          width: '2px',
                          height: `${amplitude * 100}%`,
                          opacity: track.isMuted ? 0.3 : 1
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Efectos */}
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-white/70 text-sm">Effects:</span>
                  {track.effects.map((effect) => (
                    <div
                      key={effect.id}
                      className="bg-white/10 rounded px-2 py-1 text-xs text-white"
                    >
                      {effect.name}
                    </div>
                  ))}
                  
                  <div className="flex space-x-1">
                    {['eq', 'compressor', 'reverb', 'delay', 'distortion', 'chorus'].map((effectType) => (
                      <Button
                        key={effectType}
                        variant="ghost"
                        size="sm"
                        onClick={() => addEffect(track.id, effectType as AudioEffect['type'])}
                        className="text-xs px-2 py-1"
                      >
                        {effectType.charAt(0).toUpperCase() + effectType.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Loop regions */}
                <div className="flex items-center space-x-2">
                  <span className="text-white/70 text-sm">Loops:</span>
                  {loopRegions.filter(loop => loop.trackId === track.id).map((loop) => (
                    <div
                      key={loop.id}
                      className="bg-magenta/20 border border-magenta/30 rounded px-2 py-1 text-xs text-magenta"
                    >
                      {loop.name} ({loop.start.toFixed(1)}s - {loop.end.toFixed(1)}s)
                    </div>
                  ))}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Layers className="w-3 h-3" />}
                    onClick={() => createLoopRegion(track.id, 0, track.duration)}
                    className="text-xs px-2 py-1"
                  >
                    Add Loop
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Instrucciones */}
        <div className="text-center text-sm text-gray-400 space-y-1">
          <div>🎤 Graba audio profesional con análisis en tiempo real</div>
          <div>🎛️ Ajusta volumen, pan y efectos por track</div>
          <div>🔄 Crea loops y regiones para edición</div>
          <div>📤 Exporta tu mezcla final para Ghost Studio</div>
        </div>
      </div>
    </Card>
  )
}
