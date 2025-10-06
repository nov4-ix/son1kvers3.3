// apps/ghost-studio/src/lib/api/supabase-storage.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !anonKey) {
  console.warn('Supabase configuration missing. Audio upload will not work.');
}

const supabase = createClient(supabaseUrl, anonKey);
const BUCKET = 'ghost-audio';

export const supabaseStorage = {
  async uploadAudio(file: File, path: string) {
    try {
      if (!supabaseUrl || !anonKey) {
        throw new Error('Supabase not configured');
      }

      // Generate unique path with timestamp
      const timestamp = Date.now();
      const uniquePath = `${timestamp}-${path}`;

      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(uniquePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'audio/mpeg'
        });

      if (error) {
        console.error('Upload error:', error);
        return { url: '', error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(data.path);

      return { 
        url: urlData.publicUrl, 
        error: null,
        path: data.path 
      };
    } catch (e: any) {
      console.error('Storage error:', e);
      return { url: '', error: e.message || 'Upload failed' };
    }
  },

  async deleteAudio(path: string) {
    try {
      const { error } = await supabase.storage
        .from(BUCKET)
        .remove([path]);
      
      if (error) {
        console.error('Delete error:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  async listUserFiles(userId?: string) {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list(userId ? `audio/${userId}` : 'audio', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('List error:', error);
        return { files: [], error: error.message };
      }

      return { files: data || [], error: null };
    } catch (e: any) {
      return { files: [], error: e.message };
    }
  }
};