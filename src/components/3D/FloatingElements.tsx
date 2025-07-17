import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingCamerasProps {
  count?: number;
}

function FloatingCamera({ position, initialRotation }: { 
  position: [number, number, number]; 
  initialRotation: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.8;
      
      // Gentle rotation
      groupRef.current.rotation.y = initialRotation[1] + Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.2;
      groupRef.current.rotation.x = initialRotation[0] + Math.cos(state.clock.elapsedTime * 0.2 + position[2]) * 0.1;
      
      // Scale on hover
      if (hovered) {
        groupRef.current.scale.setScalar(1.2);
      } else {
        groupRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => {
        // Add click interaction
        if (groupRef.current) {
          groupRef.current.rotation.y += 0.5;
        }
      }}
    >
      {/* Camera body */}
      <mesh>
        <boxGeometry args={[1.2, 0.8, 1]} />
        <meshStandardMaterial 
          color={hovered ? "#4f46e5" : "#1f2937"} 
          metalness={0.7} 
          roughness={0.3}
        />
      </mesh>
      
      {/* Lens */}
      <mesh position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
        <meshStandardMaterial 
          color={hovered ? "#3730a3" : "#111827"} 
          metalness={0.9} 
          roughness={0.1}
        />
      </mesh>
      
      {/* Lens glass */}
      <mesh position={[0, 0, 0.75]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.05, 16]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          metalness={0.1} 
          roughness={0.1} 
          transparent 
          opacity={0.7}
          emissive={hovered ? "#1e40af" : "#000000"}
        />
      </mesh>
      
      {/* Viewfinder */}
      <mesh position={[0, 0.5, -0.2]}>
        <boxGeometry args={[0.3, 0.2, 0.15]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      
      {/* Flash */}
      <mesh position={[-0.3, 0.3, 0.4]}>
        <boxGeometry args={[0.15, 0.1, 0.05]} />
        <meshStandardMaterial 
          color="#f3f4f6" 
          emissive={hovered ? "#fbbf24" : "#000000"}
        />
      </mesh>
      
      {/* Shutter button */}
      <mesh position={[0.2, 0.4, 0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.05, 8]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      
      {/* Strap */}
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.3, 0.02, 8, 16]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>
    </group>
  );
}

export default function FloatingCameras({ count = 6 }: FloatingCamerasProps) {
  const cameras = [];

  for (let i = 0; i < count; i++) {
    const position: [number, number, number] = [
      (Math.random() - 0.5) * 25,
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 25
    ];
    
    const initialRotation: [number, number, number] = [
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    ];

    cameras.push(
      <FloatingCamera 
        key={i} 
        position={position} 
        initialRotation={initialRotation}
      />
    );
  }

  return <>{cameras}</>;
}