/**
 * WebSocket Service
 * Handles real-time communication for collaboration and live features
 */

import { Server as HTTPServer } from 'http';
import SocketIO from 'socket.io';
import { EventEmitter } from 'events';
import {
  generateSecureToken,
  sanitizeForLogging,
  ErrorFactory,
  WEBSOCKET
} from '@son1kvers3/shared-utils';

export interface CollaborationRoom {
  id: string;
  name: string;
  participants: Map<string, SocketUser>;
  maxParticipants: number;
  isActive: boolean;
  createdAt: Date;
  settings: CollaborationSettings;
}

export interface SocketUser {
  id: string;
  socketId: string;
  username: string;
  avatar?: string;
  tier: string;
  isOnline: boolean;
  lastSeen: Date;
  currentRoom?: string;
  permissions: UserPermissions;
}

export interface CollaborationSettings {
  allowChat: boolean;
  allowScreenShare: boolean;
  allowFileUpload: boolean;
  maxFileSize: number;
  requireApproval: boolean;
}

export interface UserPermissions {
  canEdit: boolean;
  canInvite: boolean;
  canManageSettings: boolean;
  canKickUsers: boolean;
  canDeleteMessages: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'file' | 'audio';
  metadata?: Record<string, any>;
}

export interface CollaborationEvent {
  type: 'user_joined' | 'user_left' | 'track_updated' | 'settings_changed' | 'file_shared';
  userId: string;
  username: string;
  data: any;
  timestamp: Date;
}

export class WebSocketService extends EventEmitter {
  private io: SocketIO.Server;
  private rooms: Map<string, CollaborationRoom> = new Map();
  private users: Map<string, SocketUser> = new Map();
  private heartbeatInterval?: NodeJS.Timeout;
  private cleanupInterval?: NodeJS.Timeout;

  constructor(server: HTTPServer) {
    super();

    this.io = new SocketIO.Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
      },
      pingTimeout: WEBSOCKET.HEARTBEAT_INTERVAL,
      pingInterval: WEBSOCKET.HEARTBEAT_INTERVAL / 2,
      maxHttpBufferSize: 1e8, // 100MB
      connectTimeout: 20000
    });

    this.initializeEventHandlers();
    this.initializeHeartbeat();
    this.initializeCleanup();

    console.log('WebSocket service initialized');
  }

  /**
   * Initialize event handlers
   */
  private initializeEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Authentication middleware
      socket.use(async (packet, next) => {
        try {
          await this.authenticateSocket(socket, packet, next);
        } catch (error) {
          next(new Error('Authentication failed'));
        }
      });

      // Connection handlers
      socket.on('authenticate', (data) => this.handleAuthentication(socket, data));
      socket.on('join_collaboration', (data) => this.handleJoinCollaboration(socket, data));
      socket.on('leave_collaboration', (data) => this.handleLeaveCollaboration(socket, data));
      socket.on('send_message', (data) => this.handleSendMessage(socket, data));
      socket.on('update_track', (data) => this.handleUpdateTrack(socket, data));
      socket.on('update_settings', (data) => this.handleUpdateSettings(socket, data));
      socket.on('share_file', (data) => this.handleShareFile(socket, data));
      socket.on('typing_start', (data) => this.handleTypingStart(socket, data));
      socket.on('typing_stop', (data) => this.handleTypingStop(socket, data));
      socket.on('user_status', (data) => this.handleUserStatus(socket, data));

      // Disconnection handler
      socket.on('disconnect', (reason) => this.handleDisconnection(socket, reason));

      // Error handler
      socket.on('error', (error) => this.handleSocketError(socket, error));
    });
  }

  /**
   * Authenticate socket connection
   */
  private async authenticateSocket(socket: SocketIO.Socket, packet: any, next: (err?: Error) => void) {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization;

      if (!token) {
        return next(new Error('No token provided'));
      }

      // Validate token (simplified - implement proper JWT validation)
      const user = await this.validateUserToken(token);
      if (!user) {
        return next(new Error('Invalid token'));
      }

      // Store user in socket
      (socket as any).user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  }

  /**
   * Validate user token (placeholder - implement proper validation)
   */
  private async validateUserToken(token: string): Promise<any> {
    // This is a placeholder - implement proper JWT validation
    // For now, return a mock user
    return {
      id: 'user_' + generateSecureToken(8),
      username: 'user_' + generateSecureToken(4),
      tier: 'FREE'
    };
  }

  /**
   * Handle user authentication
   */
  private async handleAuthentication(socket: SocketIO.Socket, data: any) {
    try {
      const user = (socket as any).user;

      if (!user) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      // Update user status
      this.users.set(user.id, {
        id: user.id,
        socketId: socket.id,
        username: user.username,
        avatar: user.avatar,
        tier: user.tier,
        isOnline: true,
        lastSeen: new Date(),
        permissions: this.getUserPermissions(user)
      });

      // Send welcome message
      socket.emit('authenticated', {
        user: this.users.get(user.id),
        timestamp: new Date()
      });

      // Notify others of user online status
      socket.broadcast.emit('user_online', {
        userId: user.id,
        username: user.username,
        timestamp: new Date()
      });

      this.emit('userConnected', { userId: user.id, socketId: socket.id });

    } catch (error) {
      socket.emit('error', { message: 'Authentication failed' });
    }
  }

  /**
   * Handle join collaboration
   */
  private async handleJoinCollaboration(socket: SocketIO.Socket, data: { collaborationId: string }) {
    try {
      const user = (socket as any).user;
      const { collaborationId } = data;

      // Get or create room
      let room = this.rooms.get(collaborationId);
      if (!room) {
        // Create new room (in real implementation, get from database)
        room = {
          id: collaborationId,
          name: `Collaboration ${collaborationId}`,
          participants: new Map(),
          maxParticipants: 10,
          isActive: true,
          createdAt: new Date(),
          settings: {
            allowChat: true,
            allowScreenShare: true,
            allowFileUpload: true,
            maxFileSize: 50 * 1024 * 1024, // 50MB
            requireApproval: false
          }
        };
        this.rooms.set(collaborationId, room);
      }

      // Check if room is full
      if (room.participants.size >= room.maxParticipants) {
        socket.emit('error', { message: 'Collaboration room is full' });
        return;
      }

      // Add user to room
      room.participants.set(user.id, this.users.get(user.id)!);
      this.users.get(user.id)!.currentRoom = collaborationId;

      // Join socket room
      await socket.join(collaborationId);

      // Send room state to user
      socket.emit('joined_collaboration', {
        room: this.getRoomState(room),
        participants: Array.from(room.participants.values()),
        timestamp: new Date()
      });

      // Notify other participants
      socket.to(collaborationId).emit('user_joined', {
        user: this.users.get(user.id),
        timestamp: new Date()
      });

      // Send system message
      this.sendSystemMessage(collaborationId, {
        message: `${user.username} joined the collaboration`,
        type: 'user_joined'
      });

      this.emit('userJoinedCollaboration', {
        userId: user.id,
        collaborationId,
        participants: room.participants.size
      });

    } catch (error) {
      socket.emit('error', { message: 'Failed to join collaboration' });
    }
  }

  /**
   * Handle leave collaboration
   */
  private async handleLeaveCollaboration(socket: SocketIO.Socket, data: { collaborationId: string }) {
    try {
      const user = (socket as any).user;
      const { collaborationId } = data;

      const room = this.rooms.get(collaborationId);
      if (room) {
        // Remove user from room
        room.participants.delete(user.id);
        this.users.get(user.id)!.currentRoom = undefined;

        // Leave socket room
        await socket.leave(collaborationId);

        // Notify other participants
        socket.to(collaborationId).emit('user_left', {
          userId: user.id,
          username: user.username,
          timestamp: new Date()
        });

        // Send system message
        this.sendSystemMessage(collaborationId, {
          message: `${user.username} left the collaboration`,
          type: 'user_left'
        });

        // Clean up empty room
        if (room.participants.size === 0) {
          this.rooms.delete(collaborationId);
        }

        this.emit('userLeftCollaboration', {
          userId: user.id,
          collaborationId,
          participants: room.participants.size
        });
      }

    } catch (error) {
      socket.emit('error', { message: 'Failed to leave collaboration' });
    }
  }

  /**
   * Handle send message
   */
  private async handleSendMessage(socket: SocketIO.Socket, data: {
    collaborationId: string;
    message: string;
    type?: 'text' | 'file' | 'audio';
    metadata?: Record<string, any>;
  }) {
    try {
      const user = (socket as any).user;
      const { collaborationId, message, type = 'text', metadata } = data;

      const room = this.rooms.get(collaborationId);
      if (!room || !room.settings.allowChat) {
        socket.emit('error', { message: 'Chat not allowed in this room' });
        return;
      }

      // Check if user is in room
      if (!room.participants.has(user.id)) {
        socket.emit('error', { message: 'Not a participant in this collaboration' });
        return;
      }

      // Create message
      const chatMessage: ChatMessage = {
        id: generateSecureToken(16),
        userId: user.id,
        username: user.username,
        message,
        timestamp: new Date(),
        type,
        metadata
      };

      // Send to all participants in room
      this.io.to(collaborationId).emit('new_message', chatMessage);

      // Store message (in real implementation, save to database)
      this.emit('messageSent', { message: chatMessage, collaborationId });

    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  /**
   * Handle track update
   */
  private async handleUpdateTrack(socket: SocketIO.Socket, data: {
    collaborationId: string;
    trackId: string;
    updates: any;
  }) {
    try {
      const user = (socket as any).user;
      const { collaborationId, trackId, updates } = data;

      const room = this.rooms.get(collaborationId);
      if (!room) {
        socket.emit('error', { message: 'Collaboration not found' });
        return;
      }

      // Check permissions
      const userInRoom = room.participants.get(user.id);
      if (!userInRoom || !userInRoom.permissions.canEdit) {
        socket.emit('error', { message: 'Insufficient permissions' });
        return;
      }

      // Broadcast track update to all participants
      socket.to(collaborationId).emit('track_updated', {
        trackId,
        updates,
        updatedBy: user.id,
        username: user.username,
        timestamp: new Date()
      });

      // Send confirmation to sender
      socket.emit('track_update_confirmed', {
        trackId,
        timestamp: new Date()
      });

      this.emit('trackUpdated', {
        collaborationId,
        trackId,
        userId: user.id,
        updates
      });

    } catch (error) {
      socket.emit('error', { message: 'Failed to update track' });
    }
  }

  /**
   * Handle settings update
   */
  private async handleUpdateSettings(socket: SocketIO.Socket, data: {
    collaborationId: string;
    settings: Partial<CollaborationSettings>;
  }) {
    try {
      const user = (socket as any).user;
      const { collaborationId, settings } = data;

      const room = this.rooms.get(collaborationId);
      if (!room) {
        socket.emit('error', { message: 'Collaboration not found' });
        return;
      }

      // Check permissions
      const userInRoom = room.participants.get(user.id);
      if (!userInRoom || !userInRoom.permissions.canManageSettings) {
        socket.emit('error', { message: 'Insufficient permissions' });
        return;
      }

      // Update room settings
      room.settings = { ...room.settings, ...settings };

      // Broadcast settings update
      this.io.to(collaborationId).emit('settings_updated', {
        settings: room.settings,
        updatedBy: user.id,
        username: user.username,
        timestamp: new Date()
      });

      this.emit('collaborationSettingsUpdated', {
        collaborationId,
        userId: user.id,
        settings
      });

    } catch (error) {
      socket.emit('error', { message: 'Failed to update settings' });
    }
  }

  /**
   * Handle file sharing
   */
  private async handleShareFile(socket: SocketIO.Socket, data: {
    collaborationId: string;
    file: {
      name: string;
      size: number;
      type: string;
      data?: string; // base64 encoded
    };
  }) {
    try {
      const user = (socket as any).user;
      const { collaborationId, file } = data;

      const room = this.rooms.get(collaborationId);
      if (!room || !room.settings.allowFileUpload) {
        socket.emit('error', { message: 'File upload not allowed' });
        return;
      }

      // Check file size
      if (file.size > room.settings.maxFileSize) {
        socket.emit('error', { message: 'File too large' });
        return;
      }

      // Check if user is in room
      if (!room.participants.has(user.id)) {
        socket.emit('error', { message: 'Not a participant in this collaboration' });
        return;
      }

      // Broadcast file share
      socket.to(collaborationId).emit('file_shared', {
        file: {
          name: file.name,
          size: file.size,
          type: file.type
        },
        sharedBy: user.id,
        username: user.username,
        timestamp: new Date()
      });

      this.emit('fileShared', {
        collaborationId,
        userId: user.id,
        file
      });

    } catch (error) {
      socket.emit('error', { message: 'Failed to share file' });
    }
  }

  /**
   * Handle typing indicators
   */
  private async handleTypingStart(socket: SocketIO.Socket, data: { collaborationId: string }) {
    const user = (socket as any).user;
    const { collaborationId } = data;

    socket.to(collaborationId).emit('user_typing', {
      userId: user.id,
      username: user.username,
      timestamp: new Date()
    });
  }

  private async handleTypingStop(socket: SocketIO.Socket, data: { collaborationId: string }) {
    const user = (socket as any).user;
    const { collaborationId } = data;

    socket.to(collaborationId).emit('user_stopped_typing', {
      userId: user.id,
      username: user.username,
      timestamp: new Date()
    });
  }

  /**
   * Handle user status updates
   */
  private async handleUserStatus(socket: SocketIO.Socket, data: { status: string }) {
    const user = (socket as any).user;
    const { status } = data;

    if (this.users.has(user.id)) {
      const userData = this.users.get(user.id)!;
      userData.lastSeen = new Date();

      // Broadcast status update
      socket.broadcast.emit('user_status_updated', {
        userId: user.id,
        username: user.username,
        status,
        timestamp: new Date()
      });
    }
  }

  /**
   * Handle disconnection
   */
  private async handleDisconnection(socket: SocketIO.Socket, reason: string) {
    try {
      const user = (socket as any).user;

      if (user && this.users.has(user.id)) {
        const userData = this.users.get(user.id)!;

        // Update user status
        userData.isOnline = false;
        userData.lastSeen = new Date();

        // Leave current room if any
        if (userData.currentRoom) {
          const room = this.rooms.get(userData.currentRoom);
          if (room) {
            room.participants.delete(user.id);

            // Notify other participants
            socket.to(userData.currentRoom).emit('user_left', {
              userId: user.id,
              username: user.username,
              timestamp: new Date()
            });

            // Send system message
            this.sendSystemMessage(userData.currentRoom, {
              message: `${user.username} disconnected`,
              type: 'user_disconnected'
            });
          }
        }

        // Broadcast offline status
        socket.broadcast.emit('user_offline', {
          userId: user.id,
          username: user.username,
          timestamp: new Date()
        });

        this.emit('userDisconnected', {
          userId: user.id,
          socketId: socket.id,
          reason
        });
      }

      console.log(`User disconnected: ${socket.id}, reason: ${reason}`);

    } catch (error) {
      console.error('Error handling disconnection:', error);
    }
  }

  /**
   * Handle socket errors
   */
  private async handleSocketError(socket: SocketIO.Socket, error: Error) {
    console.error(`Socket error for ${socket.id}:`, error);

    this.emit('socketError', {
      socketId: socket.id,
      error: error.message
    });
  }

  /**
   * Send system message to room
   */
  private sendSystemMessage(collaborationId: string, data: { message: string; type: string }) {
    const message: ChatMessage = {
      id: generateSecureToken(16),
      userId: 'system',
      username: 'System',
      message: data.message,
      timestamp: new Date(),
      type: 'system',
      metadata: { systemType: data.type }
    };

    this.io.to(collaborationId).emit('new_message', message);
  }

  /**
   * Get room state for client
   */
  private getRoomState(room: CollaborationRoom) {
    return {
      id: room.id,
      name: room.name,
      participantCount: room.participants.size,
      maxParticipants: room.maxParticipants,
      isActive: room.isActive,
      settings: room.settings,
      createdAt: room.createdAt
    };
  }

  /**
   * Get user permissions based on role
   */
  private getUserPermissions(user: any): UserPermissions {
    // In a real implementation, get permissions from database
    // For now, return default permissions based on tier
    const isPremiumOrAbove = user.tier === 'PREMIUM' || user.tier === 'ENTERPRISE';

    return {
      canEdit: true,
      canInvite: isPremiumOrAbove,
      canManageSettings: user.tier === 'ENTERPRISE',
      canKickUsers: user.tier === 'ENTERPRISE',
      canDeleteMessages: isPremiumOrAbove
    };
  }

  /**
   * Initialize heartbeat monitoring
   */
  private initializeHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      // Send ping to all connected clients
      this.io.emit('ping', { timestamp: Date.now() });

      // Check for inactive users
      this.checkInactiveUsers();
    }, WEBSOCKET.HEARTBEAT_INTERVAL);
  }

  /**
   * Initialize cleanup scheduler
   */
  private initializeCleanup() {
    this.cleanupInterval = setInterval(() => {
      this.cleanupInactiveRooms();
    }, 300000); // Every 5 minutes
  }

  /**
   * Check for inactive users
   */
  private checkInactiveUsers() {
    const inactiveThreshold = new Date(Date.now() - WEBSOCKET.HEARTBEAT_INTERVAL * 2);

    for (const [userId, user] of this.users.entries()) {
      if (user.lastSeen < inactiveThreshold) {
        user.isOnline = false;

        // Broadcast offline status
        this.io.emit('user_offline', {
          userId,
          username: user.username,
          timestamp: new Date()
        });
      }
    }
  }

  /**
   * Cleanup inactive rooms
   */
  private cleanupInactiveRooms() {
    const inactiveThreshold = new Date(Date.now() - 3600000); // 1 hour

    for (const [roomId, room] of this.rooms.entries()) {
      if (room.participants.size === 0 && room.createdAt < inactiveThreshold) {
        this.rooms.delete(roomId);
        console.log(`Cleaned up inactive room: ${roomId}`);
      }
    }
  }

  /**
   * Get active users count
   */
  getActiveUsersCount(): number {
    return Array.from(this.users.values()).filter(user => user.isOnline).length;
  }

  /**
   * Get active rooms count
   */
  getActiveRoomsCount(): number {
    return this.rooms.size;
  }

  /**
   * Get room participants
   */
  getRoomParticipants(collaborationId: string): SocketUser[] {
    const room = this.rooms.get(collaborationId);
    return room ? Array.from(room.participants.values()) : [];
  }

  /**
   * Send notification to user
   */
  sendNotificationToUser(userId: string, notification: {
    type: string;
    title: string;
    message: string;
    data?: any;
  }): boolean {
    const user = Array.from(this.users.values()).find(u => u.id === userId);
    if (user) {
      this.io.to(user.socketId).emit('notification', notification);
      return true;
    }
    return false;
  }

  /**
   * Broadcast to all users in a room
   */
  broadcastToRoom(collaborationId: string, event: string, data: any) {
    this.io.to(collaborationId).emit(event, data);
  }

  /**
   * Get service statistics
   */
  getStats(): {
    totalConnections: number;
    activeUsers: number;
    activeRooms: number;
    messagesSent: number;
    uptime: number;
  } {
    return {
      totalConnections: this.io.engine.clientsCount,
      activeUsers: this.getActiveUsersCount(),
      activeRooms: this.getActiveRoomsCount(),
      messagesSent: 0, // Would track this in real implementation
      uptime: process.uptime()
    };
  }

  /**
   * Close service and cleanup
   */
  close() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    // Close all connections
    this.io.close();

    // Clear data
    this.rooms.clear();
    this.users.clear();

    this.removeAllListeners();
  }
}

/**
 * Setup WebSocket service
 */
export function setupWebSocket(
  server: HTTPServer,
  collaborationService?: any,
  analyticsService?: any
): SocketIO.Server {
  const wsService = new WebSocketService(server);

  // Listen for collaboration events
  if (collaborationService) {
    collaborationService.on('collaborationCreated', (data: any) => {
      wsService.broadcastToRoom(data.collaborationId, 'collaboration_created', data);
    });

    collaborationService.on('collaborationUpdated', (data: any) => {
      wsService.broadcastToRoom(data.collaborationId, 'collaboration_updated', data);
    });
  }

  // Listen for analytics events
  if (analyticsService) {
    analyticsService.on('userActivity', (data: any) => {
      // Broadcast real-time analytics to admin users
      wsService.broadcastToRoom('admin', 'live_analytics', data);
    });
  }

  return wsService.io;
}
