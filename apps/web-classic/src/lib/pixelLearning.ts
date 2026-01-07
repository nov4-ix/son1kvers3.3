// Pixel Learning System - Integración completa
import { PixelDatabase, PixelMessage, PixelMemory } from './supabase';
import { PixelOutfitEngine } from './pixelOutfit';

export interface UserLearningProfile {
  id: string;
  userId: string;
  preferences: {
    communication_style: 'casual' | 'formal' | 'poetic' | 'technical';
    preferred_outfit: string;
    favorite_apps: string[];
    interaction_patterns: {
      time_of_day: 'morning' | 'afternoon' | 'evening' | 'night';
      session_duration: number;
      message_frequency: number;
    };
  };
  learned_behaviors: {
    common_requests: string[];
    preferred_responses: string[];
    avoided_topics: string[];
    successful_interactions: number;
  };
  adaptation_level: number;
  last_updated: Date;
}

export interface LearningInsight {
  id: string;
  userId: string;
  insight_type: 'preference' | 'pattern' | 'behavior' | 'context';
  content: string;
  confidence: number;
  evidence: string[];
  created_at: Date;
}

export class PixelLearningSystem {
  private outfitEngine: PixelOutfitEngine;
  private userId: string;
  private learningProfile: UserLearningProfile | null = null;
  private insights: LearningInsight[] = [];

  constructor(userId: string) {
    this.outfitEngine = new PixelOutfitEngine();
    this.userId = userId;
    this.initializeLearning();
  }

  // Inicializar sistema de aprendizaje
  private async initializeLearning() {
    try {
      // Cargar perfil de aprendizaje existente
      this.learningProfile = await this.loadLearningProfile();

      // Si no existe, crear uno nuevo
      if (!this.learningProfile) {
        this.learningProfile = await this.createInitialProfile();
      }

      // Cargar insights existentes
      this.insights = await this.loadInsights();

      // Aplicar preferencias al outfit engine
      this.applyUserPreferences();

    } catch (error) {
      console.error('Error initializing learning system:', error);
    }
  }

  // Crear perfil inicial
  private async createInitialProfile(): Promise<UserLearningProfile> {
    const profile: UserLearningProfile = {
      id: `profile_${this.userId}_${Date.now()}`,
      userId: this.userId,
      preferences: {
        communication_style: 'casual',
        preferred_outfit: 'web-classic',
        favorite_apps: ['web-classic'],
        interaction_patterns: {
          time_of_day: this.getTimeOfDay(),
          session_duration: 0,
          message_frequency: 0
        }
      },
      learned_behaviors: {
        common_requests: [],
        preferred_responses: [],
        avoided_topics: [],
        successful_interactions: 0
      },
      adaptation_level: 0.1,
      last_updated: new Date()
    };

    // Guardar en base de datos
    await PixelDatabase.saveMemory({
      user_id: this.userId,
      memory_type: 'preference',
      content: JSON.stringify(profile),
      metadata: { type: 'learning_profile' }
    });

    return profile;
  }

  // Cargar perfil de aprendizaje
  private async loadLearningProfile(): Promise<UserLearningProfile | null> {
    try {
      const memories = await PixelDatabase.getUserMemories(this.userId, 'preference');
      const profileMemory = memories.find((m: any) => m.metadata?.type === 'learning_profile');

      if (profileMemory) {
        return JSON.parse(profileMemory.content);
      }

      return null;
    } catch (error) {
      console.error('Error loading learning profile:', error);
      return null;
    }
  }

  // Cargar insights
  private async loadInsights(): Promise<LearningInsight[]> {
    try {
      const memories = await PixelDatabase.getUserMemories(this.userId, 'context');
      return memories
        .filter((m: any) => m.metadata?.type === 'insight')
        .map((m: any) => JSON.parse(m.content));
    } catch (error) {
      console.error('Error loading insights:', error);
      return [];
    }
  }

  // Aplicar preferencias del usuario
  private applyUserPreferences() {
    if (this.learningProfile) {
      // Cambiar outfit preferido
      this.outfitEngine.changeOutfit(this.learningProfile.preferences.preferred_outfit);

      // Aplicar estilo de comunicación
      this.updateCommunicationStyle();
    }
  }

  // Actualizar estilo de comunicación
  private updateCommunicationStyle() {
    if (!this.learningProfile) return;

    const style = this.learningProfile.preferences.communication_style;

    // Ajustar frases según el estilo
    switch (style) {
      case 'casual':
        // Mantener frases casuales
        break;
      case 'formal':
        // Usar frases más formales
        break;
      case 'poetic':
        // Usar más metáforas
        break;
      case 'technical':
        // Usar más jerga técnica
        break;
    }
  }

  // Aprender de interacción del usuario
  async learnFromInteraction(userMessage: string, pixelResponse: string, success: boolean) {
    if (!this.learningProfile) return;

    try {
      // Actualizar comportamientos aprendidos
      this.updateLearnedBehaviors(userMessage, pixelResponse, success);

      // Generar insights
      await this.generateInsights(userMessage, pixelResponse);

      // Actualizar perfil
      await this.updateLearningProfile();

      // Guardar en base de datos
      await this.saveLearningData();

    } catch (error) {
      console.error('Error learning from interaction:', error);
    }
  }

  // Actualizar comportamientos aprendidos
  private updateLearnedBehaviors(userMessage: string, pixelResponse: string, success: boolean) {
    if (!this.learningProfile) return;

    // Extraer palabras clave del mensaje
    const keywords = this.extractKeywords(userMessage);

    // Actualizar requests comunes
    keywords.forEach(keyword => {
      if (!this.learningProfile!.learned_behaviors.common_requests.includes(keyword)) {
        this.learningProfile!.learned_behaviors.common_requests.push(keyword);
      }
    });

    // Si fue exitoso, agregar a respuestas preferidas
    if (success) {
      this.learningProfile.learned_behaviors.successful_interactions++;

      if (!this.learningProfile.learned_behaviors.preferred_responses.includes(pixelResponse)) {
        this.learningProfile.learned_behaviors.preferred_responses.push(pixelResponse);
      }
    }

    // Actualizar nivel de adaptación
    this.learningProfile.adaptation_level = Math.min(1,
      this.learningProfile.adaptation_level + 0.01
    );
  }

  // Generar insights
  private async generateInsights(userMessage: string, pixelResponse: string) {
    try {
      // Analizar patrones en el mensaje
      const patterns = this.analyzePatterns(userMessage);

      // Crear insights
      for (const pattern of patterns) {
        const insight: LearningInsight = {
          id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: this.userId,
          insight_type: 'pattern',
          content: pattern.description,
          confidence: pattern.confidence,
          evidence: [userMessage],
          created_at: new Date()
        };

        this.insights.push(insight);
      }

    } catch (error) {
      console.error('Error generating insights:', error);
    }
  }

  // Analizar patrones
  private analyzePatterns(message: string): Array<{ description: string, confidence: number }> {
    const patterns = [];

    // Patrón: Preguntas técnicas
    if (message.includes('cómo') || message.includes('por qué') || message.includes('qué')) {
      patterns.push({
        description: 'Usuario hace preguntas técnicas frecuentemente',
        confidence: 0.8
      });
    }

    // Patrón: Solicitudes de ayuda
    if (message.includes('ayuda') || message.includes('problema') || message.includes('error')) {
      patterns.push({
        description: 'Usuario solicita ayuda regularmente',
        confidence: 0.9
      });
    }

    // Patrón: Comentarios positivos
    if (message.includes('gracias') || message.includes('genial') || message.includes('perfecto')) {
      patterns.push({
        description: 'Usuario expresa satisfacción',
        confidence: 0.7
      });
    }

    return patterns;
  }

  // Extraer palabras clave
  private extractKeywords(message: string): string[] {
    const words = message.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);

    return [...new Set(words)];
  }

  // Actualizar perfil de aprendizaje
  private async updateLearningProfile() {
    if (!this.learningProfile) return;

    this.learningProfile.last_updated = new Date();

    // Actualizar preferencias basadas en insights
    this.updatePreferencesFromInsights();
  }

  // Actualizar preferencias desde insights
  private updatePreferencesFromInsights() {
    if (!this.learningProfile) return;

    // Analizar insights para actualizar preferencias
    const technicalInsights = this.insights.filter(i =>
      i.content.includes('técnico') || i.content.includes('técnica')
    );

    if (technicalInsights.length > 3) {
      this.learningProfile.preferences.communication_style = 'technical';
    }

    const poeticInsights = this.insights.filter(i =>
      i.content.includes('poético') || i.content.includes('metáfora')
    );

    if (poeticInsights.length > 2) {
      this.learningProfile.preferences.communication_style = 'poetic';
    }
  }

  // Guardar datos de aprendizaje
  private async saveLearningData() {
    try {
      // Guardar perfil actualizado
      await PixelDatabase.saveMemory({
        user_id: this.userId,
        memory_type: 'preference',
        content: JSON.stringify(this.learningProfile),
        metadata: { type: 'learning_profile' }
      });

      // Guardar insights nuevos
      for (const insight of this.insights) {
        await PixelDatabase.saveMemory({
          user_id: this.userId,
          memory_type: 'context',
          content: JSON.stringify(insight),
          metadata: { type: 'insight' }
        });
      }

    } catch (error) {
      console.error('Error saving learning data:', error);
    }
  }

  // Obtener tiempo del día
  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  // Obtener perfil de aprendizaje
  getLearningProfile(): UserLearningProfile | null {
    return this.learningProfile;
  }

  // Obtener insights
  getInsights(): LearningInsight[] {
    return this.insights;
  }

  // Obtener nivel de adaptación
  getAdaptationLevel(): number {
    return this.learningProfile?.adaptation_level || 0;
  }

  // Obtener preferencias del usuario
  getUserPreferences() {
    return this.learningProfile?.preferences || null;
  }
}
