import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  AdaptivePixel, 
  PixelPreferences, 
  UserBehavior, 
  PixelMode, 
  PixelContext,
  SimpleAdaptation,
  PixelProfile,
  PixelMLModel
} from '@/types/pixels'

interface PixelState {
  // Core state
  pixels: AdaptivePixel[]
  behavior: UserBehavior
  mode: PixelMode
  context: PixelContext
  isAnimating: boolean
  isPaused: boolean
  
  // Preferences
  globalPreferences: PixelPreferences
  userProfile: PixelProfile | null
  mlModel: PixelMLModel | null
  
  // Feature flags
  enablePixelLearning: boolean
  enablePixelML: boolean
  
  // Stats
  totalInteractions: number
  adaptedPixels: number
  confidenceScore: number
  
  // Actions
  setMode: (mode: PixelMode) => void
  setContext: (context: PixelContext) => void
  setAnimating: (animating: boolean) => void
  setPaused: (paused: boolean) => void
  updateBehavior: (behavior: Partial<UserBehavior>) => void
  updatePixels: (pixels: AdaptivePixel[]) => void
  updateGlobalPreferences: (preferences: Partial<PixelPreferences>) => void
  setUserProfile: (profile: PixelProfile | null) => void
  setMLModel: (model: PixelMLModel | null) => void
  incrementInteractions: () => void
  resetLearning: () => void
  applySimpleAdaptation: (adaptation: SimpleAdaptation) => void
}

const defaultPreferences: PixelPreferences = {
  colorShift: 0,
  speedMultiplier: 1,
  size: 1,
  opacity: 0.8,
  glowIntensity: 1
}

const defaultBehavior: UserBehavior = {
  clickHeatmap: new Map(),
  hoverAreas: new Map(),
  scrollSpeed: 1,
  timeOnPage: {},
  interactions: {
    buttons: [],
    features: [],
    timeOfDay: new Date().getHours() < 12 ? 'morning' : 'afternoon'
  }
}

export const usePixelStore = create<PixelState>()(
  persist(
    (set, get) => ({
      // Initial state
      pixels: [],
      behavior: defaultBehavior,
      mode: 'real',
      context: 'nexus',
      isAnimating: false,
      isPaused: false,
      globalPreferences: defaultPreferences,
      userProfile: null,
      mlModel: null,
      enablePixelLearning: import.meta.env.VITE_ENABLE_PIXEL_LEARNING === 'true',
      enablePixelML: import.meta.env.VITE_ENABLE_PIXEL_ML === 'true',
      totalInteractions: 0,
      adaptedPixels: 0,
      confidenceScore: 0,

      // Actions
      setMode: (mode) => set({ mode }),
      setContext: (context) => set({ context }),
      setAnimating: (isAnimating) => set({ isAnimating }),
      setPaused: (isPaused) => set({ isPaused }),
      
      updateBehavior: (behaviorUpdate) => set((state) => ({
        behavior: { ...state.behavior, ...behaviorUpdate }
      })),
      
      updatePixels: (pixels) => {
        const adaptedPixels = pixels.filter(p => p.interactionCount > 0).length
        const confidenceScore = pixels.length > 0 
          ? pixels.reduce((sum, p) => sum + p.confidence, 0) / pixels.length 
          : 0
        
        set({ 
          pixels, 
          adaptedPixels,
          confidenceScore 
        })
      },
      
      updateGlobalPreferences: (preferencesUpdate) => set((state) => ({
        globalPreferences: { ...state.globalPreferences, ...preferencesUpdate }
      })),
      
      setUserProfile: (userProfile) => set({ userProfile }),
      setMLModel: (mlModel) => set({ mlModel }),
      
      incrementInteractions: () => set((state) => ({
        totalInteractions: state.totalInteractions + 1
      })),
      
      resetLearning: () => set({
        behavior: defaultBehavior,
        pixels: [],
        totalInteractions: 0,
        adaptedPixels: 0,
        confidenceScore: 0,
        userProfile: null,
        mlModel: null
      }),
      
      applySimpleAdaptation: (adaptation) => {
        const { favoriteApp, favoriteColors, activityTime, interactionStyle } = adaptation
        
        // Calculate preferences based on adaptation
        const preferences: PixelPreferences = {
          colorShift: favoriteApp === 'ghost-studio' ? 0.3 : favoriteApp === 'nova-pilot' ? -0.3 : 0,
          speedMultiplier: interactionStyle === 'minimal' ? 0.7 : interactionStyle === 'intensive' ? 1.5 : 1,
          size: activityTime === 'night' ? 0.8 : activityTime === 'morning' ? 1.2 : 1,
          opacity: interactionStyle === 'minimal' ? 0.6 : 0.9,
          glowIntensity: activityTime === 'night' ? 1.5 : 1
        }
        
        set({ globalPreferences: preferences })
      }
    }),
    {
      name: 'pixel-store',
      partialize: (state) => ({
        behavior: state.behavior,
        globalPreferences: state.globalPreferences,
        userProfile: state.userProfile,
        mlModel: state.mlModel,
        totalInteractions: state.totalInteractions,
        adaptedPixels: state.adaptedPixels,
        confidenceScore: state.confidenceScore,
        mode: state.mode,
        context: state.context
      }),
    }
  )
)
