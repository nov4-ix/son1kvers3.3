import { SUNO_CONFIG, API_CONFIG } from '../config/apiTokens';
import { tokenManager } from './tokenManager';
import type { SunoGenerateParams, SunoGenerateResponse, SunoStatusResponse } from '../types/suno';

export class SunoService {
  private readonly BASE_URL = SUNO_CONFIG.BASE_URL;
  private readonly POLLING_URL = SUNO_CONFIG.POLLING_URL;

  async generate(params: SunoGenerateParams): Promise<SunoGenerateResponse> {
    try {
      console.log('[Suno] Starting generation with params:', params);
      
      const response = await fetch(`${this.BASE_URL}/generate`, {
        method: 'POST',
        headers: tokenManager.getHeaders(),
        body: JSON.stringify({
          prompt: params.prompt,
          style: params.style || '',
          title: params.title || '',
          customMode: params.customMode ?? true,
          instrumental: params.instrumental ?? false,
          lyrics: params.lyrics || params.prompt,
          gender: params.gender || ''
        })
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          tokenManager.markTokenAsInvalid();
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[Suno] Generation response:', data);
      tokenManager.markTokenAsValid();
      
      return data;
    } catch (error) {
      console.error('[Suno] Generation error:', error);
      throw error;
    }
  }

  async getStatus(taskId: string): Promise<SunoStatusResponse> {
    try {
      const response = await fetch(
        `${this.POLLING_URL}/get_mj_status/${taskId}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Origin': 'https://www.livepolls.app',
            'Referer': 'https://www.livepolls.app/'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[Suno] Status check error:', error);
      throw error;
    }
  }

  async pollForResult(
    taskId: string, 
    onProgress?: (attempt: number, total: number) => void
  ): Promise<SunoStatusResponse> {
    const maxAttempts = API_CONFIG.MAX_POLLING_ATTEMPTS;
    const interval = API_CONFIG.POLLING_INTERVAL_MS;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await this.getStatus(taskId);
        
        if (onProgress) {
          onProgress(attempt, maxAttempts);
        }

        if (result.running === false) {
          console.log('[Suno] ✅ Generation complete!', result);
          return result;
        }

        if (result.status === 'complete') {
          return result;
        }

        if (result.status === 'failed') {
          throw new Error(`Generation failed: ${result.message || 'Unknown error'}`);
        }

        await new Promise(resolve => setTimeout(resolve, interval));

      } catch (error) {
        console.error(`[Suno] Polling attempt ${attempt} failed:`, error);
        
        if (attempt === maxAttempts) {
          throw new Error(`Polling timeout after ${maxAttempts} attempts`);
        }
        
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }

    throw new Error('Max polling attempts reached');
  }

  async generateAndWait(
    params: SunoGenerateParams,
    onProgress?: (attempt: number, total: number) => void
  ): Promise<SunoStatusResponse> {
    const generated = await this.generate(params);
    const taskId = generated.taskId || generated.data?.taskId;

    if (!taskId) {
      throw new Error('No taskId received from generation');
    }

    console.log(`[Suno] ✅ Generated with taskId: ${taskId}`);
    return await this.pollForResult(taskId, onProgress);
  }
}

export const sunoService = new SunoService();
