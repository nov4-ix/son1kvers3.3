/**
 * Token Pool Service
 * Manages token distribution, rotation, and optimization
 */

import { PrismaClient } from '@prisma/client';
import { EventEmitter } from 'events';
import Redis from 'ioredis';
import {
  generateSecureToken,
  sanitizeForLogging,
  ErrorFactory,
  RATE_LIMITS
} from '@son1kvers3/shared-utils';

export interface TokenPoolConfig {
  minTokens: number;
  maxTokens: number;
  rotationInterval: number;
  healthCheckInterval: number;
  maxRetries: number;
  retryDelay: number;
}

export interface TokenDistribution {
  total: number;
  byTier: Record<string, number>;
  byStatus: Record<string, number>;
  averageUsage: number;
  rotationEfficiency: number;
}

export interface PoolOptimization {
  recommendations: string[];
  actions: Array<{
    type: 'add' | 'remove' | 'rotate' | 'update';
    tokenId?: string;
    reason: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  metrics: {
    efficiency: number;
    utilization: number;
    healthScore: number;
  };
}

export class TokenPoolService extends EventEmitter {
  private redis?: Redis;
  private optimizationInterval?: NodeJS.Timeout;
  private rotationInterval?: NodeJS.Timeout;
  private config: TokenPoolConfig;

  constructor(private prisma: PrismaClient, private tokenManager: any) {
    super();

    this.config = {
      minTokens: parseInt(process.env.MIN_TOKENS || '5'),
      maxTokens: parseInt(process.env.MAX_TOKENS || '100'),
      rotationInterval: parseInt(process.env.ROTATION_INTERVAL || '300000'), // 5 minutes
      healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '60000'), // 1 minute
      maxRetries: 3,
      retryDelay: 1000
    };

    this.initializeRedis();
    this.initializeOptimization();
    this.initializeRotation();
  }

  /**
   * Initialize Redis connection
   */
  private async initializeRedis() {
    if (process.env.REDIS_URL) {
      this.redis = new Redis(process.env.REDIS_URL);

      this.redis.on('error', (error) => {
        console.error('Redis connection error:', error);
      });

      this.redis.on('connect', () => {
        console.log('Token pool Redis connected');
      });
    }
  }

  /**
   * Initialize optimization scheduler
   */
  private initializeOptimization() {
    this.optimizationInterval = setInterval(async () => {
      await this.performOptimization();
    }, this.config.healthCheckInterval);
  }

  /**
   * Initialize token rotation scheduler
   */
  private initializeRotation() {
    this.rotationInterval = setInterval(async () => {
      await this.rotateTokens();
    }, this.config.rotationInterval);
  }

  /**
   * Initialize token pool
   */
  async initialize(): Promise<void> {
    try {
      console.log('Initializing token pool...');

      // Check current pool size
      const currentTokens = await this.prisma.token.count({
        where: { isActive: true, isValid: true }
      });

      console.log(`Current active tokens: ${currentTokens}`);

      if (currentTokens < this.config.minTokens) {
        console.log(`Pool below minimum (${this.config.minTokens}). Need to add more tokens.`);
        this.emit('poolLow', { current: currentTokens, minimum: this.config.minTokens });
      }

      if (currentTokens > this.config.maxTokens) {
        console.log(`Pool above maximum (${this.config.maxTokens}). Need to remove excess tokens.`);
        await this.removeExcessTokens(currentTokens - this.config.maxTokens);
      }

      // Perform initial optimization
      await this.performOptimization();

      console.log('Token pool initialized successfully');
    } catch (error) {
      console.error('Failed to initialize token pool:', error);
      throw ErrorFactory.fromUnknown(error, 'Token pool initialization failed');
    }
  }

  /**
   * Get pool size
   */
  async getPoolSize(): Promise<number> {
    try {
      return await this.prisma.token.count({
        where: { isActive: true, isValid: true }
      });
    } catch (error) {
      return 0;
    }
  }

  /**
   * Get token distribution statistics
   */
  async getTokenDistribution(): Promise<TokenDistribution> {
    try {
      const [
        total,
        byTier,
        byStatus,
        usageStats
      ] = await Promise.all([
        this.prisma.token.count(),
        this.prisma.token.groupBy({
          by: ['tier'],
          _count: { id: true }
        }),
        this.prisma.token.groupBy({
          by: ['isActive', 'isValid'],
          _count: { id: true }
        }),
        this.prisma.token.aggregate({
          _avg: { usageCount: true }
        })
      ]);

      const tierDistribution = byTier.reduce((acc, item) => {
        acc[item.tier] = item._count.id;
        return acc;
      }, {} as Record<string, number>);

      const statusDistribution = byStatus.reduce((acc, item) => {
        const status = `${item.isActive ? 'active' : 'inactive'}_${item.isValid ? 'valid' : 'invalid'}`;
        acc[status] = item._count.id;
        return acc;
      }, {} as Record<string, number>);

      // Calculate rotation efficiency (simplified)
      const rotationEfficiency = await this.calculateRotationEfficiency();

      return {
        total,
        byTier: tierDistribution,
        byStatus: statusDistribution,
        averageUsage: usageStats._avg.usageCount || 0,
        rotationEfficiency
      };
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get token distribution');
    }
  }

  /**
   * Calculate rotation efficiency
   */
  private async calculateRotationEfficiency(): Promise<number> {
    try {
      // Get recent usage patterns
      const recentUsage = await this.prisma.tokenUsage.findMany({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        orderBy: { timestamp: 'desc' },
        take: 1000
      });

      if (recentUsage.length === 0) return 1.0;

      // Calculate efficiency based on response times and success rates
      const avgResponseTime = recentUsage.reduce((sum, usage) => sum + usage.responseTime, 0) / recentUsage.length;
      const successRate = recentUsage.filter(usage => usage.statusCode >= 200 && usage.statusCode < 300).length / recentUsage.length;

      // Efficiency score (0-1, higher is better)
      const efficiency = Math.max(0, Math.min(1, (successRate * 0.7) + ((1000 / Math.max(avgResponseTime, 1)) * 0.3)));

      return efficiency;
    } catch (error) {
      return 0.5; // Default efficiency
    }
  }

  /**
   * Optimize token pool
   */
  async performOptimization(): Promise<PoolOptimization> {
    try {
      const distribution = await this.getTokenDistribution();
      const recommendations: string[] = [];
      const actions: PoolOptimization['actions'] = [];
      let efficiency = distribution.rotationEfficiency;
      let utilization = distribution.total > 0 ? (distribution.byStatus.active_valid || 0) / distribution.total : 0;
      let healthScore = efficiency * utilization;

      // Check if pool needs more tokens
      if (distribution.total < this.config.minTokens) {
        recommendations.push(`Add ${this.config.minTokens - distribution.total} more tokens to meet minimum requirements`);
        actions.push({
          type: 'add',
          reason: 'Pool below minimum threshold',
          priority: 'high'
        });
      }

      // Check if pool has too many tokens
      if (distribution.total > this.config.maxTokens) {
        const excess = distribution.total - this.config.maxTokens;
        recommendations.push(`Remove ${excess} excess tokens to optimize performance`);
        actions.push({
          type: 'remove',
          reason: 'Pool above maximum threshold',
          priority: 'medium'
        });
      }

      // Check token health
      const unhealthyTokens = await this.prisma.token.findMany({
        where: {
          isActive: true,
          isValid: false
        }
      });

      if (unhealthyTokens.length > 0) {
        recommendations.push(`Remove ${unhealthyTokens.length} unhealthy tokens`);
        actions.push({
          type: 'remove',
          reason: 'Unhealthy tokens detected',
          priority: 'high'
        });
      }

      // Check usage distribution
      if (distribution.averageUsage > 100) {
        recommendations.push('Consider adding more tokens due to high usage');
        actions.push({
          type: 'add',
          reason: 'High token usage detected',
          priority: 'medium'
        });
      }

      // Check tier distribution
      const freeTokens = distribution.byTier.FREE || 0;
      const premiumTokens = distribution.byTier.PREMIUM || 0;
      const enterpriseTokens = distribution.byTier.ENTERPRISE || 0;

      if (freeTokens > (premiumTokens + enterpriseTokens) * 2) {
        recommendations.push('Consider upgrading token tiers for better performance');
        actions.push({
          type: 'update',
          reason: 'Imbalanced tier distribution',
          priority: 'low'
        });
      }

      return {
        recommendations,
        actions,
        metrics: {
          efficiency,
          utilization,
          healthScore
        }
      };
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Pool optimization failed');
    }
  }

  /**
   * Rotate tokens based on usage patterns
   */
  async rotateTokens(): Promise<void> {
    try {
      // Get tokens ordered by usage (least used first)
      const tokensToRotate = await this.prisma.token.findMany({
        where: {
          isActive: true,
          isValid: true,
          usageCount: {
            gt: 0
          }
        },
        orderBy: { usageCount: 'asc' },
        take: Math.min(5, this.config.maxTokens / 10) // Rotate 10% of tokens or max 5
      });

      for (const token of tokensToRotate) {
        // Reset usage count to give token a break
        await this.prisma.token.update({
          where: { id: token.id },
          data: {
            usageCount: 0,
            lastUsed: null,
            updatedAt: new Date()
          }
        });

        console.log(`Rotated token ${token.id}`);
      }

      if (tokensToRotate.length > 0) {
        this.emit('tokensRotated', { count: tokensToRotate.length });
      }
    } catch (error) {
      console.error('Token rotation failed:', error);
    }
  }

  /**
   * Remove excess tokens
   */
  private async removeExcessTokens(excessCount: number): Promise<void> {
    try {
      // Remove tokens with highest usage first (most stressed)
      const tokensToRemove = await this.prisma.token.findMany({
        where: {
          isActive: true,
          isValid: true
        },
        orderBy: { usageCount: 'desc' },
        take: excessCount
      });

      for (const token of tokensToRemove) {
        await this.tokenManager.removeToken(token.id);
      }

      console.log(`Removed ${tokensToRemove.length} excess tokens`);
    } catch (error) {
      console.error('Failed to remove excess tokens:', error);
    }
  }

  /**
   * Add tokens to pool (placeholder - implement based on your token source)
   */
  async addTokensToPool(count: number, tier: 'FREE' | 'PREMIUM' | 'ENTERPRISE' = 'FREE'): Promise<number> {
    try {
      let addedCount = 0;

      // This is a placeholder implementation
      // In a real system, you would:
      // 1. Get tokens from your token harvesting system
      // 2. Validate them with the target API
      // 3. Add them to the pool

      for (let i = 0; i < count; i++) {
        try {
          // Generate a placeholder token (replace with real token acquisition)
          const placeholderToken = generateSecureToken(64);

          await this.tokenManager.addToken(
            placeholderToken,
            undefined, // No specific user
            undefined, // No email
            tier,
            {
              source: 'pool_management',
              addedBy: 'system',
              addedAt: new Date()
            }
          );

          addedCount++;
        } catch (error) {
          console.error(`Failed to add token ${i + 1}:`, error);
        }
      }

      this.emit('tokensAdded', { count: addedCount, tier });

      return addedCount;
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to add tokens to pool');
    }
  }

  /**
   * Get pool health status
   */
  async getPoolHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    score: number;
    issues: string[];
    recommendations: string[];
  }> {
    try {
      const distribution = await this.getTokenDistribution();
      const optimization = await this.performOptimization();

      const issues: string[] = [];
      const recommendations: string[] = optimization.recommendations;

      // Determine health status
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      let score = optimization.metrics.healthScore;

      if (score < 0.5) {
        status = 'unhealthy';
        issues.push('Low health score');
      } else if (score < 0.8) {
        status = 'degraded';
        issues.push('Degraded performance');
      }

      // Check specific issues
      if (distribution.total < this.config.minTokens) {
        issues.push('Insufficient tokens');
        status = 'unhealthy';
      }

      if (distribution.byStatus.active_valid < 3) {
        issues.push('Too few healthy tokens');
        status = 'unhealthy';
      }

      if (distribution.rotationEfficiency < 0.7) {
        issues.push('Poor rotation efficiency');
      }

      return {
        status,
        score,
        issues,
        recommendations
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        score: 0,
        issues: ['Failed to check pool health'],
        recommendations: ['Check system logs for errors']
      };
    }
  }

  /**
   * Get token usage analytics
   */
  async getUsageAnalytics(timeframe: 'hour' | 'day' | 'week' | 'month' = 'day'): Promise<{
    totalRequests: number;
    successRate: number;
    averageResponseTime: number;
    peakUsage: number;
    tokensUsed: number;
    errors: number;
  }> {
    try {
      const timeframeMs = this.getTimeframeMs(timeframe);

      const usage = await this.prisma.tokenUsage.findMany({
        where: {
          timestamp: {
            gte: new Date(Date.now() - timeframeMs)
          }
        }
      });

      const totalRequests = usage.length;
      const successfulRequests = usage.filter(u => u.statusCode >= 200 && u.statusCode < 300).length;
      const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100;
      const averageResponseTime = totalRequests > 0
        ? usage.reduce((sum, u) => sum + u.responseTime, 0) / totalRequests
        : 0;
      const errors = usage.filter(u => u.error).length;

      // Get unique tokens used
      const tokensUsed = new Set(usage.map(u => u.tokenId)).size;

      // Calculate peak usage (requests per minute during peak hour)
      const peakUsage = await this.calculatePeakUsage(timeframeMs);

      return {
        totalRequests,
        successRate,
        averageResponseTime,
        peakUsage,
        tokensUsed,
        errors
      };
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get usage analytics');
    }
  }

  /**
   * Calculate peak usage
   */
  private async calculatePeakUsage(timeframeMs: number): Promise<number> {
    try {
      const intervals = Math.ceil(timeframeMs / 60000); // 1-minute intervals

      let maxRequests = 0;

      for (let i = 0; i < intervals; i++) {
        const intervalStart = new Date(Date.now() - timeframeMs + (i * 60000));
        const intervalEnd = new Date(intervalStart.getTime() + 60000);

        const requests = await this.prisma.tokenUsage.count({
          where: {
            timestamp: {
              gte: intervalStart,
              lt: intervalEnd
            }
          }
        });

        maxRequests = Math.max(maxRequests, requests);
      }

      return maxRequests;
    } catch (error) {
      return 0;
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
   * Force pool rebalancing
   */
  async rebalancePool(): Promise<{
    actions: string[];
    tokensAdded: number;
    tokensRemoved: number;
    optimization: PoolOptimization;
  }> {
    try {
      const actions: string[] = [];
      let tokensAdded = 0;
      let tokensRemoved = 0;

      // Get current optimization recommendations
      const optimization = await this.performOptimization();

      // Execute high-priority actions
      for (const action of optimization.actions.filter(a => a.priority === 'high')) {
        switch (action.type) {
          case 'add':
            const added = await this.addTokensToPool(1);
            tokensAdded += added;
            actions.push(`Added ${added} tokens`);
            break;

          case 'remove':
            // Remove unhealthy tokens
            const unhealthyTokens = await this.prisma.token.findMany({
              where: { isValid: false, isActive: true },
              take: 5
            });

            for (const token of unhealthyTokens) {
              await this.tokenManager.removeToken(token.id);
              tokensRemoved++;
            }
            actions.push(`Removed ${unhealthyTokens.length} unhealthy tokens`);
            break;
        }
      }

      return {
        actions,
        tokensAdded,
        tokensRemoved,
        optimization
      };
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Pool rebalancing failed');
    }
  }

  /**
   * Get pool performance metrics
   */
  async getPerformanceMetrics(): Promise<{
    throughput: number;
    latency: number;
    errorRate: number;
    availability: number;
    utilization: number;
  }> {
    try {
      const analytics = await this.getUsageAnalytics('hour');

      // Calculate metrics
      const throughput = analytics.totalRequests; // requests per hour
      const latency = analytics.averageResponseTime;
      const errorRate = analytics.totalRequests > 0 ? (analytics.errors / analytics.totalRequests) * 100 : 0;
      const availability = analytics.successRate;
      const utilization = (analytics.tokensUsed / Math.max(await this.getPoolSize(), 1)) * 100;

      return {
        throughput,
        latency,
        errorRate,
        availability,
        utilization
      };
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get performance metrics');
    }
  }

  /**
   * Export pool data for backup
   */
  async exportPoolData(): Promise<{
    tokens: any[];
    usage: any[];
    extensions: any[];
    exportedAt: Date;
  }> {
    try {
      const [tokens, usage, extensions] = await Promise.all([
        this.prisma.token.findMany({
          where: { isActive: true },
          select: {
            id: true,
            hash: true,
            tier: true,
            usageCount: true,
            rateLimit: true,
            createdAt: true,
            updatedAt: true,
            metadata: true
          }
        }),
        this.prisma.tokenUsage.findMany({
          orderBy: { timestamp: 'desc' },
          take: 10000
        }),
        this.prisma.userExtension.findMany({
          where: { isActive: true }
        })
      ]);

      return {
        tokens,
        usage,
        extensions,
        exportedAt: new Date()
      };
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to export pool data');
    }
  }

  /**
   * Close service and cleanup
   */
  async close() {
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
    }

    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }

    if (this.redis) {
      await this.redis.quit();
    }

    this.removeAllListeners();
  }
}
