// Configuración de usuario: free_user_003
const USER_CONFIG = {
  userId: 'free_user_003',
  token: 'FREE_TOKEN_003',
  dailyLimit: 3,
  monthlyLimit: 90,
  concurrentLimit: 1,
  rateLimit: 5,
  userType: 'free',
  sunoModel: 'suno-5.0'
};

const USER_TOKENS = {
  primary: 'FREE_TOKEN_003',
  backup: 'FREE_TOKEN_003_backup'
};

// Configuración de branding
const BRANDING = {
  name: 'Son1kVerse AI Music Engine',
  version: '1.0.0',
  description: 'Genera música con IA usando Son1kVerse AI Music Engine - free'
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { USER_CONFIG, USER_TOKENS, BRANDING };
}
