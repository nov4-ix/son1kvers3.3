// apps/the-generator/src/components/SunoIntegration.tsx
import { useState, useEffect } from 'react';
import { useSunoExtension } from '../hooks/useSunoExtension';
import { useGeneratorStore } from '../store/generatorStore';

export function SunoIntegration() {
  const { 
    generateWithExtension, 
    isGenerating, 
    result, 
    error,
    checkExtensionAvailable,
    installExtension
  } = useSunoExtension();
  
  const { generatedLyrics, generatedStyle } = useGeneratorStore();
  const [extensionAvailable, setExtensionAvailable] = useState(false);

  useEffect(() => {
    setExtensionAvailable(checkExtensionAvailable());
  }, []);

  const handleGenerate = async () => {
    if (!generatedLyrics || !generatedStyle) {
      alert('Por favor genera primero la letra y el estilo musical');
      return;
    }

    try {
      await generateWithExtension(generatedLyrics, generatedStyle);
    } catch (err) {
      console.error('Error generating music:', err);
    }
  };

  if (!extensionAvailable) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="text-cyan text-4xl">🎵</div>
          <h3 className="text-white font-semibold text-lg">
            Son1kVerse AI Music Engine
          </h3>
          <p className="text-white/70 text-sm">
            Para generar música necesitas instalar la extensión de Chrome
          </p>
          <button 
            onClick={installExtension}
            className="px-6 py-3 bg-cyan text-black rounded-lg hover:bg-cyan/80 transition-colors"
          >
            📦 Instalar Extensión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-cyan text-2xl">🎵</div>
          <div>
            <h3 className="text-white font-semibold">Son1kVerse AI Music Engine</h3>
            <p className="text-white/70 text-sm">Genera música con IA usando tu letra y estilo</p>
          </div>
        </div>
        
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !generatedLyrics || !generatedStyle}
          className="w-full px-6 py-3 bg-cyan text-black rounded-lg hover:bg-cyan/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div>
              <span>Generando música...</span>
            </div>
          ) : (
            '🎵 Generar Música con IA'
          )}
        </button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">❌ {error}</p>
          </div>
        )}
      </div>
      
      {result && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">🎵 Música Generada</h3>
          
          <div className="space-y-4">
            {/* Mostrar información del resultado */}
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Información:</h4>
              <div className="text-white/70 text-sm space-y-1">
                <p><strong>Estado:</strong> {result.status || 'Generado'}</p>
                {result.task_id && <p><strong>Task ID:</strong> {result.task_id}</p>}
                {result.response?.data?.taskId && (
                  <p><strong>Suno Task ID:</strong> {result.response.data.taskId}</p>
                )}
              </div>
            </div>
            
            {/* Si hay URL de audio, mostrar reproductor */}
            {result.audio_url && (
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Reproducir:</h4>
                <audio controls className="w-full">
                  <source src={result.audio_url} type="audio/mpeg" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
              </div>
            )}
            
            {/* Botón para enviar a Ghost Studio */}
            <div className="flex space-x-3">
              <button 
                onClick={() => sendToGhostStudio()}
                className="flex-1 px-4 py-2 bg-magenta text-white rounded-lg hover:bg-magenta/80 transition-colors"
              >
                🎤 Enviar a Ghost Studio
              </button>
              
              {result.audio_url && (
                <a 
                  href={result.audio_url}
                  download="generated-music.mp3"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  💾 Descargar
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function sendToGhostStudio() {
    // Guardar datos para Ghost Studio
    const data = {
      lyrics: generatedLyrics,
      style: generatedStyle,
      generatedAudio: result?.audio_url,
      timestamp: Date.now(),
      source: 'the-generator'
    };
    
    localStorage.setItem('son1kverse_generator_data', JSON.stringify(data));
    
    // Abrir Ghost Studio en nueva pestaña
    window.open('/ghost-studio', '_blank');
  }
}
