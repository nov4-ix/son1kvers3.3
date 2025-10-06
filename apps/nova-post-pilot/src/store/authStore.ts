import { create } from 'zustand'
import { supabase, signInWithEmail, signUpWithEmail, signOut, getCurrentUser, getSession } from '@/lib/supabase'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import toast from 'react-hot-toast'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const { user, session, error } = await signInWithEmail(email, password)
      
      if (error) {
        set({ error: error.message })
        toast.error(error.message)
        return
      }
      
      set({ 
        user, 
        session, 
        isAuthenticated: !!user,
        error: null 
      })
      
      toast.success('¡Bienvenido!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: errorMessage })
      toast.error(errorMessage)
    } finally {
      set({ isLoading: false })
    }
  },

  signUp: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const { user, session, error } = await signUpWithEmail(email, password)
      
      if (error) {
        set({ error: error.message })
        toast.error(error.message)
        return
      }
      
      set({ 
        user, 
        session, 
        isAuthenticated: !!user,
        error: null 
      })
      
      toast.success('¡Cuenta creada! Revisa tu email para confirmar.')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: errorMessage })
      toast.error(errorMessage)
    } finally {
      set({ isLoading: false })
    }
  },

  signOut: async () => {
    set({ isLoading: true })
    
    try {
      const { error } = await signOut()
      
      if (error) {
        set({ error: error.message })
        toast.error(error.message)
        return
      }
      
      set({ 
        user: null, 
        session: null, 
        isAuthenticated: false,
        error: null 
      })
      
      toast.success('Sesión cerrada')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      set({ error: errorMessage })
      toast.error(errorMessage)
    } finally {
      set({ isLoading: false })
    }
  },

  initialize: async () => {
    set({ isLoading: true })
    
    try {
      const [user, session] = await Promise.all([
        getCurrentUser(),
        getSession()
      ])
      
      set({ 
        user, 
        session, 
        isAuthenticated: !!user,
        error: null 
      })
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({ error: 'Error al inicializar autenticación' })
    } finally {
      set({ isLoading: false })
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
