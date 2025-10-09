import { useState, useCallback } from 'react';
import { sunoService } from '../services/sunoService';
import type { SunoGenerateParams, SunoStatusResponse } from '../types/suno';

export function useSunoService() {
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

      const result = await sunoService.generateAndWait(
        params,
        (attempt, total) => {
          setProgress(Math.floor((attempt / total) * 100));
        }
      );

      setResult(result);
      setProgress(100);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generate, isGenerating, progress, error, result, reset };
}
