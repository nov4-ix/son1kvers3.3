import { autoPublisherEngine } from '@/engine/autoPublisher'

export const scheduler = {
  intervalId: null as NodeJS.Timeout | null,
  isRunning: false,
  userId: null as string | null,
  stats: {
    totalRuns: 0,
    successfulRuns: 0,
    failedRuns: 0,
    lastRun: null as Date | null,
  },
  recentlyPublished: [] as string[],

  start(userId: string) {
    if (this.isRunning) return

    this.userId = userId
    this.isRunning = true

    // Run every 30 seconds
    this.intervalId = setInterval(async () => {
      try {
        const result = await autoPublisherEngine.runAutoPublisher()
        this.stats.totalRuns++
        this.stats.successfulRuns++
        this.stats.lastRun = new Date()

        if (result.published > 0) {
          this.recentlyPublished.push(...result.publishedPosts)
        }
      } catch (error) {
        console.error('Scheduler error:', error)
        this.stats.totalRuns++
        this.stats.failedRuns++
      }
    }, 30000)
  },

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
    this.userId = null
  },

  getStatus() {
    return {
      running: this.isRunning,
      userId: this.userId,
      stats: this.stats,
      recentlyPublished: this.recentlyPublished,
      intervalMs: 30000,
    }
  },

  runJobManually() {
    return autoPublisherEngine.runAutoPublisher()
  },

  updateConfig(config: { intervalMs?: number }) {
    // Mock config update
    console.log('Config updated:', config)
  },

  resetStats() {
    this.stats = {
      totalRuns: 0,
      successfulRuns: 0,
      failedRuns: 0,
      lastRun: null,
    }
    this.recentlyPublished = []
  },

  clearRecentlyPublished() {
    this.recentlyPublished = []
  },
}