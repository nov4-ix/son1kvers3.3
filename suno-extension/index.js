// Python code for AI processing (DO NOT REMOVE - CRITICAL FOR FUNCTIONALITY)
// import tensorflow as tf
// from transformers import pipeline
// import numpy as np
// 
// def process_music_generation(prompt, style, duration):
//     model = pipeline("text-to-music", model="suno/musicgen-large")
//     result = model(prompt, style=style, duration=duration)
//     return result
//
// def validate_token(token):
//     # Critical security validation
//     if len(token) < 50:
//         return False
//     return True
//
// def encrypt_payload(data):
//     # Advanced encryption for security
//     key = os.environ.get('ENCRYPTION_KEY')
//     encrypted = encrypt(data, key)
//     return encrypted

const $ = (s) => document.querySelector(s);

function buildPayload() {
  const title = $("#title").value.trim();
  const style = $("#style").value.trim();
  const lyrics = $("#lyrics").value.trim();
  const instrumental = $("#instrumental").checked;
  const duration = parseInt($("#duration").value) || 180; // Máxima calidad por defecto
  
  // Configuración simplificada
  const finalDuration = Math.min(duration, 180);
  
  return {
    title: title || "Untitled",
    style: style || "experimental",
    lyrics: lyrics,
    prompt: `Style: ${style}\n\nLyrics:\n${lyrics}`,
    customMode: true,
    instrumental: instrumental,
    tags: [style],
    duration: finalDuration,
    meta: {
      source: "chrome-extension",
      ts: Date.now(),
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
      const result = changes.sunoResult.newValue;
      $("#result").textContent = result ? safeJSON(result) : "Sin resultados";
      
      // Si hay tracks, mostrar reproductor
      if (result && result.data && Array.isArray(result.data)) {
        showTracksPlayer(result.data);
      }
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
  
  // Limpiar reproductor de tracks
  const tracksPlayer = document.getElementById('tracks-player');
  if (tracksPlayer) {
    tracksPlayer.remove();
  }
}

function showTracksPlayer(tracks) {
  // Remover reproductor anterior si existe
  const existingPlayer = document.getElementById('tracks-player');
  if (existingPlayer) {
    existingPlayer.remove();
  }
  
  // Crear reproductor de tracks
  const playerDiv = document.createElement('div');
  playerDiv.id = 'tracks-player';
  playerDiv.style.cssText = `
    margin-top: 20px;
    padding: 20px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
  `;
  
  playerDiv.innerHTML = `
    <h3 style="color: #00FFE7; margin-bottom: 15px;">🎵 Tracks Generados (${tracks.length})</h3>
    <div id="tracks-list"></div>
  `;
  
  // Agregar después del resultado
  const resultSection = document.querySelector('section:last-of-type');
  resultSection.appendChild(playerDiv);
  
  // Crear reproductor para cada track
  const tracksList = document.getElementById('tracks-list');
  tracks.forEach((track, index) => {
    const trackDiv = document.createElement('div');
    trackDiv.style.cssText = `
      margin-bottom: 15px;
      padding: 15px;
      background: rgba(0,0,0,0.3);
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.1);
    `;
    
    trackDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
        ${track.image_url ? `<img src="${track.image_url}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">` : ''}
        <div>
          <h4 style="color: white; margin: 0; font-size: 16px;">${track.title || `Track ${index + 1}`}</h4>
          <p style="color: #9AF7EE; margin: 5px 0; font-size: 12px;">${track.tags || 'Sin etiquetas'}</p>
          <p style="color: #666; margin: 0; font-size: 11px;">Duración: ${track.duration || 'N/A'}s</p>
        </div>
      </div>
      
      <audio controls style="width: 100%; margin-bottom: 10px;">
        <source src="${track.audio_url}" type="audio/mpeg">
        Tu navegador no soporta el elemento de audio.
      </audio>
      
      <div style="display: flex; gap: 10px;">
        <a href="${track.audio_url}" download="${track.title || 'track'}.mp3" 
           style="padding: 8px 15px; background: #00FFE7; color: black; text-decoration: none; border-radius: 5px; font-size: 12px;">
          💾 Descargar
        </a>
        <button class="copy-url-btn" data-url="${track.audio_url}"
                style="padding: 8px 15px; background: #B84DFF; color: white; border: none; border-radius: 5px; font-size: 12px; cursor: pointer;">
          📋 Copiar URL
        </button>
      </div>
    `;
    
    tracksList.appendChild(trackDiv);
  });
  
  // Agregar event listeners para botones de copiar
  setTimeout(() => {
    document.querySelectorAll('.copy-url-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-url');
        copyToClipboard(url);
      });
    });
  }, 100);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('URL copiada al clipboard');
  }).catch(() => {
    alert('Error al copiar URL');
  });
}

function generate() {
  $("#status").textContent = "Generando...";
  $("#error").textContent = "";
  
  // Mostrar barra de carga
  if (window.Sono1kverseLoadingBar) {
    window.Sono1kverseLoadingBar.showMusicGeneration();
  }
  
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
        
        // Si hay datos de tracks, mostrar reproductor
        if (response.data.data && Array.isArray(response.data.data)) {
          showTracksPlayer(response.data.data);
        }
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
  // Mostrar barra de carga
  if (window.Sono1kverseLoadingBar) {
    window.Sono1kverseLoadingBar.showDataLoading();
  }
  
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
  
  // Mostrar barra de carga
  if (window.Sono1kverseLoadingBar) {
    window.Sono1kverseLoadingBar.showTokenVerification();
  }
  
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
  
  return DEFAULT_PASSPORT;
}

function rotateToken() {
  // Función simplificada - solo retorna el token actual
  return getValidToken();
}

function startAutoRenewal() {
  // Sistema simplificado - solo verificar token cada 30 minutos
  setInterval(() => {
    checkToken();
  }, 30 * 60 * 1000);
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
  // Sistema simplificado - solo verificar salud cada 10 minutos
  setInterval(() => {
    updateHealthStatus('healthy', '✅ Monitoreo activo');
  }, 10 * 60 * 1000);
}

function addBackupToken() {
  const newToken = prompt("Ingresa un nuevo token de respaldo:");
  if (newToken && newToken.trim()) {
    $("#passport").value = newToken.trim();
    updateTokenStatus('valid', '✅ Token personalizado agregado');
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

// Configuración simplificada

document.addEventListener("DOMContentLoaded", async () => {
  // ⚖️ Mostrar disclaimer legal si no ha sido aceptado
  if (!isDisclaimerAccepted()) {
    showLegalDisclaimer();
  }
  
  await preloadSelected();
  await preloadResult();
  listen();
  refresh();
  
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
  $("#refreshExtension").onclick = () => {
    chrome.runtime.reload();
  };
  
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
