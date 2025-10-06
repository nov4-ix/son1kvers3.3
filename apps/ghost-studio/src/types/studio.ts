export type Mood =
  | 'depressive' | 'sad' | 'content' | 'happy'
  | 'angry' | 'furious' | 'ecstatic'

export interface Knobs {
  expressiveness: number // 0..100
  rareness: number       // 0..100
  garage: number         // 0..100
  trash: number          // 0..100
}

export interface AnalysisResult {
  bpm: number
  confidence: number      // 0..1
  key?: string
  styleTags: string[]
  probableInstruments: string[]
  energy: number          // 0..1
  density: number         // 0..1
  notes: string[]
  genreDescription?: string
  instrumentDescription?: string
}

export interface SessionData {
  id: string
  createdAt: string
  audioRef: string        // blob url o ruta Supabase
  analysis: AnalysisResult
  knobs: Knobs
  userDescription: string
  finalPrompt: string
}

export type EngineRequest = {
  prompt: string
  bpm?: number
  styleTags?: string[]
  instruments?: string[]
  rarity?: number
  garage?: number
  trash?: number
  durationSec?: number
  seed?: number
}

export type EngineTask = {
  taskId: string
  createdAt: string
  status: 'queued' | 'running' | 'done' | 'error'
  streamUrl?: string
  downloadUrl?: string
  providerMeta?: any
  errorMessage?: string
}

export interface StudioState {
  // Audio
  audioBuffer: AudioBuffer | null
  audioUrl: string | null
  isPlaying: boolean
  currentTime: number
  duration: number
  
  // Analysis
  analysis: AnalysisResult | null
  isAnalyzing: boolean
  
  // Knobs
  knobs: Knobs
  
  // Prompt
  userDescription: string
  finalPrompt: string
  
  // Sessions
  sessions: SessionData[]
  currentSession: SessionData | null
  
  // Jobs
  jobs: EngineTask[]
  
  // Actions
  setAudioBuffer: (buffer: AudioBuffer | null) => void
  setAudioUrl: (url: string | null) => void
  setIsPlaying: (playing: boolean) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setAnalysis: (analysis: AnalysisResult | null) => void
  setIsAnalyzing: (analyzing: boolean) => void
  setKnobs: (knobs: Partial<Knobs>) => void
  setUserDescription: (description: string) => void
  setFinalPrompt: (prompt: string) => void
  addSession: (session: SessionData) => void
  setCurrentSession: (session: SessionData | null) => void
  addJob: (job: EngineTask) => void
  updateJob: (taskId: string, updates: Partial<EngineTask>) => void
  resetStudio: () => void
}
