import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { auth } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // State
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      // Actions
      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await auth.signInWithPassword({
            email,
            password,
          })

          if (error) throw error

          set({
            user: data.user,
            session: data.session,
            isAuthenticated: !!data.user,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          })
          throw error
        }
      },

      signUp: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await auth.signUp({
            email,
            password,
          })

          if (error) throw error

          set({
            user: data.user,
            session: data.session,
            isAuthenticated: !!data.user,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          })
          throw error
        }
      },

      signOut: async () => {
        set({ isLoading: true })
        try {
          await auth.signOut()
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          })
          throw error
        }
      },

      initialize: async () => {
        set({ isLoading: true })
        try {
          const { data: { session } } = await auth.getSession()
          set({
            user: session?.user ?? null,
            session,
            isAuthenticated: !!session?.user,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error: error.message,
            isLoading: false,
          })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)