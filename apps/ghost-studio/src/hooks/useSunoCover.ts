// apps/ghost-studio/src/hooks/useSunoCover.ts
import { useState, useEffect } from 'react';
import { supabaseStorage } from '../lib/api/supabase-storage';

interface CoverResult {
  status: string;
  taskId?: string;
  audio_url?: string;
  error?: string;
}

export function useSunoCover() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [result, setResult] = useState<CoverResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatorData, setGeneratorData] = useState<any>(null);

  // Verificar datos de The Generator al cargar
  useEffect(() => {
    const checkForGeneratorData = () => {
      const data = localStorage.getItem('son1kverse_generator_data');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          setGeneratorData(parsed);
          // Limpiar después de leer
          localStorage.removeItem('son1kverse_generator_data');
        } catch (err) {
          console.error('Error parsing generator data:', err);
        }
      }
    };

    checkForGeneratorData();
  }, []);

  const generateCover = async (audioFile: File, prompt: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // 1. Subir audio a Supabase
      const uploadResult = await supabaseStorage.uploadAudio(audioFile, 'cover-input');
      if (uploadResult.error) {
        throw new Error(`Error uploading audio: ${uploadResult.error}`);
      }

      // 2. Llamar a Suno Cover API
      const response = await fetch('https://usa.imgkits.com/node-api/suno/cover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUNO_API_KEY}`,
          'channel': 'ghost-studio'
        },
        body: JSON.stringify({
          audio_url: uploadResult.url,
          prompt: prompt,
          customMode: true,
          style: 'cover',
          meta: {
            source: 'ghost-studio',
            timestamp: Date.now()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newTaskId = data.data?.taskId || data.taskId;
      
      if (!newTaskId) {
        throw new Error('No task ID received from Suno Cover API');
      }
      
      setTaskId(newTaskId);
      
      // 3. Iniciar polling para obtener resultado
      pollForResult(newTaskId);
      
    } catch (err: any) {
      console.error('Error generating cover:', err);
      setError(err.message || 'Failed to generate cover');
      setIsGenerating(false);
    }
  };

  const pollForResult = async (taskId: string) => {
    const maxAttempts = 60; // 5 minutos máximo
    let attempts = 0;
    
    const pollInterval = setInterval(async () => {
      attempts++;
      
      try {
        const response = await fetch(`https://usa.imgkits.com/node-api/suno/status/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUNO_API_KEY}`,
            'channel': 'ghost-studio'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Status check failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'completed' || data.status === 'success') {
          setResult({
            status: 'completed',
            taskId: taskId,
            audio_url: data.audio_url || data.result?.audio_url
          });
          setIsGenerating(false);
          clearInterval(pollInterval);
          
          // Enviar resultado de vuelta a The Generator
          sendResultToGenerator(data);
          
        } else if (data.status === 'failed' || data.status === 'error') {
          throw new Error(data.error || 'Cover generation failed');
        } else if (attempts >= maxAttempts) {
          throw new Error('Cover generation timeout - please try again');
        }
        
      } catch (err: any) {
        console.error('Error polling result:', err);
        setError(err.message || 'Error checking cover status');
        clearInterval(pollInterval);
        setIsGenerating(false);
      }
    }, 5000); // Poll every 5 seconds
  };

  const sendResultToGenerator = (data: any) => {
    const resultData = {
      coverUrl: data.audio_url || data.result?.audio_url,
      originalAudio: generatorData?.generatedAudio,
      prompt: generatorData?.style || 'Generated cover',
      taskId: taskId,
      timestamp: Date.now(),
      source: 'ghost-studio'
    };
    
    localStorage.setItem('son1kverse_ghost_result', JSON.stringify(resultData));
  };

  const reset = () => {
    setIsGenerating(false);
    setTaskId(null);
    setResult(null);
    setError(null);
  };

  return { 
    generateCover, 
    isGenerating, 
    taskId, 
    result, 
    error,
    generatorData,
    reset
  };
}