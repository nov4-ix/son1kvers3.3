export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      content_profiles: {
        Row: {
          id: string
          user_id: string
          content_type: string
          description: string | null
          platforms: string[]
          posting_frequency: string | null
          ai_analysis: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_type: string
          description?: string | null
          platforms: string[]
          posting_frequency?: string | null
          ai_analysis?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_type?: string
          description?: string | null
          platforms?: string[]
          posting_frequency?: string | null
          ai_analysis?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      scheduled_posts: {
        Row: {
          id: string
          user_id: string
          profile_id: string | null
          title: string
          caption: string
          platform: string
          network: string
          media_url: string | null
          hashtags: string[] | null
          scheduled_time: string
          status: string
          published_at: string | null
          error_message: string | null
          analytics: Json | null
          ai_suggestion: string | null
          retry_count: number
          max_retries: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          profile_id?: string | null
          title: string
          caption: string
          platform: string
          network?: string
          media_url?: string | null
          hashtags?: string[] | null
          scheduled_time: string
          status?: string
          published_at?: string | null
          error_message?: string | null
          analytics?: Json | null
          ai_suggestion?: string | null
          retry_count?: number
          max_retries?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          profile_id?: string | null
          title?: string
          caption?: string
          platform?: string
          network?: string
          media_url?: string | null
          hashtags?: string[] | null
          scheduled_time?: string
          status?: string
          published_at?: string | null
          error_message?: string | null
          analytics?: Json | null
          ai_suggestion?: string | null
          retry_count?: number
          max_retries?: number
          created_at?: string
        }
      }
      hook_suggestions: {
        Row: {
          id: string
          profile_id: string
          hook_text: string
          variant: string | null
          platform: string | null
          is_favorite: boolean
          used: boolean
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          hook_text: string
          variant?: string | null
          platform?: string | null
          is_favorite?: boolean
          used?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          hook_text?: string
          variant?: string | null
          platform?: string | null
          is_favorite?: boolean
          used?: boolean
          created_at?: string
        }
      }
        user_integrations: {
          Row: {
            id: string
            user_id: string
            provider: string
            access_token: string
            refresh_token: string | null
            expires_at: string | null
            scope: string[] | null
            metadata: Json | null
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            user_id: string
            provider: string
            access_token: string
            refresh_token?: string | null
            expires_at?: string | null
            scope?: string[] | null
            metadata?: Json | null
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            provider?: string
            access_token?: string
            refresh_token?: string | null
            expires_at?: string | null
            scope?: string[] | null
            metadata?: Json | null
            created_at?: string
            updated_at?: string
          }
        }
        analytics_events: {
          Row: {
            id: string
            user_id: string
            event_type: string
            action: string
            metadata: Json | null
            session_id: string | null
            ip_address: string | null
            user_agent: string | null
            created_at: string
          }
          Insert: {
            id?: string
            user_id: string
            event_type: string
            action: string
            metadata?: Json | null
            session_id?: string | null
            ip_address?: string | null
            user_agent?: string | null
            created_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            event_type?: string
            action?: string
            metadata?: Json | null
            session_id?: string | null
            ip_address?: string | null
            user_agent?: string | null
            created_at?: string
          }
        }
        subscriptions: {
          Row: {
            id: string
            user_id: string
            stripe_customer_id: string | null
            stripe_subscription_id: string | null
            plan: string
            status: string
            current_period_start: string | null
            current_period_end: string | null
            cancel_at_period_end: boolean
            canceled_at: string | null
            trial_start: string | null
            trial_end: string | null
            metadata: Json | null
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            user_id: string
            stripe_customer_id?: string | null
            stripe_subscription_id?: string | null
            plan?: string
            status?: string
            current_period_start?: string | null
            current_period_end?: string | null
            cancel_at_period_end?: boolean
            canceled_at?: string | null
            trial_start?: string | null
            trial_end?: string | null
            metadata?: Json | null
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            stripe_customer_id?: string | null
            stripe_subscription_id?: string | null
            plan?: string
            status?: string
            current_period_start?: string | null
            current_period_end?: string | null
            cancel_at_period_end?: boolean
            canceled_at?: string | null
            trial_start?: string | null
            trial_end?: string | null
            metadata?: Json | null
            created_at?: string
            updated_at?: string
          }
        }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Type aliases for easier use
export type ContentProfile = Database['public']['Tables']['content_profiles']['Row']
export type ScheduledPost = Database['public']['Tables']['scheduled_posts']['Row']
export type HookSuggestion = Database['public']['Tables']['hook_suggestions']['Row']
export type UserIntegration = Database['public']['Tables']['user_integrations']['Row']
export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']

export type ContentProfileInsert = Database['public']['Tables']['content_profiles']['Insert']
export type ScheduledPostInsert = Database['public']['Tables']['scheduled_posts']['Insert']
export type HookSuggestionInsert = Database['public']['Tables']['hook_suggestions']['Insert']
export type UserIntegrationInsert = Database['public']['Tables']['user_integrations']['Insert']
export type AnalyticsEventInsert = Database['public']['Tables']['analytics_events']['Insert']
export type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert']

export type ContentProfileUpdate = Database['public']['Tables']['content_profiles']['Update']
export type ScheduledPostUpdate = Database['public']['Tables']['scheduled_posts']['Update']
export type HookSuggestionUpdate = Database['public']['Tables']['hook_suggestions']['Update']
export type UserIntegrationUpdate = Database['public']['Tables']['user_integrations']['Update']
export type AnalyticsEventUpdate = Database['public']['Tables']['analytics_events']['Update']
export type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update']

// Enums
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

export enum SubscriptionPlan {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
}

export enum AnalyticsEventType {
  LOGIN = 'login',
  POST_CREATED = 'post_created',
  POST_PUBLISHED = 'post_published',
  AI_USED = 'ai_used',
  SUBSCRIPTION_CHANGED = 'subscription_changed',
  INTEGRATION_CONNECTED = 'integration_connected',
}

export enum ContentType {
  MUSIC = 'music',
  TECHNOLOGY = 'technology',
  LIFESTYLE = 'lifestyle',
  BUSINESS = 'business',
  EDUCATION = 'education',
  ENTERTAINMENT = 'entertainment',
}
