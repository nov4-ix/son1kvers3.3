// suno-extension/anti-piracy.js
class AntiPiracySystem {
  constructor() {
    this.isProtected = false; // Desactivado para desarrollo
    this.originalDomain = 'son1kverse.com';
    this.allowedDomains = [
      'son1kverse.com',
      'localhost',
      '127.0.0.1',
      'the-generator-vercel.vercel.app',
      'ghost-studio-vercel.vercel.app',
      'chrome-extension' // Permitir extensiones
    ];
    this.fingerprint = this.generateFingerprint();
    this.obfuscationLevel = 5;
    
    this.initialize();
  }

  initialize() {
    console.log('🔒 Sistema: Protecciones anti-piratería activadas');
    this.setupDomainCheck();
    this.setupCodeObfuscation();
    this.setupFingerprinting();
    this.setupTamperDetection();
    this.setupWatermarking();
  }

  // Verificar dominio permitido
  setupDomainCheck() {
    const currentDomain = window.location.hostname;
    const isAllowed = this.allowedDomains.some(domain => 
      currentDomain.includes(domain) || domain.includes(currentDomain)
    );

    // Permitir acceso desde chrome-extension:// (para desarrollo)
    const isChromeExtension = currentDomain === '' || currentDomain.includes('chrome-extension');
    
    if (!isAllowed && !isChromeExtension && this.isProtected) {
      this.triggerAntiPiracy();
    }
  }

  // Ofuscar código crítico
  setupCodeObfuscation() {
    // Ofuscar funciones críticas
    const criticalFunctions = ['generateMusic', 'checkToken', 'getValidToken'];
    
    criticalFunctions.forEach(funcName => {
      if (window[funcName]) {
        const originalFunc = window[funcName];
        window[funcName] = this.obfuscateFunction(originalFunc);
      }
    });
  }

  // Generar huella digital única
  generateFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Son1kVerse Anti-Piracy', 2, 2);
    
    const fingerprint = {
      canvas: canvas.toDataURL(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      timestamp: Date.now(),
      domain: window.location.hostname
    };
    
    return btoa(JSON.stringify(fingerprint));
  }

  // Detectar manipulación de código
  setupTamperDetection() {
    const originalConsole = console.log;
    const originalFetch = window.fetch;
    
    // Detectar si alguien intenta modificar console
    console.log = (...args) => {
      if (args.some(arg => typeof arg === 'string' && arg.includes('Son1kVerse'))) {
        this.detectTampering('Console manipulation detected');
      }
      originalConsole.apply(console, args);
    };

    // Detectar modificaciones de fetch
    window.fetch = (...args) => {
      const url = args[0];
      if (typeof url === 'string' && url.includes('suno') && !this.isValidRequest(url)) {
        this.detectTampering('Unauthorized API access');
      }
      return originalFetch.apply(window, args);
    };
  }

  // Marcar código con watermark
  setupWatermarking() {
    // Agregar watermark invisible al DOM
    const watermark = document.createElement('div');
    watermark.style.cssText = `
      position: fixed;
      bottom: -100px;
      right: -100px;
      opacity: 0;
      pointer-events: none;
      font-size: 1px;
      color: transparent;
    `;
    watermark.textContent = `Son1kVerse-${this.fingerprint}-Protected`;
    document.body.appendChild(watermark);

    // Watermark en localStorage
    try {
      localStorage.setItem('son1kverse_watermark', this.fingerprint);
    } catch (e) {
      // Ignorar si no se puede escribir
    }
  }

  // Ofuscar función
  obfuscateFunction(originalFunc) {
    return function(...args) {
      // Verificar integridad antes de ejecutar
      if (!this.verifyIntegrity()) {
        this.triggerAntiPiracy();
        return;
      }
      
      // Ejecutar función original con verificación
      try {
        return originalFunc.apply(this, args);
      } catch (error) {
        this.detectTampering('Function execution error');
        throw error;
      }
    }.bind(this);
  }

  // Verificar integridad del código
  verifyIntegrity() {
    // Verificar que las funciones críticas no hayan sido modificadas
    const criticalChecks = [
      () => typeof chrome !== 'undefined',
      () => typeof chrome.runtime !== 'undefined',
      () => document.querySelector('#son1kverse_watermark') !== null,
      () => localStorage.getItem('son1kverse_watermark') === this.fingerprint
    ];

    return criticalChecks.every(check => {
      try {
        return check();
      } catch (e) {
        return false;
      }
    });
  }

  // Detectar manipulación
  detectTampering(reason) {
    console.error('🚨 Sistema: Manipulación detectada -', reason);
    
    // Enviar alerta al servidor
    this.sendTamperAlert(reason);
    
    // Deshabilitar funcionalidades
    this.disableFunctionality();
    
    // Mostrar advertencia
    this.showTamperWarning();
  }

  // Enviar alerta de manipulación
  sendTamperAlert(reason) {
    try {
      fetch('https://pixel-kamikaze-dashboard.son1kverse.com/api/tamper-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Pixel-Source': 'anti-piracy'
        },
        body: JSON.stringify({
          timestamp: Date.now(),
          reason: reason,
          fingerprint: this.fingerprint,
          domain: window.location.hostname,
          userAgent: navigator.userAgent
        })
      }).catch(() => {
        // Ignorar si no se puede enviar
      });
    } catch (e) {
      // Ignorar errores
    }
  }

  // Deshabilitar funcionalidades
  disableFunctionality() {
    // Deshabilitar botones críticos
    const criticalButtons = document.querySelectorAll('#generate, #checkToken');
    criticalButtons.forEach(button => {
      button.disabled = true;
      button.style.opacity = '0.5';
      button.title = 'Funcionalidad deshabilitada por protección';
    });

    // Limpiar datos sensibles
    try {
      localStorage.removeItem('savedData');
      localStorage.removeItem('backupTokens');
    } catch (e) {
      // Ignorar errores
    }
  }

  // Mostrar advertencia de manipulación
  showTamperWarning() {
    const warning = document.createElement('div');
    warning.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.9);
      color: #ff6b6b;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      font-family: Arial, sans-serif;
      text-align: center;
    `;
    
    warning.innerHTML = `
      <div>
        <h1>🚨 ACCESO NO AUTORIZADO</h1>
        <p>Esta extensión está protegida por derechos de autor</p>
        <p>Son1kVerse AI Music Engine</p>
        <p>Uso no autorizado detectado</p>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: #ff6b6b;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 20px;
        ">Entendido</button>
      </div>
    `;
    
    document.body.appendChild(warning);
  }

  // Activar protección anti-piratería
  triggerAntiPiracy() {
    console.error('🚨 Sistema: Activando protecciones anti-piratería');
    
    // Deshabilitar toda la funcionalidad
    this.disableFunctionality();
    
    // Mostrar advertencia
    this.showTamperWarning();
    
    // Limpiar datos
    this.clearSensitiveData();
  }

  // Limpiar datos sensibles (solo los de la extensión)
  clearSensitiveData() {
    try {
      // Solo limpiar datos específicos de la extensión
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
        } catch (e) {
          // Ignorar errores individuales
        }
      });
      
      // NO limpiar sessionStorage completo - solo datos de la extensión
      const sessionKeys = [
        'son1kverse_session',
        'suno_session_data'
      ];
      
      sessionKeys.forEach(key => {
        try {
          sessionStorage.removeItem(key);
        } catch (e) {
          // Ignorar errores individuales
        }
      });
      
    } catch (e) {
      // Ignorar errores
    }
  }

  // Verificar si la solicitud es válida
  isValidRequest(url) {
    const validDomains = [
      'ai.imgkits.com',
      'usa.imgkits.com',
      'son1kverse.com',
      'pixel-kamikaze-dashboard.son1kverse.com'
    ];
    
    return validDomains.some(domain => url.includes(domain));
  }

  // Método para desactivar protecciones (solo desarrollo)
  disable() {
    if (confirm('¿Estás seguro de que quieres desactivar las protecciones anti-piratería?')) {
      this.isProtected = false;
      console.log('⚠️ Sistema: Protecciones anti-piratería desactivadas');
    }
  }

  // Método para activar protecciones
  enable() {
    this.isProtected = true;
    console.log('🔒 Sistema: Protecciones anti-piratería activadas');
  }
}

// Inicializar sistema anti-piratería
const antiPiracy = new AntiPiracySystem();

// Hacer disponible globalmente
window.AntiPiracy = antiPiracy;

console.log('🔒 Sistema: Protecciones anti-piratería inicializadas');
