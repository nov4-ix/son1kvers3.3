import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const pixelSupabase = {
  async saveUserProfile(profile: any) {
    if (!supabase) return null
    
    try {
      const { data, error } = await supabase
        .from('pixel_profiles')
        .upsert({
          user_id: profile.userId || 'anonymous',
          pixel_preferences: profile.pixelPreferences,
          avg_color: profile.avgColor,
          avg_speed: profile.avgSpeed,
          total_interactions: profile.totalInteractions,
          last_update: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.warn('Failed to save profile to Supabase:', error)
      return null
    }
  },

  async loadUserProfile(userId: string) {
    if (!supabase) return null
    
    try {
      const { data, error } = await supabase
        .from('pixel_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.warn('Failed to load profile from Supabase:', error)
      return null
    }
  },

  async saveBehaviorData(userId: string, behaviorData: any) {
    if (!supabase) return null
    
    try {
      const { data, error } = await supabase
        .from('pixel_behavior')
        .upsert({
          user_id: userId,
          behavior_data: behaviorData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.warn('Failed to save behavior to Supabase:', error)
      return null
    }
  },

  async loadBehaviorData(userId: string) {
    if (!supabase) return null
    
    try {
      const { data, error } = await supabase
        .from('pixel_behavior')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.warn('Failed to load behavior from Supabase:', error)
      return null
    }
  }
}