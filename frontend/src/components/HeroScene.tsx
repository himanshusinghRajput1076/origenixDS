import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Detect mobile once at module level for responsive rendering
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

// ─── Glowing Central Sun (Origin of Origenix) ───
const Sun = () => {
  const sunRef = useRef<THREE.Mesh>(null!);
  const outerRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (sunRef.current) {
      sunRef.current.rotation.y = t * 0.12;
      sunRef.current.rotation.x = Math.sin(t * 0.05) * 0.05;
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = -t * 0.06;
      outerRef.current.rotation.z = Math.cos(t * 0.08) * 0.04;
    }
  });

  const sunRadius = isMobile ? 0.7 : 0.95;

  return (
    <group>
      {/* Central Solid glowing core */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[sunRadius, 32, 32]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#ea580c"
          emissiveIntensity={2.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      {/* Futuristic glowing wireframe shield */}
      <mesh ref={outerRef} scale={1.12}>
        <sphereGeometry args={[sunRadius, 16, 16]} />
        <meshBasicMaterial
          color="#f3f4f6"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  );
};

// ─── Orbit Ring Guides ───
const OrbitRing = ({ radius, color = '#3b82f6' }: { radius: number; color?: string }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.015, radius + 0.015, 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.06}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// ─── Orbiting Planet Component ───
interface PlanetProps {
  radius: number;
  speed: number;
  scale: number;
  color: string;
  hasMoon?: boolean;
  hasRing?: boolean;
}

const Planet = ({ radius, speed, scale, color, hasMoon, hasRing }: PlanetProps) => {
  const groupRef = useRef<THREE.Group>(null!);
  const planetRef = useRef<THREE.Mesh>(null!);
  const moonRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(t) * radius;
      groupRef.current.position.z = Math.sin(t) * radius;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y = clock.elapsedTime * 0.7;
    }
    if (moonRef.current && hasMoon) {
      const mt = clock.elapsedTime * 2.2;
      moonRef.current.position.x = Math.cos(mt) * (scale + 0.26);
      moonRef.current.position.z = Math.sin(mt) * (scale + 0.26);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Planet Sphere */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[scale, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.65}
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>

      {/* Rings (e.g. Saturn variant) */}
      {hasRing && (
        <mesh rotation={[Math.PI / 2.6, 0, 0]}>
          <ringGeometry args={[scale + 0.06, scale + 0.2, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.24}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Orbiting Moon */}
      {hasMoon && (
        <mesh ref={moonRef}>
          <sphereGeometry args={[scale * 0.3, 16, 16]} />
          <meshStandardMaterial
            color="#a5f3fc"
            emissive="#06b6d4"
            emissiveIntensity={0.6}
            roughness={0.4}
          />
        </mesh>
      )}
    </group>
  );
};

// ─── Ambient Cosmic Star Field ───
const ParticleDust = () => {
  const count = isMobile ? 250 : 650;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return pos;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null!);
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.elapsedTime * 0.01;
      pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.005) * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.02 : 0.015}
        color="#a7f3d0"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
};

const HeroScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 2.5, isMobile ? 6.5 : 5.8], fov: isMobile ? 52 : 55 }}
      style={{ width: '100%', height: '100%', touchAction: 'auto' }}
      dpr={isMobile ? [1, 1] : [1, 1.5]}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 10, 5]} intensity={0.7} color="#ffffff" />
      <pointLight position={[-4, 3, -4]} intensity={0.4} color="#7b2fff" />
      <pointLight position={[4, -3, 4]} intensity={0.4} color="#00c6ff" />
      
      <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.2}>
        <Sun />
        
        {/* Orbit paths */}
        <OrbitRing radius={1.7} color="#00c6ff" />
        <OrbitRing radius={2.7} color="#ec4899" />
        <OrbitRing radius={3.8} color="#10b981" />
        <OrbitRing radius={4.8} color="#7b2fff" />

        {/* Orbiting planet spheres */}
        {/* Planet 1: Cloud/Core Architecture */}
        <Planet radius={1.7} speed={0.5} scale={0.14} color="#00c6ff" />
        
        {/* Planet 2: Full-Stack Dev (with Moon) */}
        <Planet radius={2.7} speed={0.34} scale={0.2} color="#ec4899" hasMoon />
        
        {/* Planet 3: AI & Machine Learning (with Saturn Rings) */}
        <Planet radius={3.8} speed={0.22} scale={0.23} color="#10b981" hasRing />
        
        {/* Planet 4: Advanced Cybersecurity */}
        <Planet radius={4.8} speed={0.14} scale={0.17} color="#7b2fff" />
      </Float>

      <ParticleDust />
      <Environment preset="city" environmentIntensity={0.15} />
    </Canvas>
  );
};

export default HeroScene;
