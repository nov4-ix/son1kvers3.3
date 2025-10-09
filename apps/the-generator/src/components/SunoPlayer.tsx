// apps/the-generator/src/components/SunoPlayer.tsx
import { useState, useRef, useEffect } from 'react';

interface SunoTrack {
  audio_url: string;
  image_url?: string;
  title: string;
  duration: number;
  id: string;
  prompt: string;
  tags: string;
  source_audio_url?: string;
  source_image_url?: string;
  source_stream_audio_url?: string;
  stream_audio_url?: string;
}

interface SunoPlayerProps {
  tracks: SunoTrack[];
  onTrackChange?: (track: SunoTrack, index: number) => void;
}

export function SunoPlayer({ tracks, onTrackChange }: SunoPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  // Efectos para manejar el audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      setError(null);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      // Auto-play siguiente track si existe
      if (currentTrackIndex < tracks.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = () => {
      setError('Error al cargar el audio');
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [currentTrack, currentTrackIndex, tracks.length]);

  // Notificar cambio de track
  useEffect(() => {
    if (currentTrack && onTrackChange) {
      onTrackChange(currentTrack, currentTrackIndex);
    }
  }, [currentTrack, currentTrackIndex, onTrackChange]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const nextTrack = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  const prevTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  if (!tracks || tracks.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="text-center text-white/60">
          <div className="text-4xl mb-2">🎵</div>
          <p>No hay tracks disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      {/* Información del track actual */}
      <div className="flex items-center space-x-4 mb-4">
        {currentTrack.image_url && (
          <img 
            src={currentTrack.image_url} 
            alt={currentTrack.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <h3 className="text-white font-semibold">{currentTrack.title}</h3>
          <p className="text-white/60 text-sm">{currentTrack.tags}</p>
          <p className="text-white/40 text-xs">
            Track {currentTrackIndex + 1} de {tracks.length}
          </p>
        </div>
      </div>

      {/* Reproductor de audio */}
      <audio
        ref={audioRef}
        src={currentTrack.audio_url}
        volume={volume}
        preload="metadata"
      />

      {/* Controles principales */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={prevTrack}
          disabled={currentTrackIndex === 0}
          className="p-2 text-white/60 hover:text-white disabled:opacity-30"
        >
          ⏮️
        </button>
        
        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          className="p-3 bg-cyan text-black rounded-full hover:bg-cyan/80 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="animate-spin w-6 h-6 border-2 border-black border-t-transparent rounded-full"></div>
          ) : isPlaying ? (
            '⏸️'
          ) : (
            '▶️'
          )}
        </button>
        
        <button
          onClick={nextTrack}
          disabled={currentTrackIndex === tracks.length - 1}
          className="p-2 text-white/60 hover:text-white disabled:opacity-30"
        >
          ⏭️
        </button>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          className="w-full h-2 bg-white/20 rounded-full cursor-pointer"
        >
          <div
            className="h-full bg-cyan rounded-full transition-all duration-100"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/60 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Control de volumen */}
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-white/60 text-sm">🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-white/60 text-xs">{Math.round(volume * 100)}%</span>
      </div>

      {/* Lista de tracks */}
      {tracks.length > 1 && (
        <div className="space-y-2">
          <h4 className="text-white font-medium text-sm">Tracks disponibles:</h4>
          {tracks.map((track, index) => (
            <button
              key={track.id}
              onClick={() => setCurrentTrackIndex(index)}
              className={`w-full p-2 rounded-lg text-left transition-colors ${
                index === currentTrackIndex
                  ? 'bg-cyan/20 border border-cyan/30'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-white/60 text-xs">#{index + 1}</span>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{track.title}</p>
                  <p className="text-white/60 text-xs">{track.tags}</p>
                </div>
                {index === currentTrackIndex && (
                  <span className="text-cyan">▶️</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex space-x-2 mt-4">
        <a
          href={currentTrack.audio_url}
          download={`${currentTrack.title}.mp3`}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center"
        >
          💾 Descargar
        </a>
        
        <button
          onClick={() => {
            // Copiar URL al clipboard
            navigator.clipboard.writeText(currentTrack.audio_url);
            alert('URL copiada al clipboard');
          }}
          className="px-4 py-2 bg-magenta text-white rounded-lg hover:bg-magenta/80 transition-colors"
        >
          📋 Copiar URL
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">❌ {error}</p>
        </div>
      )}
    </div>
  );
}
