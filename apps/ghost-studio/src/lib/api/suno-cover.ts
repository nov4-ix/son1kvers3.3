// apps/ghost-studio/src/lib/api/suno-cover.ts
import axios from 'axios';
import type { KnobSettings, SunoCoverResponse, SunoTaskStatus } from '../../types/suno';
import type { AudioAnalysis } from '../../types/audio';

const SUNO_API_BASE = 'https://api.sunoapi.com';

export class SunoCoverAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Sube audio a Supabase y genera cover con Suno
   */
  async createCover(params: {
    uploadUrl: string;
    analysis: AudioAnalysis;
    knobs: KnobSettings;
    userDescription: string;
  }): Promise<{ success: boolean; taskId?: string; error?: string }> {
    try {
      const { uploadUrl, analysis, knobs, userDescription } = params;

      // 2. Build style and prompt from analysis + knobs
      const { style, prompt, title, negativePrompt } = this.buildPromptData(
        knobs,
        analysis,
        userDescription
      );

      // 3. Calculate weights from knobs
      const weights = this.calculateWeights(knobs);

      // 4. Call Suno Cover API
      const response = await axios.post<SunoCoverResponse>(
        `${SUNO_API_BASE}/suno/upload-and-cover`,
        {
          uploadUrl,
          customMode: true,
          instrumental: false, // Queremos vocals
          model: 'V4_5PLUS', // Mejor modelo actual
          prompt,
          style,
          title,
          negativePrompt,
          styleWeight: weights.styleWeight,
          creativityWeight: weights.creativityWeight,
          audioWeight: weights.audioWeight,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.code === 200) {
        return {
          success: true,
          taskId: response.data.data.taskId
        };
      } else {
        return {
          success: false,
          error: response.data.msg || 'Unknown error'
        };
      }
    } catch (error) {
      console.error('Suno API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check status de generación
   */
  async getTaskStatus(taskId: string): Promise<{ success: boolean; data?: SunoTaskStatus; error?: string }> {
    try {
      const response = await axios.get(
        `${SUNO_API_BASE}/suno/task-status`,
        {
          params: { taskId },
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return {
        success: true,
        data: this.parseTaskStatus(response.data)
      };
    } catch (error) {
      console.error('Status check error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Parse task status from API response
   */
  parseTaskStatus(data: any): SunoTaskStatus {
    return {
      taskId: data.taskId || data.data?.taskId || '',
      status: data.status || data.data?.status || 'pending',
      progress: data.progress || data.data?.progress,
      audioUrl: data.audioUrl || data.data?.audioUrl,
      videoUrl: data.videoUrl || data.data?.videoUrl,
      imageUrl: data.imageUrl || data.data?.imageUrl,
      duration: data.duration || data.data?.duration,
      error: data.error || data.data?.error,
      createdAt: new Date(data.createdAt || data.data?.createdAt || Date.now()),
      completedAt: data.completedAt || data.data?.completedAt ? new Date(data.completedAt || data.data?.completedAt) : undefined
    };
  }

  /**
   * Build prompt data from analysis and knobs
   */
  private buildPromptData(knobs: KnobSettings, analysis: AudioAnalysis, userDescription: string) {
    const mood = this.getMoodFromExpressivity(knobs.expressivity);
    const style = this.buildStyle(knobs, analysis);
    
    const promptParts = [
      userDescription?.trim() || 'Modern, cinematic re-production with tasteful space',
      mood,
      `in ${analysis.key} ${analysis.scale}`,
    ];

    if (analysis.detectedInstruments?.length) {
      promptParts.push(`featuring ${analysis.detectedInstruments.slice(0,4).join(', ')}`);
    }

    const prompt = promptParts.join(', ');
    const title = userDescription?.trim() ? userDescription.split(' ').slice(0,4).join(' ') : `${analysis.genre} Cover`;
    const negativePrompt = this.buildNegativePrompt(knobs);

    return { style, prompt, title, negativePrompt };
  }

  /**
   * Build style string from knobs and analysis
   */
  private buildStyle(knobs: KnobSettings, analysis: AudioAnalysis): string {
    const parts: string[] = [analysis.genre];

    if (knobs.garage >= 70) parts.push('lo-fi', 'heavily saturated', 'analog warmth', 'tape hiss');
    else if (knobs.garage >= 40) parts.push('warm analog', 'subtle saturation');
    else parts.push('clean production', 'digital clarity');

    if (knobs.trash >= 70) parts.push('heavily distorted', 'aggressive', 'industrial', 'harsh');
    else if (knobs.trash >= 40) parts.push('edgy', 'gritty', 'distorted elements');
    else parts.push('polished', 'smooth');

    parts.push(`${analysis.bpm} BPM`);
    return parts.join(', ');
  }

  /**
   * Get mood from expressivity knob
   */
  private getMoodFromExpressivity(expressivity: number): string {
    if (expressivity <= 12) return 'deeply depressive and dark';
    if (expressivity <= 25) return 'melancholic and sad';
    if (expressivity <= 37) return 'somber and reflective';
    if (expressivity <= 50) return 'calm and balanced';
    if (expressivity <= 62) return 'hopeful and uplifting';
    if (expressivity <= 75) return 'happy and energetic';
    if (expressivity <= 87) return 'euphoric and intense';
    return 'ecstatic and explosive';
  }

  /**
   * Build negative prompt from knobs
   */
  private buildNegativePrompt(knobs: KnobSettings): string {
    const avoid: string[] = [];
    if (knobs.garage < 30) avoid.push('lo-fi', 'tape hiss', 'vinyl crackle');
    if (knobs.trash < 30) avoid.push('distortion', 'harsh', 'aggressive', 'screaming');
    if (knobs.expressivity < 30) avoid.push('upbeat', 'happy', 'cheerful', 'party');
    if (knobs.expressivity > 70) avoid.push('sad', 'melancholic', 'depressing', 'somber');
    return avoid.join(', ');
  }

  /**
   * Calculate weights from knobs
   */
  private calculateWeights(knobs: KnobSettings) {
    const creativityWeight = +(0.3 + (knobs.rareza / 100) * 0.6).toFixed(2);
    const styleWeight = +(0.9 - (knobs.rareza / 100) * 0.4).toFixed(2);
    const audioWeight = +(0.8 - (knobs.rareza / 100) * 0.3).toFixed(2);
    return { creativityWeight, styleWeight, audioWeight };
  }
}