// src/store/useAdminStore.ts
import { create } from 'zustand';

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

interface AdminLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  source: string;
  data?: any;
}

interface AdminState {
  // System Health
  systemHealth: SystemHealth;
  isConnected: boolean;
  lastUpdate: string;
  
  // Logs
  logs: AdminLog[];
  
  // UI State
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  notifications: boolean;
  
  // Actions
  updateSystemHealth: (health: SystemHealth) => void;
  setConnectionStatus: (connected: boolean) => void;
  addLog: (log: Omit<AdminLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleNotifications: () => void;
}

const initialSystemHealth: SystemHealth = {
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
  issues: ['Sistema inicializando...'],
  recommendations: ['Conectando al sistema...']
};

export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial state
  systemHealth: initialSystemHealth,
  isConnected: false,
  lastUpdate: new Date().toISOString(),
  
  logs: [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Panel administrativo iniciado',
      source: 'AdminPanel'
    }
  ],
  
  sidebarOpen: true,
  theme: 'dark',
  notifications: true,
  
  // Actions
  updateSystemHealth: (health) => {
    set({
      systemHealth: health,
      lastUpdate: new Date().toISOString()
    });
    
    // Agregar log de actualización
    get().addLog({
      level: 'info',
      message: 'Salud del sistema actualizada',
      source: 'SystemHealth',
      data: { status: health.status }
    });
  },
  
  setConnectionStatus: (connected) => {
    set({ isConnected: connected });
    
    get().addLog({
      level: connected ? 'success' : 'error',
      message: connected ? 'Conectado al sistema' : 'Desconectado del sistema',
      source: 'Connection'
    });
  },
  
  addLog: (log) => {
    const newLog: AdminLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    set((state) => ({
      logs: [...state.logs.slice(-99), newLog] // Mantener solo los últimos 100 logs
    }));
  },
  
  clearLogs: () => {
    set({ logs: [] });
    
    get().addLog({
      level: 'info',
      message: 'Logs limpiados',
      source: 'AdminPanel'
    });
  },
  
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
  
  setTheme: (theme) => {
    set({ theme });
    
    get().addLog({
      level: 'info',
      message: `Tema cambiado a ${theme}`,
      source: 'UI'
    });
  },
  
  toggleNotifications: () => {
    set((state) => ({ notifications: !state.notifications }));
    
    get().addLog({
      level: 'info',
      message: `Notificaciones ${get().notifications ? 'activadas' : 'desactivadas'}`,
      source: 'UI'
    });
  }
}));
