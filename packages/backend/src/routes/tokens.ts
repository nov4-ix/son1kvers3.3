/**
 * Token Management Routes
 * Handles token pool, user tokens, and token operations
 */

import { FastifyPluginAsync } from 'fastify';
import {
  validateEmail,
  validateAPIKey,
  ValidationError,
  ErrorFactory,
  formatNumber,
  formatDateTime
} from '@son1kvers3/shared-utils';

export interface AddTokenRequest {
  token: string;
  email?: string;
  tier?: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  metadata?: Record<string, any>;
}

export interface TokenResponse {
  id: string;
  tier: string;
  usageCount: number;
  rateLimit: number;
  isValid: boolean;
  lastUsed?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export const tokenRoutes = (tokenManager: any, tokenPoolService: any): FastifyPluginAsync => {
  return async (fastify) => {
    const { prisma } = fastify;

    // Add token to pool
    fastify.post('/', async (request, reply) => {
      try {
        const user = (request as any).user;
        const { token, email, tier = 'FREE', metadata } = request.body as AddTokenRequest;

        // Validate token format
        if (!validateAPIKey(token)) {
          throw new ValidationError('Invalid token format');
        }

        // Add token via token manager
        const tokenId = await tokenManager.addToken(
          token,
          user.id,
          email,
          tier,
          metadata
        );

        // Track token addition
        if (fastify.analyticsService) {
          await fastify.analyticsService.trackFeatureUsage(user.id, 'token_added', {
            tier,
            source: email ? 'extension' : 'manual'
          });
        }

        return reply.code(201).send({
          success: true,
          tokenId,
          message: 'Token added successfully',
          tier
        });

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to add token');
      }
    });

    // Get user's tokens
    fastify.get('/', async (request, reply) => {
      try {
        const user = (request as any).user;
        const { limit = 20, offset = 0 } = request.query as {
          limit?: number;
          offset?: number;
        };

        const tokens = await prisma.token.findMany({
          where: { userId: user.id, isActive: true },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset
        });

        const formattedTokens: TokenResponse[] = tokens.map(token => ({
          id: token.id,
          tier: token.tier,
          usageCount: token.usageCount,
          rateLimit: token.rateLimit,
          isValid: token.isValid,
          lastUsed: token.lastUsed?.toISOString(),
          createdAt: token.createdAt.toISOString(),
          metadata: token.metadata
        }));

        const total = await prisma.token.count({
          where: { userId: user.id, isActive: true }
        });

        return {
          tokens: formattedTokens,
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to get user tokens');
      }
    });

    // Get token details
    fastify.get('/:id', async (request, reply) => {
      try {
        const user = (request as any).user;
        const { id } = request.params as { id: string };

        const token = await prisma.token.findFirst({
          where: {
            id,
            userId: user.id,
            isActive: true
          }
        });

        if (!token) {
          throw new ValidationError('Token not found');
        }

        // Get usage statistics
        const usageStats = await prisma.tokenUsage.findMany({
          where: { tokenId: id },
          orderBy: { timestamp: 'desc' },
          take: 50
        });

        return {
          id: token.id,
          tier: token.tier,
          usageCount: token.usageCount,
          rateLimit: token.rateLimit,
          isValid: token.isValid,
          lastUsed: token.lastUsed?.toISOString(),
          createdAt: token.createdAt.toISOString(),
          metadata: token.metadata,
          recentUsage: usageStats.map(usage => ({
            endpoint: usage.endpoint,
            method: usage.method,
            statusCode: usage.statusCode,
            responseTime: usage.responseTime,
            timestamp: usage.timestamp.toISOString(),
            error: usage.error
          }))
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to get token details');
      }
    });

    // Remove token
    fastify.delete('/:id', async (request, reply) => {
      try {
        const user = (request as any).user;
        const { id } = request.params as { id: string };

        // Check ownership
        const token = await prisma.token.findFirst({
          where: {
            id,
            userId: user.id
          }
        });

        if (!token) {
          throw new ValidationError('Token not found');
        }

        // Remove token
        const success = await tokenManager.removeToken(id);

        if (success) {
          // Track token removal
          if (fastify.analyticsService) {
            await fastify.analyticsService.trackFeatureUsage(user.id, 'token_removed', {
              tier: token.tier
            });
          }

          return { message: 'Token removed successfully' };
        } else {
          throw new Error('Failed to remove token');
        }

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to remove token');
      }
    });

    // Get token pool statistics
    fastify.get('/pool/stats', async (request, reply) => {
      try {
        const user = (request as any).user;

        // Check if user has admin permissions or owns tokens
        const userTokens = await prisma.token.count({
          where: { userId: user.id }
        });

        if (userTokens === 0 && !user.isAdmin) {
          throw new ValidationError('Access denied');
        }

        const stats = await tokenPoolService.getPoolStats();

        return {
          totalTokens: stats.totalTokens,
          activeTokens: stats.activeTokens,
          healthyTokens: stats.healthyTokens,
          averageResponseTime: stats.averageResponseTime,
          totalRequests: stats.totalRequests,
          successRate: stats.successRate,
          timestamp: new Date().toISOString()
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to get pool statistics');
      }
    });

    // Get token pool health
    fastify.get('/pool/health', async (request, reply) => {
      try {
        const user = (request as any).user;

        // Check permissions
        const userTokens = await prisma.token.count({
          where: { userId: user.id }
        });

        if (userTokens === 0 && !user.isAdmin) {
          throw new ValidationError('Access denied');
        }

        const health = await tokenPoolService.getPoolHealth();

        return {
          status: health.status,
          score: health.score,
          issues: health.issues,
          recommendations: health.recommendations,
          timestamp: new Date().toISOString()
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to get pool health');
      }
    });

    // Optimize token pool (admin only)
    fastify.post('/pool/optimize', async (request, reply) => {
      try {
        const user = (request as any).user;

        if (!user.isAdmin) {
          throw new ValidationError('Admin access required');
        }

        const result = await tokenPoolService.rebalancePool();

        return {
          actions: result.actions,
          tokensAdded: result.tokensAdded,
          tokensRemoved: result.tokensRemoved,
          optimization: result.optimization,
          timestamp: new Date().toISOString()
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to optimize token pool');
      }
    });

    // Get token usage analytics
    fastify.get('/analytics/usage', async (request, reply) => {
      try {
        const user = (request as any).user;
        const { timeframe = 'day' } = request.query as { timeframe?: string };

        // Check permissions
        const userTokens = await prisma.token.count({
          where: { userId: user.id }
        });

        if (userTokens === 0 && !user.isAdmin) {
          throw new ValidationError('Access denied');
        }

        const analytics = await tokenPoolService.getUsageAnalytics(timeframe);

        return {
          timeframe,
          totalRequests: analytics.totalRequests,
          successRate: analytics.successRate,
          averageResponseTime: analytics.averageResponseTime,
          peakUsage: analytics.peakUsage,
          tokensUsed: analytics.tokensUsed,
          errors: analytics.errors,
          timestamp: new Date().toISOString()
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to get usage analytics');
      }
    });

    // Get performance metrics
    fastify.get('/analytics/performance', async (request, reply) => {
      try {
        const user = (request as any).user;

        // Check permissions
        const userTokens = await prisma.token.count({
          where: { userId: user.id }
        });

        if (userTokens === 0 && !user.isAdmin) {
          throw new ValidationError('Access denied');
        }

        const metrics = await tokenPoolService.getPerformanceMetrics();

        return {
          throughput: metrics.throughput,
          latency: metrics.latency,
          errorRate: metrics.errorRate,
          availability: metrics.availability,
          utilization: metrics.utilization,
          timestamp: new Date().toISOString()
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to get performance metrics');
      }
    });

    // Test token validity
    fastify.post('/:id/test', async (request, reply) => {
      try {
        const user = (request as any).user;
        const { id } = request.params as { id: string };

        // Check ownership
        const token = await prisma.token.findFirst({
          where: {
            id,
            userId: user.id,
            isActive: true
          }
        });

        if (!token) {
          throw new ValidationError('Token not found');
        }

        // Test token with a simple API call
        const isValid = await tokenManager.validateTokenWithSuno(token.hash);

        // Update token validity
        await prisma.token.update({
          where: { id },
          data: {
            isValid,
            updatedAt: new Date()
          }
        });

        return {
          tokenId: id,
          isValid,
          testedAt: new Date().toISOString(),
          message: isValid ? 'Token is valid' : 'Token is invalid or expired'
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to test token');
      }
    });

    // Bulk add tokens
    fastify.post('/bulk', async (request, reply) => {
      try {
        const user = (request as any).user;
        const { tokens, tier = 'FREE' } = request.body as {
          tokens: string[];
          tier?: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
        };

        if (!Array.isArray(tokens) || tokens.length === 0) {
          throw new ValidationError('Tokens array is required');
        }

        if (tokens.length > 50) {
          throw new ValidationError('Maximum 50 tokens per bulk operation');
        }

        const results = [];
        let successCount = 0;
        let errorCount = 0;

        for (const token of tokens) {
          try {
            if (!validateAPIKey(token)) {
              results.push({
                token: token.substring(0, 10) + '...',
                success: false,
                error: 'Invalid token format'
              });
              errorCount++;
              continue;
            }

            const tokenId = await tokenManager.addToken(
              token,
              user.id,
              user.email,
              tier,
              { source: 'bulk_upload', uploadedBy: user.id }
            );

            results.push({
              token: token.substring(0, 10) + '...',
              success: true,
              tokenId
            });
            successCount++;

          } catch (error) {
            results.push({
              token: token.substring(0, 10) + '...',
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
            errorCount++;
          }
        }

        // Track bulk operation
        if (fastify.analyticsService) {
          await fastify.analyticsService.trackFeatureUsage(user.id, 'bulk_token_upload', {
            totalTokens: tokens.length,
            successCount,
            errorCount,
            tier
          });
        }

        return reply.code(successCount > 0 ? 201 : 400).send({
          summary: {
            total: tokens.length,
            successful: successCount,
            failed: errorCount
          },
          results,
          message: `${successCount} tokens added successfully, ${errorCount} failed`
        });

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Bulk token operation failed');
      }
    });

    // Export token data
    fastify.get('/export/data', async (request, reply) => {
      try {
        const user = (request as any).user;

        if (!user.isAdmin) {
          throw new ValidationError('Admin access required');
        }

        const exportData = await tokenPoolService.exportPoolData();

        return {
          tokens: exportData.tokens.map(token => ({
            ...token,
            hash: token.hash.substring(0, 8) + '...' // Partially obscure hash
          })),
          usage: exportData.usage,
          extensions: exportData.extensions,
          exportedAt: exportData.exportedAt.toISOString(),
          totalTokens: exportData.tokens.length
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to export token data');
      }
    });

    // Get token distribution
    fastify.get('/analytics/distribution', async (request, reply) => {
      try {
        const user = (request as any).user;

        // Check permissions
        const userTokens = await prisma.token.count({
          where: { userId: user.id }
        });

        if (userTokens === 0 && !user.isAdmin) {
          throw new ValidationError('Access denied');
        }

        const distribution = await tokenPoolService.getTokenDistribution();

        return {
          total: distribution.total,
          byTier: distribution.byTier,
          byStatus: distribution.byStatus,
          averageUsage: distribution.averageUsage,
          rotationEfficiency: distribution.rotationEfficiency,
          timestamp: new Date().toISOString()
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to get token distribution');
      }
    });
  };
};
