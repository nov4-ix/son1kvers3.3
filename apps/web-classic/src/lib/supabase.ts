import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type PixelMessage = {
    id: string;
    content: string;
    role: 'user' | 'assistant' | 'system';
    created_at: string;
    session_id?: string;
};

export type PixelMemory = {
    id: string;
    key: string;
    value: any;
    context?: string;
    created_at: string;
};

export const PixelDatabase = {
    async getUserMemories(userId: string, type?: string) { return [] as any[]; },
    async saveMemory(memory: any) { },
    async saveMessage(message: any) { },
    async getUserMessages(userId: string, limit?: number) { return [] as any[]; }
}
