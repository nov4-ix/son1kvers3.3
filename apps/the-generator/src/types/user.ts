export interface User {
  id: string;
  email: string;
  name?: string;
  credits: number;
  tier: 'free' | 'pro' | 'premium';
  createdAt: Date;
  lastLogin: Date;
}

export interface GenerationHistory {
  id: string;
  userId: string;
  taskId: string;
  prompt: string;
  style?: string;
  title?: string;
  audioUrl?: string;
  status: 'pending' | 'processing' | 'complete' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}

export interface SunoGenerateParams {
  prompt: string;
  style?: string;
  title?: string;
  customMode?: boolean;
  instrumental?: boolean;
  lyrics?: string;
  gender?: string;
}

export interface SunoGenerateResponse {
  taskId: string;
  status: string;
  data?: any;
}

export interface SunoStatusResponse {
  running: boolean;
  status?: 'complete' | 'failed' | 'processing';
  data?: {
    audio_url?: string;
    video_url?: string;
    image_url?: string;
    title?: string;
    tags?: string;
    duration?: number;
  };
  audio_url?: string;
  video_url?: string;
  message?: string;
}

