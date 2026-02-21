/* ============================================
   3. FIXED FloatingParticles.jsx
   ============================================ */

// effects/FloatingParticles.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

export const FloatingParticles = ({ count = 30, color = 'cyan' }) => {
  const isMobile = useIsMobile();
  const [particleCount, setParticleCount] = useState(count);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationFrameRef = useRef(null);

  // Adjust particle count for mobile
  useEffect(() => {
    setParticleCount(isMobile ? Math.max(10, Math.floor(count * 0.3)) : count);
  }, [isMobile, count]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    const colors = {
      cyan: { r: 0, g: 243, b: 255 },
      purple: { r: 139, g: 92, b: 246 },
      pink: { r: 236, g: 72, b: 153 }
    };
    const colorValue = colors[color] || colors.cyan;

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      color: colorValue,
      opacity: Math.random() * 0.25 + 0.15 // Even more subtle
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Gentle mouse repulsion
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 80) {
          const force = (80 - distance) / 80;
          particle.x -= dx * force * 0.05;
          particle.y -= dy * force * 0.05;
        }

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.opacity})`;
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', setSize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', setSize);
    };
  }, [particleCount, color]);

  // CRITICAL: z-index 1 to stay BEHIND ai-bg (z-10) and scanlines (z-20)
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none opacity-25"
      style={{ zIndex: 1 }}
    />
  );
};
