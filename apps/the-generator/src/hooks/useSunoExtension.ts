// apps/the-generator/src/hooks/useSunoExtension.ts
import { useState } from 'react';

interface SunoExtensionResponse {
  ok: boolean;
  data?: any;
  error?: string;
}

export function useSunoExtension() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const generateWithExtension = async (lyrics: string, style: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Verificar si la extensión está disponible
      if (!window.chrome?.runtime?.id) {
        throw new Error('Son1kVerse AI Music Engine extension not found. Please install the extension.');
      }

      // Enviar datos a la extensión
      const response: SunoExtensionResponse = await chrome.runtime.sendMessage({
        action: 'generateMusic',
        payload: {
          title: 'Generated Track',
          style: style,
          lyrics: lyrics,
          customMode: true,
          instrumental: false,
          tags: [style],
          duration: 30,
          meta: {
            source: 'the-generator',
            timestamp: Date.now()
          }
        }
      });

      if (!response.ok) {
        throw new Error(response.error || 'Failed to generate music');
      }

      setResult(response.data);
      return response.data;
      
    } catch (err: any) {
      const errorMessage = err.message || 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const checkExtensionAvailable = (): boolean => {
    return !!window.chrome?.runtime?.id;
  };

  const installExtension = () => {
    // Abrir página de instalación de la extensión
    window.open('chrome://extensions/', '_blank');
  };

  return { 
    generateWithExtension, 
    isGenerating, 
    result, 
    error,
    checkExtensionAvailable,
    installExtension
  };
}
