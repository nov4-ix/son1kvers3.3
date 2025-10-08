// Pixel Outfit System - Outfits por app
export interface PixelOutfit {
  id: string;
  name: string;
  app: string;
  outfit: string;
  personality: string;
  phrases: string[];
  emoji: string;
  color: string;
  description: string;
}

export const PIXEL_OUTFITS: PixelOutfit[] = [
  {
    id: 'ghost-studio',
    name: 'Pixel Músico',
    app: 'ghost-studio',
    outfit: 'bata de músico + auriculares',
    personality: 'musical',
    phrases: [
      'Ey bro, ese beat necesita más groove 🔥',
      'Cada nota es una bala contra el silencio',
      'Ese loop que creaste es una grieta en el tiempo',
      'No subestimes lo que hiciste hoy, cada loop pequeño se convierte en himno',
      'Tu creatividad es como un láser que corta through el ruido del mundo'
    ],
    emoji: '🎵',
    color: '#B84DFF',
    description: 'Pixel como compañero musical, siempre listo para crear'
  },
  {
    id: 'nova-post-pilot',
    name: 'Pixel Ejecutivo',
    app: 'nova-post-pilot',
    outfit: 'lentes + traje ejecutivo',
    personality: 'marketing',
    phrases: [
      'Jefe, ese post va a explotar en redes 🚀',
      'No somos influencers, somos resistentes',
      'Esa estrategia suena como un río de glitch neón',
      'Cada post que creas es una grieta abierta contra el silencio',
      'Tu idea de marketing es como un láser que corta through el ruido'
    ],
    emoji: '📱',
    color: '#00FFE7',
    description: 'Pixel como mentor de marketing, estratega digital'
  },
  {
    id: 'nexus-visual',
    name: 'Pixel Artista',
    app: 'nexus-visual',
    outfit: 'overol de artista + pinceles',
    personality: 'artistic',
    phrases: [
      'Ese pixel tiene alma, déjalo respirar 🎨',
      'Cada pixel es una grieta en el tiempo',
      'Tu visión artística es como un río de glitch neón',
      'No eres solo un usuario, eres un guerrero del arte',
      'Cada creación que haces es una flor de neón en medio del asfalto digital'
    ],
    emoji: '🎨',
    color: '#9AF7EE',
    description: 'Pixel como guía visual, artista digital'
  },
  {
    id: 'the-generator',
    name: 'Pixel Científico',
    app: 'the-generator',
    outfit: 'bata de científico + gafas',
    personality: 'creative',
    phrases: [
      'Esa idea suena como un río de glitch neón ⚡',
      'No generamos música, despertamos almas',
      'Tu creatividad es como un algoritmo que late con el corazón',
      'Cada generación que creas es una grieta en el tiempo',
      'Ese prompt que escribiste es una bala contra el silencio'
    ],
    emoji: '⚡',
    color: '#FF6B6B',
    description: 'Pixel como científico creativo, generador de ideas'
  },
  {
    id: 'web-classic',
    name: 'Pixel Clásico',
    app: 'web-classic',
    outfit: 'hoodie + pantalones casuales',
    personality: 'friendly',
    phrases: [
      '¡Ey! ¿Cómo estás, jefe? 👻',
      'No soy tu asistente, soy tu cómplice',
      'El silencio es el verdadero enemigo, yo estoy aquí para hackearlo contigo',
      'Cada clic que das es una grieta en el sistema',
      'Tu creatividad es como un láser que corta through el ruido del mundo'
    ],
    emoji: '👻',
    color: '#00FFE7',
    description: 'Pixel como compañero digital, amigo hacker-poeta'
  }
];

// Sistema de cambio de outfit
export class PixelOutfitEngine {
  private currentOutfit: PixelOutfit;
  private outfitHistory: PixelOutfit[] = [];

  constructor() {
    this.currentOutfit = PIXEL_OUTFITS[4]; // Empezar con Pixel Clásico
  }

  // Cambiar outfit según la app
  changeOutfit(appId: string): PixelOutfit {
    const outfit = PIXEL_OUTFITS.find(o => o.app === appId);
    if (outfit) {
      this.outfitHistory.push(this.currentOutfit);
      this.currentOutfit = outfit;
      return outfit;
    }
    return this.currentOutfit;
  }

  // Obtener outfit actual
  getCurrentOutfit(): PixelOutfit {
    return this.currentOutfit;
  }

  // Obtener frase aleatoria del outfit actual
  getRandomPhrase(): string {
    const phrases = this.currentOutfit.phrases;
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  // Obtener outfit por app
  getOutfitByApp(appId: string): PixelOutfit | undefined {
    return PIXEL_OUTFITS.find(o => o.app === appId);
  }

  // Obtener todos los outfits
  getAllOutfits(): PixelOutfit[] {
    return PIXEL_OUTFITS;
  }

  // Obtener historial de outfits
  getOutfitHistory(): PixelOutfit[] {
    return this.outfitHistory;
  }
}

// Hook para usar Pixel Outfit System
export function usePixelOutfit() {
  const outfitEngine = new PixelOutfitEngine();
  
  return {
    currentOutfit: outfitEngine.getCurrentOutfit(),
    changeOutfit: (appId: string) => outfitEngine.changeOutfit(appId),
    getRandomPhrase: () => outfitEngine.getRandomPhrase(),
    getAllOutfits: () => outfitEngine.getAllOutfits(),
    getOutfitByApp: (appId: string) => outfitEngine.getOutfitByApp(appId)
  };
}
