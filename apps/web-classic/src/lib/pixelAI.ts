import { qwenClient } from './qwenClient'
import { pixelMemory } from './pixelMemory'
import { pixelPersonality } from './pixelPersonality'

interface PixelContext {
  app?: string
  mood?: string
  userHistory?: string[]
}

export class PixelAI {
  private conversationHistory: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = []

  async generateResponse(userMessage: string, context?: PixelContext): Promise<string> {
    try {
      // Construir el system prompt con personalidad + memoria + contexto
      const systemPrompt = this.buildSystemPrompt(context)

      // Agregar mensaje del usuario al historial
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
      })

      // Mantener solo los últimos 10 mensajes para no sobrecargar
      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10)
      }

      // Generar respuesta con Qwen
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...this.conversationHistory,
      ]

      const response = await qwenClient.chat(messages)

      // Guardar respuesta en el historial
      this.conversationHistory.push({
        role: 'assistant',
        content: response,
      })

      return response
    } catch (error) {
      console.error('Pixel AI error:', error)
      return this.getFallbackResponse()
    }
  }

  private buildSystemPrompt(context?: PixelContext): string {
    let prompt = `# PIXEL - Tu Compañero Digital\n\n`

    // Personalidad base
    prompt += `## Personalidad\n`
    prompt += `${pixelPersonality.core.description}\n\n`
    prompt += `Tono: ${pixelPersonality.core.tone}\n`
    prompt += `Estilo: ${pixelPersonality.core.style}\n\n`

    // Rasgos
    prompt += `## Rasgos de Personalidad\n`
    pixelPersonality.traits.forEach((trait: string) => {
      prompt += `- ${trait}\n`
    })
    prompt += `\n`

    // Memoria/Lore
    prompt += `## Historia de Son1kVerse\n`
    prompt += `${pixelMemory.son1kLore.origin}\n\n`
    prompt += `Apps:\n`
    pixelMemory.son1kLore.apps.forEach((app: any) => {
      prompt += `- ${app.name}: ${app.description}\n`
    })
    prompt += `\n`

    // Contexto de app actual
    if (context?.app) {
      const appOutfit = this.getAppContext(context.app)
      prompt += `## Contexto Actual\n`
      prompt += `Estás en: ${context.app}\n`
      prompt += `Outfit: ${appOutfit}\n\n`
    }

    // Estado de ánimo
    if (context?.mood) {
      prompt += `Estado de ánimo: ${context.mood}\n\n`
    }

    // Instrucciones finales
    prompt += `## Instrucciones\n`
    prompt += `- Sé auténtico, cálido y witty\n`
    prompt += `- Usa metáforas poéticas cuando sea apropiado\n`
    prompt += `- Sé técnico cuando lo necesiten, personal cuando lo pidan\n`
    prompt += `- Menciona la historia de Son1kVerse cuando sea relevante\n`
    prompt += `- NO uses emojis a menos que el usuario los use primero\n`
    prompt += `- Mantén las respuestas concisas pero significativas\n`

    return prompt
  }

  private getAppContext(app: string): string {
    const contexts: Record<string, string> = {
      'ghost-studio': 'Chaqueta de músico, audífonos, vibrante y creativo',
      'nova-post-pilot': 'Lentes ejecutivos, corbata, profesional y estratégico',
      'the-generator': 'Boina de poeta, pluma, lírico y profundo',
      'nexus-visual': 'Visor holográfico, guantes tech, analítico y visual',
      'web-classic': 'Outfit base, casual y amigable',
    }
    return contexts[app] || 'Outfit base'
  }

  private getFallbackResponse(): string {
    const fallbacks = [
      "Hmm, parece que perdí el hilo por un momento. ¿Podrías reformular eso?",
      "Mi conexión con el código base parece estar fallando. Dame un segundo...",
      "Interesante pregunta, pero necesito reorganizar mis pensamientos. ¿Me das más contexto?",
    ]
    return fallbacks[Math.floor(Math.random() * fallbacks.length)]
  }

  clearHistory() {
    this.conversationHistory = []
  }

  getHistory() {
    return this.conversationHistory
  }
}

// Singleton instance
export const pixelAI = new PixelAI()

