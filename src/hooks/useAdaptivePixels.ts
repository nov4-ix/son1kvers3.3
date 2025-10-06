import { useCallback, useEffect, useRef } from 'react'
import { usePixelStore } from '@/store/pixelStore'
import { pixelStorage } from '@/lib/storage'
import { pixelSupabase } from '@/lib/supabase'
import { 
  generatePixelId, 
  getContextColor, 
  calculateDistance, 
  calculateIntensity,
  clamp,
  lerpColor
} from '@/lib/utils'
import type { AdaptivePixel, PixelPreferences, Interaction, PixelProfile } from '@/types/pixels'

const PIXEL_COUNT = 10000
const ADAPTATION_RADIUS = 100
const GRID_SIZE = 50

export function useAdaptivePixels() {
  const { 
    pixels, 
    context, 
    updatePixels, 
    globalPreferences,
    userProfile,
    setUserProfile,
    enablePixelLearning 
  } = usePixelStore()
  
  const animationRef = useRef<number>()
  const lastFrameTime = useRef(0)

  // Initialize pixels
  const initializePixels = useCallback(() => {
    if (pixels.length > 0) return

    const newPixels: AdaptivePixel[] = []
    const canvasWidth = window.innerWidth
    const canvasHeight = window.innerHeight
    
    for (let i = 0; i < PIXEL_COUNT; i++) {
      const pixel: AdaptivePixel = {
        id: generatePixelId(),
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        baseColor: getContextColor(context),
        currentColor: getContextColor(context),
        speed: Math.random() * 2 + 0.5,
        preferences: { ...globalPreferences },
        interactionCount: 0,
        confidence: 0,
        lastAdaptation: new Date()
      }
      newPixels.push(pixel)
    }
    
    updatePixels(newPixels)
  }, [pixels.length, context, globalPreferences, updatePixels])

  // Adapt pixel based on interaction
  const adaptPixel = useCallback((pixel: AdaptivePixel, interaction: Interaction) => {
    const { type, intensity } = interaction
    
    // Update interaction count
    pixel.interactionCount += 1
    
    // Adapt preferences based on interaction type
    switch (type) {
      case 'click':
        pixel.preferences.glowIntensity = clamp(
          pixel.preferences.glowIntensity + intensity * 0.2, 
          0.5, 
          2
        )
        pixel.preferences.size = clamp(
          pixel.preferences.size + intensity * 0.1, 
          0.5, 
          1.5
        )
        break
        
      case 'hover':
        pixel.preferences.speedMultiplier = clamp(
          pixel.preferences.speedMultiplier - intensity * 0.1, 
          0.5, 
          2
        )
        break
        
      case 'ignore':
        pixel.preferences.opacity = clamp(
          pixel.preferences.opacity - intensity * 0.05, 
          0.3, 
          1
        )
        break
    }
    
    // Update confidence based on interaction count
    pixel.confidence = Math.min(pixel.interactionCount / 10, 1)
    pixel.lastAdaptation = new Date()
    
    // Calculate new color based on preferences
    pixel.currentColor = calculateAdaptiveColor(pixel)
  }, [])

  // Calculate adaptive color
  const calculateAdaptiveColor = useCallback((pixel: AdaptivePixel): string => {
    const baseColor = pixel.baseColor
    const contextColor = getContextColor(context)
    
    // Apply color shift based on preferences
    const colorShift = pixel.preferences.colorShift
    if (colorShift !== 0) {
      return lerpColor(baseColor, contextColor, Math.abs(colorShift))
    }
    
    return baseColor
  }, [context])

  // Notify nearby pixels of interaction
  const notifyNearbyPixels = useCallback((x: number, y: number, interaction: Interaction) => {
    if (!enablePixelLearning) return

    const updatedPixels = pixels.map(pixel => {
      const distance = calculateDistance(x, y, pixel.x, pixel.y)
      
      if (distance <= ADAPTATION_RADIUS) {
        const intensity = calculateIntensity(distance, ADAPTATION_RADIUS) * interaction.intensity
        const adaptedPixel = { ...pixel }
        adaptPixel(adaptedPixel, { ...interaction, intensity })
        return adaptedPixel
      }
      
      return pixel
    })
    
    updatePixels(updatedPixels)
  }, [pixels, enablePixelLearning, adaptPixel, updatePixels])

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (timestamp - lastFrameTime.current < 16) {
      animationRef.current = requestAnimationFrame(animate)
      return
    }
    
    lastFrameTime.current = timestamp
    
    const updatedPixels = pixels.map(pixel => {
      const { speedMultiplier, opacity, glowIntensity } = pixel.preferences
      
      // Update position
      pixel.x += Math.sin(timestamp * 0.001 + pixel.id.length) * speedMultiplier
      pixel.y += Math.cos(timestamp * 0.001 + pixel.id.length) * speedMultiplier
      
      // Wrap around screen
      if (pixel.x < 0) pixel.x = window.innerWidth
      if (pixel.x > window.innerWidth) pixel.x = 0
      if (pixel.y < 0) pixel.y = window.innerHeight
      if (pixel.y > window.innerHeight) pixel.y = 0
      
      return pixel
    })
    
    updatePixels(updatedPixels)
    animationRef.current = requestAnimationFrame(animate)
  }, [pixels, updatePixels])

  // Start/stop animation
  const startAnimation = useCallback(() => {
    if (animationRef.current) return
    animationRef.current = requestAnimationFrame(animate)
  }, [animate])

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = undefined
    }
  }, [])

  // Save user profile
  const saveUserProfile = useCallback(async () => {
    if (pixels.length === 0) return

    const avgColor = pixels.reduce((sum, p) => {
      const color = p.currentColor.replace('#', '')
      return sum + parseInt(color, 16)
    }, 0) / pixels.length

    const avgSpeed = pixels.reduce((sum, p) => sum + p.speed, 0) / pixels.length
    const totalInteractions = pixels.reduce((sum, p) => sum + p.interactionCount, 0)

    const profile: PixelProfile = {
      pixelPreferences: pixels.map(p => p.preferences),
      avgColor: `#${Math.round(avgColor).toString(16).padStart(6, '0')}`,
      avgSpeed,
      totalInteractions,
      lastUpdate: new Date(),
      userId: 'anonymous'
    }

    // Save to localStorage
    pixelStorage.saveUserProfile(profile)
    setUserProfile(profile)

    // Try to save to Supabase if available
    try {
      await pixelSupabase.saveUserProfile(profile)
    } catch (error) {
      console.warn('Failed to save to Supabase:', error)
    }
  }, [pixels, setUserProfile])

  // Load user profile
  const loadUserProfile = useCallback(async () => {
    // Try localStorage first
    const localProfile = pixelStorage.loadUserProfile()
    if (localProfile) {
      setUserProfile(localProfile)
      return localProfile
    }

    // Try Supabase if available
    try {
      const supabaseProfile = await pixelSupabase.loadUserProfile('anonymous')
      if (supabaseProfile) {
        const profile: PixelProfile = {
          pixelPreferences: supabaseProfile.pixel_preferences || [],
          avgColor: supabaseProfile.avg_color || getContextColor(context),
          avgSpeed: supabaseProfile.avg_speed || 1,
          totalInteractions: supabaseProfile.total_interactions || 0,
          lastUpdate: new Date(supabaseProfile.last_update),
          userId: supabaseProfile.user_id
        }
        setUserProfile(profile)
        return profile
      }
    } catch (error) {
      console.warn('Failed to load from Supabase:', error)
    }

    return null
  }, [context, setUserProfile])

  // Initialize on mount
  useEffect(() => {
    initializePixels()
    loadUserProfile()
  }, [initializePixels, loadUserProfile])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAnimation()
    }
  }, [stopAnimation])

  return {
    pixels,
    initializePixels,
    notifyNearbyPixels,
    startAnimation,
    stopAnimation,
    saveUserProfile,
    loadUserProfile,
    adaptPixel,
    calculateAdaptiveColor
  }
}
