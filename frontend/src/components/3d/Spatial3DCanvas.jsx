import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Rotating 3D Particle Constellation Mesh
function ParticleNetwork({ count = 300 }) {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorA = new THREE.Color('#0e64ff');
    const colorB = new THREE.Color('#0bbcb8');
    const colorC = new THREE.Color('#7c3aed');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 25;

      const mixColor = i % 3 === 0 ? colorA : i % 3 === 1 ? colorB : colorC;
      col[i * 3] = mixColor.r;
      col[i * 3 + 1] = mixColor.g;
      col[i * 3 + 2] = mixColor.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += delta * 0.03;
      pointsRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.18}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.85}
      />
    </Points>
  );
}

// Interactive Rotating Holographic Core Ring
function HolographicCore() {
  const meshRef = useRef();
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.3;
      ringRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group position={[6, 0, -8]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[2.5, 1]} />
          <meshBasicMaterial
            wireframe
            color="#0e64ff"
            transparent
            opacity={0.35}
          />
        </mesh>
        <mesh ref={ringRef}>
          <torusGeometry args={[4, 0.08, 16, 100]} />
          <meshBasicMaterial
            color="#0bbcb8"
            transparent
            opacity={0.45}
          />
        </mesh>
      </Float>
    </group>
  );
}

// Main Canvas Wrapper
export default function Spatial3DCanvas() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background: 'transparent',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#0e64ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#7c3aed" />

        <ParticleNetwork count={400} />
        <HolographicCore />
      </Canvas>
    </div>
  );
}
