// apps/nova-post-pilot/src/hooks/useSunoMusic.ts
import { useState, useCallback } from 'react';
import { sunoApi, SunoGenerationRequest, SunoTrack, SunoResponse } from '../services/sunoApi';

export interface UseSunoMusicReturn {
  tracks: SunoTrack[];
  isLoading: boolean;
  error: string | null;
  generateMusic: (request: Omit<SunoGenerationRequest, 'meta'>) => Promise<void>;
  clearResults: () => void;
  setToken: (token: string) => void;
}

export function useSunoMusic(): UseSunoMusicReturn {
  const [tracks, setTracks] = useState<SunoTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMusic = useCallback(async (request: Omit<SunoGenerationRequest, 'meta'>) => {
    setIsLoading(true);
    setError(null);
    setTracks([]);

    try {
      const fullRequest: SunoGenerationRequest = {
        ...request,
        meta: {
          source: 'nova-post-pilot',
          ts: Date.now(),
          max_quality: true
        }
      };

      const response: SunoResponse = await sunoApi.generateMusic(fullRequest);
      
      if (response.response.code === 200 && response.data) {
        setTracks(response.data);
      } else {
        throw new Error(response.response.message || 'Error generando música');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error generating music:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setTracks([]);
    setError(null);
  }, []);

  const setToken = useCallback((token: string) => {
    sunoApi.setToken(token);
  }, []);

  return {
    tracks,
    isLoading,
    error,
    generateMusic,
    clearResults,
    setToken
  };
}
