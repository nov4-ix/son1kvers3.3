// suno-extension/stealth-mode.js
class StealthMode {
  constructor() {
    this.isStealth = false; // Desactivado para desarrollo
    this.userAgentRotation = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ];
    this.requestDelay = 2000; // 2 segundos entre requests
    this.lastRequestTime = 0;
    this.requestCount = 0;
    this.maxRequestsPerHour = 10;
    
    this.initialize();
  }

  initialize() {
    // No mostrar logs - ser completamente invisible
    this.setupRequestThrottling();
    this.setupUserAgentRotation();
    this.setupRequestHeaders();
    this.setupRateLimiting();
    this.makeInvisible();
  }

  // Hacer la extensión completamente invisible
  makeInvisible() {
    // Ocultar todos los logs
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error
    };

    // Interceptar y silenciar logs
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};

    // Ocultar el ícono de la extensión
    if (chrome && chrome.action) {
      chrome.action.setIcon({
        path: {
          "16": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
          "48": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
          "128": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        }
      });
    }

    // Ocultar el título de la extensión
    if (chrome && chrome.action) {
      chrome.action.setTitle({ title: "" });
    }

    // Hacer que el context menu sea más discreto
    if (chrome && chrome.contextMenus) {
      chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
          id: "suno-generate",
          title: "Generar música",
          contexts: ["selection"]
        });
      });
    }
  }

  // Limitar velocidad de requests
  setupRequestThrottling() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      // Esperar si es necesario
      if (timeSinceLastRequest < this.requestDelay) {
        const waitTime = this.requestDelay - timeSinceLastRequest;
        console.log(`🥷 Sistema: Esperando ${waitTime}ms para evitar detección`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      this.lastRequestTime = Date.now();
      return originalFetch.apply(window, args);
    };
  }

  // Rotar User-Agent
  setupUserAgentRotation() {
    const randomUA = this.userAgentRotation[Math.floor(Math.random() * this.userAgentRotation.length)];
    
    // Interceptar requests y cambiar headers
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url, options = {}] = args;
      
      // Solo modificar requests a Suno
      if (typeof url === 'string' && url.includes('imgkits.com')) {
        options.headers = {
          ...options.headers,
          'User-Agent': randomUA,
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        };
      }
      
      return originalFetch(url, options);
    };
  }

  // Headers más naturales
  setupRequestHeaders() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url, options = {}] = args;
      
      if (typeof url === 'string' && url.includes('imgkits.com')) {
        // Hacer que parezca una request normal de navegador
        options.headers = {
          ...options.headers,
          'Origin': 'https://www.livepolls.app',
          'Referer': 'https://www.livepolls.app/',
          'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"macOS"'
        };
      }
      
      return originalFetch(url, options);
    };
  }

  // Limitar número de requests por hora
  setupRateLimiting() {
    setInterval(() => {
      this.requestCount = 0;
      console.log('🥷 Sistema: Contador de requests reiniciado');
    }, 3600000); // Cada hora

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url] = args;
      
      if (typeof url === 'string' && url.includes('imgkits.com')) {
        this.requestCount++;
        
        if (this.requestCount > this.maxRequestsPerHour) {
          console.warn('🥷 Sistema: Límite de requests alcanzado, esperando...');
          throw new Error('Rate limit exceeded - please wait');
        }
      }
      
      return originalFetch.apply(window, args);
    };
  }

  // Simular comportamiento humano
  simulateHumanBehavior() {
    // Agregar delays aleatorios
    const randomDelay = Math.random() * 3000 + 1000; // 1-4 segundos
    return new Promise(resolve => setTimeout(resolve, randomDelay));
  }

  // Ocultar logs de desarrollo
  hideDevelopmentLogs() {
    if (this.isStealth) {
      // Interceptar console.log para ocultar logs de desarrollo
      const originalLog = console.log;
      console.log = (...args) => {
        const message = args.join(' ');
        
        // No mostrar logs que puedan delatar el uso
        if (message.includes('Suno') || 
            message.includes('imgkits') || 
            message.includes('API') ||
            message.includes('Token')) {
          return; // No mostrar estos logs
        }
        
        originalLog.apply(console, args);
      };
    }
  }

  // Método para desactivar modo sigiloso
  disable() {
    this.isStealth = false;
    console.log('🥷 Sistema: Modo sigiloso desactivado');
  }

  // Método para activar modo sigiloso
  enable() {
    this.isStealth = true;
    console.log('🥷 Sistema: Modo sigiloso activado');
  }
}

// Inicializar modo sigiloso
const stealthMode = new StealthMode();

// Hacer disponible globalmente
window.StealthMode = stealthMode;

console.log('🥷 Sistema: Modo sigiloso inicializado - Comportamiento humano simulado');
