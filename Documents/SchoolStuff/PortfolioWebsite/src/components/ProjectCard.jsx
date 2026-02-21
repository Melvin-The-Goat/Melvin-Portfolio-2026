import { useState, useRef, useEffect } from 'react';
import { Code2 } from 'lucide-react';
import { LocalGlitch } from './effects/LocalGlitch';
import { analytics } from '../utils/analytics';

const ProjectCard = ({ title, description, techStack, codeLink, featured, image, video, onClick, onTriggerGlitch, isCyberMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [glitchFinished, setGlitchFinished] = useState(false);
  const videoRef = useRef(null);

  // Sequence: Hover -> 400ms Glitch -> Show Video (Only if System is Online)
  useEffect(() => {
    let timer;
    if (isHovered && video) {
      if (isCyberMode) {
        // Wait for glitch if online
        timer = setTimeout(() => {
          setGlitchFinished(true);
        }, 400);
      } else {
        // Skip glitch if offline
        setGlitchFinished(true);
      }
    } else if (!isHovered) {
      setGlitchFinished(false);
    }
    return () => clearTimeout(timer);
  }, [isHovered, video, isCyberMode]);

  useEffect(() => {
    if (videoRef.current && glitchFinished) {
      videoRef.current.play().catch(() => {});
    }
  }, [glitchFinished]);

  const handleCardClick = (e) => {
    e.stopPropagation();
    if (isCyberMode) {
      onTriggerGlitch?.('medium'); // Burst effect ONLY if online
      setTimeout(() => onClick(), 250);
    } else {
      onClick(); // Immediate open if offline
    }
  };

  return (
    <div 
      className={`group bg-gray-900/80 rounded-xl overflow-hidden border border-white/10 hover:border-[#0EA5E9]/50 transition-all cursor-pointer transform hover:-translate-y-2 ${featured ? 'ring-2 ring-[#0EA5E9]' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative h-48 w-full bg-black overflow-hidden">
        {isHovered && video && glitchFinished ? (
          <video
            ref={videoRef}
            src={video}
            muted
            loop
            playsInline
            className="w-full h-full object-cover relative z-30" 
          />
        ) : (
          /* Added enabled={isCyberMode} to disable all glitching logic when offline */
          <LocalGlitch isActive={isHovered && !glitchFinished} enabled={isCyberMode}>
            <img 
              src={image || "/placeholder-game.png"} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </LocalGlitch>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80 z-20 pointer-events-none" />
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          {/* Added enabled={isCyberMode} here as well */}
          <LocalGlitch isActive={isHovered && !glitchFinished} enabled={isCyberMode}>
            <h3 className="text-xl font-bold text-white group-hover:text-[#0EA5E9] transition-colors">{title}</h3>
          </LocalGlitch>
          {codeLink && codeLink !== "#" && (
            <a 
              href={codeLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={(e) => {
                e.stopPropagation();
                const linkType = codeLink.includes('github.com') ? 'GitHub' : 
                                codeLink.includes('roblox.com') ? 'Roblox' : 'External';
                analytics.trackProjectClick(title, linkType);
              }} 
              className="text-[#0EA5E9] hover:text-white z-40"
            >
              <Code2 size={20} />
            </a>
          )}
        </div>
        <p className="text-gray-400 text-sm line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2">
          {techStack?.map((tech, i) => (
            <span key={i} className="text-[10px] font-mono px-2 py-1 bg-white/5 text-gray-500 rounded border border-white/10">{tech}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;