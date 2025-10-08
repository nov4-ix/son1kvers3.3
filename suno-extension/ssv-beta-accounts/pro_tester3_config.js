// Configuración SSV-BETA: pro.tester3@son1kvers3.com
const USER_CONFIG = {
  userId: 'pro_tester3',
  email: 'pro.tester3@son1kvers3.com',
  password: 'Premium!123',
  tier: 'pro',
  token: 'PRO_TOKEN_PRO_TESTER3',
  dailyLimit: 50,
  monthlyLimit: 1500,
  concurrentLimit: 3,
  rateLimit: 30,
  userType: 'pro',
  sunoModel: 'suno-5.0',
  symbol: 'ALVAE',
  nickname: '', // Se asignará al registrarse
  isSSVBeta: true,
  createdAt: new Date().toISOString()
};

const USER_TOKENS = {
  primary: 'PRO_TOKEN_PRO_TESTER3',
  backup: 'PRO_TOKEN_PRO_TESTER3_BACKUP'
};

// Configuración de branding
const BRANDING = {
  name: 'Son1kVerse AI Music Engine',
  version: '1.0.0',
  description: 'Genera música con IA usando Son1kVerse AI Music Engine - SSV-BETA Pro'
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { USER_CONFIG, USER_TOKENS, BRANDING };
}
