import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StudioState, Knobs, AnalysisResult, SessionData, EngineTask } from '@/types/studio'

const defaultKnobs: Knobs = {
  expressiveness: 50,
  rareness: 50,
  garage: 50,
  trash: 50
}

const defaultAnalysis: AnalysisResult = {
  bpm: 120,
  confidence: 0,
  styleTags: [],
  probableInstruments: [],
  energy: 0.5,
  density: 0.5,
  notes: [],
  genreDescription: '',
  instrumentDescription: ''
}

export const useStudioStore = create<StudioState>()(
  persist(
    (set, get) => ({
      // Audio
      audioBuffer: null,
      audioUrl: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      
      // Analysis
      analysis: null,
      isAnalyzing: false,
      
      // Knobs
      knobs: defaultKnobs,
      
      // Prompt
      userDescription: '',
      finalPrompt: '',
      
      // Sessions
      sessions: [],
      currentSession: null,
      
      // Jobs
      jobs: [],
      
      // Actions
      setAudioBuffer: (audioBuffer) => set({ audioBuffer }),
      setAudioUrl: (audioUrl) => set({ audioUrl }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setCurrentTime: (currentTime) => set({ currentTime }),
      setDuration: (duration) => set({ duration }),
      setAnalysis: (analysis) => set({ analysis }),
      setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
      setKnobs: (knobUpdates) => set((state) => ({
        knobs: { ...state.knobs, ...knobUpdates }
      })),
      setUserDescription: (userDescription) => set({ userDescription }),
      setFinalPrompt: (finalPrompt) => set({ finalPrompt }),
      addSession: (session) => set((state) => ({
        sessions: [...state.sessions, session]
      })),
      setCurrentSession: (currentSession) => set({ currentSession }),
      addJob: (job) => set((state) => ({
        jobs: [...state.jobs, job]
      })),
      updateJob: (taskId, updates) => set((state) => ({
        jobs: state.jobs.map(job => 
          job.taskId === taskId ? { ...job, ...updates } : job
        )
      })),
      resetStudio: () => set({
        audioBuffer: null,
        audioUrl: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        analysis: null,
        isAnalyzing: false,
        knobs: defaultKnobs,
        userDescription: '',
        finalPrompt: '',
        currentSession: null,
        jobs: []
      })
    }),
    {
      name: 'ghost-studio-store',
      partialize: (state) => ({
        knobs: state.knobs,
        userDescription: state.userDescription,
        sessions: state.sessions,
        currentSession: state.currentSession
      }),
    }
  )
)
