// effects/GlitchEffect.jsx
import React, { useState, useEffect } from 'react';

export const GlitchEffect = ({ isActive, onComplete, mode = 'standard' }) => {
  const [glitchStage, setGlitchStage] = useState(0);

  useEffect(() => {
    if (isActive) {
      setGlitchStage(1);
      const timer1 = setTimeout(() => setGlitchStage(2), mode === 'heavy' ? 150 : 100);
      const timer2 = setTimeout(() => setGlitchStage(3), mode === 'heavy' ? 300 : 200);
      const timer3 = setTimeout(() => {
        setGlitchStage(0);
        onComplete?.();
      }, mode === 'heavy' ? 600 : 400);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isActive, onComplete, mode]);

  if (!isActive) return null;

  return (
    <>
      {/* RGB Split Overlay */}
      <div 
        className={`fixed inset-0 pointer-events-none z-[9999] mix-blend-screen transition-opacity duration-75`}
        style={{
          animation: mode === 'heavy' ? 'heavy-rgb 0.5s step-end infinite' : 'rgb-split 0.4s ease-out',
          opacity: glitchStage > 0 ? 1 : 0
        }}
      >
        <div className="absolute inset-0 bg-red-500/30" style={{ transform: `translate(${glitchStage * 5}px, 2px)` }}></div>
        <div className="absolute inset-0 bg-cyan-500/30" style={{ transform: `translate(-${glitchStage * 5}px, -2px)` }}></div>
      </div>

      {/* Digital Corruption Strips (Image 3 Style) */}
      {mode === 'heavy' && glitchStage === 2 && (
        <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-full bg-cyan-500/20 border-y border-white/10"
              style={{
                height: Math.random() * 100 + 'px',
                top: Math.random() * 100 + '%',
                left: (Math.random() - 0.5) * 50 + 'px',
                filter: 'hue-rotate(90deg) brightness(2)'
              }}
            />
          ))}
        </div>
      )}

      {/* Static Noise Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999] opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
          display: glitchStage === 3 ? 'block' : 'none'
        }}
      />

      <style>{`
        @keyframes rgb-split {
          0%, 100% { transform: scale(1); filter: hue-rotate(0deg); }
          50% { transform: scale(1.02); filter: hue-rotate(90deg); }
        }
        @keyframes heavy-rgb {
          0% { transform: translate(5px, -5px); filter: invert(0.1); }
          20% { transform: translate(-5px, 5px); filter: hue-rotate(180deg); }
          40% { transform: translate(10px, 0); }
          60% { transform: translate(-10px, 2px); filter: brightness(2); }
          80% { transform: translate(2px, -10px); }
        }
      `}</style>
    </>
  );
};