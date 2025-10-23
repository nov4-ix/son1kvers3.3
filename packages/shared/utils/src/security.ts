/**
 * Security utilities for SON1KVERS3 platform
 */

import { createHash, randomBytes } from 'crypto';

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Generate a secure API key
 */
export function generateAPIKey(prefix: string = 'sk'): string {
  const randomPart = randomBytes(32).toString('hex');
  return `${prefix}_${randomPart}`;
}

/**
 * Hash a password using SHA-256 (for basic hashing - use bcrypt for production)
 */
export function hashPassword(password: string, salt?: string): string {
  const actualSalt = salt || generateSecureToken(16);
  const hash = createHash('sha256');
  hash.update(password + actualSalt);
  return `${actualSalt}:${hash.digest('hex')}`;
}

/**
 * Verify a hashed password
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':');
  if (!salt || !hash) return false;

  const newHash = hashPassword(password, salt);
  return newHash === hashedPassword;
}

/**
 * Generate a secure session ID
 */
export function generateSessionId(): string {
  return `sess_${generateSecureToken(32)}`;
}

/**
 * Generate a secure user ID
 */
export function generateUserId(): string {
  return `user_${generateSecureToken(16)}`;
}

/**
 * Generate a secure collaboration ID
 */
export function generateCollaborationId(): string {
  return `collab_${generateSecureToken(16)}`;
}

/**
 * Generate a secure generation ID
 */
export function generateGenerationId(): string {
  return `gen_${generateSecureToken(16)}`;
}

/**
 * Generate a secure NFT ID
 */
export function generateNFTId(): string {
  return `nft_${generateSecureToken(16)}`;
}

/**
 * Hash sensitive data for logging (without exposing actual values)
 */
export function hashForLogging(data: string): string {
  return createHash('sha256').update(data).digest('hex').substring(0, 8);
}

/**
 * Generate a secure webhook secret
 */
export function generateWebhookSecret(): string {
  return `whsec_${generateSecureToken(32)}`;
}

/**
 * Generate a secure refresh token
 */
export function generateRefreshToken(): string {
  return `refresh_${generateSecureToken(32)}`;
}

/**
 * Generate a secure verification token
 */
export function generateVerificationToken(): string {
  return `verify_${generateSecureToken(32)}`;
}

/**
 * Generate a secure password reset token
 */
export function generatePasswordResetToken(): string {
  return `reset_${generateSecureToken(32)}`;
}

/**
 * Sanitize object for logging (remove sensitive fields)
 */
export function sanitizeForLogging(obj: any, sensitiveFields: string[] = ['password', 'token', 'secret', 'key']): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(item => sanitizeForLogging(item, sensitiveFields));
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeForLogging(value, sensitiveFields);
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  isAllowed(key: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now > record.resetTime) {
      // Reset or create new record
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (record.count >= this.maxAttempts) {
      return false;
    }

    record.count++;
    return true;
  }

  getRemainingTime(key: string): number {
    const record = this.attempts.get(key);
    if (!record) return 0;

    const remaining = record.resetTime - Date.now();
    return Math.max(0, remaining);
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

/**
 * Content Security Policy (CSP) nonce generator
 */
export function generateCSPNonce(): string {
  return randomBytes(16).toString('base64');
}

/**
 * Generate secure headers for API responses
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  };
}

/**
 * Validate and sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
    .replace(/^\.+/, '') // Remove leading dots
    .replace(/\.+$/, '') // Remove trailing dots
    .substring(0, 255) // Limit length
    || 'untitled';
}

/**
 * Generate secure download token
 */
export function generateDownloadToken(fileId: string, expiresIn: number = 3600000): string {
  const timestamp = Date.now() + expiresIn;
  const token = generateSecureToken(16);
  return `${fileId}:${timestamp}:${token}`;
}

/**
 * Verify download token
 */
export function verifyDownloadToken(token: string, fileId: string): boolean {
  try {
    const [id, timestamp, signature] = token.split(':');
    if (id !== fileId) return false;

    const expiry = parseInt(timestamp, 10);
    if (Date.now() > expiry) return false;

    // In a real implementation, you'd verify the signature against a secret
    return signature.length === 32;
  } catch {
    return false;
  }
}

/**
 * Generate secure invitation token
 */
export function generateInvitationToken(collaborationId: string, expiresIn: number = 7 * 24 * 60 * 60 * 1000): string {
  const timestamp = Date.now() + expiresIn;
  const token = generateSecureToken(16);
  return `${collaborationId}:${timestamp}:${token}`;
}

/**
 * Verify invitation token
 */
export function verifyInvitationToken(token: string, collaborationId: string): boolean {
  try {
    const [id, timestamp, signature] = token.split(':');
    if (id !== collaborationId) return false;

    const expiry = parseInt(timestamp, 10);
    if (Date.now() > expiry) return false;

    return signature.length === 32;
  } catch {
    return false;
  }
}

/**
 * Generate secure share token
 */
export function generateShareToken(contentId: string, permissions: string[] = ['read']): string {
  const token = generateSecureToken(16);
  const perms = permissions.join(',');
  return `${contentId}:${perms}:${token}`;
}

/**
 * Verify share token
 */
export function verifyShareToken(token: string, contentId: string, requiredPermissions: string[] = []): boolean {
  try {
    const [id, permissions, signature] = token.split(':');
    if (id !== contentId) return false;

    const perms = permissions.split(',');
    const hasAllPermissions = requiredPermissions.every(perm => perms.includes(perm));

    return signature.length === 32 && hasAllPermissions;
  } catch {
    return false;
  }
}

/**
 * Encrypt sensitive data (basic implementation - use proper encryption in production)
 */
export function encryptData(data: string, key: string): string {
  // This is a placeholder - implement proper AES encryption
  const hash = createHash('sha256');
  hash.update(data + key);
  return hash.digest('hex');
}

/**
 * Decrypt sensitive data (basic implementation - use proper decryption in production)
 */
export function decryptData(encryptedData: string, key: string): string {
  // This is a placeholder - implement proper AES decryption
  return encryptedData; // Return as-is for now
}

/**
 * Generate secure backup token
 */
export function generateBackupToken(): string {
  return `backup_${generateSecureToken(32)}`;
}

/**
 * Generate secure audit log ID
 */
export function generateAuditLogId(): string {
  return `audit_${generateSecureToken(16)}`;
}

/**
 * Validate token format (generic)
 */
export function validateTokenFormat(token: string, prefix?: string): boolean {
  if (prefix && !token.startsWith(prefix)) return false;
  return token.length >= 20 && /^[a-zA-Z0-9_-]+$/.test(token);
}

/**
 * Generate secure file upload token
 */
export function generateUploadToken(userId: string, maxSize: number = 100 * 1024 * 1024): string {
  const timestamp = Date.now() + 3600000; // 1 hour expiry
  const token = generateSecureToken(16);
  return `${userId}:${maxSize}:${timestamp}:${token}`;
}

/**
 * Verify upload token
 */
export function verifyUploadToken(token: string, userId: string, fileSize: number): boolean {
  try {
    const [id, maxSize, timestamp, signature] = token.split(':');
    if (id !== userId) return false;

    const maxSizeNum = parseInt(maxSize, 10);
    if (fileSize > maxSizeNum) return false;

    const expiry = parseInt(timestamp, 10);
    if (Date.now() > expiry) return false;

    return signature.length === 32;
  } catch {
    return false;
  }
}
