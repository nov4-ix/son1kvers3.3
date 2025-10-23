/**
 * Authentication Middleware
 * Validates JWT tokens and manages user sessions
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import {
  ValidationError,
  ErrorFactory,
  SECURITY
} from '@son1kvers3/shared-utils';

export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  tier: string;
  isAdmin: boolean;
  alvaeEnabled: boolean;
}

export interface AuthenticatedRequest extends FastifyRequest {
  user: AuthenticatedUser;
}

/**
 * Authentication middleware
 */
export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Authorization token required'
        }
      });
    }

    const token = authHeader.substring(7);

    if (!token) {
      return reply.code(401).send({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid authorization token'
        }
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: [SECURITY.JWT_ALGORITHM as jwt.Algorithm]
    }) as any;

    if (!decoded.userId) {
      return reply.code(401).send({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid token payload'
        }
      });
    }

    // Get user from database
    const user = await request.server.prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return reply.code(401).send({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Check if user is active
    if (user.tier === 'FREE' && !user.alvaeEnabled) {
      // Check if user has active extensions
      const extension = await request.server.prisma.userExtension.findUnique({
        where: { userId: user.id }
      });

      if (!extension || !extension.isActive) {
        return reply.code(403).send({
          success: false,
          error: {
            code: 'ACCOUNT_NOT_ACTIVATED',
            message: 'Account not activated. Please use the browser extension to activate your account.'
          }
        });
      }
    }

    // Attach user to request
    (request as any).user = {
      id: user.id,
      email: user.email,
      username: user.username,
      tier: user.tier,
      isAdmin: user.isAdmin,
      alvaeEnabled: user.alvaeEnabled
    };

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return reply.code(401).send({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token'
        }
      });
    }

    if (error instanceof jwt.TokenExpiredError) {
      return reply.code(401).send({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Token has expired'
        }
      });
    }

    console.error('Auth middleware error:', error);
    return reply.code(500).send({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Authentication failed'
      }
    });
  }
}

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export async function optionalAuthMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      if (token) {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
          algorithms: [SECURITY.JWT_ALGORITHM as jwt.Algorithm]
        }) as any;

        if (decoded.userId) {
          // Get user from database
          const user = await request.server.prisma.user.findUnique({
            where: { id: decoded.userId }
          });

          if (user) {
            // Attach user to request
            (request as any).user = {
              id: user.id,
              email: user.email,
              username: user.username,
              tier: user.tier,
              isAdmin: user.isAdmin,
              alvaeEnabled: user.alvaeEnabled
            };
          }
        }
      }
    }
  } catch (error) {
    // Ignore auth errors for optional middleware
    console.debug('Optional auth failed:', error);
  }
}

/**
 * Admin-only middleware
 */
export async function adminMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    // First run auth middleware
    await authMiddleware(request, reply);

    const user = (request as any).user;

    if (!user || !user.isAdmin) {
      return reply.code(403).send({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Admin access required'
        }
      });
    }

  } catch (error) {
    throw ErrorFactory.fromUnknown(error, 'Admin authentication failed');
  }
}

/**
 * Premium tier middleware
 */
export async function premiumMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    // First run auth middleware
    await authMiddleware(request, reply);

    const user = (request as any).user;

    if (!user) {
      return reply.code(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    const premiumTiers = ['PREMIUM', 'ENTERPRISE'];
    if (!premiumTiers.includes(user.tier)) {
      return reply.code(403).send({
        success: false,
        error: {
          code: 'INSUFFICIENT_TIER',
          message: 'Premium subscription required'
        }
      });
    }

  } catch (error) {
    throw ErrorFactory.fromUnknown(error, 'Premium authentication failed');
  }
}

/**
 * Enterprise tier middleware
 */
export async function enterpriseMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    // First run auth middleware
    await authMiddleware(request, reply);

    const user = (request as any).user;

    if (!user) {
      return reply.code(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    if (user.tier !== 'ENTERPRISE') {
      return reply.code(403).send({
        success: false,
        error: {
          code: 'INSUFFICIENT_TIER',
          message: 'Enterprise subscription required'
        }
      });
    }

  } catch (error) {
    throw ErrorFactory.fromUnknown(error, 'Enterprise authentication failed');
  }
}
