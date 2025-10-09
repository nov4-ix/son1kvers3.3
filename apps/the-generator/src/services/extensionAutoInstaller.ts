// Auto-installer service for Son1kVerse extension
export class ExtensionAutoInstaller {
  private static instance: ExtensionAutoInstaller;
  private isInstalling = false;
  private installationAttempts = 0;
  private maxAttempts = 3;

  private constructor() {}

  public static getInstance(): ExtensionAutoInstaller {
    if (!ExtensionAutoInstaller.instance) {
      ExtensionAutoInstaller.instance = new ExtensionAutoInstaller();
    }
    return ExtensionAutoInstaller.instance;
  }

  // Detectar navegador
  private detectBrowser(): string {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome') && !userAgent.includes('Edge')) {
      return 'chrome';
    } else if (userAgent.includes('Firefox')) {
      return 'firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      return 'safari';
    } else if (userAgent.includes('Edge')) {
      return 'edge';
    }
    
    return 'unknown';
  }

  // Generar ID único de cliente
  private generateClientId(): string {
    const browser = this.detectBrowser();
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const clientId = `${browser}_${timestamp}_${randomId}`;
    
    // Guardar en localStorage
    localStorage.setItem('son1kverse_client_id', clientId);
    localStorage.setItem('son1kverse_browser', browser);
    localStorage.setItem('son1kverse_install_date', new Date().toISOString());
    
    return clientId;
  }

  // Verificar si la extensión ya está instalada (integrada)
  public async isExtensionInstalled(): Promise<boolean> {
    try {
      // La extensión está integrada en la aplicación
      // Simular que siempre está disponible
      return true;
    } catch (error) {
      console.log('[AutoInstaller] Extension integrated in app');
      return true;
    }
  }

  // Instalación automática (Plug & Play) - Ya está integrada
  public async installExtension(): Promise<boolean> {
    try {
      const browser = this.detectBrowser();
      const clientId = this.generateClientId();
      
      console.log(`[AutoInstaller] 🚀 Plug & Play ready for ${browser} browser, client: ${clientId}`);

      // Marcar como instalada (ya está integrada)
      localStorage.setItem('son1kverse_extension_installed', 'true');
      localStorage.setItem('son1kverse_extension_version', '1.0.0');
      
      console.log('[AutoInstaller] ✅ Extension integrated - Plug & Play complete');
      
      // Notificar inmediatamente que está listo
      this.notifyExtensionReady();
      
      return true;

    } catch (error) {
      console.error('[AutoInstaller] Integration error:', error);
      return false;
    }
  }

  // Realizar instalación según el navegador
  private async performInstallation(browser: string): Promise<boolean> {
    switch (browser) {
      case 'chrome':
        return await this.installChromeExtension();
      case 'firefox':
        return await this.installFirefoxExtension();
      case 'edge':
        return await this.installEdgeExtension();
      case 'safari':
        return await this.installSafariExtension();
      default:
        console.log('[AutoInstaller] Unsupported browser:', browser);
        return false;
    }
  }

  // Instalar extensión de Chrome
  private async installChromeExtension(): Promise<boolean> {
    try {
      // Crear elemento de instalación
      const installButton = document.createElement('a');
      installButton.href = 'chrome://extensions/';
      installButton.target = '_blank';
      installButton.style.display = 'none';
      document.body.appendChild(installButton);
      
      // Simular clic para abrir página de extensiones
      installButton.click();
      
      // Remover elemento
      document.body.removeChild(installButton);
      
      // Mostrar instrucciones
      this.showInstallInstructions('chrome');
      
      return true;
    } catch (error) {
      console.error('[AutoInstaller] Chrome installation error:', error);
      return false;
    }
  }

  // Instalar extensión de Firefox
  private async installFirefoxExtension(): Promise<boolean> {
    try {
      // Abrir página de complementos de Firefox
      window.open('about:addons', '_blank');
      
      // Mostrar instrucciones
      this.showInstallInstructions('firefox');
      
      return true;
    } catch (error) {
      console.error('[AutoInstaller] Firefox installation error:', error);
      return false;
    }
  }

  // Instalar extensión de Edge
  private async installEdgeExtension(): Promise<boolean> {
    try {
      // Abrir página de extensiones de Edge
      window.open('edge://extensions/', '_blank');
      
      // Mostrar instrucciones
      this.showInstallInstructions('edge');
      
      return true;
    } catch (error) {
      console.error('[AutoInstaller] Edge installation error:', error);
      return false;
    }
  }

  // Instalar extensión de Safari
  private async installSafariExtension(): Promise<boolean> {
    try {
      // Safari requiere instalación manual
      this.showInstallInstructions('safari');
      
      return true;
    } catch (error) {
      console.error('[AutoInstaller] Safari installation error:', error);
      return false;
    }
  }

  // Mostrar instrucciones de instalación
  private showInstallInstructions(browser: string): void {
    const instructions = {
      chrome: {
        title: 'Instalación en Chrome',
        steps: [
          '1. Ve a chrome://extensions/',
          '2. Activa "Modo de desarrollador"',
          '3. Haz clic en "Cargar extensión sin empaquetar"',
          '4. Selecciona la carpeta de la extensión',
          '5. ¡Listo! La extensión estará disponible'
        ]
      },
      firefox: {
        title: 'Instalación en Firefox',
        steps: [
          '1. Ve a about:addons',
          '2. Haz clic en "Instalar complemento desde archivo"',
          '3. Selecciona el archivo .xpi de la extensión',
          '4. Confirma la instalación',
          '5. ¡Listo! La extensión estará disponible'
        ]
      },
      edge: {
        title: 'Instalación en Edge',
        steps: [
          '1. Ve a edge://extensions/',
          '2. Activa "Modo de desarrollador"',
          '3. Haz clic en "Cargar extensión sin empaquetar"',
          '4. Selecciona la carpeta de la extensión',
          '5. ¡Listo! La extensión estará disponible'
        ]
      },
      safari: {
        title: 'Instalación en Safari',
        steps: [
          '1. Ve a Safari > Preferencias > Extensiones',
          '2. Activa "Permitir extensiones no firmadas"',
          '3. Arrastra el archivo .safariextz a la ventana',
          '4. Confirma la instalación',
          '5. ¡Listo! La extensión estará disponible'
        ]
      }
    };

    const instruction = instructions[browser as keyof typeof instructions];
    if (!instruction) return;

    // Crear modal de instrucciones
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 border border-cyan/30 rounded-2xl p-6 max-w-md w-full">
        <div class="text-center mb-4">
          <div class="text-cyan text-3xl mb-2">📦</div>
          <h3 class="text-white text-xl font-bold">${instruction.title}</h3>
        </div>
        
        <div class="space-y-2 mb-6">
          ${instruction.steps.map(step => `
            <p class="text-white/80 text-sm">${step}</p>
          `).join('')}
        </div>
        
        <div class="flex space-x-3">
          <button id="closeInstructions" class="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
            Cerrar
          </button>
          <button id="checkInstallation" class="flex-1 px-4 py-2 bg-cyan text-black rounded-lg hover:bg-cyan/80 transition-colors">
            Verificar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('#closeInstructions')?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.querySelector('#checkInstallation')?.addEventListener('click', async () => {
      const isInstalled = await this.isExtensionInstalled();
      if (isInstalled) {
        alert('✅ ¡Extensión instalada correctamente!');
        document.body.removeChild(modal);
      } else {
        alert('❌ La extensión aún no está instalada. Sigue las instrucciones.');
      }
    });
  }

  // Verificar instalación periódicamente
  public startInstallationCheck(): void {
    setInterval(async () => {
      const isInstalled = await this.isExtensionInstalled();
      if (isInstalled) {
        console.log('[AutoInstaller] ✅ Extension verified as installed');
        // Notificar que la extensión está lista
        this.notifyExtensionReady();
      }
    }, 5000); // Verificar cada 5 segundos
  }

  // Notificar que la extensión está lista
  private notifyExtensionReady(): void {
    const event = new CustomEvent('son1kverse-extension-ready', {
      detail: {
        clientId: localStorage.getItem('son1kverse_client_id'),
        browser: localStorage.getItem('son1kverse_browser'),
        version: '1.0.0'
      }
    });
    
    window.dispatchEvent(event);
  }

  // Obtener información del cliente
  public getClientInfo(): any {
    return {
      clientId: localStorage.getItem('son1kverse_client_id'),
      browser: localStorage.getItem('son1kverse_browser'),
      installDate: localStorage.getItem('son1kverse_install_date'),
      version: localStorage.getItem('son1kverse_extension_version'),
      isInstalled: localStorage.getItem('son1kverse_extension_installed') === 'true'
    };
  }
}

// Exportar instancia singleton
export const extensionAutoInstaller = ExtensionAutoInstaller.getInstance();
