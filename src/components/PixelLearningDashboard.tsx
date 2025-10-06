import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePixelStore } from '@/store/pixelStore'
import { useAdaptivePixels } from '@/hooks/useAdaptivePixels'
import { useSimpleAdaptation } from '@/hooks/useSimpleAdaptation'
import { usePixelML } from '@/hooks/usePixelML'
import { HeatmapCanvas } from './HeatmapCanvas'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { 
  BarChart3, 
  Settings, 
  RefreshCw, 
  Save, 
  Play, 
  Pause,
  Brain,
  Zap,
  Eye,
  Clock,
  Target
} from 'lucide-react'
import { formatBytes, formatDuration } from '@/lib/utils'
import type { SimpleAdaptation } from '@/types/pixels'

export function PixelLearningDashboard() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'stats' | 'heatmap' | 'preferences' | 'ml'>('stats')
  
  const { 
    pixels, 
    totalInteractions, 
    adaptedPixels, 
    confidenceScore,
    mode,
    context,
    isAnimating,
    isPaused,
    enablePixelML,
    setAnimating,
    setPaused,
    resetLearning
  } = usePixelStore()
  
  const { saveUserProfile } = useAdaptivePixels()
  const { applySimpleAdaptation, resetToDefaults, applyColorTheme } = useSimpleAdaptation()
  const { trainModel, predictPreferences, isLoading: mlLoading, mlModel } = usePixelML()

  // Calculate stats
  const adaptationRate = pixels.length > 0 ? (adaptedPixels / pixels.length) * 100 : 0
  const avgConfidence = confidenceScore * 100

  // Simple adaptation controls
  const handleSimpleAdaptation = (adaptation: SimpleAdaptation) => {
    applySimpleAdaptation(adaptation)
  }

  const handleMLPrediction = async () => {
    if (mlModel?.trained) {
      const preferences = await predictPreferences({
        clickHeatmap: new Map(),
        hoverAreas: new Map(),
        scrollSpeed: 1,
        timeOnPage: {},
        interactions: {
          buttons: [],
          features: [],
          timeOfDay: 'afternoon'
        }
      })
      
      if (preferences) {
        console.log('ML Predicted Preferences:', preferences)
      }
    }
  }

  const tabs = [
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'heatmap', label: 'Heatmap', icon: Eye },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    ...(enablePixelML ? [{ id: 'ml', label: 'ML', icon: Brain }] : [])
  ]

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-96 max-h-96 overflow-hidden"
          >
            <Card className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Pixel Learning</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPaused(!isPaused)}
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                  >
                    ×
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 mb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'bg-cyan/20 text-cyan border border-cyan/30'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="max-h-64 overflow-y-auto">
                {activeTab === 'stats' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan">{pixels.length.toLocaleString()}</div>
                        <div className="text-sm text-white/70">Total Pixels</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-magenta">{adaptedPixels}</div>
                        <div className="text-sm text-white/70">Adapted</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Adaptation Rate</span>
                        <span className="text-white">{adaptationRate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan to-magenta h-2 rounded-full transition-all duration-300"
                          style={{ width: `${adaptationRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Confidence Score</span>
                        <span className="text-white">{avgConfidence.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-accent to-cyan h-2 rounded-full transition-all duration-300"
                          style={{ width: `${avgConfidence}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-sm text-white/70">
                      <div>Mode: <span className="text-white">{mode}</span></div>
                      <div>Context: <span className="text-white">{context}</span></div>
                      <div>Interactions: <span className="text-white">{totalInteractions}</span></div>
                    </div>
                  </div>
                )}

                {activeTab === 'heatmap' && (
                  <div className="space-y-4">
                    <HeatmapCanvas width={320} height={200} />
                    <div className="text-xs text-white/60">
                      Shows click and hover activity patterns
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-white">Simple Adaptations</h4>
                      
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => applyColorTheme('cyan')}
                          className="w-full"
                        >
                          Apply Cyan Theme
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => applyColorTheme('magenta')}
                          className="w-full"
                        >
                          Apply Magenta Theme
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => applyColorTheme('accent')}
                          className="w-full"
                        >
                          Apply Accent Theme
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSimpleAdaptation({
                            favoriteApp: 'ghost-studio',
                            favoriteColors: ['#B84DFF'],
                            activityTime: 'evening',
                            interactionStyle: 'intensive'
                          })}
                          className="w-full"
                        >
                          Ghost Studio Style
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSimpleAdaptation({
                            favoriteApp: 'nova-pilot',
                            favoriteColors: ['#00FFE7'],
                            activityTime: 'morning',
                            interactionStyle: 'moderate'
                          })}
                          className="w-full"
                        >
                          Nova Pilot Style
                        </Button>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={resetToDefaults}
                        className="w-full"
                      >
                        Reset to Defaults
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'ml' && enablePixelML && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Brain className="w-8 h-8 text-cyan mx-auto mb-2" />
                      <h4 className="text-sm font-medium text-white">Machine Learning</h4>
                    </div>

                    {mlModel ? (
                      <div className="space-y-2">
                        <div className="text-sm text-white/70">
                          <div>Status: <span className="text-green-400">Trained</span></div>
                          <div>Accuracy: <span className="text-white">{(mlModel.accuracy * 100).toFixed(1)}%</span></div>
                          <div>Last Training: <span className="text-white">{mlModel.lastTraining.toLocaleDateString()}</span></div>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={handleMLPrediction}
                          className="w-full"
                        >
                          Predict Preferences
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-sm text-white/70 mb-3">
                          No trained model found
                        </div>
                        <Button
                          size="sm"
                          onClick={trainModel}
                          loading={mlLoading}
                          className="w-full"
                        >
                          Train Model
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 mt-4 pt-4 border-t border-white/10">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={saveUserProfile}
                  icon={<Save className="w-4 h-4" />}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={resetLearning}
                  icon={<RefreshCw className="w-4 h-4" />}
                >
                  Reset
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="glass border border-white/20"
        icon={<BarChart3 className="w-4 h-4" />}
      >
        {isExpanded ? 'Close' : 'Dashboard'}
      </Button>
    </div>
  )
}
