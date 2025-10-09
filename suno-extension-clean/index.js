// Clean JavaScript - Son1kVerse AI Music Engine
const DEFAULT_PASSPORT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKeXRYZlBRa21JUHM4b2JPbVYyaHpoREtEeVhxVzhnUCIsImV4cCI6MTc1OTk2Mzc1OH0.a6K0kTGbc164uQvU24GHJF8x9BYV07HztMjt0Ug2x0U';

const $ = (s) => document.querySelector(s);

// Build payload for API
function buildPayload() {
  const title = $("#title").value.trim();
  const style = $("#style").value.trim();
  const lyrics = $("#lyrics").value.trim();
  const instrumental = $("#instrumental").checked;
  const duration = parseInt($("#duration").value) || 180;

  return {
    title: title || "Untitled",
    style: style || "experimental",
    lyrics: lyrics,
    prompt: `Style: ${style}\n\nLyrics:\n${lyrics}`,
    customMode: true,
    instrumental: instrumental,
    tags: [style],
    duration: duration,
    meta: {
      source: "chrome-extension",
      ts: Date.now(),
      max_quality: true
    }
  };
}

// Safe JSON stringify
function safeJSON(x) {
  try {
    return JSON.stringify(x, null, 2);
  } catch {
    return String(x);
  }
}

// Preload selected text
async function preloadSelected() {
  const { selectedText } = await chrome.storage.local.get("selectedText");
  if (selectedText) {
    $("#lyrics").value = selectedText;
  }
}

// Preload previous result
async function preloadResult() {
  const { sunoResult, sunoLastError } = await chrome.storage.local.get(["sunoResult", "sunLastError"]);
  if (sunoResult) {
    $("#result").textContent = safeJSON(sunoResult);
    if (sunoResult.data && Array.isArray(sunoResult.data)) {
      showTracksPlayer(sunoResult.data);
    }
  }
  if (sunoLastError) {
    $("#error").textContent = sunoLastError;
  }
}

// Listen for storage changes
function listen() {
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.sunoResult) {
      const result = changes.sunoResult.newValue;
      $("#result").textContent = result ? safeJSON(result) : "Sin resultados";

      if (result && result.data && Array.isArray(result.data)) {
        showTracksPlayer(result.data);
      }
    }
    if (changes.sunoLastError) {
      $("#error").textContent = changes.sunoLastError.newValue || "";
    }
  });
}

// Refresh payload
function refresh() {
  $("#payload").value = safeJSON(buildPayload());
}

// Clear results
function clear() {
  $("#result").textContent = "Sin resultados";
  $("#error").textContent = "";
  chrome.storage.local.remove(["sunoResult", "sunLastError"]);
  clearPlayer();
}

// Clear player
function clearPlayer() {
  const player = $("#musicPlayer");
  player.innerHTML = `
    <div class="player-placeholder">
      <div class="player-icon">🎵</div>
      <p>El reproductor está listo. Genera música para comenzar.</p>
    </div>
  `;
}

// Show tracks player
function showTracksPlayer(tracks) {
  const player = $("#musicPlayer");
  
  if (!tracks || tracks.length === 0) {
    clearPlayer();
    return;
  }

  let html = `<div class="tracks-container">`;
  
  tracks.forEach((track, index) => {
    html += `
      <div class="track-item">
        <div class="track-header">
          ${track.image_url ? `<img src="${track.image_url}" class="track-image" alt="Track ${index + 1}">` : ''}
          <div class="track-info">
            <h4>${track.title || `Track ${index + 1}`}</h4>
            <p>${track.tags || 'Sin etiquetas'}</p>
            <p class="track-duration">Duración: ${track.duration || 'N/A'}s</p>
          </div>
        </div>
        
        <audio controls style="width: 100%; margin-bottom: 10px;">
          <source src="${track.audio_url}" type="audio/mpeg">
          Tu navegador no soporta el elemento de audio.
        </audio>
        
        <div class="track-actions">
          <a href="${track.audio_url}" download="${track.title || 'track'}.mp3" class="download-btn">
            💾 Descargar
          </a>
          <button class="copy-btn" data-url="${track.audio_url}">
            📋 Copiar URL
          </button>
        </div>
      </div>
    `;
  });
  
  html += `</div>`;
  player.innerHTML = html;

  // Add event listeners for copy buttons
  setTimeout(() => {
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-url');
        copyToClipboard(url);
      });
    });
  }, 100);
}

// Copy to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('URL copiada al clipboard');
  }).catch(() => {
    showNotification('Error al copiar URL');
  });
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #00FFE7;
    color: #000;
    padding: 15px;
    border-radius: 8px;
    z-index: 10000;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 255, 231, 0.3);
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// Generate music
function generate() {
  $("#status").textContent = "Generando...";
  $("#error").textContent = "";

  // Validate required fields
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
      if (response.data) {
        $("#result").textContent = safeJSON(response.data);
        if (response.data.data && Array.isArray(response.data.data)) {
          showTracksPlayer(response.data.data);
        }
      }
    }
  });
}

// Save data
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

// Load data
function loadData() {
  chrome.storage.local.get(["savedData"], (result) => {
    if (result.savedData) {
      const data = result.savedData;
      $("#title").value = data.title || "";
      $("#style").value = data.style || "";
      $("#duration").value = data.duration || "180";
      $("#lyrics").value = data.lyrics || "";
      $("#instrumental").checked = data.instrumental || false;
      $("#passport").value = data.passport || "";

      $("#status").textContent = "📁 Datos cargados";
      setTimeout(() => {
        $("#status").textContent = "";
      }, 2000);

      refresh();
    } else {
      $("#status").textContent = "❌ No hay datos guardados";
      setTimeout(() => {
        $("#status").textContent = "";
      }, 2000);
    }
  });
}

// Check token
function checkToken() {
  const passport = getValidToken();
  updateTokenStatus('checking', '🔍 Verificando token...');

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

// Get valid token
function getValidToken() {
  const passport = $("#passport").value.trim();
  if (passport) {
    return passport;
  }
  return DEFAULT_PASSPORT;
}

// Add backup token
function addBackupToken() {
  const newToken = prompt("Ingresa un nuevo token de respaldo:");
  if (newToken && newToken.trim()) {
    $("#passport").value = newToken.trim();
    updateTokenStatus('valid', '✅ Token personalizado agregado');
  }
}

// Update token status
function updateTokenStatus(status, message) {
  const statusDiv = $("#tokenStatus");
  const indicator = $("#tokenIndicator");
  const messageSpan = $("#tokenMessage");

  statusDiv.className = "token-status";

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

// Legal disclaimer functions
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

// Initialize app
document.addEventListener("DOMContentLoaded", async () => {
  // Show disclaimer if not accepted
  if (!isDisclaimerAccepted()) {
    showLegalDisclaimer();
  }

  await preloadSelected();
  await preloadResult();
  listen();
  refresh();

  // Check token automatically
  setTimeout(() => {
    checkToken();
  }, 1000);

  // Event listeners
  $("#refreshPayload").onclick = refresh;
  $("#clearResult").onclick = clear;
  $("#clearPlayer").onclick = clearPlayer;
  $("#generate").onclick = generate;
  $("#saveData").onclick = saveData;
  $("#loadData").onclick = loadData;
  $("#checkToken").onclick = checkToken;
  $("#addBackupToken").onclick = addBackupToken;

  // Legal disclaimer handlers
  $("#acceptDisclaimer").onclick = acceptDisclaimer;
  $("#rejectDisclaimer").onclick = rejectDisclaimer;
});
