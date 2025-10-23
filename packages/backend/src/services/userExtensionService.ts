/**
 * User Extension Service
 * Handles browser extension integration for token harvesting and user account creation
 */

import { PrismaClient } from '@prisma/client';
import { EventEmitter } from 'events';
import axios from 'axios';
import {
  generateSecureToken,
  generateAPIKey,
  hashForLogging,
  sanitizeForLogging,
  validateEmail,
  validateUsername,
  validatePassword,
  ValidationError,
  ErrorFactory
} from '@son1kvers3/shared-utils';

export interface ExtensionData {
  email: string;
  sunoToken?: string;
  userAgent: string;
  ipAddress: string;
  metadata: Record<string, any>;
}

export interface TokenCaptureRequest {
  email: string;
  token: string;
  source: 'extension' | 'manual' | 'api';
  metadata?: Record<string, any>;
}

export interface UserCreationRequest {
  email: string;
  username?: string;
  password?: string;
  tier?: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  source: 'extension' | 'manual' | 'api';
  metadata?: Record<string, any>;
}

export interface ExtensionStats {
  totalExtensions: number;
  activeExtensions: number;
  totalTokensCaptured: number;
  totalUsersCreated: number;
  successRate: number;
  averageTokensPerUser: number;
}

export class UserExtensionService extends EventEmitter {
  private extensionClients: Map<string, { lastSeen: Date; data: ExtensionData }> = new Map();
  private cleanupInterval?: NodeJS.Timeout;

  constructor(private prisma: PrismaClient, private tokenManager: any) {
    super();

    this.initializeCleanup();
    this.listenForTokenEvents();
  }

  /**
   * Initialize cleanup interval for inactive extensions
   */
  private initializeCleanup() {
    this.cleanupInterval = setInterval(async () => {
      await this.cleanupInactiveExtensions();
    }, 3600000); // Every hour
  }

  /**
   * Listen for token manager events
   */
  private listenForTokenEvents() {
    this.tokenManager.on('tokenAdded', this.handleTokenAdded.bind(this));
    this.tokenManager.on('tokenError', this.handleTokenError.bind(this));
  }

  /**
   * Register extension client
   */
  async registerExtension(extensionId: string, data: ExtensionData): Promise<boolean> {
    try {
      // Validate email
      if (!validateEmail(data.email)) {
        throw new ValidationError('Invalid email format');
      }

      // Update or create extension record
      await this.prisma.userExtension.upsert({
        where: { userId: extensionId },
        update: {
          sunoEmail: data.email,
          sunoToken: data.sunoToken,
          lastSync: new Date(),
          syncCount: { increment: 1 },
          metadata: data.metadata,
          isActive: true
        },
        create: {
          userId: extensionId,
          sunoEmail: data.email,
          sunoToken: data.sunoToken,
          isActive: true,
          syncCount: 1,
          metadata: data.metadata
        }
      });

      // Update in-memory cache
      this.extensionClients.set(extensionId, {
        lastSeen: new Date(),
        data
      });

      this.emit('extensionRegistered', { extensionId, email: data.email });

      return true;
    } catch (error) {
      this.emit('extensionError', { error, operation: 'registerExtension', extensionId });
      throw ErrorFactory.fromUnknown(error, 'Failed to register extension');
    }
  }

  /**
   * Capture token from extension
   */
  async captureToken(request: TokenCaptureRequest): Promise<{ success: boolean; tokenId?: string; message: string }> {
    try {
      // Validate request
      if (!validateEmail(request.email)) {
        throw new ValidationError('Invalid email format');
      }

      if (!request.token || request.token.length < 20) {
        throw new ValidationError('Invalid token format');
      }

      // Find or create user extension
      let userExtension = await this.prisma.userExtension.findFirst({
        where: { sunoEmail: request.email }
      });

      if (!userExtension) {
        // Create new user if doesn't exist
        const user = await this.createUserFromExtension({
          email: request.email,
          source: request.source,
          metadata: request.metadata
        });

        userExtension = await this.prisma.userExtension.create({
          data: {
            userId: user.id,
            sunoEmail: request.email,
            sunoToken: request.token,
            isActive: true,
            syncCount: 1,
            metadata: request.metadata || {}
          }
        });
      } else {
        // Update existing extension
        userExtension = await this.prisma.userExtension.update({
          where: { id: userExtension.id },
          data: {
            sunoToken: request.token,
            lastSync: new Date(),
            syncCount: { increment: 1 },
            metadata: request.metadata || {}
          }
        });
      }

      // Add token to token manager
      const tokenId = await this.tokenManager.addToken(
        request.token,
        userExtension.userId,
        request.email,
        'FREE', // Default tier
        {
          source: request.source,
          extensionId: userExtension.id,
          capturedAt: new Date(),
          ...request.metadata
        }
      );

      this.emit('tokenCaptured', {
        tokenId,
        email: request.email,
        source: request.source,
        userId: userExtension.userId
      });

      return {
        success: true,
        tokenId,
        message: 'Token captured successfully'
      };

    } catch (error) {
      this.emit('tokenCaptureError', { error, request: sanitizeForLogging(request) });
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to capture token'
      };
    }
  }

  /**
   * Create user from extension data
   */
  async createUserFromExtension(request: UserCreationRequest): Promise<any> {
    try {
      // Validate request
      if (!validateEmail(request.email)) {
        throw new ValidationError('Invalid email format');
      }

      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: request.email }
      });

      if (existingUser) {
        return existingUser;
      }

      // Generate username if not provided
      const username = request.username || this.generateUsernameFromEmail(request.email);

      // Validate username
      if (!validateUsername(username)) {
        throw new ValidationError('Invalid username format');
      }

      // Generate password if not provided
      const password = request.password || generateSecureToken(16);

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: request.email,
          username,
          password: hashedPassword,
          tier: request.tier || 'FREE',
          isAdmin: false,
          alvaeEnabled: false
        }
      });

      // Create user extension record
      await this.prisma.userExtension.create({
        data: {
          userId: user.id,
          sunoEmail: request.email,
          isActive: true,
          metadata: request.metadata || {}
        }
      });

      this.emit('userCreatedFromExtension', {
        userId: user.id,
        email: request.email,
        source: request.source
      });

      return user;

    } catch (error) {
      this.emit('userCreationError', { error, request: sanitizeForLogging(request) });
      throw ErrorFactory.fromUnknown(error, 'Failed to create user from extension');
    }
  }

  /**
   * Generate username from email
   */
  private generateUsernameFromEmail(email: string): string {
    const [localPart] = email.split('@');
    const baseUsername = localPart
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .substring(0, 20);

    return baseUsername || `user${generateSecureToken(8)}`;
  }

  /**
   * Hash password using bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    const bcrypt = require('bcryptjs');
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Sync extension data
   */
  async syncExtensionData(extensionId: string, data: Partial<ExtensionData>): Promise<boolean> {
    try {
      const extension = await this.prisma.userExtension.findFirst({
        where: { userId: extensionId }
      });

      if (!extension) {
        throw new ValidationError('Extension not found');
      }

      // Update extension data
      await this.prisma.userExtension.update({
        where: { id: extension.id },
        data: {
          sunoEmail: data.email || extension.sunoEmail,
          sunoToken: data.sunoToken || extension.sunoToken,
          lastSync: new Date(),
          syncCount: { increment: 1 },
          metadata: data.metadata || extension.metadata,
          isActive: data.email ? true : extension.isActive
        }
      });

      // Update in-memory cache
      const cachedData = this.extensionClients.get(extensionId);
      if (cachedData) {
        cachedData.lastSeen = new Date();
        cachedData.data = { ...cachedData.data, ...data };
      }

      this.emit('extensionSynced', { extensionId, data });

      return true;
    } catch (error) {
      this.emit('extensionError', { error, operation: 'syncExtensionData', extensionId });
      return false;
    }
  }

  /**
   * Get extension statistics
   */
  async getExtensionStats(): Promise<ExtensionStats> {
    try {
      const [
        totalExtensions,
        activeExtensions,
        totalTokensCaptured,
        totalUsersCreated
      ] = await Promise.all([
        this.prisma.userExtension.count(),
        this.prisma.userExtension.count({ where: { isActive: true } }),
        this.prisma.token.count(),
        this.prisma.user.count()
      ]);

      const averageTokensPerUser = totalUsersCreated > 0 ? totalTokensCaptured / totalUsersCreated : 0;

      // Calculate success rate (simplified)
      const successRate = Math.min(100, (activeExtensions / Math.max(totalExtensions, 1)) * 100);

      return {
        totalExtensions,
        activeExtensions,
        totalTokensCaptured,
        totalUsersCreated,
        successRate,
        averageTokensPerUser
      };
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get extension statistics');
    }
  }

  /**
   * Validate extension token
   */
  async validateExtensionToken(extensionId: string, providedToken: string): Promise<boolean> {
    try {
      const extension = await this.prisma.userExtension.findFirst({
        where: { userId: extensionId }
      });

      if (!extension || !extension.isActive) {
        return false;
      }

      // Simple token validation - in production, use proper JWT validation
      const tokenHash = hashForLogging(providedToken);
      const storedToken = await this.prisma.token.findFirst({
        where: {
          hash: tokenHash,
          userId: extensionId,
          isActive: true
        }
      });

      return !!storedToken;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user tokens from extension
   */
  async getUserTokens(userId: string): Promise<any[]> {
    try {
      const tokens = await this.prisma.token.findMany({
        where: { userId, isActive: true },
        orderBy: { createdAt: 'desc' }
      });

      return tokens.map(token => ({
        id: token.id,
        tier: token.tier,
        usageCount: token.usageCount,
        lastUsed: token.lastUsed,
        createdAt: token.createdAt,
        isValid: token.isValid
      }));
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get user tokens');
    }
  }

  /**
   * Remove extension
   */
  async removeExtension(extensionId: string): Promise<boolean> {
    try {
      // Deactivate extension
      await this.prisma.userExtension.updateMany({
        where: { userId: extensionId },
        data: { isActive: false }
      });

      // Remove associated tokens
      await this.prisma.token.updateMany({
        where: { userId: extensionId },
        data: { isActive: false }
      });

      // Remove from cache
      this.extensionClients.delete(extensionId);

      this.emit('extensionRemoved', { extensionId });

      return true;
    } catch (error) {
      this.emit('extensionError', { error, operation: 'removeExtension', extensionId });
      return false;
    }
  }

  /**
   * Cleanup inactive extensions
   */
  private async cleanupInactiveExtensions() {
    try {
      const inactiveThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days

      const inactiveExtensions = await this.prisma.userExtension.findMany({
        where: {
          lastSync: {
            lt: inactiveThreshold
          },
          isActive: true
        }
      });

      for (const extension of inactiveExtensions) {
        await this.prisma.userExtension.update({
          where: { id: extension.id },
          data: { isActive: false }
        });

        this.extensionClients.delete(extension.userId);
      }

      if (inactiveExtensions.length > 0) {
        console.log(`Cleaned up ${inactiveExtensions.length} inactive extensions`);
      }
    } catch (error) {
      console.error('Extension cleanup failed:', error);
    }
  }

  /**
   * Handle token added event
   */
  private handleTokenAdded(data: { tokenId: string; tier: string; userId?: string }) {
    this.emit('tokenFromExtension', data);
  }

  /**
   * Handle token error event
   */
  private handleTokenError(data: { error: any; operation: string }) {
    this.emit('tokenError', data);
  }

  /**
   * Get active extensions
   */
  async getActiveExtensions(): Promise<any[]> {
    try {
      return await this.prisma.userExtension.findMany({
        where: { isActive: true },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              tier: true
            }
          }
        },
        orderBy: { lastSync: 'desc' }
      });
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get active extensions');
    }
  }

  /**
   * Send notification to extension
   */
  async sendNotificationToExtension(extensionId: string, notification: {
    type: string;
    title: string;
    message: string;
    data?: any;
  }): Promise<boolean> {
    try {
      // In a real implementation, this would send a push notification or WebSocket message
      // For now, we'll just log it

      this.emit('extensionNotification', {
        extensionId,
        notification,
        timestamp: new Date()
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Update extension metadata
   */
  async updateExtensionMetadata(extensionId: string, metadata: Record<string, any>): Promise<boolean> {
    try {
      await this.prisma.userExtension.updateMany({
        where: { userId: extensionId },
        data: {
          metadata,
          updatedAt: new Date()
        }
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get extension by user ID
   */
  async getExtensionByUserId(userId: string): Promise<any | null> {
    try {
      return await this.prisma.userExtension.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              tier: true
            }
          }
        }
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Close service and cleanup
   */
  async close() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.extensionClients.clear();
    this.removeAllListeners();
  }
}
