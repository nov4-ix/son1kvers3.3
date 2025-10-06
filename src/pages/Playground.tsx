import { AdaptivePixelsCanvas } from '@/components/AdaptivePixelsCanvas'
import { PixelLearningDashboard } from '@/components/PixelLearningDashboard'
import { usePixelStore } from '@/store/pixelStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Settings, 
  Zap, 
  Brain,
  Eye,
  BarChart3
} from 'lucide-react'

export function Playground() {
  const { 
    mode, 
    context, 
    isAnimating, 
    isPaused,
    setMode, 
    setContext, 
    setAnimating, 
    setPaused,
    resetLearning,
    enablePixelLearning,
    enablePixelML
  } = usePixelStore()

  const handleModeChange = (newMode: 'real' | 'simple' | 'ml') => {
    setMode(newMode)
  }

  const handleContextChange = (newContext: 'ghost-studio' | 'nova-pilot' | 'nexus') => {
    setContext(newContext)
  }

  return (
    <div className="min-h-screen bg-carbon relative overflow-hidden">
      {/* Main Canvas */}
      <AdaptivePixelsCanvas 
        width={window.innerWidth}
        height={window.innerHeight}
        density={1}
      />

      {/* Controls */}
      <div className="fixed top-4 left-4 z-40 space-y-4">
        {/* Mode Controls */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Mode</h3>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={mode === 'real' ? 'primary' : 'secondary'}
              onClick={() => handleModeChange('real')}
              icon={<Eye className="w-4 h-4" />}
            >
              Real
            </Button>
            <Button
              size="sm"
              variant={mode === 'simple' ? 'primary' : 'secondary'}
              onClick={() => handleModeChange('simple')}
              icon={<Zap className="w-4 h-4" />}
            >
              Simple
            </Button>
            {enablePixelML && (
              <Button
                size="sm"
                variant={mode === 'ml' ? 'primary' : 'secondary'}
                onClick={() => handleModeChange('ml')}
                icon={<Brain className="w-4 h-4" />}
              >
                ML
              </Button>
            )}
          </div>
        </Card>

        {/* Context Controls */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Context</h3>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={context === 'ghost-studio' ? 'primary' : 'secondary'}
              onClick={() => handleContextChange('ghost-studio')}
            >
              Ghost
            </Button>
            <Button
              size="sm"
              variant={context === 'nova-pilot' ? 'primary' : 'secondary'}
              onClick={() => handleContextChange('nova-pilot')}
            >
              Nova
            </Button>
            <Button
              size="sm"
              variant={context === 'nexus' ? 'primary' : 'secondary'}
              onClick={() => handleContextChange('nexus')}
            >
              Nexus
            </Button>
          </div>
        </Card>

        {/* Animation Controls */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Animation</h3>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setAnimating(!isAnimating)}
              icon={isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            >
              {isAnimating ? 'Pause' : 'Play'}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setPaused(!isPaused)}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Reset
            </Button>
          </div>
        </Card>

        {/* Learning Controls */}
        {enablePixelLearning && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Learning</h3>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={resetLearning}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Reset Learning
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-4 left-4 z-40">
        <Card className="p-3">
          <div className="flex items-center space-x-4 text-sm text-white/80">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isAnimating ? 'bg-green-400' : 'bg-gray-400'
              }`} />
              <span>{isAnimating ? 'Running' : 'Paused'}</span>
            </div>
            <div>Mode: {mode}</div>
            <div>Context: {context}</div>
            {enablePixelLearning && <div>Learning: ON</div>}
            {enablePixelML && <div>ML: ON</div>}
          </div>
        </Card>
      </div>

      {/* Dashboard */}
      <PixelLearningDashboard />

      {/* Instructions */}
      <div className="fixed top-4 right-4 z-40 max-w-xs">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-white mb-2">Instructions</h3>
          <div className="text-xs text-white/70 space-y-1">
            <div>• Click to interact with pixels</div>
            <div>• Hover to influence nearby pixels</div>
            <div>• P: Toggle pause/play</div>
            <div>• R: Reset pixels</div>
            <div>• D: Toggle dashboard</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
