import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Photo } from '@/data/photos';

interface PhotoGallery3DProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

function PhotoFrame({ photo, position, onClick }: { 
  photo: Photo; 
  position: [number, number, number]; 
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Load texture
  useMemo(() => {
    const loader = new THREE.TextureLoader();
    loader.load(photo.src, (loadedTexture) => {
      setTexture(loadedTexture);
    });
  }, [photo.src]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05;
      if (hovered) {
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group position={position}>
      {/* Frame */}
      <mesh 
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[2, 1.5]} />
        <meshStandardMaterial 
          map={texture} 
          transparent 
          opacity={hovered ? 0.9 : 0.8}
        />
      </mesh>
      
      {/* Photo border */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[2.2, 1.7]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Photo title */}
      {hovered && (
        <Html position={[0, -1.2, 0]} center>
          <div className="bg-black/80 text-white p-2 rounded text-sm max-w-32 text-center">
            {photo.title}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function PhotoGallery3D({ photos, onPhotoClick }: PhotoGallery3DProps) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Arrange photos in a 3D spiral gallery
  const photoPositions = useMemo(() => {
    return photos.slice(0, 12).map((_, index) => {
      const angle = (index / photos.slice(0, 12).length) * Math.PI * 4;
      const radius = 8;
      const height = Math.sin(angle * 0.5) * 3;
      
      return [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ] as [number, number, number];
    });
  }, [photos]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />
      
      {/* Photos */}
      {photos.slice(0, 12).map((photo, index) => (
        <PhotoFrame
          key={photo.id}
          photo={photo}
          position={photoPositions[index]}
          onClick={() => onPhotoClick(photo)}
        />
      ))}
      
      {/* Gallery title */}
      <Text
        position={[0, 6, 0]}
        fontSize={1.5}
        color="#333"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.woff"
      >
        3D Gallery Experience
      </Text>
      
      {/* Instructions */}
      <Html position={[0, -6, 0]} center>
        <div className="text-center text-gray-600">
          <p>Click and drag to navigate • Scroll to zoom</p>
          <p>Click on photos to view them</p>
        </div>
      </Html>
    </group>
  );
}