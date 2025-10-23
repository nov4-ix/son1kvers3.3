/**
 * Analytics Service
 * Tracks user behavior, system metrics, and business intelligence
 */

import { PrismaClient } from '@prisma/client';
import { EventEmitter } from 'events';
import Redis from 'ioredis';
import {
  generateSecureToken,
  sanitizeForLogging,
  ErrorFactory,
  ANALYTICS
} from '@son1kvers3/shared-utils';

export interface UserActivity {
  userId: string;
  action: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface SystemMetrics {
  activeUsers: number;
  totalUsers: number;
  generationsToday: number;
  averageGenerationTime: number;
  errorRate: number;
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface GenerationAnalytics {
  totalGenerations: number;
  successfulGenerations: number;
  failedGenerations: number;
  averageDuration: number;
  popularGenres: Array<{ genre: string; count: number }>;
  popularMoods: Array<{ mood: string; count: number }>;
  popularKeys: Array<{ key: string; count: number }>;
  peakHours: Array<{ hour: number; count: number }>;
}

export interface UserEngagement {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionDuration: number;
  bounceRate: number;
  retentionRate: number;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
  conversionRate: number;
  churnRate: number;
  lifetimeValue: number;
}

export class AnalyticsService extends EventEmitter {
  private redis?: Redis;
  private batchBuffer: UserActivity[] = [];
  private flushInterval?: NodeJS.Timeout;
  private metricsCache: Map<string, any> = new Map();

  constructor(private prisma: PrismaClient) {
    super();

    this.initializeRedis();
    this.initializeBatchFlush();
    this.initializeMetricsCache();
  }

  /**
   * Initialize Redis connection
   */
  private async initializeRedis() {
    if (process.env.REDIS_URL) {
      this.redis = new Redis(process.env.REDIS_URL);

      this.redis.on('error', (error) => {
        console.error('Analytics Redis error:', error);
      });
    }
  }

  /**
   * Initialize batch processing
   */
  private initializeBatchFlush() {
    this.flushInterval = setInterval(async () => {
      await this.flushBatch();
    }, ANALYTICS.FLUSH_INTERVAL);
  }

  /**
   * Initialize metrics cache
   */
  private initializeMetricsCache() {
    // Refresh cache every 5 minutes
    setInterval(() => {
      this.refreshMetricsCache();
    }, 300000);
  }

  /**
   * Track user activity
   */
  async trackActivity(activity: UserActivity): Promise<void> {
    try {
      // Add to batch buffer
      this.batchBuffer.push(activity);

      // Flush if buffer is full
      if (this.batchBuffer.length >= ANALYTICS.BATCH_SIZE) {
        await this.flushBatch();
      }

      // Cache real-time metrics
      await this.updateRealTimeMetrics(activity);

      this.emit('activityTracked', activity);

    } catch (error) {
      console.error('Failed to track activity:', error);
    }
  }

  /**
   * Track generation request
   */
  async trackGeneration(userId: string, generationData: {
    prompt: string;
    parameters: any;
    duration: number;
    success: boolean;
    error?: string;
  }): Promise<void> {
    await this.trackActivity({
      userId,
      action: generationData.success ? 'generation_success' : 'generation_failed',
      metadata: {
        prompt: generationData.prompt,
        parameters: generationData.parameters,
        duration: generationData.duration,
        error: generationData.error
      },
      timestamp: new Date()
    });
  }

  /**
   * Track user registration
   */
  async trackUserRegistration(userId: string, source: string = 'unknown'): Promise<void> {
    await this.trackActivity({
      userId,
      action: 'user_registered',
      metadata: { source },
      timestamp: new Date()
    });
  }

  /**
   * Track user login
   */
  async trackUserLogin(userId: string, method: string = 'email'): Promise<void> {
    await this.trackActivity({
      userId,
      action: 'user_login',
      metadata: { method },
      timestamp: new Date()
    });
  }

  /**
   * Track feature usage
   */
  async trackFeatureUsage(userId: string, feature: string, metadata?: Record<string, any>): Promise<void> {
    await this.trackActivity({
      userId,
      action: 'feature_used',
      metadata: { feature, ...metadata },
      timestamp: new Date()
    });
  }

  /**
   * Track API request
   */
  async trackRequest(requestData: {
    userId?: string;
    endpoint: string;
    method: string;
    statusCode: number;
    duration: number;
    timestamp: Date;
  }): Promise<void> {
    await this.trackActivity({
      userId: requestData.userId || 'anonymous',
      action: 'api_request',
      metadata: {
        endpoint: requestData.endpoint,
        method: requestData.method,
        statusCode: requestData.statusCode,
        duration: requestData.duration
      },
      timestamp: requestData.timestamp
    });
  }

  /**
   * Get system metrics
   */
  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      // Check cache first
      const cached = this.metricsCache.get('system_metrics');
      if (cached && Date.now() - cached.timestamp < 60000) {
        return cached.data;
      }

      const [
        activeUsers,
        totalUsers,
        generationsToday,
        averageGenerationTime,
        errorRate,
        uptime
      ] = await Promise.all([
        this.getActiveUserCount(),
        this.prisma.user.count(),
        this.getGenerationsToday(),
        this.getAverageGenerationTime(),
        this.getErrorRate(),
        Promise.resolve(process.uptime())
      ]);

      const metrics: SystemMetrics = {
        activeUsers,
        totalUsers,
        generationsToday,
        averageGenerationTime,
        errorRate,
        uptime,
        memoryUsage: process.memoryUsage().heapUsed,
        cpuUsage: process.cpuUsage().user
      };

      // Cache metrics
      this.metricsCache.set('system_metrics', {
        data: metrics,
        timestamp: Date.now()
      });

      return metrics;
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get system metrics');
    }
  }

  /**
   * Get generation analytics
   */
  async getGenerationAnalytics(timeframe: 'day' | 'week' | 'month' = 'week'): Promise<GenerationAnalytics> {
    try {
      const cached = this.metricsCache.get(`generation_analytics_${timeframe}`);
      if (cached && Date.now() - cached.timestamp < 300000) {
        return cached.data;
      }

      const timeframeMs = this.getTimeframeMs(timeframe);

      // Get generation data
      const generations = await this.prisma.generation.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - timeframeMs)
          }
        }
      });

      const totalGenerations = generations.length;
      const successfulGenerations = generations.filter(g => g.status === 'COMPLETED').length;
      const failedGenerations = generations.filter(g => g.status === 'FAILED').length;

      // Calculate average duration
      const completedGenerations = generations.filter(g => g.completedAt);
      const averageDuration = completedGenerations.length > 0
        ? completedGenerations.reduce((sum, g) => {
            return sum + (g.completedAt!.getTime() - g.createdAt.getTime());
          }, 0) / completedGenerations.length / 1000 // Convert to seconds
        : 0;

      // Analyze popular genres, moods, keys
      const genreCounts: Record<string, number> = {};
      const moodCounts: Record<string, number> = {};
      const keyCounts: Record<string, number> = {};
      const hourCounts: Record<number, number> = {};

      for (const generation of generations) {
        const params = generation.parameters as any;

        if (params?.genre) {
          genreCounts[params.genre] = (genreCounts[params.genre] || 0) + 1;
        }

        if (params?.mood) {
          moodCounts[params.mood] = (moodCounts[params.mood] || 0) + 1;
        }

        if (params?.key) {
          keyCounts[params.key] = (keyCounts[params.key] || 0) + 1;
        }

        const hour = generation.createdAt.getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }

      const popularGenres = Object.entries(genreCounts)
        .map(([genre, count]) => ({ genre, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const popularMoods = Object.entries(moodCounts)
        .map(([mood, count]) => ({ mood, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const popularKeys = Object.entries(keyCounts)
        .map(([key, count]) => ({ key, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const peakHours = Object.entries(hourCounts)
        .map(([hour, count]) => ({ hour: parseInt(hour), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const analytics: GenerationAnalytics = {
        totalGenerations,
        successfulGenerations,
        failedGenerations,
        averageDuration,
        popularGenres,
        popularMoods,
        popularKeys,
        peakHours
      };

      // Cache analytics
      this.metricsCache.set(`generation_analytics_${timeframe}`, {
        data: analytics,
        timestamp: Date.now()
      });

      return analytics;
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get generation analytics');
    }
  }

  /**
   * Get user engagement metrics
   */
  async getUserEngagement(timeframe: 'day' | 'week' | 'month' = 'week'): Promise<UserEngagement> {
    try {
      const timeframeMs = this.getTimeframeMs(timeframe);

      // Get user activity data
      const activities = await this.prisma.userAnalytics.findMany({
        where: {
          timestamp: {
            gte: new Date(Date.now() - timeframeMs)
          }
        }
      });

      // Calculate unique users
      const uniqueUsers = new Set(activities.map(a => a.userId));
      const dailyActiveUsers = uniqueUsers.size;

      // Calculate session durations (simplified)
      const sessions = this.groupActivitiesBySession(activities);
      const averageSessionDuration = sessions.length > 0
        ? sessions.reduce((sum, session) => sum + session.duration, 0) / sessions.length
        : 0;

      // Calculate bounce rate (sessions with only one activity)
      const bouncedSessions = sessions.filter(s => s.activities.length === 1).length;
      const bounceRate = sessions.length > 0 ? (bouncedSessions / sessions.length) * 100 : 0;

      // Calculate retention (simplified - users active in last 7 days vs 30 days)
      const retentionRate = await this.calculateRetentionRate(timeframeMs);

      return {
        dailyActiveUsers,
        weeklyActiveUsers: timeframe === 'week' ? dailyActiveUsers : 0,
        monthlyActiveUsers: timeframe === 'month' ? dailyActiveUsers : 0,
        averageSessionDuration,
        bounceRate,
        retentionRate
      };
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get user engagement');
    }
  }

  /**
   * Get revenue analytics
   */
  async getRevenueAnalytics(timeframe: 'month' | 'quarter' | 'year' = 'month'): Promise<RevenueAnalytics> {
    try {
      const timeframeMs = this.getTimeframeMs(timeframe);

      // Get subscription data
      const subscriptions = await this.prisma.subscription.findMany({
        where: {
          status: 'ACTIVE',
          createdAt: {
            gte: new Date(Date.now() - timeframeMs)
          }
        },
        include: { user: true }
      });

      const totalRevenue = subscriptions.reduce((sum, sub) => {
        // Calculate revenue based on tier (simplified)
        const tierPrices = { FREE: 0, PREMIUM: 9.99, ENTERPRISE: 29.99 };
        return sum + (tierPrices[sub.tier] || 0);
      }, 0);

      const monthlyRecurringRevenue = totalRevenue;
      const averageRevenuePerUser = subscriptions.length > 0 ? totalRevenue / subscriptions.length : 0;

      // Calculate conversion rate (simplified)
      const totalUsers = await this.prisma.user.count();
      const conversionRate = totalUsers > 0 ? (subscriptions.length / totalUsers) * 100 : 0;

      // Calculate churn rate (simplified)
      const churnRate = await this.calculateChurnRate(timeframeMs);

      // Calculate lifetime value (simplified)
      const lifetimeValue = averageRevenuePerUser * 12; // Assume 1 year retention

      return {
        totalRevenue,
        monthlyRecurringRevenue,
        averageRevenuePerUser,
        conversionRate,
        churnRate,
        lifetimeValue
      };
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get revenue analytics');
    }
  }

  /**
   * Get active user count
   */
  async getActiveUserCount(timeframe: number = 3600000): Promise<number> {
    try {
      const cutoff = new Date(Date.now() - timeframe);

      const activeUsers = await this.prisma.userAnalytics.findMany({
        where: {
          timestamp: {
            gte: cutoff
          }
        },
        select: { userId: true },
        distinct: ['userId']
      });

      return activeUsers.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get generations today
   */
  private async getGenerationsToday(): Promise<number> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return await this.prisma.generation.count({
        where: {
          createdAt: {
            gte: today
          }
        }
      });
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get average generation time
   */
  private async getAverageGenerationTime(): Promise<number> {
    try {
      const completedGenerations = await this.prisma.generation.findMany({
        where: {
          status: 'COMPLETED',
          completedAt: {
            not: null
          }
        },
        take: 100
      });

      if (completedGenerations.length === 0) return 0;

      const totalTime = completedGenerations.reduce((sum, gen) => {
        return sum + (gen.completedAt!.getTime() - gen.createdAt.getTime());
      }, 0);

      return totalTime / completedGenerations.length / 1000; // Convert to seconds
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get error rate
   */
  private async getErrorRate(): Promise<number> {
    try {
      const recentActivities = await this.prisma.userAnalytics.findMany({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      });

      const errorActivities = recentActivities.filter(a =>
        a.actionType.includes('error') || a.actionType.includes('failed')
      );

      return recentActivities.length > 0 ? (errorActivities.length / recentActivities.length) * 100 : 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Group activities by session
   */
  private groupActivitiesBySession(activities: any[]): Array<{ activities: any[]; duration: number }> {
    const sessions: Array<{ activities: any[]; duration: number }> = [];
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes

    let currentSession: any[] = [];
    let sessionStart = 0;

    for (const activity of activities.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())) {
      if (currentSession.length === 0) {
        currentSession = [activity];
        sessionStart = activity.timestamp.getTime();
      } else {
        const lastActivity = currentSession[currentSession.length - 1];
        const timeDiff = activity.timestamp.getTime() - lastActivity.timestamp.getTime();

        if (timeDiff > sessionTimeout) {
          // End current session and start new one
          sessions.push({
            activities: currentSession,
            duration: lastActivity.timestamp.getTime() - sessionStart
          });

          currentSession = [activity];
          sessionStart = activity.timestamp.getTime();
        } else {
          currentSession.push(activity);
        }
      }
    }

    // Add last session
    if (currentSession.length > 0) {
      const lastActivity = currentSession[currentSession.length - 1];
      sessions.push({
        activities: currentSession,
        duration: lastActivity.timestamp.getTime() - sessionStart
      });
    }

    return sessions;
  }

  /**
   * Calculate retention rate
   */
  private async calculateRetentionRate(timeframeMs: number): Promise<number> {
    try {
      const now = new Date();
      const periodStart = new Date(now.getTime() - timeframeMs);
      const previousPeriodStart = new Date(periodStart.getTime() - timeframeMs);

      // Users active in current period
      const currentPeriodUsers = await this.prisma.userAnalytics.findMany({
        where: {
          timestamp: {
            gte: periodStart,
            lte: now
          }
        },
        select: { userId: true },
        distinct: ['userId']
      });

      // Users active in previous period
      const previousPeriodUsers = await this.prisma.userAnalytics.findMany({
        where: {
          timestamp: {
            gte: previousPeriodStart,
            lte: periodStart
          }
        },
        select: { userId: true },
        distinct: ['userId']
      });

      // Users active in both periods (retained)
      const retainedUsers = currentPeriodUsers.filter(current =>
        previousPeriodUsers.some(previous => previous.userId === current.userId)
      );

      return previousPeriodUsers.length > 0 ? (retainedUsers.length / previousPeriodUsers.length) * 100 : 100;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Calculate churn rate
   */
  private async calculateChurnRate(timeframeMs: number): Promise<number> {
    try {
      const retentionRate = await this.calculateRetentionRate(timeframeMs);
      return Math.max(0, 100 - retentionRate);
    } catch (error) {
      return 0;
    }
  }

  /**
   * Update real-time metrics
   */
  private async updateRealTimeMetrics(activity: UserActivity) {
    try {
      if (this.redis) {
        const key = `realtime:${activity.action}`;
        await this.redis.incr(key);
        await this.redis.expire(key, 3600); // 1 hour
      }
    } catch (error) {
      // Ignore Redis errors for real-time metrics
    }
  }

  /**
   * Flush batch to database
   */
  private async flushBatch(): Promise<void> {
    if (this.batchBuffer.length === 0) return;

    try {
      const batch = [...this.batchBuffer];
      this.batchBuffer = [];

      // Insert batch to database
      await this.prisma.userAnalytics.createMany({
        data: batch.map(activity => ({
          userId: activity.userId,
          actionType: activity.action,
          metadata: activity.metadata,
          timestamp: activity.timestamp
        })),
        skipDuplicates: true
      });

      this.emit('batchFlushed', { count: batch.length });

    } catch (error) {
      console.error('Failed to flush analytics batch:', error);
      // Put activities back in buffer for retry
      this.batchBuffer.unshift(...this.batchBuffer);
    }
  }

  /**
   * Refresh metrics cache
   */
  private async refreshMetricsCache() {
    try {
      // Clear old cache entries
      for (const [key, value] of this.metricsCache.entries()) {
        if (Date.now() - (value as any).timestamp > 3600000) { // 1 hour
          this.metricsCache.delete(key);
        }
      }
    } catch (error) {
      console.error('Failed to refresh metrics cache:', error);
    }
  }

  /**
   * Get timeframe in milliseconds
   */
  private getTimeframeMs(timeframe: 'hour' | 'day' | 'week' | 'month'): number {
    switch (timeframe) {
      case 'hour': return 60 * 60 * 1000;
      case 'day': return 24 * 60 * 60 * 1000;
      case 'week': return 7 * 24 * 60 * 60 * 1000;
      case 'month': return 30 * 24 * 60 * 60 * 1000;
      default: return 24 * 60 * 60 * 1000;
    }
  }

  /**
   * Get user activity history
   */
  async getUserActivityHistory(userId: string, limit: number = 100): Promise<any[]> {
    try {
      return await this.prisma.userAnalytics.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: limit
      });
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get user activity history');
    }
  }

  /**
   * Get popular features
   */
  async getPopularFeatures(timeframe: 'day' | 'week' | 'month' = 'week'): Promise<Array<{ feature: string; count: number }>> {
    try {
      const timeframeMs = this.getTimeframeMs(timeframe);

      const activities = await this.prisma.userAnalytics.findMany({
        where: {
          actionType: 'feature_used',
          timestamp: {
            gte: new Date(Date.now() - timeframeMs)
          }
        }
      });

      const featureCounts: Record<string, number> = {};

      for (const activity of activities) {
        const feature = (activity.metadata as any)?.feature;
        if (feature) {
          featureCounts[feature] = (featureCounts[feature] || 0) + 1;
        }
      }

      return Object.entries(featureCounts)
        .map(([feature, count]) => ({ feature, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get popular features');
    }
  }

  /**
   * Export analytics data
   */
  async exportAnalytics(timeframe: 'day' | 'week' | 'month' = 'month'): Promise<{
    systemMetrics: SystemMetrics;
    generationAnalytics: GenerationAnalytics;
    userEngagement: UserEngagement;
    revenueAnalytics: RevenueAnalytics;
    popularFeatures: Array<{ feature: string; count: number }>;
    exportedAt: Date;
  }> {
    try {
      const [
        systemMetrics,
        generationAnalytics,
        userEngagement,
        revenueAnalytics,
        popularFeatures
      ] = await Promise.all([
        this.getSystemMetrics(),
        this.getGenerationAnalytics(timeframe),
        this.getUserEngagement(timeframe),
        this.getRevenueAnalytics(timeframe),
        this.getPopularFeatures(timeframe)
      ]);

      return {
        systemMetrics,
        generationAnalytics,
        userEngagement,
        revenueAnalytics,
        popularFeatures,
        exportedAt: new Date()
      };
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to export analytics');
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return this.batchBuffer.length >= 0; // Always healthy
    } catch (error) {
      return false;
    }
  }

  /**
   * Close service and cleanup
   */
  async close() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }

    // Flush remaining batch
    await this.flushBatch();

    if (this.redis) {
      await this.redis.quit();
    }

    this.metricsCache.clear();
    this.removeAllListeners();
  }
}
