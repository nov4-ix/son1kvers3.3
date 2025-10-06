import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { db } from '@/lib/supabase'

export function useInstagramAuth() {
  const { user } = useAuth()
  const [instagramConnection, setInstagramConnection] = useState<any>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    if (user) {
      loadInstagramConnection()
    }
  }, [user])

  const loadInstagramConnection = async () => {
    if (!user) return

    try {
      const { data } = await db.getUserIntegration(user.id, 'instagram')
      setInstagramConnection(data)
    } catch (error) {
      console.error('Error loading Instagram connection:', error)
    }
  }

  const connectInstagram = async () => {
    if (!user) return

    setIsConnecting(true)
    try {
      // Mock Instagram OAuth flow
      const mockIntegration = {
        id: 'mock-instagram-id',
        user_id: user.id,
        provider: 'instagram',
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: new Date(Date.now() + 3600000).toISOString(),
      }

      await db.createUserIntegration(mockIntegration)
      setInstagramConnection(mockIntegration)
    } catch (error) {
      console.error('Error connecting Instagram:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectInstagram = async () => {
    if (!instagramConnection) return

    try {
      await db.deleteUserIntegration(instagramConnection.id)
      setInstagramConnection(null)
    } catch (error) {
      console.error('Error disconnecting Instagram:', error)
    }
  }

  return {
    instagramConnection,
    isConnecting,
    connectInstagram,
    disconnectInstagram,
  }
}