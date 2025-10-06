import { useState } from 'react'
import { motion } from 'framer-motion'
import { Ghost, Settings } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { AudioUploader } from '../components/upload/AudioUploader'
import { MiniDAW } from '../components/daw/MiniDAW'
import { AudioAnalyzer } from '../components/analysis/AudioAnalyzer'
import { KnobsPanel } from '../components/KnobsPanel'
import { PromptBuilder } from '../components/prompt/PromptBuilder'
import { GenerationProgress } from '../components/generation/GenerationProgress'
import { ABPlayer } from '../components/results/ABPlayer'
import { useSunoCover } from '../hooks/useSunoCover'
import type { AudioFile } from '../types/audio'
import type { AudioAnalysis } from '../types/audio'
import type { KnobSettings } from '../types/suno'

export function GhostStudio() {
  const [step, setStep] = useState<'upload' | 'analyze' | 'customize' | 'generate' | 'result'>('upload')
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null)
  const [analysis, setAnalysis] = useState<AudioAnalysis | null>(null)
  const [knobs, setKnobs] = useState<KnobSettings>({
    expressivity: 50,
    rareza: 50,
    garage: 30,
    trash: 30
  })
  const [userDescription, setUserDescription] = useState('')

  const { generateCover, isGenerating, status, error } = useSunoCover()

  const handleGenerate = async () => {
    if (!audioFile || !analysis) return
    
    try {
      await generateCover({
        audioFile,
        analysis,
        knobs,
        userDescription
      })
      setStep('generate')
    } catch (err) {
      console.error('Generation failed:', err)
    }
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
                    ['upload', 'analyze', 'customize', 'generate', 'result'].indexOf(step) > index ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 
                    'bg-gray-700 text-gray-400 border border-gray-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {index + 1}
                </motion.div>
                <div className="ml-2 text-sm font-medium text-white/70">
                  {['Upload', 'Analyze', 'Customize', 'Generate', 'Result'][index]}
                </div>
                {index < 4 && (
                  <div className="w-12 h-0.5 bg-gray-600 mx-4" />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-6">
        <div className="son1k-container">
          <motion.div 
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {step === 'upload' && (
              <div className="space-y-8">
                <AudioUploader onFileSelect={setAudioFile} />
                <MiniDAW onRecordingComplete={setAudioFile} />
              </div>
            )}

            {step === 'analyze' && audioFile && (
              <AudioAnalyzer 
                audioFile={audioFile} 
                onComplete={(analysis) => {
                  setAnalysis(analysis);
                  setStep('customize');
                }} 
              />
            )}

            {step === 'customize' && analysis && (
              <div className="space-y-8">
                <KnobsPanel values={knobs} onChange={setKnobs} />
                <PromptBuilder 
                  analysis={analysis}
                  knobs={knobs}
                  userDescription={userDescription}
                  onDescriptionChange={setUserDescription}
                  onGenerate={handleGenerate}
                />
              </div>
            )}

            {step === 'generate' && (
              <GenerationProgress 
                status={status}
                error={error}
                onComplete={() => setStep('result')}
              />
            )}

            {step === 'result' && status?.audioUrl && (
              <ABPlayer 
                originalAudio={audioFile}
                generatedAudio={status}
              />
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}