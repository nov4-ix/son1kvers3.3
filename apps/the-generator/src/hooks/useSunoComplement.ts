// apps/the-generator/src/hooks/useSunoComplement.ts
import { useState, useEffect } from 'react';
import { tokenManager } from '../services/tokenManager';
import { sunoPollingService } from '../services/sunoPolling';
import { userInstanceManager } from '../services/userInstance';

interface SunoComplementResponse {
  ok: boolean;
  data?: any;
  error?: string;
}

export function useSunoComplement() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [tokenStats, setTokenStats] = useState(tokenManager.getPoolStats());
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [pollingProgress, setPollingProgress] = useState(0);

  const generateWithComplement = async (lyrics: string, style: string, maxRetries = 3) => {
    try {
      setIsGenerating(true);
      setIsPolling(false);
      setError(null);
      setPollingProgress(0);
      
      let lastError: any = null;
      
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          // Obtener token válido del pool
          const token = tokenManager.getNextToken();
          if (!token) {
            throw new Error('No valid tokens available. Please add more tokens.');
          }
          
          setCurrentToken(token);
          
          // El complemento está integrado en la aplicación
          console.log(`[Suno Complement] Attempt ${attempt + 1} with token: ${token.substring(0, 20)}...`);

          // Usar el nuevo sistema de polling
          const result = await sunoPollingService.generateAndPoll(
            {
              prompt: `Style: ${style}\n\nLyrics:\n${lyrics}`,
              style: style,
              title: 'Generated Track',
              customMode: true,
              instrumental: false,
              lyrics: lyrics
            },
            token,
            {
              maxAttempts: 60, // 5 minutos
              intervalMs: 5000, // 5 segundos
              timeoutMs: 300000 // 5 minutos total
            }
          );

          // Éxito - marcar token como válido y registrar estadísticas
          tokenManager.markTokenValid(token);
          userInstanceManager.recordGeneration(true);
          setTokenStats(tokenManager.getPoolStats());
          setResult(result);
          setCurrentToken(null);
          setPollingProgress(100);
          
          console.log('[Suno Complement] ✅ Generation completed successfully');
          return result;
          
        } catch (err: any) {
          lastError = err;
          console.error(`[Suno Complement] Attempt ${attempt + 1} failed:`, err);
          
          // Si es error de token, marcarlo como inválido
          if (err.message?.includes('token') || err.message?.includes('auth') || err.message?.includes('401')) {
            const token = tokenManager.getNextToken();
            if (token) {
              tokenManager.markTokenInvalid(token);
              setTokenStats(tokenManager.getPoolStats());
            }
          }
          
          // Si no es el último intento, esperar un poco
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          }
        }
      }
      
      // Si llegamos aquí, todos los intentos fallaron
      userInstanceManager.recordGeneration(false);
      const errorMessage = lastError?.message || 'All token attempts failed';
      setError(errorMessage);
      setCurrentToken(null);
      setPollingProgress(0);
      throw lastError;
      
    } finally {
      setIsGenerating(false);
      setIsPolling(false);
    }
  };

  const checkComplementAvailable = (): boolean => {
    // El complemento está integrado en la aplicación, siempre disponible
    return true;
  };

  return { 
    generateWithComplement, 
    isGenerating,
    isPolling,
    result, 
    error,
    tokenStats,
    currentToken,
    pollingProgress,
    checkComplementAvailable
  };
}
