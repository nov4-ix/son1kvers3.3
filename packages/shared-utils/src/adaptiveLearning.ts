// Adaptive Learning System - Sistema de aprendizaje adaptativo del universo Son1kVerse
// Cada pixel aprende del comportamiento del usuario para personalizar la experiencia

import { debounce, throttle } from './performance';

// Tipos para el sistema de aprendizaje adaptativo
export interface UserBehavior {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  action: string;
  context: string;
  duration: number;
  intensity: number;
  success: boolean;
  metadata: Record<string, any>;
}

export interface PixelLearning {
  pixelId: string;
  position: { x: number; y: number };
  color: string;
  intensity: number;
  behavior: string;
  learnedPatterns: LearnedPattern[];
  adaptationLevel: number;
  lastUpdated: Date;
  userPreferences: UserPreferences;
}

export interface LearnedPattern {
  id: string;
  pattern: string;
  frequency: number;
  confidence: number;
  context: string;
  triggers: string[];
  responses: string[];
  effectiveness: number;
  lastSeen: Date;
}

export interface UserPreferences {
  colorScheme: 'cyberpunk' | 'matrix' | 'nexus' | 'son1kverse';
  intensity: 'low' | 'medium' | 'high' | 'ultra';
  speed: 'slow' | 'normal' | 'fast' | 'lightning';
  effects: string[];
  interactions: string[];
  personalized: boolean;
}

export interface ProAccountData {
  userId: string;
  accountType: 'pro' | 'enterprise' | 'creator';
  subscriptionTier: 'basic' | 'premium' | 'ultimate';
  usagePatterns: UsagePattern[];
  preferences: UserPreferences;
  learningEnabled: boolean;
  dataSharing: boolean;
  lastSync: Date;
}

export interface UsagePattern {
  id: string;
  pattern: string;
  frequency: number;
  duration: number;
  success: boolean;
  context: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface AdaptiveResponse {
  pixelId: string;
  response: string;
  intensity: number;
  duration: number;
  personalized: boolean;
  confidence: number;
  reasoning: string;
}

// Clase principal para el sistema de aprendizaje adaptativo
export class AdaptiveLearningSystem {
  private pixels: Map<string, PixelLearning> = new Map();
  private userBehaviors: UserBehavior[] = [];
  private proAccounts: Map<string, ProAccountData> = new Map();
  private learningEnabled: boolean = true;
  private adaptationRate: number = 0.1;
  private maxPatterns: number = 1000;
  private confidenceThreshold: number = 0.7;

  constructor() {
    this.initializePixels();
    this.startLearningLoop();
  }

  // Inicializar píxeles del universo Son1kVerse
  private initializePixels() {
    const pixelCount = 10000; // 100x100 grid
    const colors = ['#00FFE7', '#B84DFF', '#9AF7EE', '#FF0080', '#00D4FF'];
    const behaviors = ['glitch', 'matrix', 'cyberpunk', 'nexus', 'son1kverse'];

    for (let i = 0; i < pixelCount; i++) {
      const x = i % 100;
      const y = Math.floor(i / 100);
      const pixelId = `pixel_${x}_${y}`;
      
      this.pixels.set(pixelId, {
        pixelId,
        position: { x, y },
        color: colors[Math.floor(Math.random() * colors.length)],
        intensity: Math.random(),
        behavior: behaviors[Math.floor(Math.random() * behaviors.length)],
        learnedPatterns: [],
        adaptationLevel: 0,
        lastUpdated: new Date(),
        userPreferences: {
          colorScheme: 'cyberpunk',
          intensity: 'medium',
          speed: 'normal',
          effects: ['glitch', 'matrix'],
          interactions: ['hover', 'click'],
          personalized: false
        }
      });
    }
  }

  // Registrar comportamiento del usuario
  public recordUserBehavior(behavior: Omit<UserBehavior, 'id' | 'timestamp'>) {
    const userBehavior: UserBehavior = {
      ...behavior,
      id: `behavior_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    this.userBehaviors.push(userBehavior);
    
    // Aplicar aprendizaje adaptativo
    this.adaptPixelsToBehavior(userBehavior);
    
    // Limpiar comportamientos antiguos
    this.cleanupOldBehaviors();
  }

  // Adaptar píxeles basado en comportamiento del usuario
  private adaptPixelsToBehavior(behavior: UserBehavior) {
    const proAccount = this.proAccounts.get(behavior.userId);
    if (!proAccount || !proAccount.learningEnabled) return;

    // Encontrar píxeles relevantes basados en contexto
    const relevantPixels = this.findRelevantPixels(behavior);
    
    relevantPixels.forEach(pixel => {
      this.updatePixelLearning(pixel, behavior, proAccount);
    });
  }

  // Encontrar píxeles relevantes para el comportamiento
  private findRelevantPixels(behavior: UserBehavior): PixelLearning[] {
    const relevantPixels: PixelLearning[] = [];
    
    // Basado en contexto de la acción
    switch (behavior.context) {
      case 'nexus-visual':
        // Píxeles en el área central para efectos Matrix
        for (let x = 40; x < 60; x++) {
          for (let y = 40; y < 60; y++) {
            const pixel = this.pixels.get(`pixel_${x}_${y}`);
            if (pixel) relevantPixels.push(pixel);
          }
        }
        break;
        
      case 'ghost-studio':
        // Píxeles en el área de audio para efectos de sonido
        for (let x = 20; x < 80; x++) {
          for (let y = 20; y < 80; y++) {
            const pixel = this.pixels.get(`pixel_${x}_${y}`);
            if (pixel) relevantPixels.push(pixel);
          }
        }
        break;
        
      case 'sonic-daw':
        // Píxeles en el área de timeline para efectos de DAW
        for (let x = 0; x < 100; x++) {
          for (let y = 70; y < 100; y++) {
            const pixel = this.pixels.get(`pixel_${x}_${y}`);
            if (pixel) relevantPixels.push(pixel);
          }
        }
        break;
        
      default:
        // Píxeles aleatorios para comportamiento general
        const randomPixels = Array.from(this.pixels.values())
          .sort(() => Math.random() - 0.5)
          .slice(0, 100);
        relevantPixels.push(...randomPixels);
    }
    
    return relevantPixels;
  }

  // Actualizar aprendizaje de un píxel específico
  private updatePixelLearning(pixel: PixelLearning, behavior: UserBehavior, proAccount: ProAccountData) {
    // Crear patrón de comportamiento
    const pattern: LearnedPattern = {
      id: `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pattern: `${behavior.action}_${behavior.context}`,
      frequency: 1,
      confidence: 0.5,
      context: behavior.context,
      triggers: [behavior.action],
      responses: [pixel.behavior],
      effectiveness: behavior.success ? 1 : 0,
      lastSeen: new Date()
    };

    // Buscar patrón existente
    const existingPattern = pixel.learnedPatterns.find(p => p.pattern === pattern.pattern);
    
    if (existingPattern) {
      // Actualizar patrón existente
      existingPattern.frequency += 1;
      existingPattern.confidence = Math.min(1, existingPattern.confidence + this.adaptationRate);
      existingPattern.effectiveness = (existingPattern.effectiveness + pattern.effectiveness) / 2;
      existingPattern.lastSeen = new Date();
    } else {
      // Agregar nuevo patrón
      pixel.learnedPatterns.push(pattern);
      
      // Limitar número de patrones
      if (pixel.learnedPatterns.length > this.maxPatterns) {
        pixel.learnedPatterns.sort((a, b) => b.frequency - a.frequency);
        pixel.learnedPatterns = pixel.learnedPatterns.slice(0, this.maxPatterns);
      }
    }

    // Actualizar preferencias del usuario
    this.updateUserPreferences(pixel, behavior, proAccount);
    
    // Actualizar nivel de adaptación
    pixel.adaptationLevel = Math.min(1, pixel.adaptationLevel + this.adaptationRate);
    pixel.lastUpdated = new Date();
  }

  // Actualizar preferencias del usuario basadas en comportamiento
  private updateUserPreferences(pixel: PixelLearning, behavior: UserBehavior, proAccount: ProAccountData) {
    const preferences = pixel.userPreferences;
    
    // Adaptar esquema de colores basado en acciones
    if (behavior.action === 'color_change') {
      preferences.colorScheme = behavior.metadata.colorScheme || preferences.colorScheme;
    }
    
    // Adaptar intensidad basada en duración de interacción
    if (behavior.duration > 5000) { // Más de 5 segundos
      preferences.intensity = 'high';
    } else if (behavior.duration > 2000) { // Más de 2 segundos
      preferences.intensity = 'medium';
    } else {
      preferences.intensity = 'low';
    }
    
    // Adaptar velocidad basada en frecuencia de acciones
    const recentBehaviors = this.userBehaviors
      .filter(b => b.userId === behavior.userId)
      .filter(b => Date.now() - b.timestamp.getTime() < 60000) // Último minuto
      .length;
    
    if (recentBehaviors > 10) {
      preferences.speed = 'lightning';
    } else if (recentBehaviors > 5) {
      preferences.speed = 'fast';
    } else if (recentBehaviors > 2) {
      preferences.speed = 'normal';
    } else {
      preferences.speed = 'slow';
    }
    
    // Adaptar efectos basados en contexto
    if (behavior.context === 'nexus-visual') {
      if (!preferences.effects.includes('matrix')) {
        preferences.effects.push('matrix');
      }
    } else if (behavior.context === 'ghost-studio') {
      if (!preferences.effects.includes('glitch')) {
        preferences.effects.push('glitch');
      }
    }
    
    // Marcar como personalizado
    preferences.personalized = true;
  }

  // Generar respuesta adaptativa para un píxel
  public generateAdaptiveResponse(pixelId: string, trigger: string): AdaptiveResponse {
    const pixel = this.pixels.get(pixelId);
    if (!pixel) {
      return this.getDefaultResponse(pixelId);
    }

    // Buscar patrón más relevante
    const relevantPattern = pixel.learnedPatterns
      .filter(p => p.triggers.includes(trigger))
      .sort((a, b) => b.confidence - a.confidence)[0];

    if (relevantPattern && relevantPattern.confidence > this.confidenceThreshold) {
      return {
        pixelId,
        response: relevantPattern.responses[0],
        intensity: pixel.intensity * relevantPattern.effectiveness,
        duration: 1000 + (pixel.adaptationLevel * 2000),
        personalized: true,
        confidence: relevantPattern.confidence,
        reasoning: `Aprendido de ${relevantPattern.frequency} interacciones en ${relevantPattern.context}`
      };
    }

    return this.getDefaultResponse(pixelId);
  }

  // Respuesta por defecto
  private getDefaultResponse(pixelId: string): AdaptiveResponse {
    return {
      pixelId,
      response: 'default',
      intensity: 0.5,
      duration: 1000,
      personalized: false,
      confidence: 0.1,
      reasoning: 'Sin patrones aprendidos'
    };
  }

  // Registrar cuenta profesional
  public registerProAccount(accountData: ProAccountData) {
    this.proAccounts.set(accountData.userId, accountData);
  }

  // Obtener estadísticas de aprendizaje
  public getLearningStats() {
    const totalPixels = this.pixels.size;
    const adaptedPixels = Array.from(this.pixels.values())
      .filter(p => p.adaptationLevel > 0).length;
    
    const totalPatterns = Array.from(this.pixels.values())
      .reduce((sum, p) => sum + p.learnedPatterns.length, 0);
    
    const avgConfidence = Array.from(this.pixels.values())
      .flatMap(p => p.learnedPatterns)
      .reduce((sum, p) => sum + p.confidence, 0) / totalPatterns || 0;

    return {
      totalPixels,
      adaptedPixels,
      adaptationRate: adaptedPixels / totalPixels,
      totalPatterns,
      avgConfidence,
      learningEnabled: this.learningEnabled,
      proAccounts: this.proAccounts.size
    };
  }

  // Obtener píxel específico
  public getPixel(pixelId: string): PixelLearning | undefined {
    return this.pixels.get(pixelId);
  }

  // Obtener todos los píxeles
  public getAllPixels(): PixelLearning[] {
    return Array.from(this.pixels.values());
  }

  // Limpiar comportamientos antiguos
  private cleanupOldBehaviors() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    this.userBehaviors = this.userBehaviors.filter(b => b.timestamp > oneHourAgo);
  }

  // Iniciar loop de aprendizaje
  private startLearningLoop() {
    setInterval(() => {
      this.processLearningQueue();
    }, 1000); // Cada segundo
  }

  // Procesar cola de aprendizaje
  private processLearningQueue() {
    // Procesar comportamientos pendientes
    const recentBehaviors = this.userBehaviors
      .filter(b => Date.now() - b.timestamp.getTime() < 5000); // Últimos 5 segundos
    
    recentBehaviors.forEach(behavior => {
      this.adaptPixelsToBehavior(behavior);
    });
  }

  // Habilitar/deshabilitar aprendizaje
  public setLearningEnabled(enabled: boolean) {
    this.learningEnabled = enabled;
  }

  // Configurar tasa de adaptación
  public setAdaptationRate(rate: number) {
    this.adaptationRate = Math.max(0, Math.min(1, rate));
  }

  // Exportar datos de aprendizaje
  public exportLearningData() {
    return {
      pixels: Array.from(this.pixels.entries()),
      behaviors: this.userBehaviors,
      proAccounts: Array.from(this.proAccounts.entries()),
      stats: this.getLearningStats()
    };
  }

  // Importar datos de aprendizaje
  public importLearningData(data: any) {
    if (data.pixels) {
      this.pixels = new Map(data.pixels);
    }
    if (data.behaviors) {
      this.userBehaviors = data.behaviors;
    }
    if (data.proAccounts) {
      this.proAccounts = new Map(data.proAccounts);
    }
  }
}

// Instancia global del sistema de aprendizaje
export const adaptiveLearningSystem = new AdaptiveLearningSystem();

// Hook de React para usar el sistema de aprendizaje
export function useAdaptiveLearning() {
  const recordBehavior = (behavior: Omit<UserBehavior, 'id' | 'timestamp'>) => {
    adaptiveLearningSystem.recordUserBehavior(behavior);
  };

  const getPixelResponse = (pixelId: string, trigger: string) => {
    return adaptiveLearningSystem.generateAdaptiveResponse(pixelId, trigger);
  };

  const getLearningStats = () => {
    return adaptiveLearningSystem.getLearningStats();
  };

  const registerProAccount = (accountData: ProAccountData) => {
    adaptiveLearningSystem.registerProAccount(accountData);
  };

  return {
    recordBehavior,
    getPixelResponse,
    getLearningStats,
    registerProAccount
  };
}

// Utilidades para integración con aplicaciones
export const PixelLearningUtils = {
  // Crear comportamiento de usuario
  createUserBehavior: (
    userId: string,
    sessionId: string,
    action: string,
    context: string,
    duration: number = 0,
    intensity: number = 1,
    success: boolean = true,
    metadata: Record<string, any> = {}
  ): Omit<UserBehavior, 'id' | 'timestamp'> => ({
    userId,
    sessionId,
    action,
    context,
    duration,
    intensity,
    success,
    metadata
  }),

  // Crear datos de cuenta profesional
  createProAccountData: (
    userId: string,
    accountType: 'pro' | 'enterprise' | 'creator' = 'pro',
    subscriptionTier: 'basic' | 'premium' | 'ultimate' = 'premium',
    learningEnabled: boolean = true,
    dataSharing: boolean = true
  ): ProAccountData => ({
    userId,
    accountType,
    subscriptionTier,
    usagePatterns: [],
    preferences: {
      colorScheme: 'cyberpunk',
      intensity: 'medium',
      speed: 'normal',
      effects: ['glitch', 'matrix'],
      interactions: ['hover', 'click'],
      personalized: false
    },
    learningEnabled,
    dataSharing,
    lastSync: new Date()
  }),

  // Generar ID de píxel
  generatePixelId: (x: number, y: number): string => `pixel_${x}_${y}`,

  // Obtener posición de píxel
  getPixelPosition: (pixelId: string): { x: number; y: number } | null => {
    const match = pixelId.match(/pixel_(\d+)_(\d+)/);
    if (match) {
      return { x: parseInt(match[1]), y: parseInt(match[2]) };
    }
    return null;
  }
};