// apps/nova-post-pilot/src/services/sunoApi.ts
export interface SunoTrack {
  id: string;
  title: string;
  audio_url: string;
  image_url?: string;
  duration?: number;
  tags?: string[];
}

export interface SunoResponse {
  response: {
    code: number;
    message: string;
  };
  data: SunoTrack[];
}

export interface SunoGenerationRequest {
  title: string;
  style: string;
  lyrics: string;
  prompt: string;
  customMode: boolean;
  instrumental: boolean;
  tags: string[];
  duration: number;
  meta: {
    source: string;
    ts: number;
    max_quality: boolean;
  };
}

const DEFAULT_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKeXRYZlBRa21JUHM4b2JPbVYyaHpoREtEeVhxVzhnUCIsImV4cCI6MTc1OTk2Mzc1OH0.a6K0kTGbc164uQvU24GHJF8x9BYV07HztMjt0Ug2x0U';

export class SunoApiService {
  private token: string;

  constructor(token?: string) {
    this.token = token || DEFAULT_TOKEN;
  }

  async generateMusic(request: SunoGenerationRequest): Promise<SunoResponse> {
    try {
      const response = await fetch('https://ai.imgkits.com/suno/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${this.token}`,
          'channel': 'node-api',
          'origin': 'https://www.livepolls.app',
          'referer': 'https://www.livepolls.app/'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating music:', error);
      throw error;
    }
  }

  async pollForResult(taskId: string): Promise<SunoResponse> {
    try {
      const response = await fetch(`https://ai.imgkits.com/suno/result/${taskId}`, {
        method: 'GET',
        headers: {
          'authorization': `Bearer ${this.token}`,
          'channel': 'node-api',
          'origin': 'https://www.livepolls.app',
          'referer': 'https://www.livepolls.app/'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error polling for result:', error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }
}

export const sunoApi = new SunoApiService();
