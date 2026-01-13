import { useState, useRef, useEffect } from 'react';
import { Code2 } from 'lucide-react';

const ProjectCard = ({ title, description, techStack, category, codeLink, featured, image, video, technicalHighlights, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered && video) {
        videoRef.current.play().catch(() => {
          // Handle autoplay restrictions silently
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, video]);

  return (
    <div 
      className={`group bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500 transition-all cursor-pointer transform hover:-translate-y-2 ${featured ? 'ring-2 ring-cyan-500' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Media Container */}
      <div className="relative h-48 w-full bg-gray-900 overflow-hidden">
        {isHovered && video ? (
          <video
            ref={videoRef}
            src={video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          <img 
            src={image || "/placeholder-game.png"} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">{title}</h3>
          {codeLink && codeLink !== "#" && (
            <a 
              href={codeLink} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Code2 size={20} />
            </a>
          )}
        </div>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{description}</p>
        
        {technicalHighlights && technicalHighlights.length > 0 && (
          <div className="mb-4">
            <h4 className="text-purple-400 font-semibold text-xs mb-2">Technical Highlights:</h4>
            <div className="flex flex-wrap gap-2">
              {technicalHighlights.map((highlight, i) => (
                <span key={i} className="px-3 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-full border border-purple-700/50">
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-gray-900 text-cyan-400 rounded border border-gray-700">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

