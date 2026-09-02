import { useRef, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

// ─── Subtle Ambient Background Particles ──────────────────────────────────────
function ParticleNetwork({ count = 300, scrollY }) {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorA = new THREE.Color('#0e64ff');
    const colorB = new THREE.Color('#0bbcb8');
    const colorC = new THREE.Color('#7c3aed');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;

      const mixColor = i % 3 === 0 ? colorA : i % 3 === 1 ? colorB : colorC;
      col[i * 3] = mixColor.r;
      col[i * 3 + 1] = mixColor.g;
      col[i * 3 + 2] = mixColor.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const scrollFactor = (scrollY.current || 0) * 0.0003;
      pointsRef.current.rotation.x += delta * 0.015;
      pointsRef.current.rotation.y += delta * 0.025;
      pointsRef.current.rotation.z = scrollFactor * 0.3;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.14}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.65}
      />
    </Points>
  );
}

// ─── Subtle Hero 3D Medical Emblem (Only rendered on non-map views) ─────────
function SubtleMedicalHero({ mousePos }) {
  const meshRef = useRef();
  const ringRef = useRef();

  useFrame((state, delta) => {
    const mx = (mousePos.current.x / window.innerWidth - 0.5) * 1.5;
    const my = (mousePos.current.y / window.innerHeight - 0.5) * 1.5;

    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mx * 0.5 + state.clock.getElapsedTime() * 0.15, 0.05);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, my * -0.3, 0.05);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.2;
    }
  });

  return (
    <group position={[5, 1, -6]}>
      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.8, 1]} />
          <meshStandardMaterial
            wireframe
            color="#0e64ff"
            emissive="#0e64ff"
            emissiveIntensity={0.6}
            transparent
            opacity={0.5}
          />
        </mesh>
        <mesh ref={ringRef}>
          <torusGeometry args={[2.8, 0.04, 16, 80]} />
          <meshStandardMaterial
            color="#0bbcb8"
            emissive="#0bbcb8"
            emissiveIntensity={0.8}
            transparent
            opacity={0.5}
          />
        </mesh>
      </Float>
    </group>
  );
}

// ─── Main Spatial 3D WebGL Canvas ──────────────────────────────────────────
export default function Spatial3DCanvas() {
  const location = useLocation();
  const isMapRoute = location.pathname.startsWith('/hospitals');

  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const scrollY = useRef(0);

  useEffect(() => {
    const handleMouse = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Do not render geometric canvas overlay on map routes to ensure 100% clean map visibility
  if (isMapRoute) {
    return null;
  }

  return (
    <div
      id="spatial-3d-canvas-container"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background: 'transparent',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#0e64ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#7c3aed" />

        <ParticleNetwork count={350} scrollY={scrollY} />
        {location.pathname === '/' && <SubtleMedicalHero mousePos={mousePos} />}
      </Canvas>
    </div>
  );
}
