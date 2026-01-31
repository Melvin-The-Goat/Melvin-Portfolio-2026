// effects/LocalGlitch.jsx
import React, { useState, useEffect } from 'react';

export const LocalGlitch = ({ children }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200 + Math.random() * 300);
      
      // Random interval between 3 and 10 seconds
      const nextInterval = 3000 + Math.random() * 7000;
      setTimeout(triggerGlitch, nextInterval);
    };

    const initialTimer = setTimeout(triggerGlitch, 2000);
    return () => clearTimeout(initialTimer);
  }, []);

  return (
    <div className={`relative inline-block ${isGlitching ? 'animate-local-glitch' : ''}`}>
      {children}
      {isGlitching && (
        <>
          <span className="absolute top-0 left-0 w-full h-full text-cyan-400 opacity-70 -translate-x-1 mix-blend-screen overflow-hidden pointer-events-none">
            {children}
          </span>
          <span className="absolute top-0 left-0 w-full h-full text-pink-500 opacity-70 translate-x-1 mix-blend-screen overflow-hidden pointer-events-none">
            {children}
          </span>
        </>
      )}
      <style>{`
        @keyframes local-glitch {
          0% { clip-path: inset(80% 0 0 0); transform: translate(-2px); }
          20% { clip-path: inset(20% 0 60% 0); transform: translate(2px); }
          40% { clip-path: inset(40% 0 40% 0); transform: translate(-1px); }
          60% { clip-path: inset(10% 0 80% 0); transform: translate(1px); }
          80% { clip-path: inset(60% 0 20% 0); transform: translate(-2px); }
          100% { clip-path: inset(0 0 0 0); transform: translate(0); }
        }
        .animate-local-glitch {
          animation: local-glitch 0.3s step-end infinite;
        }
      `}</style>
    </div>
  );
};