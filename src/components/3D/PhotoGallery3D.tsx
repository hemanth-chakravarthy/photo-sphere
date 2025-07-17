
import { useRef, useState, useMemo, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);

  // Load texture with proper error handling
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    setLoading(true);
    
    loader.load(
      photo.src,
      (loadedTexture) => {
        // Configure texture for better quality
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
        loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
        setTexture(loadedTexture);
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
        setLoading(false);
      }
    );
  }, [photo.src]);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.05;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.2;
      
      // Hover scale effect
      const targetScale = hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group position={position}>
      {/* Photo frame border */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[2.4, 1.8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Photo */}
      <mesh 
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        position={[0, 0, 0.01]}
      >
        <planeGeometry args={[2.2, 1.6]} />
        {texture ? (
          <meshStandardMaterial 
            map={texture} 
            transparent 
            opacity={hovered ? 0.95 : 0.85}
            roughness={0.1}
            metalness={0.0}
          />
        ) : (
          <meshStandardMaterial 
            color={loading ? "#f0f0f0" : "#cccccc"} 
            transparent 
            opacity={0.7}
          />
        )}
      </mesh>
      
      {/* Loading indicator */}
      {loading && (
        <Html position={[0, 0, 0.02]} center>
          <div className="bg-black/60 text-white p-2 rounded text-xs">
            Loading...
          </div>
        </Html>
      )}
      
      {/* Photo title on hover */}
      {hovered && !loading && (
        <Html position={[0, -1.1, 0]} center>
          <div className="bg-black/90 text-white p-2 rounded text-sm max-w-40 text-center">
            <div className="font-semibold">{photo.title}</div>
            {photo.location && (
              <div className="text-xs text-gray-300 mt-1">{photo.location}</div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function PhotoGallery3D({ photos, onPhotoClick }: PhotoGallery3DProps) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Arrange photos in a 3D spiral gallery with better spacing
  const photoPositions = useMemo(() => {
    const displayPhotos = photos.slice(0, 16); // Show more photos
    return displayPhotos.map((_, index) => {
      const angle = (index / displayPhotos.length) * Math.PI * 3; // More spiral turns
      const radius = 6 + Math.sin(angle * 0.5) * 2; // Varying radius
      const height = Math.sin(angle * 0.3) * 4 + Math.cos(index * 0.5) * 2; // More varied heights
      
      return [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ] as [number, number, number];
    });
  }, [photos]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002; // Slower rotation
    }
  });

  return (
    <group ref={groupRef}>
      {/* Enhanced lighting for better photo visibility */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-10, 5, -5]} intensity={0.8} />
      <pointLight position={[0, 8, 0]} intensity={0.6} />
      <pointLight position={[0, -8, 0]} intensity={0.3} />
      
      {/* Photos */}
      {photos.slice(0, 16).map((photo, index) => (
        <PhotoFrame
          key={photo.id}
          photo={photo}
          position={photoPositions[index]}
          onClick={() => onPhotoClick(photo)}
        />
      ))}
      
      {/* Gallery title */}
      <Text
        position={[0, 8, 0]}
        fontSize={1.8}
        color="#2c3e50"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.woff"
      >
        3D Gallery Experience
      </Text>
      
      {/* Instructions */}
      <Html position={[0, -8, 0]} center>
        <div className="text-center text-gray-700 bg-white/90 p-4 rounded-lg backdrop-blur-sm">
          <p className="font-semibold mb-2">Navigate the 3D Gallery</p>
          <p className="text-sm">Click and drag to rotate • Scroll to zoom • Click photos to view</p>
        </div>
      </Html>
    </group>
  );
}
