export interface UserBehavior {
  clickHeatmap: Map<string, number>
  hoverAreas: Map<string, number>
  scrollSpeed: number
  timeOnPage: Record<string, number>
  interactions: {
    buttons: string[]
    features: string[]
    timeOfDay: string
  }
}

export interface PixelPreferences {
  colorShift: number        // -1..1
  speedMultiplier: number   // 0.5..2
  size: number              // 0.5..1.5
  opacity: number           // 0.3..1
  glowIntensity: number     // 0.5..2
}

export interface AdaptivePixel {
  id: string
  x: number
  y: number
  baseColor: string
  currentColor: string
  speed: number
  preferences: PixelPreferences
  interactionCount: number
  confidence: number        // 0..1
  lastAdaptation: Date
}

export interface Interaction {
  type: 'click' | 'hover' | 'ignore'
  intensity: number // 0..1
  timestamp: number
}

export interface SimpleAdaptation {
  favoriteApp: 'ghost-studio' | 'nova-pilot' | 'nexus'
  favoriteColors: string[]
  activityTime: 'morning' | 'afternoon' | 'evening' | 'night'
  interactionStyle: 'minimal' | 'moderate' | 'intensive'
}

export interface PixelProfile {
  pixelPreferences: PixelPreferences[]
  avgColor: string
  avgSpeed: number
  totalInteractions: number
  lastUpdate: Date
  userId?: string
}

export interface PixelMLModel {
  trained: boolean
  predictions: PixelPreferences
  accuracy: number
  lastTraining: Date
}

export type PixelMode = 'real' | 'simple' | 'ml'
export type PixelContext = 'ghost-studio' | 'nova-pilot' | 'nexus'
