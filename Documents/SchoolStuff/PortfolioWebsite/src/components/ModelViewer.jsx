import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1} />;
}

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
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          
          <Stage 
            environment="city" 
            intensity={0.6}
            shadows="contact"
            adjustCamera={false}
          >
            <Model url={modelPath} />
          </Stage>
        </Suspense>
        
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
          makeDefault
        />
      </Canvas>
      
      <Suspense fallback={<LoadingPlaceholder />}>
        <div className="hidden"></div>
      </Suspense>
      
      {/* Moved instructions to Top-Right and added z-index */}
      <div className="absolute top-4 right-4 z-20 bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-lg border border-cyan-500/30 shadow-lg">
        <p className="text-gray-300 text-[10px] md:text-xs font-mono uppercase tracking-wider">
          <span className="text-cyan-400 font-bold">LMB</span> Rotate • 
          <span className="text-cyan-400 font-bold"> Wheel</span> Zoom • 
          <span className="text-cyan-400 font-bold"> RMB</span> Pan
        </p>
      </div>
    </div>
  );
};

export default ModelViewer;