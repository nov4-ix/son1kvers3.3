// Nova Post Pilot Types - Tipos para Nova Post Pilot del universo Son1kVerse

export interface SocialPost {
  id: string;
  title: string;
  content: string;
  platforms: SocialPlatform[];
  scheduledDate: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  type: 'text' | 'image' | 'video' | 'carousel' | 'story' | 'reel';
  media?: MediaFile[];
  hashtags: string[];
  mentions: string[];
  location?: string;
  engagement: EngagementMetrics;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  author: string;
  campaign?: string;
  tags: string[];
  aiGenerated: boolean;
  aiPrompt?: string;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  performance: PostPerformance;
}

export interface SocialPlatform {
  id: string;
  name: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube' | 'pinterest';
  displayName: string;
  icon: string;
  color: string;
  enabled: boolean;
  connected: boolean;
  accountId?: string;
  accountName?: string;
  followers?: number;
  engagement?: number;
  lastSync?: Date;
  settings: PlatformSettings;
}

export interface PlatformSettings {
  autoPost: boolean;
  optimalTimes: OptimalTime[];
  hashtagLimit: number;
  characterLimit: number;
  imageSize: 'square' | 'landscape' | 'portrait' | 'story';
  videoLength: number;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  captions: boolean;
  altText: boolean;
  location: boolean;
  mentions: boolean;
  hashtags: boolean;
  customSettings?: Record<string, any>;
}

export interface OptimalTime {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  time: string; // HH:MM format
  engagement: number; // 0-100
}

export interface MediaFile {
  id: string;
  type: 'image' | 'video' | 'audio' | 'gif';
  url: string;
  thumbnail?: string;
  filename: string;
  size: number;
  duration?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  format: string;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  altText?: string;
  caption?: string;
  tags: string[];
  aiGenerated: boolean;
  aiPrompt?: string;
  createdAt: Date;
}

export interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  views: number;
  clicks: number;
  reach: number;
  impressions: number;
  engagementRate: number;
  clickThroughRate: number;
  saveRate: number;
  shareRate: number;
  lastUpdated: Date;
}

export interface PostPerformance {
  score: number; // 0-100
  virality: number; // 0-100
  reach: number; // 0-100
  engagement: number; // 0-100
  conversion: number; // 0-100
  sentiment: 'positive' | 'neutral' | 'negative';
  trending: boolean;
  peakTime?: Date;
  declineRate: number;
  longevity: number; // 0-100
  audienceReach: number; // 0-100
  brandAlignment: number; // 0-100
  competitorComparison: number; // 0-100
  customMetrics?: Record<string, number>;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  budget?: number;
  currency?: string;
  targetAudience: TargetAudience;
  goals: CampaignGoal[];
  posts: string[]; // Post IDs
  performance: CampaignPerformance;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  tags: string[];
  color: string;
  icon: string;
}

export interface TargetAudience {
  ageRange: {
    min: number;
    max: number;
  };
  genders: ('male' | 'female' | 'non-binary' | 'other')[];
  locations: string[];
  interests: string[];
  languages: string[];
  behaviors: string[];
  demographics: Record<string, any>;
  customAudience?: string;
}

export interface CampaignGoal {
  id: string;
  type: 'reach' | 'engagement' | 'conversion' | 'awareness' | 'traffic' | 'leads' | 'sales';
  target: number;
  current: number;
  unit: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline?: Date;
  achieved: boolean;
  description: string;
}

export interface CampaignPerformance {
  totalReach: number;
  totalEngagement: number;
  totalConversions: number;
  totalSpend: number;
  costPerReach: number;
  costPerEngagement: number;
  costPerConversion: number;
  returnOnInvestment: number;
  clickThroughRate: number;
  conversionRate: number;
  engagementRate: number;
  reachRate: number;
  impressions: number;
  clicks: number;
  shares: number;
  saves: number;
  comments: number;
  likes: number;
  goalsAchieved: number;
  goalsTotal: number;
  lastUpdated: Date;
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  type: 'post' | 'story' | 'reel' | 'carousel' | 'video';
  platforms: SocialPlatform['name'][];
  content: string;
  mediaPlaceholders: MediaPlaceholder[];
  hashtags: string[];
  mentions: string[];
  variables: TemplateVariable[];
  category: string;
  tags: string[];
  usage: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  aiGenerated: boolean;
  aiPrompt?: string;
}

export interface MediaPlaceholder {
  id: string;
  type: 'image' | 'video' | 'audio';
  position: number;
  description: string;
  required: boolean;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number;
  format?: string;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
}

export interface TemplateVariable {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'url' | 'hashtag' | 'mention' | 'location';
  required: boolean;
  defaultValue?: string;
  options?: string[];
  description: string;
  placeholder: string;
}

export interface AnalyticsData {
  id: string;
  platform: SocialPlatform['name'];
  date: Date;
  metrics: {
    followers: number;
    following: number;
    posts: number;
    reach: number;
    impressions: number;
    engagement: number;
    clicks: number;
    saves: number;
    shares: number;
    comments: number;
    likes: number;
    profileViews: number;
    websiteClicks: number;
    emailClicks: number;
    phoneClicks: number;
    addressClicks: number;
    hashtagClicks: number;
    mentionClicks: number;
    linkClicks: number;
    videoViews: number;
    videoCompletionRate: number;
    storyViews: number;
    storyCompletionRate: number;
    reelViews: number;
    reelCompletionRate: number;
    liveViews: number;
    liveDuration: number;
    customMetrics?: Record<string, number>;
  };
  demographics: {
    ageGroups: Record<string, number>;
    genders: Record<string, number>;
    locations: Record<string, number>;
    languages: Record<string, number>;
    interests: Record<string, number>;
    behaviors: Record<string, number>;
  };
  competitors: Record<string, {
    followers: number;
    engagement: number;
    posts: number;
    reach: number;
  }>;
  trends: {
    hashtags: Array<{ tag: string; count: number; trend: 'up' | 'down' | 'stable' }>;
    topics: Array<{ topic: string; count: number; trend: 'up' | 'down' | 'stable' }>;
    keywords: Array<{ keyword: string; count: number; trend: 'up' | 'down' | 'stable' }>;
  };
}

export interface AIContentGenerator {
  id: string;
  name: string;
  type: 'text' | 'image' | 'video' | 'hashtag' | 'caption' | 'story';
  prompt: string;
  settings: AIGeneratorSettings;
  output: string;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  processingTime: number;
  tokensUsed: number;
  cost: number;
  createdAt: Date;
  status: 'processing' | 'completed' | 'failed';
  error?: string;
}

export interface AIGeneratorSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences: string[];
  customSettings?: Record<string, any>;
}

export interface NovaPostPilotState {
  // Posts
  posts: SocialPost[];
  selectedPost: SocialPost | null;
  draftPost: Partial<SocialPost>;
  
  // Platforms
  platforms: SocialPlatform[];
  selectedPlatforms: SocialPlatform['name'][];
  
  // Campaigns
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  activeCampaign: Campaign | null;
  
  // Templates
  templates: ContentTemplate[];
  selectedTemplate: ContentTemplate | null;
  
  // Media
  mediaLibrary: MediaFile[];
  selectedMedia: MediaFile[];
  
  // Analytics
  analytics: AnalyticsData[];
  analyticsDateRange: {
    start: Date;
    end: Date;
  };
  
  // AI Generator
  aiGenerators: AIContentGenerator[];
  activeGenerator: AIContentGenerator | null;
  
  // Calendar
  calendarView: 'month' | 'week' | 'day';
  selectedDate: Date;
  calendarPosts: SocialPost[];
  
  // UI State
  activeTab: 'calendar' | 'posts' | 'campaigns' | 'templates' | 'analytics' | 'ai' | 'media';
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  language: 'es' | 'en';
  
  // Settings
  settings: {
    autoPost: boolean;
    optimalPosting: boolean;
    aiContentGeneration: boolean;
    hashtagOptimization: boolean;
    engagementTracking: boolean;
    competitorAnalysis: boolean;
    sentimentAnalysis: boolean;
    performancePrediction: boolean;
    notifications: boolean;
    emailReports: boolean;
    slackIntegration: boolean;
    discordIntegration: boolean;
    webhookUrl?: string;
    apiKeys: Record<string, string>;
    defaultPlatforms: SocialPlatform['name'][];
    defaultHashtags: string[];
    defaultMentions: string[];
    postingSchedule: OptimalTime[];
    contentApproval: boolean;
    approvalWorkflow: string[];
    brandGuidelines: string;
    contentPolicy: string;
    aiSettings: AIGeneratorSettings;
    analyticsSettings: {
      trackEngagement: boolean;
      trackConversions: boolean;
      trackRevenue: boolean;
      trackTraffic: boolean;
      customEvents: string[];
    };
    performanceSettings: {
      benchmarkReach: number;
      benchmarkEngagement: number;
      benchmarkConversion: number;
      alertThresholds: Record<string, number>;
    };
  };
  
  // Performance
  performance: {
    totalPosts: number;
    totalReach: number;
    totalEngagement: number;
    totalConversions: number;
    averageEngagementRate: number;
    averageReach: number;
    topPerformingPost?: SocialPost;
    topPerformingCampaign?: Campaign;
    trendingHashtags: string[];
    trendingTopics: string[];
    competitorInsights: Record<string, any>;
    lastUpdated: Date;
  };
  
  // Statistics
  statistics: {
    totalPosts: number;
    totalCampaigns: number;
    totalTemplates: number;
    totalMedia: number;
    totalPlatforms: number;
    totalReach: number;
    totalEngagement: number;
    totalConversions: number;
    averageEngagementRate: number;
    averageReach: number;
    averageConversionRate: number;
    topPerformingPost?: SocialPost;
    topPerformingCampaign?: Campaign;
    mostUsedTemplate?: ContentTemplate;
    mostEngagedPlatform?: SocialPlatform['name'];
    bestPostingTime?: OptimalTime;
    trendingHashtags: string[];
    trendingTopics: string[];
    competitorInsights: Record<string, any>;
    lastActivity: Date;
    uptime: number;
  };
}

// Export types
export type PostStatus = SocialPost['status'];
export type PostType = SocialPost['type'];
export type PlatformName = SocialPlatform['name'];
export type CampaignStatus = Campaign['status'];
export type GoalType = CampaignGoal['type'];
export type TemplateType = ContentTemplate['type'];
export type MediaType = MediaFile['type'];
export type AIGeneratorType = AIContentGenerator['type'];
export type CalendarView = NovaPostPilotState['calendarView'];
export type Tab = NovaPostPilotState['activeTab'];
export type Theme = NovaPostPilotState['theme'];
export type Language = NovaPostPilotState['language'];
export type Quality = SocialPost['quality'];
export type Sentiment = PostPerformance['sentiment'];
export type DayOfWeek = OptimalTime['day'];
export type VariableType = TemplateVariable['type'];
export type MediaPlaceholderType = MediaPlaceholder['type'];
export type Priority = CampaignGoal['priority'];
export type AIGeneratorStatus = AIContentGenerator['status'];
export type Trend = 'up' | 'down' | 'stable';
export type Gender = TargetAudience['genders'][0];
export type AgeRange = TargetAudience['ageRange'];
export type Demographics = TargetAudience['demographics'];
export type CustomMetrics = Record<string, number>;
export type CustomSettings = Record<string, any>;
export type APIKeys = Record<string, string>;
export type ApprovalWorkflow = string[];
export type BrandGuidelines = string;
export type ContentPolicy = string;
export type CustomEvents = string[];
export type AlertThresholds = Record<string, number>;
export type CompetitorInsights = Record<string, any>;
export type TrendingData = Array<{ tag: string; count: number; trend: Trend }>;
export type DemographicsData = Record<string, number>;
export type CompetitorData = Record<string, {
  followers: number;
  engagement: number;
  posts: number;
  reach: number;
}>;
export type AnalyticsMetrics = AnalyticsData['metrics'];
export type AnalyticsDemographics = AnalyticsData['demographics'];
export type AnalyticsCompetitors = AnalyticsData['competitors'];
export type AnalyticsTrends = AnalyticsData['trends'];
export type PerformanceMetrics = NovaPostPilotState['performance'];
export type Statistics = NovaPostPilotState['statistics'];
export type Settings = NovaPostPilotState['settings'];
export type AISettings = NovaPostPilotState['settings']['aiSettings'];
export type AnalyticsSettings = NovaPostPilotState['settings']['analyticsSettings'];
export type PerformanceSettings = NovaPostPilotState['settings']['performanceSettings'];
export type DateRange = NovaPostPilotState['analyticsDateRange'];
export type SelectedPlatforms = NovaPostPilotState['selectedPlatforms'];
export type SelectedMedia = NovaPostPilotState['selectedMedia'];
export type CalendarPosts = NovaPostPilotState['calendarPosts'];
export type MediaLibrary = NovaPostPilotState['mediaLibrary'];
export type AIGenerators = NovaPostPilotState['aiGenerators'];
export type ActiveGenerator = NovaPostPilotState['activeGenerator'];
export type SelectedTemplate = NovaPostPilotState['selectedTemplate'];
export type SelectedCampaign = NovaPostPilotState['selectedCampaign'];
export type ActiveCampaign = NovaPostPilotState['activeCampaign'];
export type SelectedPost = NovaPostPilotState['selectedPost'];
export type DraftPost = NovaPostPilotState['draftPost'];
export type Posts = NovaPostPilotState['posts'];
export type Platforms = NovaPostPilotState['platforms'];
export type Campaigns = NovaPostPilotState['campaigns'];
export type Templates = NovaPostPilotState['templates'];
export type Analytics = NovaPostPilotState['analytics'];
export type CalendarView = NovaPostPilotState['calendarView'];
export type SelectedDate = NovaPostPilotState['selectedDate'];
export type ActiveTab = NovaPostPilotState['activeTab'];
export type SidebarOpen = NovaPostPilotState['sidebarOpen'];
export type Theme = NovaPostPilotState['theme'];
export type Language = NovaPostPilotState['language'];