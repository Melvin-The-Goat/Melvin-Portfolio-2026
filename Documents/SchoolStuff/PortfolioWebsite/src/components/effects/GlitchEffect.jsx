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
      <div className="fixed inset-0 z-[9999] pointer-events-none mix-blend-screen opacity-70">
        <div className="absolute inset-0 bg-red-500/20 animate-pulse" style={{ transform: 'translateX(4px)' }} />
        <div className="absolute inset-0 bg-cyan-500/20 animate-pulse" style={{ transform: 'translateX(-4px)' }} />
      </div>

      {mode === 'heavy' && (
        <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-full bg-cyan-500/10 border-y border-white/5 shadow-[0_0_15px_rgba(0,243,255,0.2)]"
              style={{
                height: Math.random() * 60 + 'px',
                top: Math.random() * 100 + '%',
                left: (Math.random() - 0.5) * 100 + 'px',
                animation: `heavy-bar-float ${0.15 + Math.random() * 0.2}s infinite step-end`
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes heavy-bar-float {
          0% { transform: translateX(-10%); filter: hue-rotate(0deg); }
          50% { transform: translateX(10%); filter: hue-rotate(90deg) brightness(2); }
          100% { transform: translateX(-5%); }
        }
      `}</style>
    </>
  );
};