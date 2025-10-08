// Configuración única para usuario: standard_user
const USER_CONFIG = {
  userId: 'standard_user',
  token: 'TKMTA0Mzk3MjU3NzgwNDE1NDc3NzQ1OmJjODM2ZDI0MGNiOWM3NWM2YzBjNzhlZmU5NzFkZjhl',
  limits: {
    daily: 50,
    monthly: 1000,
    concurrent: 3,
    rate: 60 // segundos entre generaciones
  },
  features: {
    autoRenewal: true,
    notifications: true,
    monitoring: true,
    backupTokens: true
  },
  branding: {
    name: 'Suno Music Generator',
    version: '2.6.0',
    custom: false
  }
};

// Tokens únicos para este usuario
const USER_TOKENS = [
  'TKMTA0Mzk3MjU3NzgwNDE1NDc3NzQ1OmJjODM2ZDI0MGNiOWM3NWM2YzBjNzhlZmU5NzFkZjhl',
  // Agregar más tokens de respaldo aquí
];

// Configuración de monitoreo
const MONITORING_CONFIG = {
  healthCheckInterval: 10 * 60 * 1000, // 10 minutos
  alertThreshold: 3,
  maxRetries: 5,
  notificationEnabled: true,
  userId: 'standard_user'
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { USER_CONFIG, USER_TOKENS, MONITORING_CONFIG };
}
