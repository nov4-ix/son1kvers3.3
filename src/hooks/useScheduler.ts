import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { scheduler } from '@/lib/jobRunner'

export function useScheduler() {
  const { user } = useAuth()
  const [status, setStatus] = useState(scheduler.getStatus())
  const [recentlyPublished, setRecentlyPublished] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      startScheduler()
    }

    return () => {
      // Don't stop scheduler on unmount - let it run in background
    }
  }, [user])

  const startScheduler = () => {
    if (user) {
      scheduler.start(user.id)
      setStatus(scheduler.getStatus())
    }
  }

  const stopScheduler = () => {
    scheduler.stop()
    setStatus(scheduler.getStatus())
  }

  const clearRecentlyPublished = () => {
    scheduler.clearRecentlyPublished()
    setRecentlyPublished([])
  }

  // Update status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(scheduler.getStatus())
      setRecentlyPublished(scheduler.getStatus().recentlyPublished)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return {
    status,
    startScheduler,
    stopScheduler,
    recentlyPublished,
    clearRecentlyPublished,
  }
}