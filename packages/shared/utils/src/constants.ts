/**
 * Constants for SON1KVERS3 platform
 */

// Audio constants
export const AUDIO_CONSTANTS = {
  SAMPLE_RATE: 44100,
  DEFAULT_BPM: 120,
  MIN_BPM: 60,
  MAX_BPM: 200,
  DEFAULT_KEY: 'C',
  MIN_DURATION: 1, // seconds
  MAX_DURATION: 600, // seconds (10 minutes)
  DEFAULT_FADE_DURATION: 100, // milliseconds
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  CHUNK_SIZE: 8192, // samples per chunk for processing
} as const;

// File format constants
export const FILE_FORMATS = {
  AUDIO: {
    SUPPORTED: ['mp3', 'wav', 'flac', 'ogg', 'm4a', 'aac'],
    LOSSLESS: ['wav', 'flac'],
    LOSSY: ['mp3', 'ogg', 'm4a', 'aac']
  },
  IMAGE: {
    SUPPORTED: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    ANIMATED: ['gif', 'webp']
  },
  VIDEO: {
    SUPPORTED: ['mp4', 'webm', 'mov', 'avi']
  }
} as const;

// Quality presets
export const QUALITY_PRESETS = {
  LOW: {
    bitrate: 128,
    sampleRate: 22050,
    channels: 1
  },
  MEDIUM: {
    bitrate: 192,
    sampleRate: 44100,
    channels: 2
  },
  HIGH: {
    bitrate: 320,
    sampleRate: 44100,
    channels: 2
  },
  LOSSLESS: {
    bitrate: 1411,
    sampleRate: 44100,
    channels: 2
  }
} as const;

// Musical constants
export const MUSICAL_CONSTANTS = {
  NOTES: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  SCALES: {
    MAJOR: [0, 2, 4, 5, 7, 9, 11],
    MINOR: [0, 2, 3, 5, 7, 8, 10],
    PENTATONIC: [0, 2, 4, 7, 9]
  },
  CHORDS: {
    MAJOR: [0, 4, 7],
    MINOR: [0, 3, 7],
    DIMINISHED: [0, 3, 6],
    AUGMENTED: [0, 4, 8],
    MAJOR7: [0, 4, 7, 11],
    MINOR7: [0, 3, 7, 10]
  },
  A4_FREQUENCY: 440,
  OCTAVE_COUNT: 10
} as const;

// Rate limiting constants
export const RATE_LIMITS = {
  FREE: {
    REQUESTS_PER_MINUTE: 10,
    GENERATIONS_PER_HOUR: 5,
    UPLOAD_SIZE_MB: 10
  },
  PREMIUM: {
    REQUESTS_PER_MINUTE: 100,
    GENERATIONS_PER_HOUR: 50,
    UPLOAD_SIZE_MB: 50
  },
  ENTERPRISE: {
    REQUESTS_PER_MINUTE: 1000,
    GENERATIONS_PER_HOUR: 500,
    UPLOAD_SIZE_MB: 100
  }
} as const;

// Pagination constants
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1
} as const;

// Search constants
export const SEARCH = {
  MAX_QUERY_LENGTH: 200,
  MIN_QUERY_LENGTH: 1,
  MAX_RESULTS: 1000,
  FACET_LIMIT: 50
} as const;

// Collaboration constants
export const COLLABORATION = {
  MAX_PARTICIPANTS: 10,
  MAX_TRACKS: 50,
  MAX_PROJECT_SIZE_MB: 500,
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
  MAX_CHAT_MESSAGES: 1000
} as const;

// NFT constants
export const NFT = {
  MAX_SUPPLY: 10000,
  MIN_PRICE: 0.001, // ETH
  MAX_ROYALTY_PERCENTAGE: 50,
  METADATA_VERSION: '1.0',
  SUPPORTED_CHAINS: ['ethereum', 'polygon', 'arbitrum']
} as const;

// Social constants
export const SOCIAL = {
  MAX_USERNAME_LENGTH: 30,
  MIN_USERNAME_LENGTH: 3,
  MAX_BIO_LENGTH: 500,
  MAX_POST_LENGTH: 2000,
  MAX_COMMENT_LENGTH: 500,
  MAX_TAG_LENGTH: 50,
  MAX_TAGS_PER_POST: 10,
  MAX_MENTIONS_PER_POST: 10
} as const;

// Analytics constants
export const ANALYTICS = {
  RETENTION_DAYS: 90,
  BATCH_SIZE: 1000,
  FLUSH_INTERVAL: 60000, // 1 minute
  MAX_EVENTS_PER_SESSION: 1000
} as const;

// Cache constants
export const CACHE = {
  DEFAULT_TTL: 300, // 5 minutes
  USER_TTL: 3600, // 1 hour
  SESSION_TTL: 86400, // 24 hours
  GENERATION_TTL: 7200, // 2 hours
  ANALYTICS_TTL: 86400 // 24 hours
} as const;

// WebSocket constants
export const WEBSOCKET = {
  HEARTBEAT_INTERVAL: 30000, // 30 seconds
  MAX_CONNECTIONS_PER_USER: 5,
  MESSAGE_SIZE_LIMIT: 65536, // 64KB
  RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 1000 // 1 second
} as const;

// API constants
export const API = {
  VERSION: '2.0',
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  MAX_REQUEST_SIZE: 10485760, // 10MB
  MAX_RESPONSE_SIZE: 104857600, // 100MB
  REQUEST_ID_HEADER: 'x-request-id'
} as const;

// Security constants
export const SECURITY = {
  JWT_ALGORITHM: 'HS256',
  JWT_EXPIRES_IN: '24h',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  PASSWORD_MIN_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 900000, // 15 minutes
  SESSION_TIMEOUT: 86400000, // 24 hours
  API_KEY_LENGTH: 32
} as const;

// Content moderation constants
export const MODERATION = {
  MAX_REPORTS_PER_DAY: 10,
  AUTO_MODERATION_THRESHOLD: 0.8,
  REVIEW_QUEUE_SIZE: 100,
  ESCALATION_THRESHOLD: 5
} as const;

// Mobile/PWA constants
export const MOBILE = {
  MAX_OFFLINE_QUEUE_SIZE: 100,
  SYNC_INTERVAL: 300000, // 5 minutes
  MAX_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
  PUSH_NOTIFICATION_TTL: 86400 // 24 hours
} as const;

// Performance constants
export const PERFORMANCE = {
  MAX_CONCURRENT_GENERATIONS: 10,
  GENERATION_TIMEOUT: 300000, // 5 minutes
  UPLOAD_TIMEOUT: 600000, // 10 minutes
  PROCESSING_TIMEOUT: 1800000, // 30 minutes
  CLEANUP_INTERVAL: 3600000 // 1 hour
} as const;

// Feature flags
export const FEATURES = {
  COLLABORATION: true,
  NFT_MARKETPLACE: true,
  SOCIAL_FEED: true,
  REAL_TIME_AUDIO: true,
  ADVANCED_ANALYTICS: true,
  MOBILE_APP: true,
  PWA: true,
  OFFLINE_MODE: true
} as const;

// Error codes
export const ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',

  // Rate limiting errors
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_FORMAT: 'INVALID_FORMAT',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT',

  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  RESOURCE_LOCKED: 'RESOURCE_LOCKED',

  // Generation errors
  GENERATION_FAILED: 'GENERATION_FAILED',
  MODEL_UNAVAILABLE: 'MODEL_UNAVAILABLE',
  INSUFFICIENT_RESOURCES: 'INSUFFICIENT_RESOURCES',

  // Collaboration errors
  COLLABORATION_FULL: 'COLLABORATION_FULL',
  COLLABORATION_LOCKED: 'COLLABORATION_LOCKED',
  INVALID_COLLABORATION_STATE: 'INVALID_COLLABORATION_STATE',

  // Payment errors
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  SUBSCRIPTION_EXPIRED: 'SUBSCRIPTION_EXPIRED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',

  // System errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  MAINTENANCE_MODE: 'MAINTENANCE_MODE'
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const;

// Time constants
export const TIME = {
  SECOND: 1000,
  MINUTE: 60000,
  HOUR: 3600000,
  DAY: 86400000,
  WEEK: 604800000,
  MONTH: 2592000000,
  YEAR: 31536000000
} as const;

// Color constants
export const COLORS = {
  PRIMARY: '#007bff',
  SECONDARY: '#6c757d',
  SUCCESS: '#28a745',
  DANGER: '#dc3545',
  WARNING: '#ffc107',
  INFO: '#17a2b8',
  LIGHT: '#f8f9fa',
  DARK: '#343a40'
} as const;

// Animation constants
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
  EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
  EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)'
} as const;

// Accessibility constants
export const A11Y = {
  MIN_TOUCH_TARGET: 44, // pixels
  MIN_FONT_SIZE: 14, // pixels
  MAX_LINE_LENGTH: 80, // characters
  FOCUS_OUTLINE_WIDTH: 2, // pixels
  HIGH_CONTRAST_RATIO: 4.5
} as const;

// SEO constants
export const SEO = {
  DEFAULT_TITLE: 'SON1KVERS3 - AI Music Creation Platform',
  DEFAULT_DESCRIPTION: 'Create, collaborate, and share music with AI-powered tools. Generate unique tracks, collaborate with artists worldwide, and build your musical community.',
  DEFAULT_KEYWORDS: 'AI music, music generation, collaboration, digital audio workstation, music production, artificial intelligence',
  MAX_TITLE_LENGTH: 60,
  MAX_DESCRIPTION_LENGTH: 160,
  MAX_URL_LENGTH: 2048
} as const;

// Environment constants
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
  TEST: 'test'
} as const;

// Log levels
export const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4
} as const;

// Database constants
export const DATABASE = {
  MAX_CONNECTIONS: 20,
  CONNECTION_TIMEOUT: 10000,
  QUERY_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
} as const;

// External service constants
export const EXTERNAL_SERVICES = {
  OPENAI: {
    API_VERSION: 'v1',
    TIMEOUT: 60000,
    MAX_TOKENS: 4000
  },
  ANTHROPIC: {
    API_VERSION: 'v1',
    TIMEOUT: 60000,
    MAX_TOKENS: 100000
  },
  STRIPE: {
    API_VERSION: '2023-10-16',
    WEBHOOK_TIMEOUT: 30000
  },
  REDIS: {
    DEFAULT_TTL: 3600,
    MAX_CONNECTIONS: 10
  }
} as const;
