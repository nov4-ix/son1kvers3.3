/**
 * Suno API Service
 * Handles music generation, token optimization, and API interactions
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { EventEmitter } from 'events';
import {
  generateSecureToken,
  sanitizeForLogging,
  ValidationError,
  ErrorFactory,
  validateGenerationParameters
} from '@son1kvers3/shared-utils';

export interface SunoGenerationRequest {
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
}

export interface SunoGenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  prompt: string;
  audio_url?: string;
  image_url?: string;
  video_url?: string;
  duration?: number;
  metadata?: Record<string, any>;
  error?: string;
  created_at: string;
  completed_at?: string;
}

export interface SunoUserProfile {
  id: string;
  email: string;
  display_name?: string;
  subscription_tier: string;
  usage_quota: {
    used: number;
    total: number;
    reset_date: string;
  };
  created_at: string;
}

export interface SunoServiceStats {
  totalGenerations: number;
  successfulGenerations: number;
  failedGenerations: number;
  averageResponseTime: number;
  lastHealthCheck: Date;
  isHealthy: boolean;
}

export class SunoService extends EventEmitter {
  private axiosInstance: AxiosInstance;
  private stats: SunoServiceStats;
  private healthCheckInterval?: NodeJS.Timeout;
  private requestQueue: Array<{
    request: SunoGenerationRequest;
    resolve: (value: SunoGenerationResponse) => void;
    reject: (error: Error) => void;
    startTime: number;
  }> = [];
  private isProcessingQueue = false;

  constructor(private tokenManager: any) {
    super();

    this.stats = {
      totalGenerations: 0,
      successfulGenerations: 0,
      failedGenerations: 0,
      averageResponseTime: 0,
      lastHealthCheck: new Date(),
      isHealthy: false
    };

    this.initializeAxios();
    this.initializeHealthCheck();
    this.processQueue();

    // Listen for token events
    this.tokenManager.on('tokenError', this.handleTokenError.bind(this));
  }

  /**
   * Initialize axios instance
   */
  private initializeAxios() {
    this.axiosInstance = axios.create({
      timeout: 60000, // 60 seconds
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SON1KVERS3/2.0'
      }
    });

    // Request interceptor for token management
    this.axiosInstance.interceptors.request.use(async (config) => {
      const tokenData = await this.tokenManager.getHealthyToken();

      if (!tokenData) {
        throw new Error('No healthy tokens available');
      }

      config.headers.Authorization = `Bearer ${tokenData.token}`;

      // Add request ID for tracking
      config.headers['X-Request-ID'] = generateSecureToken(16);

      return config;
    });

    // Response interceptor for usage tracking
    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.trackRequestSuccess(response);
        return response;
      },
      (error) => {
        this.trackRequestError(error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Initialize health check
   */
  private initializeHealthCheck() {
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, 30000); // Every 30 seconds
  }

  /**
   * Generate music using Suno API
   */
  async generateMusic(request: SunoGenerationRequest, userId?: string): Promise<SunoGenerationResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        // Validate request parameters
        const validation = validateGenerationParameters(request);
        if (!validation.valid) {
          throw new ValidationError(`Invalid generation parameters: ${validation.errors.join(', ')}`);
        }

        // Add to queue
        this.requestQueue.push({
          request,
          resolve,
          reject,
          startTime: Date.now()
        });

        // Process queue if not already processing
        if (!this.isProcessingQueue) {
          this.processQueue();
        }

      } catch (error) {
        reject(ErrorFactory.fromUnknown(error, 'Failed to queue music generation'));
      }
    });
  }

  /**
   * Process the request queue
   */
  private async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const queueItem = this.requestQueue.shift()!;
      if (!queueItem) continue;

      try {
        const result = await this.executeGeneration(queueItem.request, queueItem.startTime);
        queueItem.resolve(result);
      } catch (error) {
        queueItem.reject(error instanceof Error ? error : new Error(String(error)));
      }

      // Small delay between requests to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.isProcessingQueue = false;
  }

  /**
   * Execute generation request
   */
  private async executeGeneration(request: SunoGenerationRequest, startTime: number): Promise<SunoGenerationResponse> {
    try {
      const response = await this.axiosInstance.post('/generate', {
        prompt: request.prompt,
        duration: request.duration || 60,
        tempo: request.tempo || 120,
        key: request.key || 'C',
        genre: request.genre || 'pop',
        mood: request.mood || 'energetic',
        instruments: request.instruments || ['piano', 'drums'],
        style: request.style || 'modern',
        complexity: request.complexity || 0.7,
        temperature: request.temperature || 0.8,
        seed: request.seed
      });

      const generationData: SunoGenerationResponse = {
        id: response.data.id || generateSecureToken(16),
        status: 'pending',
        prompt: request.prompt,
        created_at: new Date().toISOString(),
        metadata: {
          duration: request.duration,
          tempo: request.tempo,
          key: request.key,
          genre: request.genre,
          mood: request.mood,
          instruments: request.instruments,
          style: request.style,
          complexity: request.complexity,
          temperature: request.temperature,
          seed: request.seed
        }
      };

      // Update stats
      this.stats.totalGenerations++;
      this.updateAverageResponseTime(Date.now() - startTime);

      // Start polling for completion
      this.pollGenerationStatus(generationData.id);

      return generationData;

    } catch (error) {
      this.stats.failedGenerations++;
      throw ErrorFactory.fromUnknown(error, 'Music generation failed');
    }
  }

  /**
   * Poll generation status until completion
   */
  private async pollGenerationStatus(generationId: string) {
    const pollInterval = setInterval(async () => {
      try {
        const response = await this.axiosInstance.get(`/generate/${generationId}`);

        if (response.data.status === 'completed') {
          clearInterval(pollInterval);
          this.stats.successfulGenerations++;
          this.emit('generationCompleted', response.data);
        } else if (response.data.status === 'failed') {
          clearInterval(pollInterval);
          this.stats.failedGenerations++;
          this.emit('generationFailed', { id: generationId, error: response.data.error });
        }
        // Continue polling for 'pending' or 'processing' status

      } catch (error) {
        clearInterval(pollInterval);
        this.emit('generationError', { id: generationId, error });
      }
    }, 5000); // Poll every 5 seconds

    // Stop polling after 10 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      this.emit('generationTimeout', { id: generationId });
    }, 600000);
  }

  /**
   * Get user profile from Suno
   */
  async getUserProfile(): Promise<SunoUserProfile> {
    try {
      const response = await this.axiosInstance.get('/me');
      return response.data;
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get user profile');
    }
  }

  /**
   * Get generation history
   */
  async getGenerationHistory(limit: number = 20, offset: number = 0): Promise<SunoGenerationResponse[]> {
    try {
      const response = await this.axiosInstance.get('/generate', {
        params: { limit, offset }
      });
      return response.data.generations || [];
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get generation history');
    }
  }

  /**
   * Get specific generation by ID
   */
  async getGeneration(generationId: string): Promise<SunoGenerationResponse> {
    try {
      const response = await this.axiosInstance.get(`/generate/${generationId}`);
      return response.data;
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get generation');
    }
  }

  /**
   * Delete generation
   */
  async deleteGeneration(generationId: string): Promise<boolean> {
    try {
      await this.axiosInstance.delete(`/generate/${generationId}`);
      return true;
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to delete generation');
    }
  }

  /**
   * Get available styles and genres
   */
  async getAvailableOptions(): Promise<{
    genres: string[];
    moods: string[];
    instruments: string[];
    styles: string[];
    keys: string[];
  }> {
    try {
      const response = await this.axiosInstance.get('/options');
      return response.data;
    } catch (error) {
      // Return default options if API doesn't provide them
      return {
        genres: ['pop', 'rock', 'electronic', 'classical', 'jazz', 'hip-hop', 'ambient'],
        moods: ['happy', 'sad', 'energetic', 'calm', 'aggressive', 'peaceful'],
        instruments: ['piano', 'guitar', 'drums', 'bass', 'violin', 'synthesizer'],
        styles: ['modern', 'classical', 'electronic', 'acoustic', 'orchestral'],
        keys: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
      };
    }
  }

  /**
   * Track successful request
   */
  private trackRequestSuccess(response: AxiosResponse) {
    const responseTime = Date.now() - (response.config as any).startTime;

    this.tokenManager.updateTokenUsage(
      (response.config.headers as any)['X-Token-ID'],
      {
        endpoint: response.config.url || '',
        method: response.config.method || 'GET',
        statusCode: response.status,
        responseTime,
        timestamp: new Date()
      }
    );
  }

  /**
   * Track failed request
   */
  private trackRequestError(error: any) {
    if (error.response) {
      const responseTime = Date.now() - (error.config as any).startTime;

      this.tokenManager.updateTokenUsage(
        (error.config.headers as any)['X-Token-ID'],
        {
          endpoint: error.config.url || '',
          method: error.config.method || 'GET',
          statusCode: error.response.status,
          responseTime,
          timestamp: new Date(),
          error: error.message
        }
      );
    }
  }

  /**
   * Update average response time
   */
  private updateAverageResponseTime(responseTime: number) {
    this.stats.averageResponseTime =
      (this.stats.averageResponseTime * (this.stats.totalGenerations - 1) + responseTime) /
      this.stats.totalGenerations;
  }

  /**
   * Perform health check
   */
  private async performHealthCheck(): Promise<boolean> {
    try {
      const tokenData = await this.tokenManager.getHealthyToken();

      if (!tokenData) {
        this.stats.isHealthy = false;
        return false;
      }

      // Test API connectivity
      const response = await this.axiosInstance.get('/me', {
        timeout: 10000
      });

      this.stats.isHealthy = response.status === 200;
      this.stats.lastHealthCheck = new Date();

      return this.stats.isHealthy;
    } catch (error) {
      this.stats.isHealthy = false;
      this.emit('healthCheckFailed', error);
      return false;
    }
  }

  /**
   * Health check method for external services
   */
  async healthCheck(): Promise<boolean> {
    return this.stats.isHealthy;
  }

  /**
   * Get service statistics
   */
  getStats(): SunoServiceStats {
    return { ...this.stats };
  }

  /**
   * Handle token error
   */
  private handleTokenError(data: { error: any; operation: string }) {
    this.emit('tokenError', data);
  }

  /**
   * Get queue status
   */
  getQueueStatus(): {
    queueLength: number;
    isProcessing: boolean;
    averageWaitTime: number;
  } {
    const averageWaitTime = this.requestQueue.length * 1000; // Rough estimate

    return {
      queueLength: this.requestQueue.length,
      isProcessing: this.isProcessingQueue,
      averageWaitTime
    };
  }

  /**
   * Clear request queue
   */
  clearQueue() {
    this.requestQueue.forEach(item => {
      item.reject(new Error('Queue cleared'));
    });
    this.requestQueue = [];
  }

  /**
   * Close service and cleanup
   */
  async close() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.clearQueue();
    this.removeAllListeners();
  }
}
