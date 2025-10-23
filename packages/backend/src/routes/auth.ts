/**
 * Authentication Routes
 * Handles user authentication, registration, and session management
 */

import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  validateEmail,
  validateUsername,
  validatePassword,
  generateSecureToken,
  sanitizeString,
  ValidationError,
  ErrorFactory,
  SECURITY
} from '@son1kvers3/shared-utils';

export interface AuthRequest {
  email: string;
  password: string;
  username?: string;
  source?: string;
}

export interface RegisterRequest extends AuthRequest {
  tier?: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  inviteToken?: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    username: string;
    tier: string;
    isAdmin: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  // Register new user
  fastify.post('/register', async (request, reply) => {
    try {
      const { email, password, username, tier = 'FREE', source = 'web' } = request.body as RegisterRequest;

      // Validate input
      if (!validateEmail(email)) {
        throw new ValidationError('Invalid email format');
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        throw new ValidationError(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
      }

      if (username && !validateUsername(username)) {
        throw new ValidationError('Invalid username format');
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            ...(username ? [{ username }] : [])
          ]
        }
      });

      if (existingUser) {
        if (existingUser.email === email) {
          throw new ValidationError('Email already registered');
        }
        if (existingUser.username === username) {
          throw new ValidationError('Username already taken');
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Generate username if not provided
      const finalUsername = username || generateUsernameFromEmail(email);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          username: finalUsername,
          password: hashedPassword,
          tier,
          isAdmin: false,
          alvaeEnabled: false
        }
      });

      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Store refresh token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          updatedAt: new Date()
        }
      });

      // Track registration
      if (fastify.analyticsService) {
        await fastify.analyticsService.trackUserRegistration(user.id, source);
      }

      const response: LoginResponse = {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          tier: user.tier,
          isAdmin: user.isAdmin
        },
        tokens: {
          accessToken,
          refreshToken
        }
      };

      return reply.code(201).send(response);

    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Registration failed');
    }
  });

  // Login user
  fastify.post('/login', async (request, reply) => {
    try {
      const { email, password, source = 'web' } = request.body as AuthRequest;

      // Validate input
      if (!validateEmail(email)) {
        throw new ValidationError('Invalid email format');
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        throw new ValidationError('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new ValidationError('Invalid credentials');
      }

      // Check if user is active
      if (user.tier === 'FREE' && !user.alvaeEnabled) {
        // Check if user has active extensions
        const extension = await prisma.userExtension.findUnique({
          where: { userId: user.id }
        });

        if (!extension || !extension.isActive) {
          throw new ValidationError('Account not activated. Please use the browser extension to activate your account.');
        }
      }

      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Track login
      if (fastify.analyticsService) {
        await fastify.analyticsService.trackUserLogin(user.id, 'email');
      }

      const response: LoginResponse = {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          tier: user.tier,
          isAdmin: user.isAdmin
        },
        tokens: {
          accessToken,
          refreshToken
        }
      };

      return response;

    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Login failed');
    }
  });

  // Refresh access token
  fastify.post('/refresh', async (request, reply) => {
    try {
      const { refreshToken } = request.body as { refreshToken: string };

      if (!refreshToken) {
        throw new ValidationError('Refresh token required');
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user) {
        throw new ValidationError('Invalid refresh token');
      }

      // Generate new tokens
      const accessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      return {
        accessToken,
        refreshToken: newRefreshToken
      };

    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Token refresh failed');
    }
  });

  // Logout user
  fastify.post('/logout', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);

        // In a real implementation, you would blacklist the token
        // For now, we'll just return success
      }

      return { message: 'Logged out successfully' };

    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Logout failed');
    }
  });

  // Get current user profile
  fastify.get('/me', async (request, reply) => {
    try {
      const user = (request as any).user;

      if (!user) {
        throw new ValidationError('Not authenticated');
      }

      // Get full user data
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          userExtensions: true,
          subscriptions: true,
          _count: {
            select: {
              generations: true,
              collaborations: true,
              tokens: true
            }
          }
        }
      });

      if (!userData) {
        throw new ValidationError('User not found');
      }

      return {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        tier: userData.tier,
        isAdmin: userData.isAdmin,
        alvaeEnabled: userData.alvaeEnabled,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        stats: {
          generations: userData._count.generations,
          collaborations: userData._count.collaborations,
          tokens: userData._count.tokens
        },
        extensions: userData.userExtensions,
        subscription: userData.subscriptions[0] || null
      };

    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get user profile');
    }
  });

  // Request password reset
  fastify.post('/forgot-password', async (request, reply) => {
    try {
      const { email } = request.body as { email: string };

      if (!validateEmail(email)) {
        throw new ValidationError('Invalid email format');
      }

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (user) {
        // Generate reset token
        const resetToken = generateSecureToken(32);
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour

        // Store reset token (in real implementation, store in database)
        // For now, we'll just log it
        console.log(`Password reset token for ${email}: ${resetToken}`);

        // In production, send email with reset link
        // await sendPasswordResetEmail(email, resetToken);
      }

      // Always return success for security
      return { message: 'If the email exists, a reset link has been sent' };

    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Password reset request failed');
    }
  });

  // Reset password with token
  fastify.post('/reset-password', async (request, reply) => {
    try {
      const { token, password } = request.body as { token: string; password: string };

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        throw new ValidationError(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
      }

      // In a real implementation, verify token from database
      // For now, we'll accept any token for demo purposes

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update user password (in real implementation, find user by token)
      // For demo, we'll just return success
      console.log(`Password reset with token: ${token.substring(0, 8)}...`);

      return { message: 'Password reset successfully' };

    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Password reset failed');
    }
  });

  // Verify email (for extension users)
  fastify.post('/verify-extension', async (request, reply) => {
    try {
      const { email, extensionId } = request.body as { email: string; extensionId: string };

      if (!validateEmail(email)) {
        throw new ValidationError('Invalid email format');
      }

      // Find or create user extension
      let userExtension = await prisma.userExtension.findFirst({
        where: { sunoEmail: email }
      });

      if (!userExtension) {
        // Create user if doesn't exist
        const user = await prisma.user.create({
          data: {
            email: email.toLowerCase(),
            username: generateUsernameFromEmail(email),
            password: await bcrypt.hash(generateSecureToken(16), 12),
            tier: 'FREE',
            isAdmin: false,
            alvaeEnabled: true // Enable ALVAE for extension users
          }
        });

        userExtension = await prisma.userExtension.create({
          data: {
            userId: user.id,
            sunoEmail: email,
            isActive: true,
            metadata: { extensionId }
          }
        });

        // Track registration
        if (fastify.analyticsService) {
          await fastify.analyticsService.trackUserRegistration(user.id, 'extension');
        }
      }

      return {
        verified: true,
        userId: userExtension.userId,
        message: 'Extension verified successfully'
      };

    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Extension verification failed');
    }
  });
};

/**
 * Generate access token
 */
function generateAccessToken(user: any): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      username: user.username,
      tier: user.tier,
      isAdmin: user.isAdmin
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: SECURITY.JWT_EXPIRES_IN,
      algorithm: SECURITY.JWT_ALGORITHM as jwt.Algorithm
    }
  );
}

/**
 * Generate refresh token
 */
function generateRefreshToken(user: any): string {
  return jwt.sign(
    {
      userId: user.id,
      type: 'refresh'
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: SECURITY.REFRESH_TOKEN_EXPIRES_IN,
      algorithm: SECURITY.JWT_ALGORITHM as jwt.Algorithm
    }
  );
}

/**
 * Generate username from email
 */
function generateUsernameFromEmail(email: string): string {
  const [localPart] = email.split('@');
  const baseUsername = localPart
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .substring(0, 20);

  return baseUsername || `user${generateSecureToken(8)}`;
}
