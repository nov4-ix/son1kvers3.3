// apps/the-generator/src/services/sunoPolling.ts
export interface SunoTrack {
  audio_url: string;
  image_url: string;
  title: string;
  duration: number;
  id: string;
  prompt: string;
  tags: string;
  source_audio_url?: string;
  source_image_url?: string;
  source_stream_audio_url?: string;
  stream_audio_url?: string;
}

export interface SunoPollingResult {
  running: boolean;
  data?: SunoTrack | SunoTrack[]; // Puede ser un track o array de tracks
  tracksCount?: number;
  error?: string;
  status?: string;
}

export interface SunoPollingConfig {
  maxAttempts: number;
  intervalMs: number;
  timeoutMs: number;
  retryDelayMs: number;
}

class SunoPollingService {
  private readonly BASE_URL = 'https://usa.imgkits.com/node-api/suno';
  private readonly DEFAULT_CONFIG: SunoPollingConfig = {
    maxAttempts: 60, // 5 minutos con intervalos de 5s
    intervalMs: 5000, // 5 segundos
    timeoutMs: 300000, // 5 minutos total
    retryDelayMs: 1000 // 1 segundo entre reintentos
  };

  async pollForResult(
    taskId: string, 
    config: Partial<SunoPollingConfig> = {}
  ): Promise<SunoPollingResult> {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    const startTime = Date.now();

    console.log(`[Suno Polling] Starting polling for taskId: ${taskId}`);

    for (let attempt = 0; attempt < finalConfig.maxAttempts; attempt++) {
      try {
        // Verificar timeout total
        if (Date.now() - startTime > finalConfig.timeoutMs) {
          throw new Error(`Polling timeout after ${finalConfig.timeoutMs}ms`);
        }

        const result = await this.makePollingRequest(taskId);
        
        console.log(`[Suno Polling] Attempt ${attempt + 1}:`, {
          running: result.running,
          hasData: !!result.data,
          status: result.status
        });

        // Si running es false, debería tener los datos
        if (result.running === false) {
          if (result.data) {
            console.log(`[Suno Polling] ✅ Generation complete!`);
            return result;
          } else {
            // A veces running=false pero sin datos, esperar un poco más
            console.log(`[Suno Polling] Running=false but no data, waiting...`);
            await this.delay(finalConfig.retryDelayMs);
            continue;
          }
        }

        // Si running es true, continuar esperando
        if (result.running === true) {
          console.log(`[Suno Polling] Still running, waiting ${finalConfig.intervalMs}ms...`);
          await this.delay(finalConfig.intervalMs);
          continue;
        }

        // Si no tiene el campo running, verificar otros estados
        if (result.status === 'complete' || result.status === 'success') {
          console.log(`[Suno Polling] ✅ Status complete!`);
          return result;
        }

        if (result.status === 'failed' || result.status === 'error') {
          throw new Error(`Generation failed: ${result.error || 'Unknown error'}`);
        }

        // Estado desconocido, esperar
        await this.delay(finalConfig.intervalMs);

      } catch (error: any) {
        console.error(`[Suno Polling] Attempt ${attempt + 1} failed:`, error);
        
        // Si es el último intento, lanzar error
        if (attempt === finalConfig.maxAttempts - 1) {
          throw new Error(`Polling failed after ${finalConfig.maxAttempts} attempts: ${error.message}`);
        }
        
        // Esperar antes del siguiente intento
        await this.delay(finalConfig.retryDelayMs);
      }
    }

    throw new Error(`Max polling attempts (${finalConfig.maxAttempts}) reached`);
  }

  private async makePollingRequest(taskId: string): Promise<SunoPollingResult> {
    const response = await fetch(
      `${this.BASE_URL}/get_mj_status/${taskId}`,
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

    const data = await response.json();
    
    // Manejar la respuesta exacta del polling
    if (data.code === 200 && data.data) {
      // Formato exacto: {"code":200,"data":{"callbackType":"complete","data":[...]}}
      if (data.data.callbackType === 'complete' && data.data.data) {
        const tracks = data.data.data;
        if (tracks && tracks.length > 0) {
          console.log(`[Suno Polling] ✅ Received ${tracks.length} tracks`);
          return {
            running: false,
            data: tracks, // Devolver TODOS los tracks
            status: 'complete',
            tracksCount: tracks.length
          };
        }
      }
    }

    // Formato directo
    if (data.running !== undefined) {
      return data;
    }

    // Formato con status
    if (data.status) {
      return {
        running: data.status !== 'complete',
        data: data.data,
        status: data.status,
        error: data.error
      };
    }

    // Formato desconocido, asumir que está corriendo
    return {
      running: true,
      data: data.data,
      status: 'unknown'
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Método para generar y hacer polling completo
  async generateAndPoll(
    params: {
      prompt: string;
      style?: string;
      title?: string;
      customMode?: boolean;
      instrumental?: boolean;
      lyrics?: string;
    },
    token: string,
    pollingConfig?: Partial<SunoPollingConfig>
  ): Promise<SunoPollingResult> {
    console.log('[Suno] Starting generation...');
    
    // 1. Generar
    const generated = await this.generate(params, token);
    const taskId = generated.task_id || generated.taskId || generated.data?.taskId || generated.id;

    if (!taskId) {
      throw new Error('No taskId received from generation');
    }

    console.log(`[Suno] ✅ Generated with taskId: ${taskId}`);
    console.log('[Suno] Starting polling...');

    // 2. Polling
    const result = await this.pollForResult(taskId, pollingConfig);
    console.log('[Suno] ✅ Generation complete!');

    return result;
  }

  private async generate(params: any, token: string) {
    console.log('[Suno] Starting REAL generation...');
    
    const response = await fetch('https://ai.imgkits.com/suno/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
        'channel': 'node-api',
        'origin': 'chrome-extension://opejieigkdpkdjifkahjmmmpmnebfjbo',
        'referer': 'chrome-extension://opejieigkdpkdjifkahjmmmpmnebfjbo'
      },
      body: JSON.stringify({
        prompt: params.prompt,
        style: params.style || '',
        title: params.title || '',
        customMode: params.customMode ?? true,
        instrumental: params.instrumental ?? false,
        lyrics: params.lyrics || params.prompt,
        gender: ''
      })
    });

    if (!response.ok) {
      throw new Error(`Generation failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('[Suno] REAL generation response:', result);
    return result;
  }
}

// Instancia singleton
export const sunoPollingService = new SunoPollingService();
