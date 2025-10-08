const $ = (s) => document.querySelector(s);

function buildPayload() {
  const title = $("#title").value.trim();
  const style = $("#style").value.trim();
  const lyrics = $("#lyrics").value.trim();
  const instrumental = $("#instrumental").checked;
  const duration = parseInt($("#duration").value) || 180; // Máxima calidad por defecto
  
  // Obtener configuración del usuario (si está disponible)
  const userType = window.USER_CONFIG?.userType || 'standard';
  const userModel = window.SUNO_MODELS?.[userType]?.model || 'suno-5.0';
  const userMaxDuration = window.SUNO_MODELS?.[userType]?.maxDuration || 180;
  
  // Usar la duración máxima del tier del usuario
  const finalDuration = Math.min(duration, userMaxDuration);
  
  return {
    title: title || "Untitled",
    style: style || "experimental",
    lyrics: lyrics,
    prompt: `Style: ${style}\n\nLyrics:\n${lyrics}`,
    customMode: true,
    instrumental: instrumental,
    tags: [style],
    duration: finalDuration,
    model: userModel, // Usar modelo según tier
    meta: {
      source: "chrome-extension",
      ts: Date.now(),
      model_version: userModel,
      user_tier: userType,
      max_quality: true
    }
  };
}

function safeJSON(x) {
  try {
    return JSON.stringify(x, null, 2);
  } catch {
    return String(x);
  }
}

async function preloadSelected() {
  const { selectedText } = await chrome.storage.local.get("selectedText");
  if (selectedText) {
    $("#lyrics").value = selectedText;
  }
}

async function preloadResult() {
  const { sunoResult, sunoLastError } = await chrome.storage.local.get(["sunoResult", "sunoLastError"]);
  if (sunoResult) {
    $("#result").textContent = safeJSON(sunoResult);
  }
  if (sunoLastError) {
    $("#error").textContent = sunoLastError;
  }
}

function listen() {
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.sunoResult) {
      $("#result").textContent = changes.sunoResult.newValue ? 
        safeJSON(changes.sunoResult.newValue) : "Sin resultados";
    }
    if (changes.sunoLastError) {
      $("#error").textContent = changes.sunoLastError.newValue || "";
    }
  });
}

function refresh() {
  $("#payload").value = safeJSON(buildPayload());
}

function clear() {
  $("#result").textContent = "Sin resultados";
  $("#error").textContent = "";
  chrome.storage.local.remove(["sunoResult", "sunoLastError"]);
}

function generate() {
  $("#status").textContent = "Generando...";
  $("#error").textContent = "";
  
  // Validar campos requeridos
  const title = $("#title").value.trim();
  const style = $("#style").value.trim();
  const lyrics = $("#lyrics").value.trim();
  
  if (!title) {
    $("#error").textContent = "El título es requerido";
    return;
  }
  
  if (!style) {
    $("#error").textContent = "El estilo es requerido";
    return;
  }
  
  if (!lyrics) {
    $("#error").textContent = "La letra es requerida";
    return;
  }
  
  let payload;
  try {
    payload = JSON.parse($("#payload").value || "{}");
  } catch {
    $("#error").textContent = "JSON inválido";
    return;
  }
  
  chrome.runtime.sendMessage({
    action: "generateMusic",
    payload: payload,
    passport: getValidToken()
  }, (response) => {
    if (chrome.runtime.lastError) {
      $("#error").textContent = chrome.runtime.lastError.message;
      return;
    }
    if (!response?.ok) {
      $("#error").textContent = response?.error || "Error";
    } else {
      $("#status").textContent = "¡Enviado!";
      // Mostrar respuesta inmediatamente
      if (response.data) {
        $("#result").textContent = safeJSON(response.data);
      }
    }
  });
}

function saveData() {
  const data = {
    title: $("#title").value,
    style: $("#style").value,
    duration: $("#duration").value,
    lyrics: $("#lyrics").value,
    instrumental: $("#instrumental").checked,
    passport: $("#passport").value
  };
  
  chrome.storage.local.set({ savedData: data }, () => {
    $("#status").textContent = "💾 Datos guardados";
    setTimeout(() => {
      $("#status").textContent = "";
    }, 2000);
  });
}

function loadData() {
  chrome.storage.local.get(["savedData"], (result) => {
    if (result.savedData) {
      const data = result.savedData;
      $("#title").value = data.title || "";
      $("#style").value = data.style || "";
      $("#duration").value = data.duration || "30";
      $("#lyrics").value = data.lyrics || "";
      $("#instrumental").checked = data.instrumental || false;
      $("#passport").value = data.passport || "";
      
      $("#status").textContent = "📁 Datos cargados";
      setTimeout(() => {
        $("#status").textContent = "";
      }, 2000);
      
      // Actualizar payload automáticamente
      refresh();
    } else {
      $("#status").textContent = "❌ No hay datos guardados";
      setTimeout(() => {
        $("#status").textContent = "";
      }, 2000);
    }
  });
}

function checkToken() {
  const passport = getValidToken();
  
  // Mostrar estado de verificación
  updateTokenStatus('checking', '🔍 Verificando token...');
  
  // Payload de prueba mínimo
  const testPayload = {
    title: "Test",
    style: "test",
    lyrics: "test",
    prompt: "Style: test\n\nLyrics:\ntest",
    customMode: true,
    instrumental: false,
    tags: ["test"],
    duration: 10,
    meta: {
      source: "chrome-extension-test",
      ts: Date.now()
    }
  };
  
  chrome.runtime.sendMessage({
    action: "generateMusic",
    payload: testPayload,
    passport: passport
  }, (response) => {
    if (chrome.runtime.lastError) {
      updateTokenStatus('invalid', '❌ Error de conexión');
      return;
    }
    
    if (!response?.ok) {
      updateTokenStatus('invalid', '❌ Token inválido');
    } else if (response.data) {
      // Verificar si la respuesta indica éxito
      if (response.data.response?.code === 200) {
        updateTokenStatus('valid', '✅ Token válido');
      } else if (response.data.response?.code === 401) {
        updateTokenStatus('invalid', '❌ Token expirado');
      } else if (response.data.response?.code === 429) {
        updateTokenStatus('invalid', '⚠️ Límite excedido');
      } else {
        updateTokenStatus('valid', '✅ Token válido (con advertencias)');
      }
    } else {
      updateTokenStatus('invalid', '❌ Sin respuesta');
    }
  });
}

function getValidToken() {
  const passport = $("#passport").value.trim();
  if (passport) {
    return passport;
  }
  
  // Usar token de respaldo si está disponible
  if (BACKUP_TOKENS.length > 0) {
    return BACKUP_TOKENS[RENEWAL_CONFIG.tokenIndex % BACKUP_TOKENS.length];
  }
  
  return DEFAULT_PASSPORT;
}

function rotateToken() {
  if (BACKUP_TOKENS.length > 1) {
    RENEWAL_CONFIG.tokenIndex = (RENEWAL_CONFIG.tokenIndex + 1) % BACKUP_TOKENS.length;
    const newToken = BACKUP_TOKENS[RENEWAL_CONFIG.tokenIndex];
    
    // Actualizar el campo de token si está vacío
    if (!$("#passport").value.trim()) {
      $("#passport").value = newToken;
    }
    
    updateTokenStatus('checking', '🔄 Rotando token...');
    return newToken;
  }
  
  return getValidToken();
}

function startAutoRenewal() {
  if (!RENEWAL_CONFIG.autoRenewal) return;
  
  setInterval(async () => {
    const now = Date.now();
    
    // Verificar si es tiempo de revisar
    if (now - RENEWAL_CONFIG.lastCheck > RENEWAL_CONFIG.checkInterval) {
      RENEWAL_CONFIG.lastCheck = now;
      
      // Verificar token actual
      const currentToken = getValidToken();
      const isValid = await checkTokenSilently(currentToken);
      
      if (!isValid) {
        // Token inválido, intentar rotar
        const newToken = rotateToken();
        updateTokenStatus('checking', '🔄 Renovando token automáticamente...');
        
        // Verificar nuevo token
        setTimeout(() => {
          checkToken();
        }, 2000);
      } else {
        // Token válido, actualizar estado
        updateTokenStatus('valid', '✅ Token válido (auto-renovado)');
      }
    }
  }, RENEWAL_CONFIG.checkInterval);
}

async function checkTokenSilently(token) {
  return new Promise((resolve) => {
    const testPayload = {
      title: "Test",
      style: "test",
      lyrics: "test",
      prompt: "Style: test\n\nLyrics:\ntest",
      customMode: true,
      instrumental: false,
      tags: ["test"],
      duration: 10,
      meta: {
        source: "chrome-extension-auto-check",
        ts: Date.now()
      }
    };
    
    chrome.runtime.sendMessage({
      action: "generateMusic",
      payload: testPayload,
      passport: token
    }, (response) => {
      if (chrome.runtime.lastError) {
        resolve(false);
        return;
      }
      
      if (!response?.ok) {
        resolve(false);
        return;
      }
      
      if (response.data?.response?.code === 200) {
        resolve(true);
      } else if (response.data?.response?.code === 401) {
        resolve(false);
      } else {
        resolve(true); // Asumir válido si no es error de auth
      }
    });
  });
}

// Sistema de alertas y monitoreo avanzado
const MONITORING_CONFIG = {
  healthCheckInterval: 10 * 60 * 1000, // Verificar salud cada 10 minutos
  alertThreshold: 3, // Alertar después de 3 fallos consecutivos
  maxRetries: 5, // Máximo 5 intentos antes de alertar
  notificationEnabled: true, // Notificaciones habilitadas
  lastHealthCheck: 0,
  consecutiveFailures: 0,
  lastSuccessTime: Date.now()
};

function checkAPIHealth() {
  const now = Date.now();
  
  // Verificar si es tiempo de hacer health check
  if (now - MONITORING_CONFIG.lastHealthCheck > MONITORING_CONFIG.healthCheckInterval) {
    MONITORING_CONFIG.lastHealthCheck = now;
    
    // Hacer verificación de salud
    const currentToken = getValidToken();
    checkTokenSilently(currentToken).then(isValid => {
      if (isValid) {
        MONITORING_CONFIG.consecutiveFailures = 0;
        MONITORING_CONFIG.lastSuccessTime = now;
        updateHealthStatus('healthy', '✅ API saludable');
      } else {
        MONITORING_CONFIG.consecutiveFailures++;
        
        if (MONITORING_CONFIG.consecutiveFailures >= MONITORING_CONFIG.alertThreshold) {
          showCriticalAlert();
        } else {
          updateHealthStatus('warning', `⚠️ ${MONITORING_CONFIG.consecutiveFailures} fallos consecutivos`);
        }
      }
    });
  }
}

function updateHealthStatus(status, message) {
  const healthDiv = $("#healthStatus");
  if (!healthDiv) return;
  
  healthDiv.className = `health-status ${status}`;
  healthDiv.textContent = message;
}

function showCriticalAlert() {
  if (MONITORING_CONFIG.notificationEnabled) {
    // Mostrar notificación crítica
    updateHealthStatus('critical', '🚨 ALERTA: Múltiples fallos detectados');
    
    // Intentar rotación de emergencia
    const newToken = rotateToken();
    
    // Verificar después de 30 segundos
    setTimeout(() => {
      checkTokenSilently(newToken).then(isValid => {
        if (isValid) {
          updateHealthStatus('recovered', '✅ Recuperado automáticamente');
          MONITORING_CONFIG.consecutiveFailures = 0;
        } else {
          updateHealthStatus('critical', '🚨 CRÍTICO: Todos los tokens fallan');
          showUserNotification('Todos los tokens han fallado. Por favor, agrega nuevos tokens.');
        }
      });
    }, 30000);
  }
}

function showUserNotification(message) {
  // Crear notificación temporal en la UI
  const notification = document.createElement('div');
  notification.className = 'critical-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff6b6b;
    color: white;
    padding: 15px;
    border-radius: 8px;
    z-index: 10000;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  
  document.body.appendChild(notification);
  
  // Remover después de 10 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 10000);
}

function startAdvancedMonitoring() {
  // Iniciar monitoreo de salud
  setInterval(checkAPIHealth, MONITORING_CONFIG.healthCheckInterval);
  
  // Verificar tiempo desde último éxito
  setInterval(() => {
    const timeSinceSuccess = Date.now() - MONITORING_CONFIG.lastSuccessTime;
    const hoursSinceSuccess = timeSinceSuccess / (1000 * 60 * 60);
    
    if (hoursSinceSuccess > 24) {
      updateHealthStatus('warning', '⚠️ Sin éxito por más de 24 horas');
    }
  }, 60 * 60 * 1000); // Verificar cada hora
}

function addBackupToken() {
  const newToken = prompt("Ingresa un nuevo token de respaldo:");
  if (newToken && newToken.trim()) {
    BACKUP_TOKENS.push(newToken.trim());
    updateTokenStatus('valid', '✅ Token de respaldo agregado');
    
    // Guardar tokens de respaldo
    chrome.storage.local.set({ backupTokens: BACKUP_TOKENS });
  }
}

function updateTokenStatus(status, message) {
  const statusDiv = $("#tokenStatus");
  const indicator = $("#tokenIndicator");
  const messageSpan = $("#tokenMessage");
  
  // Remover clases anteriores
  statusDiv.className = "token-status";
  
  // Agregar nueva clase
  if (status === 'valid') {
    statusDiv.classList.add('valid');
    indicator.textContent = '✅';
  } else if (status === 'invalid') {
    statusDiv.classList.add('invalid');
    indicator.textContent = '❌';
  } else if (status === 'checking') {
    statusDiv.classList.add('checking');
    indicator.textContent = '🔍';
  }
  
  messageSpan.textContent = message;
}

// Constante para el token por defecto
const DEFAULT_PASSPORT = 'TKMTA0Mzk3MjU3NzgwNDE1NDc3NzQ1OmJjODM2ZDI0MGNiOWM3NWM2YzBjNzhlZmU5NzFkZjhl';

// Tokens de respaldo (agregar más cuando estén disponibles)
const BACKUP_TOKENS = [
  'TKMTA0Mzk3MjU3NzgwNDE1NDc3NzQ1OmJjODM2ZDI0MGNiOWM3NWM2YzBjNzhlZmU5NzFkZjhl',
  // Agregar más tokens aquí cuando estén disponibles
];

// Configuración de renovación automática
const RENEWAL_CONFIG = {
  checkInterval: 30 * 60 * 1000, // Verificar cada 30 minutos
  warningThreshold: 2 * 60 * 60 * 1000, // Advertir 2 horas antes
  autoRenewal: true, // Renovación automática habilitada
  lastCheck: 0,
  tokenIndex: 0
};

document.addEventListener("DOMContentLoaded", async () => {
  // ⚖️ Mostrar disclaimer legal si no ha sido aceptado
  if (!isDisclaimerAccepted()) {
    showLegalDisclaimer();
  }
  
  await preloadSelected();
  await preloadResult();
  listen();
  refresh();
  
  // Cargar tokens de respaldo guardados
  chrome.storage.local.get(["backupTokens"], (result) => {
    if (result.backupTokens && result.backupTokens.length > 0) {
      BACKUP_TOKENS.push(...result.backupTokens);
    }
  });
  
  // Verificar token automáticamente al cargar
  setTimeout(() => {
    checkToken();
  }, 1000);
  
  // Iniciar renovación automática
  setTimeout(() => {
    startAutoRenewal();
  }, 5000);
  
  // Iniciar monitoreo avanzado
  setTimeout(() => {
    startAdvancedMonitoring();
  }, 10000);
  
  $("#refreshPayload").onclick = refresh;
  $("#clearResult").onclick = clear;
  $("#generate").onclick = generate;
  $("#saveData").onclick = saveData;
  $("#loadData").onclick = loadData;
  $("#checkToken").onclick = checkToken;
  $("#addBackupToken").onclick = addBackupToken;
  $("#refreshExtension").onclick = refreshExtension;
  
  // ⚖️ Manejar disclaimer legal
  $("#acceptDisclaimer").onclick = acceptDisclaimer;
  $("#rejectDisclaimer").onclick = rejectDisclaimer;
});

// ⚖️ FUNCIONES DE DISCLAIMER LEGAL
function isDisclaimerAccepted() {
  return localStorage.getItem('son1kverse_disclaimer_accepted') === 'true';
}

function showLegalDisclaimer() {
  const disclaimer = document.getElementById('legalDisclaimer');
  if (disclaimer) {
    disclaimer.style.display = 'flex';
  }
}

function acceptDisclaimer() {
  localStorage.setItem('son1kverse_disclaimer_accepted', 'true');
  localStorage.setItem('son1kverse_disclaimer_date', new Date().toISOString());
  
  const disclaimer = document.getElementById('legalDisclaimer');
  if (disclaimer) {
    disclaimer.style.display = 'none';
  }
  
  console.log('✅ Disclaimer legal aceptado');
}

function rejectDisclaimer() {
  alert('Debes aceptar el disclaimer legal para usar Son1kVerse AI Music Engine');
  window.close();
}
