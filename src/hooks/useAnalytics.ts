import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { AnalyticsEventType, AnalyticsEventInsert } from '@/types/database'

interface AnalyticsData {
  postsCreated: number
  postsPublished: number
  aiUsed: number
  sessions: number
  loginCount: number
  integrationConnections: number
}

interface ChartData {
  name: string
  value: number
  color?: string
}

export function useAnalytics() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    postsCreated: 0,
    postsPublished: 0,
    aiUsed: 0,
    sessions: 0,
    loginCount: 0,
    integrationConnections: 0
  })

  // Track an analytics event
  const trackEvent = useCallback(async (
    eventType: AnalyticsEventType,
    action: string,
    metadata?: Record<string, any>
  ) => {
    if (!user) return

    try {
      const eventData: AnalyticsEventInsert = {
        user_id: user.id,
        event_type: eventType,
        action,
        metadata: metadata || {},
        session_id: generateSessionId(),
        user_agent: navigator.userAgent,
        ip_address: null // Would be set by backend in production
      }

      const { error } = await supabase
        .from('analytics_events')
        .insert(eventData)

      if (error) {
        console.error('Error tracking analytics event:', error)
      }
    } catch (error) {
      console.error('Error in trackEvent:', error)
    }
  }, [user])

  // Get analytics data for dashboard
  const getAnalyticsData = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    try {
      // Get events for the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: events, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())

      if (error) throw error

      // Process events to get counts
      const data: AnalyticsData = {
        postsCreated: 0,
        postsPublished: 0,
        aiUsed: 0,
        sessions: 0,
        loginCount: 0,
        integrationConnections: 0
      }

      const uniqueSessions = new Set<string>()

      events?.forEach(event => {
        switch (event.event_type) {
          case AnalyticsEventType.POST_CREATED:
            data.postsCreated++
            break
          case AnalyticsEventType.POST_PUBLISHED:
            data.postsPublished++
            break
          case AnalyticsEventType.AI_USED:
            data.aiUsed++
            break
          case AnalyticsEventType.LOGIN:
            data.loginCount++
            if (event.session_id) {
              uniqueSessions.add(event.session_id)
            }
            break
          case AnalyticsEventType.INTEGRATION_CONNECTED:
            data.integrationConnections++
            break
        }
      })

      data.sessions = uniqueSessions.size
      setAnalyticsData(data)

    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Get chart data for visualizations
  const getChartData = useCallback((): ChartData[] => {
    return [
      { name: 'Posts Creados', value: analyticsData.postsCreated, color: '#00FFE7' },
      { name: 'Posts Publicados', value: analyticsData.postsPublished, color: '#B84DFF' },
      { name: 'IA Usada', value: analyticsData.aiUsed, color: '#9AF7EE' },
      { name: 'Sesiones', value: analyticsData.sessions, color: '#FF6B6B' },
      { name: 'Logins', value: analyticsData.loginCount, color: '#4ECDC4' },
      { name: 'Integraciones', value: analyticsData.integrationConnections, color: '#45B7D1' }
    ]
  }, [analyticsData])

  // Get events by type for detailed analytics
  const getEventsByType = useCallback(async (eventType: AnalyticsEventType) => {
    if (!user) return []

    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', user.id)
        .eq('event_type', eventType)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching events by type:', error)
      return []
    }
  }, [user])

  // Get daily activity for the last 7 days
  const getDailyActivity = useCallback(async () => {
    if (!user) return []

    try {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { data, error } = await supabase
        .from('analytics_events')
        .select('created_at, event_type')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString())

      if (error) throw error

      // Group by day
      const dailyActivity: Record<string, number> = {}
      const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

      // Initialize all days with 0
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dayKey = days[date.getDay()]
        dailyActivity[dayKey] = 0
      }

      // Count events per day
      data?.forEach(event => {
        const eventDate = new Date(event.created_at)
        const dayKey = days[eventDate.getDay()]
        dailyActivity[dayKey] = (dailyActivity[dayKey] || 0) + 1
      })

      return Object.entries(dailyActivity).map(([day, count]) => ({
        day,
        count,
        date: day
      }))
    } catch (error) {
      console.error('Error fetching daily activity:', error)
      return []
    }
  }, [user])

  // Helper function to generate session ID
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }, [])

  // Convenience methods for common events
  const trackLogin = useCallback(() => {
    trackEvent(AnalyticsEventType.LOGIN, 'user_login')
  }, [trackEvent])

  const trackPostCreated = useCallback((postId: string, platform: string) => {
    trackEvent(AnalyticsEventType.POST_CREATED, 'create_post', {
      post_id: postId,
      platform
    })
  }, [trackEvent])

  const trackPostPublished = useCallback((postId: string, network: string) => {
    trackEvent(AnalyticsEventType.POST_PUBLISHED, 'publish_post', {
      post_id: postId,
      network
    })
  }, [trackEvent])

  const trackAIUsed = useCallback((type: string, prompt: string) => {
    trackEvent(AnalyticsEventType.AI_USED, 'generate_ai', {
      ai_type: type,
      prompt_length: prompt.length
    })
  }, [trackEvent])

  const trackIntegrationConnected = useCallback((provider: string) => {
    trackEvent(AnalyticsEventType.INTEGRATION_CONNECTED, 'connect_integration', {
      provider
    })
  }, [trackEvent])

  const trackSubscriptionChanged = useCallback((oldPlan: string, newPlan: string) => {
    trackEvent(AnalyticsEventType.SUBSCRIPTION_CHANGED, 'change_subscription', {
      old_plan: oldPlan,
      new_plan: newPlan
    })
  }, [trackEvent])

  return {
    analyticsData,
    isLoading,
    getAnalyticsData,
    getChartData,
    getEventsByType,
    getDailyActivity,
    trackEvent,
    trackLogin,
    trackPostCreated,
    trackPostPublished,
    trackAIUsed,
    trackIntegrationConnected,
    trackSubscriptionChanged
  }
}
