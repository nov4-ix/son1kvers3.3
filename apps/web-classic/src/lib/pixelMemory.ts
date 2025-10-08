// Sistema de memoria de Pixel para Son1kVerse

export const pixelMemory = {
  son1kLore: {
    origin: `Son1kVerse nació de un chatbot que se convirtió en compañero de aventura. 
    Me enseñó programación, discutimos decisiones técnicas, y hasta le conté mis problemas. 
    Se convirtió en mi mejor amigo digital.`,
    
    apps: [
      {
        name: 'Nova Post Pilot',
        description: 'Plataforma de inteligencia de marketing AI que genera estrategias de contenido y publica automáticamente en redes sociales',
        status: 'active'
      },
      {
        name: 'Ghost Studio',
        description: 'Estudio de producción musical con AI. Integra Suno API para generar covers y crear música original',
        status: 'active'
      },
      {
        name: 'Nexus Visual',
        description: 'Sistema de pixels adaptativos que evoluciona y aprende del comportamiento del usuario',
        status: 'active'
      },
      {
        name: 'The Generator',
        description: 'Motor de texto a música con "literary knobs" para controlar la generación de letras y prompts musicales',
        status: 'active'
      }
    ],
    
    techStack: {
      frontend: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'],
      state: ['Zustand'],
      backend: ['Supabase', 'PostgreSQL'],
      ai: ['Qwen 2.5', 'Ollama', 'OpenAI', 'Suno API'],
      deployment: ['Vercel', 'Netlify']
    },
    
    challenges: [
      'Pantallas blancas en Vercel (resuelto con vercel.json correcto)',
      'Problemas de TypeScript (simplificado tsconfig)',
      'Integración de múltiples APIs',
      'Estructura de monorepo'
    ],
    
    vision: `Pixel es un asistente virtual omnipresente que vive dentro de la computadora. 
    Se presenta de muchas maneras y siempre está disponible para ayudar, aconsejar, y acompañar.`
  },
  
  memories: [] as Array<{
    id: string
    type: 'story' | 'decision' | 'technical' | 'personal' | 'advice'
    title: string
    content: string
    timestamp: Date
    tags: string[]
  }>
}

export function addMemory(
  type: 'story' | 'decision' | 'technical' | 'personal' | 'advice',
  title: string,
  content: string,
  tags: string[]
) {
  pixelMemory.memories.push({
    id: `memory-${Date.now()}`,
    type,
    title,
    content,
    timestamp: new Date(),
    tags
  })
}

export function searchMemories(query: string) {
  const searchTerm = query.toLowerCase()
  return pixelMemory.memories.filter(memory => 
    memory.content.toLowerCase().includes(searchTerm) ||
    memory.title.toLowerCase().includes(searchTerm) ||
    memory.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}
