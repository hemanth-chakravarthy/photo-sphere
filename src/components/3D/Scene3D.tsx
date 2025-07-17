import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';

interface Scene3DProps {
  children: React.ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  enableZoom?: boolean;
  enablePan?: boolean;
  autoRotate?: boolean;
}

export default function Scene3D({ 
  children, 
  className = "h-96", 
  cameraPosition = [0, 0, 10],
  enableZoom = true,
  enablePan = true,
  autoRotate = false
}: Scene3DProps) {
  return (
    <div className={className}>
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={cameraPosition} />
          
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.3} />
          
          {/* Environment */}
          <Environment preset="studio" />
          
          {/* Controls */}
          <OrbitControls 
            enableZoom={enableZoom}
            enablePan={enablePan}
            autoRotate={autoRotate}
            autoRotateSpeed={0.5}
            minDistance={3}
            maxDistance={20}
          />
          
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}