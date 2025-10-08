// Configuración de usuario: standard_user_002
const USER_CONFIG = {
  userId: 'standard_user_002',
  token: 'STD_TOKEN_002',
  dailyLimit: 20,
  monthlyLimit: 600,
  concurrentLimit: 2,
  rateLimit: 20,
  userType: 'standard',
  sunoModel: 'suno-5.0'
};

const USER_TOKENS = {
  primary: 'STD_TOKEN_002',
  backup: 'STD_TOKEN_002_backup'
};

// Configuración de branding
const BRANDING = {
  name: 'Son1kVerse AI Music Engine',
  version: '1.0.0',
  description: 'Genera música con IA usando Son1kVerse AI Music Engine - standard'
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { USER_CONFIG, USER_TOKENS, BRANDING };
}
