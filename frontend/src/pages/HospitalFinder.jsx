import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Clock, Phone, Navigation, Star, Filter,
  Activity, Locate, X, Bed, AlertTriangle, Building2, RefreshCw,
  CheckCircle2, Globe, ChevronDown, ChevronRight, Shield, Zap,
  Heart, SlidersHorizontal, ArrowUpDown, TriangleAlert, ExternalLink,
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

// ─── Constants ────────────────────────────────────────────────────────────────
const SPECIALIZATIONS = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology',
  'Dermatology', 'Gastroenterology', 'Psychiatry', 'Urology', 'General Surgery',
];

// ─── Leaflet Custom Icons ─────────────────────────────────────────────────────
const createLeafletIcon = (color = '#0e64ff', label = '', selected = false) =>
  L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${color};
        color: white;
        padding: 5px 10px 5px 8px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 700;
        box-shadow: ${selected ? `0 0 0 3px white, 0 0 0 5px ${color}, 0 8px 20px rgba(0,0,0,0.4)` : '0 4px 14px rgba(0,0,0,0.35)'};
        border: 2px solid rgba(255,255,255,0.9);
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
        transform: translate(-50%, -100%) ${selected ? 'scale(1.12)' : ''};
        transition: all 0.2s ease;
        cursor: pointer;
        font-family: Inter, sans-serif;
        letter-spacing: -0.01em;
      ">
        <span style="font-size:13px">${color === '#dc2626' ? '🚨' : '🏥'}</span>
        <span>${(label || 'Hospital').split(' ')[0]}</span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

const leafletUserIcon = L.divIcon({
  className: 'custom-leaflet-user-marker',
  html: `
    <div style="position:relative; width:24px; height:24px; transform:translate(-50%,-50%)">
      <div style="
        width:24px; height:24px; background:#10b981;
        border:3px solid white; border-radius:50%;
        box-shadow:0 0 0 6px rgba(16,185,129,0.25), 0 4px 12px rgba(0,0,0,0.25);
      "></div>
      <div style="
        position:absolute; inset:-8px;
        border-radius:50%; border:2px solid rgba(16,185,129,0.4);
        animation: pulse-ring 1.8s ease-out infinite;
      "></div>
    </div>
    <style>
      @keyframes pulse-ring {
        0% { transform: scale(0.8); opacity:1; }
        100% { transform: scale(1.6); opacity:0; }
      }
    </style>
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
          map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 14 });
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

// ─── Skeleton Loading Card ───────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{
      borderRadius: 20, padding: 16,
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .skel {
          background: linear-gradient(90deg, var(--bg-primary) 25%, var(--bg-secondary) 50%, var(--bg-primary) 75%);
          background-size: 800px 100%;
          animation: shimmer 1.4s infinite linear;
          border-radius: 8px;
        }
      `}</style>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <div className="skel" style={{ flex: 1, height: 14, borderRadius: 8 }} />
        <div className="skel" style={{ width: 42, height: 42, borderRadius: 13, flexShrink: 0 }} />
      </div>
      <div className="skel" style={{ height: 10, width: '70%', marginBottom: 8 }} />
      <div className="skel" style={{ height: 10, width: '50%', marginBottom: 14 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {[0,1,2].map(i => <div key={i} className="skel" style={{ height: 36, borderRadius: 8 }} />)}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <div className="skel" style={{ flex: 1, height: 32, borderRadius: 10 }} />
        <div className="skel" style={{ flex: 1, height: 32, borderRadius: 10 }} />
      </div>
    </div>
  );
}

// ─── Mobile Bottom Sheet ──────────────────────────────────────────────────────
function MobileBottomSheet({ hospital, userLocation, onClose, onNavigate: navFn }) {
  const navigate = useNavigate();
  if (!hospital) return null;

  const handleDirClick = () => {
    if (userLocation && hospital.lat && hospital.lng) {
      window.open(`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation.lat},${userLocation.lng};${hospital.lat},${hospital.lng}`, '_blank');
    } else {
      window.open(hospital.mapsUrl || `https://www.openstreetmap.org/?mlat=${hospital.lat}&mlon=${hospital.lng}#map=16/${hospital.lat}/${hospital.lng}`, '_blank');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="sheet-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
          zIndex: 2000, backdropFilter: 'blur(2px)',
        }}
      />
      <motion.div
        key="sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'var(--bg-card)', zIndex: 2001,
          borderRadius: '24px 24px 0 0',
          padding: '0 20px 32px',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
          maxHeight: '80vh', overflowY: 'auto',
        }}
      >
        {/* Handle bar */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: 'var(--border-hover)' }} />
        </div>

        {/* Hospital name & emergency badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ flex: 1, paddingRight: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {hospital.name}
              </h2>
              {hospital.emergency && (
                <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 20, background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.25)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>24/7 ER</span>
              )}
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={11} color="var(--primary)" />
              {hospital.address || `${hospital.city}, ${hospital.state}`}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, padding: 8, cursor: 'pointer', flexShrink: 0 }}>
            <X size={16} color="var(--text-muted)" />
          </button>
        </div>

        {/* Rating + distance row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, padding: '10px 14px', borderRadius: 14, background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Stars rating={hospital.rating || 4.5} size={14} />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b' }}>{hospital.rating || 4.5}</span>
            {hospital.reviewCount && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>({hospital.reviewCount} reviews)</span>}
          </div>
          {hospital.distance > 0 && (
            <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'var(--primary-light)', color: 'var(--primary)', marginLeft: 'auto' }}>
              {hospital.distance.toFixed(1)} km away
            </span>
          )}
        </div>

        {/* Beds grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[
            { label: 'General Beds', value: hospital.beds?.general ?? 15, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
            { label: 'ICU Beds', value: hospital.beds?.icu ?? 4, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
            { label: 'Emergency', value: hospital.beds?.emergency ?? 3, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} style={{ textAlign: 'center', padding: '10px 8px', borderRadius: 14, background: bg, border: `1px solid ${color}22` }}>
              <p style={{ fontSize: 22, fontWeight: 900, color, margin: 0, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: 9, color: 'var(--text-muted)', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 16, fontStyle: 'italic' }}>
          ⓘ Simulated availability — hackathon demo
        </p>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleDirClick}
            style={{
              flex: 1, padding: '12px', borderRadius: 14, border: '1.5px solid var(--border)',
              background: 'var(--bg-primary)', color: 'var(--text-primary)',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <Navigation size={15} /> Directions
          </button>
          <button
            onClick={() => { navigate('/hospitals/' + hospital.id); onClose(); }}
            style={{
              flex: 1, padding: '12px', borderRadius: 14, border: 'none',
              background: 'linear-gradient(135deg, var(--primary), #0040cc)',
              color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              boxShadow: '0 4px 14px rgba(14,100,255,0.35)',
            }}
          >
            <ExternalLink size={15} /> View Details
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Score Star Row ───────────────────────────────────────────────────────────
function Stars({ rating = 4.5, size = 12 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          style={{
            fill: i < full ? '#f59e0b' : i === full && half ? '#f59e0b' : 'none',
            color: i < full || (i === full && half) ? '#f59e0b' : '#d1d5db',
            opacity: i < full || (i === full && half) ? 1 : 0.4,
          }}
        />
      ))}
    </span>
  );
}

// ─── Premium Hospital Card ────────────────────────────────────────────────────
function HospitalCard({ hospital, userLocation, selected, onSelect, onFocusMap }) {
  const navigate = useNavigate();

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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => { onSelect(hospital); onFocusMap(hospital); }}
      style={{
        background: selected
          ? 'linear-gradient(135deg, rgba(14,100,255,0.08), rgba(11,188,184,0.06))'
          : 'var(--bg-card)',
        borderRadius: 20,
        border: selected ? '1.5px solid rgba(14,100,255,0.4)' : '1px solid var(--border)',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: selected
          ? '0 8px 32px rgba(14,100,255,0.18), 0 2px 8px rgba(0,0,0,0.06)'
          : '0 2px 12px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.03)',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{
        y: -3,
        boxShadow: '0 12px 40px rgba(14,100,255,0.15), 0 4px 16px rgba(0,0,0,0.08)',
      }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Selected accent line */}
      {selected && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
          background: 'linear-gradient(180deg, #0e64ff, #0bbcb8)',
          borderRadius: '20px 0 0 20px',
        }} />
      )}

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, paddingLeft: selected ? 8 : 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name & badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
            <h3 style={{
              fontSize: 14, fontWeight: 800, color: 'var(--text-primary)',
              fontFamily: 'Outfit, sans-serif', lineHeight: 1.2, margin: 0,
            }}>
              {hospital.name}
            </h3>
            {hospital.emergency && (
              <span style={{
                fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 20,
                background: 'rgba(220,38,38,0.1)', color: '#dc2626',
                border: '1px solid rgba(220,38,38,0.25)', letterSpacing: '0.04em',
                flexShrink: 0, textTransform: 'uppercase',
              }}>24/7 ER</span>
            )}
            {hospital.isOsmData && (
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 20,
                background: 'rgba(16,185,129,0.1)', color: '#059669',
                border: '1px solid rgba(16,185,129,0.2)', flexShrink: 0,
              }}>
                OSM
              </span>
            )}
          </div>

          {/* Address */}
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 6px', display: 'flex', alignItems: 'flex-start', gap: 3, lineHeight: 1.4 }}>
            <MapPin size={10} style={{ marginTop: 2, flexShrink: 0, color: 'var(--primary)' }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
              {hospital.address || `${hospital.city}, ${hospital.state}`}
            </span>
          </p>

          {/* Stars + Distance */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Stars rating={hospital.rating || 4.5} size={11} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>{hospital.rating || 4.5}</span>
              {hospital.reviewCount && (
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>({hospital.reviewCount})</span>
              )}
            </div>
            {hospital.distance > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                background: 'var(--primary-light)', color: 'var(--primary)',
              }}>
                {hospital.distance.toFixed(1)} km
              </span>
            )}
          </div>
        </div>

        {/* Hospital icon */}
        <div style={{
          width: 42, height: 42, borderRadius: 13, flexShrink: 0,
          background: hospital.emergency
            ? 'linear-gradient(135deg, rgba(220,38,38,0.12), rgba(220,38,38,0.06))'
            : 'linear-gradient(135deg, rgba(14,100,255,0.12), rgba(11,188,184,0.06))',
          border: hospital.emergency ? '1px solid rgba(220,38,38,0.2)' : '1px solid rgba(14,100,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {hospital.emergency
            ? <Activity size={18} color="#dc2626" />
            : <Building2 size={18} color="var(--primary)" />}
        </div>
      </div>

      {/* Beds mini grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 10,
        padding: '10px 12px', borderRadius: 12,
        background: 'var(--bg-primary)', border: '1px solid var(--border)',
      }}>
        {[
          { label: 'General', value: hospital.beds?.general ?? 15, color: '#3b82f6' },
          { label: 'ICU', value: hospital.beds?.icu ?? 4, color: '#ef4444' },
          { label: 'Emergency', value: hospital.beds?.emergency ?? 3, color: '#f59e0b' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 800, color, margin: 0, fontFamily: 'Outfit, sans-serif' }}>{value}</p>
            <p style={{ fontSize: 9, color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Simulated disclaimer */}
      <p style={{ fontSize: 9, color: 'var(--text-muted)', margin: '6px 0 10px', textAlign: 'center', fontStyle: 'italic' }}>
        ⓘ Simulated availability — hackathon demo
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleNavigate}
          style={{
            flex: 1, padding: '8px 0', borderRadius: 10,
            border: '1.5px solid var(--border)', background: 'var(--bg-primary)',
            color: 'var(--text-primary)', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
        >
          <Navigation size={13} /> Directions
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); navigate('/hospitals/' + hospital.id); }}
          style={{
            flex: 1, padding: '8px 0', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg, var(--primary), #0040cc)',
            color: 'white', fontSize: 12, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            boxShadow: '0 2px 8px rgba(14,100,255,0.3)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(14,100,255,0.5)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(14,100,255,0.3)'}
        >
          <ExternalLink size={13} /> View Details
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function HospitalFinder() {
  const navigate = useNavigate();
  const { location } = useApp();

  // ── State ─────────────────────────────────────────────────────────────────
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

  // ── Sync with global location ─────────────────────────────────────────────
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

  // ── OSM Discovery (unchanged logic) ──────────────────────────────────────
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

  // ── GPS Detection (unchanged logic) ──────────────────────────────────────
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

  // ── Data Pipeline (unchanged logic) ──────────────────────────────────────
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

  // ── UI Helpers ────────────────────────────────────────────────────────────
  const locationLabel = locationStatus === 'found'
    ? (location?.formattedLocation || `${selectedCity}, ${selectedState}`)
    : selectedCity
      ? `${selectedCity}, ${selectedState}`
      : selectedState || 'Pan India';

  const statusColor = discoveryStatus === 'osm_success' ? '#10b981' : discoveryStatus === 'fallback_active' ? '#3b82f6' : '#f59e0b';
  const statusLabel = discoveryStatus === 'osm_success' ? 'OpenStreetMap Live' : discoveryStatus === 'fallback_active' ? 'Demo Dataset' : 'Searching…';

  // ── Inline styles ────────────────────────────────────────────────────────
  const glassPanel = {
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(20px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
    border: '1px solid var(--glass-border)',
    borderRadius: 20,
    boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
  };

  const selectStyle = {
    background: 'var(--bg-primary)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '8px 12px',
    fontSize: 12,
    color: 'var(--text-primary)',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
    width: '100%',
    appearance: 'none',
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: 'calc(100vh - 60px)',
      background: 'var(--bg-primary)',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
    }}>

      {/* ── TOP HEADER BAR ── */}
      <div style={{
        ...glassPanel,
        borderRadius: 0,
        borderLeft: 'none', borderRight: 'none', borderTop: 'none',
        padding: '12px 20px',
        display: 'flex', flexDirection: 'column', gap: 10,
        flexShrink: 0,
        zIndex: 100,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      }}>
        {/* Row 1: Title + location + status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--primary), #0040cc)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(14,100,255,0.35)',
              flexShrink: 0,
            }}>
              <Building2 size={17} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: 17, fontWeight: 800, margin: 0, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                Hospital Finder
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <MapPin size={11} color="var(--primary)" />
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>{locationLabel}</span>
                {locationStatus === 'found' && (
                  <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 20, background: 'rgba(16,185,129,0.12)', color: '#059669', border: '1px solid rgba(16,185,129,0.25)' }}>
                    GPS
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Data source badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, background: `${statusColor}12`, border: `1px solid ${statusColor}30` }}>
              {isSearchingOsm
                ? <RefreshCw size={11} color={statusColor} style={{ animation: 'spin 1s linear infinite' }} />
                : <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor, display: 'inline-block', flexShrink: 0 }} />}
              <span style={{ fontSize: 11, fontWeight: 700, color: statusColor }}>{statusLabel}</span>
            </div>

            {/* Result count */}
            <div style={{ padding: '5px 12px', borderRadius: 20, background: 'var(--primary-light)', border: '1px solid rgba(14,100,255,0.15)' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)' }}>{filteredHospitals.length} hospitals</span>
            </div>

            {/* Mobile toggle */}
            <div style={{ display: 'flex', gap: 4 }} className="mobile-view-toggle">
              <style>{`.mobile-view-toggle { display: none; } @media (max-width: 768px) { .mobile-view-toggle { display: flex; } }`}</style>
              <button
                onClick={() => setMobileView('map')}
                style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: mobileView === 'map' ? 'var(--primary)' : 'var(--bg-primary)', color: mobileView === 'map' ? 'white' : 'var(--text-muted)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
              >Map</button>
              <button
                onClick={() => setMobileView('list')}
                style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: mobileView === 'list' ? 'var(--primary)' : 'var(--bg-primary)', color: mobileView === 'list' ? 'white' : 'var(--text-muted)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
              >List</button>
            </div>
          </div>
        </div>

        {/* Row 2: Search + controls */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search bar */}
          <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search hospital name, city, area…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                background: 'var(--bg-primary)', border: '1.5px solid var(--border)',
                borderRadius: 10, fontSize: 12, color: 'var(--text-primary)', outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'Inter, sans-serif',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* State select */}
          <div style={{ position: 'relative', minWidth: 140 }}>
            <select value={selectedState} onChange={handleStateChange} style={selectStyle}>
              <option value="">All States</option>
              {INDIA_STATES?.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
          </div>

          {/* City select */}
          <div style={{ position: 'relative', minWidth: 130 }}>
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedState} style={{ ...selectStyle, opacity: selectedState ? 1 : 0.5 }}>
              <option value="">All Cities</option>
              {selectedState && CITIES_BY_STATE?.[selectedState]?.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
          </div>

          {/* GPS button */}
          <button
            onClick={() => handleDetectLocation(true)}
            disabled={locationStatus === 'detecting'}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              borderRadius: 10, border: 'none', cursor: locationStatus === 'detecting' ? 'not-allowed' : 'pointer',
              background: locationStatus === 'found' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, var(--primary), #0040cc)',
              color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0,
              boxShadow: '0 2px 10px rgba(14,100,255,0.3)',
              transition: 'all 0.2s',
            }}
          >
            <Locate size={14} style={{ animation: locationStatus === 'detecting' ? 'spin 1s linear infinite' : 'none' }} />
            {locationStatus === 'detecting' ? 'Detecting…' : locationStatus === 'found' ? 'Located' : 'Use My Location'}
          </button>

          {/* More filters toggle */}
          <button
            onClick={() => setFiltersOpen(p => !p)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px',
              borderRadius: 10, border: '1.5px solid var(--border)', background: filtersOpen ? 'var(--primary-light)' : 'var(--bg-primary)',
              color: filtersOpen ? 'var(--primary)' : 'var(--text-secondary)', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <SlidersHorizontal size={14} />
            Filters
            {filtersOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>

          {/* Sort select */}
          <div style={{ position: 'relative', minWidth: 140 }}>
            <ArrowUpDown size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ ...selectStyle, paddingLeft: 28 }}>
              <option value="distance">Sort: Distance</option>
              <option value="rating">Sort: Rating</option>
              <option value="beds">Sort: Beds</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                {/* Hospital Type */}
                <div style={{ position: 'relative', minWidth: 160 }}>
                  <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={selectStyle}>
                    <option value="">All Hospital Types</option>
                    {HOSPITAL_TYPES?.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                </div>
                {/* Specialist */}
                <div style={{ position: 'relative', minWidth: 160 }}>
                  <select value={selectedSpecialist} onChange={(e) => setSelectedSpecialist(e.target.value)} style={selectStyle}>
                    <option value="">All Specialists</option>
                    {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                </div>
                {/* Distance */}
                <div style={{ position: 'relative', minWidth: 140 }}>
                  <select value={distanceMax} onChange={(e) => setDistanceMax(e.target.value)} style={selectStyle}>
                    <option value="">Any Distance</option>
                    <option value="5">Within 5 km</option>
                    <option value="10">Within 10 km</option>
                    <option value="20">Within 20 km</option>
                    <option value="50">Within 50 km</option>
                  </select>
                  <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }} />
                </div>
                {/* Emergency only */}
                <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', padding: '8px 12px', borderRadius: 10, border: `1.5px solid ${emergencyOnly ? '#dc2626' : 'var(--border)'}`, background: emergencyOnly ? 'rgba(220,38,38,0.08)' : 'var(--bg-primary)', userSelect: 'none' }}>
                  <input type="checkbox" checked={emergencyOnly} onChange={(e) => setEmergencyOnly(e.target.checked)} style={{ width: 14, height: 14 }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: emergencyOnly ? '#dc2626' : 'var(--text-primary)' }}>Emergency Only</span>
                  <Shield size={13} color={emergencyOnly ? '#dc2626' : 'var(--text-muted)'} />
                </label>
                {/* Reset */}
                <button onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  <X size={13} /> Reset
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          .hospital-card-list::-webkit-scrollbar { width: 4px; }
          .hospital-card-list::-webkit-scrollbar-thumb { background: var(--border-hover); border-radius: 99px; }

          /* Leaflet popup polish */
          .leaflet-popup-content-wrapper {
            border-radius: 16px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08) !important;
            border: 1px solid rgba(14,100,255,0.12) !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
          .leaflet-popup-content { margin: 0 !important; }
          .leaflet-popup-tip-container { margin-top: -1px !important; }
          .leaflet-popup-tip { box-shadow: none !important; }

          @media (max-width: 768px) {
            .finder-main-row { flex-direction: column !important; }
            .finder-map-area { height: 55vh !important; display: ${mobileView === 'map' ? 'flex' : 'none'} !important; }
            .finder-card-panel { width: 100% !important; height: 45vh !important; display: ${mobileView === 'list' ? 'flex' : 'none'} !important; }
            /* On mobile, hide the right panel — bottom sheet handles selection */
            .mobile-sheet-only { display: none !important; }
          }
          @media (min-width: 769px) {
            .mobile-sheet-blocker { display: none !important; }
          }
        `}</style>
      </div>

      {/* ── MAIN BODY: MAP + CARDS ── */}
      <div
        className="finder-main-row"
        style={{ flex: 1, display: 'flex', overflow: 'hidden', gap: 0 }}
      >

        {/* ── MAP AREA ── */}
        <div
          className="finder-map-area"
          style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        >
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={selectedCity ? 12 : selectedState ? 8 : 6}
            style={{ width: '100%', height: '100%', zIndex: 1 }}
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

            {/* User location marker */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={leafletUserIcon}>
                <Popup>
                  <div style={{ padding: 4, fontSize: 12, fontWeight: 700, color: '#059669', fontFamily: 'Inter, sans-serif' }}>
                    📍 You are here
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Hospital markers */}
            {visibleHospitals.map(h => (
              <Marker
                key={h.id}
                position={[Number(h.lat), Number(h.lng)]}
                icon={createLeafletIcon(
                  h.emergency ? '#dc2626' : '#0e64ff',
                  h.name,
                  selectedHospital?.id === h.id
                )}
                eventHandlers={{ click: () => { setSelectedHospital(h); setFocusHospital(null); setMobileView('list'); } }}
              >
                <Popup>
                  <div style={{ padding: '4px 2px', minWidth: 200, fontFamily: 'Inter, sans-serif' }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 3px' }}>{h.name}</p>
                    <p style={{ fontSize: 11, color: '#475569', margin: '0 0 6px' }}>{h.address || `${h.city}, ${h.state}`}</p>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: 11 }}>★ {h.rating || 4.5}</span>
                      {h.distance > 0 && <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>{h.distance.toFixed(1)} km</span>}
                      {h.emergency && <span style={{ fontSize: 9, background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '1px 5px', borderRadius: 10, fontWeight: 800 }}>24/7 ER</span>}
                    </div>
                    <div style={{ fontSize: 10, color: '#64748b', background: '#f8fafc', padding: '5px 8px', borderRadius: 8, marginBottom: 8 }}>
                      🛏 General: {h.beds?.general || 15} · ICU: {h.beds?.icu || 4}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        style={{ flex: 1, background: '#0e64ff', color: 'white', border: 'none', borderRadius: 7, padding: '6px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => navigate('/hospitals/' + h.id)}
                      >Details</button>
                      <button
                        style={{ flex: 1, background: '#f1f5f9', color: '#0f172a', border: 'none', borderRadius: 7, padding: '6px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => window.open(`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation ? userLocation.lat + ',' + userLocation.lng : ''};${h.lat},${h.lng}`, '_blank')}
                      >Navigate</button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map overlay: OSM badge (top-left) */}
          <div style={{
            position: 'absolute', top: 12, left: 12, zIndex: 500,
            ...glassPanel, padding: '6px 12px', borderRadius: 20,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', animation: 'pulse 1.8s ease infinite', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>OpenStreetMap</span>
          </div>

          {/* Map overlay: center on user (bottom-right) */}
          {userLocation && (
            <button
              onClick={() => setFocusHospital({ lat: userLocation.lat, lng: userLocation.lng })}
              style={{
                position: 'absolute', bottom: 20, right: 16, zIndex: 500,
                ...glassPanel, border: 'none', padding: '10px', borderRadius: 14,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                color: 'var(--primary)', fontSize: 12, fontWeight: 700,
              }}
            >
              <Locate size={16} color="var(--primary)" /> My Location
            </button>
          )}

          {/* Loading overlay */}
          {isSearchingOsm && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              zIndex: 600, ...glassPanel, padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <RefreshCw size={16} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Searching OpenStreetMap…</span>
            </div>
          )}

          <style>{`
            @keyframes pulse { 0%, 100% { opacity:1; } 50% { opacity:0.4; } }
            .leaflet-control-zoom { margin: 12px !important; border-radius: 12px !important; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.12) !important; }
            .leaflet-control-zoom a { border-radius: 0 !important; font-size: 16px !important; line-height: 26px !important; }
          `}</style>
        </div>

        {/* ── RIGHT: HOSPITAL CARD PANEL ── */}
        <div
          className="finder-card-panel"
          style={{
            width: 360, flexShrink: 0,
            background: 'var(--bg-primary)',
            borderLeft: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Panel header */}
          <div style={{
            padding: '14px 16px 12px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-card)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, margin: 0, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                Nearby Hospitals
              </h2>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>
                {visibleHospitals.length}/{filteredHospitals.length}
              </span>
            </div>

            {/* Location bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 10, background: 'var(--primary-light)', border: '1px solid rgba(14,100,255,0.12)' }}>
              <MapPin size={12} color="var(--primary)" />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', flex: 1 }}>{locationLabel}</span>
              {locationStatus === 'found' && (
                <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 10, background: 'rgba(16,185,129,0.15)', color: '#059669', border: '1px solid rgba(16,185,129,0.3)' }}>
                  GPS ✓
                </span>
              )}
            </div>
          </div>

          {/* Card list */}
          <div
            className="hospital-card-list"
            style={{ flex: 1, overflowY: 'auto', padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {/* Skeleton loading state */}
            {isSearchingOsm && visibleHospitals.length === 0 && (
              [0, 1, 2, 3].map(i => <SkeletonCard key={i} />)
            )}

            <AnimatePresence>
              {visibleHospitals.map(hospital => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  userLocation={userLocation}
                  selected={selectedHospital?.id === hospital.id}
                  onSelect={(h) => { setSelectedHospital(h); }}
                  onFocusMap={(h) => setFocusHospital(h)}
                />
              ))}
            </AnimatePresence>

            {/* Empty state */}
            {filteredHospitals.length === 0 && !isSearchingOsm && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <Building2 size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>No hospitals found</p>
                <p style={{ fontSize: 12, marginBottom: 16 }}>Try adjusting your filters or changing location</p>
                <button onClick={resetFilters} style={{ padding: '8px 18px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <X size={13} /> Clear Filters
                </button>
              </div>
            )}

            {/* Load more */}
            {filteredHospitals.length > visibleHospitals.length && (
              <button
                onClick={() => setDisplayCount(p => p + 12)}
                style={{
                  width: '100%', padding: '10px', borderRadius: 12,
                  border: '1.5px dashed var(--border)', background: 'transparent',
                  color: 'var(--primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <RefreshCw size={13} />
                Load {Math.min(12, filteredHospitals.length - visibleHospitals.length)} more
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE BOTTOM SHEET (shown when a hospital is selected on mobile) ── */}
      <div className="mobile-sheet-blocker">
        {selectedHospital && (
          <MobileBottomSheet
            hospital={selectedHospital}
            userLocation={userLocation}
            onClose={() => setSelectedHospital(null)}
          />
        )}
      </div>
    </div>
  );
}
