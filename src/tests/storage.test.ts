import { describe, it, expect, beforeEach, vi } from 'vitest'
import { pixelStorage } from '@/lib/storage'
import type { PixelProfile, PixelPreferences } from '@/types/pixels'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Pixel Storage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    pixelStorage.clear()
  })

  it('should save and load user profile', () => {
    const profile: PixelProfile = {
      pixelPreferences: [],
      avgColor: '#00FFE7',
      avgSpeed: 1.5,
      totalInteractions: 100,
      lastUpdate: new Date(),
      userId: 'test-user'
    }

    pixelStorage.saveUserProfile(profile)
    const loadedProfile = pixelStorage.loadUserProfile()

    expect(loadedProfile).toEqual(profile)
  })

  it('should save and load pixel preferences', () => {
    const preferences: PixelPreferences[] = [
      {
        colorShift: 0.5,
        speedMultiplier: 1.2,
        size: 1.1,
        opacity: 0.9,
        glowIntensity: 1.3
      }
    ]

    pixelStorage.savePixelPreferences(preferences)
    const loadedPreferences = pixelStorage.loadPixelPreferences()

    expect(loadedPreferences).toEqual(preferences)
  })

  it('should handle corrupted data gracefully', () => {
    // Mock corrupted data
    localStorageMock.getItem.mockReturnValue('invalid-json')

    const result = pixelStorage.get('test-key')
    expect(result).toBeNull()
  })

  it('should handle missing data gracefully', () => {
    localStorageMock.getItem.mockReturnValue(null)

    const result = pixelStorage.get('non-existent-key')
    expect(result).toBeNull()
  })

  it('should clear all data', () => {
    pixelStorage.set('test-key', 'test-value')
    pixelStorage.clear()
    
    const result = pixelStorage.get('test-key')
    expect(result).toBeNull()
  })

  it('should remove specific keys', () => {
    pixelStorage.set('key1', 'value1')
    pixelStorage.set('key2', 'value2')
    
    pixelStorage.remove('key1')
    
    expect(pixelStorage.get('key1')).toBeNull()
    expect(pixelStorage.get('key2')).toBe('value2')
  })

  it('should calculate storage size', () => {
    pixelStorage.set('test-key', 'test-value')
    
    const size = pixelStorage.getStorageSize()
    expect(size).toBeGreaterThan(0)
  })

  it('should handle storage errors gracefully', () => {
    // Mock storage error
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })

    // Should not throw
    expect(() => {
      pixelStorage.set('test-key', 'test-value')
    }).not.toThrow()
  })
})
