import { useState, useCallback } from 'react';
import { sunoService } from '../services/sunoService';
import type { SunoGenerateParams, SunoStatusResponse } from '../types/user';

interface UseSunoServiceReturn {
  generate: (params: SunoGenerateParams) => Promise<SunoStatusResponse | null>;
  isGenerating: boolean;
  progress: number;
  error: string | null;
  result: SunoStatusResponse | null;
  reset: () => void;
}

export function useSunoService(): UseSunoServiceReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SunoStatusResponse | null>(null);

  const reset = useCallback(() => {
    setIsGenerating(false);
    setProgress(0);
    setError(null);
    setResult(null);
  }, []);

  const generate = useCallback(async (params: SunoGenerateParams) => {
    try {
      setIsGenerating(true);
      setProgress(0);
      setError(null);
      setResult(null);

      console.log('[useSunoService] Starting generation...', params);

      const result = await sunoService.generateAndWait(
        params,
        (attempt, total) => {
          const progressPercent = Math.floor((attempt / total) * 100);
          setProgress(progressPercent);
          console.log(`[useSunoService] Progress: ${progressPercent}%`);
        }
      );

      console.log('[useSunoService] ✅ Generation complete!', result);
      setResult(result);
      setProgress(100);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('[useSunoService] ❌ Generation failed:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generate,
    isGenerating,
    progress,
    error,
    result,
    reset
  };
}

export default useSunoService;

