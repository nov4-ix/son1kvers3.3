// src/services/AdminService.ts
// 🔧 SERVICIO DE ADMINISTRACIÓN CON CONEXIÓN REMOTA

import { io, Socket } from 'socket.io-client';

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  modules: {
    theGenerator: 'online' | 'offline' | 'error';
    ghostStudio: 'online' | 'offline' | 'error';
    novaPostPilot: 'online' | 'offline' | 'error';
  };
  tokens: {
    valid: number;
    total: number;
    nearExpiration: number;
  };
  proxies: {
    active: number;
    total: number;
    countries: string[];
  };
  pixelKamikaze: {
    sacrifices: number;
    successRate: number;
    isActive: boolean;
  };
  issues: string[];
  recommendations: string[];
}

interface AdminCommand {
  type: 'token_test' | 'proxy_test' | 'api_test' | 'system_reset' | 'emergency_stop';
  payload?: any;
}

export class AdminService {
  private static instance: AdminService;
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  private constructor() {
    console.log('🔧 Inicializando AdminService...');
  }

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  // 🔌 CONECTAR AL SISTEMA REMOTO
  async connect(): Promise<void> {
    try {
      // Intentar conectar a diferentes endpoints
      const endpoints = [
        'https://the-generator-son1kvers3s-projects-c3cdfb54.vercel.app',
        'https://ghost-studio-c78zazi8g-son1kvers3s-projects-c3cdfb54.vercel.app',
        'http://localhost:3004', // Local development
        'http://localhost:3000'  // Fallback
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`🔌 Intentando conectar a: ${endpoint}`);
          
          this.socket = io(endpoint, {
            transports: ['websocket', 'polling'],
            timeout: 5000,
            auth: {
              adminKey: 'son1kvers3_admin_2024',
              device: this.getDeviceInfo()
            }
          });

          await this.setupSocketListeners();
          
          // Verificar conexión
          const connected = await this.waitForConnection();
          if (connected) {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            console.log(`✅ Conectado exitosamente a: ${endpoint}`);
            return;
          }
        } catch (error) {
          console.log(`❌ Falló conexión a ${endpoint}:`, error);
          this.socket?.disconnect();
        }
      }

      throw new Error('No se pudo conectar a ningún endpoint');
    } catch (error) {
      console.error('❌ Error conectando AdminService:', error);
      throw error;
    }
  }

  // 🔌 CONFIGURAR LISTENERS DEL SOCKET
  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('🔌 Socket conectado');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Socket desconectado');
      this.isConnected = false;
      this.handleReconnection();
    });

    this.socket.on('system_health_update', (health: SystemHealth) => {
      console.log('📊 Actualización de salud del sistema:', health);
    });

    this.socket.on('pixel_kamikaze_update', (data: any) => {
      console.log('🎯 Actualización Pixel Kamikaze:', data);
    });

    this.socket.on('admin_command_result', (result: any) => {
      console.log('🔧 Resultado de comando admin:', result);
    });

    this.socket.on('error', (error: any) => {
      console.error('❌ Error del socket:', error);
    });
  }

  // ⏳ ESPERAR CONEXIÓN
  private waitForConnection(timeout = 5000): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve(false);
        return;
      }

      const timer = setTimeout(() => {
        resolve(false);
      }, timeout);

      this.socket.once('connect', () => {
        clearTimeout(timer);
        resolve(true);
      });
    });
  }

  // 🔄 MANEJAR RECONEXIÓN
  private handleReconnection(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ Máximo de intentos de reconexión alcanzado');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`🔄 Reintentando conexión en ${delay}ms (intento ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch(() => {
        // Error ya manejado en connect()
      });
    }, delay);
  }

  // 📊 OBTENER SALUD DEL SISTEMA
  async getSystemHealth(): Promise<SystemHealth> {
    if (!this.isConnected || !this.socket) {
      // Modo offline - datos simulados
      return this.getOfflineSystemHealth();
    }

    try {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout obteniendo salud del sistema'));
        }, 5000);

        this.socket!.emit('get_system_health', (health: SystemHealth) => {
          clearTimeout(timeout);
          resolve(health);
        });
      });
    } catch (error) {
      console.error('❌ Error obteniendo salud del sistema:', error);
      return this.getOfflineSystemHealth();
    }
  }

  // 📊 SALUD DEL SISTEMA OFFLINE
  private getOfflineSystemHealth(): SystemHealth {
    return {
      status: 'warning',
      modules: {
        theGenerator: 'offline',
        ghostStudio: 'offline',
        novaPostPilot: 'offline'
      },
      tokens: {
        valid: 0,
        total: 0,
        nearExpiration: 0
      },
      proxies: {
        active: 0,
        total: 0,
        countries: []
      },
      pixelKamikaze: {
        sacrifices: 0,
        successRate: 0,
        isActive: false
      },
      issues: ['Sistema desconectado'],
      recommendations: ['Verificar conexión a internet', 'Reintentar conexión']
    };
  }

  // 🎯 EJECUTAR COMANDO ADMINISTRATIVO
  async executeCommand(command: AdminCommand): Promise<any> {
    if (!this.isConnected || !this.socket) {
      throw new Error('No conectado al sistema');
    }

    try {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout ejecutando comando'));
        }, 10000);

        this.socket!.emit('admin_command', command, (result: any) => {
          clearTimeout(timeout);
          resolve(result);
        });
      });
    } catch (error) {
      console.error('❌ Error ejecutando comando:', error);
      throw error;
    }
  }

  // 📱 OBTENER INFORMACIÓN DEL DISPOSITIVO
  private getDeviceInfo(): any {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isMac = /Mac/.test(navigator.userAgent);

    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      isMobile,
      isIOS,
      isMac,
      screen: {
        width: window.screen.width,
        height: window.screen.height
      },
      timestamp: new Date().toISOString()
    };
  }

  // 🔌 DESCONECTAR
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    console.log('🔌 AdminService desconectado');
  }

  // 📊 OBTENER ESTADO DE CONEXIÓN
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // 🔧 COMANDOS RÁPIDOS
  async testTokens(): Promise<any> {
    return this.executeCommand({ type: 'token_test' });
  }

  async testProxies(): Promise<any> {
    return this.executeCommand({ type: 'proxy_test' });
  }

  async testAPI(): Promise<any> {
    return this.executeCommand({ type: 'api_test' });
  }

  async emergencyStop(): Promise<any> {
    return this.executeCommand({ type: 'emergency_stop' });
  }

  async systemReset(): Promise<any> {
    return this.executeCommand({ type: 'system_reset' });
  }
}
