import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, PerspectiveCamera } from '@react-three/drei';

// Component to load and display the 3D model
function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1} />;
}

// Loading placeholder while model loads
function LoadingPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400 text-sm">Loading 3D Model...</p>
      </div>
    </div>
  );
}

const ModelViewer = ({ modelPath, title }) => {
  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg overflow-hidden border border-gray-700">
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <Suspense fallback={null}>
          {/* Lighting setup */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          
          {/* Stage provides nice environment lighting */}
          <Stage 
            environment="city" 
            intensity={0.6}
            shadows="contact"
            adjustCamera={false}
          >
            <Model url={modelPath} />
          </Stage>
        </Suspense>
        
        {/* Camera controls - enables rotation, zoom, pan */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
          makeDefault
        />
      </Canvas>
      
      {/* Loading state */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <div className="hidden"></div>
      </Suspense>
      
      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700">
        <p className="text-gray-300 text-xs">
          <span className="text-cyan-400 font-semibold">Click & Drag</span> to rotate • 
          <span className="text-cyan-400 font-semibold"> Scroll</span> to zoom • 
          <span className="text-cyan-400 font-semibold"> Right-click</span> to pan
        </p>
      </div>
    </div>
  );
};

export default ModelViewer;