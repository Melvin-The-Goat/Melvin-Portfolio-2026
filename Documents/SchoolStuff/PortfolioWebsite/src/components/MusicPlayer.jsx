import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Minimize2, Maximize2 } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(true);
  const audioRef = useRef(null);
  const animationRef = useRef(null);

  const playlist = [
    { title: 'Cyberpunk Dreams', artist: 'Synthwave', duration: '3:45', file: '/music/track1.mp3' },
    { title: 'Neural Network', artist: 'Electronic', duration: '4:12', file: '/music/track2.mp3' },
    { title: 'Code & Coffee', artist: 'Lo-fi Beats', duration: '3:28', file: '/music/track3.mp3' }
  ];

  const currentSong = playlist[currentTrack];

  // Visualizer bars animation
  const [bars, setBars] = useState(Array(20).fill(0.2));
  
  useEffect(() => {
    if (isPlaying && showVisualizer) {
      const interval = setInterval(() => {
        setBars(prev => prev.map(() => Math.random() * 0.8 + 0.2));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, showVisualizer]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In real implementation: audioRef.current?.play() or pause()
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    setProgress(0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Simulate progress
  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            nextTrack();
            return 0;
          }
          return prev + 0.5;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isPlaying]);

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="group relative bg-gradient-to-br from-purple-600/90 to-pink-600/90 backdrop-blur-md border border-white/20 rounded-full p-4 hover:scale-110 transition-all shadow-lg hover:shadow-purple-500/50"
        >
          <Music className={isPlaying ? 'animate-pulse' : ''} size={24} />
          {isPlaying && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96">
      {/* Main Player Card */}
      <div className="bg-gray-900/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Visualizer */}
        {showVisualizer && (
          <div className="h-16 bg-gradient-to-r from-purple-900/50 to-pink-900/50 flex items-end justify-around px-4 gap-1">
            {bars.map((height, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-purple-400 to-pink-400 rounded-full transition-all duration-100"
                style={{ 
                  height: `${isPlaying ? height * 100 : 20}%`,
                  opacity: isPlaying ? 1 : 0.3
                }}
              />
            ))}
          </div>
        )}

        {/* Track Info */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Music size={16} className="text-purple-400 flex-shrink-0" />
                <h3 className="text-white font-bold text-lg truncate">{currentSong.title}</h3>
              </div>
              <p className="text-gray-400 text-sm">{currentSong.artist}</p>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="relative h-1 bg-gray-700 rounded-full overflow-hidden group cursor-pointer">
              <div 
                className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 w-3 h-3 bg-white rounded-full -translate-y-1/4 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 font-mono">
              <span>{Math.floor(progress / 100 * 225 / 60)}:{String(Math.floor(progress / 100 * 225 % 60)).padStart(2, '0')}</span>
              <span>{currentSong.duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevTrack}
                className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
              >
                <SkipBack size={20} />
              </button>
              <button
                onClick={togglePlay}
                className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full transition-all hover:scale-110 shadow-lg"
              >
                {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" />}
              </button>
              <button
                onClick={nextTrack}
                className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
              >
                <SkipForward size={20} />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 
                         [&::-webkit-slider-thumb]:hover:bg-purple-400 [&::-webkit-slider-thumb]:transition-colors"
              />
            </div>
          </div>

          {/* Playlist Preview */}
          <div className="pt-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 mb-2 font-mono uppercase tracking-wider">Up Next</div>
            <div className="space-y-1">
              {playlist.slice(currentTrack + 1, currentTrack + 3).map((track, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm text-gray-400 hover:text-white transition-colors cursor-pointer p-1 rounded hover:bg-white/5">
                  <span className="truncate flex-1">{track.title}</span>
                  <span className="text-xs font-mono">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Glitch Effect Overlay (triggers on track change) */}
        {progress < 1 && progress > 0 && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse pointer-events-none"></div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;