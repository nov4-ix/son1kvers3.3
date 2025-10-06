import { create } from 'zustand';
import { SonicPlugin, SonicPluginPreset } from '../types/sonicPlugins';

export interface AudioTrack {
  id: string;
  name: string;
  type: 'audio' | 'midi' | 'generated';
  source: string;
  volume: number;
  pan: number;
  mute: boolean;
  solo: boolean;
  plugins: SonicPlugin[];
  waveform?: number[];
  duration: number;
  startTime: number;
  color: string;
  isRecording: boolean;
}

export interface MixerChannel {
  id: string;
  trackId: string;
  volume: number;
  pan: number;
  mute: boolean;
  solo: boolean;
  plugins: SonicPlugin[];
  sends: Record<string, number>;
  faderPosition: number;
}

export interface ProjectSettings {
  name: string;
  bpm: number;
  timeSignature: [number, number];
  sampleRate: number;
  bitDepth: number;
  key: string;
  tempo: number;
  projectPath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineRegion {
  id: string;
  trackId: string;
  startTime: number;
  endTime: number;
  name: string;
  color: string;
  isSelected: boolean;
}

interface SonicState {
  // Project
  currentProject: ProjectSettings | null;
  projects: ProjectSettings[];
  
  // Tracks
  tracks: AudioTrack[];
  selectedTrackId: string | null;
  
  // Mixer
  mixerChannels: MixerChannel[];
  
  // Timeline
  timelineRegions: TimelineRegion[];
  playheadPosition: number;
  isPlaying: boolean;
  isRecording: boolean;
  
  // Transport
  currentBpm: number;
  currentTimeSignature: [number, number];
  
  // Plugins
  availablePlugins: SonicPlugin[];
  pluginPresets: SonicPluginPreset[];
  
  // UI State
  activeView: 'timeline' | 'mixer' | 'plugins' | 'browser';
  sidebarOpen: boolean;
  pluginRackOpen: boolean;
  
  // Actions
  createProject: (name: string) => void;
  loadProject: (projectId: string) => void;
  saveProject: () => void;
  
  addTrack: (type: 'audio' | 'midi' | 'generated') => void;
  removeTrack: (trackId: string) => void;
  selectTrack: (trackId: string) => void;
  updateTrack: (trackId: string, updates: Partial<AudioTrack>) => void;
  
  addPluginToTrack: (trackId: string, pluginId: string) => void;
  removePluginFromTrack: (trackId: string, pluginId: string) => void;
  updatePluginParameter: (trackId: string, pluginId: string, parameterId: string, value: any) => void;
  
  setPlayheadPosition: (position: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  record: () => void;
  
  setBpm: (bpm: number) => void;
  setTimeSignature: (signature: [number, number]) => void;
  
  setActiveView: (view: 'timeline' | 'mixer' | 'plugins' | 'browser') => void;
  toggleSidebar: () => void;
  togglePluginRack: () => void;
  
  loadPluginPreset: (pluginId: string, presetId: string) => void;
  savePluginPreset: (pluginId: string, preset: Omit<SonicPluginPreset, 'id'>) => void;
}

export const useSonicStore = create<SonicState>((set, get) => ({
  // Initial state
  currentProject: null,
  projects: [],
  
  tracks: [],
  selectedTrackId: null,
  
  mixerChannels: [],
  
  timelineRegions: [],
  playheadPosition: 0,
  isPlaying: false,
  isRecording: false,
  
  currentBpm: 120,
  currentTimeSignature: [4, 4],
  
  availablePlugins: [],
  pluginPresets: [],
  
  activeView: 'timeline',
  sidebarOpen: true,
  pluginRackOpen: false,
  
  // Actions
  createProject: (name: string) => {
    const project: ProjectSettings = {
      name,
      bpm: 120,
      timeSignature: [4, 4],
      sampleRate: 44100,
      bitDepth: 24,
      key: 'C',
      tempo: 120,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    set((state) => ({
      currentProject: project,
      projects: [...state.projects, project],
      tracks: [],
      mixerChannels: [],
      timelineRegions: [],
      playheadPosition: 0,
      currentBpm: 120,
      currentTimeSignature: [4, 4]
    }));
  },
  
  loadProject: (projectId: string) => {
    const project = get().projects.find(p => p.name === projectId);
    if (project) {
      set({ currentProject: project });
    }
  },
  
  saveProject: () => {
    const { currentProject } = get();
    if (currentProject) {
      set((state) => ({
        projects: state.projects.map(p =>
          p.name === currentProject.name
            ? { ...currentProject, updatedAt: new Date().toISOString() }
            : p
        ),
        currentProject: { ...currentProject, updatedAt: new Date().toISOString() }
      }));
    }
  },
  
  addTrack: (type: 'audio' | 'midi' | 'generated') => {
    const trackId = `track_${Date.now()}`;
    const track: AudioTrack = {
      id: trackId,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Track ${get().tracks.length + 1}`,
      type,
      source: '',
      volume: 0.8,
      pan: 0,
      mute: false,
      solo: false,
      plugins: [],
      duration: 0,
      startTime: 0,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      isRecording: false
    };
    
    const mixerChannel: MixerChannel = {
      id: `channel_${trackId}`,
      trackId,
      volume: 0.8,
      pan: 0,
      mute: false,
      solo: false,
      plugins: [],
      sends: {},
      faderPosition: 0
    };
    
    set((state) => ({
      tracks: [...state.tracks, track],
      mixerChannels: [...state.mixerChannels, mixerChannel],
      selectedTrackId: trackId
    }));
  },
  
  removeTrack: (trackId: string) => {
    set((state) => ({
      tracks: state.tracks.filter(t => t.id !== trackId),
      mixerChannels: state.mixerChannels.filter(c => c.trackId !== trackId),
      timelineRegions: state.timelineRegions.filter(r => r.trackId !== trackId),
      selectedTrackId: state.selectedTrackId === trackId ? null : state.selectedTrackId
    }));
  },
  
  selectTrack: (trackId: string) => {
    set({ selectedTrackId: trackId });
  },
  
  updateTrack: (trackId: string, updates: Partial<AudioTrack>) => {
    set((state) => ({
      tracks: state.tracks.map(track =>
        track.id === trackId ? { ...track, ...updates } : track
      )
    }));
  },
  
  addPluginToTrack: (trackId: string, pluginId: string) => {
    // This would load the plugin from availablePlugins
    const plugin = get().availablePlugins.find(p => p.id === pluginId);
    if (plugin) {
      const pluginInstance = { ...plugin, isActive: true };
      
      set((state) => ({
        tracks: state.tracks.map(track =>
          track.id === trackId
            ? { ...track, plugins: [...track.plugins, pluginInstance] }
            : track
        ),
        mixerChannels: state.mixerChannels.map(channel =>
          channel.trackId === trackId
            ? { ...channel, plugins: [...channel.plugins, pluginInstance] }
            : channel
        )
      }));
    }
  },
  
  removePluginFromTrack: (trackId: string, pluginId: string) => {
    set((state) => ({
      tracks: state.tracks.map(track =>
        track.id === trackId
          ? { ...track, plugins: track.plugins.filter(p => p.id !== pluginId) }
          : track
      ),
      mixerChannels: state.mixerChannels.map(channel =>
        channel.trackId === trackId
          ? { ...channel, plugins: channel.plugins.filter(p => p.id !== pluginId) }
          : channel
      )
    }));
  },
  
  updatePluginParameter: (trackId: string, pluginId: string, parameterId: string, value: any) => {
    set((state) => ({
      tracks: state.tracks.map(track =>
        track.id === trackId
          ? {
              ...track,
              plugins: track.plugins.map(plugin =>
                plugin.id === pluginId
                  ? {
                      ...plugin,
                      parameters: plugin.parameters.map(param =>
                        param.id === parameterId
                          ? { ...param, currentValue: value }
                          : param
                      )
                    }
                  : plugin
              )
            }
          : track
      )
    }));
  },
  
  setPlayheadPosition: (position: number) => {
    set({ playheadPosition: position });
  },
  
  play: () => {
    set({ isPlaying: true });
  },
  
  pause: () => {
    set({ isPlaying: false });
  },
  
  stop: () => {
    set({ isPlaying: false, playheadPosition: 0 });
  },
  
  record: () => {
    set({ isRecording: true });
  },
  
  setBpm: (bpm: number) => {
    set({ currentBpm: bpm });
  },
  
  setTimeSignature: (signature: [number, number]) => {
    set({ currentTimeSignature: signature });
  },
  
  setActiveView: (view: 'timeline' | 'mixer' | 'plugins' | 'browser') => {
    set({ activeView: view });
  },
  
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },
  
  togglePluginRack: () => {
    set((state) => ({ pluginRackOpen: !state.pluginRackOpen }));
  },
  
  loadPluginPreset: (pluginId: string, presetId: string) => {
    const preset = get().pluginPresets.find(p => p.id === presetId);
    if (preset) {
      // Apply preset parameters to all instances of the plugin
      set((state) => ({
        tracks: state.tracks.map(track => ({
          ...track,
          plugins: track.plugins.map(plugin =>
            plugin.id === pluginId
              ? {
                  ...plugin,
                  parameters: plugin.parameters.map(param => ({
                    ...param,
                    currentValue: preset.parameters[param.id] ?? param.currentValue
                  }))
                }
              : plugin
          )
        }))
      }));
    }
  },
  
  savePluginPreset: (pluginId: string, preset: Omit<SonicPluginPreset, 'id'>) => {
    const newPreset: SonicPluginPreset = {
      ...preset,
      id: `preset_${Date.now()}`
    };
    
    set((state) => ({
      pluginPresets: [...state.pluginPresets, newPreset]
    }));
  }
}));