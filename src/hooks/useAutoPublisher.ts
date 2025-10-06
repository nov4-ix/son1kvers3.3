import { useState } from 'react'
import { autoPublisherEngine } from '@/engine/autoPublisher'
import { api } from '@/lib/api'

export function useAutoPublisher() {
  const [status, setStatus] = useState(autoPublisherEngine.getStatus())
  const [isPublishing, setIsPublishing] = useState(false)

  const publishPostManually = async (postId: string) => {
    setIsPublishing(true)
    try {
      const result = await api.publishPostManually(postId)
      setStatus(autoPublisherEngine.getStatus())
      return result
    } catch (error) {
      console.error('Error publishing post:', error)
      throw error
    } finally {
      setIsPublishing(false)
    }
  }

  const runJobManually = async () => {
    setIsPublishing(true)
    try {
      const result = await api.runJobManually()
      setStatus(autoPublisherEngine.getStatus())
      return result
    } catch (error) {
      console.error('Error running job:', error)
      throw error
    } finally {
      setIsPublishing(false)
    }
  }

  return {
    status,
    isPublishing,
    publishPostManually,
    runJobManually,
  }
}