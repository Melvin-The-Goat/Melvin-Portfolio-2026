import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Minimize2 } from 'lucide-react';

const MusicPlayer = ({ onTrackChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const audioRef = useRef(null);

  // Updated Playlist with your specific files
  const playlist = [
    { 
      title: 'TECH BEAT', 
      artist: 'Melvin Boateng', 
      file: '/TECH BEAT FINISHED 215BPM (1).mp3' // Ensure this matches your file extension
    },
    { 
      title: 'Greener Pastures', 
      artist: 'Melvin Boateng', 
      file: '/GreenerPastures.wav' 
    }
  ];

  const currentSong = playlist[currentTrack];

  // Visualizer bars animation state
  const [bars, setBars] = useState(Array(20).fill(0.2));
  
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setBars(prev => prev.map(() => Math.random() * 0.8 + 0.2));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Audio Logic
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Playback failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  const changeTrack = (index) => {
    setCurrentTrack(index);
    setCurrentTime(0);
    setIsPlaying(true);
    onTrackChange?.(); // Trigger global glitch on track change
    // Small timeout to allow source change before play
    setTimeout(() => {
      audioRef.current.play().catch(() => {});
    }, 10);
  };

  const nextTrack = () => changeTrack((currentTrack + 1) % playlist.length);
  const prevTrack = () => changeTrack((currentTrack - 1 + playlist.length) % playlist.length);

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="group relative bg-gradient-to-br from-[#0EA5E9]/90 to-[#EC4899]/90 backdrop-blur-md border border-white/20 rounded-full p-4 hover:scale-110 transition-all shadow-lg hover:shadow-[#0EA5E9]/50"
        >
          <Music className={isPlaying ? 'animate-pulse' : ''} size={24} color="white" />
          {isPlaying && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96 animate-fade-in">
      {/* Real Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.file}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        onLoadedMetadata={handleTimeUpdate}
      />

      <div className="bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Visualizer Area */}
        <div className="h-16 bg-black/40 flex items-end justify-around px-6 gap-1 border-b border-white/5">
          {bars.map((height, i) => (
            <div
              key={i}
              className="w-1 bg-[#0EA5E9] rounded-full transition-all duration-100"
              style={{ 
                height: `${isPlaying ? height * 100 : 20}%`,
                opacity: isPlaying ? 1 : 0.3,
                boxShadow: isPlaying ? '0 0 10px #0EA5E9' : 'none'
              }}
            />
          ))}
        </div>

        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-black italic uppercase text-sm truncate tracking-tighter">
                {currentSong.title}
              </h3>
              <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">{currentSong.artist}</p>
            </div>
            <button onClick={() => setIsMinimized(true)} className="text-gray-500 hover:text-[#EC4899] transition-colors">
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="100"
              value={(currentTime / duration) * 100 || 0}
              onChange={handleProgressChange}
              className="w-full h-1 bg-gray-800 rounded-full appearance-none cursor-pointer accent-[#EC4899]"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={prevTrack} className="p-2 text-gray-400 hover:text-white transition-all"><SkipBack size={20} /></button>
              <button
                onClick={togglePlay}
                className="p-3 bg-white text-black rounded-full hover:scale-110 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" />}
              </button>
              <button onClick={nextTrack} className="p-2 text-gray-400 hover:text-white transition-all"><SkipForward size={20} /></button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 group">
              <button onClick={() => setIsMuted(!isMuted)} className="text-gray-500 hover:text-white transition-colors">
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0" max="1" step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-gray-800 rounded-full appearance-none accent-[#0EA5E9]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;