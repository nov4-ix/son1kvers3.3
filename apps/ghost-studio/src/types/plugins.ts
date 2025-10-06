// Plugin System Types for Ghost Studio DAW

export interface PluginParameter {
  id: string;
  name: string;
  type: 'float' | 'int' | 'boolean' | 'enum' | 'file';
  min?: number;
  max?: number;
  defaultValue: any;
  currentValue: any;
  unit?: string;
  options?: { value: any; label: string }[];
}

export interface PluginPreset {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  category: string;
}

export interface PluginInfo {
  id: string;
  name: string;
  manufacturer: string;
  version: string;
  category: 'eq' | 'compressor' | 'reverb' | 'delay' | 'distortion' | 'modulation' | 'mastering';
  description: string;
  icon: string;
  isActive: boolean;
  parameters: PluginParameter[];
  presets: PluginPreset[];
  wavesCompatible: boolean;
  wavesPluginId?: string;
}

export interface AudioTrack {
  id: string;
  name: string;
  type: 'audio' | 'midi' | 'generated';
  source: string;
  volume: number;
  pan: number;
  mute: boolean;
  solo: boolean;
  plugins: PluginInfo[];
  waveform?: number[];
  duration: number;
  startTime: number;
}

export interface MixerChannel {
  id: string;
  trackId: string;
  volume: number;
  pan: number;
  mute: boolean;
  solo: boolean;
  plugins: PluginInfo[];
  sends: Record<string, number>;
}

export interface ProjectSettings {
  name: string;
  bpm: number;
  timeSignature: [number, number];
  sampleRate: number;
  bitDepth: number;
  key: string;
  tempo: number;
}

export interface WavesPlugin {
  id: string;
  name: string;
  category: string;
  manufacturer: 'Waves';
  version: string;
  isInstalled: boolean;
  isLicensed: boolean;
  parameters: PluginParameter[];
  presets: PluginPreset[];
  apiEndpoint: string;
}

// Waves Plugin Categories
export const WAVES_CATEGORIES = {
  EQ: 'eq',
  COMPRESSOR: 'compressor',
  REVERB: 'reverb',
  DELAY: 'delay',
  DISTORTION: 'distortion',
  MODULATION: 'modulation',
  MASTERING: 'mastering',
  ANALOG: 'analog',
  VINTAGE: 'vintage',
  MODERN: 'modern'
} as const;

// Popular Waves Plugins
export const POPULAR_WAVES_PLUGINS: WavesPlugin[] = [
  {
    id: 'waves-h-eq',
    name: 'H-EQ',
    category: 'eq',
    manufacturer: 'Waves',
    version: '14.0',
    isInstalled: true,
    isLicensed: true,
    parameters: [
      {
        id: 'low_freq',
        name: 'Low Frequency',
        type: 'float',
        min: 20,
        max: 20000,
        defaultValue: 100,
        currentValue: 100,
        unit: 'Hz'
      },
      {
        id: 'low_gain',
        name: 'Low Gain',
        type: 'float',
        min: -20,
        max: 20,
        defaultValue: 0,
        currentValue: 0,
        unit: 'dB'
      },
      {
        id: 'high_freq',
        name: 'High Frequency',
        type: 'float',
        min: 20,
        max: 20000,
        defaultValue: 10000,
        currentValue: 10000,
        unit: 'Hz'
      },
      {
        id: 'high_gain',
        name: 'High Gain',
        type: 'float',
        min: -20,
        max: 20,
        defaultValue: 0,
        currentValue: 0,
        unit: 'dB'
      }
    ],
    presets: [
      {
        id: 'vocal_bright',
        name: 'Vocal Bright',
        description: 'Brightens vocals for clarity',
        parameters: { low_gain: -2, high_gain: 3 },
        category: 'vocal'
      },
      {
        id: 'bass_boost',
        name: 'Bass Boost',
        description: 'Enhances low frequencies',
        parameters: { low_gain: 4, high_gain: -1 },
        category: 'bass'
      }
    ],
    apiEndpoint: '/api/waves/h-eq'
  },
  {
    id: 'waves-c1-comp',
    name: 'C1 Comp',
    category: 'compressor',
    manufacturer: 'Waves',
    version: '14.0',
    isInstalled: true,
    isLicensed: true,
    parameters: [
      {
        id: 'threshold',
        name: 'Threshold',
        type: 'float',
        min: -60,
        max: 0,
        defaultValue: -20,
        currentValue: -20,
        unit: 'dB'
      },
      {
        id: 'ratio',
        name: 'Ratio',
        type: 'float',
        min: 1,
        max: 20,
        defaultValue: 4,
        currentValue: 4,
        unit: ':1'
      },
      {
        id: 'attack',
        name: 'Attack',
        type: 'float',
        min: 0.1,
        max: 100,
        defaultValue: 10,
        currentValue: 10,
        unit: 'ms'
      },
      {
        id: 'release',
        name: 'Release',
        type: 'float',
        min: 10,
        max: 1000,
        defaultValue: 100,
        currentValue: 100,
        unit: 'ms'
      }
    ],
    presets: [
      {
        id: 'vocal_comp',
        name: 'Vocal Comp',
        description: 'Gentle vocal compression',
        parameters: { threshold: -15, ratio: 3, attack: 5, release: 80 },
        category: 'vocal'
      },
      {
        id: 'drum_smash',
        name: 'Drum Smash',
        description: 'Aggressive drum compression',
        parameters: { threshold: -25, ratio: 8, attack: 1, release: 200 },
        category: 'drums'
      }
    ],
    apiEndpoint: '/api/waves/c1-comp'
  },
  {
    id: 'waves-rverb',
    name: 'R-Verb',
    category: 'reverb',
    manufacturer: 'Waves',
    version: '14.0',
    isInstalled: true,
    isLicensed: true,
    parameters: [
      {
        id: 'room_size',
        name: 'Room Size',
        type: 'float',
        min: 0,
        max: 100,
        defaultValue: 50,
        currentValue: 50,
        unit: '%'
      },
      {
        id: 'decay_time',
        name: 'Decay Time',
        type: 'float',
        min: 0.1,
        max: 20,
        defaultValue: 2.5,
        currentValue: 2.5,
        unit: 's'
      },
      {
        id: 'wet_level',
        name: 'Wet Level',
        type: 'float',
        min: 0,
        max: 100,
        defaultValue: 30,
        currentValue: 30,
        unit: '%'
      },
      {
        id: 'dry_level',
        name: 'Dry Level',
        type: 'float',
        min: 0,
        max: 100,
        defaultValue: 70,
        currentValue: 70,
        unit: '%'
      }
    ],
    presets: [
      {
        id: 'hall_reverb',
        name: 'Hall Reverb',
        description: 'Large hall reverb',
        parameters: { room_size: 80, decay_time: 4.5, wet_level: 25 },
        category: 'hall'
      },
      {
        id: 'room_reverb',
        name: 'Room Reverb',
        description: 'Small room reverb',
        parameters: { room_size: 30, decay_time: 1.2, wet_level: 20 },
        category: 'room'
      }
    ],
    apiEndpoint: '/api/waves/r-verb'
  },
  {
    id: 'waves-h-delay',
    name: 'H-Delay',
    category: 'delay',
    manufacturer: 'Waves',
    version: '14.0',
    isInstalled: true,
    isLicensed: true,
    parameters: [
      {
        id: 'delay_time',
        name: 'Delay Time',
        type: 'float',
        min: 0,
        max: 2000,
        defaultValue: 500,
        currentValue: 500,
        unit: 'ms'
      },
      {
        id: 'feedback',
        name: 'Feedback',
        type: 'float',
        min: 0,
        max: 95,
        defaultValue: 30,
        currentValue: 30,
        unit: '%'
      },
      {
        id: 'mix',
        name: 'Mix',
        type: 'float',
        min: 0,
        max: 100,
        defaultValue: 25,
        currentValue: 25,
        unit: '%'
      },
      {
        id: 'filter_freq',
        name: 'Filter Frequency',
        type: 'float',
        min: 20,
        max: 20000,
        defaultValue: 8000,
        currentValue: 8000,
        unit: 'Hz'
      }
    ],
    presets: [
      {
        id: 'slap_delay',
        name: 'Slap Delay',
        description: 'Classic slapback delay',
        parameters: { delay_time: 120, feedback: 15, mix: 20 },
        category: 'slap'
      },
      {
        id: 'tape_delay',
        name: 'Tape Delay',
        description: 'Warm tape-style delay',
        parameters: { delay_time: 300, feedback: 40, mix: 30, filter_freq: 5000 },
        category: 'tape'
      }
    ],
    apiEndpoint: '/api/waves/h-delay'
  }
];