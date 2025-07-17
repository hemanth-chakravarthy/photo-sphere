import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';

// Simple 3D camera geometry since we don't have a GLTF model
function CameraModel() {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]} scale={[1.5, 1.5, 1.5]}>
      {/* Camera body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 1.2, 1.5]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Lens */}
      <mesh position={[0, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.3, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Lens glass */}
      <mesh position={[0, 0, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
        <meshStandardMaterial 
          color="#87ceeb" 
          metalness={0.1} 
          roughness={0.1} 
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* Viewfinder */}
      <mesh position={[0, 0.8, -0.3]}>
        <boxGeometry args={[0.4, 0.3, 0.2]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Film advance lever */}
      <mesh position={[0.8, 0.4, 0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#444" />
      </mesh>
    </group>
  );
}

export default function VintageCamera() {
  return (
    <group>
      <CameraModel />
      <Text
        position={[0, -2, 0]}
        fontSize={0.5}
        color="#666"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.woff"
      >
        Click and drag to explore
      </Text>
    </group>
  );
}