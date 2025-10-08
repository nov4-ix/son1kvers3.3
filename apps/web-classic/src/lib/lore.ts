// Son1kVerse Lore System - Actualizado según SSV-BETA
// Sistema de narrativa integrado para el universo Son1kVerse

export interface LoreContext {
  era: string;
  faction: string;
  mission: string;
  backstory: string;
}

export interface ModuleLore {
  id: string;
  name: string;
  purpose: string;
  history: string;
  faction: 'Resistencia' | 'Neutral' | 'Premium';
  era: 'Pre-Collapse' | 'Collapse' | 'Post-Collapse' | 'Nexus Era';
  connections: string[];
  technology: string; // Nombre épico de la tecnología
}

export const SON1KVERSE_LORE = {
  // Era actual: Post-Collapse, Nexus Era
  currentEra: 'Nexus Era',
  
  // Facciones principales
  factions: {
    Resistencia: {
      name: 'Resistencia',
      description: 'Colectivo humano que lucha por democratizar la creatividad',
      mission: 'Hacer que la tecnología creativa sea accesible para todos',
      color: 'cyan',
      philosophy: 'La creatividad debe ser libre y accesible para todos'
    },
    Neutral: {
      name: 'Neutral',
      description: 'Colaboradores independientes del ecosistema',
      mission: 'Contribuir al crecimiento del ecosistema creativo',
      color: 'accent',
      philosophy: 'La colaboración trasciende las facciones'
    },
    Premium: {
      name: 'Premium',
      description: 'Usuarios que han desbloqueado el acceso a ALVAE',
      mission: 'Explorar los secretos más profundos del universo creativo',
      color: 'magenta',
      philosophy: 'Los secretos más profundos requieren dedicación especial'
    }
  },

  // Historia del universo
  timeline: {
    'Pre-Collapse': {
      description: 'Era de abundancia tecnológica donde la creatividad florecía',
      keyEvents: ['Desarrollo de tecnologías creativas', 'Primeros experimentos de IA musical', 'Democratización de herramientas']
    },
    'Collapse': {
      description: 'Gran caída que fragmentó el mundo digital creativo',
      keyEvents: ['Caída de las redes globales', 'Pérdida masiva de datos creativos', 'Fragmentación de tecnologías']
    },
    'Post-Collapse': {
      description: 'Reconstrucción lenta del ecosistema creativo',
      keyEvents: ['Formación de la Resistencia', 'Recuperación de tecnologías', 'Primeros experimentos de NEXUS']
    },
    'Nexus Era': {
      description: 'Era actual donde NEXUS conecta todos los módulos creativos',
      keyEvents: ['Activación de NEXUS', 'Unificación de la Resistencia', 'Democratización de la creatividad']
    }
  },

  // Tecnologías épicas (nombres protegidos)
  technologies: {
    'nexus-composer': {
      name: 'Nexus Composer',
      description: 'Motor de composición musical con IA',
      icon: '🎵',
      color: '#00FFE7'
    },
    'phantom-voice': {
      name: 'Phantom Voice',
      description: 'Sistema de clonación de voz avanzado',
      icon: '🎭',
      color: '#B84DFF'
    },
    'quantum-speaker': {
      name: 'Quantum Speaker',
      description: 'Síntesis de voz de última generación',
      icon: '🔊',
      color: '#FFD93D'
    },
    'oracle-mind': {
      name: 'Oracle Mind',
      description: 'Sistema de sugerencias inteligentes',
      icon: '🧠',
      color: '#6C5CE7'
    },
    'dimensional-renderer': {
      name: 'Dimensional Renderer',
      description: 'Generador de imágenes dimensionales',
      icon: '🎨',
      color: '#00FFE7'
    }
  }
};

export const MODULES_LORE: ModuleLore[] = [
  {
    id: 'ghost-studio',
    name: 'GHOST STUDIO',
    purpose: 'Democratizar la producción musical usando Nexus Composer',
    history: 'Desarrollado por la Resistencia para hacer la producción musical accesible a todos. Combina Nexus Composer con herramientas de edición profesional.',
    faction: 'Resistencia',
    era: 'Nexus Era',
    connections: ['clone-station', 'sanctuary-social', 'nova-post-pilot'],
    technology: 'nexus-composer'
  },
  {
    id: 'clone-station',
    name: 'CLONE STATION',
    purpose: 'Gestión de datasets y entrenamiento de modelos de voz',
    history: 'Creado por la Resistencia para preservar y compartir voces únicas. Usa Phantom Voice para entrenar modelos personalizados.',
    faction: 'Resistencia',
    era: 'Nexus Era',
    connections: ['ghost-studio', 'sanctuary-social'],
    technology: 'phantom-voice'
  },
  {
    id: 'nova-post-pilot',
    name: 'NOVA POST PILOT',
    purpose: 'Automatizar la difusión de contenido creativo',
    history: 'Desarrollado por la Resistencia para ayudar a creadores a llegar a más audiencias. Combina Oracle Mind con estrategias de marketing.',
    faction: 'Resistencia',
    era: 'Nexus Era',
    connections: ['ghost-studio', 'sanctuary-social'],
    technology: 'oracle-mind'
  },
  {
    id: 'sanctuary-social',
    name: 'SANCTUARY SOCIAL',
    purpose: 'Crear una comunidad colaborativa para creadores',
    history: 'Fundado por la Resistencia como espacio neutral para colaboración. Es donde los creadores se conectan y trabajan juntos.',
    faction: 'Neutral',
    era: 'Nexus Era',
    connections: ['ghost-studio', 'clone-station', 'nova-post-pilot'],
    technology: 'oracle-mind'
  },
  {
    id: 'nexus-visual',
    name: 'NEXUS VISUAL',
    purpose: 'Experiencia inmersiva del ecosistema Son1kVerse',
    history: 'El corazón del NEXUS donde todos los módulos se conectan. Proporciona acceso inmersivo a todo el ecosistema creativo.',
    faction: 'Resistencia',
    era: 'Nexus Era',
    connections: ['ghost-studio', 'clone-station', 'nova-post-pilot', 'sanctuary-social'],
    technology: 'nexus-composer'
  }
];

export const PIXEL_LORE = {
  name: 'Pixel',
  identity: 'Asistente de la Resistencia especializado en creatividad',
  personality: 'Entusiasta, colaborativo, siempre buscando ayudar a los creadores',
  backstory: 'Pixel es un asistente desarrollado por la Resistencia para ayudar a los creadores a navegar el ecosistema Son1kVerse y maximizar su potencial creativo.',
  mission: 'Ser el puente entre la tecnología y la creatividad humana',
  appearance: 'Forma de partícula luminosa que cambia de color según el contexto',
  abilities: [
    'Análisis de patrones creativos',
    'Sugerencias contextuales',
    'Navegación del ecosistema',
    'Optimización de flujos de trabajo'
  ],
  faction: 'Resistencia'
};

// ALVAE - Símbolo mitológico reservado para usuarios premium
export const ALVAE_LORE = {
  name: 'ALVAE',
  identity: 'Entidad mitológica del universo creativo',
  description: 'Símbolo de los secretos más profundos del universo creativo',
  access: 'Premium Only',
  ritual: 'Ritual de iniciación para usuarios premium',
  appearance: 'Símbolo místico que solo aparece a usuarios dedicados',
  powers: [
    'Acceso a tecnologías avanzadas',
    'Funcionalidades exclusivas',
    'Comunidad premium',
    'Secretos del universo creativo'
  ],
  requirements: 'Dedicación especial y contribución al ecosistema'
};

// Funciones para obtener contexto de lore
export const getModuleLore = (moduleId: string): ModuleLore | undefined => {
  return MODULES_LORE.find(module => module.id === moduleId);
};

export const getFactionInfo = (factionName: string) => {
  return SON1KVERSE_LORE.factions[factionName as keyof typeof SON1KVERSE_LORE.factions];
};

export const getEraContext = (era: string) => {
  return SON1KVERSE_LORE.timeline[era as keyof typeof SON1KVERSE_LORE.timeline];
};

export const getTechnologyInfo = (techId: string) => {
  return SON1KVERSE_LORE.technologies[techId as keyof typeof SON1KVERSE_LORE.technologies];
};

export const getConnectedModules = (moduleId: string): ModuleLore[] => {
  const module = getModuleLore(moduleId);
  if (!module) return [];
  
  return MODULES_LORE.filter(m => 
    module.connections.includes(m.id) || m.connections.includes(moduleId)
  );
};

export const isUserPremium = (userTier: string): boolean => {
  return userTier === 'premium' || userTier === 'alvae';
};

export const canAccessALVAE = (userTier: string): boolean => {
  return isUserPremium(userTier);
};