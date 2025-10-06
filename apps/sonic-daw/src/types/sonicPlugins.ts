// Sonic DAW - Plugins Épicos del Universo Son1kVerse

export interface SonicPluginParameter {
  id: string;
  name: string;
  type: 'float' | 'int' | 'boolean' | 'enum' | 'file' | 'color';
  min?: number;
  max?: number;
  defaultValue: any;
  currentValue: any;
  unit?: string;
  options?: { value: any; label: string }[];
  description?: string;
}

export interface SonicPluginPreset {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  category: string;
  author?: string;
}

export interface SonicPlugin {
  id: string;
  name: string;
  category: 'eq' | 'compressor' | 'reverb' | 'delay' | 'distortion' | 'modulation' | 'mastering' | 'synth' | 'filter';
  description: string;
  icon: string;
  isActive: boolean;
  parameters: SonicPluginParameter[];
  presets: SonicPluginPreset[];
  wavesCompatible: boolean;
  wavesPluginId?: string;
  version: string;
  author: string;
  color: string;
}

// 🎵 PLUGINS ÉPICOS DEL SON1KVERSE 🎵

export const SONIC_PLUGINS: SonicPlugin[] = [
  // === EQUALIZADORES ===
  {
    id: 'nexus-spectrum',
    name: 'Nexus Spectrum',
    category: 'eq',
    description: 'Equalizador espectral avanzado con tecnología de resonancia cuántica',
    icon: '🌀',
    isActive: false,
    version: '1.0.0',
    author: 'Son1kVerse Labs',
    color: '#00FFE7',
    wavesCompatible: true,
    wavesPluginId: 'waves-h-eq',
    parameters: [
      {
        id: 'quantum_resonance',
        name: 'Quantum Resonance',
        type: 'float',
        min: 0,
        max: 100,
        defaultValue: 50,
        currentValue: 50,
        unit: '%',
        description: 'Intensidad de la resonancia cuántica'
      },
      {
        id: 'spectral_shift',
        name: 'Spectral Shift',
        type: 'float',
        min: -20,
        max: 20,
        defaultValue: 0,
        currentValue: 0,
        unit: 'dB',
        description: 'Desplazamiento espectral'
      },
      {
        id: 'dimensional_focus',
        name: 'Dimensional Focus',
        type: 'enum',
        defaultValue: 'balanced',
        currentValue: 'balanced',
        options: [
          { value: 'balanced', label: 'Balanced' },
          { value: 'dimensional', label: 'Dimensional' },
          { value: 'quantum', label: 'Quantum' },
          { value: 'nexus', label: 'Nexus' }
        ],
        description: 'Modo de enfoque dimensional'
      },
      {
        id: 'frequency_band_1',
        name: 'Low Nexus Band',
        type: 'float',
        min: -20,
        max: 20,
        defaultValue: 0,
        currentValue: 0,
        unit: 'dB',
        description: 'Banda baja del Nexus'
      },
      {
        id: 'frequency_band_2',
        name: 'Mid Nexus Band',
        type: 'float',
        min: -20,
        max: 20,
        defaultValue: 0,
        currentValue: 0,
        unit: 'dB',
        description: 'Banda media del Nexus'
      },
      {
        id: 'frequency_band_3',
        name: 'High Nexus Band',
        type: 'float',
        min: -20,
        max: 20,
        defaultValue: 0,
        currentValue: 0,
        unit: 'dB',
        description: 'Banda alta del Nexus'
      }
    ],
    presets: [
      {
        id: 'nexus_vocal_enhance',
        name: 'Nexus Vocal Enhance',
        description: 'Realza voces con tecnología Nexus',
        parameters: { frequency_band_2: 3, quantum_resonance: 75 },
        category: 'vocal',
        author: 'Son1kVerse'
      },
      {
        id: 'quantum_bass_boost',
        name: 'Quantum Bass Boost',
        description: 'Refuerzo de graves con resonancia cuántica',
        parameters: { frequency_band_1: 6, quantum_resonance: 60 },
        category: 'bass',
        author: 'Son1kVerse'
      },
      {
        id: 'dimensional_clarity',
        name: 'Dimensional Clarity',
        description: 'Claridad dimensional para instrumentos',
        parameters: { frequency_band_3: 4, dimensional_focus: 'dimensional' },
        category: 'instrumental',
        author: 'Son1kVerse'
      }
    ]
  },

  // === COMPRESORES ===
  {
    id: 'cyber-compressor',
    name: 'Cyber Compressor',
    category: 'compressor',
    description: 'Compresor cyberpunk con algoritmos de inteligencia artificial',
    icon: '⚡',
    isActive: false,
    version: '1.0.0',
    author: 'Son1kVerse Labs',
    color: '#B84DFF',
    wavesCompatible: true,
    wavesPluginId: 'waves-c1-comp',
    parameters: [
      {
        id: 'ai_threshold',
        name: 'AI Threshold',
        type: 'float',
        min: -60,
        max: 0,
        defaultValue: -20,
        currentValue: -20,
        unit: 'dB',
        description: 'Umbral inteligente de compresión'
      },
      {
        id: 'cyber_ratio',
        name: 'Cyber Ratio',
        type: 'float',
        min: 1,
        max: 20,
        defaultValue: 4,
        currentValue: 4,
        unit: ':1',
        description: 'Ratio de compresión cyberpunk'
      },
      {
        id: 'quantum_attack',
        name: 'Quantum Attack',
        type: 'float',
        min: 0.1,
        max: 100,
        defaultValue: 10,
        currentValue: 10,
        unit: 'ms',
        description: 'Ataque cuántico ultra-rápido'
      },
      {
        id: 'nexus_release',
        name: 'Nexus Release',
        type: 'float',
        min: 10,
        max: 1000,
        defaultValue: 100,
        currentValue: 100,
        unit: 'ms',
        description: 'Liberación del Nexus'
      },
      {
        id: 'ai_mode',
        name: 'AI Mode',
        type: 'enum',
        defaultValue: 'adaptive',
        currentValue: 'adaptive',
        options: [
          { value: 'adaptive', label: 'Adaptive AI' },
          { value: 'aggressive', label: 'Aggressive AI' },
          { value: 'gentle', label: 'Gentle AI' },
          { value: 'mastering', label: 'Mastering AI' }
        ],
        description: 'Modo de inteligencia artificial'
      }
    ],
    presets: [
      {
        id: 'cyber_vocal_smash',
        name: 'Cyber Vocal Smash',
        description: 'Compresión agresiva para voces cyberpunk',
        parameters: { ai_threshold: -15, cyber_ratio: 6, ai_mode: 'aggressive' },
        category: 'vocal',
        author: 'Son1kVerse'
      },
      {
        id: 'quantum_drum_smash',
        name: 'Quantum Drum Smash',
        description: 'Compresión cuántica para baterías',
        parameters: { ai_threshold: -25, cyber_ratio: 8, quantum_attack: 1 },
        category: 'drums',
        author: 'Son1kVerse'
      },
      {
        id: 'nexus_mastering',
        name: 'Nexus Mastering',
        description: 'Compresión de mastering con tecnología Nexus',
        parameters: { ai_threshold: -8, cyber_ratio: 2, ai_mode: 'mastering' },
        category: 'mastering',
        author: 'Son1kVerse'
      }
    ]
  },

  // === REVERBS ===
  {
    id: 'dimensional-reverb',
    name: 'Dimensional Reverb',
    category: 'reverb',
    description: 'Reverb dimensional que transporta el sonido a través del espacio-tiempo',
    icon: '🌌',
    isActive: false,
    version: '1.0.0',
    author: 'Son1kVerse Labs',
    color: '#9AF7EE',
    wavesCompatible: true,
    wavesPluginId: 'waves-rverb',
    parameters: [
      {
        id: 'space_dimension',
        name: 'Space Dimension',
        type: 'float',
        min: 0,
        max: 100,
        defaultValue: 50,
        currentValue: 50,
        unit: '%',
        description: 'Dimensión del espacio sonoro'
      },
      {
        id: 'time_decay',
        name: 'Time Decay',
        type: 'float',
        min: 0.1,
        max: 20,
        defaultValue: 2.5,
        currentValue: 2.5,
        unit: 's',
        description: 'Decaimiento temporal'
      },
      {
        id: 'dimensional_wet',
        name: 'Dimensional Wet',
        type: 'float',
        min: 0,
        max: 100,
        defaultValue: 30,
        currentValue: 30,
        unit: '%',
        description: 'Nivel dimensional húmedo'
      },
      {
        id: 'nexus_dry',
        name: 'Nexus Dry',
        type: 'float',
        min: 0,
        max: 100,
        defaultValue: 70,
        currentValue: 70,
        unit: '%',
        description: 'Nivel Nexus seco'
      },
      {
        id: 'space_type',
        name: 'Space Type',
        type: 'enum',
        defaultValue: 'nexus_hall',
        currentValue: 'nexus_hall',
        options: [
          { value: 'nexus_hall', label: 'Nexus Hall' },
          { value: 'quantum_chamber', label: 'Quantum Chamber' },
          { value: 'dimensional_cathedral', label: 'Dimensional Cathedral' },
          { value: 'cyber_warehouse', label: 'Cyber Warehouse' },
          { value: 'void_space', label: 'Void Space' }
        ],
        description: 'Tipo de espacio dimensional'
      }
    ],
    presets: [
      {
        id: 'nexus_cathedral',
        name: 'Nexus Cathedral',
        description: 'Catedral dimensional del Nexus',
        parameters: { space_dimension: 85, time_decay: 4.5, space_type: 'dimensional_cathedral' },
        category: 'hall',
        author: 'Son1kVerse'
      },
      {
        id: 'quantum_chamber',
        name: 'Quantum Chamber',
        description: 'Cámara cuántica íntima',
        parameters: { space_dimension: 30, time_decay: 1.2, space_type: 'quantum_chamber' },
        category: 'room',
        author: 'Son1kVerse'
      },
      {
        id: 'cyber_void',
        name: 'Cyber Void',
        description: 'Vacío cyberpunk infinito',
        parameters: { space_dimension: 95, time_decay: 8.0, space_type: 'void_space' },
        category: 'ambient',
        author: 'Son1kVerse'
      }
    ]
  },

  // === DELAYS ===
  {
    id: 'temporal-delay',
    name: 'Temporal Delay',
    category: 'delay',
    description: 'Delay temporal que manipula el flujo del tiempo sonoro',
    icon: '⏰',
    isActive: false,
    version: '1.0.0',
    author: 'Son1kVerse Labs',
    color: '#FF6B6B',
    wavesCompatible: true,
    wavesPluginId: 'waves-h-delay',
    parameters: [
      {
        id: 'time_manipulation',
        name: 'Time Manipulation',
        type: 'float',
        min: 0,
        max: 2000,
        defaultValue: 500,
        currentValue: 500,
        unit: 'ms',
        description: 'Manipulación temporal del delay'
      },
      {
        id: 'nexus_feedback',
        name: 'Nexus Feedback',
        type: 'float',
        min: 0,
        max: 95,
        defaultValue: 30,
        currentValue: 30,
        unit: '%',
        description: 'Retroalimentación del Nexus'
      },
      {
        id: 'dimensional_mix',
        name: 'Dimensional Mix',
        type: 'float',
        min: 0,
        max: 100,
        defaultValue: 25,
        currentValue: 25,
        unit: '%',
        description: 'Mezcla dimensional'
      },
      {
        id: 'quantum_filter',
        name: 'Quantum Filter',
        type: 'float',
        min: 20,
        max: 20000,
        defaultValue: 8000,
        currentValue: 8000,
        unit: 'Hz',
        description: 'Filtro cuántico'
      },
      {
        id: 'time_mode',
        name: 'Time Mode',
        type: 'enum',
        defaultValue: 'temporal',
        currentValue: 'temporal',
        options: [
          { value: 'temporal', label: 'Temporal' },
          { value: 'quantum', label: 'Quantum' },
          { value: 'dimensional', label: 'Dimensional' },
          { value: 'cyber', label: 'Cyber' }
        ],
        description: 'Modo temporal'
      }
    ],
    presets: [
      {
        id: 'quantum_slap',
        name: 'Quantum Slap',
        description: 'Slapback cuántico clásico',
        parameters: { time_manipulation: 120, nexus_feedback: 15, time_mode: 'quantum' },
        category: 'slap',
        author: 'Son1kVerse'
      },
      {
        id: 'dimensional_echo',
        name: 'Dimensional Echo',
        description: 'Eco dimensional espacial',
        parameters: { time_manipulation: 300, nexus_feedback: 40, time_mode: 'dimensional' },
        category: 'echo',
        author: 'Son1kVerse'
      },
      {
        id: 'cyber_triplet',
        name: 'Cyber Triplet',
        description: 'Delay triplet cyberpunk',
        parameters: { time_manipulation: 200, nexus_feedback: 25, time_mode: 'cyber' },
        category: 'triplet',
        author: 'Son1kVerse'
      }
    ]
  },

  // === DISTORSIONES ===
  {
    id: 'quantum-distortion',
    name: 'Quantum Distortion',
    category: 'distortion',
    description: 'Distorsión cuántica que rompe las barreras del sonido',
    icon: '💥',
    isActive: false,
    version: '1.0.0',
    author: 'Son1kVerse Labs',
    color: '#FFD93D',
    wavesCompatible: false,
    parameters: [
      {
        id: 'quantum_drive',
        name: 'Quantum Drive',
        type: 'float',
        min: 0,
        max: 100,
        defaultValue: 50,
        currentValue: 50,
        unit: '%',
        description: 'Drive cuántico'
      },
      {
        id: 'nexus_tone',
        name: 'Nexus Tone',
        type: 'float',
        min: 0,
        max: 100,
        defaultValue: 50,
        currentValue: 50,
        unit: '%',
        description: 'Tono del Nexus'
      },
      {
        id: 'dimensional_level',
        name: 'Dimensional Level',
        type: 'float',
        min: 0,
        max: 100,
        defaultValue: 75,
        currentValue: 75,
        unit: '%',
        description: 'Nivel dimensional'
      },
      {
        id: 'distortion_type',
        name: 'Distortion Type',
        type: 'enum',
        defaultValue: 'quantum',
        currentValue: 'quantum',
        options: [
          { value: 'quantum', label: 'Quantum' },
          { value: 'nexus', label: 'Nexus' },
          { value: 'dimensional', label: 'Dimensional' },
          { value: 'cyber', label: 'Cyber' }
        ],
        description: 'Tipo de distorsión'
      }
    ],
    presets: [
      {
        id: 'quantum_crunch',
        name: 'Quantum Crunch',
        description: 'Crunch cuántico para guitarras',
        parameters: { quantum_drive: 75, nexus_tone: 60, distortion_type: 'quantum' },
        category: 'guitar',
        author: 'Son1kVerse'
      },
      {
        id: 'nexus_fuzz',
        name: 'Nexus Fuzz',
        description: 'Fuzz del Nexus',
        parameters: { quantum_drive: 90, nexus_tone: 40, distortion_type: 'nexus' },
        category: 'fuzz',
        author: 'Son1kVerse'
      }
    ]
  }
];

// Categorías de plugins
export const PLUGIN_CATEGORIES = {
  EQ: 'eq',
  COMPRESSOR: 'compressor',
  REVERB: 'reverb',
  DELAY: 'delay',
  DISTORTION: 'distortion',
  MODULATION: 'modulation',
  MASTERING: 'mastering',
  SYNTH: 'synth',
  FILTER: 'filter'
} as const;

// Colores por categoría
export const CATEGORY_COLORS = {
  eq: '#00FFE7',
  compressor: '#B84DFF',
  reverb: '#9AF7EE',
  delay: '#FF6B6B',
  distortion: '#FFD93D',
  modulation: '#FF9F43',
  mastering: '#6C5CE7',
  synth: '#A29BFE',
  filter: '#FD79A8'
} as const;