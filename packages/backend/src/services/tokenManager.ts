/**
 * Advanced Token Management Service
 * Handles token harvesting, rotation, and optimization for Suno API
 */

import { PrismaClient } from '@prisma/client';
import axios, { AxiosInstance } from 'axios';
import Redis from 'ioredis';
import { EventEmitter } from 'events';
import {
  generateSecureToken,
  generateAPIKey,
  hashForLogging,
  sanitizeForLogging,
  RateLimiter,
  ValidationError,
  ErrorFactory
} from '@son1kvers3/shared-utils';

export interface TokenInfo {
  id: string;
  hash: string;
  userId?: string;
  email?: string;
  isActive: boolean;
  isValid: boolean;
  lastUsed?: Date;
  usageCount: number;
  rateLimit: number;
  tier: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  expiresAt?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenUsage {
  tokenId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
  error?: string;
}

export interface TokenPoolStats {
  totalTokens: number;
  activeTokens: number;
  healthyTokens: number;
  averageResponseTime: number;
  totalRequests: number;
  successRate: number;
}

export class TokenManager extends EventEmitter {
  private tokens: Map<string, TokenInfo> = new Map();
  private rateLimiters: Map<string, RateLimiter> = new Map();
  private redis?: Redis;
  private axiosInstances: Map<string, AxiosInstance> = new Map();
  private healthCheckInterval?: NodeJS.Timeout;
  private cleanupInterval?: NodeJS.Timeout;

  constructor(private prisma: PrismaClient) {
    super();

    this.initializeRedis();
    this.initializeHealthCheck();
    this.initializeCleanup();

    // Listen for token events
    this.on('tokenAdded', this.handleTokenAdded.bind(this));
    this.on('tokenRemoved', this.handleTokenRemoved.bind(this));
    this.on('tokenError', this.handleTokenError.bind(this));
  }

  /**
   * Initialize Redis connection for caching
   */
  private async initializeRedis() {
    if (process.env.REDIS_URL) {
      this.redis = new Redis(process.env.REDIS_URL);

      this.redis.on('error', (error) => {
        console.error('Redis connection error:', error);
      });

      this.redis.on('connect', () => {
        console.log('Redis connected successfully');
      });
    }
  }

  /**
   * Initialize health check interval
   */
  private initializeHealthCheck() {
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, 60000); // Every minute
  }

  /**
   * Initialize cleanup interval
   */
  private initializeCleanup() {
    this.cleanupInterval = setInterval(async () => {
      await this.cleanupExpiredTokens();
    }, 3600000); // Every hour
  }

  /**
   * Add a new token to the pool
   */
  async addToken(
    token: string,
    userId?: string,
    email?: string,
    tier: 'FREE' | 'PREMIUM' | 'ENTERPRISE' = 'FREE',
    metadata: Record<string, any> = {}
  ): Promise<string> {
    try {
      // Hash token for security
      const tokenHash = hashForLogging(token);

      // Check if token already exists
      const existingToken = await this.prisma.token.findUnique({
        where: { hash: tokenHash }
      });

      if (existingToken) {
        throw new ValidationError('Token already exists in pool');
      }

      // Validate token with Suno API
      const isValid = await this.validateTokenWithSuno(token);

      // Create token record
      const tokenRecord = await this.prisma.token.create({
        data: {
          hash: tokenHash,
          userId,
          email,
          isActive: true,
          isValid,
          usageCount: 0,
          rateLimit: this.getRateLimitForTier(tier),
          tier,
          metadata,
          expiresAt: tier === 'FREE' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined // 24h for free
        }
      });

      // Create rate limiter for this token
      this.rateLimiters.set(tokenRecord.id, new RateLimiter(
        this.getRateLimitForTier(tier),
        60000 // 1 minute window
      ));

      // Cache token info
      this.tokens.set(tokenRecord.id, {
        id: tokenRecord.id,
        hash: tokenHash,
        userId,
        email,
        isActive: true,
        isValid,
        usageCount: 0,
        rateLimit: this.getRateLimitForTier(tier),
        tier,
        metadata,
        createdAt: tokenRecord.createdAt,
        updatedAt: tokenRecord.updatedAt
      });

      // Store original token securely (encrypted)
      if (this.redis) {
        await this.redis.setex(
          `token:${tokenRecord.id}:original`,
          86400, // 24 hours
          this.encryptToken(token)
        );
      }

      this.emit('tokenAdded', { tokenId: tokenRecord.id, tier, userId });

      return tokenRecord.id;
    } catch (error) {
      this.emit('tokenError', { error, operation: 'addToken', userId });
      throw ErrorFactory.fromUnknown(error, 'Failed to add token');
    }
  }

  /**
   * Get a healthy token for API requests
   */
  async getHealthyToken(userId?: string): Promise<{ token: string; tokenId: string } | null> {
    try {
      // Get tokens ordered by health score
      const tokens = await this.getTokensByHealth(userId);

      for (const tokenInfo of tokens) {
        if (!tokenInfo.isActive || !tokenInfo.isValid) continue;

        // Check rate limit
        const rateLimiter = this.rateLimiters.get(tokenInfo.id);
        if (rateLimiter && !rateLimiter.isAllowed(`token:${tokenInfo.id}`)) {
          continue;
        }

        // Get original token
        const originalToken = await this.getOriginalToken(tokenInfo.id);
        if (!originalToken) continue;

        // Update usage
        await this.updateTokenUsage(tokenInfo.id);

        return {
          token: originalToken,
          tokenId: tokenInfo.id
        };
      }

      return null;
    } catch (error) {
      this.emit('tokenError', { error, operation: 'getHealthyToken', userId });
      return null;
    }
  }

  /**
   * Validate token with Suno API
   */
  private async validateTokenWithSuno(token: string): Promise<boolean> {
    try {
      const axiosInstance = this.createAxiosInstance(token);
      const response = await axiosInstance.get('https://api.suno.ai/v1/me', {
        timeout: 10000
      });

      return response.status === 200;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  /**
   * Create axios instance for token
   */
  private createAxiosInstance(token: string): AxiosInstance {
    return axios.create({
      baseURL: 'https://api.suno.ai/v1',
      timeout: 30000,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'SON1KVERS3/2.0'
      }
    });
  }

  /**
   * Get tokens ordered by health score
   */
  private async getTokensByHealth(userId?: string) {
    const where: any = {
      isActive: true,
      isValid: true
    };

    if (userId) {
      where.userId = userId;
    }

    const tokens = await this.prisma.token.findMany({
      where,
      orderBy: [
        { usageCount: 'asc' }, // Prefer less used tokens
        { updatedAt: 'desc' }  // Prefer recently updated
      ],
      take: 10
    });

    return tokens.map(token => ({
      id: token.id,
      hash: token.hash,
      userId: token.userId,
      email: token.email,
      isActive: token.isActive,
      isValid: token.isValid,
      usageCount: token.usageCount,
      rateLimit: token.rateLimit,
      tier: token.tier,
      metadata: token.metadata,
      createdAt: token.createdAt,
      updatedAt: token.updatedAt
    }));
  }

  /**
   * Update token usage statistics
   */
  async updateTokenUsage(tokenId: string, usage?: Partial<TokenUsage>) {
    try {
      const tokenInfo = this.tokens.get(tokenId);
      if (!tokenInfo) return;

      // Update in database
      await this.prisma.token.update({
        where: { id: tokenId },
        data: {
          usageCount: { increment: 1 },
          lastUsed: new Date(),
          updatedAt: new Date()
        }
      });

      // Update in memory cache
      tokenInfo.usageCount++;
      tokenInfo.lastUsed = new Date();
      tokenInfo.updatedAt = new Date();

      // Track usage analytics
      if (usage) {
        await this.trackTokenUsage(tokenId, usage);
      }

    } catch (error) {
      this.emit('tokenError', { error, operation: 'updateTokenUsage', tokenId });
    }
  }

  /**
   * Track token usage for analytics
   */
  private async trackTokenUsage(tokenId: string, usage: Partial<TokenUsage>) {
    try {
      await this.prisma.tokenUsage.create({
        data: {
          tokenId,
          endpoint: usage.endpoint || '',
          method: usage.method || '',
          statusCode: usage.statusCode || 0,
          responseTime: usage.responseTime || 0,
          timestamp: usage.timestamp || new Date(),
          error: usage.error
        }
      });
    } catch (error) {
      console.error('Failed to track token usage:', error);
    }
  }

  /**
   * Get original token (decrypted)
   */
  private async getOriginalToken(tokenId: string): Promise<string | null> {
    try {
      // Try Redis first
      if (this.redis) {
        const cached = await this.redis.get(`token:${tokenId}:original`);
        if (cached) {
          return this.decryptToken(cached);
        }
      }

      // Fallback to database (encrypted)
      const tokenRecord = await this.prisma.token.findUnique({
        where: { id: tokenId }
      });

      if (tokenRecord?.encryptedToken) {
        return this.decryptToken(tokenRecord.encryptedToken);
      }

      return null;
    } catch (error) {
      console.error('Failed to get original token:', error);
      return null;
    }
  }

  /**
   * Encrypt token for storage
   */
  private encryptToken(token: string): string {
    // Simple base64 encoding for now - implement proper encryption in production
    return Buffer.from(token).toString('base64');
  }

  /**
   * Decrypt token from storage
   */
  private decryptToken(encryptedToken: string): string {
    // Simple base64 decoding for now - implement proper decryption in production
    return Buffer.from(encryptedToken, 'base64').toString('utf-8');
  }

  /**
   * Get rate limit for tier
   */
  private getRateLimitForTier(tier: string): number {
    switch (tier) {
      case 'ENTERPRISE': return 1000;
      case 'PREMIUM': return 100;
      case 'FREE': return 10;
      default: return 10;
    }
  }

  /**
   * Perform health check on all tokens
   */
  async performHealthCheck(): Promise<boolean> {
    try {
      const tokens = await this.prisma.token.findMany({
        where: { isActive: true },
        take: 5 // Check only a sample
      });

      let healthyCount = 0;

      for (const token of tokens) {
        const isHealthy = await this.validateTokenWithSuno(await this.getOriginalToken(token.id) || '');

        if (isHealthy) {
          healthyCount++;
        } else {
          // Mark as invalid
          await this.prisma.token.update({
            where: { id: token.id },
            data: { isValid: false }
          });

          this.tokens.get(token.id)!.isValid = false;
        }
      }

      return healthyCount > 0;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Health check method for external services
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;

      // Check Redis connection
      if (this.redis) {
        await this.redis.ping();
      }

      // Check if we have active tokens
      const activeTokens = await this.prisma.token.count({
        where: { isActive: true, isValid: true }
      });

      return activeTokens > 0;
    } catch (error) {
      console.error('Token manager health check failed:', error);
      return false;
    }
  }

  /**
   * Get token pool statistics
   */
  async getPoolStats(): Promise<TokenPoolStats> {
    try {
      const totalTokens = await this.prisma.token.count();
      const activeTokens = await this.prisma.token.count({
        where: { isActive: true }
      });
      const healthyTokens = await this.prisma.token.count({
        where: { isActive: true, isValid: true }
      });

      // Calculate average response time
      const recentUsage = await this.prisma.tokenUsage.findMany({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        },
        orderBy: { timestamp: 'desc' },
        take: 1000
      });

      const averageResponseTime = recentUsage.length > 0
        ? recentUsage.reduce((sum, usage) => sum + usage.responseTime, 0) / recentUsage.length
        : 0;

      const totalRequests = recentUsage.length;
      const successRate = totalRequests > 0
        ? (recentUsage.filter(usage => usage.statusCode >= 200 && usage.statusCode < 300).length / totalRequests) * 100
        : 100;

      return {
        totalTokens,
        activeTokens,
        healthyTokens,
        averageResponseTime,
        totalRequests,
        successRate
      };
    } catch (error) {
      console.error('Failed to get pool stats:', error);
      throw ErrorFactory.fromUnknown(error, 'Failed to get token pool statistics');
    }
  }

  /**
   * Remove token from pool
   */
  async removeToken(tokenId: string): Promise<boolean> {
    try {
      // Update database
      await this.prisma.token.update({
        where: { id: tokenId },
        data: { isActive: false }
      });

      // Remove from cache
      this.tokens.delete(tokenId);
      this.rateLimiters.delete(tokenId);

      // Remove from Redis
      if (this.redis) {
        await this.redis.del(`token:${tokenId}:original`);
      }

      this.emit('tokenRemoved', { tokenId });

      return true;
    } catch (error) {
      this.emit('tokenError', { error, operation: 'removeToken', tokenId });
      return false;
    }
  }

  /**
   * Cleanup expired tokens
   */
  private async cleanupExpiredTokens() {
    try {
      const expiredTokens = await this.prisma.token.findMany({
        where: {
          expiresAt: {
            lt: new Date()
          },
          isActive: true
        }
      });

      for (const token of expiredTokens) {
        await this.removeToken(token.id);
      }

      if (expiredTokens.length > 0) {
        console.log(`Cleaned up ${expiredTokens.length} expired tokens`);
      }
    } catch (error) {
      console.error('Token cleanup failed:', error);
    }
  }

  /**
   * Handle token added event
   */
  private handleTokenAdded(data: { tokenId: string; tier: string; userId?: string }) {
    console.log(`Token added: ${data.tokenId} (Tier: ${data.tier}, User: ${data.userId || 'System'})`);
  }

  /**
   * Handle token removed event
   */
  private handleTokenRemoved(data: { tokenId: string }) {
    console.log(`Token removed: ${data.tokenId}`);
  }

  /**
   * Handle token error event
   */
  private handleTokenError(data: { error: any; operation: string; tokenId?: string; userId?: string }) {
    console.error(`Token error in ${data.operation}:`, {
      tokenId: data.tokenId,
      userId: data.userId,
      error: sanitizeForLogging(data.error)
    });
  }

  /**
   * Close token manager and cleanup resources
   */
  async close() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    if (this.redis) {
      await this.redis.quit();
    }

    await this.prisma.$disconnect();
  }
}
