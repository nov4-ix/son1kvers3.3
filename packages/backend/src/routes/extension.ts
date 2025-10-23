/**
 * Browser Extension Routes
 * Handles extension registration, token capture, and user account creation
 */

import { FastifyPluginAsync } from 'fastify';
import {
  validateEmail,
  validateAPIKey,
  generateSecureToken,
  sanitizeString,
  ValidationError,
  ErrorFactory,
  formatDateTime
} from '@son1kvers3/shared-utils';

export interface ExtensionRegisterRequest {
  extensionId: string;
  email: string;
  sunoToken?: string;
  userAgent: string;
  metadata?: Record<string, any>;
}

export interface TokenCaptureRequest {
  email: string;
  token: string;
  source: 'extension' | 'manual' | 'api';
  metadata?: Record<string, any>;
}

export interface ExtensionAuthRequest {
  extensionId: string;
  token: string;
  userAgent: string;
}

export const extensionRoutes = (userExtensionService: any): FastifyPluginAsync => {
  return async (fastify) => {
    const { prisma } = fastify;

    // Register extension
    fastify.post('/register', async (request, reply) => {
      try {
        const extensionData = request.body as ExtensionRegisterRequest;

        // Validate required fields
        if (!extensionData.extensionId || !extensionData.email) {
          throw new ValidationError('Extension ID and email are required');
        }

        if (!validateEmail(extensionData.email)) {
          throw new ValidationError('Invalid email format');
        }

        // Validate token if provided
        if (extensionData.sunoToken && !validateAPIKey(extensionData.sunoToken)) {
          throw new ValidationError('Invalid token format');
        }

        // Register extension
        const success = await userExtensionService.registerExtension(
          extensionData.extensionId,
          {
            email: extensionData.email,
            sunoToken: extensionData.sunoToken,
            userAgent: extensionData.userAgent,
            ipAddress: request.ip,
            metadata: extensionData.metadata
          }
        );

        if (success) {
          // Track extension registration
          if (fastify.analyticsService) {
            await fastify.analyticsService.trackFeatureUsage(
              extensionData.extensionId,
              'extension_registered',
              {
                email: extensionData.email,
                hasToken: !!extensionData.sunoToken
              }
            );
          }

          return reply.code(201).send({
            success: true,
            message: 'Extension registered successfully',
            extensionId: extensionData.extensionId
          });
        } else {
          throw new Error('Failed to register extension');
        }

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Extension registration failed');
      }
    });

    // Capture token from extension
    fastify.post('/capture-token', async (request, reply) => {
      try {
        const captureRequest = request.body as TokenCaptureRequest;

        // Validate request
        if (!validateEmail(captureRequest.email)) {
          throw new ValidationError('Invalid email format');
        }

        if (!validateAPIKey(captureRequest.token)) {
          throw new ValidationError('Invalid token format');
        }

        // Capture token
        const result = await userExtensionService.captureToken(captureRequest);

        if (result.success) {
          return reply.code(201).send({
            success: true,
            tokenId: result.tokenId,
            message: result.message,
            timestamp: new Date().toISOString()
          });
        } else {
          return reply.code(400).send({
            success: false,
            message: result.message,
            timestamp: new Date().toISOString()
          });
        }

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Token capture failed');
      }
    });

    // Authenticate extension
    fastify.post('/auth', async (request, reply) => {
      try {
        const authRequest = request.body as ExtensionAuthRequest;

        // Validate extension token
        const isValid = await userExtensionService.validateExtensionToken(
          authRequest.extensionId,
          authRequest.token
        );

        if (!isValid) {
          throw new ValidationError('Invalid extension token');
        }

        // Get extension data
        const extension = await userExtensionService.getExtensionByUserId(authRequest.extensionId);

        if (!extension) {
          throw new ValidationError('Extension not found');
        }

        return {
          authenticated: true,
          extensionId: authRequest.extensionId,
          userId: extension.userId,
          email: extension.sunoEmail,
          isActive: extension.isActive,
          lastSync: extension.lastSync?.toISOString(),
          syncCount: extension.syncCount,
          metadata: extension.metadata,
          timestamp: new Date().toISOString()
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Extension authentication failed');
      }
    });

    // Sync extension data
    fastify.post('/sync', async (request, reply) => {
      try {
        const { extensionId, email, sunoToken, metadata } = request.body as {
          extensionId: string;
          email?: string;
          sunoToken?: string;
          metadata?: Record<string, any>;
        };

        if (!extensionId) {
          throw new ValidationError('Extension ID is required');
        }

        // Validate email if provided
        if (email && !validateEmail(email)) {
          throw new ValidationError('Invalid email format');
        }

        // Validate token if provided
        if (sunoToken && !validateAPIKey(sunoToken)) {
          throw new ValidationError('Invalid token format');
        }

        // Sync extension data
        const success = await userExtensionService.syncExtensionData(extensionId, {
          email,
          sunoToken,
          metadata
        });

        if (success) {
          return {
            success: true,
            message: 'Extension data synced successfully',
            timestamp: new Date().toISOString()
          };
        } else {
          throw new Error('Failed to sync extension data');
        }

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Extension sync failed');
      }
    });

    // Get extension status
    fastify.get('/status/:extensionId', async (request, reply) => {
      try {
        const { extensionId } = request.params as { extensionId: string };

        const extension = await userExtensionService.getExtensionByUserId(extensionId);

        if (!extension) {
          throw new ValidationError('Extension not found');
        }

        // Get user's tokens
        const tokens = await userExtensionService.getUserTokens(extension.userId);

        return {
          extensionId,
          userId: extension.userId,
          email: extension.sunoEmail,
          isActive: extension.isActive,
          lastSync: extension.lastSync?.toISOString(),
          syncCount: extension.syncCount,
          tokens: tokens.length,
          tokenDetails: tokens,
          metadata: extension.metadata,
          timestamp: new Date().toISOString()
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to get extension status');
      }
    });

    // Get extension statistics
    fastify.get('/stats', async (request, reply) => {
      try {
        const stats = await userExtensionService.getExtensionStats();

        return {
          totalExtensions: stats.totalExtensions,
          activeExtensions: stats.activeExtensions,
          totalTokensCaptured: stats.totalTokensCaptured,
          totalUsersCreated: stats.totalUsersCreated,
          successRate: stats.successRate,
          averageTokensPerUser: stats.averageTokensPerUser,
          timestamp: new Date().toISOString()
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to get extension statistics');
      }
    });

    // Get active extensions (admin only)
    fastify.get('/active', async (request, reply) => {
      try {
        const user = (request as any).user;

        if (!user.isAdmin) {
          throw new ValidationError('Admin access required');
        }

        const extensions = await userExtensionService.getActiveExtensions();

        return {
          extensions: extensions.map(ext => ({
            id: ext.id,
            userId: ext.userId,
            email: ext.sunoEmail,
            isActive: ext.isActive,
            lastSync: ext.lastSync?.toISOString(),
            syncCount: ext.syncCount,
            user: ext.user,
            metadata: ext.metadata
          })),
          total: extensions.length,
          timestamp: new Date().toISOString()
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to get active extensions');
      }
    });

    // Send notification to extension
    fastify.post('/notify', async (request, reply) => {
      try {
        const user = (request as any).user;
        const { extensionId, type, title, message, data } = request.body as {
          extensionId: string;
          type: string;
          title: string;
          message: string;
          data?: any;
        };

        if (!user.isAdmin) {
          throw new ValidationError('Admin access required');
        }

        const success = await userExtensionService.sendNotificationToExtension(
          extensionId,
          { type, title, message, data }
        );

        return {
          success,
          message: success ? 'Notification sent' : 'Failed to send notification',
          timestamp: new Date().toISOString()
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to send notification');
      }
    });

    // Update extension metadata
    fastify.put('/:extensionId/metadata', async (request, reply) => {
      try {
        const user = (request as any).user;
        const { extensionId } = request.params as { extensionId: string };
        const { metadata } = request.body as { metadata: Record<string, any> };

        // Check if user owns this extension or is admin
        const extension = await userExtensionService.getExtensionByUserId(extensionId);

        if (!extension) {
          throw new ValidationError('Extension not found');
        }

        if (extension.userId !== user.id && !user.isAdmin) {
          throw new ValidationError('Access denied');
        }

        const success = await userExtensionService.updateExtensionMetadata(extensionId, metadata);

        return {
          success,
          message: success ? 'Metadata updated successfully' : 'Failed to update metadata',
          timestamp: new Date().toISOString()
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to update extension metadata');
      }
    });

    // Remove extension
    fastify.delete('/:extensionId', async (request, reply) => {
      try {
        const user = (request as any).user;
        const { extensionId } = request.params as { extensionId: string };

        // Check if user owns this extension or is admin
        const extension = await userExtensionService.getExtensionByUserId(extensionId);

        if (!extension) {
          throw new ValidationError('Extension not found');
        }

        if (extension.userId !== user.id && !user.isAdmin) {
          throw new ValidationError('Access denied');
        }

        const success = await userExtensionService.removeExtension(extensionId);

        return {
          success,
          message: success ? 'Extension removed successfully' : 'Failed to remove extension',
          timestamp: new Date().toISOString()
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to remove extension');
      }
    });

    // Health check for extension
    fastify.get('/health', async (request, reply) => {
      try {
        const stats = await userExtensionService.getExtensionStats();

        return {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          extensions: {
            total: stats.totalExtensions,
            active: stats.activeExtensions,
            successRate: stats.successRate
          },
          tokens: {
            captured: stats.totalTokensCaptured,
            averagePerUser: stats.averageTokensPerUser
          }
        };

      } catch (error) {
        return reply.code(503).send({
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: 'Extension service unavailable'
        });
      }
    });

    // Bulk token capture
    fastify.post('/capture-tokens/bulk', async (request, reply) => {
      try {
        const { tokens } = request.body as { tokens: TokenCaptureRequest[] };

        if (!Array.isArray(tokens) || tokens.length === 0) {
          throw new ValidationError('Tokens array is required');
        }

        if (tokens.length > 100) {
          throw new ValidationError('Maximum 100 tokens per bulk operation');
        }

        const results = [];
        let successCount = 0;
        let errorCount = 0;

        for (const tokenRequest of tokens) {
          try {
            const result = await userExtensionService.captureToken(tokenRequest);

            results.push({
              email: tokenRequest.email,
              success: result.success,
              tokenId: result.tokenId,
              error: result.success ? undefined : result.message
            });

            if (result.success) {
              successCount++;
            } else {
              errorCount++;
            }

          } catch (error) {
            results.push({
              email: tokenRequest.email,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
            errorCount++;
          }
        }

        // Track bulk operation
        if (fastify.analyticsService) {
          await fastify.analyticsService.trackFeatureUsage(
            'system',
            'bulk_token_capture',
            {
              totalTokens: tokens.length,
              successCount,
              errorCount
            }
          );
        }

        return reply.code(successCount > 0 ? 201 : 400).send({
          summary: {
            total: tokens.length,
            successful: successCount,
            failed: errorCount
          },
          results,
          message: `${successCount} tokens captured successfully, ${errorCount} failed`
        });

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Bulk token capture failed');
      }
    });

    // Get extension logs (admin only)
    fastify.get('/:extensionId/logs', async (request, reply) => {
      try {
        const user = (request as any).user;
        const { extensionId } = request.params as { extensionId: string };
        const { limit = 50, offset = 0 } = request.query as {
          limit?: number;
          offset?: number;
        };

        if (!user.isAdmin) {
          throw new ValidationError('Admin access required');
        }

        // Get extension activity logs (simplified implementation)
        const extension = await userExtensionService.getExtensionByUserId(extensionId);

        if (!extension) {
          throw new ValidationError('Extension not found');
        }

        // Get user activity for this extension
        const activities = await prisma.userAnalytics.findMany({
          where: {
            userId: extension.userId,
            actionType: {
              in: ['token_captured', 'extension_registered', 'extension_synced']
            }
          },
          orderBy: { timestamp: 'desc' },
          take: limit,
          skip: offset
        });

        return {
          extensionId,
          userId: extension.userId,
          activities: activities.map(activity => ({
            id: activity.id,
            action: activity.actionType,
            timestamp: activity.timestamp.toISOString(),
            metadata: activity.metadata
          })),
          total: activities.length,
          limit,
          offset
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to get extension logs');
      }
    });
  };
};
