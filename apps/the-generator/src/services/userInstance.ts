// apps/the-generator/src/services/userInstance.ts
export interface UserInstance {
  userId: string;
  installationId: string;
  tokenPool: string[];
  preferences: {
    defaultStyle: string;
    maxDuration: number;
    autoSave: boolean;
  };
  stats: {
    totalGenerations: number;
    successfulGenerations: number;
    failedGenerations: number;
    lastUsed: number;
  };
  createdAt: number;
  lastUpdated: number;
}

class UserInstanceManager {
  private readonly STORAGE_KEY = 'son1kverse_user_instance';
  private instance: UserInstance | null = null;

  constructor() {
    this.loadInstance();
    if (!this.instance) {
      this.createNewInstance();
    }
  }

  private generateInstallationId(): string {
    return `son1k_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createNewInstance(): UserInstance {
    this.instance = {
      userId: this.generateUserId(),
      installationId: this.generateInstallationId(),
      tokenPool: [
        // Token válido actualizado
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJGVnZQa3VzelFjY2MzNGlYeks5ZjdpSFUyNDBPWXhzQyIsImV4cCI6MTc2MDAzNjI2M30.0r80bFt0LHAmXXY6O4peEqrUWzq_yglsqgWRSnZI2Uc',
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJGVnZQa3VzelFjY2MzNGlYeks5ZjdpSFUyNDBPWXhzQyIsImV4cCI6MTc2MDAzNjI2M30.0r80bFt0LHAmXXY6O4peEqrUWzq_yglsqgWRSnZI2Uc',
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJGVnZQa3VzelFjY2MzNGlYeks5ZjdpSFUyNDBPWXhzQyIsImV4cCI6MTc2MDAzNjI2M30.0r80bFt0LHAmXXY6O4peEqrUWzq_yglsqgWRSnZI2Uc'
      ],
      preferences: {
        defaultStyle: 'indie rock',
        maxDuration: 180,
        autoSave: true
      },
      stats: {
        totalGenerations: 0,
        successfulGenerations: 0,
        failedGenerations: 0,
        lastUsed: Date.now()
      },
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };

    this.saveInstance();
    return this.instance;
  }

  private loadInstance(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.instance = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading user instance:', error);
    }
  }

  private saveInstance(): void {
    if (this.instance) {
      try {
        this.instance.lastUpdated = Date.now();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.instance));
      } catch (error) {
        console.error('Error saving user instance:', error);
      }
    }
  }

  getInstance(): UserInstance {
    if (!this.instance) {
      this.createNewInstance();
    }
    return this.instance!;
  }

  addToken(token: string): void {
    if (!this.instance) return;
    
    if (!this.instance.tokenPool.includes(token)) {
      this.instance.tokenPool.push(token);
      this.saveInstance();
    }
  }

  removeToken(token: string): void {
    if (!this.instance) return;
    
    this.instance.tokenPool = this.instance.tokenPool.filter(t => t !== token);
    this.saveInstance();
  }

  updatePreferences(preferences: Partial<UserInstance['preferences']>): void {
    if (!this.instance) return;
    
    this.instance.preferences = { ...this.instance.preferences, ...preferences };
    this.saveInstance();
  }

  recordGeneration(success: boolean): void {
    if (!this.instance) return;
    
    this.instance.stats.totalGenerations++;
    if (success) {
      this.instance.stats.successfulGenerations++;
    } else {
      this.instance.stats.failedGenerations++;
    }
    this.instance.stats.lastUsed = Date.now();
    this.saveInstance();
  }

  getStats() {
    if (!this.instance) return null;
    
    const successRate = this.instance.stats.totalGenerations > 0 
      ? (this.instance.stats.successfulGenerations / this.instance.stats.totalGenerations) * 100 
      : 0;

    return {
      ...this.instance.stats,
      successRate: Math.round(successRate * 100) / 100,
      daysSinceInstallation: Math.floor((Date.now() - this.instance.createdAt) / (1000 * 60 * 60 * 24)),
      tokensAvailable: this.instance.tokenPool.length
    };
  }

  resetInstance(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.instance = null;
    this.createNewInstance();
  }

  // Generar identificador único para esta instalación
  getInstallationFingerprint(): string {
    if (!this.instance) return '';
    
    return `${this.instance.installationId}_${this.instance.userId}`;
  }

  // Verificar si es una instalación válida
  isValidInstallation(): boolean {
    return this.instance !== null && 
           this.instance.installationId.length > 0 && 
           this.instance.userId.length > 0;
  }
}

// Instancia singleton
export const userInstanceManager = new UserInstanceManager();

// Auto-guardado cada 5 minutos
setInterval(() => {
  userInstanceManager.getInstance(); // Esto trigger el save
}, 5 * 60 * 1000);
