// Configuración de usuario por defecto
const USER_CONFIG = {
  userId: 'default_user',
  token: 'YOUR_TOKEN_HERE',
  dailyLimit: 10,
  monthlyLimit: 100,
  concurrentLimit: 2,
  rateLimit: 5, // requests per minute
  userType: 'standard', // premium, standard, free
  sunoModel: 'suno-4.5' // Se asigna automáticamente según tier
};

const USER_TOKENS = {
  primary: 'YOUR_TOKEN_HERE',
  backup: 'YOUR_BACKUP_TOKEN_HERE'
};

// Configuración de modelos por tier
const SUNO_MODELS = {
  enterprise: {
    model: 'suno-5.0',
    name: 'Suno 5.0 Enterprise',
    description: 'Máxima calidad, voces ultra-realistas, instrumentación avanzada',
    features: ['Voces ultra-realistas', 'Instrumentación avanzada', 'Mezcla profesional', 'Duración hasta 3 minutos', 'API dedicada'],
    maxDuration: 180,
    quality: 'ultra-high',
    priority: 'highest',
    dailyLimit: 1000,
    monthlyLimit: 30000
  },
  premium: {
    model: 'suno-5.0',
    name: 'Suno 5.0 Premium',
    description: 'Máxima calidad, voces ultra-realistas, instrumentación avanzada',
    features: ['Voces ultra-realistas', 'Instrumentación avanzada', 'Mezcla profesional', 'Duración hasta 3 minutos'],
    maxDuration: 180,
    quality: 'ultra-high',
    priority: 'high',
    dailyLimit: 100,
    monthlyLimit: 3000
  },
  pro: {
    model: 'suno-5.0',
    name: 'Suno 5.0 Pro',
    description: 'Máxima calidad, voces ultra-realistas, instrumentación avanzada',
    features: ['Voces ultra-realistas', 'Instrumentación avanzada', 'Mezcla profesional', 'Duración hasta 3 minutos'],
    maxDuration: 180,
    quality: 'ultra-high',
    priority: 'high',
    dailyLimit: 50,
    monthlyLimit: 1500
  },
  standard: {
    model: 'suno-5.0',
    name: 'Suno 5.0 Standard',
    description: 'Máxima calidad, voces ultra-realistas, instrumentación avanzada',
    features: ['Voces ultra-realistas', 'Instrumentación avanzada', 'Mezcla profesional', 'Duración hasta 3 minutos'],
    maxDuration: 180,
    quality: 'ultra-high',
    priority: 'medium',
    dailyLimit: 20,
    monthlyLimit: 600
  },
  free: {
    model: 'suno-3.5',
    name: 'Suno 3.5 Basic',
    description: 'Calidad estándar, voces claras, instrumentación básica',
    features: ['Voces claras', 'Instrumentación básica', 'Mezcla estándar', 'Duración hasta 1 minuto'],
    maxDuration: 60,
    quality: 'standard',
    priority: 'low',
    dailyLimit: 3,
    monthlyLimit: 90
  }
};

// Configuración de branding
const BRANDING = {
  name: 'Son1kVerse AI Music Engine',
  version: '1.0.0',
  description: 'Genera música con IA usando Son1kVerse AI Music Engine'
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { USER_CONFIG, USER_TOKENS, BRANDING };
}
