// apps/the-generator/src/components/SunoIntegration.tsx
import { useState, useEffect } from 'react';
import { useSunoComplement } from '../hooks/useSunoComplement';
import { useGeneratorStore } from '../store/generatorStore';
import { UserInstanceInfo } from './UserInstanceInfo';
import { SunoPlayer } from './SunoPlayer';
import { SunoTrack } from '../services/sunoPolling';

export function SunoIntegration() {
  const { 
    generateWithComplement, 
    isGenerating,
    isPolling,
    result, 
    error,
    tokenStats,
    currentToken,
    pollingProgress,
    checkComplementAvailable
  } = useSunoComplement();
  
  const { generatedLyrics, generatedStyle } = useGeneratorStore();
  const [complementAvailable, setComplementAvailable] = useState(true); // Siempre disponible

  useEffect(() => {
    // El complemento está integrado, siempre disponible
    setComplementAvailable(true);
  }, []);

  const handleGenerate = async () => {
    // Leer directamente de los campos del DOM
    const lyricsTextarea = document.querySelector('textarea[placeholder*="letra"]') as HTMLTextAreaElement;
    const styleTextarea = document.querySelector('textarea[placeholder*="musical"]') as HTMLTextAreaElement;
    
    const lyrics = lyricsTextarea?.value?.trim() || '';
    const style = styleTextarea?.value?.trim() || '';
    
    if (!lyrics || !style) {
      alert('Por favor escribe letra y estilo musical en los campos de arriba');
      return;
    }

    try {
      await generateWithComplement(lyrics, style);
    } catch (err) {
      console.error('Error generating music:', err);
    }
  };

  if (!complementAvailable) {
    return (
      <div className="space-y-4">
        {/* Información de la instancia del usuario */}
        <UserInstanceInfo />
        
        {/* Reproductor Pre-montado */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center space-x-2">
              <span>🎵</span>
              <span>Reproductor de Música</span>
            </h3>
            <button 
              onClick={() => clearPlayer()}
              className="px-3 py-1 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-colors text-sm"
            >
              Limpiar
            </button>
          </div>
          
          <div id="musicPlayer" className="min-h-[200px] bg-black/20 border border-white/10 rounded-lg p-4">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-cyan text-4xl mb-3">🎵</div>
              <p className="text-white/70">El reproductor está listo. Genera música para comenzar.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-cyan text-2xl">🎵</div>
            <div>
            <h3 className="text-white font-semibold">Son1kVerse AI Music Complement</h3>
            <p className="text-white/70 text-sm">Genera música con IA usando tu letra y estilo</p>
            </div>
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full px-6 py-3 bg-cyan text-black rounded-lg hover:bg-cyan/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            {/* Foquito parpadeante rojo */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
            
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div>
                <span>
                  {isPolling ? `Polling... ${pollingProgress}%` : 'Generando música...'}
                </span>
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
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Información de la instancia del usuario */}
      <UserInstanceInfo />
      
      {/* Reproductor Pre-montado */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center space-x-2">
            <span>🎵</span>
            <span>Reproductor de Música</span>
          </h3>
          <button 
            onClick={() => clearPlayer()}
            className="px-3 py-1 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-colors text-sm"
          >
            Limpiar
          </button>
        </div>
        
        <div id="musicPlayer" className="min-h-[200px] bg-black/20 border border-white/10 rounded-lg p-4">
          {result && result.data ? (
            <SunoPlayer 
              tracks={Array.isArray(result.data) ? result.data : [result.data]}
              onTrackChange={(track, index) => {
                console.log(`Track ${index + 1} seleccionado:`, track.title);
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-cyan text-4xl mb-3">🎵</div>
              <p className="text-white/70">El reproductor está listo. Genera música para comenzar.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-cyan text-2xl">🎵</div>
          <div>
            <h3 className="text-white font-semibold">Son1kVerse AI Music Complement</h3>
            <p className="text-white/70 text-sm">Genera música con IA usando tu letra y estilo</p>
          </div>
        </div>
        
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full px-6 py-3 bg-cyan text-black rounded-lg hover:bg-cyan/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
        >
          {/* Foquito parpadeante rojo */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
          
          {isGenerating ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div>
              <span>
                {isPolling ? `Polling... ${pollingProgress}%` : 'Generando música...'}
              </span>
            </div>
          ) : (
            '🎵 Generar Música con IA'
          )}
        </button>
        
        {/* Información del token actual */}
        {currentToken && (
          <div className="mt-2 p-2 bg-white/5 rounded text-xs text-white/70">
            🔑 Token: {currentToken.substring(0, 20)}...
          </div>
        )}
        
        {/* Estadísticas de tokens */}
        {tokenStats && (
          <div className="mt-2 p-2 bg-white/5 rounded text-xs text-white/70">
            📊 Tokens válidos: {tokenStats.valid}/{tokenStats.total}
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">❌ {error}</p>
          </div>
        )}
      </div>
      
      {/* Información del resultado */}
      {result && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">📊 Información de Generación</h3>
          
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <h4 className="text-white font-medium mb-2">Detalles:</h4>
            <div className="text-white/70 text-sm space-y-1">
              <p><strong>Estado:</strong> {result.status || 'Generado'}</p>
              {result.data && (
                <p><strong>Tracks generados:</strong> {Array.isArray(result.data) ? result.data.length : 1}</p>
              )}
              <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
            </div>
          </div>
          
          {/* Botón para enviar a Ghost Studio */}
          <div className="flex space-x-3">
            <button 
              onClick={() => sendToGhostStudio()}
              className="flex-1 px-4 py-2 bg-magenta text-white rounded-lg hover:bg-magenta/80 transition-colors"
            >
              🎤 Enviar a Ghost Studio
            </button>
          </div>
        </div>
      )}
    </div>
  );

  function clearPlayer() {
    // Limpiar el resultado y el reproductor
    // Esto debería ser manejado por el hook useSunoExtension
    console.log('Limpiando reproductor...');
  }

  function sendToGhostStudio() {
    // Guardar datos para Ghost Studio
    const tracks = Array.isArray(result?.data) ? result.data : (result?.data ? [result.data] : []);
    
    const data = {
      lyrics: generatedLyrics,
      style: generatedStyle,
      generatedTracks: tracks,
      primaryTrack: tracks[0], // Primer track como principal
      timestamp: Date.now(),
      source: 'the-generator',
      tracksCount: tracks.length
    };
    
    localStorage.setItem('son1kverse_generator_data', JSON.stringify(data));
    
    // Abrir Ghost Studio en nueva pestaña
    window.open('/ghost-studio', '_blank');
  }
}
