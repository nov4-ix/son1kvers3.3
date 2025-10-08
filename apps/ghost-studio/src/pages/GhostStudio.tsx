// src/pages/GhostStudio.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Ghost, Settings } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { AudioUploader } from '../components/upload/AudioUploader'
import { MiniDAW } from '../components/daw/MiniDAW'
import { CoverGenerator } from '../components/CoverGenerator'
import type { AudioFile } from '../types/audio'

export function GhostStudio() {
  const [step, setStep] = useState<'upload' | 'analyze' | 'customize' | 'generate' | 'result'>('upload')
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null)

  const handleFileSelect = (file: AudioFile) => {
    setAudioFile(file)
    setStep('analyze')
  }

  return (
    <div className="min-h-screen bg-carbon relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan/5 via-transparent to-magenta/5" />
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="son1k-container">
          <div className="son1k-flex justify-between">
            <div className="son1k-flex space-x-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan to-magenta flex items-center justify-center"
              >
                <Ghost className="w-6 h-6 text-carbon" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold gradient-text son1k-text-display">Ghost Studio</h1>
                <p className="text-white/70 text-sm">AI-Powered Music Production</p>
              </div>
            </div>
            
            <div className="son1k-flex space-x-4">
              <div className="son1k-flex space-x-2 text-sm text-white/70">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>Ready</span>
              </div>
              <Button variant="ghost" size="sm" icon={<Settings className="w-4 h-4" />}>
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="relative z-10 px-6 pb-4">
        <div className="son1k-container">
          <motion.div 
            className="flex items-center justify-center mb-8 space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {['upload', 'analyze', 'customize', 'generate', 'result'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <motion.div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step === stepName ? 'bg-gradient-to-r from-cyan to-magenta text-carbon shadow-[0_0_20px_rgba(0,255,231,0.5)]' : 
                    ['upload', 'analyze', 'customize', 'generate', 'result'].indexOf(step) > index ? 'bg-green-500 text-white' : 
                    'bg-white/10 text-white/50'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {index + 1}
                </motion.div>
                {index < 4 && (
                  <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                    ['upload', 'analyze', 'customize', 'generate', 'result'].indexOf(step) > index ? 'bg-green-500' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6">
        <div className="son1k-container">
          <div className="son1k-card p-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Step: {step}
            </h2>
            
            {step === 'upload' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Subir Archivo de Audio</h3>
                  <AudioUploader onFileSelect={handleFileSelect} />
                </div>
                
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Mini DAW & Looper</h3>
                  <MiniDAW onRecordingComplete={handleFileSelect} />
                </div>
              </div>
            )}
            
            {step === 'analyze' && audioFile && (
              <div>
                <p className="text-white/70 mb-6">
                  Archivo seleccionado: {audioFile.file.name}
                </p>
                <Button onClick={() => setStep('customize')}>
                  Continuar al Análisis
                </Button>
              </div>
            )}
            
            {step === 'customize' && (
              <div>
                <p className="text-white/70 mb-6">
                  Personaliza los parámetros creativos.
                </p>
                <Button onClick={() => setStep('generate')}>
                  Generar Música
                </Button>
              </div>
            )}
            
            {step === 'generate' && (
              <div>
                <p className="text-white/70 mb-6">
                  Generando música con IA...
                </p>
                <CoverGenerator audioFile={audioFile} />
                <Button onClick={() => setStep('result')}>
                  Ver Resultado
                </Button>
              </div>
            )}
            
            {step === 'result' && (
              <div>
                <p className="text-white/70 mb-6">
                  ¡Música generada exitosamente!
                </p>
                <Button onClick={() => setStep('upload')}>
                  Nuevo Proyecto
                </Button>
              </div>
            )}
            
            <div className="flex space-x-4 mt-6">
              {['upload', 'analyze', 'customize', 'generate', 'result'].map((stepName) => (
                <Button
                  key={stepName}
                  variant={step === stepName ? 'primary' : 'ghost'}
                  onClick={() => setStep(stepName as any)}
                >
                  {stepName.charAt(0).toUpperCase() + stepName.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}