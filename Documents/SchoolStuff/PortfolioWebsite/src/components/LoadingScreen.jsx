import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Terminal } from 'lucide-react';

// Neural Network Background Component
function NeuralNetwork({ progress }) {
  const pointsRef = useRef();
  const linesRef = useRef();
  
  const { positions, connections, colors } = useMemo(() => {
    const positions = [];
    const connections = [];
    const colors = [];
    const nodeCount = 100;
    
    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 10;
      positions.push(x, y, z);
      
      const colorValue = i / nodeCount;
      colors.push(
        colorValue,        // R
        1 - colorValue,    // G
        1                  // B
      );
    }

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (distance < 5) {
          connections.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
        }
      }
    }

    return { 
      positions: new Float32Array(positions), 
      connections: new Float32Array(connections),
      colors: new Float32Array(colors)
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.1;
      pointsRef.current.rotation.x = Math.sin(t * 0.2) * 0.2;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = t * 0.1;
      linesRef.current.rotation.x = Math.sin(t * 0.2) * 0.2;
    }
  });

  const activeNodes = Math.floor((progress / 100) * (positions.length / 3));

  return (
    <group>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={connections.length / 3}
            array={connections}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color="#6366f1" 
          transparent 
          opacity={0.2} 
          blending={THREE.AdditiveBlending} 
        />
      </lineSegments>

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={activeNodes}
            array={positions.slice(0, activeNodes * 3)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          color="#00f3ff"
          transparent
          opacity={1}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function BootSequence({ progress }) {
  const [visibleLines, setVisibleLines] = useState([]);

  const bootSequence = [
    { text: "MELVIN.SYS v2.0.1", showAt: 0, color: "text-cyan-400" },
    { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", showAt: 5, color: "text-purple-500" },
    { text: "> Initializing neural network...", showAt: 10, color: "text-white" },
    { text: "> Loading portfolio modules...", showAt: 20, color: "text-white" },
    { text: "> Compiling shaders...", showAt: 35, color: "text-white" },
    { text: "> Loading 3D assets...", showAt: 50, color: "text-white" },
    { text: "> Establishing connections...", showAt: 65, color: "text-white" },
    { text: "> Training model...", showAt: 80, color: "text-white" },
    { text: "✓ All systems operational", showAt: 95, color: "text-green-400" },
    { text: "READY.", showAt: 100, color: "text-cyan-400 font-black text-2xl" },
  ];

  useEffect(() => {
    const linesToShow = bootSequence.filter(line => progress >= line.showAt);
    setVisibleLines(linesToShow);
  }, [progress]);

  return (
    <div className="font-mono text-sm space-y-2">
      {visibleLines.map((line, idx) => (
        <div key={idx} className={`${line.color} animate-fade-in`}>
          {line.text}
          {idx === visibleLines.length - 1 && progress < 100 && (
            <span className="animate-pulse">_</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const duration = 4000;
    const interval = 50;
    const increment = (100 / duration) * interval;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          setTimeout(() => onComplete?.(), 500);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a0014] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <NeuralNetwork progress={progress} />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#00f3ff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
        </Canvas>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 243, 255, 0.1) 50%)',
          backgroundSize: '100% 4px'
        }}
      />

      <div className="relative z-10 max-w-2xl w-full px-8">
        <div className="bg-black/80 backdrop-blur-md border-2 border-cyan-500/30 rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50 px-4 py-2 flex items-center gap-2 border-b border-cyan-500/30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono ml-2">
              <Terminal size={14} />
              <span>melvin@portfolio:~$</span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <BootSequence progress={progress} />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>TRAINING NEURAL MODEL</span>
                <span>{Math.floor(progress)}%</span>
              </div>
              
              <div className="relative h-3 bg-gray-900 border border-cyan-500/30 rounded-sm overflow-hidden">
                <div className="absolute h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>

              <div className="font-mono text-xs text-purple-400">
                [{Array.from({ length: 40 }).map((_, i) => i < (progress / 2.5) ? '█' : '░').join('')}]
              </div>
            </div>
          </div>
        </div>
      </div>

      {isComplete && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 animate-pulse pointer-events-none"></div>
      )}

      {/* FIXED: Removed the "jsx" attribute to prevent syntax errors */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}