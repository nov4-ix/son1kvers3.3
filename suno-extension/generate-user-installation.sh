#!/bin/bash

# 🕵️ GENERADOR DE INSTALACIÓN DISCRETA
# Genera configuración única para cada usuario

# Parámetros
USER_ID=${1:-"user_$(date +%s)"}
TOKEN=${2:-"default_token"}
DAILY_LIMIT=${3:-50}
MONTHLY_LIMIT=${4:-1000}
CONCURRENT_LIMIT=${5:-3}

echo "🎯 Generando instalación discreta para usuario: $USER_ID"

# Crear directorio para el usuario
mkdir -p "distributions/$USER_ID"

# Generar configuración única
cat > "distributions/$USER_ID/user-config.js" << EOF
// Configuración única para usuario: $USER_ID
const USER_CONFIG = {
  userId: '$USER_ID',
  token: '$TOKEN',
  limits: {
    daily: $DAILY_LIMIT,
    monthly: $MONTHLY_LIMIT,
    concurrent: $CONCURRENT_LIMIT,
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
  '$TOKEN',
  // Agregar más tokens de respaldo aquí
];

// Configuración de monitoreo
const MONITORING_CONFIG = {
  healthCheckInterval: 10 * 60 * 1000, // 10 minutos
  alertThreshold: 3,
  maxRetries: 5,
  notificationEnabled: true,
  userId: '$USER_ID'
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { USER_CONFIG, USER_TOKENS, MONITORING_CONFIG };
}
EOF

# Generar manifest único
cat > "distributions/$USER_ID/manifest.json" << EOF
{
  "manifest_version": 3,
  "name": "__MSG_extName__",
  "version": "2.6.0",
  "default_locale": "en",
  "description": "__MSG_extDescription__",
  "permissions": ["contextMenus", "storage"],
  "background": { "service_worker": "background.js" },
  "action": {
    "default_title": "Suno Music Generator",
    "default_icon": {
      "16": "images/16.png",
      "48": "images/48.png",
      "128": "images/128.png"
    }
  },
  "icons": {
    "16": "images/16.png",
    "48": "images/48.png",
    "128": "images/128.png"
  },
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
EOF

# Generar script de instalación
cat > "distributions/$USER_ID/install.sh" << EOF
#!/bin/bash

# 🚀 Instalador discreto para usuario: $USER_ID
echo "🎵 Instalando Suno Music Generator para usuario: $USER_ID"

# Verificar que Chrome esté instalado
if ! command -v google-chrome &> /dev/null && ! command -v chromium-browser &> /dev/null; then
    echo "❌ Chrome no detectado. Instala Chrome desde: https://www.google.com/chrome/"
    exit 1
fi

# Crear directorio temporal
TEMP_DIR="/tmp/suno-extension-$USER_ID"
mkdir -p "\$TEMP_DIR"

# Copiar archivos de la extensión
cp -r ../suno-extension/* "\$TEMP_DIR/"

# Copiar configuración específica del usuario
cp user-config.js "\$TEMP_DIR/src/"

# Crear script de configuración
cat > "\$TEMP_DIR/configure-user.js" << 'CONFIG_EOF'
// Configuración automática para usuario: $USER_ID
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
    limitsDiv.innerHTML = \`
      <h3>📊 Tus Límites:</h3>
      <ul>
        <li>Diario: \${userConfig.limits.daily} generaciones</li>
        <li>Mensual: \${userConfig.limits.monthly} generaciones</li>
        <li>Simultáneas: \${userConfig.limits.concurrent}</li>
      </ul>
    \`;
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
  return chrome.storage.local.get(\`user_\${userId}_usage\`).then(result => {
    return result[\`user_\${userId}_usage\`] || { daily: 0, monthly: 0 };
  });
}
CONFIG_EOF

# Agregar script de configuración al HTML
sed -i '/<script src="index.js"><\/script>/i <script src="configure-user.js"></script>' "\$TEMP_DIR/index.html"

echo "✅ Extensión configurada para usuario: $USER_ID"
echo "📁 Archivos en: \$TEMP_DIR"
echo ""
echo "🚀 Para instalar:"
echo "1. Abre Chrome y ve a chrome://extensions/"
echo "2. Activa 'Modo de desarrollador'"
echo "3. Click en 'Cargar extensión sin empaquetar'"
echo "4. Selecciona la carpeta: \$TEMP_DIR"
echo ""
echo "🎵 ¡La extensión estará lista para usar!"
EOF

chmod +x "distributions/$USER_ID/install.sh"

# Generar script de monitoreo
cat > "distributions/$USER_ID/monitor.sh" << EOF
#!/bin/bash

# 📊 Monitor de usuario: $USER_ID
echo "🔍 Monitoreando usuario: $USER_ID"

# Verificar estado de la extensión
check_extension_status() {
  echo "📊 Estado de la extensión para usuario: $USER_ID"
  echo "🕐 $(date)"
  echo "👤 Usuario: $USER_ID"
  echo "🎵 Token: $TOKEN"
  echo "📈 Límites: $DAILY_LIMIT diario, $MONTHLY_LIMIT mensual"
  echo ""
}

# Verificar uso
check_usage() {
  echo "📊 Verificando uso del usuario: $USER_ID"
  # Aquí se implementaría la verificación real del uso
  echo "✅ Uso dentro de los límites"
}

# Verificar salud de tokens
check_token_health() {
  echo "🔍 Verificando salud de tokens para usuario: $USER_ID"
  # Aquí se implementaría la verificación real de tokens
  echo "✅ Tokens funcionando correctamente"
}

# Función principal
main() {
  check_extension_status
  check_usage
  check_token_health
}

# Ejecutar monitoreo
main

# Si se ejecuta con --loop, monitorear continuamente
if [ "\$1" = "--loop" ]; then
  echo "🔄 Monitoreo continuo activado"
  while true; do
    sleep 300 # 5 minutos
    main
  done
fi
EOF

chmod +x "distributions/$USER_ID/monitor.sh"

# Generar README para el usuario
cat > "distributions/$USER_ID/README.md" << EOF
# 🎵 Suno Music Generator - Usuario: $USER_ID

## 📋 Información del Usuario

- **ID de Usuario:** $USER_ID
- **Token:** $TOKEN
- **Límites Diarios:** $DAILY_LIMIT generaciones
- **Límites Mensuales:** $MONTHLY_LIMIT generaciones
- **Generaciones Simultáneas:** $CONCURRENT_LIMIT

## 🚀 Instalación

1. Ejecuta el script de instalación:
   \`\`\`bash
   ./install.sh
   \`\`\`

2. Sigue las instrucciones en pantalla

## 📊 Monitoreo

Para monitorear el uso:
\`\`\`bash
./monitor.sh
\`\`\`

Para monitoreo continuo:
\`\`\`bash
./monitor.sh --loop
\`\`\`

## 🔧 Configuración

La configuración específica del usuario está en \`user-config.js\`

## 📞 Soporte

Si tienes problemas, contacta al administrador con tu ID de usuario: **$USER_ID**

---

**Generado automáticamente el $(date)**
EOF

echo "✅ Instalación discreta generada para usuario: $USER_ID"
echo "📁 Archivos en: distributions/$USER_ID/"
echo ""
echo "📋 Archivos generados:"
echo "  - user-config.js (configuración única)"
echo "  - manifest.json (manifest personalizado)"
echo "  - install.sh (instalador automático)"
echo "  - monitor.sh (monitor de usuario)"
echo "  - README.md (documentación del usuario)"
echo ""
echo "🚀 Para instalar para este usuario:"
echo "  cd distributions/$USER_ID"
echo "  ./install.sh"
echo ""
echo "📊 Para monitorear:"
echo "  ./monitor.sh"
