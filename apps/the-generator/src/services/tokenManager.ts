// apps/the-generator/src/services/tokenManager.ts
import { userInstanceManager } from './userInstance';

export interface TokenInfo {
  token: string;
  isValid: boolean;
  lastUsed: number;
  usageCount: number;
  expiresAt?: number;
  priority: number; // 1 = highest priority
}

export interface TokenPool {
  tokens: TokenInfo[];
  currentIndex: number;
  maxRetries: number;
  retryDelay: number;
}

class TokenManager {
  private pool: TokenPool = {
    tokens: [],
    currentIndex: 0,
    maxRetries: 3,
    retryDelay: 1000
  };

  private readonly STORAGE_KEY = 'son1kverse_token_pool';

  constructor() {
    // LIMPIEZA DE RAÍZ TOTAL: Limpiar localStorage y resetear
    console.log('[TokenManager] CLEANING FROM ROOT - Clearing localStorage and resetting');
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('son1kverse_user_instance');
    this.resetPool();
  }

  private loadTokenPool() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.pool = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading token pool:', error);
    }
  }

  private saveTokenPool() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.pool));
    } catch (error) {
      console.error('Error saving token pool:', error);
    }
  }

  private initializeDefaultTokens() {
    if (this.pool.tokens.length === 0) {
      // Obtener tokens de la instancia del usuario
      const userInstance = userInstanceManager.getInstance();
      const userTokens = userInstance.tokenPool;
      
      this.pool.tokens = userTokens.map((token, index) => ({
        token,
        isValid: true,
        lastUsed: 0,
        usageCount: 0,
        priority: index + 1
      }));
      this.saveTokenPool();
    } else {
      // Forzar actualización de tokens si ya existen
      console.log('[TokenManager] Forcing token update...');
      const userInstance = userInstanceManager.getInstance();
      const userTokens = userInstance.tokenPool;
      
      this.pool.tokens = userTokens.map((token, index) => ({
        token,
        isValid: true,
        lastUsed: 0,
        usageCount: 0,
        priority: index + 1
      }));
      this.saveTokenPool();
    }
  }

  // Obtener el siguiente token válido
  getNextToken(): string | null {
    const validTokens = this.pool.tokens
      .filter(t => t.isValid)
      .sort((a, b) => a.priority - b.priority);

    if (validTokens.length === 0) {
      // Fallback: usar token válido si no hay tokens válidos
      console.warn('[TokenManager] No valid tokens available, using fallback token');
      return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJGVnZQa3VzelFjY2MzNGlYeks5ZjdpSFUyNDBPWXhzQyIsImV4cCI6MTc2MDAzNjI2M30.0r80bFt0LHAmXXY6O4peEqrUWzq_yglsqgWRSnZI2Uc';
    }

    // Usar round-robin para distribuir el uso
    const token = validTokens[this.pool.currentIndex % validTokens.length];
    this.pool.currentIndex = (this.pool.currentIndex + 1) % validTokens.length;
    
    // Actualizar estadísticas
    token.lastUsed = Date.now();
    token.usageCount++;
    
    this.saveTokenPool();
    return token.token;
  }

  // Marcar token como inválido
  markTokenInvalid(token: string) {
    const tokenInfo = this.pool.tokens.find(t => t.token === token);
    if (tokenInfo) {
      tokenInfo.isValid = false;
      this.saveTokenPool();
    }
  }

  // Marcar token como válido
  markTokenValid(token: string) {
    const tokenInfo = this.pool.tokens.find(t => t.token === token);
    if (tokenInfo) {
      tokenInfo.isValid = true;
      this.saveTokenPool();
    }
  }

  // Agregar nuevo token
  addToken(token: string, priority: number = 10) {
    const existingToken = this.pool.tokens.find(t => t.token === token);
    if (!existingToken) {
      this.pool.tokens.push({
        token,
        isValid: true,
        lastUsed: 0,
        usageCount: 0,
        priority
      });
      this.saveTokenPool();
    }
  }

  // Verificar si un token es válido
  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch('https://ai.imgkits.com/suno/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
          'channel': 'node-api',
          'origin': 'https://www.livepolls.app',
          'referer': 'https://www.livepolls.app/'
        },
        body: JSON.stringify({
          prompt: 'test',
          style: 'test',
          title: 'test',
          customMode: true,
          instrumental: false,
          lyrics: 'test',
          gender: ''
        })
      });

      const data = await response.json();
      return response.ok && !data.error;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  // Auto-renovación de tokens
  async autoRenewTokens() {
    const invalidTokens = this.pool.tokens.filter(t => !t.isValid);
    
    for (const tokenInfo of invalidTokens) {
      const isValid = await this.validateToken(tokenInfo.token);
      if (isValid) {
        this.markTokenValid(tokenInfo.token);
      }
    }
  }

  // Obtener estadísticas del pool
  getPoolStats() {
    const validTokens = this.pool.tokens.filter(t => t.isValid);
    const totalUsage = this.pool.tokens.reduce((sum, t) => sum + t.usageCount, 0);
    
    return {
      totalTokens: this.pool.tokens.length,
      validTokens: validTokens.length,
      invalidTokens: this.pool.tokens.length - validTokens.length,
      totalUsage,
      currentIndex: this.pool.currentIndex
    };
  }

  // Limpiar tokens expirados
  cleanupExpiredTokens() {
    const now = Date.now();
    this.pool.tokens = this.pool.tokens.filter(token => {
      if (token.expiresAt && token.expiresAt < now) {
        return false;
      }
      return true;
    });
    this.saveTokenPool();
  }

  // Reset del pool
  resetPool() {
    this.pool.tokens = [];
    this.pool.currentIndex = 0;
    this.initializeDefaultTokens();
  }
}

// Instancia singleton
export const tokenManager = new TokenManager();

// Auto-renovación cada 30 minutos
setInterval(() => {
  tokenManager.autoRenewTokens();
}, 30 * 60 * 1000);

// Limpieza cada hora
setInterval(() => {
  tokenManager.cleanupExpiredTokens();
}, 60 * 60 * 1000);
