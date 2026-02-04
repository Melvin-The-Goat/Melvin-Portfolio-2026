import React, { useState, useEffect } from 'react';

export const LocalGlitch = ({ children, isActive: manualTrigger = false, enabled = true }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsGlitching(false);
      return;
    }

    const triggerGlitch = () => {
      if (!manualTrigger && enabled) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 180);
        setTimeout(triggerGlitch, 5000 + Math.random() * 5000);
      }
    };

    const timer = setTimeout(triggerGlitch, 3000);
    return () => clearTimeout(timer);
  }, [manualTrigger, enabled]);

  const currentlyGlitching = enabled && (manualTrigger || isGlitching);

  /**
   * FIX 1: The root is now 'inline' instead of 'inline-block'.
   * This allows the browser to highlight "MELVIN" and "BOATENG" as one continuous line.
   * * FIX 2: The glitch container and its layers now use 'block' and 'inset-0'.
   * This ensures that when the card image glitches, the colored layers actually fill the
   * dimensions of the image instead of collapsing into a 0-pixel "black" box.
   */
  return (
    <span className="relative inline">
      {children}
      {currentlyGlitching && (
        <span className="absolute inset-0 pointer-events-none select-none overflow-hidden block animate-local-tear">
          {/* Blue Channel Layer */}
          <span className="text-[#0EA5E9] opacity-70 translate-x-1 mix-blend-screen absolute inset-0 w-full h-full block">
            {children}
          </span>
          {/* Pink Channel Layer */}
          <span className="text-[#EC4899] opacity-70 -translate-x-1 mix-blend-screen absolute inset-0 w-full h-full block">
            {children}
          </span>
          {/* Red Channel Layer */}
          <span className="text-red-500 opacity-40 translate-y-0.5 mix-blend-screen absolute inset-0 w-full h-full block">
            {children}
          </span>
        </span>
      )}
      <style>{`
        @keyframes local-tear {
          0% { clip-path: inset(20% 0 50% 0); transform: translate(-4px); }
          25% { clip-path: inset(10% 0 80% 0); transform: translate(4px); }
          50% { clip-path: inset(70% 0 10% 0); transform: translate(-2px); }
          75% { clip-path: inset(40% 0 40% 0); transform: translate(2px); }
          100% { clip-path: inset(0 0 0 0); transform: translate(0); }
        }
        .animate-local-tear {
          animation: local-tear 0.15s step-end infinite;
        }
      `}</style>
    </span>
  );
};