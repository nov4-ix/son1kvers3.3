export interface KnobSettings {
  expressivity: number; // 0-100
  rareza: number; // 0-100 (creativity)
  garage: number; // 0-100 (saturation/lo-fi)
  trash: number; // 0-100 (distortion/aggressiveness)
}

export interface SunoCoverRequest {
  uploadUrl: string; // URL del audio en Supabase Storage
  customMode: boolean; // true para control total
  instrumental: boolean; // false si queremos vocals
  model: 'V3_5' | 'V4' | 'V4_5' | 'V4_5PLUS' | 'V5';
  prompt?: string; // Descripción/lyrics
  style: string; // Genre/style del cover
  title: string;
  negativePrompt?: string; // Estilos a evitar
  gender?: 'm' | 'f'; // Vocal gender
  styleWeight?: number; // 0-1 (default 0.65)
  creativityWeight?: number; // 0-1 (default 0.65)
  audioWeight?: number; // 0-1 (default 0.65)
  callbackUrl?: string;
}

export interface SunoCoverResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
  };
}

export interface SunoTaskStatus {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number; // 0-100
  audioUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  duration?: number;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}
