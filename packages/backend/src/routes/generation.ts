/**
 * Music Generation Routes
 * Handles AI music generation with Suno integration
 */

import { FastifyPluginAsync } from 'fastify';
import {
  validateGenerationParameters,
  ValidationError,
  ErrorFactory,
  formatDuration,
  formatBPM,
  formatMusicalKey,
  formatGenre,
  formatMood
} from '@son1kvers3/shared-utils';

export interface GenerationRequest {
  prompt: string;
  duration?: number;
  tempo?: number;
  key?: string;
  genre?: string;
  mood?: string;
  instruments?: string[];
  style?: string;
  complexity?: number;
  temperature?: number;
  seed?: number;
  model?: string;
}

export interface GenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  prompt: string;
  parameters: GenerationRequest;
  audio_url?: string;
  image_url?: string;
  video_url?: string;
  duration?: number;
  metadata?: Record<string, any>;
  error?: string;
  created_at: string;
  completed_at?: string;
  estimated_wait_time?: number;
}

export interface GenerationStatusResponse {
  id: string;
  status: string;
  progress?: number;
  message?: string;
  result?: GenerationResponse;
}

export const generationRoutes = (sunoService: any, analyticsService: any): FastifyPluginAsync => {
  return async (fastify) => {
    const { prisma } = fastify;

    // Generate music
    fastify.post('/', async (request, reply) => {
      try {
        const user = (request as any).user;
        const generationRequest = request.body as GenerationRequest;

        // Validate request
        const validation = validateGenerationParameters(generationRequest);
        if (!validation.valid) {
          throw new ValidationError(`Invalid parameters: ${validation.errors.join(', ')}`);
        }

        // Check user permissions and quotas
        await checkUserQuota(user.id, generationRequest);

        // Create generation record
        const generation = await prisma.generation.create({
          data: {
            userId: user.id,
            prompt: generationRequest.prompt,
            status: 'PENDING',
            model: generationRequest.model || 'SON1K_HYBRID',
            parameters: generationRequest,
            createdAt: new Date()
          }
        });

        // Track generation start
        if (analyticsService) {
          await analyticsService.trackGeneration(user.id, {
            prompt: generationRequest.prompt,
            parameters: generationRequest,
            duration: generationRequest.duration || 60,
            success: true
          });
        }

        // Queue generation with Suno service
        const sunoResponse = await sunoService.generateMusic(generationRequest, user.id);

        // Update generation record
        await prisma.generation.update({
          where: { id: generation.id },
          data: {
            status: 'PROCESSING',
            result: sunoResponse,
            updatedAt: new Date()
          }
        });

        const response: GenerationResponse = {
          id: generation.id,
          status: 'pending',
          prompt: generationRequest.prompt,
          parameters: generationRequest,
          created_at: generation.createdAt.toISOString(),
          estimated_wait_time: calculateEstimatedWaitTime(generationRequest)
        };

        return reply.code(202).send(response);

      } catch (error) {
        // Track failed generation
        if (analyticsService && (request as any).user) {
          await analyticsService.trackGeneration((request as any).user.id, {
            prompt: (request.body as GenerationRequest).prompt,
            parameters: request.body,
            duration: 0,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }

        throw ErrorFactory.fromUnknown(error, 'Music generation failed');
      }
    });

    // Get generation status
    fastify.get('/:id', async (request, reply) => {
      try {
        const user = (request as any).user;
        const { id } = request.params as { id: string };

        // Get generation record
        const generation = await prisma.generation.findFirst({
          where: {
            id,
            userId: user.id
          }
        });

        if (!generation) {
          throw new ValidationError('Generation not found');
        }

        // Get latest status from Suno if still processing
        let currentStatus = generation.result as GenerationResponse;
        if (generation.status === 'PROCESSING' && sunoService) {
          try {
            const latestStatus = await sunoService.getGeneration(id);
            currentStatus = latestStatus;

            // Update database if status changed
            if (latestStatus.status !== generation.status) {
              await prisma.generation.update({
                where: { id },
                data: {
                  status: latestStatus.status as any,
                  result: latestStatus,
                  completedAt: latestStatus.status === 'completed' ? new Date() : undefined,
                  updatedAt: new Date()
                }
              });
            }
          } catch (error) {
            console.error('Failed to get latest generation status:', error);
          }
        }

        const response: GenerationStatusResponse = {
          id: generation.id,
          status: generation.status.toLowerCase(),
          progress: calculateProgress(generation.status),
          message: getStatusMessage(generation.status),
          result: currentStatus
        };

        return response;

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to get generation status');
      }
    });

    // Get user's generations
    fastify.get('/', async (request, reply) => {
      try {
        const user = (request as any).user;
        const { limit = 20, offset = 0, status } = request.query as {
          limit?: number;
          offset?: number;
          status?: string;
        };

        const where: any = { userId: user.id };
        if (status) {
          where.status = status.toUpperCase();
        }

        const [generations, total] = await Promise.all([
          prisma.generation.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset
          }),
          prisma.generation.count({ where })
        ]);

        const formattedGenerations = generations.map(gen => ({
          id: gen.id,
          prompt: gen.prompt,
          status: gen.status.toLowerCase(),
          model: gen.model,
          parameters: gen.parameters,
          result: gen.result,
          created_at: gen.createdAt.toISOString(),
          completed_at: gen.completedAt?.toISOString()
        }));

        return {
          generations: formattedGenerations,
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to get generations');
      }
    });

    // Delete generation
    fastify.delete('/:id', async (request, reply) => {
      try {
        const user = (request as any).user;
        const { id } = request.params as { id: string };

        // Check ownership
        const generation = await prisma.generation.findFirst({
          where: {
            id,
            userId: user.id
          }
        });

        if (!generation) {
          throw new ValidationError('Generation not found');
        }

        // Delete from Suno if completed
        if (generation.status === 'COMPLETED' && sunoService) {
          try {
            await sunoService.deleteGeneration(id);
          } catch (error) {
            console.error('Failed to delete from Suno:', error);
          }
        }

        // Delete from database
        await prisma.generation.delete({
          where: { id }
        });

        return { message: 'Generation deleted successfully' };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to delete generation');
      }
    });

    // Get available options (genres, moods, etc.)
    fastify.get('/options/available', async (request, reply) => {
      try {
        if (sunoService) {
          const options = await sunoService.getAvailableOptions();
          return options;
        }

        // Return default options
        return {
          genres: ['pop', 'rock', 'electronic', 'classical', 'jazz', 'hip-hop', 'ambient'],
          moods: ['happy', 'sad', 'energetic', 'calm', 'aggressive', 'peaceful'],
          instruments: ['piano', 'guitar', 'drums', 'bass', 'violin', 'synthesizer'],
          styles: ['modern', 'classical', 'electronic', 'acoustic', 'orchestral'],
          keys: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to get available options');
      }
    });

    // Get generation queue status
    fastify.get('/queue/status', async (request, reply) => {
      try {
        if (sunoService) {
          const queueStatus = sunoService.getQueueStatus();
          return queueStatus;
        }

        return {
          queueLength: 0,
          isProcessing: false,
          averageWaitTime: 0
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to get queue status');
      }
    });

    // Retry failed generation
    fastify.post('/:id/retry', async (request, reply) => {
      try {
        const user = (request as any).user;
        const { id } = request.params as { id: string };

        // Get original generation
        const generation = await prisma.generation.findFirst({
          where: {
            id,
            userId: user.id
          }
        });

        if (!generation) {
          throw new ValidationError('Generation not found');
        }

        if (generation.status !== 'FAILED') {
          throw new ValidationError('Can only retry failed generations');
        }

        // Check quota again
        await checkUserQuota(user.id, generation.parameters as GenerationRequest);

        // Reset generation status
        await prisma.generation.update({
          where: { id },
          data: {
            status: 'PENDING',
            completedAt: null,
            updatedAt: new Date()
          }
        });

        // Re-queue with Suno service
        const sunoResponse = await sunoService.generateMusic(
          generation.parameters as GenerationRequest,
          user.id
        );

        // Update with new response
        await prisma.generation.update({
          where: { id },
          data: {
            status: 'PROCESSING',
            result: sunoResponse,
            updatedAt: new Date()
          }
        });

        return {
          id,
          status: 'pending',
          message: 'Generation re-queued successfully'
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to retry generation');
      }
    });

    // Get generation analytics
    fastify.get('/analytics/summary', async (request, reply) => {
      try {
        const user = (request as any).user;
        const { timeframe = 'week' } = request.query as { timeframe?: string };

        if (analyticsService) {
          const analytics = await analyticsService.getGenerationAnalytics(timeframe);
          return analytics;
        }

        // Return basic stats if analytics service not available
        const timeframeMs = getTimeframeMs(timeframe);

        const [totalGenerations, successfulGenerations, failedGenerations] = await Promise.all([
          prisma.generation.count({
            where: {
              userId: user.id,
              createdAt: { gte: new Date(Date.now() - timeframeMs) }
            }
          }),
          prisma.generation.count({
            where: {
              userId: user.id,
              status: 'COMPLETED',
              createdAt: { gte: new Date(Date.now() - timeframeMs) }
            }
          }),
          prisma.generation.count({
            where: {
              userId: user.id,
              status: 'FAILED',
              createdAt: { gte: new Date(Date.now() - timeframeMs) }
            }
          })
        ]);

        return {
          totalGenerations,
          successfulGenerations,
          failedGenerations,
          successRate: totalGenerations > 0 ? (successfulGenerations / totalGenerations) * 100 : 0,
          averageDuration: 0, // Would calculate from completed generations
          popularGenres: [],
          popularMoods: [],
          popularKeys: [],
          peakHours: []
        };

      } catch (error) {
        throw ErrorFactory.fromUnknown(error, 'Failed to get generation analytics');
      }
    });
  };
};

/**
 * Check user quota for generation
 */
async function checkUserQuota(userId: string, request: GenerationRequest): Promise<void> {
  // This would check user's subscription tier and usage limits
  // For now, we'll implement basic checks

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new ValidationError('User not found');
  }

  // Check daily generation limits based on tier
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayGenerations = await prisma.generation.count({
    where: {
      userId,
      createdAt: { gte: today }
    }
  });

  const limits = {
    FREE: 5,
    PREMIUM: 50,
    ENTERPRISE: 500
  };

  const userLimit = limits[user.tier as keyof typeof limits] || 5;

  if (todayGenerations >= userLimit) {
    throw new ValidationError(`Daily generation limit reached for ${user.tier} tier (${userLimit} generations)`);
  }

  // Check if user has active tokens (for free tier)
  if (user.tier === 'FREE') {
    const activeTokens = await prisma.token.count({
      where: {
        userId,
        isActive: true,
        isValid: true
      }
    });

    if (activeTokens === 0) {
      throw new ValidationError('No active tokens available. Please add tokens via browser extension.');
    }
  }
}

/**
 * Calculate estimated wait time
 */
function calculateEstimatedWaitTime(request: GenerationRequest): number {
  // Base time plus complexity modifiers
  let baseTime = 30; // 30 seconds base

  if (request.duration && request.duration > 60) {
    baseTime += (request.duration - 60) * 0.5; // 30s per additional minute
  }

  if (request.complexity && request.complexity > 0.7) {
    baseTime += 15; // Extra time for complex generations
  }

  return Math.min(baseTime, 300); // Max 5 minutes
}

/**
 * Calculate progress percentage
 */
function calculateProgress(status: string): number {
  switch (status) {
    case 'PENDING': return 10;
    case 'PROCESSING': return 50;
    case 'COMPLETED': return 100;
    case 'FAILED': return 0;
    default: return 0;
  }
}

/**
 * Get status message
 */
function getStatusMessage(status: string): string {
  switch (status) {
    case 'PENDING': return 'Queued for processing';
    case 'PROCESSING': return 'Generating music with AI';
    case 'COMPLETED': return 'Generation completed successfully';
    case 'FAILED': return 'Generation failed';
    default: return 'Unknown status';
  }
}

/**
 * Get timeframe in milliseconds
 */
function getTimeframeMs(timeframe: string): number {
  switch (timeframe) {
    case 'hour': return 60 * 60 * 1000;
    case 'day': return 24 * 60 * 60 * 1000;
    case 'week': return 7 * 24 * 60 * 60 * 1000;
    case 'month': return 30 * 24 * 60 * 60 * 1000;
    default: return 7 * 24 * 60 * 60 * 1000;
  }
}
