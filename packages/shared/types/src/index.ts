// Core User Types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
  tier: UserTier;
  isAdmin: boolean;
  alvaeEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  audio: AudioSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  collaborations: boolean;
  achievements: boolean;
  marketing: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showOnlineStatus: boolean;
  allowDirectMessages: boolean;
  showActivity: boolean;
}

export interface AudioSettings {
  quality: 'low' | 'medium' | 'high' | 'lossless';
  autoPlay: boolean;
  volumeNormalization: boolean;
  spatialAudio: boolean;
}

export enum UserTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}

// AI & Music Generation Types
export interface Generation {
  id: string;
  userId: string;
  prompt: string;
  result: GenerationResult;
  status: GenerationStatus;
  model: AIModel;
  parameters: GenerationParameters;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface GenerationResult {
  audioUrl: string;
  duration: number;
  format: string;
  size: number;
  metadata: AudioMetadata;
  stems?: Stem[];
  midi?: string;
  waveform?: number[];
}

export interface AudioMetadata {
  bpm: number;
  key: string;
  genre: string;
  mood: string;
  instruments: string[];
  tags: string[];
}

export interface Stem {
  id: string;
  name: string;
  url: string;
  type: 'vocals' | 'instrumental' | 'drums' | 'bass' | 'other';
  volume: number;
  muted: boolean;
}

export enum GenerationStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum AIModel {
  SON1K_V1 = 'SON1K_V1',
  SON1K_V2 = 'SON1K_V2',
  SON1K_HYBRID = 'SON1K_HYBRID',
  CUSTOM = 'CUSTOM'
}

export interface GenerationParameters {
  duration: number;
  tempo: number;
  key: string;
  genre: string;
  mood: string;
  instruments: string[];
  style: string;
  complexity: number;
  temperature: number;
  seed?: number;
}

// Collaboration Types
export interface Collaboration {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  participants: CollaborationParticipant[];
  project: CollaborationProject;
  status: CollaborationStatus;
  visibility: CollaborationVisibility;
  createdAt: Date;
  updatedAt: Date;
  settings: CollaborationSettings;
}

export interface CollaborationParticipant {
  userId: string;
  role: CollaborationRole;
  permissions: CollaborationPermissions;
  joinedAt: Date;
  lastActive: Date;
  contributions: number;
}

export interface CollaborationProject {
  tracks: Track[];
  bpm: number;
  key: string;
  sections: ProjectSection[];
  version: number;
  totalDuration: number;
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
}

export interface CollaborationSettings {
  allowComments: boolean;
  requireApproval: boolean;
  autoSave: boolean;
  maxParticipants: number;
}

// Social & Community Types
export interface CommunityPost {
  id: string;
  userId: string;
  type: PostType;
  title?: string;
  content: string;
  media?: Media[];
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  visibility: PostVisibility;
  createdAt: Date;
  updatedAt: Date;
  metadata: PostMetadata;
}

export interface Media {
  id: string;
  type: 'image' | 'audio' | 'video';
  url: string;
  thumbnail?: string;
  duration?: number;
  size: number;
}

export enum PostType {
  TRACK_SHARE = 'TRACK_SHARE',
  COLLABORATION = 'COLLABORATION',
  ACHIEVEMENT = 'ACHIEVEMENT',
  GENERAL = 'GENERAL'
}

export enum PostVisibility {
  PUBLIC = 'PUBLIC',
  FOLLOWERS = 'FOLLOWERS',
  PRIVATE = 'PRIVATE'
}

export interface PostMetadata {
  trackId?: string;
  collaborationId?: string;
  achievementId?: string;
  location?: string;
  mood?: string;
}

// NFT & Marketplace Types
export interface NFT {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  audio: string;
  creatorId: string;
  ownerId: string;
  contractAddress: string;
  chain: string;
  metadata: NFTMetadata;
  attributes: NFTAttribute[];
  price: string;
  currency: string;
  status: NFTStatus;
  createdAt: Date;
  soldAt?: Date;
}

export interface NFTMetadata {
  duration: number;
  bpm: number;
  key: string;
  genre: string;
  mood: string;
  tags: string[];
  royaltyPercentage: number;
  totalSupply: number;
  currentSupply: number;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  rarity?: number;
}

export enum NFTStatus {
  MINTING = 'MINTING',
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
  AUCTION = 'AUCTION'
}

// Analytics Types
export interface UserAnalytics {
  id: string;
  userId: string;
  actionType: AnalyticsActionType;
  metadata?: Record<string, any>;
  timestamp: Date;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export enum AnalyticsActionType {
  GENERATION_START = 'GENERATION_START',
  GENERATION_COMPLETE = 'GENERATION_COMPLETE',
  TRACK_PLAY = 'TRACK_PLAY',
  TRACK_LIKE = 'TRACK_LIKE',
  COLLABORATION_JOIN = 'COLLABORATION_JOIN',
  NFT_PURCHASE = 'NFT_PURCHASE',
  SUBSCRIPTION_UPGRADE = 'SUBSCRIPTION_UPGRADE'
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  meta?: ResponseMeta;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ResponseMeta {
  timestamp: Date;
  requestId: string;
  version: string;
  rateLimit?: RateLimitInfo;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: Date;
}

// WebSocket Types
export interface WebSocketMessage {
  type: WSMessageType;
  payload: any;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export enum WSMessageType {
  // Collaboration
  COLLABORATION_JOIN = 'COLLABORATION_JOIN',
  COLLABORATION_LEAVE = 'COLLABORATION_LEAVE',
  COLLABORATION_UPDATE = 'COLLABORATION_UPDATE',
  TRACK_UPDATE = 'TRACK_UPDATE',
  CHAT_MESSAGE = 'CHAT_MESSAGE',

  // Real-time Audio
  AUDIO_STREAM_START = 'AUDIO_STREAM_START',
  AUDIO_STREAM_DATA = 'AUDIO_STREAM_DATA',
  AUDIO_STREAM_END = 'AUDIO_STREAM_END',

  // Notifications
  NOTIFICATION = 'NOTIFICATION',
  USER_ONLINE = 'USER_ONLINE',
  USER_OFFLINE = 'USER_OFFLINE',

  // System
  PING = 'PING',
  PONG = 'PONG',
  ERROR = 'ERROR'
}

// Mobile & PWA Types
export interface OfflineQueue {
  id: string;
  type: OfflineActionType;
  payload: any;
  timestamp: Date;
  retryCount: number;
  maxRetries: number;
}

export enum OfflineActionType {
  GENERATE_MUSIC = 'GENERATE_MUSIC',
  SAVE_TRACK = 'SAVE_TRACK',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  SEND_MESSAGE = 'SEND_MESSAGE'
}

// Content Moderation Types
export interface ModerationReport {
  id: string;
  reporterId: string;
  contentType: ContentType;
  contentId: string;
  reason: ModerationReason;
  description?: string;
  status: ModerationStatus;
  moderatorId?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export enum ContentType {
  USER = 'USER',
  POST = 'POST',
  TRACK = 'TRACK',
  COLLABORATION = 'COLLABORATION',
  COMMENT = 'COMMENT'
}

export enum ModerationReason {
  SPAM = 'SPAM',
  HARASSMENT = 'HARASSMENT',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  COPYRIGHT = 'COPYRIGHT',
  HATE_SPEECH = 'HATE_SPEECH',
  OTHER = 'OTHER'
}

export enum ModerationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED'
}

// Subscription & Billing Types
export interface Subscription {
  id: string;
  userId: string;
  tier: UserTier;
  status: SubscriptionStatus;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  UNPAID = 'UNPAID',
  INCOMPLETE = 'INCOMPLETE'
}

// Search & Discovery Types
export interface SearchFilters {
  query?: string;
  genres?: string[];
  moods?: string[];
  bpm?: {
    min: number;
    max: number;
  };
  key?: string[];
  duration?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  tier?: UserTier[];
  hasStems?: boolean;
  hasMidi?: boolean;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  facets?: SearchFacets;
}

export interface SearchFacets {
  genres: Facet[];
  moods: Facet[];
  keys: Facet[];
  bpm: Facet[];
  duration: Facet[];
}

export interface Facet {
  value: string;
  count: number;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys];

// Constants
export const SUPPORTED_AUDIO_FORMATS = ['mp3', 'wav', 'flac', 'ogg', 'm4a'] as const;
export const SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'webp'] as const;
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_TRACK_DURATION = 600; // 10 minutes
export const RATE_LIMITS = {
  FREE: { requests: 10, window: 60 },
  PREMIUM: { requests: 100, window: 60 },
  ENTERPRISE: { requests: 1000, window: 60 }
} as const;
