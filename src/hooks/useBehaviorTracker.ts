import { useCallback, useEffect, useRef } from 'react'
import { usePixelStore } from '@/store/pixelStore'
import { throttle, getHeatmapKey, getTimeOfDay } from '@/lib/utils'
import type { UserBehavior, Interaction } from '@/types/pixels'

export function useBehaviorTracker() {
  const { behavior, updateBehavior, incrementInteractions } = usePixelStore()
  const lastScrollTime = useRef(0)
  const scrollVelocity = useRef(0)

  // Throttled functions
  const throttledTrackClick = useCallback(
    throttle((x: number, y: number) => {
      const key = getHeatmapKey(x, y)
      const currentHeat = behavior.clickHeatmap.get(key) || 0
      behavior.clickHeatmap.set(key, currentHeat + 1)
      
      updateBehavior({ 
        clickHeatmap: new Map(behavior.clickHeatmap),
        interactions: {
          ...behavior.interactions,
          timeOfDay: getTimeOfDay()
        }
      })
      
      incrementInteractions()
    }, 100),
    [behavior, updateBehavior, incrementInteractions]
  )

  const throttledTrackHover = useCallback(
    throttle((x: number, y: number) => {
      const key = getHeatmapKey(x, y)
      const currentHeat = behavior.hoverAreas.get(key) || 0
      behavior.hoverAreas.set(key, currentHeat + 0.1)
      
      updateBehavior({ 
        hoverAreas: new Map(behavior.hoverAreas)
      })
    }, 50),
    [behavior, updateBehavior]
  )

  const throttledTrackScroll = useCallback(
    throttle((deltaY: number) => {
      const now = Date.now()
      const timeDelta = now - lastScrollTime.current
      
      if (timeDelta > 0) {
        scrollVelocity.current = Math.abs(deltaY) / timeDelta
        updateBehavior({ scrollSpeed: scrollVelocity.current })
      }
      
      lastScrollTime.current = now
    }, 16),
    [updateBehavior]
  )

  // Event handlers
  const handleClick = useCallback((event: MouseEvent) => {
    throttledTrackClick(event.clientX, event.clientY)
  }, [throttledTrackClick])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    throttledTrackHover(event.clientX, event.clientY)
  }, [throttledTrackHover])

  const handleScroll = useCallback((event: Event) => {
    const wheelEvent = event as WheelEvent
    throttledTrackScroll(wheelEvent.deltaY)
  }, [throttledTrackScroll])

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase()
    const currentButtons = behavior.interactions.buttons
    
    if (!currentButtons.includes(key)) {
      updateBehavior({
        interactions: {
          ...behavior.interactions,
          buttons: [...currentButtons, key]
        }
      })
    }
  }, [behavior.interactions, updateBehavior])

  // Setup event listeners
  useEffect(() => {
    const element = document.documentElement
    
    element.addEventListener('click', handleClick, { passive: true })
    element.addEventListener('mousemove', handleMouseMove, { passive: true })
    element.addEventListener('wheel', handleScroll, { passive: true })
    element.addEventListener('keydown', handleKeyPress, { passive: true })

    return () => {
      element.removeEventListener('click', handleClick)
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('wheel', handleScroll)
      element.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleClick, handleMouseMove, handleScroll, handleKeyPress])

  // Track time on page
  useEffect(() => {
    const startTime = Date.now()
    const pageKey = window.location.pathname
    
    return () => {
      const timeSpent = Date.now() - startTime
      const currentTime = behavior.timeOnPage[pageKey] || 0
      
      updateBehavior({
        timeOnPage: {
          ...behavior.timeOnPage,
          [pageKey]: currentTime + timeSpent
        }
      })
    }
  }, [behavior.timeOnPage, updateBehavior])

  // Public API
  const trackInteraction = useCallback((interaction: Interaction) => {
    const { type, intensity, timestamp } = interaction
    
    switch (type) {
      case 'click':
        // Already handled by click event
        break
      case 'hover':
        // Already handled by mousemove event
        break
      case 'ignore':
        // Decrease interaction count for ignored areas
        break
    }
  }, [])

  const getHeatmapData = useCallback(() => {
    return {
      clicks: Array.from(behavior.clickHeatmap.entries()),
      hovers: Array.from(behavior.hoverAreas.entries()),
      scrollSpeed: behavior.scrollSpeed,
      timeOnPage: behavior.timeOnPage,
      interactions: behavior.interactions
    }
  }, [behavior])

  const resetBehavior = useCallback(() => {
    updateBehavior({
      clickHeatmap: new Map(),
      hoverAreas: new Map(),
      scrollSpeed: 1,
      timeOnPage: {},
      interactions: {
        buttons: [],
        features: [],
        timeOfDay: getTimeOfDay()
      }
    })
  }, [updateBehavior])

  return {
    behavior,
    trackInteraction,
    getHeatmapData,
    resetBehavior,
    throttledTrackClick,
    throttledTrackHover,
    throttledTrackScroll
  }
}
