import { supabase } from '@/lib/supabase'
import type { ScheduledPost } from '@/types/database'

interface SchedulerConfig {
  intervalMs: number
  enabled: boolean
}

class SchedulerService {
  private intervalId: NodeJS.Timeout | null = null
  private config: SchedulerConfig = {
    intervalMs: 30000, // 30 segundos para demo
    enabled: false
  }
  private listeners: Array<(posts: ScheduledPost[]) => void> = []

  constructor() {
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.checkScheduledPosts = this.checkScheduledPosts.bind(this)
  }

  start() {
    if (this.intervalId) {
      console.log('Scheduler already running')
      return
    }

    this.config.enabled = true
    console.log('🚀 Scheduler started - checking every', this.config.intervalMs / 1000, 'seconds')
    
    this.intervalId = setInterval(this.checkScheduledPosts, this.config.intervalMs)
    
    // Check immediately on start
    this.checkScheduledPosts()
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      this.config.enabled = false
      console.log('⏹️ Scheduler stopped')
    }
  }

  private async checkScheduledPosts() {
    if (!this.config.enabled) return

    try {
      console.log('🔍 Checking scheduled posts...')
      
      const now = new Date().toISOString()
      
      // Get pending posts that should be published now
      const { data: posts, error } = await supabase
        .from('scheduled_posts')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_time', now)
        .order('scheduled_time', { ascending: true })

      if (error) {
        console.error('❌ Error fetching scheduled posts:', error)
        return
      }

      if (!posts || posts.length === 0) {
        console.log('✅ No posts to publish')
        return
      }

      console.log(`📝 Found ${posts.length} posts to publish`)

      // Process each post
      for (const post of posts) {
        await this.publishPost(post)
      }

      // Notify listeners
      this.notifyListeners(posts)

    } catch (error) {
      console.error('❌ Scheduler error:', error)
    }
  }

  private async publishPost(post: ScheduledPost) {
    try {
      console.log(`📤 Publishing post: ${post.title}`)
      
      // Simulate publishing process
      const publishResult = await this.simulatePublish(post)
      
      if (publishResult.success) {
        // Update post status to published
        const { error } = await supabase
          .from('scheduled_posts')
          .update({
            status: 'published',
            published_at: new Date().toISOString(),
            analytics: {
              published_at: new Date().toISOString(),
              platform: post.platform,
              simulated: true
            }
          })
          .eq('id', post.id)

        if (error) {
          console.error('❌ Error updating post status:', error)
          await this.markPostAsFailed(post.id, error.message)
        } else {
          console.log(`✅ Post published successfully: ${post.title}`)
        }
      } else {
        await this.markPostAsFailed(post.id, publishResult.error || 'Unknown error')
      }

    } catch (error) {
      console.error('❌ Error publishing post:', error)
      await this.markPostAsFailed(post.id, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  private async simulatePublish(post: ScheduledPost): Promise<{ success: boolean; error?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    // Simulate 90% success rate
    const success = Math.random() > 0.1
    
    if (success) {
      console.log(`🎯 Simulated successful publish to ${post.platform}:`, post.title)
      return { success: true }
    } else {
      console.log(`💥 Simulated publish failure to ${post.platform}:`, post.title)
      return { success: false, error: 'Simulated network error' }
    }
  }

  private async markPostAsFailed(postId: string, errorMessage: string) {
    try {
      const { error } = await supabase
        .from('scheduled_posts')
        .update({
          status: 'failed',
          error_message: errorMessage
        })
        .eq('id', postId)

      if (error) {
        console.error('❌ Error marking post as failed:', error)
      } else {
        console.log(`❌ Post marked as failed: ${postId}`)
      }
    } catch (error) {
      console.error('❌ Error in markPostAsFailed:', error)
    }
  }

  // Subscribe to scheduler events
  subscribe(listener: (posts: ScheduledPost[]) => void) {
    this.listeners.push(listener)
    
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners(posts: ScheduledPost[]) {
    this.listeners.forEach(listener => {
      try {
        listener(posts)
      } catch (error) {
        console.error('❌ Error in scheduler listener:', error)
      }
    })
  }

  // Get scheduler status
  getStatus() {
    return {
      running: this.intervalId !== null,
      enabled: this.config.enabled,
      intervalMs: this.config.intervalMs,
      listenersCount: this.listeners.length
    }
  }

  // Update configuration
  updateConfig(newConfig: Partial<SchedulerConfig>) {
    this.config = { ...this.config, ...newConfig }
    
    if (this.config.enabled && this.intervalId) {
      // Restart with new interval
      this.stop()
      this.start()
    }
  }
}

// Singleton instance
export const schedulerService = new SchedulerService()

// Export for testing
export { SchedulerService }
