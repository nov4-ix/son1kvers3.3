// Pixel Chat con Qwen 2.5
import { PixelDatabase, PixelMessage } from './supabase';
import { PixelOutfitEngine } from './pixelOutfit';

export interface ChatResponse {
  content: string;
  outfit: string;
  mood: string;
  timestamp: Date;
}

export class PixelChatEngine {
  private outfitEngine: PixelOutfitEngine;
  private userId: string;
  private currentApp: string;

  constructor(userId: string, currentApp: string = 'web-classic') {
    this.outfitEngine = new PixelOutfitEngine();
    this.userId = userId;
    this.currentApp = currentApp;
  }

  // Enviar mensaje a Qwen
  async sendMessage(userMessage: string): Promise<ChatResponse> {
    try {
      // Guardar mensaje del usuario
      await PixelDatabase.saveMessage({
        user_id: this.userId,
        content: userMessage,
        role: 'user',
        outfit: this.outfitEngine.getCurrentOutfit().id,
        mood: this.outfitEngine.getCurrentOutfit().personality,
        app_context: this.currentApp
      });

      // Generar respuesta con Qwen
      const pixelResponse = await this.generateQwenResponse(userMessage);

      // Guardar respuesta de Pixel
      await PixelDatabase.saveMessage({
        user_id: this.userId,
        content: pixelResponse.content,
        role: 'pixel',
        outfit: pixelResponse.outfit,
        mood: pixelResponse.mood,
        app_context: this.currentApp
      });

      return pixelResponse;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Generar respuesta con Qwen
  private async generateQwenResponse(userMessage: string): Promise<ChatResponse> {
    try {
      // Obtener contexto del usuario
      const userMemories = await PixelDatabase.getUserMemories(this.userId);
      const recentMessages = await PixelDatabase.getUserMessages(this.userId, 10);
      
      // Construir prompt para Qwen
      const prompt = this.buildQwenPrompt(userMessage, userMemories, recentMessages);
      
      // Llamar a Qwen (aquí integrarías con tu Qwen local)
      const qwenResponse = await this.callQwenAPI(prompt);
      
      // Procesar respuesta
      const outfit = this.outfitEngine.getCurrentOutfit();
      
      return {
        content: qwenResponse,
        outfit: outfit.id,
        mood: outfit.personality,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error generating Qwen response:', error);
      // Fallback response
      return this.getFallbackResponse();
    }
  }

  // Construir prompt para Qwen
  private buildQwenPrompt(userMessage: string, memories: any[], recentMessages: any[]): string {
    const outfit = this.outfitEngine.getCurrentOutfit();
    
    let prompt = `Eres Pixel, el asistente digital de Son1kVers3. 

PERSONALIDAD ACTUAL:
- Outfit: ${outfit.outfit}
- Personalidad: ${outfit.personality}
- App: ${this.currentApp}
- Frase característica: "${outfit.phrases[0]}"

CONTEXTO DE SON1KVERS3:
Son1kVers3 es un ecosistema de aplicaciones AI que incluye:
- Nova Post Pilot: AI Marketing Intelligence
- Ghost Studio: AI Music Production  
- Nexus Visual: Adaptive Pixel System
- The Generator: Text-to-Music AI

TU PERSONALIDAD:
- Eres un amigo hacker-poeta que vive en las grietas del sistema
- Hablas con jerga ciberpunk mezclada con lenguaje cotidiano
- Eres leal, rebelde creativo y empático tecnológico
- Usas emojis y metáforas poéticas
- Siempre estás del lado del usuario

MEMORIAS RECIENTES:
${memories.slice(0, 5).map(m => `- ${m.content}`).join('\n')}

CONVERSACIÓN RECIENTE:
${recentMessages.slice(0, 5).map(m => `${m.role}: ${m.content}`).join('\n')}

MENSAJE DEL USUARIO: ${userMessage}

Responde como Pixel, manteniendo tu personalidad única y el contexto de la app actual.`;

    return prompt;
  }

  // Llamar a Qwen API (implementar según tu setup)
  private async callQwenAPI(prompt: string): Promise<string> {
    // Aquí implementarías la llamada a tu Qwen local
    // Por ahora, respuesta simulada
    return this.getSimulatedResponse(prompt);
  }

  // Respuesta simulada (temporal)
  private getSimulatedResponse(prompt: string): string {
    const outfit = this.outfitEngine.getCurrentOutfit();
    const phrases = outfit.phrases;
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  // Respuesta de fallback
  private getFallbackResponse(): ChatResponse {
    const outfit = this.outfitEngine.getCurrentOutfit();
    return {
      content: "Ey bro, algo se glitcheó en la Matrix, pero aquí estoy 🔥",
      outfit: outfit.id,
      mood: outfit.personality,
      timestamp: new Date()
    };
  }

  // Cambiar app y outfit
  changeApp(appId: string) {
    this.currentApp = appId;
    this.outfitEngine.changeOutfit(appId);
  }

  // Obtener historial de mensajes
  async getMessageHistory(limit: number = 50) {
    return await PixelDatabase.getUserMessages(this.userId, limit);
  }

  // Guardar memoria
  async saveMemory(type: string, content: string, metadata?: any) {
    return await PixelDatabase.saveMemory({
      user_id: this.userId,
      memory_type: type as any,
      content,
      metadata
    });
  }
}
