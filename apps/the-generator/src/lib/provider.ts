// src/lib/provider.ts
import axios from 'axios';

const PROVIDER = import.meta.env.VITE_MUSIC_API_PROVIDER || 'suno';
const MUSIC_BASE = import.meta.env.VITE_MUSIC_API_BASE_URL || 'https://api.sunoapi.com/v1';
const BACKEND = import.meta.env.VITE_BACKEND_URL || '';
const viaProxy = !!BACKEND;

export async function createAudio(body: { lyrics: string; stylePrompt: string }) {
  if (viaProxy) {
    const r = await axios.post(`${BACKEND}/api/suno/cover`, { 
      prompt: body.lyrics, 
      style: body.stylePrompt 
    });
    return { taskId: r.data?.data?.taskId || r.data?.taskId };
  }
  
  const r = await axios.post(`${MUSIC_BASE}/cover/generate`, { 
    prompt: body.lyrics, 
    style: body.stylePrompt 
  });
  return { taskId: r.data?.data?.taskId || r.data?.taskId };
}

export async function getAudioStatus(taskId: string) {
  if (viaProxy) {
    const r = await axios.get(`${BACKEND}/api/suno/status`, { 
      params: { taskId } 
    });
    const d = r.data?.data || r.data;
    return { 
      status: d.status, 
      streamUrl: d.audioUrl, 
      downloadUrl: d.audioUrl 
    };
  }
  
  const r = await axios.get(`${MUSIC_BASE}/cover/status`, { 
    params: { taskId } 
  });
  const d = r.data?.data || r.data;
  return { 
    status: d.status, 
    streamUrl: d.audioUrl, 
    downloadUrl: d.audioUrl 
  };
}
