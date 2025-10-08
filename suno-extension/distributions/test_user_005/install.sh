#!/bin/bash

# 🚀 Instalador discreto para usuario: test_user_005
echo "🎵 Instalando Suno Music Generator para usuario: test_user_005"

# Verificar que Chrome esté instalado
if ! command -v google-chrome &> /dev/null && ! command -v chromium-browser &> /dev/null; then
    echo "❌ Chrome no detectado. Instala Chrome desde: https://www.google.com/chrome/"
    exit 1
fi

# Crear directorio temporal
TEMP_DIR="/tmp/suno-extension-test_user_005"
mkdir -p "$TEMP_DIR"

# Copiar archivos de la extensión
cp -r ../suno-extension/* "$TEMP_DIR/"

# Copiar configuración específica del usuario
cp user-config.js "$TEMP_DIR/src/"

# Crear script de configuración
cat > "$TEMP_DIR/configure-user.js" << 'CONFIG_EOF'
// Configuración automática para usuario: test_user_005
document.addEventListener('DOMContentLoaded', () => {
  // Cargar configuración del usuario
  const userConfig = USER_CONFIG;
  
  // Configurar tokens
  if (userConfig.token) {
    const passportField = document.getElementById('passport');
    if (passportField) {
      passportField.value = userConfig.token;
    }
  }
  
  // Configurar límites
  if (userConfig.limits) {
    // Mostrar límites al usuario
    const limitsDiv = document.createElement('div');
    limitsDiv.className = 'user-limits';
    limitsDiv.innerHTML = `
      <h3>📊 Tus Límites:</h3>
      <ul>
        <li>Diario: ${userConfig.limits.daily} generaciones</li>
        <li>Mensual: ${userConfig.limits.monthly} generaciones</li>
        <li>Simultáneas: ${userConfig.limits.concurrent}</li>
      </ul>
    `;
    document.body.appendChild(limitsDiv);
  }
  
  // Configurar monitoreo
  if (userConfig.features.monitoring) {
    startUserMonitoring(userConfig.userId);
  }
});

function startUserMonitoring(userId) {
  // Monitoreo específico para este usuario
  setInterval(() => {
    checkUserLimits(userId);
  }, 60000); // Cada minuto
}

function checkUserLimits(userId) {
  // Verificar límites del usuario
  const usage = getUserUsage(userId);
  const limits = USER_CONFIG.limits;
  
  if (usage.daily >= limits.daily) {
    showNotification('Has alcanzado tu límite diario');
  }
}

function getUserUsage(userId) {
  // Obtener uso del usuario desde storage
  return chrome.storage.local.get(`user_${userId}_usage`).then(result => {
    return result[`user_${userId}_usage`] || { daily: 0, monthly: 0 };
  });
}
CONFIG_EOF

# Agregar script de configuración al HTML
sed -i '/<script src="index.js"><\/script>/i <script src="configure-user.js"></script>' "$TEMP_DIR/index.html"

echo "✅ Extensión configurada para usuario: test_user_005"
echo "📁 Archivos en: $TEMP_DIR"
echo ""
echo "🚀 Para instalar:"
echo "1. Abre Chrome y ve a chrome://extensions/"
echo "2. Activa 'Modo de desarrollador'"
echo "3. Click en 'Cargar extensión sin empaquetar'"
echo "4. Selecciona la carpeta: $TEMP_DIR"
echo ""
echo "🎵 ¡La extensión estará lista para usar!"
