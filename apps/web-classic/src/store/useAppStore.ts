import { create } from 'zustand';

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'online' | 'offline' | 'maintenance';
  url: string;
  lastActivity?: string;
}

export interface Project {
  id: string;
  name: string;
  type: 'music' | 'voice' | 'social' | 'collaboration';
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface PixelMessage {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
}

interface AppState {
  // Modules
  modules: Module[];
  activeModule: string | null;
  
  // Projects
  projects: Project[];
  
  // Pixel AI
  pixelMessages: PixelMessage[];
  pixelVisible: boolean;
  
  // UI State
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  
  // Actions
  setActiveModule: (moduleId: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addPixelMessage: (message: Omit<PixelMessage, 'id' | 'timestamp'>) => void;
  togglePixel: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  modules: [
    {
      id: 'nexus-visual',
      name: 'Nexus Visual',
      description: 'Experiencia inmersiva con lluvia Matrix y efectos glitch',
      icon: '🌀',
      status: 'online',
      url: '/nexus-visual',
      lastActivity: '2024-01-15T10:30:00Z'
    },
    {
      id: 'ghost-studio',
      name: 'Ghost Studio',
      description: 'Producción musical con Suno API, So-VITS y Bark',
      icon: '🎵',
      status: 'online',
      url: '/ghost-studio',
      lastActivity: '2024-01-15T09:45:00Z'
    },
    {
      id: 'clone-station',
      name: 'Clone Station',
      description: 'Gestión de datasets y clonación de voz',
      icon: '🎭',
      status: 'online',
      url: '/clone-station',
      lastActivity: '2024-01-15T08:20:00Z'
    },
    {
      id: 'nova-post-pilot',
      name: 'Nova Post Pilot',
      description: 'Automatización de redes sociales',
      icon: '🚀',
      status: 'online',
      url: '/nova-post-pilot',
      lastActivity: '2024-01-15T07:15:00Z'
    },
    {
      id: 'sanctuary-social',
      name: 'Sanctuary Social',
      description: 'Red social colaborativa',
      icon: '🏛️',
      status: 'online',
      url: '/sanctuary-social',
      lastActivity: '2024-01-15T06:30:00Z'
    }
  ],
  
  activeModule: null,
  
  projects: [
    {
      id: '1',
      name: 'Cyberpunk Ambient Album',
      type: 'music',
      status: 'active',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Voice Clone Training',
      type: 'voice',
      status: 'active',
      createdAt: '2024-01-12T00:00:00Z',
      updatedAt: '2024-01-15T09:45:00Z'
    },
    {
      id: '3',
      name: 'Social Media Campaign',
      type: 'social',
      status: 'completed',
      createdAt: '2024-01-08T00:00:00Z',
      updatedAt: '2024-01-14T18:00:00Z'
    }
  ],
  
  pixelMessages: [
    {
      id: '1',
      message: 'Sistema Nexus activado. Todos los módulos operativos.',
      type: 'success',
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      message: 'Nueva colaboración disponible en Sanctuary Social.',
      type: 'info',
      timestamp: '2024-01-15T10:15:00Z'
    }
  ],
  
  pixelVisible: true,
  sidebarOpen: false,
  theme: 'dark',
  
  // Actions
  setActiveModule: (moduleId) => set({ activeModule: moduleId }),
  
  addProject: (project) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    set((state) => ({ projects: [...state.projects, newProject] }));
  },
  
  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      )
    }));
  },
  
  addPixelMessage: (message) => {
    const newMessage: PixelMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    set((state) => ({ pixelMessages: [...state.pixelMessages, newMessage] }));
  },
  
  togglePixel: () => set((state) => ({ pixelVisible: !state.pixelVisible })),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setTheme: (theme) => set({ theme })
}));