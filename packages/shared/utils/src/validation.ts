/**
 * Validation utilities for SON1KVERS3 platform
 */

// Types (inline for now to avoid import issues)
export enum UserTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}

export enum GenerationStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum AIModel {
  SON1K_V1 = 'SON1K_V1',
  SON1K_V2 = 'SON1K_V2',
  SON1K_HYBRID = 'SON1K_HYBRID',
  CUSTOM = 'CUSTOM'
}

export const SUPPORTED_AUDIO_FORMATS = ['mp3', 'wav', 'flac', 'ogg', 'm4a'] as const;
export const SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'webp'] as const;
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_TRACK_DURATION = 600; // 10 minutes

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate username format
 */
export function validateUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate user tier
 */
export function validateUserTier(tier: string): tier is UserTier {
  return Object.values(UserTier).includes(tier as UserTier);
}

/**
 * Validate generation status
 */
export function validateGenerationStatus(status: string): status is GenerationStatus {
  return Object.values(GenerationStatus).includes(status as GenerationStatus);
}

/**
 * Validate AI model
 */
export function validateAIModel(model: string): model is AIModel {
  return Object.values(AIModel).includes(model as AIModel);
}

/**
 * Validate audio file format
 */
export function validateAudioFormat(format: string): boolean {
  return SUPPORTED_AUDIO_FORMATS.includes(format as any);
}

/**
 * Validate image file format
 */
export function validateImageFormat(format: string): boolean {
  return SUPPORTED_IMAGE_FORMATS.includes(format as any);
}

/**
 * Validate file size
 */
export function validateFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE;
}

/**
 * Validate track duration
 */
export function validateTrackDuration(duration: number): boolean {
  return duration > 0 && duration <= MAX_TRACK_DURATION;
}

/**
 * Validate BPM
 */
export function validateBPM(bpm: number): boolean {
  return bpm >= 60 && bpm <= 200;
}

/**
 * Validate musical key
 */
export function validateMusicalKey(key: string): boolean {
  const validKeys = [
    'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F',
    'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'
  ];
  return validKeys.includes(key);
}

/**
 * Validate genre
 */
export function validateGenre(genre: string): boolean {
  const validGenres = [
    'pop', 'rock', 'hip-hop', 'electronic', 'classical', 'jazz',
    'blues', 'country', 'folk', 'reggae', 'punk', 'metal',
    'ambient', 'experimental', 'lo-fi', 'trap', 'house', 'techno'
  ];
  return validGenres.includes(genre.toLowerCase());
}

/**
 * Validate mood
 */
export function validateMood(mood: string): boolean {
  const validMoods = [
    'happy', 'sad', 'energetic', 'calm', 'aggressive', 'peaceful',
    'melancholic', 'uplifting', 'dark', 'bright', 'nostalgic', 'futuristic'
  ];
  return validMoods.includes(mood.toLowerCase());
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate UUID format
 */
export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate color hex code
 */
export function validateHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * Validate JSON string
 */
export function validateJSON(json: string): boolean {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate and sanitize string input
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, maxLength);
}

/**
 * Validate pagination parameters
 */
export function validatePagination(page: number, limit: number): { page: number; limit: number } {
  const validPage = Math.max(1, Math.floor(page));
  const validLimit = Math.min(100, Math.max(1, Math.floor(limit)));

  return { page: validPage, limit: validLimit };
}

/**
 * Validate search query
 */
export function validateSearchQuery(query: string): boolean {
  return query.length >= 1 && query.length <= 200;
}

/**
 * Validate collaboration participant count
 */
export function validateParticipantCount(count: number, maxParticipants: number = 10): boolean {
  return count >= 1 && count <= maxParticipants;
}

/**
 * Validate price format
 */
export function validatePrice(price: string | number): boolean {
  const priceStr = price.toString();
  const priceRegex = /^\d+(\.\d{1,2})?$/;
  return priceRegex.test(priceStr) && parseFloat(priceStr) >= 0;
}

/**
 * Validate NFT attributes
 */
export function validateNFTAttributes(attributes: Array<{ trait_type: string; value: string | number }>): boolean {
  return attributes.every(attr =>
    typeof attr.trait_type === 'string' &&
    attr.trait_type.length > 0 &&
    attr.trait_type.length <= 50 &&
    (typeof attr.value === 'string' || typeof attr.value === 'number')
  );
}

/**
 * Validate social media handle
 */
export function validateSocialHandle(handle: string, platform: string): boolean {
  const patterns = {
    twitter: /^[A-Za-z0-9_]{1,15}$/,
    instagram: /^[A-Za-z0-9_.]{1,30}$/,
    youtube: /^[A-Za-z0-9_-]{1,50}$/,
    discord: /^[A-Za-z0-9_.]{2,32}#[0-9]{4}$/
  };

  const pattern = patterns[platform.toLowerCase() as keyof typeof patterns];
  return pattern ? pattern.test(handle) : false;
}

/**
 * Validate time duration format (MM:SS or HH:MM:SS)
 */
export function validateTimeFormat(time: string): boolean {
  const timeRegex = /^([0-5]?[0-9]:[0-5][0-9]|[0-1]?[0-9]:[0-5][0-9]:[0-5][0-9])$/;
  return timeRegex.test(time);
}

/**
 * Validate API key format
 */
export function validateAPIKey(key: string): boolean {
  // Basic API key validation - should be alphanumeric with possible dashes/underscores
  const apiKeyRegex = /^[A-Za-z0-9_-]{20,100}$/;
  return apiKeyRegex.test(key);
}

/**
 * Validate webhook URL
 */
export function validateWebhookUrl(url: string): boolean {
  return validateUrl(url) && (url.startsWith('https://') || url.startsWith('http://localhost'));
}

/**
 * Validate rate limit configuration
 */
export function validateRateLimit(limit: number, windowMs: number): boolean {
  return limit > 0 && limit <= 10000 && windowMs >= 1000 && windowMs <= 3600000;
}

/**
 * Validate generation parameters
 */
export function validateGenerationParameters(params: {
  duration?: number;
  tempo?: number;
  key?: string;
  genre?: string;
  mood?: string;
  complexity?: number;
  temperature?: number;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (params.duration !== undefined && !validateTrackDuration(params.duration)) {
    errors.push('Invalid duration');
  }

  if (params.tempo !== undefined && !validateBPM(params.tempo)) {
    errors.push('Invalid tempo (BPM)');
  }

  if (params.key !== undefined && !validateMusicalKey(params.key)) {
    errors.push('Invalid musical key');
  }

  if (params.genre !== undefined && !validateGenre(params.genre)) {
    errors.push('Invalid genre');
  }

  if (params.mood !== undefined && !validateMood(params.mood)) {
    errors.push('Invalid mood');
  }

  if (params.complexity !== undefined && (params.complexity < 0 || params.complexity > 1)) {
    errors.push('Complexity must be between 0 and 1');
  }

  if (params.temperature !== undefined && (params.temperature < 0 || params.temperature > 2)) {
    errors.push('Temperature must be between 0 and 2');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
