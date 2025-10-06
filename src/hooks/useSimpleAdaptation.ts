import { useCallback } from 'react'
import { usePixelStore } from '@/store/pixelStore'
import { getContextColor, lerpColor } from '@/lib/utils'
import type { SimpleAdaptation, PixelPreferences } from '@/types/pixels'

export function useSimpleAdaptation() {
  const { 
    pixels, 
    context, 
    updatePixels, 
    updateGlobalPreferences,
    globalPreferences 
  } = usePixelStore()

  const applySimpleAdaptation = useCallback((adaptation: SimpleAdaptation) => {
    const { favoriteApp, favoriteColors, activityTime, interactionStyle } = adaptation
    
    // Calculate preferences based on adaptation
    const preferences: PixelPreferences = {
      colorShift: favoriteApp === 'ghost-studio' ? 0.3 : favoriteApp === 'nova-pilot' ? -0.3 : 0,
      speedMultiplier: interactionStyle === 'minimal' ? 0.7 : interactionStyle === 'intensive' ? 1.5 : 1,
      size: activityTime === 'night' ? 0.8 : activityTime === 'morning' ? 1.2 : 1,
      opacity: interactionStyle === 'minimal' ? 0.6 : 0.9,
      glowIntensity: activityTime === 'night' ? 1.5 : 1
    }

    // Update global preferences
    updateGlobalPreferences(preferences)

    // Apply to all pixels immediately
    const updatedPixels = pixels.map(pixel => {
      const newPixel = { ...pixel }
      
      // Apply color adaptation
      if (favoriteColors.length > 0) {
        const targetColor = favoriteColors[0]
        newPixel.currentColor = lerpColor(pixel.baseColor, targetColor, 0.5)
      }
      
      // Apply preferences
      newPixel.preferences = { ...preferences }
      
      return newPixel
    })

    updatePixels(updatedPixels)
  }, [pixels, context, updatePixels, updateGlobalPreferences])

  const resetToDefaults = useCallback(() => {
    const defaultPreferences: PixelPreferences = {
      colorShift: 0,
      speedMultiplier: 1,
      size: 1,
      opacity: 0.8,
      glowIntensity: 1
    }

    updateGlobalPreferences(defaultPreferences)

    const updatedPixels = pixels.map(pixel => ({
      ...pixel,
      currentColor: pixel.baseColor,
      preferences: { ...defaultPreferences }
    }))

    updatePixels(updatedPixels)
  }, [pixels, updatePixels, updateGlobalPreferences])

  const applyColorTheme = useCallback((theme: 'cyan' | 'magenta' | 'accent') => {
    const colorMap = {
      cyan: '#00FFE7',
      magenta: '#B84DFF',
      accent: '#9AF7EE'
    }

    const targetColor = colorMap[theme]
    const updatedPixels = pixels.map(pixel => ({
      ...pixel,
      currentColor: lerpColor(pixel.baseColor, targetColor, 0.7)
    }))

    updatePixels(updatedPixels)
  }, [pixels, updatePixels])

  const adjustSpeed = useCallback((multiplier: number) => {
    const updatedPixels = pixels.map(pixel => ({
      ...pixel,
      preferences: {
        ...pixel.preferences,
        speedMultiplier: multiplier
      }
    }))

    updatePixels(updatedPixels)
    updateGlobalPreferences({ speedMultiplier: multiplier })
  }, [pixels, updatePixels, updateGlobalPreferences])

  const adjustOpacity = useCallback((opacity: number) => {
    const updatedPixels = pixels.map(pixel => ({
      ...pixel,
      preferences: {
        ...pixel.preferences,
        opacity
      }
    }))

    updatePixels(updatedPixels)
    updateGlobalPreferences({ opacity })
  }, [pixels, updatePixels, updateGlobalPreferences])

  const adjustGlow = useCallback((glowIntensity: number) => {
    const updatedPixels = pixels.map(pixel => ({
      ...pixel,
      preferences: {
        ...pixel.preferences,
        glowIntensity
      }
    }))

    updatePixels(updatedPixels)
    updateGlobalPreferences({ glowIntensity })
  }, [pixels, updatePixels, updateGlobalPreferences])

  return {
    applySimpleAdaptation,
    resetToDefaults,
    applyColorTheme,
    adjustSpeed,
    adjustOpacity,
    adjustGlow,
    currentPreferences: globalPreferences
  }
}
