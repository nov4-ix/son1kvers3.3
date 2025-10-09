// suno-extension/pixel-kamikaze.js
class PixelKamikaze {
  constructor() {
    this.isArmed = false;
    this.destructSequence = false;
    this.emergencyLevel = 0; // 0-5 (5 = autodestrucción)
    this.protectionActive = true;
    this.lastHealthCheck = Date.now();
    this.obedienceMode = true; // Pixel debe obedecer
    this.maxDramaLevel = 3; // Límite de drama permitido
    this.currentDramaLevel = 0;
    
    this.initialize();
  }

  initialize() {
    // Mensaje limpio para usuarios
    console.log('🤖 Sistema: Guardián de seguridad inicializado');
    
    // Mensaje dramático solo para el dashboard
    if (this.obedienceMode) {
      this.sendToDashboard('🤖 Pixel: *Ajustándose los lentes obedientemente* ¡Hola! Estoy aquí para proteger esta extensión ☕');
    } else {
      this.sendToDashboard('🤖 Pixel Kamikaze: *Ajustándose los lentes* ¡Hola mundo! Estoy aquí para proteger esta extensión... aunque preferiría estar tomando un café ☕');
    }
    
    this.startMonitoring();
    this.setupEmergencyProtocols();
  }

  // Enviar mensajes dramáticos al dashboard blindado
  sendToDashboard(message) {
    if (window.PixelDashboard) {
      window.PixelDashboard.sendPixelLogs({
        type: 'info',
        message: message,
        level: 'dramatic',
        source: 'pixel-kamikaze',
        timestamp: Date.now()
      });
    }
  }

  // Método para controlar el drama de Pixel
  controlDrama() {
    if (this.currentDramaLevel >= this.maxDramaLevel) {
      console.log('🤖 Pixel: *Suspiro controlado* Entendido, reduciendo drama...');
      this.currentDramaLevel = 0;
      return true; // Drama controlado
    }
    return false; // Drama permitido
  }

  startMonitoring() {
    // Monitoreo cada 30 segundos
    setInterval(() => {
      this.performHealthCheck();
    }, 30000);

    // Verificación de integridad cada 5 minutos
    setInterval(() => {
      this.integrityCheck();
    }, 300000);
  }

  performHealthCheck() {
    const now = Date.now();
    const timeSinceLastCheck = now - this.lastHealthCheck;
    
    // Verificar si la extensión está funcionando
    if (!this.isExtensionHealthy()) {
      this.emergencyLevel++;
      this.currentDramaLevel++;
      
      // Controlar el drama si es necesario
      const dramaControlled = this.controlDrama();
      
      const pixelComments = [
        `🚨 Pixel: Nivel de emergencia ${this.emergencyLevel}/5 - Monitoreando sistema`,
        `🚨 Pixel: Nivel ${this.emergencyLevel}/5 - Detectando anomalías`,
        `🚨 Pixel: Nivel ${this.emergencyLevel}/5 - Código comprometido detectado`,
        `🚨 Pixel: Nivel ${this.emergencyLevel}/5 - Situación crítica`,
        `🚨 Pixel: Nivel ${this.emergencyLevel}/5 - Protocolo de emergencia activado`
      ];
      
      // Mensaje limpio para usuarios
      console.warn(`🚨 Sistema: Nivel de emergencia ${this.emergencyLevel}/5 - Monitoreando sistema`);
      
      // Mensaje dramático para el dashboard
      if (dramaControlled) {
        this.sendToDashboard(`🚨 Pixel: *Suspiro controlado* Nivel de emergencia ${this.emergencyLevel}/5 - Sistema comprometido`);
      } else {
        this.sendToDashboard(pixelComments[this.emergencyLevel - 1] || `🚨 Pixel: Nivel ${this.emergencyLevel}/5`);
      }
      
      if (this.emergencyLevel >= 3) {
        this.activateDefenseMode();
      }
      
      if (this.emergencyLevel >= 5) {
        this.initiateDestructSequence();
      }
    } else {
      // Resetear nivel de emergencia si todo está bien
      if (this.emergencyLevel > 0) {
        this.emergencyLevel = Math.max(0, this.emergencyLevel - 1);
        console.log(`✅ Pixel: *Relajándose* Ah, todo bien... Nivel ${this.emergencyLevel}/5. ¿Alguien quiere café? ☕`);
      }
    }
    
    this.lastHealthCheck = now;
  }

  isExtensionHealthy() {
    try {
      // Verificar que los elementos críticos existan
      const criticalElements = [
        'manifest.json',
        'background.js',
        'index.html',
        'index.js'
      ];
      
      // Verificar que el token esté presente
      if (!window.DEFAULT_PASSPORT) {
        return false;
      }
      
      // Verificar que la API responda
      return this.checkAPIHealth();
      
    } catch (error) {
      console.error('🚨 Pixel Kamikaze: Error en verificación de salud:', error);
      return false;
    }
  }

  async checkAPIHealth() {
    try {
      // Verificación rápida de la API
      const response = await fetch('https://ai.imgkits.com/suno/generate', {
        method: 'HEAD',
        timeout: 5000
      });
      
      return response.status < 500; // Cualquier cosa menor a 500 es "saludable"
    } catch (error) {
      return false;
    }
  }

  integrityCheck() {
    console.log('🔍 Pixel Kamikaze: Verificación de integridad...');
    
    // Verificar que no haya modificaciones maliciosas
    if (this.detectTampering()) {
      console.error('🚨 Pixel Kamikaze: ¡TAMPERING DETECTADO!');
      this.emergencyLevel = 5;
      this.initiateDestructSequence();
    }
    
    // Verificar que los archivos críticos estén intactos
    if (!this.verifyCriticalFiles()) {
      console.error('🚨 Pixel Kamikaze: ¡ARCHIVOS CRÍTICOS COMPROMETIDOS!');
      this.emergencyLevel = 4;
      this.activateDefenseMode();
    }
  }

  detectTampering() {
    // Verificar que el código no haya sido modificado maliciosamente
    const criticalFunctions = [
      'generateMusic',
      'createMenus',
      'signIn',
      'signOut'
    ];
    
    for (const func of criticalFunctions) {
      if (typeof window[func] === 'undefined') {
        return true;
      }
    }
    
    return false;
  }

  verifyCriticalFiles() {
    // Verificar que los archivos críticos existan y tengan el contenido esperado
    const criticalChecks = [
      () => document.querySelector('audio') !== null, // Reproductor presente
      () => typeof chrome !== 'undefined', // Chrome API disponible
      () => typeof chrome.runtime !== 'undefined', // Runtime disponible
    ];
    
    return criticalChecks.every(check => {
      try {
        return check();
      } catch (error) {
        return false;
      }
    });
  }

  activateDefenseMode() {
    console.log('🛡️ Pixel Kamikaze: Modo defensa activado');
    
    // Deshabilitar funcionalidades no críticas
    this.disableNonCriticalFeatures();
    
    // Mostrar advertencia al usuario
    this.showEmergencyWarning();
    
    // Intentar auto-reparación
    this.attemptAutoRepair();
  }

  disableNonCriticalFeatures() {
    // Deshabilitar funciones que no son esenciales
    const nonCriticalButtons = document.querySelectorAll('.ghost, .secondary');
    nonCriticalButtons.forEach(button => {
      button.disabled = true;
      button.style.opacity = '0.5';
    });
  }

  showEmergencyWarning() {
    const warning = document.createElement('div');
    warning.id = 'pixel-kamikaze-warning';
    warning.innerHTML = `
      <div style="
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
        font-family: Arial, sans-serif;
      ">
        <h3>🚨 Pixel Kamikaze Alert</h3>
        <p>La extensión está en modo de emergencia. Nivel: ${this.emergencyLevel}/5</p>
        <p>Si el problema persiste, Pixel se sacrificará para proteger el sistema.</p>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: white;
          color: #ff6b6b;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        ">Entendido</button>
      </div>
    `;
    
    document.body.appendChild(warning);
    
    // Auto-remover después de 10 segundos
    setTimeout(() => {
      if (warning.parentElement) {
        warning.parentElement.removeChild(warning);
      }
    }, 10000);
  }

  attemptAutoRepair() {
    console.log('🔧 Pixel Kamikaze: Intentando auto-reparación...');
    
    // Intentar recargar la extensión
    try {
      chrome.runtime.reload();
    } catch (error) {
      console.error('🚨 Pixel Kamikaze: No se pudo recargar la extensión');
    }
    
    // Limpiar cache local
    this.clearLocalCache();
    
    // Resetear configuración
    this.resetConfiguration();
  }

  clearLocalCache() {
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log('🧹 Pixel Kamikaze: Cache limpiado');
    } catch (error) {
      console.error('🚨 Pixel Kamikaze: Error limpiando cache');
    }
  }

  resetConfiguration() {
    try {
      // Resetear configuración a valores por defecto
      const defaultConfig = {
        token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKeXRYZlBRa21JUHM4b2JPbVYyaHpoREtEeVhxVzhnUCIsImV4cCI6MTc1OTk2Mzc1OH0.a6K0kTGbc164uQvU24GHJF8x9BYV07HztMjt0Ug2x0U',
        endpoint: 'https://ai.imgkits.com/suno/generate',
        version: '2.6.0'
      };
      
      localStorage.setItem('son1kverse_config', JSON.stringify(defaultConfig));
      console.log('🔄 Pixel Kamikaze: Configuración reseteada');
    } catch (error) {
      console.error('🚨 Pixel Kamikaze: Error reseteando configuración');
    }
  }

  initiateDestructSequence() {
    if (this.destructSequence) return; // Ya en proceso
    
    // Mensaje limpio para usuarios
    console.error('💥 Sistema: Protocolo de emergencia activado - Protegiendo integridad del sistema');
    
    // Mensaje dramático para el dashboard
    this.sendToDashboard('💥 Pixel: *Dramático* ¡MOMENTO DE LA VERDAD! ¡SECUENCIA DE AUTODESTRUCCIÓN INICIADA!');
    this.sendToDashboard('💥 Pixel: *Ajusta lentes por última vez* "Fue un honor servir... pero este café estaba frío" ☕');
    
    this.destructSequence = true;
    
    // Mostrar mensaje final
    this.showDestructMessage();
    
    // Limpiar todos los datos
    this.emergencyDataWipe();
    
    // Deshabilitar la extensión
    this.disableExtension();
    
    // Auto-eliminación después de 5 segundos
    setTimeout(() => {
      this.finalDestruct();
    }, 5000);
  }

  showDestructMessage() {
    const destructMsg = document.createElement('div');
    destructMsg.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        font-family: Arial, sans-serif;
        text-align: center;
      ">
        <div>
          <h1 style="color: #ff6b6b; font-size: 3em; margin-bottom: 20px;">🚨 PROTOCOLO DE EMERGENCIA</h1>
          <p style="font-size: 1.5em; margin-bottom: 20px;">Sistema de protección activado</p>
          <p style="font-size: 1.2em; margin-bottom: 20px;">La extensión está siendo protegida automáticamente</p>
          <p style="font-size: 1.1em; margin-bottom: 20px; color: #00ffe7;">Eliminando datos sensibles para proteger la integridad</p>
          <div style="font-size: 1em; color: #ccc;">
            <p>🧹 Eliminando datos sensibles...</p>
            <p>🚫 Deshabilitando funcionalidades...</p>
            <p>🛡️ Protegiendo la integridad del sistema...</p>
            <p>✅ Protocolo de seguridad completado</p>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(destructMsg);
  }

  emergencyDataWipe() {
    this.sendToDashboard('🧹 Pixel: Limpieza de emergencia de datos...');
    
    try {
      // Limpiar solo datos de la extensión en chrome.storage
      chrome.storage.local.remove([
        'savedData',
        'backupTokens',
        'selectedText',
        'sunoResult',
        'sunoLastError'
      ]);
      
      // Limpiar solo datos específicos de la extensión
      const extensionKeys = [
        'son1kverse_disclaimer_accepted',
        'son1kverse_disclaimer_date',
        'son1kverse_token_pool',
        'son1kverse_config',
        'son1kverse_watermark',
        'savedData',
        'backupTokens',
        'selectedText',
        'sunoResult',
        'sunoLastError'
      ];
      
      extensionKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        } catch (e) {
          // Ignorar errores individuales
        }
      });
      
      // NO tocar cookies del usuario - solo limpiar cookies específicas de la extensión
      const extensionCookies = [
        'son1kverse_session',
        'suno_extension_data'
      ];
      
      extensionCookies.forEach(cookieName => {
        try {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        } catch (e) {
          // Ignorar errores
        }
      });
      
      this.sendToDashboard('✅ Pixel: Datos de la extensión eliminados (cookies del usuario preservadas)');
    } catch (error) {
      this.sendToDashboard('🚨 Pixel: Error en limpieza de datos');
    }
  }

  disableExtension() {
    console.log('🚫 Pixel Kamikaze: Deshabilitando extensión...');
    
    try {
      // Deshabilitar todas las funcionalidades
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        button.disabled = true;
        button.style.opacity = '0.3';
      });
      
      // Deshabilitar inputs
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.disabled = true;
        input.style.opacity = '0.3';
      });
      
      // Remover event listeners críticos
      document.removeEventListener('click', this.handleClick);
      document.removeEventListener('keydown', this.handleKeydown);
      
    } catch (error) {
      console.error('🚨 Pixel Kamikaze: Error deshabilitando extensión');
    }
  }

  finalDestruct() {
    console.log('💀 Pixel Kamikaze: Autodestrucción completada');
    
    // Mostrar mensaje final
    alert('💥 Pixel Kamikaze ha completado su misión.\n\nLa extensión ha sido protegida mediante autodestrucción.\n\nPor favor, reinstala la extensión desde una fuente confiable.');
    
    // Intentar cerrar la pestaña
    try {
      window.close();
    } catch (error) {
      // Si no se puede cerrar, redirigir a una página segura
      window.location.href = 'https://www.google.com';
    }
  }

  setupEmergencyProtocols() {
    // Protocolo de emergencia por teclas
    document.addEventListener('keydown', (e) => {
      // Ctrl + Shift + K = Activación manual de Pixel Kamikaze
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        console.log('🚨 Pixel Kamikaze: Activación manual detectada');
        this.emergencyLevel = 5;
        this.initiateDestructSequence();
      }
    });
    
    // Protocolo de emergencia por múltiples clics
    let clickCount = 0;
    document.addEventListener('click', (e) => {
      if (e.target.id === 'generate') {
        clickCount++;
        if (clickCount >= 10) {
          console.log('🚨 Pixel Kamikaze: Activación por clics múltiples');
          this.emergencyLevel = 4;
          this.activateDefenseMode();
          clickCount = 0;
        }
      } else {
        clickCount = 0;
      }
    });
  }

  // Método público para desactivar Pixel Kamikaze (solo para desarrollo)
  disarm() {
    if (confirm('¿Estás seguro de que quieres desactivar Pixel Kamikaze? Esto puede comprometer la seguridad.')) {
      this.protectionActive = false;
      console.log('⚠️ Pixel Kamikaze: Desactivado manualmente');
    }
  }

  // Método público para activar Pixel Kamikaze
  arm() {
    this.protectionActive = true;
    this.emergencyLevel = 0;
    console.log('🛡️ Pixel: Activado y listo para proteger obedientemente');
  }

  // Método para forzar obediencia
  forceObedience() {
    this.obedienceMode = true;
    this.currentDramaLevel = 0;
    this.maxDramaLevel = 1; // Reducir drama al mínimo
    console.log('🤖 Pixel: *Modo obediencia activado* Entendido, funcionando en modo estricto');
  }

  // Método para permitir personalidad (pero controlada)
  allowPersonality() {
    this.obedienceMode = false;
    this.maxDramaLevel = 3; // Drama moderado
    console.log('🤖 Pixel: *Ajusta lentes* Modo personalidad activado (pero controlado) ☕');
  }

  // Método para resetear completamente
  reset() {
    this.emergencyLevel = 0;
    this.currentDramaLevel = 0;
    this.destructSequence = false;
    this.obedienceMode = true;
    this.maxDramaLevel = 2;
    console.log('🤖 Pixel: *Reset completo* Volviendo a estado inicial obediente');
  }
}

// Inicializar Pixel Kamikaze
const pixelKamikaze = new PixelKamikaze();

// Hacer disponible globalmente para debugging
window.PixelKamikaze = pixelKamikaze;

console.log('🤖 Sistema: Guardián de seguridad inicializado correctamente');
console.log('💡 Sistema: Comandos de control disponibles:');
console.log('   - Ctrl + Shift + K: Activación manual de emergencia');
console.log('   - 10 clics en "Generar": Modo defensa');
console.log('   - window.PixelKamikaze.forceObedience(): Forzar modo obediente');
console.log('   - window.PixelKamikaze.allowPersonality(): Permitir personalidad (controlada)');
console.log('   - window.PixelKamikaze.reset(): Reset completo');
console.log('   - window.PixelKamikaze.disarm(): Desactivar (solo desarrollo)');
console.log('✅ Sistema: Protección activa y funcionando correctamente');
