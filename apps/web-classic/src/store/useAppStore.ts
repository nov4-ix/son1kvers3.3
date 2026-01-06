import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Project {
  id: string;
  name: string;
  type: 'music' | 'voice' | 'social' | 'nexus' | 'collaboration';
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface PixelMessage {
  id: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'pixel';
  module?: string;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'online' | 'offline' | 'maintenance';
  url: string;
  lastActivity?: string;
  lore?: {
    faction: string;
    purpose: string;
    history: string;
  };
}

export interface AppState {
  // Projects
  projects: Project[];
  activeProject: Project | null;

  // Modules
  modules: Module[];
  activeModule: string | null;

  // Pixel Assistant
  pixelMessages: PixelMessage[];
  pixelVisible: boolean;

  // UI State
  sidebarOpen: boolean;
  theme: 'dark' | 'light';

  // Ritual System
  nexusUnlocked: boolean;
  ritualCount: number;

  // Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (project: Project | null) => void;

  setActiveModule: (moduleId: string) => void;

  addPixelMessage: (message: Omit<PixelMessage, 'id' | 'timestamp'>) => void;
  clearPixelMessages: () => void;
  togglePixel: () => void;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;

  unlockNexus: () => void;
  incrementRitualCount: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      projects: [],
      activeProject: null,

      modules: [
        {
          id: 'ghost-studio',
          name: 'Ghost Studio',
          description: 'Democratizar la producción musical utilizando tecnología recuperada del Collapse.',
          icon: '🎵',
          status: 'online',
          url: '/ghost-studio',
          lore: {
            faction: 'ALVAE',
            purpose: 'Democratizar la producción musical utilizando tecnología recuperada del Collapse.',
            history: 'Originalmente un proyecto de ALVAE para preservar la música, ahora es un bastión de la Resistencia Sonora.'
          }
        },
        {
          id: 'clone-station',
          name: 'Clone Station',
          description: 'Clonación de voz avanzada con tecnología de vanguardia.',
          icon: '🎭',
          status: 'online',
          url: '/clone-station',
          lore: {
            faction: 'Resistencia',
            purpose: 'Preservar voces auténticas y democratizar la clonación vocal.',
            history: 'Desarrollado por la Resistencia para combatir los androides puente de XentriX.'
          }
        },
        {
          id: 'nova-post-pilot',
          name: 'Nova Post Pilot',
          description: 'Automatización inteligente de contenido social.',
          icon: '🚀',
          status: 'online',
          url: '/nova-post-pilot',
          lore: {
            faction: 'Resistencia',
            purpose: 'Automatizar la distribución de contenido auténtico en redes sociales.',
            history: 'Nacido de la necesidad de contrarrestar la propaganda algorítmica de XentriX.'
          }
        },
        {
          id: 'sanctuary-social',
          name: 'Sanctuary Social',
          description: 'Red social premium para creadores auténticos.',
          icon: '🏛️',
          status: 'online',
          url: '/sanctuary-social',
          lore: {
            faction: 'ALVAE',
            purpose: 'Crear un santuario digital para artistas y creadores auténticos.',
            history: 'El último refugio de la creatividad humana en el mundo digital.'
          }
        },
        {
          id: 'nexus-visual',
          name: 'Nexus Visual',
          description: 'El Generator - Experiencia inmersiva del universo Son1kVers3.',
          icon: '🌀',
          status: 'online',
          url: '/nexus-visual',
          lore: {
            faction: 'ALVAE',
            purpose: 'Proporcionar acceso inmersivo al universo completo de Son1kVers3.',
            history: 'El corazón del universo, donde convergen todas las dimensiones de la realidad.'
          }
        }
      ],
      activeModule: null,

      pixelMessages: [],
      pixelVisible: false,

      sidebarOpen: true,
      theme: 'dark',

      nexusUnlocked: false,
      ritualCount: 0,

      // Project Actions
      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        set((state) => ({
          projects: [...state.projects, newProject]
        }));
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updates, updatedAt: new Date() }
              : project
          )
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          activeProject: state.activeProject?.id === id ? null : state.activeProject
        }));
      },

      setActiveProject: (project) => {
        set({ activeProject: project });
      },

      // Module Actions
      setActiveModule: (moduleId) => {
        set({ activeModule: moduleId });
      },

      // Pixel Actions
      addPixelMessage: (messageData) => {
        const newMessage: PixelMessage = {
          ...messageData,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date()
        };
        set((state) => ({
          pixelMessages: [...state.pixelMessages, newMessage]
        }));
      },

      clearPixelMessages: () => {
        set({ pixelMessages: [] });
      },

      togglePixel: () => {
        set((state) => ({ pixelVisible: !state.pixelVisible }));
      },

      // UI Actions
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }));
      },

      setTheme: (theme) => {
        set({ theme });
      },

      // Ritual Actions
      unlockNexus: () => {
        set({ nexusUnlocked: true });
      },

      incrementRitualCount: () => {
        set((state) => ({ ritualCount: state.ritualCount + 1 }));
      }
    }),
    {
      name: 'son1kvers3-app-store',
      partialize: (state) => ({
        projects: state.projects,
        activeProject: state.activeProject,
        pixelMessages: state.pixelMessages,
        pixelVisible: state.pixelVisible,
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
        nexusUnlocked: state.nexusUnlocked,
        ritualCount: state.ritualCount
      })
    }
  )
);
