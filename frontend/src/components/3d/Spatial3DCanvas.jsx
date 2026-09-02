import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ─── 1. Particle Constellation Network ──────────────────────────────────────
function ParticleNetwork({ count = 500, scrollY }) {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorA = new THREE.Color('#0e64ff');
    const colorB = new THREE.Color('#0bbcb8');
    const colorC = new THREE.Color('#7c3aed');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
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
      const scrollFactor = (scrollY.current || 0) * 0.0005;
      pointsRef.current.rotation.x += delta * (0.02 + scrollFactor * 0.1);
      pointsRef.current.rotation.y += delta * (0.04 + scrollFactor * 0.1);
      pointsRef.current.rotation.z = scrollFactor * 0.5;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.16}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

// ─── 2. Real Interactive 3D Medical Core Scene ──────────────────────────────
function MedicalCore3DScene({ mousePos, scrollY }) {
  const groupRef = useRef();
  const innerCoreRef = useRef();
  const outerRing1Ref = useRef();
  const outerRing2Ref = useRef();
  const satellitesRef = useRef();

  useFrame((state, delta) => {
    const scrollProgress = Math.min(1, (scrollY.current || 0) / (document.documentElement.scrollHeight - window.innerHeight || 1));
    const mx = (mousePos.current.x / window.innerWidth - 0.5) * 2;
    const my = (mousePos.current.y / window.innerHeight - 0.5) * 2;

    if (groupRef.current) {
      // Mouse Parallax + Lerp Rotation
      const targetRotY = mx * 0.4 + scrollProgress * Math.PI * 2;
      const targetRotX = my * -0.3 + Math.sin(scrollProgress * Math.PI) * 0.5;
      
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);

      // Scroll Position Transition (Center -> Right -> Left -> Center)
      let targetX = 0;
      let targetY = 0;
      let targetZ = 0;

      if (scrollProgress > 0.05 && scrollProgress <= 0.35) {
        targetX = -4.5 + mx * 0.5;
        targetY = -0.5 + my * 0.5;
        targetZ = -2;
      } else if (scrollProgress > 0.35 && scrollProgress <= 0.7) {
        targetX = 4.5 + mx * 0.5;
        targetY = 0.5 + my * 0.5;
        targetZ = -1;
      } else if (scrollProgress > 0.7) {
        targetX = mx * 0.8;
        targetY = Math.sin(state.clock.getElapsedTime()) * 0.3;
        targetZ = 1;
      }

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.04);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.04);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.04);
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y += delta * 0.5;
      innerCoreRef.current.rotation.z += delta * 0.3;
    }

    if (outerRing1Ref.current) {
      outerRing1Ref.current.rotation.z -= delta * 0.4;
      outerRing1Ref.current.rotation.x += delta * 0.2;
    }

    if (outerRing2Ref.current) {
      outerRing2Ref.current.rotation.y += delta * 0.6;
      outerRing2Ref.current.rotation.z += delta * 0.15;
    }

    if (satellitesRef.current) {
      satellitesRef.current.rotation.y += delta * 0.8;
    }
  });

  // Satellite node coordinates
  const satellites = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      const radius = 4.2;
      return [Math.cos(angle) * radius, Math.sin(angle) * 1.5, Math.sin(angle) * radius];
    });
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
        {/* Central Icosahedron Medical Core */}
        <mesh ref={innerCoreRef}>
          <icosahedronGeometry args={[2.2, 1]} />
          <meshStandardMaterial
            wireframe
            color="#0e64ff"
            emissive="#0e64ff"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Inner Glowing Sphere */}
        <mesh>
          <sphereGeometry args={[1.3, 32, 32]} />
          <meshStandardMaterial
            color="#0bbcb8"
            emissive="#0bbcb8"
            emissiveIntensity={1.5}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Outer Ring 1 - Medical Blue */}
        <mesh ref={outerRing1Ref}>
          <torusGeometry args={[3.6, 0.07, 16, 100]} />
          <meshStandardMaterial
            color="#0e64ff"
            emissive="#0e64ff"
            emissiveIntensity={1.2}
          />
        </mesh>

        {/* Outer Ring 2 - Holographic Purple */}
        <mesh ref={outerRing2Ref} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[4.4, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#7c3aed"
            emissive="#7c3aed"
            emissiveIntensity={1.2}
          />
        </mesh>

        {/* Orbiting Satellite Nodes */}
        <group ref={satellitesRef}>
          {satellites.map((pos, idx) => (
            <mesh key={idx} position={pos}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial
                color={idx % 2 === 0 ? "#0bbcb8" : "#60a5fa"}
                emissive={idx % 2 === 0 ? "#0bbcb8" : "#60a5fa"}
                emissiveIntensity={2}
              />
            </mesh>
          ))}
        </group>
      </Float>
    </group>
  );
}

// ─── Main Spatial 3D WebGL Canvas ──────────────────────────────────────────
export default function Spatial3DCanvas() {
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

  return (
    <div
      id="spatial-3d-canvas-container"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
        background: 'transparent',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[12, 12, 12]} intensity={1.8} color="#0e64ff" />
        <pointLight position={[-12, -12, -12]} intensity={1.2} color="#7c3aed" />
        <spotLight position={[0, 15, 10]} intensity={1.5} color="#0bbcb8" angle={0.6} />

        <ParticleNetwork count={450} scrollY={scrollY} />
        <MedicalCore3DScene mousePos={mousePos} scrollY={scrollY} />
      </Canvas>
    </div>
  );
}
