import { create } from 'zustand'
import { supabase, signIn as supabaseSignIn, signUp as supabaseSignUp, signOut as supabaseSignOut } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  signIn: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const { user } = await supabaseSignIn(email, password)
      set({ user, isAuthenticated: true })
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  signUp: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const { user } = await supabaseSignUp(email, password)
      set({ user, isAuthenticated: !!user })
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  signOut: async () => {
    set({ isLoading: true })
    try {
      await supabaseSignOut()
      set({ user: null, isAuthenticated: false })
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  initialize: async () => {
    set({ isLoading: true })
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({
        user: session?.user ?? null,
        isAuthenticated: !!session?.user,
      })

      // Listen to auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          user: session?.user ?? null,
          isAuthenticated: !!session?.user,
        })
      })
    } catch (error) {
      console.error('Initialize error:', error)
    } finally {
      set({ isLoading: false })
    }
  },
}))

