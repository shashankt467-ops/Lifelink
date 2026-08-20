import { useRef, useState, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  Text,
  Box,
  Sphere,
  RoundedBox,
  Grid,
  GizmoHelper,
  GizmoViewport,
  PerspectiveCamera,
  Html,
  Plane,
} from '@react-three/drei';
import * as THREE from 'three';

// ─── Room Color Map ───────────────────────────────────────────────────────────
const ROOM_COLORS = {
  'ICU':            '#ef4444',
  'Emergency':      '#f97316',
  'Operation':      '#8b5cf6',
  'Ward':           '#3b82f6',
  'Reception':      '#06b6d4',
  'Pharmacy':       '#10b981',
  'Radiology':      '#f59e0b',
  'Laboratory':     '#ec4899',
  'Cafeteria':      '#84cc16',
  'Administration': '#6366f1',
  'Corridor':       '#94a3b8',
  'Stairs':         '#78716c',
  'Elevator':       '#a3a3a3',
  'Storage':        '#64748b',
  'default':        '#60a5fa',
};

// ─── Overlay Color Map ────────────────────────────────────────────────────────
const OVERLAY_PALETTE = {
  vastu:        { low: '#ef4444', mid: '#f59e0b', high: '#22c55e' },
  sustainability:{ low: '#dc2626', mid: '#fb923c', high: '#16a34a' },
  occupancy:    { low: '#3b82f6', mid: '#f59e0b', high: '#ef4444' },
  none:         null,
};

function scoreColor(score, palette) {
  if (!palette) return null;
  if (score >= 75) return palette.high;
  if (score >= 50) return palette.mid;
  return palette.low;
}

// ─── Room Box ────────────────────────────────────────────────────────────────
function RoomBox({ room, floorY, floorHeight, selected, onClick, overlay, exploded, floorIndex }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  const w = (room.width || 4) * 0.5;
  const d = (room.depth || 4) * 0.5;
  const h = floorHeight * 0.85;

  const baseColor = ROOM_COLORS[room.type] || ROOM_COLORS.default;
  const overlayPalette = OVERLAY_PALETTE[overlay];
  const roomScore = room.vastu_score ?? room.sustainability_score ?? room.occupancy ?? 70;
  const finalColor = overlayPalette ? scoreColor(roomScore, overlayPalette) : baseColor;

  const explodeOffset = exploded ? floorIndex * 1.5 : 0;
  const posY = floorY + h / 2 + explodeOffset;

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
      meshRef.current.material.emissiveIntensity,
      hovered || selected ? 0.25 : 0,
      0.1
    );
  });

  return (
    <group position={[room.x || 0, posY, room.z || 0]}>
      <RoundedBox
        ref={meshRef}
        args={[w * 2, h, d * 2]}
        radius={0.08}
        smoothness={4}
        onClick={(e) => { e.stopPropagation(); onClick(room); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={finalColor}
          emissive={finalColor}
          emissiveIntensity={0}
          transparent
          opacity={selected ? 0.95 : hovered ? 0.88 : 0.78}
          roughness={0.35}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Room label */}
      {(hovered || selected) && (
        <Html center distanceFactor={12} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '4px 10px',
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            fontFamily: 'Inter, sans-serif',
            border: `1.5px solid ${finalColor}`,
          }}>
            {room.name || room.type}
            {overlayPalette && <span style={{ marginLeft: 6, color: finalColor }}>{roomScore}%</span>}
          </div>
        </Html>
      )}

      {/* Selection outline */}
      {selected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(w * 2 + 0.05, h + 0.05, d * 2 + 0.05)]} />
          <lineBasicMaterial color="#ffffff" linewidth={2} />
        </lineSegments>
      )}
    </group>
  );
}

// ─── Floor Slab ───────────────────────────────────────────────────────────────
function FloorSlab({ y, width, depth, floorIndex, isSelected, exploded }) {
  const explodeOffset = exploded ? floorIndex * 1.5 : 0;
  return (
    <group position={[0, y + explodeOffset, 0]}>
      <Box args={[width, 0.18, depth]}>
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} metalness={0.05} />
      </Box>
    </group>
  );
}

// ─── Building Envelope ───────────────────────────────────────────────────────
function BuildingEnvelope({ width, depth, totalHeight }) {
  return (
    <group>
      {/* Glass curtain walls */}
      {[
        [0, totalHeight / 2, depth / 2 + 0.05],
        [0, totalHeight / 2, -depth / 2 - 0.05],
        [width / 2 + 0.05, totalHeight / 2, 0],
        [-width / 2 - 0.05, totalHeight / 2, 0],
      ].map((pos, i) => {
        const isZ = i < 2;
        return (
          <Box
            key={i}
            args={isZ ? [width, totalHeight, 0.08] : [0.08, totalHeight, depth]}
            position={pos}
          >
            <meshStandardMaterial
              color="#bfdbfe"
              transparent
              opacity={0.18}
              roughness={0.1}
              metalness={0.3}
            />
          </Box>
        );
      })}
    </group>
  );
}

// ─── Roof with Helipad ────────────────────────────────────────────────────────
function Rooftop({ width, depth, roofY }) {
  return (
    <group position={[0, roofY, 0]}>
      {/* Roof slab */}
      <Box args={[width, 0.2, depth]}>
        <meshStandardMaterial color="#94a3b8" roughness={0.7} />
      </Box>
      {/* Helipad circle */}
      <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial color="#1d4ed8" />
      </mesh>
      <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.5, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <Text
        position={[0, 0.22, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.9}
        color="white"
        fontWeight="bold"
      >
        H
      </Text>
      {/* HVAC units */}
      {[[-3, 0, -3], [3, 0, -3], [-3, 0, 3]].map((pos, i) => (
        <Box key={i} args={[1.5, 0.8, 1.5]} position={pos}>
          <meshStandardMaterial color="#64748b" roughness={0.8} />
        </Box>
      ))}
    </group>
  );
}

// ─── Ground ───────────────────────────────────────────────────────────────────
function Ground({ width, depth }) {
  return (
    <group>
      <Plane
        args={[width * 3, depth * 3]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
      >
        <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
      </Plane>
      {/* Road markings */}
      <Box args={[width * 2, 0.01, 3]} position={[0, -0.04, depth / 2 + 4]}>
        <meshStandardMaterial color="#94a3b8" />
      </Box>
      {/* Parking lot */}
      <Box args={[width * 0.8, 0.01, depth * 0.4]} position={[width * 0.9, -0.04, 0]}>
        <meshStandardMaterial color="#cbd5e1" />
      </Box>
      {/* Trees */}
      {[[-width / 2 - 3, 0, -depth / 2], [width / 2 + 3, 0, depth / 2], [-width / 2 - 3, 0, depth / 2]].map((pos, i) => (
        <group key={i} position={pos}>
          <Box args={[0.3, 2, 0.3]} position={[0, 1, 0]}>
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </Box>
          <Sphere args={[1.2, 8, 8]} position={[0, 2.8, 0]}>
            <meshStandardMaterial color="#15803d" roughness={0.8} />
          </Sphere>
        </group>
      ))}
    </group>
  );
}

// ─── Animated Camera Reset ────────────────────────────────────────────────────
function CameraRig({ view, buildingSize }) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3());
  const posRef = useRef(new THREE.Vector3());

  const VIEWS = useMemo(() => ({
    default: { pos: [buildingSize * 1.8, buildingSize * 1.2, buildingSize * 1.8], target: [0, buildingSize * 0.3, 0] },
    top:     { pos: [0, buildingSize * 3, 0], target: [0, 0, 0] },
    front:   { pos: [0, buildingSize * 0.5, buildingSize * 2.5], target: [0, buildingSize * 0.3, 0] },
    side:    { pos: [buildingSize * 2.5, buildingSize * 0.5, 0], target: [0, buildingSize * 0.3, 0] },
  }), [buildingSize]);

  useEffect(() => {
    const v = VIEWS[view] || VIEWS.default;
    posRef.current.set(...v.pos);
    targetRef.current.set(...v.target);
  }, [view, VIEWS]);

  useFrame(() => {
    camera.position.lerp(posRef.current, 0.05);
  });

  return null;
}

// ─── Main 3D Scene ────────────────────────────────────────────────────────────
function HospitalScene({ design, selectedFloor, selectedRoom, onRoomClick, overlay, exploded, cameraView }) {
  const floorHeight = 3.2;
  const floors = design?.floors || generateDefaultFloors();
  const numFloors = floors.length;
  const totalHeight = numFloors * floorHeight;

  // Compute building footprint
  const footprint = useMemo(() => {
    let maxW = 0, maxD = 0;
    floors.forEach(floor => {
      floor.rooms?.forEach(room => {
        const rx = Math.abs(room.x || 0) + (room.width || 4) * 0.5;
        const rz = Math.abs(room.z || 0) + (room.depth || 4) * 0.5;
        if (rx > maxW) maxW = rx;
        if (rz > maxD) maxD = rz;
      });
    });
    return { width: Math.max(maxW * 2 + 2, 14), depth: Math.max(maxD * 2 + 2, 14) };
  }, [floors]);

  return (
    <>
      <CameraRig view={cameraView} buildingSize={Math.max(footprint.width, footprint.depth)} />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[20, 30, 20]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-15, 20, -15]} intensity={0.4} color="#bfdbfe" />
      <pointLight position={[0, totalHeight + 5, 0]} intensity={0.3} color="#fef3c7" />

      {/* Environment */}
      <Environment preset="city" />

      {/* Ground */}
      <Ground width={footprint.width} depth={footprint.depth} />

      {/* Grid Helper */}
      <Grid
        args={[footprint.width * 3, footprint.depth * 3]}
        position={[0, 0, 0]}
        cellColor="#cbd5e1"
        sectionColor="#94a3b8"
        cellSize={2}
        sectionSize={8}
        fadeDistance={80}
        fadeStrength={1}
      />

      {/* Building Envelope */}
      <BuildingEnvelope width={footprint.width} depth={footprint.depth} totalHeight={totalHeight} />

      {/* Floors & Rooms */}
      {floors.map((floor, fi) => {
        const floorY = fi * floorHeight;
        const isFloorSelected = selectedFloor === null || selectedFloor === fi;
        return (
          <group key={fi} visible={isFloorSelected}>
            <FloorSlab
              y={floorY}
              width={footprint.width}
              depth={footprint.depth}
              floorIndex={fi}
              isSelected={selectedFloor === fi}
              exploded={exploded}
            />
            {floor.rooms?.map((room, ri) => (
              <RoomBox
                key={`${fi}-${ri}`}
                room={room}
                floorY={floorY}
                floorHeight={floorHeight}
                selected={selectedRoom?.name === room.name && selectedRoom?.floor === fi}
                onClick={(r) => onRoomClick({ ...r, floor: fi, floorName: floor.name })}
                overlay={overlay}
                exploded={exploded}
                floorIndex={fi}
              />
            ))}
            {/* Floor label */}
            <Text
              position={[-footprint.width / 2 - 1.2, floorY + floorHeight * 0.5, 0]}
              fontSize={0.45}
              color="#64748b"
              anchorX="right"
              fontWeight="bold"
            >
              {floor.name || `Floor ${fi + 1}`}
            </Text>
          </group>
        );
      })}

      {/* Rooftop */}
      <Rooftop width={footprint.width} depth={footprint.depth} roofY={totalHeight} />
    </>
  );
}

// ─── Default Floor Generator (when no design data) ────────────────────────────
function generateDefaultFloors() {
  const roomTemplates = [
    { name: 'Main Reception', type: 'Reception',      x: 0,    z: 0,    width: 6, depth: 5, vastu_score: 85, sustainability_score: 80, occupancy: 70 },
    { name: 'Emergency Room', type: 'Emergency',      x: -5,   z: 0,    width: 5, depth: 5, vastu_score: 72, sustainability_score: 68, occupancy: 90 },
    { name: 'Pharmacy',       type: 'Pharmacy',       x: 5,    z: 0,    width: 4, depth: 4, vastu_score: 78, sustainability_score: 75, occupancy: 50 },
    { name: 'OPD Ward 1',     type: 'Ward',           x: -5,   z: 5,    width: 4, depth: 4, vastu_score: 82, sustainability_score: 79, occupancy: 60 },
    { name: 'OPD Ward 2',     type: 'Ward',           x: 5,    z: 5,    width: 4, depth: 4, vastu_score: 80, sustainability_score: 77, occupancy: 55 },
    { name: 'Main Corridor',  type: 'Corridor',       x: 0,    z: 5,    width: 8, depth: 2, vastu_score: 65, sustainability_score: 70, occupancy: 40 },
  ];

  return [
    { name: 'Ground Floor', rooms: roomTemplates },
    {
      name: '1st Floor', rooms: [
        { name: 'ICU Unit A',     type: 'ICU',           x: -4,  z: 0,    width: 5, depth: 5, vastu_score: 65, sustainability_score: 72, occupancy: 85 },
        { name: 'ICU Unit B',     type: 'ICU',           x: 4,   z: 0,    width: 5, depth: 5, vastu_score: 70, sustainability_score: 68, occupancy: 75 },
        { name: 'Operation OT1',  type: 'Operation',     x: 0,   z: 5,    width: 5, depth: 5, vastu_score: 88, sustainability_score: 82, occupancy: 45 },
        { name: 'Nurses Station', type: 'Reception',     x: -4,  z: 5,    width: 3, depth: 3, vastu_score: 80, sustainability_score: 76, occupancy: 60 },
        { name: 'Storage',        type: 'Storage',       x: 4,   z: 5,    width: 3, depth: 3, vastu_score: 55, sustainability_score: 60, occupancy: 30 },
      ]
    },
    {
      name: '2nd Floor', rooms: [
        { name: 'Radiology',      type: 'Radiology',     x: -4,  z: 0,    width: 5, depth: 5, vastu_score: 73, sustainability_score: 70, occupancy: 50 },
        { name: 'Laboratory',     type: 'Laboratory',    x: 4,   z: 0,    width: 5, depth: 5, vastu_score: 77, sustainability_score: 74, occupancy: 55 },
        { name: 'Cafeteria',      type: 'Cafeteria',     x: 0,   z: 5,    width: 6, depth: 5, vastu_score: 85, sustainability_score: 82, occupancy: 65 },
        { name: 'Admin Office',   type: 'Administration', x: -4, z: -4,   width: 4, depth: 4, vastu_score: 80, sustainability_score: 78, occupancy: 45 },
      ]
    },
    {
      name: '3rd Floor', rooms: [
        { name: 'Private Ward A', type: 'Ward',          x: -4,  z: 0,    width: 4, depth: 4, vastu_score: 90, sustainability_score: 87, occupancy: 40 },
        { name: 'Private Ward B', type: 'Ward',          x: 4,   z: 0,    width: 4, depth: 4, vastu_score: 88, sustainability_score: 85, occupancy: 35 },
        { name: 'Seminar Room',   type: 'Administration', x: 0,  z: 5,    width: 5, depth: 4, vastu_score: 82, sustainability_score: 80, occupancy: 25 },
        { name: 'Equipment Room', type: 'Storage',       x: 0,  z: -4,   width: 4, depth: 4, vastu_score: 60, sustainability_score: 65, occupancy: 20 },
      ]
    },
  ];
}

// ─── Room Inspector Panel ─────────────────────────────────────────────────────
function RoomInspector({ room, onClose }) {
  if (!room) return null;
  const color = ROOM_COLORS[room.type] || ROOM_COLORS.default;
  const metrics = [
    { label: 'Vastu Score',         value: room.vastu_score ?? 75,          color: '#8b5cf6', max: 100 },
    { label: 'Sustainability',       value: room.sustainability_score ?? 72, color: '#10b981', max: 100 },
    { label: 'Occupancy',           value: room.occupancy ?? 60,            color: '#f59e0b', max: 100 },
  ];

  return (
    <div style={{
      position: 'absolute', right: 12, top: 60, bottom: 12, width: 240,
      background: 'rgba(15,23,42,0.93)', borderRadius: 16, padding: 16,
      backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', flexDirection: 'column', gap: 12,
      fontFamily: 'Inter, sans-serif', color: 'white',
      overflowY: 'auto', zIndex: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
            <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{room.type}</span>
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, lineHeight: 1.3 }}>{room.name}</h3>
          <p style={{ fontSize: 11, color: '#64748b', margin: '4px 0 0' }}>Floor: {room.floorName}</p>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: 26, height: 26, borderRadius: 8, cursor: 'pointer', fontSize: 14 }}
        >✕</button>
      </div>

      <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />

      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { label: 'Width', value: `${(room.width || 4) * 0.5}m` },
          { label: 'Depth', value: `${(room.depth || 4) * 0.5}m` },
        ].map(({ label, value }) => (
          <div key={label} style={{
            flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 10,
            padding: '8px 10px', textAlign: 'center',
          }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#e2e8f0', margin: 0 }}>{value}</p>
            <p style={{ fontSize: 10, color: '#64748b', margin: '2px 0 0', textTransform: 'uppercase' }}>{label}</p>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '4px 0 0' }}>
        Performance Metrics
      </p>
      {metrics.map(({ label, value, color: mc }) => (
        <div key={label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: '#cbd5e1' }}>{label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: mc }}>{value}%</span>
          </div>
          <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.1)' }}>
            <div style={{ width: `${value}%`, height: '100%', borderRadius: 3, background: mc, transition: 'width 0.5s ease' }} />
          </div>
        </div>
      ))}

      {room.notes && (
        <>
          <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />
          <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>{room.notes}</p>
        </>
      )}
    </div>
  );
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────
function Toolbar({ overlay, setOverlay, exploded, setExploded, cameraView, setCameraView, floors, selectedFloor, setSelectedFloor }) {
  const btnStyle = (active) => ({
    padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
    background: active ? 'rgba(59,130,246,0.9)' : 'rgba(255,255,255,0.1)',
    color: active ? 'white' : '#cbd5e1',
    transition: 'all 0.2s',
    fontFamily: 'Inter, sans-serif',
  });

  return (
    <div style={{
      position: 'absolute', top: 12, left: 12, right: 12,
      display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', zIndex: 10,
      pointerEvents: 'auto',
    }}>
      {/* Overlay Selector */}
      <div style={{
        background: 'rgba(15,23,42,0.85)', borderRadius: 12, padding: '6px 10px',
        display: 'flex', gap: 4, backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <span style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', alignSelf: 'center', marginRight: 4 }}>
          Overlay
        </span>
        {['none', 'vastu', 'sustainability', 'occupancy'].map(o => (
          <button key={o} style={btnStyle(overlay === o)} onClick={() => setOverlay(o)}>
            {o === 'none' ? 'Type' : o.charAt(0).toUpperCase() + o.slice(1)}
          </button>
        ))}
      </div>

      {/* Camera Views */}
      <div style={{
        background: 'rgba(15,23,42,0.85)', borderRadius: 12, padding: '6px 10px',
        display: 'flex', gap: 4, backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <span style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', alignSelf: 'center', marginRight: 4 }}>
          View
        </span>
        {['default', 'top', 'front', 'side'].map(v => (
          <button key={v} style={btnStyle(cameraView === v)} onClick={() => setCameraView(v)}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Floor Selector */}
      <div style={{
        background: 'rgba(15,23,42,0.85)', borderRadius: 12, padding: '6px 10px',
        display: 'flex', gap: 4, backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <span style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', alignSelf: 'center', marginRight: 4 }}>
          Floor
        </span>
        <button style={btnStyle(selectedFloor === null)} onClick={() => setSelectedFloor(null)}>All</button>
        {floors.map((fl, i) => (
          <button key={i} style={btnStyle(selectedFloor === i)} onClick={() => setSelectedFloor(selectedFloor === i ? null : i)}>
            {i === 0 ? 'G' : `${i}F`}
          </button>
        ))}
      </div>

      {/* Exploded View Toggle */}
      <button
        style={{
          ...btnStyle(exploded),
          background: exploded ? 'rgba(139,92,246,0.9)' : 'rgba(255,255,255,0.1)',
          padding: '8px 14px',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(16px)',
        }}
        onClick={() => setExploded(prev => !prev)}
      >
        {exploded ? '⊟ Collapse' : '⊞ Explode'}
      </button>
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function Legend({ overlay }) {
  const items = overlay === 'none'
    ? Object.entries(ROOM_COLORS).filter(([k]) => k !== 'default').slice(0, 8)
    : [['Low (0-50%)', overlay === 'vastu' ? '#ef4444' : '#dc2626'],
       ['Mid (50-75%)', '#f59e0b'],
       ['High (75-100%)', '#22c55e']];

  return (
    <div style={{
      position: 'absolute', bottom: 12, left: 12,
      background: 'rgba(15,23,42,0.85)', borderRadius: 12, padding: '10px 14px',
      backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)',
      fontFamily: 'Inter, sans-serif', zIndex: 10,
    }}>
      <p style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>
        {overlay === 'none' ? 'Room Types' : overlay.charAt(0).toUpperCase() + overlay.slice(1) + ' Score'}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', maxWidth: 280 }}>
        {items.map(([name, color]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: '#cbd5e1' }}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Loading Fallback ─────────────────────────────────────────────────────────
function LoadingScene() {
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a, #1e293b)',
    }}>
      <div style={{
        width: 48, height: 48, border: '3px solid rgba(59,130,246,0.3)',
        borderTop: '3px solid #3b82f6', borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <p style={{ color: '#64748b', marginTop: 16, fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
        Building 3D model…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Main Exported Component ──────────────────────────────────────────────────
export default function Hospital3DViewer({ design, height = '600px', showToolbar = true }) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [overlay, setOverlay] = useState('none');
  const [exploded, setExploded] = useState(false);
  const [cameraView, setCameraView] = useState('default');

  const floors = design?.floors || generateDefaultFloors();

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: 20, overflow: 'hidden', background: '#0f172a' }}>
      {/* Toolbar */}
      {showToolbar && (
        <Toolbar
          overlay={overlay}
          setOverlay={setOverlay}
          exploded={exploded}
          setExploded={setExploded}
          cameraView={cameraView}
          setCameraView={setCameraView}
          floors={floors}
          selectedFloor={selectedFloor}
          setSelectedFloor={setSelectedFloor}
        />
      )}

      {/* Room Inspector */}
      {selectedRoom && (
        <RoomInspector room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}

      {/* 3D Canvas */}
      <Suspense fallback={<LoadingScene />}>
        <Canvas
          shadows
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          camera={{ fov: 45, near: 0.1, far: 500, position: [20, 14, 20] }}
          style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e3a5f 60%, #0f172a 100%)' }}
        >
          <PerspectiveCamera makeDefault fov={45} />
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.06}
            minDistance={8}
            maxDistance={120}
            maxPolarAngle={Math.PI / 2.1}
          />
          <HospitalScene
            design={design}
            selectedFloor={selectedFloor}
            selectedRoom={selectedRoom}
            onRoomClick={(room) => setSelectedRoom(prev => prev?.name === room.name && prev?.floor === room.floor ? null : room)}
            overlay={overlay}
            exploded={exploded}
            cameraView={cameraView}
          />
          <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
            <GizmoViewport labelColor="white" axisHeadScale={1} />
          </GizmoHelper>
        </Canvas>
      </Suspense>

      {/* Legend */}
      <Legend overlay={overlay} />

      {/* Controls hint */}
      <div style={{
        position: 'absolute', bottom: 12, right: 12,
        background: 'rgba(15,23,42,0.75)', borderRadius: 10, padding: '6px 12px',
        fontSize: 10, color: '#64748b', fontFamily: 'Inter, sans-serif',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        🖱 Drag to orbit · Scroll to zoom · Click room to inspect
      </div>
    </div>
  );
}
