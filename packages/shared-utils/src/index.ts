// Utility Functions
export { cn } from './cn';
export { formatTime, formatDuration } from './time';
export { generateId, slugify } from './string';
export { validateEmail, validateUrl } from './validation';

// Audio Utilities
export { createAudioContext, generateTone } from './audio';

// Glitch Effects
export { createGlitchEffect, randomGlitch } from './glitch';

// API Utilities
export { apiClient, createApiEndpoint } from './api';

// Performance utilities
export {
  debounce,
  throttle,
  memoize,
  lazyLoad,
  useVirtualScroll,
  ImageOptimizer,
  BundleOptimizer,
  MemoryManager,
  AnimationOptimizer,
  performanceMonitor
} from './performance';

// Cache utilities
export {
  IntelligentCache,
  CacheManager,
  cached,
  useCache,
  globalCacheManager
} from './cache';

// Error handling utilities
export {
  Son1kVerseError,
  NetworkError,
  ValidationError,
  AudioError,
  ImageError,
  ErrorLogger,
  Son1kVerseErrorBoundary,
  useErrorHandler,
  RetryManager,
  NetworkErrorHandler,
  ValidationErrorHandler,
  globalErrorLogger,
  globalNetworkHandler,
  globalValidationHandler
} from './errorHandling';

// Analytics utilities
export {
  AnalyticsManager,
  useAnalytics,
  AnalyticsProvider,
  useAnalyticsContext,
  withPageTracking,
  withErrorTracking,
  globalAnalyticsManager
} from './analytics';

// Adaptive learning utilities
export { 
  AdaptiveLearningSystem, 
  adaptiveLearningSystem, 
  useAdaptiveLearning, 
  PixelLearningUtils,
  type UserBehavior,
  type PixelLearning,
  type LearnedPattern,
  type UserPreferences,
  type ProAccountData,
  type UsagePattern,
  type AdaptiveResponse
} from './adaptiveLearning';