import { describe, it, expect, beforeEach } from 'vitest'
import { useBehaviorTracker } from '@/hooks/useBehaviorTracker'
import { getHeatmapKey, calculateIntensity } from '@/lib/utils'

describe('Behavior Tracker', () => {
  let behaviorTracker: ReturnType<typeof useBehaviorTracker>

  beforeEach(() => {
    // Mock implementation for testing
    behaviorTracker = {
      behavior: {
        clickHeatmap: new Map(),
        hoverAreas: new Map(),
        scrollSpeed: 1,
        timeOnPage: {},
        interactions: {
          buttons: [],
          features: [],
          timeOfDay: 'afternoon'
        }
      },
      trackInteraction: vi.fn(),
      getHeatmapData: vi.fn(),
      resetBehavior: vi.fn(),
      throttledTrackClick: vi.fn(),
      throttledTrackHover: vi.fn(),
      throttledTrackScroll: vi.fn()
    }
  })

  it('should generate correct heatmap keys', () => {
    expect(getHeatmapKey(25, 75)).toBe('0-1')
    expect(getHeatmapKey(100, 200)).toBe('2-4')
    expect(getHeatmapKey(0, 0)).toBe('0-0')
  })

  it('should calculate intensity correctly', () => {
    expect(calculateIntensity(0, 100)).toBe(1)
    expect(calculateIntensity(50, 100)).toBe(0.5)
    expect(calculateIntensity(100, 100)).toBe(0)
    expect(calculateIntensity(150, 100)).toBe(0)
  })

  it('should track click interactions', () => {
    const x = 100
    const y = 200
    const key = getHeatmapKey(x, y)
    
    behaviorTracker.throttledTrackClick(x, y)
    
    expect(behaviorTracker.throttledTrackClick).toHaveBeenCalledWith(x, y)
  })

  it('should track hover interactions', () => {
    const x = 150
    const y = 250
    
    behaviorTracker.throttledTrackHover(x, y)
    
    expect(behaviorTracker.throttledTrackHover).toHaveBeenCalledWith(x, y)
  })

  it('should reset behavior data', () => {
    behaviorTracker.resetBehavior()
    
    expect(behaviorTracker.resetBehavior).toHaveBeenCalled()
  })
})
