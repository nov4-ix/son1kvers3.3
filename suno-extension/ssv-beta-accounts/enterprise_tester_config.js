// Configuración SSV-BETA: enterprise.tester@son1kvers3.com
const USER_CONFIG = {
  userId: 'enterprise_tester',
  email: 'enterprise.tester@son1kvers3.com',
  password: 'Premium!123',
  tier: 'enterprise',
  token: 'ENTERPRISE_TOKEN_ENTERPRISE_TESTER',
  dailyLimit: 1000,
  monthlyLimit: 30000,
  concurrentLimit: 10,
  rateLimit: 100,
  userType: 'enterprise',
  sunoModel: 'suno-5.0',
  symbol: 'ALVAE',
  nickname: '', // Se asignará al registrarse
  isSSVBeta: true,
  createdAt: new Date().toISOString()
};

const USER_TOKENS = {
  primary: 'ENTERPRISE_TOKEN_ENTERPRISE_TESTER',
  backup: 'ENTERPRISE_TOKEN_ENTERPRISE_TESTER_BACKUP'
};

// Configuración de branding
const BRANDING = {
  name: 'Son1kVerse AI Music Engine',
  version: '1.0.0',
  description: 'Genera música con IA usando Son1kVerse AI Music Engine - SSV-BETA Enterprise'
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { USER_CONFIG, USER_TOKENS, BRANDING };
}
