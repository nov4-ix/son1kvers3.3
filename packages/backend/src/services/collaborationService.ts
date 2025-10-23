/**
 * Collaboration Service
 * Manages real-time collaboration, project sharing, and team features
 */

import { PrismaClient } from '@prisma/client';
import { EventEmitter } from 'events';
import {
  generateSecureToken,
  sanitizeForLogging,
  ErrorFactory,
  validateCollaborationParameters
} from '@son1kvers3/shared-utils';

export interface CollaborationProject {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  participants: CollaborationParticipant[];
  tracks: Track[];
  bpm: number;
  key: string;
  sections: ProjectSection[];
  version: number;
  totalDuration: number;
  settings: CollaborationSettings;
  status: CollaborationStatus;
  visibility: CollaborationVisibility;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollaborationParticipant {
  userId: string;
  username: string;
  role: CollaborationRole;
  permissions: CollaborationPermissions;
  joinedAt: Date;
  lastActive: Date;
  contributions: number;
  isOnline: boolean;
}

export interface Track {
  id: string;
  name: string;
  type: 'audio' | 'midi' | 'automation';
  url?: string;
  data?: any;
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  effects: Effect[];
  clips: Clip[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Clip {
  id: string;
  startTime: number;
  duration: number;
  offset: number;
  gain: number;
  fadeIn: number;
  fadeOut: number;
}

export interface Effect {
  id: string;
  type: string;
  parameters: Record<string, number>;
  enabled: boolean;
}

export interface ProjectSection {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  type: 'intro' | 'verse' | 'chorus' | 'bridge' | 'outro' | 'custom';
  color?: string;
}

export interface CollaborationSettings {
  allowComments: boolean;
  requireApproval: boolean;
  autoSave: boolean;
  maxParticipants: number;
  maxTracks: number;
  maxFileSize: number;
  allowPublicView: boolean;
  allowDownload: boolean;
}

export enum CollaborationStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

export enum CollaborationVisibility {
  PRIVATE = 'PRIVATE',
  UNLISTED = 'UNLISTED',
  PUBLIC = 'PUBLIC'
}

export enum CollaborationRole {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

export interface CollaborationPermissions {
  canEdit: boolean;
  canInvite: boolean;
  canExport: boolean;
  canManageSettings: boolean;
  canDelete: boolean;
  canComment: boolean;
}

export interface CollaborationEvent {
  type: 'created' | 'updated' | 'participant_joined' | 'participant_left' | 'track_added' | 'track_updated' | 'completed';
  collaborationId: string;
  userId: string;
  data: any;
  timestamp: Date;
}

export class CollaborationService extends EventEmitter {
  private activeProjects: Map<string, CollaborationProject> = new Map();
  private projectLocks: Map<string, Date> = new Map();
  private autoSaveInterval?: NodeJS.Timeout;

  constructor(private prisma: PrismaClient, private tokenManager: any) {
    super();

    this.initializeAutoSave();
    this.listenForTokenEvents();
  }

  /**
   * Initialize auto-save functionality
   */
  private initializeAutoSave() {
    this.autoSaveInterval = setInterval(async () => {
      await this.performAutoSave();
    }, 30000); // Every 30 seconds
  }

  /**
   * Listen for token manager events
   */
  private listenForTokenEvents() {
    this.tokenManager.on('tokenError', this.handleTokenError.bind(this));
  }

  /**
   * Create new collaboration project
   */
  async createCollaboration(
    ownerId: string,
    projectData: {
      name: string;
      description?: string;
      bpm?: number;
      key?: string;
      visibility?: CollaborationVisibility;
      settings?: Partial<CollaborationSettings>;
    }
  ): Promise<CollaborationProject> {
    try {
      // Validate project data
      if (!projectData.name || projectData.name.trim().length === 0) {
        throw new Error('Project name is required');
      }

      // Create project in database
      const collaboration = await this.prisma.collaboration.create({
        data: {
          userId: ownerId,
          projectName: projectData.name,
          participants: JSON.stringify([{
            userId: ownerId,
            username: 'Owner',
            role: CollaborationRole.OWNER,
            permissions: this.getOwnerPermissions(),
            joinedAt: new Date(),
            lastActive: new Date(),
            contributions: 0,
            isOnline: true
          }]),
          createdAt: new Date()
        }
      });

      // Create project object
      const project: CollaborationProject = {
        id: collaboration.id,
        name: projectData.name,
        description: projectData.description,
        ownerId,
        participants: [{
          userId: ownerId,
          username: 'Owner',
          role: CollaborationRole.OWNER,
          permissions: this.getOwnerPermissions(),
          joinedAt: new Date(),
          lastActive: new Date(),
          contributions: 0,
          isOnline: true
        }],
        tracks: [],
        bpm: projectData.bpm || 120,
        key: projectData.key || 'C',
        sections: [],
        version: 1,
        totalDuration: 0,
        settings: {
          allowComments: true,
          requireApproval: false,
          autoSave: true,
          maxParticipants: 10,
          maxTracks: 50,
          maxFileSize: 100 * 1024 * 1024, // 100MB
          allowPublicView: projectData.visibility === CollaborationVisibility.PUBLIC,
          allowDownload: true,
          ...projectData.settings
        },
        status: CollaborationStatus.DRAFT,
        visibility: projectData.visibility || CollaborationVisibility.PRIVATE,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Cache project
      this.activeProjects.set(collaboration.id, project);

      this.emit('collaborationCreated', {
        collaborationId: collaboration.id,
        ownerId,
        name: projectData.name
      });

      return project;

    } catch (error) {
      this.emit('collaborationError', { error, operation: 'createCollaboration', ownerId });
      throw ErrorFactory.fromUnknown(error, 'Failed to create collaboration');
    }
  }

  /**
   * Get collaboration project
   */
  async getCollaboration(collaborationId: string, userId?: string): Promise<CollaborationProject | null> {
    try {
      // Check if project is cached
      let project = this.activeProjects.get(collaborationId);

      if (!project) {
        // Load from database
        const collaboration = await this.prisma.collaboration.findUnique({
          where: { id: collaborationId }
        });

        if (!collaboration) {
          return null;
        }

        // Check permissions if user is not owner
        if (userId && collaboration.userId !== userId) {
          const participants = JSON.parse(collaboration.participants as string);
          const userParticipant = participants.find((p: any) => p.userId === userId);

          if (!userParticipant) {
            throw new Error('Access denied');
          }
        }

        // Convert to project object
        project = this.convertToProjectObject(collaboration);
        this.activeProjects.set(collaborationId, project);
      }

      return project;

    } catch (error) {
      this.emit('collaborationError', { error, operation: 'getCollaboration', collaborationId });
      throw ErrorFactory.fromUnknown(error, 'Failed to get collaboration');
    }
  }

  /**
   * Update collaboration project
   */
  async updateCollaboration(
    collaborationId: string,
    userId: string,
    updates: Partial<CollaborationProject>
  ): Promise<CollaborationProject> {
    try {
      const project = await this.getCollaboration(collaborationId, userId);
      if (!project) {
        throw new Error('Collaboration not found');
      }

      // Check permissions
      const userParticipant = project.participants.find(p => p.userId === userId);
      if (!userParticipant || !userParticipant.permissions.canEdit) {
        throw new Error('Insufficient permissions');
      }

      // Apply updates
      const updatedProject: CollaborationProject = {
        ...project,
        ...updates,
        updatedAt: new Date()
      };

      // Update in database
      await this.prisma.collaboration.update({
        where: { id: collaborationId },
        data: {
          projectName: updatedProject.name,
          participants: JSON.stringify(updatedProject.participants),
          updatedAt: new Date()
        }
      });

      // Update cache
      this.activeProjects.set(collaborationId, updatedProject);

      this.emit('collaborationUpdated', {
        collaborationId,
        userId,
        updates
      });

      return updatedProject;

    } catch (error) {
      this.emit('collaborationError', { error, operation: 'updateCollaboration', collaborationId });
      throw ErrorFactory.fromUnknown(error, 'Failed to update collaboration');
    }
  }

  /**
   * Add participant to collaboration
   */
  async addParticipant(
    collaborationId: string,
    ownerId: string,
    newUserId: string,
    role: CollaborationRole = CollaborationRole.VIEWER
  ): Promise<CollaborationProject> {
    try {
      const project = await this.getCollaboration(collaborationId, ownerId);
      if (!project) {
        throw new Error('Collaboration not found');
      }

      // Check if owner has permission
      const ownerParticipant = project.participants.find(p => p.userId === ownerId);
      if (!ownerParticipant || !ownerParticipant.permissions.canInvite) {
        throw new Error('Insufficient permissions to invite users');
      }

      // Check if user is already a participant
      if (project.participants.some(p => p.userId === newUserId)) {
        throw new Error('User is already a participant');
      }

      // Check participant limit
      if (project.participants.length >= project.settings.maxParticipants) {
        throw new Error('Collaboration is full');
      }

      // Add participant
      const newParticipant: CollaborationParticipant = {
        userId: newUserId,
        username: `User ${newUserId}`,
        role,
        permissions: this.getPermissionsForRole(role),
        joinedAt: new Date(),
        lastActive: new Date(),
        contributions: 0,
        isOnline: false
      };

      project.participants.push(newParticipant);

      // Update in database
      await this.prisma.collaboration.update({
        where: { id: collaborationId },
        data: {
          participants: JSON.stringify(project.participants),
          updatedAt: new Date()
        }
      });

      // Update cache
      this.activeProjects.set(collaborationId, project);

      this.emit('participantAdded', {
        collaborationId,
        userId: newUserId,
        addedBy: ownerId,
        role
      });

      return project;

    } catch (error) {
      this.emit('collaborationError', { error, operation: 'addParticipant', collaborationId });
      throw ErrorFactory.fromUnknown(error, 'Failed to add participant');
    }
  }

  /**
   * Remove participant from collaboration
   */
  async removeParticipant(
    collaborationId: string,
    ownerId: string,
    userIdToRemove: string
  ): Promise<CollaborationProject> {
    try {
      const project = await this.getCollaboration(collaborationId, ownerId);
      if (!project) {
        throw new Error('Collaboration not found');
      }

      // Check permissions
      const ownerParticipant = project.participants.find(p => p.userId === ownerId);
      if (!ownerParticipant || !ownerParticipant.permissions.canInvite) {
        throw new Error('Insufficient permissions');
      }

      // Remove participant
      project.participants = project.participants.filter(p => p.userId !== userIdToRemove);

      // Update in database
      await this.prisma.collaboration.update({
        where: { id: collaborationId },
        data: {
          participants: JSON.stringify(project.participants),
          updatedAt: new Date()
        }
      });

      // Update cache
      this.activeProjects.set(collaborationId, project);

      this.emit('participantRemoved', {
        collaborationId,
        userId: userIdToRemove,
        removedBy: ownerId
      });

      return project;

    } catch (error) {
      this.emit('collaborationError', { error, operation: 'removeParticipant', collaborationId });
      throw ErrorFactory.fromUnknown(error, 'Failed to remove participant');
    }
  }

  /**
   * Add track to project
   */
  async addTrack(
    collaborationId: string,
    userId: string,
    trackData: {
      name: string;
      type: 'audio' | 'midi' | 'automation';
      url?: string;
      data?: any;
      volume?: number;
      pan?: number;
    }
  ): Promise<Track> {
    try {
      const project = await this.getCollaboration(collaborationId, userId);
      if (!project) {
        throw new Error('Collaboration not found');
      }

      // Check permissions and limits
      const userParticipant = project.participants.find(p => p.userId === userId);
      if (!userParticipant || !userParticipant.permissions.canEdit) {
        throw new Error('Insufficient permissions');
      }

      if (project.tracks.length >= project.settings.maxTracks) {
        throw new Error('Maximum tracks limit reached');
      }

      // Create track
      const track: Track = {
        id: generateSecureToken(16),
        name: trackData.name,
        type: trackData.type,
        url: trackData.url,
        data: trackData.data,
        volume: trackData.volume || 1.0,
        pan: trackData.pan || 0.0,
        muted: false,
        solo: false,
        effects: [],
        clips: [],
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add to project
      project.tracks.push(track);
      project.updatedAt = new Date();

      // Update in database
      await this.prisma.collaboration.update({
        where: { id: collaborationId },
        data: {
          participants: JSON.stringify(project.participants),
          updatedAt: new Date()
        }
      });

      // Update cache
      this.activeProjects.set(collaborationId, project);

      this.emit('trackAdded', {
        collaborationId,
        trackId: track.id,
        userId,
        trackName: trackData.name
      });

      return track;

    } catch (error) {
      this.emit('collaborationError', { error, operation: 'addTrack', collaborationId });
      throw ErrorFactory.fromUnknown(error, 'Failed to add track');
    }
  }

  /**
   * Update track in project
   */
  async updateTrack(
    collaborationId: string,
    userId: string,
    trackId: string,
    updates: Partial<Track>
  ): Promise<Track> {
    try {
      const project = await this.getCollaboration(collaborationId, userId);
      if (!project) {
        throw new Error('Collaboration not found');
      }

      // Find track
      const trackIndex = project.tracks.findIndex(t => t.id === trackId);
      if (trackIndex === -1) {
        throw new Error('Track not found');
      }

      // Check permissions
      const userParticipant = project.participants.find(p => p.userId === userId);
      if (!userParticipant || !userParticipant.permissions.canEdit) {
        throw new Error('Insufficient permissions');
      }

      // Update track
      project.tracks[trackIndex] = {
        ...project.tracks[trackIndex],
        ...updates,
        updatedAt: new Date()
      };

      project.updatedAt = new Date();

      // Update in database
      await this.prisma.collaboration.update({
        where: { id: collaborationId },
        data: {
          participants: JSON.stringify(project.participants),
          updatedAt: new Date()
        }
      });

      // Update cache
      this.activeProjects.set(collaborationId, project);

      this.emit('trackUpdated', {
        collaborationId,
        trackId,
        userId,
        updates
      });

      return project.tracks[trackIndex];

    } catch (error) {
      this.emit('collaborationError', { error, operation: 'updateTrack', collaborationId });
      throw ErrorFactory.fromUnknown(error, 'Failed to update track');
    }
  }

  /**
   * Delete track from project
   */
  async deleteTrack(
    collaborationId: string,
    userId: string,
    trackId: string
  ): Promise<boolean> {
    try {
      const project = await this.getCollaboration(collaborationId, userId);
      if (!project) {
        throw new Error('Collaboration not found');
      }

      // Check permissions
      const userParticipant = project.participants.find(p => p.userId === userId);
      if (!userParticipant || !userParticipant.permissions.canEdit) {
        throw new Error('Insufficient permissions');
      }

      // Remove track
      project.tracks = project.tracks.filter(t => t.id !== trackId);
      project.updatedAt = new Date();

      // Update in database
      await this.prisma.collaboration.update({
        where: { id: collaborationId },
        data: {
          participants: JSON.stringify(project.participants),
          updatedAt: new Date()
        }
      });

      // Update cache
      this.activeProjects.set(collaborationId, project);

      this.emit('trackDeleted', {
        collaborationId,
        trackId,
        userId
      });

      return true;

    } catch (error) {
      this.emit('collaborationError', { error, operation: 'deleteTrack', collaborationId });
      return false;
    }
  }

  /**
   * Get user's collaborations
   */
  async getUserCollaborations(userId: string): Promise<CollaborationProject[]> {
    try {
      const collaborations = await this.prisma.collaboration.findMany({
        where: {
          OR: [
            { userId }, // Owner
            {
              participants: {
                path: '$[*].userId',
                equals: userId
              }
            }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });

      return collaborations.map(collab => this.convertToProjectObject(collab));
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get user collaborations');
    }
  }

  /**
   * Get public collaborations
   */
  async getPublicCollaborations(limit: number = 20, offset: number = 0): Promise<CollaborationProject[]> {
    try {
      const collaborations = await this.prisma.collaboration.findMany({
        where: {
          participants: {
            path: '$[*].visibility',
            equals: CollaborationVisibility.PUBLIC
          }
        },
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' }
      });

      return collaborations.map(collab => this.convertToProjectObject(collab));
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get public collaborations');
    }
  }

  /**
   * Convert database record to project object
   */
  private convertToProjectObject(collaboration: any): CollaborationProject {
    const participants = JSON.parse(collaboration.participants as string);

    return {
      id: collaboration.id,
      name: collaboration.projectName,
      ownerId: collaboration.userId,
      participants,
      tracks: [], // Would load from separate tracks table in real implementation
      bpm: 120, // Default values
      key: 'C',
      sections: [],
      version: 1,
      totalDuration: 0,
      settings: {
        allowComments: true,
        requireApproval: false,
        autoSave: true,
        maxParticipants: 10,
        maxTracks: 50,
        maxFileSize: 100 * 1024 * 1024,
        allowPublicView: false,
        allowDownload: true
      },
      status: CollaborationStatus.ACTIVE,
      visibility: CollaborationVisibility.PRIVATE,
      createdAt: collaboration.createdAt,
      updatedAt: collaboration.updatedAt
    };
  }

  /**
   * Get permissions for role
   */
  private getPermissionsForRole(role: CollaborationRole): CollaborationPermissions {
    switch (role) {
      case CollaborationRole.OWNER:
        return this.getOwnerPermissions();
      case CollaborationRole.EDITOR:
        return this.getEditorPermissions();
      case CollaborationRole.VIEWER:
        return this.getViewerPermissions();
      default:
        return this.getViewerPermissions();
    }
  }

  /**
   * Get owner permissions
   */
  private getOwnerPermissions(): CollaborationPermissions {
    return {
      canEdit: true,
      canInvite: true,
      canExport: true,
      canManageSettings: true,
      canDelete: true,
      canComment: true
    };
  }

  /**
   * Get editor permissions
   */
  private getEditorPermissions(): CollaborationPermissions {
    return {
      canEdit: true,
      canInvite: false,
      canExport: true,
      canManageSettings: false,
      canDelete: false,
      canComment: true
    };
  }

  /**
   * Get viewer permissions
   */
  private getViewerPermissions(): CollaborationPermissions {
    return {
      canEdit: false,
      canInvite: false,
      canExport: false,
      canManageSettings: false,
      canDelete: false,
      canComment: true
    };
  }

  /**
   * Perform auto-save
   */
  private async performAutoSave() {
    try {
      for (const [collaborationId, project] of this.activeProjects.entries()) {
        if (project.updatedAt.getTime() > Date.now() - 30000) { // Only save recently updated
          await this.prisma.collaboration.update({
            where: { id: collaborationId },
            data: {
              participants: JSON.stringify(project.participants),
              updatedAt: new Date()
            }
          });
        }
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }

  /**
   * Handle token error
   */
  private handleTokenError(data: { error: any; operation: string }) {
    this.emit('tokenError', data);
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return this.activeProjects.size >= 0; // Always healthy if DB is accessible
    } catch (error) {
      return false;
    }
  }

  /**
   * Get collaboration statistics
   */
  async getStats(): Promise<{
    totalCollaborations: number;
    activeCollaborations: number;
    totalParticipants: number;
    averageParticipants: number;
  }> {
    try {
      const totalCollaborations = await this.prisma.collaboration.count();
      const activeCollaborations = this.activeProjects.size;

      // Calculate total participants and average
      const collaborations = await this.prisma.collaboration.findMany({
        select: { participants: true }
      });

      let totalParticipants = 0;
      for (const collab of collaborations) {
        const participants = JSON.parse(collab.participants as string);
        totalParticipants += participants.length;
      }

      const averageParticipants = totalCollaborations > 0 ? totalParticipants / totalCollaborations : 0;

      return {
        totalCollaborations,
        activeCollaborations,
        totalParticipants,
        averageParticipants
      };
    } catch (error) {
      throw ErrorFactory.fromUnknown(error, 'Failed to get collaboration statistics');
    }
  }

  /**
   * Close service and cleanup
   */
  async close() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }

    // Save all active projects
    await this.performAutoSave();

    this.activeProjects.clear();
    this.projectLocks.clear();
    this.removeAllListeners();
  }
}
