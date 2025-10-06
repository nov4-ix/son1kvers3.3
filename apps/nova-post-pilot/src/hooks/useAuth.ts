import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const { 
    user, 
    session, 
    isLoading, 
    isAuthenticated, 
    error,
    signIn, 
    signUp, 
    signOut, 
    initialize,
    clearError 
  } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
  }
}
