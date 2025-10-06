import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { SunoCoverAPI } from '../lib/api/suno-cover';
import { supabaseStorage } from '../lib/api/supabase-storage';
import { startPolling } from '../lib/api/polling';
import type { AudioFile } from '../types/audio';
import type { AudioAnalysis } from '../types/audio';
import type { KnobSettings, SunoTaskStatus } from '../types/suno';

interface GenerateParams {
  audioFile: AudioFile;
  analysis: AudioAnalysis;
  knobs: KnobSettings;
  userDescription: string;
}

export function useSunoCover() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<SunoTaskStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateCover = async ({ audioFile, analysis, knobs, userDescription }: GenerateParams) => {
    try {
      setIsGenerating(true);
      setError(null);
      setStatus(null);

      // Initialize API client
      const apiKey = import.meta.env.VITE_SUNO_API_KEY;
      if (!apiKey) {
        throw new Error('Suno API key not configured');
      }

      const sunoAPI = new SunoCoverAPI(apiKey);

      // Upload audio to Supabase Storage
      toast.loading('Uploading audio...', { id: 'upload' });
      const uploadPath = `audio/${Date.now()}-${audioFile.id}.${audioFile.format}`;
      const { url: uploadUrl, error: uploadError } = await supabaseStorage.uploadAudio(
        audioFile.file,
        uploadPath
      );

      if (uploadError || !uploadUrl) {
        throw new Error('Failed to upload audio to storage');
      }

      toast.success('Audio uploaded successfully!', { id: 'upload' });

      // Create cover request
      toast.loading('Creating cover request...', { id: 'create' });
      const response = await sunoAPI.createCover({
        uploadUrl,
        analysis,
        knobs,
        userDescription
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to create cover request');
      }

      toast.success('Cover request created!', { id: 'create' });

      // Set initial status
      const initialStatus: SunoTaskStatus = {
        taskId: response.taskId!,
        status: 'pending',
        createdAt: new Date()
      };
      setStatus(initialStatus);

      // Start polling for status updates
      const stopPolling = startPolling(
        () => sunoAPI.getTaskStatus(response.taskId!),
        (result) => {
          if (result.success && result.data) {
            const newStatus = sunoAPI.parseTaskStatus(result.data);
            setStatus(newStatus);

            if (newStatus.status === 'completed') {
              toast.success('Cover generation completed!', { id: 'generate' });
              stopPolling();
            } else if (newStatus.status === 'failed') {
              toast.error('Cover generation failed', { id: 'generate' });
              setError(newStatus.error || 'Generation failed');
              stopPolling();
            }
          } else {
            toast.error('Failed to check status', { id: 'status' });
            setError(result.error || 'Status check failed');
            stopPolling();
          }
        },
        { intervalMs: 5000, timeoutMs: 300000 } // 5 minutes timeout
      );

    } catch (err) {
      console.error('Cover generation failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`Generation failed: ${errorMessage}`, { id: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setStatus(null);
    setError(null);
    setIsGenerating(false);
  };

  return {
    generateCover,
    isGenerating,
    status,
    error,
    reset
  };
}
