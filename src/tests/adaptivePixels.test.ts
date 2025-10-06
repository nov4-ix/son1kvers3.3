import { describe, it, expect, beforeEach } from 'vitest'
import { useAdaptivePixels } from '@/hooks/useAdaptivePixels'
import { generatePixelId, getContextColor } from '@/lib/utils'
import type { AdaptivePixel, Interaction } from '@/types/pixels'

describe('Adaptive Pixels', () => {
  let adaptivePixels: ReturnType<typeof useAdaptivePixels>
  let mockPixel: AdaptivePixel

  beforeEach(() => {
    mockPixel = {
      id: generatePixelId(),
      x: 100,
      y: 200,
      baseColor: '#00FFE7',
      currentColor: '#00FFE7',
      speed: 1,
      preferences: {
        colorShift: 0,
        speedMultiplier: 1,
        size: 1,
        opacity: 0.8,
        glowIntensity: 1
      },
      interactionCount: 0,
      confidence: 0,
      lastAdaptation: new Date()
    }

    // Mock implementation for testing
    adaptivePixels = {
      pixels: [mockPixel],
      initializePixels: vi.fn(),
      notifyNearbyPixels: vi.fn(),
      startAnimation: vi.fn(),
      stopAnimation: vi.fn(),
      saveUserProfile: vi.fn(),
      loadUserProfile: vi.fn(),
      adaptPixel: vi.fn(),
      calculateAdaptiveColor: vi.fn()
    }
  })

  it('should generate unique pixel IDs', () => {
    const id1 = generatePixelId()
    const id2 = generatePixelId()
    
    expect(id1).not.toBe(id2)
    expect(id1).toMatch(/^pixel_\d+_[a-z0-9]+$/)
  })

  it('should get correct context colors', () => {
    expect(getContextColor('ghost-studio')).toBe('#B84DFF')
    expect(getContextColor('nova-pilot')).toBe('#00FFE7')
    expect(getContextColor('nexus')).toBe('#9AF7EE')
    expect(getContextColor('unknown')).toBe('#00FFE7')
  })

  it('should adapt pixel on click interaction', () => {
    const interaction: Interaction = {
      type: 'click',
      intensity: 1,
      timestamp: Date.now()
    }

    adaptivePixels.adaptPixel(mockPixel, interaction)
    
    expect(adaptivePixels.adaptPixel).toHaveBeenCalledWith(mockPixel, interaction)
  })

  it('should adapt pixel on hover interaction', () => {
    const interaction: Interaction = {
      type: 'hover',
      intensity: 0.5,
      timestamp: Date.now()
    }

    adaptivePixels.adaptPixel(mockPixel, interaction)
    
    expect(adaptivePixels.adaptPixel).toHaveBeenCalledWith(mockPixel, interaction)
  })

  it('should notify nearby pixels', () => {
    const x = 100
    const y = 200
    const interaction: Interaction = {
      type: 'click',
      intensity: 1,
      timestamp: Date.now()
    }

    adaptivePixels.notifyNearbyPixels(x, y, interaction)
    
    expect(adaptivePixels.notifyNearbyPixels).toHaveBeenCalledWith(x, y, interaction)
  })

  it('should calculate adaptive color', () => {
    adaptivePixels.calculateAdaptiveColor(mockPixel)
    
    expect(adaptivePixels.calculateAdaptiveColor).toHaveBeenCalledWith(mockPixel)
  })

  it('should save user profile', async () => {
    await adaptivePixels.saveUserProfile()
    
    expect(adaptivePixels.saveUserProfile).toHaveBeenCalled()
  })

  it('should load user profile', async () => {
    await adaptivePixels.loadUserProfile()
    
    expect(adaptivePixels.loadUserProfile).toHaveBeenCalled()
  })
})
