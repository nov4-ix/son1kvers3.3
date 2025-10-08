// 🕵️ SISTEMA DE INSTALACIÓN DISCRETA
// Se integra con la extensión existente para crear usuarios independientes

// Configuración del usuario (se inyecta durante la instalación)
let USER_CONFIG = {
  userId: 'default_user',
  token: 'default_token',
  limits: {
    daily: 50,
    monthly: 1000,
    concurrent: 3,
    rate: 60
  },
  features: {
    autoRenewal: true,
    notifications: true,
    monitoring: true,
    backupTokens: true
  },
  branding: {
    name: 'Son1kVerse AI Music Engine',
    version: '2.6.0',
    custom: false
  }
};

// Tokens únicos para este usuario
let USER_TOKENS = [
  'default_token'
];

// Configuración de monitoreo específica del usuario
let MONITORING_CONFIG = {
  healthCheckInterval: 10 * 60 * 1000, // 10 minutos
  alertThreshold: 3,
  maxRetries: 5,
  notificationEnabled: true,
  userId: 'default_user',
  lastHealthCheck: 0,
  consecutiveFailures: 0,
  lastSuccessTime: Date.now()
};

// Función para cargar configuración del usuario
function loadUserConfig() {
  // Intentar cargar desde el archivo de configuración
  if (typeof USER_CONFIG_OVERRIDE !== 'undefined') {
    USER_CONFIG = { ...USER_CONFIG, ...USER_CONFIG_OVERRIDE };
  }
  
  // Cargar desde storage si existe
  chrome.storage.local.get(['userConfig'], (result) => {
    if (result.userConfig) {
      USER_CONFIG = { ...USER_CONFIG, ...result.userConfig };
    }
  });
  
  // Cargar tokens del usuario
  chrome.storage.local.get(['userTokens'], (result) => {
    if (result.userTokens) {
      USER_TOKENS = result.userTokens;
    }
  });
}

// Función para verificar límites del usuario
function checkUserLimits() {
  const today = new Date().toISOString().split('T')[0];
  const storageKey = `user_${USER_CONFIG.userId}_usage_${today}`;
  
  return chrome.storage.local.get([storageKey]).then(result => {
    const usage = result[storageKey] || { daily: 0, monthly: 0, concurrent: 0 };
    
    return {
      canGenerate: usage.daily < USER_CONFIG.limits.daily,
      remaining: USER_CONFIG.limits.daily - usage.daily,
      usage: usage
    };
  });
}

// Función para registrar uso del usuario
function recordUserUsage() {
  const today = new Date().toISOString().split('T')[0];
  const storageKey = `user_${USER_CONFIG.userId}_usage_${today}`;
  
  chrome.storage.local.get([storageKey], (result) => {
    const usage = result[storageKey] || { daily: 0, monthly: 0, concurrent: 0 };
    usage.daily += 1;
    usage.monthly += 1;
    
    chrome.storage.local.set({ [storageKey]: usage });
  });
}

// Función para mostrar límites del usuario
function showUserLimits() {
  checkUserLimits().then(limits => {
    const limitsDiv = document.getElementById('userLimits');
    if (!limitsDiv) {
      // Crear div de límites si no existe
      const newDiv = document.createElement('div');
      newDiv.id = 'userLimits';
      newDiv.className = 'user-limits';
      newDiv.innerHTML = `
        <h3>📊 Tus Límites (Usuario: ${USER_CONFIG.userId})</h3>
        <div class="limits-grid">
          <div class="limit-item">
            <span class="limit-label">Diario:</span>
            <span class="limit-value">${limits.remaining}/${USER_CONFIG.limits.daily}</span>
          </div>
          <div class="limit-item">
            <span class="limit-label">Mensual:</span>
            <span class="limit-value">${USER_CONFIG.limits.monthly}</span>
          </div>
          <div class="limit-item">
            <span class="limit-label">Simultáneas:</span>
            <span class="limit-value">${USER_CONFIG.limits.concurrent}</span>
          </div>
        </div>
      `;
      
      // Insertar después del token status
      const tokenStatus = document.getElementById('tokenStatus');
      if (tokenStatus) {
        tokenStatus.parentNode.insertBefore(newDiv, tokenStatus.nextSibling);
      }
    } else {
      // Actualizar límites existentes
      limitsDiv.innerHTML = `
        <h3>📊 Tus Límites (Usuario: ${USER_CONFIG.userId})</h3>
        <div class="limits-grid">
          <div class="limit-item">
            <span class="limit-label">Diario:</span>
            <span class="limit-value">${limits.remaining}/${USER_CONFIG.limits.daily}</span>
          </div>
          <div class="limit-item">
            <span class="limit-label">Mensual:</span>
            <span class="limit-value">${USER_CONFIG.limits.monthly}</span>
          </div>
          <div class="limit-item">
            <span class="limit-label">Simultáneas:</span>
            <span class="limit-value">${USER_CONFIG.limits.concurrent}</span>
          </div>
        </div>
      `;
    }
  });
}

// Función para monitoreo específico del usuario
function startUserMonitoring() {
  if (!USER_CONFIG.features.monitoring) return;
  
  // Monitoreo de límites
  setInterval(() => {
    checkUserLimits().then(limits => {
      if (limits.remaining <= 5) {
        showUserNotification(`⚠️ Te quedan ${limits.remaining} generaciones diarias`);
      }
    });
  }, 60000); // Cada minuto
  
  // Monitoreo de salud específico del usuario
  setInterval(() => {
    const currentToken = getValidToken();
    checkTokenSilently(currentToken).then(isValid => {
      if (!isValid) {
        MONITORING_CONFIG.consecutiveFailures++;
        
        if (MONITORING_CONFIG.consecutiveFailures >= MONITORING_CONFIG.alertThreshold) {
          showUserNotification(`🚨 Usuario ${USER_CONFIG.userId}: Token necesita renovación`);
        }
      } else {
        MONITORING_CONFIG.consecutiveFailures = 0;
        MONITORING_CONFIG.lastSuccessTime = Date.now();
      }
    });
  }, MONITORING_CONFIG.healthCheckInterval);
}

// Función para notificaciones del usuario
function showUserNotification(message) {
  if (!USER_CONFIG.features.notifications) return;
  
  const notification = document.createElement('div');
  notification.className = 'user-notification';
  notification.textContent = `[${USER_CONFIG.userId}] ${message}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #00ffe7;
    color: #0b0b0f;
    padding: 12px 16px;
    border-radius: 8px;
    z-index: 10000;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,255,231,0.3);
    font-weight: 600;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

// Función para personalizar la interfaz según el usuario
function customizeInterface() {
  // Cambiar título si es personalizado
  if (USER_CONFIG.branding.custom) {
    const title = document.querySelector('h1');
    if (title) {
      title.textContent = USER_CONFIG.branding.name;
    }
  }
  
  // Mostrar ID del usuario
  const userInfo = document.createElement('div');
  userInfo.className = 'user-info';
  userInfo.innerHTML = `
    <small>👤 Usuario: ${USER_CONFIG.userId}</small>
  `;
  userInfo.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0,255,231,0.1);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    color: #00ffe7;
  `;
  
  document.body.appendChild(userInfo);
}

// Función para configurar tokens del usuario
function configureUserTokens() {
  // Usar token del usuario si está configurado
  if (USER_CONFIG.token && USER_CONFIG.token !== 'default_token') {
    const passportField = document.getElementById('passport');
    if (passportField && !passportField.value.trim()) {
      passportField.value = USER_CONFIG.token;
    }
  }
  
  // Configurar tokens de respaldo
  if (USER_TOKENS.length > 0) {
    BACKUP_TOKENS.length = 0;
    BACKUP_TOKENS.push(...USER_TOKENS);
  }
}

// Función para verificar antes de generar
function checkBeforeGenerate() {
  return checkUserLimits().then(limits => {
    if (!limits.canGenerate) {
      showUserNotification(`❌ Has alcanzado tu límite diario de ${USER_CONFIG.limits.daily} generaciones`);
      return false;
    }
    
    return true;
  });
}

// Función para registrar después de generar
function recordAfterGenerate() {
  recordUserUsage();
  showUserLimits(); // Actualizar límites mostrados
}

// Inicialización del sistema de usuario
function initializeUserSystem() {
  // Cargar configuración del usuario
  loadUserConfig();
  
  // Configurar tokens
  configureUserTokens();
  
  // Personalizar interfaz
  customizeInterface();
  
  // Mostrar límites del usuario
  showUserLimits();
  
  // Iniciar monitoreo del usuario
  startUserMonitoring();
  
  console.log(`👤 Sistema de usuario inicializado para: ${USER_CONFIG.userId}`);
}

// Integración con las funciones existentes
function integrateWithExistingSystem() {
  // Sobrescribir función generate para incluir verificación de límites
  const originalGenerate = window.generate;
  window.generate = function() {
    checkBeforeGenerate().then(canGenerate => {
      if (canGenerate) {
        originalGenerate();
        recordAfterGenerate();
      }
    });
  };
  
  // Sobrescribir función getValidToken para usar tokens del usuario
  const originalGetValidToken = window.getValidToken;
  window.getValidToken = function() {
    const passport = $("#passport").value.trim();
    if (passport) {
      return passport;
    }
    
    // Usar token del usuario
    if (USER_CONFIG.token && USER_CONFIG.token !== 'default_token') {
      return USER_CONFIG.token;
    }
    
    // Usar tokens de respaldo del usuario
    if (USER_TOKENS.length > 0) {
      return USER_TOKENS[RENEWAL_CONFIG.tokenIndex % USER_TOKENS.length];
    }
    
    return originalGetValidToken();
  };
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Esperar un poco para que se carguen las funciones existentes
  setTimeout(() => {
    initializeUserSystem();
    integrateWithExistingSystem();
  }, 1000);
});

// Exportar funciones para uso externo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    USER_CONFIG,
    USER_TOKENS,
    MONITORING_CONFIG,
    loadUserConfig,
    checkUserLimits,
    recordUserUsage,
    showUserLimits,
    startUserMonitoring,
    showUserNotification,
    customizeInterface,
    configureUserTokens,
    checkBeforeGenerate,
    recordAfterGenerate,
    initializeUserSystem,
    integrateWithExistingSystem
  };
}
