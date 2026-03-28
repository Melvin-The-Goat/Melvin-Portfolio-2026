/* ============================================
   2. FIXED CustomCursor.jsx
   ============================================ */

// effects/CustomCursor.jsx
import React, { useState, useEffect, useRef } from 'react';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 }); // Start offscreen
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState([]);
  const trailLength = 6; // Further reduced for better cleanup
  const rafRef = useRef(null);
  const lastUpdate = useRef(0);

  useEffect(() => {
    let isMounted = true;
    
    const handleMouseMove = (e) => {
      if (!isMounted) return;
      
      const now = Date.now();
      if (now - lastUpdate.current < 20) return; // Throttle to 50fps
      lastUpdate.current = now;

      const newPos = { x: e.clientX, y: e.clientY };
      setPosition(newPos);
      
      // Simplified trail update - always update to prevent lingering
      setTrail(prev => {
        const updated = [newPos, ...prev].slice(0, trailLength);
        return updated;
      });
    };

    const handleMouseDown = () => isMounted && setIsClicking(true);
    const handleMouseUp = () => isMounted && setIsClicking(false);
    
    // Clean up trail when mouse leaves window
    const handleMouseLeave = () => {
      setTrail([]);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);
    document.body.style.cursor = 'none';

    return () => {
      isMounted = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.body.style.cursor = 'auto';
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Trail particles */}
      {trail.map((pos, i) => {
        const opacity = (1 - i / trailLength) * 0.7;
        const size = Math.max(4, 8 - i * 1.2);
        
        return (
          <div
            key={`${pos.x}-${pos.y}-${i}`} // Unique key to force re-render
            className="fixed pointer-events-none rounded-full"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              width: `${size}px`,
              height: `${size}px`,
              background: `rgba(0, 243, 255, ${opacity})`,
              boxShadow: `0 0 ${size * 1.5}px rgba(0, 243, 255, ${opacity})`,
              transform: 'translate(-50%, -50%)',
              zIndex: 100,
              willChange: 'opacity, transform'
            }}
          />
        );
      })}

      {/* Main cursor */}
      <div
        className="fixed pointer-events-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
          zIndex: 100,
          willChange: 'transform'
        }}
      >
        {/* Outer ring */}
        <div 
          className={`w-8 h-8 border-2 border-cyan-400 rounded-full transition-transform duration-100 ${
            isClicking ? 'scale-75' : 'scale-100'
          }`}
          style={{
            boxShadow: '0 0 10px rgba(0, 243, 255, 0.5)',
            animation: 'pulse-ring 2s ease-in-out infinite'
          }}
        />
        
        {/* Center dot */}
        <div 
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full"
          style={{
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 5px rgba(0, 243, 255, 0.8)'
          }}
        />
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
};