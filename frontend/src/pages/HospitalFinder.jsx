import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Clock, Phone, Navigation, Star, Filter,
  Activity, Locate, X, Bed, AlertTriangle, Building2, RefreshCw,
  CheckCircle2, Globe, ChevronDown, ChevronRight, Shield, Zap,
  Heart, SlidersHorizontal, ArrowUpDown, TriangleAlert, ExternalLink,
  Layers, Compass, Sparkles, UserCheck, Stethoscope
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  HOSPITALS, INDIA_STATES, CITIES_BY_STATE, HOSPITAL_TYPES,
  hospitalsNearLocation, CITY_COORDS,
} from '../data/mockData';
import { geocodeCity, queryOverpassHospitals } from '../services/osmDiscovery';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';

// ─── Specialization Constants ──────────────────────────────────────────────────
const SPECIALIZATIONS = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology',
  'Dermatology', 'Gastroenterology', 'Psychiatry', 'Urology', 'General Surgery',
];

// ─── 3D Leaflet Custom Icons ───────────────────────────────────────────────────
const createLeafletIcon = (color = '#0e64ff', label = '', selected = false) =>
  L.divIcon({
    className: 'custom-spatial-marker',
    html: `
      <div style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -100%) ${selected ? 'scale(1.15) translateY(-8px)' : 'scale(1.0)'};
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        cursor: pointer;
        font-family: Outfit, Inter, sans-serif;
        z-index: ${selected ? 1000 : 100};
      ">
        {/* Floating 3D Badge */}
        <div style="
          background: ${selected
            ? 'linear-gradient(135deg, #0e64ff 0%, #7c3aed 100%)'
            : color === '#dc2626'
              ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'
              : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'};
          color: white;
          padding: 6px 12px 6px 8px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
          box-shadow: ${selected
            ? '0 12px 30px rgba(14,100,255,0.6), 0 0 0 3px rgba(255,255,255,0.9)'
            : '0 8px 24px rgba(0,0,0,0.4), 0 0 0 1.5px rgba(255,255,255,0.2)'};
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
          backdrop-filter: blur(8px);
          letter-spacing: -0.01em;
        ">
          <span style="
            font-size: 13px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
          ">
            ${color === '#dc2626' ? '🚨' : '🏥'}
          </span>
          <span>${(label || 'Hospital').split(' ')[0]}</span>
        </div>

        {/* Pin stem */}
        <div style="
          width: 2px;
          height: 10px;
          background: ${color === '#dc2626' ? '#dc2626' : '#0e64ff'};
          box-shadow: 0 0 6px ${color};
        "></div>

        {/* 3D Drop Shadow on ground */}
        <div style="
          width: 18px;
          height: 6px;
          background: rgba(0, 0, 0, 0.35);
          border-radius: 50%;
          filter: blur(2px);
          transform: translateY(-2px);
        "></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

const leafletUserIcon = L.divIcon({
  className: 'custom-spatial-user-marker',
  html: `
    <div style="position:relative; width:32px; height:32px; transform:translate(-50%,-50%)">
      {/* Central 3D User Gem */}
      <div style="
        position: absolute; inset: 6px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        border: 2.5px solid white;
        border-radius: 50%;
        box-shadow: 0 0 20px #10b981, 0 4px 10px rgba(0,0,0,0.3);
        z-index: 2;
      "></div>

      {/* Radar Ring 1 */}
      <div style="
        position: absolute; inset: -4px;
        border-radius: 50%;
        border: 2px solid rgba(16, 185, 129, 0.6);
        animation: spatial-radar 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
      "></div>

      {/* Radar Ring 2 */}
      <div style="
        position: absolute; inset: -14px;
        border-radius: 50%;
        border: 1.5px solid rgba(16, 185, 129, 0.3);
        animation: spatial-radar 2s cubic-bezier(0, 0.2, 0.8, 1) infinite 0.6s;
      "></div>

      <style>
        @keyframes spatial-radar {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      </style>
    </div>
  `,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

// ─── Map Controller ───────────────────────────────────────────────────────────
function LeafletMapController({ center, hospitals, userLocation, focusHospital }) {
  const map = useMap();

  useEffect(() => {
    if (focusHospital?.lat && focusHospital?.lng) {
      map.setView([Number(focusHospital.lat), Number(focusHospital.lng)], 15, { animate: true });
      return;
    }
    if (hospitals && hospitals.length > 0) {
      try {
        const points = hospitals.filter(h => h.lat && h.lng).map(h => [Number(h.lat), Number(h.lng)]);
        if (userLocation) points.push([userLocation.lat, userLocation.lng]);
        if (points.length === 1) {
          map.setView(points[0], 14);
        } else if (points.length > 1) {
          map.fitBounds(L.latLngBounds(points), { padding: [60, 60], maxZoom: 14 });
        }
      } catch (err) {
        console.error('Leaflet bounds error:', err);
      }
    } else if (center) {
      map.setView([center.lat, center.lng], 11);
    }
  }, [center, hospitals, userLocation, focusHospital, map]);

  return null;
}

// ─── 3D Stars Rating ─────────────────────────────────────────────────────────
function SpatialStars({ rating = 4.5, size = 12 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          style={{
            fill: i < full || (i === full && half) ? '#f59e0b' : 'none',
            color: i < full || (i === full && half) ? '#f59e0b' : 'rgba(255,255,255,0.2)',
            filter: i < full ? 'drop-shadow(0 2px 4px rgba(245,158,11,0.4))' : 'none',
          }}
        />
      ))}
    </span>
  );
}

// ─── 3D Floating Hospital Card Component ──────────────────────────────────────
function SpatialHospitalCard({ hospital, userLocation, selected, onSelect, onFocusMap }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const handleNavigate = (e) => {
    e.stopPropagation();
    if (userLocation && hospital.lat && hospital.lng) {
      window.open(
        `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation.lat},${userLocation.lng};${hospital.lat},${hospital.lng}`,
        '_blank'
      );
    } else {
      window.open(
        hospital.mapsUrl || `https://www.openstreetmap.org/?mlat=${hospital.lat}&mlon=${hospital.lng}#map=16/${hospital.lat}/${hospital.lng}`,
        '_blank'
      );
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { onSelect(hospital); onFocusMap(hospital); }}
      style={{
        background: selected
          ? 'linear-gradient(135deg, rgba(14,100,255,0.18) 0%, rgba(124,58,237,0.14) 100%)'
          : hovered
            ? 'var(--bg-card-hover)'
            : 'var(--glass-bg)',
        backdropFilter: 'blur(20px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
        borderRadius: 22,
        border: selected
          ? '1.5px solid rgba(14,100,255,0.6)'
          : hovered
            ? '1.5px solid rgba(14,100,255,0.35)'
            : '1px solid var(--glass-border)',
        padding: '16px 18px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: selected
          ? '0 16px 40px rgba(14,100,255,0.25), inset 0 1px 1px rgba(255,255,255,0.3)'
          : hovered
            ? '0 12px 32px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.2)'
            : '0 4px 20px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.1)',
        transform: selected
          ? 'translateZ(20px) scale(1.02)'
          : hovered
            ? 'translateZ(12px) translateY(-3px)'
            : 'translateZ(0px)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease',
      }}
    >
      {/* Glowing 3D Edge Accent */}
      {selected && (
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: 4,
          background: 'linear-gradient(180deg, #0e64ff 0%, #7c3aed 100%)',
          boxShadow: '0 0 12px #0e64ff',
        }} />
      )}

      {/* Title & Badge Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
            <h3 style={{
              fontSize: 15, fontWeight: 800, color: 'var(--text-primary)',
              fontFamily: 'Outfit, sans-serif', lineHeight: 1.2, margin: 0,
            }}>
              {hospital.name}
            </h3>
            {hospital.emergency && (
              <span style={{
                fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 20,
                background: 'rgba(220,38,38,0.12)', color: '#dc2626',
                border: '1px solid rgba(220,38,38,0.25)', letterSpacing: '0.04em',
                flexShrink: 0, textTransform: 'uppercase',
                boxShadow: '0 2px 8px rgba(220,38,38,0.15)',
              }}>24/7 ER</span>
            )}
            {hospital.isOsmData && (
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 20,
                background: 'rgba(16,185,129,0.12)', color: '#059669',
                border: '1px solid rgba(16,185,129,0.25)', flexShrink: 0,
              }}>OSM</span>
            )}
          </div>

          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={11} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {hospital.address || `${hospital.city}, ${hospital.state}`}
            </span>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <SpatialStars rating={hospital.rating || 4.5} size={11} />
              <span style={{ fontSize: 12, fontWeight: 800, color: '#f59e0b' }}>{hospital.rating || 4.5}</span>
            </div>
            {hospital.distance > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 20,
                background: 'var(--primary-light)', color: 'var(--primary)',
                border: '1px solid rgba(14,100,255,0.2)',
              }}>
                {hospital.distance.toFixed(1)} km away
              </span>
            )}
          </div>
        </div>

        {/* 3D Glass Hospital Icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 14, flexShrink: 0,
          background: hospital.emergency
            ? 'linear-gradient(135deg, rgba(220,38,38,0.15) 0%, rgba(220,38,38,0.05) 100%)'
            : 'linear-gradient(135deg, rgba(14,100,255,0.15) 0%, rgba(11,188,184,0.05) 100%)',
          border: hospital.emergency ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(14,100,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: hospital.emergency ? '0 4px 14px rgba(220,38,38,0.2)' : '0 4px 14px rgba(14,100,255,0.2)',
        }}>
          {hospital.emergency
            ? <Activity size={20} color="#dc2626" />
            : <Building2 size={20} color="var(--primary)" />}
        </div>
      </div>

      {/* 3D Beds Mini Stat Breakdown */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 10,
        padding: '10px 12px', borderRadius: 14,
        background: 'var(--bg-primary)', border: '1px solid var(--border)',
      }}>
        {[
          { label: 'General', value: hospital.beds?.general ?? 15, color: '#3b82f6' },
          { label: 'ICU Beds', value: hospital.beds?.icu ?? 4, color: '#ef4444' },
          { label: 'Emergency', value: hospital.beds?.emergency ?? 3, color: '#f59e0b' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 16, fontWeight: 900, color, margin: 0, fontFamily: 'Outfit, sans-serif' }}>{value}</p>
            <p style={{ fontSize: 9, color: 'var(--text-muted)', margin: '1px 0 0', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          onClick={handleNavigate}
          style={{
            flex: 1, padding: '9px 0', borderRadius: 12,
            border: '1.5px solid var(--border)', background: 'var(--bg-primary)',
            color: 'var(--text-primary)', fontSize: 12, fontWeight: 800,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
        >
          <Navigation size={13} /> Directions
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); navigate('/hospitals/' + hospital.id); }}
          style={{
            flex: 1, padding: '9px 0', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, var(--primary) 0%, #0040cc 100%)',
            color: 'white', fontSize: 12, fontWeight: 800,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: '0 4px 14px rgba(14,100,255,0.35)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(14,100,255,0.5)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(14,100,255,0.35)'}
        >
          <ExternalLink size={13} /> Details
        </button>
      </div>
    </motion.div>
  );
}

// ─── 3D Floating Inspector Panel (Selected Hospital Drawer) ───────────────────
function SpatialInspectorPanel({ hospital, userLocation, onClose }) {
  const navigate = useNavigate();
  if (!hospital) return null;

  const handleDirections = () => {
    if (userLocation && hospital.lat && hospital.lng) {
      window.open(`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation.lat},${userLocation.lng};${hospital.lat},${hospital.lng}`, '_blank');
    } else {
      window.open(hospital.mapsUrl || `https://www.openstreetmap.org/?mlat=${hospital.lat}&mlon=${hospital.lng}#map=16/${hospital.lat}/${hospital.lng}`, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute',
        bottom: 24,
        left: 24,
        zIndex: 1100,
        maxWidth: 420,
        width: 'calc(100% - 48px)',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(24px) saturate(2)',
        WebkitBackdropFilter: 'blur(24px) saturate(2)',
        borderRadius: 24,
        border: '1.5px solid rgba(14,100,255,0.35)',
        padding: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
              {hospital.name}
            </h2>
            {hospital.emergency && (
              <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: 'rgba(220,38,38,0.15)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.3)' }}>
                24/7 ER
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={12} color="var(--primary)" />
            {hospital.address || `${hospital.city}, ${hospital.state}`}
          </p>
        </div>
        <button onClick={onClose} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 12, padding: 6, cursor: 'pointer' }}>
          <X size={16} color="var(--text-muted)" />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, padding: '10px 14px', borderRadius: 14, background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
        <SpatialStars rating={hospital.rating || 4.5} size={14} />
        <span style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b' }}>{hospital.rating || 4.5}</span>
        {hospital.distance > 0 && (
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary)', marginLeft: 'auto' }}>
            {hospital.distance.toFixed(1)} km away
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'General Beds', val: hospital.beds?.general ?? 15, col: '#3b82f6' },
          { label: 'ICU Beds', val: hospital.beds?.icu ?? 4, col: '#ef4444' },
          { label: 'Emergency', val: hospital.beds?.emergency ?? 3, col: '#f59e0b' },
        ].map(({ label, val, col }) => (
          <div key={label} style={{ textAlign: 'center', padding: '10px 6px', borderRadius: 14, background: 'var(--bg-primary)', border: `1px solid ${col}25` }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: col, margin: 0, fontFamily: 'Outfit, sans-serif' }}>{val}</p>
            <p style={{ fontSize: 9, color: 'var(--text-muted)', margin: '2px 0 0', textTransform: 'uppercase', fontWeight: 700 }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={handleDirections}
          style={{ flex: 1, padding: '11px', borderRadius: 14, border: '1.5px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <Navigation size={15} /> Directions
        </button>
        <button
          onClick={() => navigate('/doctors')}
          style={{ flex: 1, padding: '11px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 14px rgba(16,185,129,0.35)' }}
        >
          <Stethoscope size={15} /> View Doctors
        </button>
        <button
          onClick={() => navigate('/hospitals/' + hospital.id)}
          style={{ flex: 1, padding: '11px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, var(--primary), #0040cc)', color: 'white', fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 14px rgba(14,100,255,0.35)' }}
        >
          <ExternalLink size={15} /> Details
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main 3D Hospital Finder Spatial Platform ─────────────────────────────────
export default function HospitalFinder() {
  const navigate = useNavigate();
  const { location } = useApp();

  // State (100% logic preserved)
  const [userLocation, setUserLocation] = useState(location ? { lat: location.lat, lng: location.lng } : null);
  const [locationStatus, setLocationStatus] = useState(location?.source === 'gps' ? 'found' : 'idle');

  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState(location?.state || 'Maharashtra');
  const [selectedCity, setSelectedCity] = useState(location?.city || 'Pune');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [distanceMax, setDistanceMax] = useState('20');
  const [sort, setSort] = useState('distance');

  const [hospitals, setHospitals] = useState(HOSPITALS || []);
  const [osmHospitals, setOsmHospitals] = useState([]);
  const [isSearchingOsm, setIsSearchingOsm] = useState(false);
  const [discoveryStatus, setDiscoveryStatus] = useState('ready');
  const [displayCount, setDisplayCount] = useState(20);

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [focusHospital, setFocusHospital] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileView, setMobileView] = useState('map'); // 'map' | 'list'

  // Location Context Sync
  useEffect(() => {
    if (location) {
      if (location.state) setSelectedState(location.state);
      if (location.city) setSelectedCity(location.city);
      if (location.lat && location.lng) {
        setUserLocation({ lat: location.lat, lng: location.lng });
        if (location.source === 'gps') setLocationStatus('found');
      }
    }
  }, [location]);

  // OSM Discovery Handler
  const executeOsmDiscovery = useCallback(async (targetCity, targetState, targetLocation) => {
    setIsSearchingOsm(true);
    setDiscoveryStatus('searching');
    try {
      let coords = targetLocation;
      if (!coords && targetCity) {
        coords = await geocodeCity(targetCity, targetState || 'Maharashtra');
      }
      if (!coords) {
        coords = CITY_COORDS['Pune'] || { lat: 18.5204, lng: 73.8567 };
      }
      const radiusKm = distanceMax ? Number(distanceMax) : 20;
      const fetched = await queryOverpassHospitals({ lat: coords.lat, lng: coords.lng, radiusKm, userLocation });
      if (fetched && fetched.length > 0) {
        setOsmHospitals(fetched);
        setDiscoveryStatus('osm_success');
      } else {
        const localDist = hospitalsNearLocation(coords.lat, coords.lng, HOSPITALS || []);
        setHospitals(localDist);
        setOsmHospitals([]);
        setDiscoveryStatus('fallback_active');
      }
    } catch (err) {
      console.warn('OSM Discovery error, using local dataset:', err);
      setOsmHospitals([]);
      setDiscoveryStatus('fallback_active');
    } finally {
      setIsSearchingOsm(false);
    }
  }, [distanceMax, userLocation]);

  useEffect(() => {
    if (selectedCity) {
      executeOsmDiscovery(selectedCity, selectedState, null);
    } else if (selectedState) {
      const firstCity = CITIES_BY_STATE[selectedState]?.[0] || 'Mumbai';
      executeOsmDiscovery(firstCity, selectedState, null);
    } else if (userLocation) {
      executeOsmDiscovery(null, null, userLocation);
    } else {
      executeOsmDiscovery('Pune', 'Maharashtra', null);
    }
  }, [selectedState, selectedCity, userLocation, executeOsmDiscovery]);

  // GPS Location Handler
  const handleDetectLocation = (showToast = true) => {
    setLocationStatus('detecting');
    if (!navigator.geolocation) {
      if (showToast) toast.error('Geolocation not supported by your browser');
      setLocationStatus('manual');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setLocationStatus('found');
        if (showToast) toast.success('Location detected! Searching nearby hospitals.');
        executeOsmDiscovery(null, null, coords);
      },
      () => {
        setLocationStatus('manual');
        if (showToast) toast.error('Could not get location. Select state/city manually.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleStateChange = (e) => { setSelectedState(e.target.value); setSelectedCity(''); };

  const resetFilters = () => {
    setSearch(''); setSelectedType(''); setSelectedSpecialist('');
    setEmergencyOnly(false); setDistanceMax('20'); setSort('distance');
    setDisplayCount(20); setOsmHospitals([]);
    toast.success('Filters reset');
  };

  // Normalization + Filter Logic
  const normalizeStr = (str) => (str ? String(str).trim().toLowerCase() : '');

  const activeDataset = useMemo(() => {
    if (osmHospitals && osmHospitals.length > 0) return osmHospitals;
    return hospitals || HOSPITALS || [];
  }, [osmHospitals, hospitals]);

  const filteredHospitals = useMemo(() => {
    return activeDataset.filter(h => {
      if (search) {
        const q = normalizeStr(search);
        if (!normalizeStr(h.name).includes(q) && !normalizeStr(h.city).includes(q) && !normalizeStr(h.address).includes(q)) return false;
      }
      if (!h.isOsmData) {
        if (selectedState && h.state && normalizeStr(h.state) !== normalizeStr(selectedState)) return false;
        if (selectedCity && h.city && normalizeStr(h.city) !== normalizeStr(selectedCity)) return false;
      }
      if (selectedType && h.type && normalizeStr(h.type) !== normalizeStr(selectedType)) return false;
      if (selectedSpecialist && h.specialists?.length > 0) {
        const target = normalizeStr(selectedSpecialist);
        const hasSpec = h.specialists.some(s => {
          const spec = normalizeStr(s);
          return spec === target || spec.includes(target) || target.includes(spec);
        });
        if (!hasSpec && !h.isOsmData) return false;
      }
      if (emergencyOnly && !h.emergency) return false;
      if (distanceMax && h.distance !== undefined && h.distance > Number(distanceMax)) return false;
      return true;
    }).sort((a, b) => {
      if (sort === 'distance') return (a.distance || 0) - (b.distance || 0);
      if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sort === 'beds') return ((b.beds?.general || 0) + (b.beds?.icu || 0)) - ((a.beds?.general || 0) + (a.beds?.icu || 0));
      return 0;
    });
  }, [activeDataset, search, selectedState, selectedCity, selectedType, selectedSpecialist, emergencyOnly, distanceMax, sort]);

  const visibleHospitals = useMemo(() => filteredHospitals.slice(0, displayCount), [filteredHospitals, displayCount]);

  const mapCenter = useMemo(() => {
    if (userLocation) return userLocation;
    if (selectedCity && CITY_COORDS?.[selectedCity]) return CITY_COORDS[selectedCity];
    if (selectedState && CITIES_BY_STATE?.[selectedState]) {
      const first = CITIES_BY_STATE[selectedState][0];
      if (CITY_COORDS?.[first]) return CITY_COORDS[first];
    }
    if (filteredHospitals.length > 0) {
      const valid = filteredHospitals.filter(h => h.lat && h.lng);
      if (valid.length > 0) {
        return { lat: valid.reduce((s, h) => s + Number(h.lat), 0) / valid.length, lng: valid.reduce((s, h) => s + Number(h.lng), 0) / valid.length };
      }
    }
    return { lat: 18.5204, lng: 73.8567 };
  }, [userLocation, selectedCity, selectedState, filteredHospitals]);

  const locationLabel = locationStatus === 'found'
    ? (location?.formattedLocation || `${selectedCity}, ${selectedState}`)
    : selectedCity
      ? `${selectedCity}, ${selectedState}`
      : selectedState || 'Pan India';

  return (
    <div
      className="hospital-finder-spatial"
      style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
        background: '#070b14',
        fontFamily: 'Inter, sans-serif',
        perspective: '1200px',
      }}
    >

      {/* ── LAYER 1: FULL-SCREEN REAL MAP ENVIRONMENT ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={selectedCity ? 12 : selectedState ? 8 : 6}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LeafletMapController
            center={mapCenter}
            hospitals={visibleHospitals}
            userLocation={userLocation}
            focusHospital={focusHospital}
          />

          {/* User location 3D marker */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={leafletUserIcon}>
              <Popup>
                <div style={{ padding: 4, fontSize: 12, fontWeight: 800, color: '#059669', fontFamily: 'Outfit, sans-serif' }}>
                  📍 Current GPS Position
                </div>
              </Popup>
            </Marker>
          )}

          {/* 3D Hospital Markers */}
          {visibleHospitals.map(h => (
            <Marker
              key={h.id}
              position={[Number(h.lat), Number(h.lng)]}
              icon={createLeafletIcon(
                h.emergency ? '#dc2626' : '#0e64ff',
                h.name,
                selectedHospital?.id === h.id
              )}
              eventHandlers={{
                click: () => {
                  setSelectedHospital(h);
                  setFocusHospital(null);
                }
              }}
            >
              <Popup>
                <div style={{ padding: '6px 4px', minWidth: 210, fontFamily: 'Inter, sans-serif' }}>
                  <p style={{ fontSize: 14, fontWeight: 900, color: '#0f172a', margin: '0 0 3px', fontFamily: 'Outfit, sans-serif' }}>{h.name}</p>
                  <p style={{ fontSize: 11, color: '#475569', margin: '0 0 6px' }}>{h.address || `${h.city}, ${h.state}`}</p>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: 12 }}>★ {h.rating || 4.5}</span>
                    {h.distance > 0 && <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>{h.distance.toFixed(1)} km</span>}
                    {h.emergency && <span style={{ fontSize: 9, background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '1px 6px', borderRadius: 10, fontWeight: 800 }}>24/7 ER</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      style={{ flex: 1, background: '#0e64ff', color: 'white', border: 'none', borderRadius: 8, padding: '7px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                      onClick={() => navigate('/hospitals/' + h.id)}
                    >Details</button>
                    <button
                      style={{ flex: 1, background: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: 8, padding: '7px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                      onClick={() => window.open(`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation ? userLocation.lat + ',' + userLocation.lng : ''};${h.lat},${h.lng}`, '_blank')}
                    >Directions</button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* ── LAYER 2: FLOATING SPATIAL TOP DOCK ── */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 500,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {/* Row 1: Location pill + Search Capsule + Emergency Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          
          {/* 3D Location Pill (Left) */}
          <div style={{
            pointerEvents: 'auto',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(20px) saturate(1.8)',
            border: '1px solid var(--glass-border)',
            padding: '8px 16px',
            borderRadius: 20,
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <MapPin size={15} color="var(--primary)" />
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, margin: 0, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{locationLabel}</p>
            </div>
            <button
              onClick={() => handleDetectLocation(true)}
              style={{
                background: locationStatus === 'found' ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--primary-light)',
                color: locationStatus === 'found' ? 'white' : 'var(--primary)',
                border: 'none', borderRadius: 14, padding: '5px 10px', fontSize: 11, fontWeight: 800,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <Locate size={12} />
              {locationStatus === 'detecting' ? 'GPS…' : locationStatus === 'found' ? 'GPS Active' : 'Locate Me'}
            </button>
          </div>

          {/* 3D Floating Search Bar (Center) */}
          <div style={{
            pointerEvents: 'auto',
            flex: 1,
            maxWidth: 520,
            minWidth: 260,
            position: 'relative',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(24px) saturate(2)',
            border: '1.5px solid rgba(14,100,255,0.3)',
            borderRadius: 24,
            padding: '4px 6px 4px 16px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <Search size={16} color="var(--primary)" />
            <input
              type="text"
              placeholder="Search hospitals by name, condition, or city (e.g. 'Ruby Hall', 'Mumbai')…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-primary)',
                fontFamily: 'Inter, sans-serif',
              }}
            />
            {isSearchingOsm && <RefreshCw size={14} color="var(--primary)" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />}
            <button
              onClick={() => setFiltersOpen(p => !p)}
              style={{
                background: filtersOpen ? 'var(--primary)' : 'var(--bg-primary)',
                color: filtersOpen ? 'white' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 18,
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                flexShrink: 0,
              }}
            >
              <SlidersHorizontal size={12} /> Filters
            </button>
          </div>

          {/* 3D Floating Emergency SOS Control (Right) */}
          <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => {
                setEmergencyOnly(true);
                toast.error('Emergency 24/7 Filter Activated');
              }}
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.4)',
                borderRadius: 20,
                padding: '8px 16px',
                fontSize: 12,
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 8px 24px rgba(220,38,38,0.4)',
                fontFamily: 'Outfit, sans-serif',
                letterSpacing: '0.04em',
              }}
            >
              <Activity size={15} color="white" /> 24/7 SOS
            </button>
          </div>
        </div>

        {/* Floating Filter Dock (Expanded) */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              style={{
                pointerEvents: 'auto',
                alignSelf: 'center',
                width: '100%',
                maxWidth: 820,
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(24px) saturate(2)',
                border: '1px solid var(--glass-border)',
                borderRadius: 20,
                padding: '12px 16px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <select value={selectedState} onChange={handleStateChange} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 12, padding: '7px 12px', fontSize: 12, color: 'var(--text-primary)', outline: 'none' }}>
                <option value="">All States</option>
                {INDIA_STATES?.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedState} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 12, padding: '7px 12px', fontSize: 12, color: 'var(--text-primary)', outline: 'none' }}>
                <option value="">All Cities</option>
                {selectedState && CITIES_BY_STATE?.[selectedState]?.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 12, padding: '7px 12px', fontSize: 12, color: 'var(--text-primary)', outline: 'none' }}>
                <option value="">All Hospital Types</option>
                {HOSPITAL_TYPES?.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <select value={selectedSpecialist} onChange={(e) => setSelectedSpecialist(e.target.value)} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 12, padding: '7px 12px', fontSize: 12, color: 'var(--text-primary)', outline: 'none' }}>
                <option value="">All Specialists</option>
                {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select value={distanceMax} onChange={(e) => setDistanceMax(e.target.value)} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 12, padding: '7px 12px', fontSize: 12, color: 'var(--text-primary)', outline: 'none' }}>
                <option value="">Any Distance</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="20">Within 20 km</option>
                <option value="50">Within 50 km</option>
              </select>

              <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 12, padding: '7px 12px', fontSize: 12, color: 'var(--text-primary)', outline: 'none' }}>
                <option value="distance">Sort by Distance</option>
                <option value="rating">Sort by Rating</option>
                <option value="beds">Sort by Beds</option>
              </select>

              <button onClick={resetFilters} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '7px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <X size={12} /> Reset
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── LAYER 3: FLOATING 3D HOSPITAL CARDS DOCK (RIGHT PANEL) ── */}
      <div
        className="spatial-cards-dock"
        style={{
          position: 'absolute',
          top: 90,
          right: 20,
          bottom: 24,
          width: 360,
          zIndex: 500,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          pointerEvents: 'none',
        }}
      >
        {/* Header Strip */}
        <div style={{
          pointerEvents: 'auto',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px) saturate(1.8)',
          border: '1px solid var(--glass-border)',
          borderRadius: 18,
          padding: '10px 16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 size={16} color="var(--primary)" />
            <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
              Hospitals ({filteredHospitals.length})
            </span>
          </div>
          <div style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 12, background: discoveryStatus === 'osm_success' ? 'rgba(16,185,129,0.15)' : 'var(--primary-light)', color: discoveryStatus === 'osm_success' ? '#059669' : 'var(--primary)' }}>
            {discoveryStatus === 'osm_success' ? 'OSM Live' : 'Demo Set'}
          </div>
        </div>

        {/* Scrollable Floating Cards List */}
        <div
          style={{
            pointerEvents: 'auto',
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            paddingRight: 4,
            perspective: '1000px',
          }}
          className="custom-scrollbar"
        >
          <AnimatePresence>
            {visibleHospitals.map(hospital => (
              <SpatialHospitalCard
                key={hospital.id}
                hospital={hospital}
                userLocation={userLocation}
                selected={selectedHospital?.id === hospital.id}
                onSelect={(h) => setSelectedHospital(h)}
                onFocusMap={(h) => setFocusHospital(h)}
              />
            ))}
          </AnimatePresence>

          {filteredHospitals.length === 0 && !isSearchingOsm && (
            <div style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(20px)',
              borderRadius: 20,
              padding: '30px 20px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              border: '1px dashed var(--border)',
            }}>
              <Building2 size={36} style={{ opacity: 0.3, marginBottom: 8 }} />
              <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>No hospitals found</p>
              <p style={{ fontSize: 11, margin: 0 }}>Try clearing filters or changing city</p>
            </div>
          )}
        </div>
      </div>

      {/* ── LAYER 4: FLOATING SPATIAL INSPECTOR PANEL (SELECTED HOSPITAL) ── */}
      <AnimatePresence>
        {selectedHospital && (
          <SpatialInspectorPanel
            hospital={selectedHospital}
            userLocation={userLocation}
            onClose={() => setSelectedHospital(null)}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(14,100,255,0.3); border-radius: 99px; }
        
        @media (max-width: 768px) {
          .spatial-cards-dock {
            top: auto !important;
            left: 12px !important;
            right: 12px !important;
            bottom: 12px !important;
            width: auto !important;
            height: 240px !important;
          }
        }
      `}</style>
    </div>
  );
}
