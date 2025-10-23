/**
 * SON1KVERS3 Backend Server 2.0
 * Unified API with Suno integration, token management, and real-time features
 * Based on the best implementations from ALFASSV, SSV-ALFA, and SSV-BETA
 */

import Fastify from 'fastify';
import WebSocket from '@fastify/websocket';
import SocketIO from 'socket.io';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import { PrismaClient } from '@prisma/client';
import { IncomingMessage, Server, ServerResponse } from 'http';

// Import routes and services
import { authRoutes } from './routes/auth';
import { generationRoutes } from './routes/generation';
import { collaborationRoutes } from './routes/collaboration';
import { userRoutes } from './routes/user';
import { nftRoutes } from './routes/nft';
import { analyticsRoutes } from './routes/analytics';
import { tokenRoutes } from './routes/tokens';
import { extensionRoutes } from './routes/extension';

// Import middleware
import { authMiddleware } from './middleware/auth';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { securityMiddleware } from './middleware/security';
import { errorHandler } from './middleware/errorHandler';
import { tokenValidationMiddleware } from './middleware/tokenValidation';

// Import services
import { TokenManager } from './services/tokenManager';
import { SunoService } from './services/sunoService';
import { CollaborationService } from './services/collaborationService';
import { AnalyticsService } from './services/analyticsService';
import { UserExtensionService } from './services/userExtensionService';
import { TokenPoolService } from './services/tokenPoolService';

// Import WebSocket handlers
import { setupWebSocket } from './services/websocketService';

// Import utilities
import { ValidationError, ErrorFactory } from '@son1kvers3/shared-utils';
import { ENVIRONMENTS, API } from '@son1kvers3/shared-utils';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT ? {
      target: 'pino-pretty'
    } : undefined
  },
  trustProxy: true,
  bodyLimit: 10485760 // 10MB
});

// Initialize Prisma with connection pooling
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Initialize services with all integrations
const tokenManager = new TokenManager(prisma);
const sunoService = new SunoService(tokenManager);
const collaborationService = new CollaborationService(prisma, tokenManager);
const analyticsService = new AnalyticsService(prisma);
const userExtensionService = new UserExtensionService(prisma, tokenManager);
const tokenPoolService = new TokenPoolService(prisma, tokenManager);

// Setup Socket.IO for real-time features
const io = new SocketIO.Server(fastify.server, {
  cors: {
    origin: process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Register plugins
async function registerPlugins() {
  // WebSocket support
  await fastify.register(WebSocket);

  // CORS with comprehensive configuration
  await fastify.register(cors, {
    origin: (origin, cb) => {
      const allowedOrigins = process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000'];
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Request-ID',
      'X-API-Key',
      'X-Token-Hash',
      'User-Agent'
    ],
    exposedHeaders: ['X-Request-ID', 'X-Rate-Limit-Remaining'],
    maxAge: 86400
  });

  // Advanced security headers
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        scriptSrc: ["'self'", 'https://cdn.socket.io'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        connectSrc: ["'self'", 'wss:', 'ws:', 'https:'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", 'blob:', 'data:'],
        frameSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  });

  // Advanced rate limiting with user-based limits
  await fastify.register(rateLimit, {
    max: (req: any) => {
      // Dynamic rate limiting based on user tier
      if (req.user?.tier === 'ENTERPRISE') return 1000;
      if (req.user?.tier === 'PREMIUM') return 100;
      return 10;
    },
    timeWindow: '1 minute',
    cache: 10000,
    allowList: ['127.0.0.1', '::1'],
    keyGenerator: (req: any) => {
      // Use user ID if authenticated, otherwise IP
      return req.user?.id || req.ip || 'anonymous';
    },
    onLimitReached: (req, res) => {
      fastify.log.warn({
        message: 'Rate limit exceeded',
        userId: req.user?.id,
        ip: req.ip,
        url: req.url,
        method: req.method
      });
    }
  });
}

// Global error handler
fastify.setErrorHandler(errorHandler);

// Request ID middleware
fastify.addHook('onRequest', async (request, reply) => {
  request.headers['x-request-id'] = request.headers['x-request-id'] || crypto.randomUUID();
  reply.header('X-Request-ID', request.headers['x-request-id']);
  (request as any).startTime = Date.now();
});

// Request logging middleware
fastify.addHook('onResponse', async (request, reply) => {
  const duration = Date.now() - (request as any).startTime;
  fastify.log.info({
    reqId: request.headers['x-request-id'],
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    duration,
    userAgent: request.headers['user-agent'],
    ip: request.ip,
    userId: (request as any).user?.id
  });

  // Track analytics
  if (duration > 1000) {
    analyticsService.trackRequest({
      userId: (request as any).user?.id,
      endpoint: request.url,
      method: request.method,
      statusCode: reply.statusCode,
      duration,
      timestamp: new Date()
    });
  }
});

// Health check endpoint with comprehensive service status
fastify.get('/health', async (request, reply) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check all services
    const [tokenHealth, sunoHealth, collaborationHealth, analyticsHealth] = await Promise.all([
      tokenManager.healthCheck(),
      sunoService.healthCheck(),
      collaborationService.healthCheck(),
      analyticsService.healthCheck()
    ]);

    const services = {
      database: 'healthy',
      tokenManager: tokenHealth ? 'healthy' : 'degraded',
      sunoService: sunoHealth ? 'healthy' : 'degraded',
      collaborationService: collaborationHealth ? 'healthy' : 'degraded',
      analyticsService: analyticsHealth ? 'healthy' : 'degraded'
    };

    const overallHealth = Object.values(services).every(status => status === 'healthy');

    return {
      status: overallHealth ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: API.VERSION,
      environment: process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT,
      uptime: process.uptime(),
      services,
      activeUsers: await analyticsService.getActiveUserCount(),
      tokenPoolSize: await tokenPoolService.getPoolSize()
    };
  } catch (error) {
    fastify.log.error('Health check failed:', error);
    return reply.code(503).send({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Service unavailable'
    });
  }
});

// API routes registration
async function registerRoutes() {
  // Public routes (no auth required)
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(extensionRoutes(userExtensionService), { prefix: '/api/extension' });

  // Protected routes (auth required)
  fastify.addHook('onRequest', authMiddleware);

  // Token management routes
  await fastify.register(tokenRoutes(tokenManager, tokenPoolService), {
    prefix: '/api/tokens'
  });

  // Generation routes with Suno integration
  await fastify.register(generationRoutes(sunoService, analyticsService), {
    prefix: '/api/generation'
  });

  // Collaboration routes with WebSocket support
  await fastify.register(collaborationRoutes(collaborationService, io), {
    prefix: '/api/collaboration'
  });

  // User management routes
  await fastify.register(userRoutes(prisma, tokenManager, userExtensionService), {
    prefix: '/api/user'
  });

  // NFT marketplace routes
  await fastify.register(nftRoutes(prisma, tokenManager), {
    prefix: '/api/nft'
  });

  // Analytics routes
  await fastify.register(analyticsRoutes(analyticsService), {
    prefix: '/api/analytics'
  });
}

// Setup WebSocket handlers
setupWebSocket(io, collaborationService, analyticsService);

// Graceful shutdown
async function gracefulShutdown(signal: string) {
  fastify.log.info(`Received ${signal}, shutting down gracefully...`);

  // Close WebSocket connections
  io.close();

  // Close database connections
  await prisma.$disconnect();

  // Close all services
  await Promise.all([
    tokenManager.close(),
    sunoService.close(),
    collaborationService.close(),
    analyticsService.close(),
    tokenPoolService.close()
  ]);

  // Close server
  await fastify.close();

  fastify.log.info('Shutdown complete');
  process.exit(0);
}

// Start server
async function start() {
  try {
    // Initialize database connection
    await prisma.$connect();
    fastify.log.info('Database connected successfully');

    // Initialize token pool
    await tokenPoolService.initialize();
    fastify.log.info('Token pool initialized');

    // Register plugins and routes
    await registerPlugins();
    await registerRoutes();

    // Setup WebSocket
    setupWebSocket(io, collaborationService, analyticsService);

    // Start HTTP server
    const port = parseInt(process.env.PORT || '3001');
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });

    fastify.log.info(`🚀 SON1KVERS3 Backend 2.0 running on ${host}:${port}`);
    fastify.log.info(`📊 Environment: ${process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT}`);
    fastify.log.info(`🔗 WebSocket server ready`);
    fastify.log.info(`🎵 Suno integration active`);
    fastify.log.info(`🔐 Advanced token management system active`);
    fastify.log.info(`👥 User extension system active`);
    fastify.log.info(`📈 Analytics and monitoring active`);

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      fastify.log.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      fastify.log.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    fastify.log.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
start();
