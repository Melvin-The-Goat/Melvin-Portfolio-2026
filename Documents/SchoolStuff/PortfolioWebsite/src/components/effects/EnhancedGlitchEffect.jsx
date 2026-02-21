import React, { useState, useEffect } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

const playGlitchSound = (intensity, isMobile) => {
  if (isMobile) return; // Disable sound on mobile for better performance
  const audio = new Audio('/sounds/glitch.mp3');
  audio.volume = intensity === 'high' ? 0.15 : 0.05;
  audio.play().catch(() => {});
};

export const EnhancedGlitchEffect = ({ isActive, onComplete, intensity = 'medium' }) => {
  const [glitchStage, setGlitchStage] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isActive) {
      playGlitchSound(intensity, isMobile);
      setGlitchStage(1);
      
      const timings = intensity === 'high' ? [100, 250, 400, 550] : [100, 200, 300, 400];
      
      const t1 = setTimeout(() => setGlitchStage(2), timings[0]);
      const t2 = setTimeout(() => setGlitchStage(3), timings[1]);
      const t3 = setTimeout(() => setGlitchStage(4), timings[2]);
      const t4 = setTimeout(() => {
        setGlitchStage(0);
        onComplete?.();
      }, timings[3]);

      return () => [t1, t2, t3, t4].forEach(clearTimeout);
    }
  }, [isActive, intensity, onComplete, isMobile]);

  if (!isActive) return null;

  return (
    <>
      {/* LAYER 1: RGB Split / Chromatic Aberration with Dark Theme */}
      <div className="fixed inset-0 z-[9999] pointer-events-none mix-blend-screen opacity-70">
        {/* Cyan/Blue Channel */}
        <div 
          className="absolute inset-0 bg-cyan-500/30"
          style={{ animation: 'rgb-split-cyan 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite' }}
        />
        {/* Magenta/Red Channel */}
        <div 
          className="absolute inset-0 bg-fuchsia-500/25"
          style={{ animation: 'rgb-split-magenta 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite' }}
        />
        {/* Yellow/Green Channel */}
        <div 
          className="absolute inset-0 bg-emerald-400/15"
          style={{ animation: 'rgb-split-yellow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite' }}
        />
      </div>

      {/* LAYER 2: VHS Tracking Lines / Scanlines */}
      <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
        {/* Horizontal scanlines */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.8) 2px, rgba(0, 0, 0, 0.8) 4px)',
            animation: 'scanlines-move 0.5s linear infinite',
            opacity: glitchStage >= 2 ? 0.3 : 0
          }}
        />
        
        {/* VHS tracking error bars */}
        {[...Array(8)].map((_, i) => (
          <div 
            key={`vhs-${i}`}
            className="absolute w-full"
            style={{
              height: Math.random() * 40 + 10 + 'px',
              top: Math.random() * 100 + '%',
              background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.3) 20%, rgba(139, 92, 246, 0.2) 50%, rgba(6, 182, 212, 0.3) 80%, transparent)',
              borderTop: '1px solid rgba(6, 182, 212, 0.4)',
              borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 0 10px rgba(6, 182, 212, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.9)',
              animation: `vhs-tracking ${0.15 + Math.random() * 0.1}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 0.1}s`,
              display: glitchStage >= 2 ? 'block' : 'none'
            }}
          />
        ))}
      </div>

      {/* LAYER 3: Clip-Path Slice Distortion */}
      <div className="fixed inset-0 z-[9997] pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={`clip-${i}`}
            className="absolute inset-0 bg-black/50"
            style={{
              clipPath: `polygon(0 ${i * 8}%, 100% ${i * 8}%, 100% ${i * 8 + 8}%, 0 ${i * 8 + 8}%)`,
              animation: `clip-path-shift-${i % 3} 0.${1 + i}s steps(4) infinite`,
              animationDelay: `${i * 0.02}s`,
              display: glitchStage === 3 || glitchStage === 4 ? 'block' : 'none',
              mixBlendMode: 'overlay'
            }}
          />
        ))}
      </div>

      {/* LAYER 4: Digital Corruption Blocks */}
      <div className="fixed inset-0 z-[9996] pointer-events-none overflow-hidden">
        {[...Array(isMobile ? 10 : 25)].map((_, i) => (
          <div
            key={`corrupt-${i}`}
            className="absolute"
            style={{
              width: Math.random() * 150 + 30 + 'px',
              height: Math.random() * 80 + 20 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              backgroundColor: i % 4 === 0 ? 'rgba(6, 182, 212, 0.15)' : 
                               i % 4 === 1 ? 'rgba(139, 92, 246, 0.12)' : 
                               i % 4 === 2 ? 'rgba(16, 185, 129, 0.1)' : 
                               'rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8)',
              animation: `data-corrupt ${0.12 + Math.random() * 0.08}s steps(2) infinite`,
              animationDelay: `${Math.random() * 0.15}s`,
              display: glitchStage === 3 || glitchStage === 4 ? 'block' : 'none',
              mixBlendMode: 'overlay'
            }}
          />
        ))}
      </div>

      {/* LAYER 5: Screen Shake / Camera Shake */}
      <div 
        className="fixed inset-0 z-[9995] pointer-events-none"
        style={{
          animation: glitchStage === 2 || glitchStage === 4 ? 'screen-shake 0.15s ease-in-out' : 'none',
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.5) 100%)'
        }}
      />

      {/* LAYER 6: Matrix Digital Rain */}
      <div className="fixed inset-0 z-[9994] pointer-events-none overflow-hidden">
        {[...Array(isMobile ? 3 : 10)].map((_, i) => (
          <div 
            key={`matrix-${i}`}
            className="absolute w-px"
            style={{
              height: '100%',
              left: `${(i + 1) * 10}%`,
              background: 'linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.6) 40%, transparent)',
              boxShadow: '0 0 8px rgba(6, 182, 212, 0.8)',
              animation: `matrix-fall ${0.6 + Math.random() * 0.4}s linear infinite`,
              animationDelay: `${Math.random() * 0.5}s`,
              display: glitchStage >= 2 ? 'block' : 'none',
              opacity: 0.4
            }}
          />
        ))}
      </div>

      {/* LAYER 7: Signal Interference / Static Noise */}
      <div 
        className="fixed inset-0 z-[10000] pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.8'/%3E%3C/svg%3E")`,
          animation: 'static-noise 0.1s steps(10) infinite',
          display: glitchStage >= 1 ? 'block' : 'none',
          mixBlendMode: 'overlay'
        }}
      />

      {/* LAYER 8: Holographic Interference Lines */}
      <div className="fixed inset-0 z-[9993] pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={`holo-${i}`}
            className="absolute h-px w-full"
            style={{
              top: `${20 * (i + 1)}%`,
              background: `linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.4) ${30 + i * 10}%, transparent)`,
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.6), 0 0 30px rgba(139, 92, 246, 0.3)',
              animation: `hologram-sweep ${0.3 + i * 0.1}s ease-in-out`,
              display: glitchStage === 2 || glitchStage === 3 ? 'block' : 'none',
              opacity: 0.5
            }}
          />
        ))}
      </div>

      {/* LAYER 9: Screen Tear / Displacement */}
      <div className="fixed inset-0 z-[10001] pointer-events-none">
        <div
          className="absolute w-full h-1"
          style={{
            top: '40%',
            background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.8) 50%, transparent)',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(139, 92, 246, 0.5)',
            animation: 'screen-tear 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            display: glitchStage === 4 ? 'block' : 'none'
          }}
        />
        <div
          className="absolute w-full h-1"
          style={{
            top: '60%',
            background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.8) 50%, transparent)',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.8), 0 0 40px rgba(6, 182, 212, 0.5)',
            animation: 'screen-tear-reverse 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            display: glitchStage === 4 ? 'block' : 'none'
          }}
        />
      </div>

      {/* LAYER 10: Interlaced Scan Effect */}
      <div 
        className="fixed inset-0 z-[9992] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0) 0px, rgba(0, 0, 0, 0) 1px, rgba(6, 182, 212, 0.03) 1px, rgba(6, 182, 212, 0.03) 2px)',
          animation: 'interlace 0.1s linear infinite',
          display: glitchStage >= 1 ? 'block' : 'none'
        }}
      />

      {/* LAYER 11: Vignette Flicker */}
      <div 
        className="fixed inset-0 z-[9991] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.85) 100%)',
          animation: 'vignette-flicker 0.2s ease-in-out',
          display: glitchStage >= 1 ? 'block' : 'none'
        }}
      />

      <style>{`
        /* RGB Split Animations */
        @keyframes rgb-split-cyan {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-4px, 2px); }
          66% { transform: translate(4px, -2px); }
        }
        @keyframes rgb-split-magenta {
          0%, 100% { transform: translate(0, 0) skewX(0deg); }
          33% { transform: translate(5px, -1px) skewX(2deg); }
          66% { transform: translate(-3px, 2px) skewX(-2deg); }
        }
        @keyframes rgb-split-yellow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(2px, 3px) rotate(1deg); }
        }

        /* VHS Effects */
        @keyframes scanlines-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
        @keyframes vhs-tracking {
          0% { transform: translateX(-100%) scaleX(0.8); opacity: 0; }
          20% { transform: translateX(0) scaleX(1.2); opacity: 0.8; }
          40% { transform: translateX(100%) scaleX(0.9); opacity: 0.6; }
          60% { transform: translateX(-50%) scaleX(1.1); opacity: 0.7; }
          100% { transform: translateX(100%) scaleX(0.8); opacity: 0; }
        }

        /* Clip-Path Slice Animations */
        @keyframes clip-path-shift-0 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-20px); }
        }
        @keyframes clip-path-shift-1 {
          0% { transform: translateX(0); }
          100% { transform: translateX(25px); }
        }
        @keyframes clip-path-shift-2 {
          0% { transform: translateX(0) skewX(0deg); }
          100% { transform: translateX(-15px) skewX(-5deg); }
        }

        /* Data Corruption */
        @keyframes data-corrupt {
          0% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          25% { transform: translate(-8px, 4px) scale(1.05); opacity: 0.6; }
          50% { transform: translate(12px, -6px) scale(0.95); opacity: 0.7; }
          75% { transform: translate(-5px, 8px) scale(1.02); opacity: 0.5; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
        }

        /* Screen Shake */
        @keyframes screen-shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-5px, 2px) rotate(-0.5deg); }
          20% { transform: translate(5px, -4px) rotate(0.5deg); }
          30% { transform: translate(-3px, 4px) rotate(-0.3deg); }
          40% { transform: translate(4px, -2px) rotate(0.4deg); }
          50% { transform: translate(-4px, 3px) rotate(-0.2deg); }
          60% { transform: translate(3px, -4px) rotate(0.3deg); }
          70% { transform: translate(-2px, 2px) rotate(-0.1deg); }
          80% { transform: translate(2px, -1px) rotate(0.2deg); }
          90% { transform: translate(-1px, 1px) rotate(-0.1deg); }
        }

        /* Matrix Rain */
        @keyframes matrix-fall {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        /* Static Noise */
        @keyframes static-noise {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
          100% { transform: translate(5%, 0); }
        }

        /* Holographic Sweep */
        @keyframes hologram-sweep {
          0% { transform: translateX(-100%) scaleX(0); opacity: 0; }
          30% { transform: translateX(0%) scaleX(1.5); opacity: 1; }
          70% { transform: translateX(100%) scaleX(1); opacity: 0.8; }
          100% { transform: translateX(200%) scaleX(0); opacity: 0; }
        }

        /* Screen Tear */
        @keyframes screen-tear {
          0% { transform: translateY(-100px) scaleX(0); opacity: 0; }
          20% { transform: translateY(0) scaleX(2); opacity: 1; }
          40% { transform: translateY(80px) scaleX(1); opacity: 0.8; }
          60% { transform: translateY(-40px) scaleX(1.5); opacity: 0.6; }
          80% { transform: translateY(60px) scaleX(0.8); opacity: 0.4; }
          100% { transform: translateY(100px) scaleX(0); opacity: 0; }
        }
        @keyframes screen-tear-reverse {
          0% { transform: translateY(100px) scaleX(0); opacity: 0; }
          20% { transform: translateY(0) scaleX(2); opacity: 1; }
          40% { transform: translateY(-80px) scaleX(1); opacity: 0.8; }
          60% { transform: translateY(40px) scaleX(1.5); opacity: 0.6; }
          80% { transform: translateY(-60px) scaleX(0.8); opacity: 0.4; }
          100% { transform: translateY(-100px) scaleX(0); opacity: 0; }
        }

        /* Interlace Scan */
        @keyframes interlace {
          0% { background-position: 0 0; }
          100% { background-position: 0 2px; }
        }

        /* Vignette Flicker */
        @keyframes vignette-flicker {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </>
  );
};

export const AmbientGlitch = ({ enabled = true, frequency = 'medium' }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const intervalTime = frequency === 'high' ? 4000 : frequency === 'medium' ? 8000 : 15000;
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 400);
      }
    }, intervalTime);
    return () => clearInterval(interval);
  }, [enabled, frequency]);

  return <EnhancedGlitchEffect isActive={isGlitching} onComplete={() => setIsGlitching(false)} intensity="low" />;
};
