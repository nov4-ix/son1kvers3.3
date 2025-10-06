// Nova Post Pilot Store - Store de Zustand para Nova Post Pilot del universo Son1kVerse

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  NovaPostPilotState, 
  SocialPost, 
  SocialPlatform, 
  Campaign, 
  ContentTemplate,
  MediaFile,
  AnalyticsData,
  AIContentGenerator,
  EngagementMetrics,
  PostPerformance,
  CampaignPerformance,
  TargetAudience,
  CampaignGoal,
  MediaPlaceholder,
  TemplateVariable,
  AIGeneratorSettings
} from '../types/novaPostPilot';

interface NovaPostPilotActions {
  // Post actions
  addPost: (post: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePost: (id: string, updates: Partial<SocialPost>) => void;
  deletePost: (id: string) => void;
  selectPost: (id: string | null) => void;
  publishPost: (id: string) => Promise<void>;
  schedulePost: (id: string, date: Date) => void;
  duplicatePost: (id: string) => void;
  
  // Platform actions
  addPlatform: (platform: Omit<SocialPlatform, 'id'>) => void;
  updatePlatform: (id: string, updates: Partial<SocialPlatform>) => void;
  deletePlatform: (id: string) => void;
  connectPlatform: (id: string, accountId: string, accountName: string) => void;
  disconnectPlatform: (id: string) => void;
  selectPlatforms: (platforms: SocialPlatform['name'][]) => void;
  
  // Campaign actions
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  selectCampaign: (id: string | null) => void;
  activateCampaign: (id: string) => void;
  deactivateCampaign: () => void;
  addPostToCampaign: (campaignId: string, postId: string) => void;
  removePostFromCampaign: (campaignId: string, postId: string) => void;
  
  // Template actions
  addTemplate: (template: Omit<ContentTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplate: (id: string, updates: Partial<ContentTemplate>) => void;
  deleteTemplate: (id: string) => void;
  selectTemplate: (id: string | null) => void;
  useTemplate: (id: string) => void;
  duplicateTemplate: (id: string) => void;
  
  // Media actions
  addMedia: (media: Omit<MediaFile, 'id' | 'createdAt'>) => void;
  updateMedia: (id: string, updates: Partial<MediaFile>) => void;
  deleteMedia: (id: string) => void;
  selectMedia: (ids: string[]) => void;
  uploadMedia: (files: File[]) => Promise<void>;
  
  // Analytics actions
  addAnalytics: (analytics: Omit<AnalyticsData, 'id'>) => void;
  updateAnalytics: (id: string, updates: Partial<AnalyticsData>) => void;
  deleteAnalytics: (id: string) => void;
  setAnalyticsDateRange: (start: Date, end: Date) => void;
  
  // AI Generator actions
  generateContent: (type: AIContentGenerator['type'], prompt: string, settings: AIGeneratorSettings) => Promise<void>;
  updateGenerator: (id: string, updates: Partial<AIContentGenerator>) => void;
  deleteGenerator: (id: string) => void;
  selectGenerator: (id: string | null) => void;
  
  // Calendar actions
  setCalendarView: (view: NovaPostPilotState['calendarView']) => void;
  setSelectedDate: (date: Date) => void;
  getPostsForDate: (date: Date) => SocialPost[];
  getPostsForDateRange: (start: Date, end: Date) => SocialPost[];
  
  // UI actions
  setActiveTab: (tab: NovaPostPilotState['activeTab']) => void;
  toggleSidebar: () => void;
  setTheme: (theme: NovaPostPilotState['theme']) => void;
  setLanguage: (language: NovaPostPilotState['language']) => void;
  
  // Settings actions
  updateSettings: (settings: Partial<NovaPostPilotState['settings']>) => void;
  resetSettings: () => void;
  
  // Performance actions
  updatePerformance: (performance: Partial<NovaPostPilotState['performance']>) => void;
  calculatePerformance: () => void;
  
  // Statistics actions
  updateStatistics: (statistics: Partial<NovaPostPilotState['statistics']>) => void;
  calculateStatistics: () => void;
  
  // Utility actions
  clearAllData: () => void;
  exportData: () => Promise<Blob>;
  importData: (data: Blob) => Promise<void>;
  backupData: () => Promise<void>;
  restoreData: (backup: Blob) => Promise<void>;
}

const initialState: NovaPostPilotState = {
  // Posts
  posts: [],
  selectedPost: null,
  draftPost: {},
  
  // Platforms
  platforms: [],
  selectedPlatforms: [],
  
  // Campaigns
  campaigns: [],
  selectedCampaign: null,
  activeCampaign: null,
  
  // Templates
  templates: [],
  selectedTemplate: null,
  
  // Media
  mediaLibrary: [],
  selectedMedia: [],
  
  // Analytics
  analytics: [],
  analyticsDateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  },
  
  // AI Generator
  aiGenerators: [],
  activeGenerator: null,
  
  // Calendar
  calendarView: 'month',
  selectedDate: new Date(),
  calendarPosts: [],
  
  // UI State
  activeTab: 'calendar',
  sidebarOpen: true,
  theme: 'dark',
  language: 'es',
  
  // Settings
  settings: {
    autoPost: true,
    optimalPosting: true,
    aiContentGeneration: true,
    hashtagOptimization: true,
    engagementTracking: true,
    competitorAnalysis: true,
    sentimentAnalysis: true,
    performancePrediction: true,
    notifications: true,
    emailReports: true,
    slackIntegration: false,
    discordIntegration: false,
    apiKeys: {},
    defaultPlatforms: ['instagram', 'twitter'],
    defaultHashtags: ['#son1kverse', '#cyberpunk', '#ai'],
    defaultMentions: [],
    postingSchedule: [],
    contentApproval: false,
    approvalWorkflow: [],
    brandGuidelines: '',
    contentPolicy: '',
    aiSettings: {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1000,
      topP: 0.9,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
      stopSequences: [],
    },
    analyticsSettings: {
      trackEngagement: true,
      trackConversions: true,
      trackRevenue: false,
      trackTraffic: true,
      customEvents: [],
    },
    performanceSettings: {
      benchmarkReach: 1000,
      benchmarkEngagement: 5.0,
      benchmarkConversion: 2.0,
      alertThresholds: {
        lowEngagement: 2.0,
        highEngagement: 10.0,
        lowReach: 500,
        highReach: 5000,
      },
    },
  },
  
  // Performance
  performance: {
    totalPosts: 0,
    totalReach: 0,
    totalEngagement: 0,
    totalConversions: 0,
    averageEngagementRate: 0,
    averageReach: 0,
    trendingHashtags: [],
    trendingTopics: [],
    competitorInsights: {},
    lastUpdated: new Date(),
  },
  
  // Statistics
  statistics: {
    totalPosts: 0,
    totalCampaigns: 0,
    totalTemplates: 0,
    totalMedia: 0,
    totalPlatforms: 0,
    totalReach: 0,
    totalEngagement: 0,
    totalConversions: 0,
    averageEngagementRate: 0,
    averageReach: 0,
    averageConversionRate: 0,
    trendingHashtags: [],
    trendingTopics: [],
    competitorInsights: {},
    lastActivity: new Date(),
    uptime: 0,
  },
};

export const useNovaStore = create<NovaPostPilotState & NovaPostPilotActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Post actions
        addPost: (post) => {
          const newPost: SocialPost = {
            ...post,
            id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            engagement: {
              likes: 0,
              comments: 0,
              shares: 0,
              saves: 0,
              views: 0,
              clicks: 0,
              reach: 0,
              impressions: 0,
              engagementRate: 0,
              clickThroughRate: 0,
              saveRate: 0,
              shareRate: 0,
              lastUpdated: new Date(),
            },
            performance: {
              score: 0,
              virality: 0,
              reach: 0,
              engagement: 0,
              conversion: 0,
              sentiment: 'neutral',
              trending: false,
              declineRate: 0,
              longevity: 0,
              audienceReach: 0,
              brandAlignment: 0,
              competitorComparison: 0,
            },
          };
          
          set((state) => ({
            posts: [...state.posts, newPost],
            statistics: {
              ...state.statistics,
              totalPosts: state.posts.length + 1,
              lastActivity: new Date(),
            },
          }));
        },
        
        updatePost: (id, updates) => {
          set((state) => ({
            posts: state.posts.map((post) =>
              post.id === id
                ? { ...post, ...updates, updatedAt: new Date() }
                : post
            ),
            selectedPost: state.selectedPost?.id === id 
              ? { ...state.selectedPost, ...updates, updatedAt: new Date() }
              : state.selectedPost,
            statistics: {
              ...state.statistics,
              lastActivity: new Date(),
            },
          }));
        },
        
        deletePost: (id) => {
          set((state) => ({
            posts: state.posts.filter((post) => post.id !== id),
            selectedPost: state.selectedPost?.id === id ? null : state.selectedPost,
            statistics: {
              ...state.statistics,
              totalPosts: Math.max(0, state.posts.length - 1),
              lastActivity: new Date(),
            },
          }));
        },
        
        selectPost: (id) => {
          const post = id ? get().posts.find((p) => p.id === id) : null;
          set({ selectedPost: post });
        },
        
        publishPost: async (id) => {
          const post = get().posts.find((p) => p.id === id);
          if (!post) throw new Error('Post not found');
          
          // Simulate publishing
          await new Promise((resolve) => setTimeout(resolve, 2000));
          
          get().updatePost(id, {
            status: 'published',
            publishedAt: new Date(),
          });
        },
        
        schedulePost: (id, date) => {
          get().updatePost(id, {
            scheduledDate: date,
            status: 'scheduled',
          });
        },
        
        duplicatePost: (id) => {
          const post = get().posts.find((p) => p.id === id);
          if (!post) return;
          
          const duplicatedPost = {
            ...post,
            title: `${post.title} (Copy)`,
            status: 'draft' as const,
            scheduledDate: new Date(),
            publishedAt: undefined,
          };
          
          get().addPost(duplicatedPost);
        },
        
        // Platform actions
        addPlatform: (platform) => {
          const newPlatform: SocialPlatform = {
            ...platform,
            id: `platform_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          };
          
          set((state) => ({
            platforms: [...state.platforms, newPlatform],
            statistics: {
              ...state.statistics,
              totalPlatforms: state.platforms.length + 1,
              lastActivity: new Date(),
            },
          }));
        },
        
        updatePlatform: (id, updates) => {
          set((state) => ({
            platforms: state.platforms.map((platform) =>
              platform.id === id ? { ...platform, ...updates } : platform
            ),
            statistics: {
              ...state.statistics,
              lastActivity: new Date(),
            },
          }));
        },
        
        deletePlatform: (id) => {
          set((state) => ({
            platforms: state.platforms.filter((platform) => platform.id !== id),
            statistics: {
              ...state.statistics,
              totalPlatforms: Math.max(0, state.platforms.length - 1),
              lastActivity: new Date(),
            },
          }));
        },
        
        connectPlatform: (id, accountId, accountName) => {
          get().updatePlatform(id, {
            connected: true,
            accountId,
            accountName,
            lastSync: new Date(),
          });
        },
        
        disconnectPlatform: (id) => {
          get().updatePlatform(id, {
            connected: false,
            accountId: undefined,
            accountName: undefined,
            lastSync: undefined,
          });
        },
        
        selectPlatforms: (platforms) => {
          set({ selectedPlatforms: platforms });
        },
        
        // Campaign actions
        addCampaign: (campaign) => {
          const newCampaign: Campaign = {
            ...campaign,
            id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            performance: {
              totalReach: 0,
              totalEngagement: 0,
              totalConversions: 0,
              totalSpend: 0,
              costPerReach: 0,
              costPerEngagement: 0,
              costPerConversion: 0,
              returnOnInvestment: 0,
              clickThroughRate: 0,
              conversionRate: 0,
              engagementRate: 0,
              reachRate: 0,
              impressions: 0,
              clicks: 0,
              shares: 0,
              saves: 0,
              comments: 0,
              likes: 0,
              goalsAchieved: 0,
              goalsTotal: campaign.goals.length,
              lastUpdated: new Date(),
            },
          };
          
          set((state) => ({
            campaigns: [...state.campaigns, newCampaign],
            statistics: {
              ...state.statistics,
              totalCampaigns: state.campaigns.length + 1,
              lastActivity: new Date(),
            },
          }));
        },
        
        updateCampaign: (id, updates) => {
          set((state) => ({
            campaigns: state.campaigns.map((campaign) =>
              campaign.id === id
                ? { ...campaign, ...updates, updatedAt: new Date() }
                : campaign
            ),
            selectedCampaign: state.selectedCampaign?.id === id 
              ? { ...state.selectedCampaign, ...updates, updatedAt: new Date() }
              : state.selectedCampaign,
            activeCampaign: state.activeCampaign?.id === id 
              ? { ...state.activeCampaign, ...updates, updatedAt: new Date() }
              : state.activeCampaign,
            statistics: {
              ...state.statistics,
              lastActivity: new Date(),
            },
          }));
        },
        
        deleteCampaign: (id) => {
          set((state) => ({
            campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
            selectedCampaign: state.selectedCampaign?.id === id ? null : state.selectedCampaign,
            activeCampaign: state.activeCampaign?.id === id ? null : state.activeCampaign,
            statistics: {
              ...state.statistics,
              totalCampaigns: Math.max(0, state.campaigns.length - 1),
              lastActivity: new Date(),
            },
          }));
        },
        
        selectCampaign: (id) => {
          const campaign = id ? get().campaigns.find((c) => c.id === id) : null;
          set({ selectedCampaign: campaign });
        },
        
        activateCampaign: (id) => {
          const campaign = get().campaigns.find((c) => c.id === id);
          if (campaign) {
            set({ activeCampaign: campaign });
            get().updateCampaign(id, { status: 'active' });
          }
        },
        
        deactivateCampaign: () => {
          set({ activeCampaign: null });
        },
        
        addPostToCampaign: (campaignId, postId) => {
          get().updateCampaign(campaignId, {
            posts: [...(get().campaigns.find(c => c.id === campaignId)?.posts || []), postId],
          });
        },
        
        removePostFromCampaign: (campaignId, postId) => {
          get().updateCampaign(campaignId, {
            posts: (get().campaigns.find(c => c.id === campaignId)?.posts || []).filter(id => id !== postId),
          });
        },
        
        // Template actions
        addTemplate: (template) => {
          const newTemplate: ContentTemplate = {
            ...template,
            id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          set((state) => ({
            templates: [...state.templates, newTemplate],
            statistics: {
              ...state.statistics,
              totalTemplates: state.templates.length + 1,
              lastActivity: new Date(),
            },
          }));
        },
        
        updateTemplate: (id, updates) => {
          set((state) => ({
            templates: state.templates.map((template) =>
              template.id === id
                ? { ...template, ...updates, updatedAt: new Date() }
                : template
            ),
            selectedTemplate: state.selectedTemplate?.id === id 
              ? { ...state.selectedTemplate, ...updates, updatedAt: new Date() }
              : state.selectedTemplate,
            statistics: {
              ...state.statistics,
              lastActivity: new Date(),
            },
          }));
        },
        
        deleteTemplate: (id) => {
          set((state) => ({
            templates: state.templates.filter((template) => template.id !== id),
            selectedTemplate: state.selectedTemplate?.id === id ? null : state.selectedTemplate,
            statistics: {
              ...state.statistics,
              totalTemplates: Math.max(0, state.templates.length - 1),
              lastActivity: new Date(),
            },
          }));
        },
        
        selectTemplate: (id) => {
          const template = id ? get().templates.find((t) => t.id === id) : null;
          set({ selectedTemplate: template });
        },
        
        useTemplate: (id) => {
          const template = get().templates.find((t) => t.id === id);
          if (!template) return;
          
          get().updateTemplate(id, { usage: template.usage + 1 });
          
          // Create post from template
          const post: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'> = {
            title: template.name,
            content: template.content,
            platforms: template.platforms.map(name => 
              get().platforms.find(p => p.name === name) || 
              { id: '', name, displayName: name, icon: '📱', color: '#000000', enabled: true, connected: false, settings: {} as any }
            ),
            scheduledDate: new Date(),
            status: 'draft',
            type: template.type,
            hashtags: template.hashtags,
            mentions: template.mentions,
            engagement: {
              likes: 0,
              comments: 0,
              shares: 0,
              saves: 0,
              views: 0,
              clicks: 0,
              reach: 0,
              impressions: 0,
              engagementRate: 0,
              clickThroughRate: 0,
              saveRate: 0,
              shareRate: 0,
              lastUpdated: new Date(),
            },
            performance: {
              score: 0,
              virality: 0,
              reach: 0,
              engagement: 0,
              conversion: 0,
              sentiment: 'neutral',
              trending: false,
              declineRate: 0,
              longevity: 0,
              audienceReach: 0,
              brandAlignment: 0,
              competitorComparison: 0,
            },
            author: 'User',
            tags: template.tags,
            aiGenerated: template.aiGenerated,
            aiPrompt: template.aiPrompt,
            quality: 'high',
          };
          
          get().addPost(post);
        },
        
        duplicateTemplate: (id) => {
          const template = get().templates.find((t) => t.id === id);
          if (!template) return;
          
          const duplicatedTemplate = {
            ...template,
            name: `${template.name} (Copy)`,
            usage: 0,
          };
          
          get().addTemplate(duplicatedTemplate);
        },
        
        // Media actions
        addMedia: (media) => {
          const newMedia: MediaFile = {
            ...media,
            id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
          };
          
          set((state) => ({
            mediaLibrary: [...state.mediaLibrary, newMedia],
            statistics: {
              ...state.statistics,
              totalMedia: state.mediaLibrary.length + 1,
              lastActivity: new Date(),
            },
          }));
        },
        
        updateMedia: (id, updates) => {
          set((state) => ({
            mediaLibrary: state.mediaLibrary.map((media) =>
              media.id === id ? { ...media, ...updates } : media
            ),
            statistics: {
              ...state.statistics,
              lastActivity: new Date(),
            },
          }));
        },
        
        deleteMedia: (id) => {
          set((state) => ({
            mediaLibrary: state.mediaLibrary.filter((media) => media.id !== id),
            selectedMedia: state.selectedMedia.filter((media) => media.id !== id),
            statistics: {
              ...state.statistics,
              totalMedia: Math.max(0, state.mediaLibrary.length - 1),
              lastActivity: new Date(),
            },
          }));
        },
        
        selectMedia: (ids) => {
          const media = get().mediaLibrary.filter((m) => ids.includes(m.id));
          set({ selectedMedia: media });
        },
        
        uploadMedia: async (files) => {
          for (const file of files) {
            const media: Omit<MediaFile, 'id' | 'createdAt'> = {
              type: file.type.startsWith('image/') ? 'image' : 
                    file.type.startsWith('video/') ? 'video' : 
                    file.type.startsWith('audio/') ? 'audio' : 'image',
              url: URL.createObjectURL(file),
              filename: file.name,
              size: file.size,
              format: file.type,
              quality: 'high',
              tags: [],
              aiGenerated: false,
            };
            
            get().addMedia(media);
          }
        },
        
        // Analytics actions
        addAnalytics: (analytics) => {
          const newAnalytics: AnalyticsData = {
            ...analytics,
            id: `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          };
          
          set((state) => ({
            analytics: [...state.analytics, newAnalytics],
            statistics: {
              ...state.statistics,
              lastActivity: new Date(),
            },
          }));
        },
        
        updateAnalytics: (id, updates) => {
          set((state) => ({
            analytics: state.analytics.map((analytics) =>
              analytics.id === id ? { ...analytics, ...updates } : analytics
            ),
            statistics: {
              ...state.statistics,
              lastActivity: new Date(),
            },
          }));
        },
        
        deleteAnalytics: (id) => {
          set((state) => ({
            analytics: state.analytics.filter((analytics) => analytics.id !== id),
            statistics: {
              ...state.statistics,
              lastActivity: new Date(),
            },
          }));
        },
        
        setAnalyticsDateRange: (start, end) => {
          set({ analyticsDateRange: { start, end } });
        },
        
        // AI Generator actions
        generateContent: async (type, prompt, settings) => {
          const generator: Omit<AIContentGenerator, 'id'> = {
            name: `AI Generated ${type}`,
            type,
            prompt,
            settings,
            output: '',
            quality: 'high',
            processingTime: 0,
            tokensUsed: 0,
            cost: 0,
            createdAt: new Date(),
            status: 'processing',
          };
          
          // Simulate AI generation
          const startTime = Date.now();
          
          try {
            // Simulate processing time
            await new Promise((resolve) => setTimeout(resolve, 2000));
            
            const processingTime = Date.now() - startTime;
            const output = `Generated ${type} content: ${prompt}`;
            
            get().addAIGenerator({
              ...generator,
              output,
              processingTime,
              tokensUsed: Math.floor(Math.random() * 1000) + 100,
              cost: Math.random() * 0.1,
              status: 'completed',
            });
          } catch (error) {
            get().addAIGenerator({
              ...generator,
              status: 'failed',
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        },
        
        updateGenerator: (id, updates) => {
          set((state) => ({
            aiGenerators: state.aiGenerators.map((generator) =>
              generator.id === id ? { ...generator, ...updates } : generator
            ),
            activeGenerator: state.activeGenerator?.id === id 
              ? { ...state.activeGenerator, ...updates }
              : state.activeGenerator,
            statistics: {
              ...state.statistics,
              lastActivity: new Date(),
            },
          }));
        },
        
        deleteGenerator: (id) => {
          set((state) => ({
            aiGenerators: state.aiGenerators.filter((generator) => generator.id !== id),
            activeGenerator: state.activeGenerator?.id === id ? null : state.activeGenerator,
            statistics: {
              ...state.statistics,
              lastActivity: new Date(),
            },
          }));
        },
        
        selectGenerator: (id) => {
          const generator = id ? get().aiGenerators.find((g) => g.id === id) : null;
          set({ activeGenerator: generator });
        },
        
        // Calendar actions
        setCalendarView: (view) => {
          set({ calendarView: view });
        },
        
        setSelectedDate: (date) => {
          set({ selectedDate: date });
        },
        
        getPostsForDate: (date) => {
          return get().posts.filter((post) => {
            const postDate = new Date(post.scheduledDate);
            return postDate.toDateString() === date.toDateString();
          });
        },
        
        getPostsForDateRange: (start, end) => {
          return get().posts.filter((post) => {
            const postDate = new Date(post.scheduledDate);
            return postDate >= start && postDate <= end;
          });
        },
        
        // UI actions
        setActiveTab: (tab) => set({ activeTab: tab }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setTheme: (theme) => set({ theme }),
        setLanguage: (language) => set({ language }),
        
        // Settings actions
        updateSettings: (settings) => {
          set((state) => ({
            settings: { ...state.settings, ...settings },
          }));
        },
        
        resetSettings: () => {
          set({ settings: initialState.settings });
        },
        
        // Performance actions
        updatePerformance: (performance) => {
          set((state) => ({
            performance: { ...state.performance, ...performance },
          }));
        },
        
        calculatePerformance: () => {
          const { posts, campaigns } = get();
          
          const totalReach = posts.reduce((sum, post) => sum + post.engagement.reach, 0);
          const totalEngagement = posts.reduce((sum, post) => sum + post.engagement.likes + post.engagement.comments + post.engagement.shares, 0);
          const totalConversions = posts.reduce((sum, post) => sum + post.engagement.clicks, 0);
          const averageEngagementRate = posts.length > 0 ? totalEngagement / posts.length : 0;
          const averageReach = posts.length > 0 ? totalReach / posts.length : 0;
          
          get().updatePerformance({
            totalPosts: posts.length,
            totalReach,
            totalEngagement,
            totalConversions,
            averageEngagementRate,
            averageReach,
            lastUpdated: new Date(),
          });
        },
        
        // Statistics actions
        updateStatistics: (statistics) => {
          set((state) => ({
            statistics: { ...state.statistics, ...statistics },
          }));
        },
        
        calculateStatistics: () => {
          const { posts, campaigns, templates, mediaLibrary, platforms } = get();
          
          const totalReach = posts.reduce((sum, post) => sum + post.engagement.reach, 0);
          const totalEngagement = posts.reduce((sum, post) => sum + post.engagement.likes + post.engagement.comments + post.engagement.shares, 0);
          const totalConversions = posts.reduce((sum, post) => sum + post.engagement.clicks, 0);
          const averageEngagementRate = posts.length > 0 ? totalEngagement / posts.length : 0;
          const averageReach = posts.length > 0 ? totalReach / posts.length : 0;
          const averageConversionRate = posts.length > 0 ? totalConversions / posts.length : 0;
          
          get().updateStatistics({
            totalPosts: posts.length,
            totalCampaigns: campaigns.length,
            totalTemplates: templates.length,
            totalMedia: mediaLibrary.length,
            totalPlatforms: platforms.length,
            totalReach,
            totalEngagement,
            totalConversions,
            averageEngagementRate,
            averageReach,
            averageConversionRate,
            lastActivity: new Date(),
          });
        },
        
        // Utility actions
        clearAllData: () => {
          set({
            posts: [],
            campaigns: [],
            templates: [],
            mediaLibrary: [],
            analytics: [],
            aiGenerators: [],
            selectedPost: null,
            selectedCampaign: null,
            selectedTemplate: null,
            selectedMedia: [],
            activeGenerator: null,
            statistics: initialState.statistics,
          });
        },
        
        exportData: async () => {
          const state = get();
          const data = {
            posts: state.posts,
            campaigns: state.campaigns,
            templates: state.templates,
            mediaLibrary: state.mediaLibrary,
            analytics: state.analytics,
            aiGenerators: state.aiGenerators,
            settings: state.settings,
            statistics: state.statistics,
            exportDate: new Date(),
            version: '1.0.0',
          };
          
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json',
          });
          
          return blob;
        },
        
        importData: async (data) => {
          const text = await data.text();
          const importedData = JSON.parse(text);
          
          set({
            posts: importedData.posts || [],
            campaigns: importedData.campaigns || [],
            templates: importedData.templates || [],
            mediaLibrary: importedData.mediaLibrary || [],
            analytics: importedData.analytics || [],
            aiGenerators: importedData.aiGenerators || [],
            settings: importedData.settings || initialState.settings,
            statistics: importedData.statistics || initialState.statistics,
          });
        },
        
        backupData: async () => {
          const data = await get().exportData();
          const backup = new Blob([data], { type: 'application/json' });
          
          // In a real app, this would save to cloud storage
          console.log('Backup created:', backup);
        },
        
        restoreData: async (backup) => {
          await get().importData(backup);
        },
      }),
      {
        name: 'nova-post-pilot-store',
        partialize: (state) => ({
          posts: state.posts,
          campaigns: state.campaigns,
          templates: state.templates,
          mediaLibrary: state.mediaLibrary,
          settings: state.settings,
          statistics: state.statistics,
          theme: state.theme,
          language: state.language,
        }),
      }
    ),
    {
      name: 'nova-post-pilot-store',
    }
  )
);