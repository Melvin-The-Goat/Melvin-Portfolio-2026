import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Box, Cpu } from 'lucide-react';
import ModelViewer from './ModelViewer';

const ArtCarousel = ({ artworks }) => {
  const [index, setIndex] = useState(0);
  // Guard clause: if no artworks, show nothing
  if (!artworks || artworks.length === 0) return null;

  const current = artworks[index];

  const next = () => setIndex((prev) => (prev + 1) % artworks.length);
  const prev = () => setIndex((prev) => (prev - 1 + artworks.length) % artworks.length);

  return (
    <div className="relative group max-w-6xl mx-auto bg-gray-900/50 border border-white/10 rounded-none backdrop-blur-xl shadow-[0_0_30px_rgba(14,165,233,0.15)] mt-10">
      
      {/* 3D Main Stage */}
      <div className="h-[500px] md:h-[600px] w-full relative bg-gradient-to-b from-transparent to-cyan-900/10">
        <ModelViewer key={current.modelPath} modelPath={current.modelPath} />
        
        {/* Navigation Arrows */}
        <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 p-4 hover:bg-cyan-500 text-white transition-all z-10 -skew-x-12 border-r border-white/20 bg-black/40 group/btn">
          <div className="skew-x-12"><ChevronLeft size={32} /></div>
        </button>
        <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 p-4 hover:bg-cyan-500 text-white transition-all z-10 -skew-x-12 border-l border-white/20 bg-black/40 group/btn">
          <div className="skew-x-12"><ChevronRight size={32} /></div>
        </button>
      </div>

      {/* Info Panel: Persona Style */}
      <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col md:flex-row justify-between items-end pointer-events-none">
        
        {/* Title Box (Slanted) */}
        <div className="-skew-x-12 bg-[#EC4899] p-4 md:p-6 border-l-8 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] mb-4 md:mb-0 pointer-events-auto">
          <h2 className="text-2xl md:text-4xl font-black italic uppercase text-white tracking-tighter skew-x-12">
            {current.title}
          </h2>
          <div className="flex gap-4 mt-2 skew-x-12">
            <span className="flex items-center gap-1 text-xs font-mono text-black bg-white/90 px-2 py-0.5 font-bold">
              <Cpu size={12} /> {current.technicalDetails?.[0] || 'TECH'}
            </span>
            <span className="flex items-center gap-1 text-xs font-mono text-black bg-white/90 px-2 py-0.5 font-bold">
              <Box size={12} /> GLB ASSET
            </span>
          </div>
        </div>

        {/* Description Text */}
        <div className="max-w-md text-right pointer-events-auto">
          <p className="text-gray-300 text-sm md:text-base leading-relaxed font-medium italic bg-black/50 p-2 rounded backdrop-blur-sm">
            {current.description}
          </p>
          <div className="mt-2 text-cyan-400 font-mono text-xs uppercase tracking-widest">
            {index + 1} / {artworks.length} // ASSET_VIEWER_V1.0
          </div>
        </div>
      </div>
    </div>
  );
};

// Remove 'default' and use curly braces to export it specifically
export { ArtCarousel };