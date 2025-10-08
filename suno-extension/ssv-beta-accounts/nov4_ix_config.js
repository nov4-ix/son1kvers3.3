// Configuración SSV-BETA: nov4-ix@son1kvers3.com
const USER_CONFIG = {
  userId: 'nov4_ix',
  email: 'nov4-ix@son1kvers3.com',
  password: 'admin123',
  tier: 'admin',
  token: 'ADMIN_TOKEN_NOV4_IX',
  dailyLimit: 999999,
  monthlyLimit: 999999,
  concurrentLimit: 999,
  rateLimit: 999,
  userType: 'admin',
  sunoModel: 'suno-5.0',
  symbol: 'ALVAE',
  nickname: '', // Se asignará al registrarse
  isSSVBeta: true,
  createdAt: new Date().toISOString()
};

const USER_TOKENS = {
  primary: 'ADMIN_TOKEN_NOV4_IX',
  backup: 'ADMIN_TOKEN_NOV4_IX_BACKUP'
};

// Configuración de branding
const BRANDING = {
  name: 'Son1kVerse AI Music Engine',
  version: '1.0.0',
  description: 'Genera música con IA usando Son1kVerse AI Music Engine - SSV-BETA Admin'
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { USER_CONFIG, USER_TOKENS, BRANDING };
}
