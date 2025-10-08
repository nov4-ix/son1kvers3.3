// Configuración de usuario: pro_user_002
const USER_CONFIG = {
  userId: 'pro_user_002',
  token: 'PRO_TOKEN_002',
  dailyLimit: 50,
  monthlyLimit: 1500,
  concurrentLimit: 3,
  rateLimit: 30,
  userType: 'pro',
  sunoModel: 'suno-5.0'
};

const USER_TOKENS = {
  primary: 'PRO_TOKEN_002',
  backup: 'PRO_TOKEN_002_backup'
};

// Configuración de branding
const BRANDING = {
  name: 'Son1kVerse AI Music Engine',
  version: '1.0.0',
  description: 'Genera música con IA usando Son1kVerse AI Music Engine - pro'
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { USER_CONFIG, USER_TOKENS, BRANDING };
}
