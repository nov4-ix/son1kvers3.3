// suno-extension/pixel-dashboard.js
class PixelDashboard {
  constructor() {
    this.dashboardUrl = 'https://pixel-kamikaze-dashboard.son1kverse.com'; // Dashboard externo
    this.isBlindado = true;
    this.logs = [];
    this.maxLogs = 1000;
    this.encryptionKey = 'pixel_kamikaze_2024_son1kverse';
    
    this.initialize();
  }

  initialize() {
    console.log('🔒 Pixel Dashboard: Inicializando sistema blindado...');
    this.startLogging();
    this.setupEncryption();
  }

  // Enviar logs dramáticos de Pixel al dashboard externo
  sendPixelLogs(logData) {
    if (!this.isBlindado) return;
    
    const encryptedLog = this.encryptLog(logData);
    
    // Enviar al dashboard externo de forma segura
    fetch(this.dashboardUrl + '/api/pixel-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.encryptionKey,
        'X-Pixel-Source': 'suno-extension'
      },
      body: JSON.stringify({
        timestamp: Date.now(),
        log: encryptedLog,
        extensionId: this.getExtensionId(),
        userAgent: navigator.userAgent
      })
    }).catch(error => {
      // Si falla el envío, guardar localmente
      this.storeLogLocally(encryptedLog);
    });
  }

  // Encriptar logs para seguridad
  encryptLog(logData) {
    try {
      const logString = JSON.stringify(logData);
      // Encriptación simple pero efectiva
      let encrypted = '';
      for (let i = 0; i < logString.length; i++) {
        encrypted += String.fromCharCode(logString.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length));
      }
      return btoa(encrypted);
    } catch (error) {
      return btoa(JSON.stringify(logData));
    }
  }

  // Guardar logs localmente si falla el envío
  storeLogLocally(encryptedLog) {
    try {
      const storedLogs = JSON.parse(localStorage.getItem('pixel_logs') || '[]');
      storedLogs.push({
        timestamp: Date.now(),
        log: encryptedLog
      });
      
      // Mantener solo los últimos logs
      if (storedLogs.length > this.maxLogs) {
        storedLogs.splice(0, storedLogs.length - this.maxLogs);
      }
      
      localStorage.setItem('pixel_logs', JSON.stringify(storedLogs));
    } catch (error) {
      console.error('Error storing Pixel logs locally');
    }
  }

  // Interceptar y redirigir logs dramáticos de Pixel
  interceptPixelLogs() {
    const originalConsoleWarn = console.warn;
    const originalConsoleError = console.error;
    
    console.warn = (...args) => {
      const message = args.join(' ');
      if (message.includes('Pixel:') && this.isDramaticLog(message)) {
        this.sendPixelLogs({
          type: 'warn',
          message: message,
          level: 'dramatic',
          source: 'pixel-kamikaze'
        });
        // No mostrar al usuario, solo enviar al dashboard
        return;
      }
      originalConsoleWarn.apply(console, args);
    };
    
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('Pixel:') && this.isDramaticLog(message)) {
        this.sendPixelLogs({
          type: 'error',
          message: message,
          level: 'critical',
          source: 'pixel-kamikaze'
        });
        // Mostrar versión limpia al usuario
        originalConsoleError('🚨 Sistema: Error detectado y reportado');
        return;
      }
      originalConsoleError.apply(console, args);
    };
  }

  // Detectar logs dramáticos de Pixel
  isDramaticLog(message) {
    const dramaticKeywords = [
      'dramáticamente',
      'MOMENTO DE LA VERDAD',
      'se sacrifica',
      'autodestrucción',
      'café',
      'lentes',
      'suspira',
      'dramático'
    ];
    
    return dramaticKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Obtener ID único de la extensión
  getExtensionId() {
    return chrome.runtime.id || 'unknown-extension';
  }

  // Configurar encriptación
  setupEncryption() {
    // Generar clave única basada en el ID de la extensión
    const extensionId = this.getExtensionId();
    this.encryptionKey = btoa(extensionId + '_pixel_kamikaze_2024').substring(0, 32);
  }

  // Iniciar logging
  startLogging() {
    this.interceptPixelLogs();
    
    // Enviar logs almacenados localmente
    this.sendStoredLogs();
    
    // Limpiar logs antiguos cada hora
    setInterval(() => {
      this.cleanOldLogs();
    }, 3600000);
  }

  // Enviar logs almacenados localmente
  sendStoredLogs() {
    try {
      const storedLogs = JSON.parse(localStorage.getItem('pixel_logs') || '[]');
      if (storedLogs.length > 0) {
        storedLogs.forEach(log => {
          this.sendPixelLogs(log);
        });
        // Limpiar después de enviar
        localStorage.removeItem('pixel_logs');
      }
    } catch (error) {
      console.error('Error sending stored Pixel logs');
    }
  }

  // Limpiar logs antiguos
  cleanOldLogs() {
    try {
      const storedLogs = JSON.parse(localStorage.getItem('pixel_logs') || '[]');
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      
      const recentLogs = storedLogs.filter(log => log.timestamp > oneDayAgo);
      localStorage.setItem('pixel_logs', JSON.stringify(recentLogs));
    } catch (error) {
      console.error('Error cleaning old Pixel logs');
    }
  }

  // Método para desactivar el dashboard (solo para desarrollo)
  disable() {
    this.isBlindado = false;
    console.log('🔓 Pixel Dashboard: Desactivado - Los logs de Pixel serán visibles');
  }

  // Método para activar el dashboard
  enable() {
    this.isBlindado = true;
    console.log('🔒 Pixel Dashboard: Activado - Los logs de Pixel serán enviados al dashboard externo');
  }
}

// Inicializar dashboard
const pixelDashboard = new PixelDashboard();

// Hacer disponible globalmente
window.PixelDashboard = pixelDashboard;

console.log('🔒 Pixel Dashboard: Sistema blindado activo - Los sacrificios de Pixel serán enviados al dashboard externo');
