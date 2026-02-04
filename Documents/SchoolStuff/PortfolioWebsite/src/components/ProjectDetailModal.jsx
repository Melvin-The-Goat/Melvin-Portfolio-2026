import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ProjectDetailModal = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (project) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setCurrentImageIndex(0);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [project, onClose]);

  if (!project) return null;

  // DYNAMIC BUTTON TEXT LOGIC
  const getButtonText = () => {
    const link = project.codeLink || "";
    if (link.includes("roblox.com")) return "Play Game";
    if (link.includes("github.com")) return "View Code";
    if (link.includes("replit.com") || link.includes("render.com")) return "View Project";
    return "Launch Application";
  };

  const nextImage = () => {
    if (project.gallery) setCurrentImageIndex((prev) => (prev + 1) % project.gallery.length);
  };

  const prevImage = () => {
    if (project.gallery) setCurrentImageIndex((prev) => (prev - 1 + project.gallery.length) % project.gallery.length);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 animate-fade-in">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-gray-950 border border-white/10 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col md:flex-row">
        
        {/* Media Window */}
        <div className="w-full md:w-3/5 bg-black flex items-center justify-center min-h-[350px] md:min-h-[550px] relative border-r border-white/5 group">
          <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-white z-50 bg-gray-900/80 p-2 rounded-full md:hidden">
            <X size={20} />
          </button>

          {project.gallery ? (
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <img 
                key={currentImageIndex}
                src={project.gallery[currentImageIndex]} 
                alt={`${project.title} slide ${currentImageIndex + 1}`}
                className="w-full h-full object-contain animate-fade-in"
              />
              <button onClick={prevImage} className="absolute left-4 p-3 bg-black/60 rounded-full text-white hover:bg-[#0EA5E9] transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextImage} className="absolute right-4 p-3 bg-black/60 rounded-full text-white hover:bg-[#0EA5E9] transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100">
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-6 flex gap-2">
                {project.gallery.map((_, idx) => (
                  <div key={idx} className={`h-1.5 w-4 rounded-full transition-all ${idx === currentImageIndex ? 'bg-[#0EA5E9] w-8' : 'bg-white/20'}`} />
                ))}
              </div>
            </div>
          ) : project.video ? (
            <video src={project.video} controls autoPlay className="w-full h-full object-contain" poster={project.image} />
          ) : (
            <img src={project.image} alt={project.title} className="w-full h-full object-contain" />
          )}
        </div>

        {/* Content Section */}
        <div className="w-full md:w-2/5 p-8 md:p-12 overflow-y-auto bg-gray-950 flex flex-col justify-between relative">
          <button onClick={onClose} className="hidden md:block absolute top-8 right-8 text-gray-500 hover:text-[#EC4899] transition-colors">
            <X size={28} />
          </button>

          <div>
            <h2 className="text-4xl font-black italic uppercase mb-6 text-[#0EA5E9] tracking-tighter">{project.title}</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">{project.description}</p>

            {/* Technical Highlights Section */}
            {project.technicalHighlights && (
              <div className="mb-8">
                <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-4 border-l-2 border-[#EC4899] pl-3 italic">Technical Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technicalHighlights.map((h, i) => (
                    <span key={i} className="px-3 py-1 bg-[#EC4899]/10 text-[#EC4899] text-xs font-mono border border-[#EC4899]/20 rounded uppercase">{h}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Development Stack Section */}
            <div className="mb-10">
              <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-4 border-l-2 border-[#0EA5E9] pl-3 italic">Development Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((t, i) => (
                  <span key={i} className="px-3 py-1 bg-black text-[#0EA5E9] text-xs font-mono border border-[#0EA5E9]/30 rounded uppercase">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* DYNAMIC BUTTON */}
          {project.codeLink && (
            <a href={project.codeLink} target="_blank" rel="noreferrer" 
               className="w-full py-4 bg-[#0EA5E9] text-white font-black uppercase italic text-center rounded hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all">
              {getButtonText()}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;