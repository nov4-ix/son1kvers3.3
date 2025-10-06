export enum Platform {
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
  LINKEDIN = 'linkedin',
  TIKTOK = 'tiktok',
}

export enum PostStatus {
  PENDING = 'pending',
  PUBLISHED = 'published',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum HookVariant {
  CASUAL = 'casual',
  FORMAL = 'formal',
  CLICKBAIT = 'clickbait',
  QUESTION = 'question',
  STORY = 'story',
}

export interface ContentProfile {
  id: string
  user_id: string
  content_type: string
  description?: string
  platforms: Platform[]
  posting_frequency?: string
  ai_analysis?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ScheduledPost {
  id: string
  user_id: string
  profile_id?: string
  caption: string
  platform: Platform
  media_url?: string
  hashtags?: string[]
  scheduled_time: string
  status: PostStatus
  published_at?: string
  error_message?: string
  analytics?: Record<string, unknown>
  created_at: string
}

export interface HookSuggestion {
  id: string
  profile_id: string
  hook_text: string
  variant?: HookVariant
  platform?: Platform
  is_favorite: boolean
  used: boolean
  created_at: string
}
