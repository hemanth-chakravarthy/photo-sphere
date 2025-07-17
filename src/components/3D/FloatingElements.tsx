import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingElementsProps {
  count?: number;
}

function FloatingCube({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial 
        color="#6366f1" 
        transparent 
        opacity={0.6}
        metalness={0.5}
        roughness={0.3}
      />
    </mesh>
  );
}

function FloatingSphere({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 0.8 + position[0]) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial 
        color="#ec4899" 
        transparent 
        opacity={0.7}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}

export default function FloatingElements({ count = 8 }: FloatingElementsProps) {
  const elements = [];

  for (let i = 0; i < count; i++) {
    const position: [number, number, number] = [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 20
    ];

    if (i % 2 === 0) {
      elements.push(<FloatingCube key={i} position={position} />);
    } else {
      elements.push(<FloatingSphere key={i} position={position} />);
    }
  }

  return <>{elements}</>;
}