import { useEffect } from 'react';
import { X } from 'lucide-react';

const ProjectDetailModal = ({ project, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (project) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-gray-900 border border-gray-700 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col md:flex-row">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 bg-gray-800 p-2 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Bigger Window (Media Area) */}
        <div className="w-full md:w-3/5 bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
          {project.video ? (
            <video 
              src={project.video} 
              controls 
              autoPlay 
              className="w-full max-h-[500px]"
              poster={project.image}
            />
          ) : project.image ? (
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-contain max-h-[500px]" 
            />
          ) : (
            <div className="text-6xl opacity-20">{project.category === 'Game Dev' ? '🎮' : '💻'}</div>
          )}
        </div>

        {/* Breakdown Content */}
        <div className="w-full md:w-2/5 p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            {project.title}
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            {project.description}
          </p>

          {project.technicalHighlights && project.technicalHighlights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-cyan-400 font-semibold mb-3 text-lg">Technical Highlights</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technicalHighlights.map((highlight, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-full border border-purple-700/50">
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.techStack && project.techStack.length > 0 && (
            <div className="mb-6">
              <h3 className="text-purple-400 font-semibold mb-3 text-lg">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-800 text-cyan-400 text-xs rounded-full border border-gray-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.codeLink && project.codeLink !== "#" && (
            <div className="flex gap-4">
              <a 
                href={project.codeLink} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 text-center bg-cyan-600 hover:bg-cyan-500 py-3 rounded-lg font-bold transition-all"
              >
                {project.codeLink.includes('github.com') ? 'View Code' : project.codeLink.includes('roblox.com') ? 'Play Game' : 'View Project'}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
