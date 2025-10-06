export const api = {
  async publishPostManually(postId: string) {
    // Mock API call
    console.log(`API: Publishing post ${postId} manually`)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      postId,
      publishedAt: new Date(),
      message: 'Post published successfully',
    }
  },

  async runJobManually() {
    // Mock API call
    console.log('API: Running job manually')
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      message: 'Job executed successfully',
      timestamp: new Date(),
    }
  },

  async generateAISuggestion(prompt: string) {
    // Mock AI API call
    console.log(`API: Generating AI suggestion for: ${prompt}`)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock AI suggestions
    const suggestions = [
      `🚀 ${prompt} - Descubre cómo transformar tu estrategia digital y alcanzar nuevos niveles de engagement.`,
      `💡 ${prompt} - La clave está en la autenticidad y la conexión emocional con tu audiencia.`,
      `✨ ${prompt} - Innovación y creatividad se unen para crear contenido que realmente importa.`,
      `🎯 ${prompt} - Enfócate en el valor que aportas a tu comunidad y verás resultados increíbles.`,
    ]
    
    return suggestions[Math.floor(Math.random() * suggestions.length)]
  },
}