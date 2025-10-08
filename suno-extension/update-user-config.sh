#!/bin/bash

# 🔐 ACTUALIZAR CONFIGURACIÓN DE USUARIO CON PROTECCIONES
# Agrega protecciones de derechos de autor y candado de configuración

USER_ID="$1"
if [ -z "$USER_ID" ]; then
  echo "❌ Uso: $0 <user_id>"
  exit 1
fi

USER_DIR="distributions/$USER_ID"
if [ ! -d "$USER_DIR" ]; then
  echo "❌ Directorio de usuario no encontrado: $USER_DIR"
  exit 1
fi

echo "🔐 Actualizando configuración de usuario: $USER_ID"

# Crear configuración protegida
cat > "$USER_DIR/user-config-protected.js" << 'CONFIG_EOF'
// 🔐 CONFIGURACIÓN PROTEGIDA PARA USUARIO: $USER_ID
// Esta configuración está protegida contra manipulación

const USER_CONFIG = {
  userId: '$USER_ID',
  token: 'TKMTA0Mzk3MjU3NzgwNDE1NDc3NzQ1OmJjODM2ZDI0MGNiOWM3NWM2YzBjNzhlZmU5NzFkZjhl',
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
    backupTokens: true,
    configLocked: true // 🔒 Configuración bloqueada
  },
  branding: {
    name: 'Son1kVerse AI Music Engine', // 🎵 Nombre actualizado
    version: '2.6.0',
    custom: false,
    protected: true // 🔒 Marca como protegida
  },
  legal: {
    disclaimerAccepted: false,
    termsOfUse: 'Personal Use Only',
    copyrightNotice: 'User responsible for legal use',
    licenseType: 'Non-Commercial Personal Use'
  },
  protection: {
    encrypted: true,
    locked: true,
    integrityCheck: true,
    modificationDetected: false
  }
};

// 🔐 SISTEMA DE PROTECCIÓN
const CONFIG_PROTECTION = {
  locked: true,
  lockReason: 'Configuración protegida por derechos de autor',
  
  lock: function() {
    this.locked = true;
    console.log('🔒 Configuración bloqueada para protección');
  },
  
  unlock: function(adminKey) {
    if (adminKey === 'son1kverse_admin_2024') {
      this.locked = false;
      console.log('🔓 Configuración desbloqueada por administrador');
      return true;
    } else {
      console.log('❌ Clave de administrador incorrecta');
      return false;
    }
  },
  
  isLocked: function() {
    return this.locked;
  },
  
  validate: function(config) {
    // Verificar que no se haya modificado
    if (config._modified) {
      console.log('⚠️ Configuración modificada detectada');
      return false;
    }
    
    // Verificar campos requeridos
    const requiredFields = ['userId', 'token', 'limits', 'features'];
    for (const field of requiredFields) {
      if (!config[field]) {
        console.log('❌ Campo requerido faltante:', field);
        return false;
      }
    }
    
    return true;
  }
};

// ⚖️ DISCLAIMER LEGAL
const LEGAL_DISCLAIMER = {
  copyright: 'Las pistas generadas pueden estar sujetas a derechos de autor',
  usage: 'El usuario es responsable del uso legal de las pistas generadas',
  liability: 'Son1kVerse no se hace responsable del uso indebido',
  
  showDisclaimer: function() {
    const disclaimer = \`
      ⚖️ DISCLAIMER LEGAL - DERECHOS DE AUTOR
      
      Las pistas generadas por Son1kVerse AI Music Engine pueden estar 
      sujetas a derechos de autor. El usuario es completamente responsable 
      del uso legal de las pistas generadas.
      
      Son1kVerse no se hace responsable del uso indebido de las pistas 
      generadas por el sistema.
      
      Al usar este sistema, el usuario acepta estos términos.
    \`;
    
    return disclaimer;
  },
  
  acceptDisclaimer: function() {
    localStorage.setItem('son1kverse_disclaimer_accepted', 'true');
    localStorage.setItem('son1kverse_disclaimer_date', new Date().toISOString());
    console.log('✅ Disclaimer legal aceptado');
  },
  
  isDisclaimerAccepted: function() {
    return localStorage.getItem('son1kverse_disclaimer_accepted') === 'true';
  }
};

// 🔒 PROTEGER CONFIGURACIÓN
function protectConfig() {
  // Bloquear edición de configuración
  Object.freeze(USER_CONFIG);
  Object.freeze(USER_CONFIG.limits);
  Object.freeze(USER_CONFIG.features);
  Object.freeze(USER_CONFIG.branding);
  Object.freeze(USER_CONFIG.legal);
  Object.freeze(USER_CONFIG.protection);
  
  // Marcar como protegida
  USER_CONFIG._protected = true;
  USER_CONFIG._locked = true;
  USER_CONFIG._integrityCheck = 'son1kverse_protected_2024';
  
  console.log('🔒 Configuración protegida contra manipulación');
}

// Inicializar protección
protectConfig();

// Exportar configuración protegida
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    USER_CONFIG, 
    CONFIG_PROTECTION, 
    LEGAL_DISCLAIMER 
  };
}
CONFIG_EOF

echo "✅ Configuración protegida creada: $USER_DIR/user-config-protected.js"

# Crear script de protección
cat > "$USER_DIR/protect-config.sh" << 'PROTECT_EOF'
#!/bin/bash

# 🔐 SCRIPT DE PROTECCIÓN DE CONFIGURACIÓN
# Protege la configuración contra manipulación

echo "🔒 Protegiendo configuración de usuario: $USER_ID"

# Hacer archivos de solo lectura
chmod 444 user-config-protected.js
chmod 444 manifest.json

# Crear checksum para verificar integridad
md5sum user-config-protected.js > config.checksum
md5sum manifest.json >> config.checksum

echo "✅ Configuración protegida exitosamente"
echo "🔒 Archivos marcados como solo lectura"
echo "📊 Checksum creado para verificación de integridad"
PROTECT_EOF

chmod +x "$USER_DIR/protect-config.sh"

# Ejecutar protección
cd "$USER_DIR"
./protect-config.sh

echo "✅ Usuario $USER_ID actualizado con protecciones"
echo "🔒 Configuración bloqueada contra manipulación"
echo "⚖️ Disclaimer legal implementado"
echo "🎵 Nombre actualizado a 'Son1kVerse AI Music Engine'"
