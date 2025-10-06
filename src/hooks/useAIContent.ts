import { useState } from 'react'
import { api } from '@/lib/api'

export function useAIContent() {
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateAISuggestion = async (prompt: string) => {
    setIsGenerating(true)
    try {
      const suggestion = await api.generateAISuggestion(prompt)
      setAiSuggestion(suggestion)
    } catch (error) {
      console.error('Error generating AI suggestion:', error)
      throw error
    } finally {
      setIsGenerating(false)
    }
  }

  const clearAISuggestion = () => {
    setAiSuggestion(null)
  }

  return {
    aiSuggestion,
    isGenerating,
    generateAISuggestion,
    clearAISuggestion,
  }
}