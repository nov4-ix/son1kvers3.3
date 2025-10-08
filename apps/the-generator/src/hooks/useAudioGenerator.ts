// src/hooks/useAudioGenerator.ts
import { useGeneratorStore } from '../store/generatorStore';
import { createAudio, getAudioStatus } from '../lib/provider';

export function useAudioGenerator() {
  const { lyrics, stylePrompt, setAudioStatus, setStream, setDownload } = useGeneratorStore();
  
  return async function generateAudio() {
    setAudioStatus('generating');
    const { taskId } = await createAudio({ lyrics, stylePrompt });
    
    // Polling simple
    const poll = async () => {
      const s = await getAudioStatus(taskId);
      if (s.status === 'completed') { 
        setStream(s.streamUrl); 
        setDownload(s.downloadUrl); 
        setAudioStatus('ready'); 
        return; 
      }
      if (s.status === 'failed') { 
        setAudioStatus('error'); 
        return; 
      }
      setTimeout(poll, 4000);
    };
    
    await poll();
  };
}
