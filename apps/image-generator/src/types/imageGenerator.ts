// Image Generator - Tipos para generación de imágenes con Flux

export interface ImageGenerationRequest {
  prompt: string;
  style: ImageStyle;
  quality: ImageQuality;
  aspectRatio: AspectRatio;
  seed?: number;
  steps?: number;
  guidance?: number;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  thumbnailUrl: string;
  style: ImageStyle;
  quality: ImageQuality;
  aspectRatio: AspectRatio;
  createdAt: string;
  seed: number;
  metadata: ImageMetadata;
}

export interface ImageMetadata {
  width: number;
  height: number;
  fileSize: number;
  generationTime: number;
  model: string;
  version: string;
}

export interface ImageStyle {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  promptModifier: string;
  category: StyleCategory;
}

export interface ImageGallery {
  id: string;
  name: string;
  description: string;
  images: GeneratedImage[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  tags: string[];
}

export type ImageQuality = 'fast' | 'standard' | 'high' | 'ultra';
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '21:9';
export type StyleCategory = 'artistic' | 'photographic' | 'digital' | 'abstract' | 'cyberpunk' | 'fantasy';

// Estilos épicos del universo Son1kVerse
export const IMAGE_STYLES: ImageStyle[] = [
  // === ARTÍSTICOS ===
  {
    id: 'cyberpunk-art',
    name: 'Cyberpunk Art',
    description: 'Arte cyberpunk con neones y tecnología futurista',
    icon: '🌆',
    color: '#B84DFF',
    promptModifier: 'cyberpunk art, neon lights, futuristic cityscape, dark atmosphere, purple and cyan colors, digital art',
    category: 'cyberpunk'
  },
  {
    id: 'nexus-dimension',
    name: 'Nexus Dimension',
    description: 'Dimensión del Nexus con efectos cuánticos',
    icon: '🌀',
    color: '#00FFE7',
    promptModifier: 'quantum dimension, swirling energy, nexus portal, cosmic colors, ethereal atmosphere, digital art',
    category: 'abstract'
  },
  {
    id: 'son1kverse-portrait',
    name: 'Son1kVerse Portrait',
    description: 'Retratos del universo Son1kVerse',
    icon: '👤',
    color: '#9AF7EE',
    promptModifier: 'portrait, cyberpunk character, futuristic design, glowing eyes, digital art, Son1kVerse style',
    category: 'digital'
  },

  // === FOTOGRÁFICOS ===
  {
    id: 'cyberpunk-photo',
    name: 'Cyberpunk Photography',
    description: 'Fotografía cyberpunk realista',
    icon: '📸',
    color: '#FF6B6B',
    promptModifier: 'cyberpunk photography, realistic, neon lights, urban environment, night scene, high quality',
    category: 'photographic'
  },
  {
    id: 'futuristic-landscape',
    name: 'Futuristic Landscape',
    description: 'Paisajes futuristas épicos',
    icon: '🏙️',
    color: '#FFD93D',
    promptModifier: 'futuristic landscape, sci-fi environment, dramatic lighting, epic scale, photorealistic',
    category: 'photographic'
  },

  // === DIGITALES ===
  {
    id: 'digital-art',
    name: 'Digital Art',
    description: 'Arte digital con efectos visuales',
    icon: '🎨',
    color: '#6C5CE7',
    promptModifier: 'digital art, vibrant colors, visual effects, modern art style, high contrast',
    category: 'digital'
  },
  {
    id: 'abstract-cyber',
    name: 'Abstract Cyber',
    description: 'Arte abstracto con temática cyber',
    icon: '⚡',
    color: '#A29BFE',
    promptModifier: 'abstract art, cyber theme, geometric shapes, digital patterns, modern abstract',
    category: 'abstract'
  },

  // === FANTASÍA ===
  {
    id: 'fantasy-realm',
    name: 'Fantasy Realm',
    description: 'Reinos de fantasía épicos',
    icon: '🏰',
    color: '#FD79A8',
    promptModifier: 'fantasy realm, magical environment, epic fantasy, mystical atmosphere, detailed fantasy art',
    category: 'fantasy'
  },
  {
    id: 'magical-portrait',
    name: 'Magical Portrait',
    description: 'Retratos mágicos y místicos',
    icon: '✨',
    color: '#FF9F43',
    promptModifier: 'magical portrait, mystical character, fantasy art, ethereal beauty, magical effects',
    category: 'fantasy'
  },

  // === ESPECIALES SON1KVERSE ===
  {
    id: 'nexus-hall',
    name: 'Nexus Hall',
    description: 'Salón del Nexus con arquitectura cuántica',
    icon: '🏛️',
    color: '#00FFE7',
    promptModifier: 'nexus hall, quantum architecture, cosmic design, ethereal space, Son1kVerse universe',
    category: 'artistic'
  },
  {
    id: 'cyber-studio',
    name: 'Cyber Studio',
    description: 'Estudio cyberpunk para producción musical',
    icon: '🎛️',
    color: '#B84DFF',
    promptModifier: 'cyber studio, music production, futuristic equipment, neon lighting, Son1kVerse style',
    category: 'cyberpunk'
  },
  {
    id: 'quantum-lab',
    name: 'Quantum Lab',
    description: 'Laboratorio cuántico de investigación',
    icon: '🔬',
    color: '#9AF7EE',
    promptModifier: 'quantum laboratory, scientific equipment, futuristic research, cosmic energy, Son1kVerse',
    category: 'digital'
  }
];

// Configuraciones de calidad
export const QUALITY_SETTINGS = {
  fast: {
    name: 'Fast',
    description: 'Generación rápida, calidad estándar',
    steps: 20,
    guidance: 7.5,
    timeEstimate: '10-15 segundos'
  },
  standard: {
    name: 'Standard',
    description: 'Calidad equilibrada, tiempo moderado',
    steps: 30,
    guidance: 7.5,
    timeEstimate: '20-30 segundos'
  },
  high: {
    name: 'High',
    description: 'Alta calidad, tiempo extendido',
    steps: 50,
    guidance: 8.0,
    timeEstimate: '40-60 segundos'
  },
  ultra: {
    name: 'Ultra',
    description: 'Máxima calidad, tiempo prolongado',
    steps: 100,
    guidance: 8.5,
    timeEstimate: '2-3 minutos'
  }
};

// Configuraciones de aspecto
export const ASPECT_RATIO_SETTINGS = {
  '1:1': { name: 'Square', width: 1024, height: 1024 },
  '16:9': { name: 'Widescreen', width: 1920, height: 1080 },
  '9:16': { name: 'Portrait', width: 1080, height: 1920 },
  '4:3': { name: 'Standard', width: 1024, height: 768 },
  '3:4': { name: 'Portrait Standard', width: 768, height: 1024 },
  '21:9': { name: 'Ultrawide', width: 2560, height: 1080 }
};

// Prompts predefinidos para diferentes proyectos
export const PROJECT_PROMPTS = {
  'nexus-visual': [
    'cyberpunk interface, matrix rain, glitch effects, purple and cyan colors',
    'futuristic dashboard, holographic displays, quantum technology',
    'nexus portal, swirling energy, cosmic dimensions, ethereal atmosphere'
  ],
  'ghost-studio': [
    'music production studio, cyberpunk equipment, neon lighting',
    'AI music generation, futuristic sound waves, digital instruments',
    'ghostly music interface, ethereal sound visualization, mystical audio'
  ],
  'sonic-daw': [
    'professional DAW interface, audio mixing console, futuristic design',
    'music production workspace, high-tech equipment, cyberpunk aesthetic',
    'digital audio workstation, professional studio, modern technology'
  ],
  'sanctuary-social': [
    'social media interface, collaborative workspace, futuristic design',
    'community platform, digital connection, cyberpunk social network',
    'collaborative environment, shared creativity, digital community'
  ],
  'nova-post-pilot': [
    'social media automation, content creation, futuristic marketing',
    'digital marketing dashboard, automated posting, cyberpunk interface',
    'content scheduling, social media management, digital automation'
  ],
  'clone-station': [
    'voice cloning laboratory, AI research facility, futuristic technology',
    'dataset management, machine learning, cyberpunk research center',
    'AI training facility, voice synthesis, digital laboratory'
  ]
};

// Tags para organización
export const IMAGE_TAGS = [
  'cyberpunk', 'futuristic', 'neon', 'digital', 'abstract', 'portrait',
  'landscape', 'studio', 'interface', 'technology', 'cosmic', 'quantum',
  'nexus', 'son1kverse', 'music', 'audio', 'social', 'collaboration',
  'automation', 'AI', 'machine-learning', 'research', 'laboratory'
];