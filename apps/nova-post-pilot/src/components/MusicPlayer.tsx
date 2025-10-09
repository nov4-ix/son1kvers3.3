// apps/nova-post-pilot/src/components/MusicPlayer.tsx
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Download } from 'lucide-react';
import { SunoTrack } from '../services/sunoApi';

interface MusicPlayerProps {
  tracks: SunoTrack[];
  className?: string;
}

export function MusicPlayer({ tracks, className = '' }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (currentTrackIndex < tracks.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, tracks.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const downloadTrack = () => {
    if (currentTrack.audio_url) {
      const link = document.createElement('a');
      link.href = currentTrack.audio_url;
      link.download = `${currentTrack.title}.mp3`;
      link.click();
    }
  };

  if (!tracks.length || !currentTrack) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 ${className}`}
    >
      {/* Track Info */}
      <div className="flex items-center gap-4 mb-6">
        {currentTrack.image_url && (
          <img
            src={currentTrack.image_url}
            alt={currentTrack.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{currentTrack.title}</h3>
          <p className="text-sm text-[#9AF7EE]">
            Track {currentTrackIndex + 1} de {tracks.length}
          </p>
          {currentTrack.tags && (
            <p className="text-xs text-gray-400 mt-1">
              {currentTrack.tags.join(', ')}
            </p>
          )}
        </div>
        <button
          onClick={downloadTrack}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Descargar"
        >
          <Download className="w-5 h-5 text-[#00FFE7]" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}</span>
          <span>{Math.floor(duration / 60)}:{(duration % 60).toFixed(0).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={prevTrack}
          disabled={currentTrackIndex === 0}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
        >
          <SkipBack className="w-5 h-5 text-white" />
        </button>
        
        <button
          onClick={togglePlayPause}
          className="p-3 bg-gradient-to-r from-[#00FFE7] to-[#B84DFF] rounded-full hover:scale-105 transition-transform"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-[#0A0C10]" />
          ) : (
            <Play className="w-6 h-6 text-[#0A0C10]" />
          )}
        </button>
        
        <button
          onClick={nextTrack}
          disabled={currentTrackIndex === tracks.length - 1}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
        >
          <SkipForward className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2">
        <Volume2 className="w-4 h-4 text-gray-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
        />
        <span className="text-xs text-gray-400 w-8">{Math.round(volume * 100)}%</span>
      </div>

      {/* Track List */}
      {tracks.length > 1 && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <h4 className="text-sm font-medium text-white mb-3">Tracks disponibles:</h4>
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => setCurrentTrackIndex(index)}
                className={`w-full text-left p-2 rounded-lg transition-colors ${
                  index === currentTrackIndex
                    ? 'bg-[#00FFE7]/20 text-[#00FFE7]'
                    : 'hover:bg-white/5 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {track.image_url && (
                    <img
                      src={track.image_url}
                      alt={track.title}
                      className="w-8 h-8 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{track.title}</p>
                    {track.tags && (
                      <p className="text-xs text-gray-400">{track.tags.join(', ')}</p>
                    )}
                  </div>
                  {index === currentTrackIndex && isPlaying && (
                    <div className="w-2 h-2 bg-[#00FFE7] rounded-full animate-pulse" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.audio_url}
        preload="metadata"
      />
    </motion.div>
  );
}
