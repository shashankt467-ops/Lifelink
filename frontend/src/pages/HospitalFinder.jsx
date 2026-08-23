import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Clock, Phone, Navigation, Filter,
  Activity, Locate, X, AlertTriangle, Building2, RefreshCw,
  Globe, Shield, SlidersHorizontal, ExternalLink,
  Compass, Wifi, WifiOff, Info, CheckCircle2, Car, Accessibility,
  Droplets, Ambulance as AmbulanceIcon
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { INDIA_STATES, CITIES_BY_STATE, CITY_COORDS } from '../data/mockData';
import { geocodeCity, queryOverpassHospitals, calcDistanceKm } from '../services/osmDiscovery';
import { dbStore } from '../services/firestore/db';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';

// ─── Constants ────────────────────────────────────────────────────────────────
const HOSPITAL_TYPES = ['Hospital', 'Specialty Clinic', 'Nursing Home', 'Medical College'];
const SPECIALIZATIONS = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology',
  'Dermatology', 'Gastroenterology', 'Psychiatry', 'Urology', 'General Surgery',
  'Emergency Medicine', 'General Emergency Care',
];

// ─── Verified Field Display Helper ────────────────────────────────────────────
const display = (val, fallback = 'Not available') => {
  if (val === null || val === undefined || val === '' || val === 'Not available') return fallback;
  return val;
};

// ─── 3D Spatial Hospital Marker ───────────────────────────────────────────────
const createLeafletIcon = (color = '#0e64ff', label = '', selected = false, isEmergency = false) =>
  L.divIcon({
    className: '',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -100%) ${selected ? 'scale(1.2) translateY(-8px)' : 'scale(1)'};
        transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        cursor: pointer;
        font-family: Outfit,Inter,sans-serif;
      ">
        <div style="
          background: ${selected
            ? 'linear-gradient(135deg,#0e64ff,#7c3aed)'
            : isEmergency
              ? 'linear-gradient(135deg,#dc2626,#991b1b)'
              : 'linear-gradient(135deg,#1e293b,#0f172a)'};
          color: white;
          padding: 5px 11px 5px 7px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
          box-shadow: ${selected
            ? '0 12px 28px rgba(14,100,255,0.55),0 0 0 2.5px rgba(255,255,255,0.9)'
            : isEmergency
              ? '0 8px 20px rgba(220,38,38,0.45),0 0 0 1.5px rgba(255,255,255,0.2)'
              : '0 8px 20px rgba(0,0,0,0.4),0 0 0 1.5px rgba(255,255,255,0.15)'};
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 5px;
          max-width: 160px;
          overflow: hidden;
        ">
          <span style="font-size:13px;flex-shrink:0">${isEmergency ? '🚨' : '🏥'}</span>
          <span style="overflow:hidden;text-overflow:ellipsis">${(label || 'Hospital').substring(0, 18)}</span>
        </div>
        <div style="width:2px;height:10px;background:${isEmergency ? '#dc2626' : '#0e64ff'};box-shadow:0 0 6px ${isEmergency ? '#dc2626' : '#0e64ff'}"></div>
        <div style="width:16px;height:5px;background:rgba(0,0,0,0.3);border-radius:50%;filter:blur(2px)"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

const userMarkerIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:32px;height:32px;transform:translate(-50%,-50%)">
      <div style="position:absolute;inset:7px;background:linear-gradient(135deg,#10b981,#059669);border:2.5px solid white;border-radius:50%;box-shadow:0 0 20px #10b981,0 4px 10px rgba(0,0,0,0.3);z-index:2"></div>
      <div style="position:absolute;inset:-4px;border-radius:50%;border:2px solid rgba(16,185,129,0.6);animation:usr-ping 2s ease-out infinite"></div>
      <div style="position:absolute;inset:-14px;border-radius:50%;border:1.5px solid rgba(16,185,129,0.3);animation:usr-ping 2s ease-out 0.6s infinite"></div>
      <style>@keyframes usr-ping{0%{transform:scale(0.5);opacity:1}100%{transform:scale(1.6);opacity:0}}</style>
    </div>
  `,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

// ─── Map Controller: centers and fits bounds ──────────────────────────────────
function MapController({ center, hospitals, userLocation, focusHospital }) {
  const map = useMap();
  const lastFocus = useRef(null);

  useEffect(() => {
    if (focusHospital && (focusHospital.lat || focusHospital.latitude)) {
      const lat = Number(focusHospital.lat || focusHospital.latitude);
      const lng = Number(focusHospital.lng || focusHospital.longitude);
      if (!isNaN(lat) && !isNaN(lng) && lastFocus.current !== focusHospital.id) {
        lastFocus.current = focusHospital.id;
        map.setView([lat, lng], 15, { animate: true });
      }
      return;
    }
    if (hospitals && hospitals.length > 0) {
      const points = hospitals
        .filter(h => (h.lat || h.latitude) && (h.lng || h.longitude))
        .map(h => [Number(h.lat || h.latitude), Number(h.lng || h.longitude)]);
      if (userLocation) points.push([userLocation.lat, userLocation.lng]);
      if (points.length === 1) {
        map.setView(points[0], 14);
      } else if (points.length > 1) {
        try { map.fitBounds(L.latLngBounds(points), { padding: [60, 60], maxZoom: 14 }); } catch (_) {}
      }
    } else if (center) {
      map.setView([center.lat, center.lng], 11);
    }
  }, [center, hospitals, userLocation, focusHospital, map]);

  return null;
}

// ─── Map click to dismiss inspector ──────────────────────────────────────────
function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: onMapClick });
  return null;
}

// ─── Spatial Hospital Card ────────────────────────────────────────────────────
function HospitalCard({ hospital, selected, onSelect, onFocus, userLocation }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const lat = hospital.lat || hospital.latitude;
  const lng = hospital.lng || hospital.longitude;
  const dist = hospital.distance;
  const isEmergency = hospital.emergency === true;

  const handleDirections = (e) => {
    e.stopPropagation();
    if (userLocation && lat && lng) {
      window.open(
        `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation.lat},${userLocation.lng};${lat},${lng}`,
        '_blank'
      );
    } else if (lat && lng) {
      window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`, '_blank');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { onSelect(hospital); onFocus(hospital); }}
      style={{
        background: selected
          ? 'linear-gradient(135deg,rgba(14,100,255,0.18),rgba(124,58,237,0.12))'
          : hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
        borderRadius: 18,
        border: selected
          ? '1.5px solid rgba(14,100,255,0.55)'
          : hovered ? '1px solid rgba(14,100,255,0.3)' : '1px solid rgba(255,255,255,0.08)',
        padding: '14px 16px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: selected
          ? '0 16px 36px rgba(14,100,255,0.22),inset 0 1px 1px rgba(255,255,255,0.25)'
          : hovered ? '0 8px 24px rgba(0,0,0,0.14)' : 'none',
        transform: selected ? 'translateY(-2px)' : 'none',
        transition: 'all 0.25s ease',
      }}
    >
      {selected && (
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
          background: 'linear-gradient(180deg,#0e64ff,#7c3aed)',
          boxShadow: '0 0 10px #0e64ff',
        }} />
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap', marginBottom: 3 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif', margin: 0, lineHeight: 1.2 }}>
              {hospital.name}
            </h3>
            {isEmergency && (
              <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 20, background: 'rgba(220,38,38,0.12)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.25)', letterSpacing: '0.04em', flexShrink: 0 }}>
                24/7 ER
              </span>
            )}
            {hospital.open24x7 && !isEmergency && (
              <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 20, background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)', flexShrink: 0 }}>
                24/7
              </span>
            )}
            {hospital.isOsmData && (
              <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', color: '#059669', border: '1px solid rgba(16,185,129,0.2)', flexShrink: 0 }}>
                OSM Verified
              </span>
            )}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: 3, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            <MapPin size={10} color="var(--primary)" style={{ flexShrink: 0 }} />
            {hospital.address && hospital.address !== 'Address not provided in OpenStreetMap'
              ? hospital.address
              : `${hospital.city || 'Unknown'}, ${hospital.state || 'India'}`}
          </p>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: isEmergency ? 'rgba(220,38,38,0.12)' : 'rgba(14,100,255,0.1)',
          border: `1px solid ${isEmergency ? 'rgba(220,38,38,0.25)' : 'rgba(14,100,255,0.2)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isEmergency ? <AlertTriangle size={18} color="#dc2626" /> : <Building2 size={18} color="var(--primary)" />}
        </div>
      </div>

      {/* Type + Distance */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: 'rgba(14,100,255,0.1)', color: 'var(--primary)', border: '1px solid rgba(14,100,255,0.15)' }}>
          {hospital.type || 'Healthcare Facility'}
        </span>
        {dist > 0 && (
          <span style={{ fontSize: 10, fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Compass size={10} /> {dist.toFixed(1)} km away
          </span>
        )}
        {hospital.phone && hospital.phone !== 'Not available' && (
          <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Phone size={10} /> Listed
          </span>
        )}
      </div>

      {/* Verified Info Strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 6, padding: '8px 10px', borderRadius: 12,
        background: 'rgba(10,16,34,0.6)', border: '1px solid rgba(255,255,255,0.05)',
        marginBottom: 10,
      }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Hours: </span>
          {display(hospital.openingHours)}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Type: </span>
          {display(hospital.type)}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Beds: </span>
          {hospital.beds?.total && hospital.beds.total !== 'Availability not provided'
            ? `${hospital.beds.total} total`
            : 'Availability not provided'}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Emergency: </span>
          {isEmergency ? '✓ Yes' : hospital.emergency === false ? 'No' : 'Not available'}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 7 }}>
        <button
          onClick={handleDirections}
          style={{
            flex: 1, padding: '8px 0', borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)',
            color: 'var(--text-primary)', fontSize: 11, fontWeight: 800,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
        >
          <Navigation size={12} /> OSRM Route
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); navigate('/hospitals/' + hospital.id); }}
          style={{
            flex: 1, padding: '8px 0', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg,var(--primary),#0040cc)',
            color: 'white', fontSize: 11, fontWeight: 800,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            boxShadow: '0 4px 12px rgba(14,100,255,0.3)',
          }}
        >
          <ExternalLink size={12} /> View Details
        </button>
      </div>
    </motion.div>
  );
}

// ─── Inspector Panel (floats over map when hospital selected) ─────────────────
function InspectorPanel({ hospital, userLocation, onClose }) {
  const navigate = useNavigate();
  if (!hospital) return null;

  const lat = hospital.lat || hospital.latitude;
  const lng = hospital.lng || hospital.longitude;
  const isEmergency = hospital.emergency === true;

  const handleDirections = () => {
    if (userLocation && lat && lng) {
      window.open(
        `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation.lat},${userLocation.lng};${lat},${lng}`,
        '_blank'
      );
    } else if (lat && lng) {
      window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.95 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute', bottom: 24, left: 24, zIndex: 1200,
        maxWidth: 440, width: 'calc(100% - 420px)',
        background: 'rgba(8,15,30,0.92)',
        backdropFilter: 'blur(28px) saturate(2)',
        WebkitBackdropFilter: 'blur(28px) saturate(2)',
        borderRadius: 22, border: '1.5px solid rgba(14,100,255,0.35)',
        padding: '18px 20px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.4),0 0 0 1px rgba(255,255,255,0.06)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 3 }}>
            <h2 style={{ fontSize: 17, fontWeight: 900, margin: 0, fontFamily: 'Outfit,sans-serif' }}>{hospital.name}</h2>
            {isEmergency && <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 20, background: 'rgba(220,38,38,0.15)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.3)' }}>24/7 ER</span>}
            {hospital.open24x7 && !isEmergency && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>24/7</span>}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={11} color="var(--primary)" />
            {hospital.address && hospital.address !== 'Address not provided in OpenStreetMap'
              ? hospital.address
              : `${hospital.city || ''}, ${hospital.state || 'India'}`}
          </p>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 6, cursor: 'pointer', flexShrink: 0 }}>
          <X size={15} color="var(--text-muted)" />
        </button>
      </div>

      {/* Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        {[
          { label: 'Distance', val: hospital.distance > 0 ? `${hospital.distance.toFixed(1)} km` : 'Not available' },
          { label: 'Opening Hours', val: display(hospital.openingHours) },
          { label: 'Phone', val: display(hospital.phone) },
          { label: 'Type', val: display(hospital.type) },
          { label: 'Beds Total', val: hospital.beds?.total && hospital.beds.total !== 'Availability not provided' ? hospital.beds.total : 'Availability not provided' },
          { label: 'Wheelchair', val: hospital.wheelchairAccessible === true ? 'Yes' : 'Not available' },
          { label: 'Blood Bank', val: hospital.bloodBankAvailable === true ? 'Yes' : 'Not available' },
          { label: 'Ambulance', val: hospital.ambulanceAvailable === true ? 'Yes' : 'Not available' },
        ].map(({ label, val }) => (
          <div key={label} style={{ padding: '7px 9px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>{label}</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: val === 'Not available' || val === 'Availability not provided' ? 'var(--text-muted)' : 'var(--text-primary)', margin: '2px 0 0', fontStyle: val === 'Not available' || val === 'Availability not provided' ? 'italic' : 'normal' }}>{val}</p>
          </div>
        ))}
      </div>

      {/* Website Row */}
      {hospital.website && hospital.website !== 'Not available' && (
        <div style={{ marginBottom: 12 }}>
          <a href={hospital.website} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#60a5fa', display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
            <Globe size={13} /> {hospital.website.length > 50 ? hospital.website.substring(0, 50) + '…' : hospital.website}
          </a>
        </div>
      )}

      {/* Source Badge */}
      <div style={{ marginBottom: 12, fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
        <CheckCircle2 size={11} color="#10b981" />
        Source: {display(hospital.source, 'OpenStreetMap Overpass API')}
        {hospital.lastVerifiedAt && ` · Verified ${new Date(hospital.lastVerifiedAt).toLocaleDateString()}`}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 9 }}>
        <button onClick={handleDirections} style={{ flex: 1, padding: '10px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Navigation size={14} /> OSRM Route
        </button>
        {hospital.phone && hospital.phone !== 'Not available' && (
          <button onClick={() => window.open(`tel:${hospital.phone}`)} style={{ flex: 1, padding: '10px', borderRadius: 12, border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)', color: '#10b981', fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Phone size={14} /> Call
          </button>
        )}
        <button onClick={() => navigate('/hospitals/' + hospital.id)} style={{ flex: 1, padding: '10px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,var(--primary),#0040cc)', color: 'white', fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 14px rgba(14,100,255,0.3)' }}>
          <ExternalLink size={14} /> Full Profile
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Hospital Finder Component ──────────────────────────────────────────
export default function HospitalFinder() {
  const navigate = useNavigate();
  const { location } = useApp();

  // Location state
  const [userLocation, setUserLocation] = useState(
    location?.lat ? { lat: location.lat, lng: location.lng } : null
  );
  const [locationStatus, setLocationStatus] = useState(
    location?.source === 'gps' ? 'found' : 'idle'
  );

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState(location?.state || 'Maharashtra');
  const [selectedCity, setSelectedCity] = useState(location?.city || 'Pune');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [open24x7Only, setOpen24x7Only] = useState(false);
  const [distanceMax, setDistanceMax] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Hospital discovery state
  const [osmHospitals, setOsmHospitals] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [discoveryError, setDiscoveryError] = useState(null);
  const [discoveryStatus, setDiscoveryStatus] = useState('idle'); // idle | searching | success | error | fallback
  const [lastVerified, setLastVerified] = useState(null);

  // Map state
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [focusHospital, setFocusHospital] = useState(null);
  const [mapCenter, setMapCenter] = useState(
    location?.lat ? { lat: location.lat, lng: location.lng } : { lat: 18.5204, lng: 73.8567 }
  );

  // Sync from app location context
  useEffect(() => {
    if (location) {
      if (location.state) setSelectedState(location.state);
      if (location.city) setSelectedCity(location.city);
      if (location.lat && location.lng) {
        setUserLocation({ lat: location.lat, lng: location.lng });
        setMapCenter({ lat: location.lat, lng: location.lng });
        if (location.source === 'gps') setLocationStatus('found');
      }
    }
  }, [location?.lat, location?.lng, location?.city, location?.state]);

  // Run OSM discovery
  const runDiscovery = useCallback(async (city, state, coords, isRefresh = false) => {
    setIsSearching(true);
    setDiscoveryStatus('searching');
    setDiscoveryError(null);

    try {
      let targetCoords = coords;

      if (!targetCoords && city) {
        try {
          targetCoords = await geocodeCity(city, state || 'Maharashtra');
        } catch (e) {
          setDiscoveryError('Location geocoding failed. Try selecting a different city.');
          setDiscoveryStatus('error');
          setIsSearching(false);
          return;
        }
      }

      if (!targetCoords) {
        targetCoords = CITY_COORDS?.['Pune'] || { lat: 18.5204, lng: 73.8567 };
      }

      setMapCenter(targetCoords);

      const radiusKm = distanceMax ? Number(distanceMax) : 20;
      
      // Clear memory cache on manual refresh
      if (isRefresh) {
        // Force fresh query by using slightly offset coords
        const freshCoords = { lat: targetCoords.lat + 0.0001, lng: targetCoords.lng + 0.0001 };
        const fetched = await queryOverpassHospitals({
          lat: freshCoords.lat,
          lng: freshCoords.lng,
          radiusKm,
          userLocation: userLocation || targetCoords,
        });
        if (fetched && fetched.length > 0) {
          // Recalculate distances with current userLocation
          const withDist = fetched.map(h => ({
            ...h,
            distance: userLocation
              ? calcDistanceKm(userLocation.lat, userLocation.lng, h.lat || h.latitude, h.lng || h.longitude)
              : h.distance || 0,
          }));
          setOsmHospitals(withDist);
          setDiscoveryStatus('success');
          setLastVerified(new Date().toISOString());
          toast.success(`✅ Refreshed — found ${withDist.length} hospitals from OpenStreetMap`);
        } else {
          setOsmHospitals([]);
          setDiscoveryStatus('empty');
        }
        return;
      }

      const fetched = await queryOverpassHospitals({
        lat: targetCoords.lat,
        lng: targetCoords.lng,
        radiusKm,
        userLocation: userLocation || targetCoords,
      });

      if (fetched && fetched.length > 0) {
        const withDist = fetched.map(h => ({
          ...h,
          distance: userLocation
            ? calcDistanceKm(userLocation.lat, userLocation.lng, h.lat || h.latitude, h.lng || h.longitude)
            : h.distance || 0,
        }));
        setOsmHospitals(withDist);
        setDiscoveryStatus('success');
        setLastVerified(new Date().toISOString());
      } else {
        // Show Firestore cached hospitals if Overpass returns nothing
        const cachedHospitals = dbStore.getCollection('hospitals').filter(h => h.isOsmData);
        if (cachedHospitals.length > 0) {
          const withDist = cachedHospitals.map(h => ({
            ...h,
            distance: userLocation
              ? calcDistanceKm(userLocation.lat, userLocation.lng, h.latitude || h.lat, h.longitude || h.lng)
              : h.distance || 0,
          }));
          setOsmHospitals(withDist);
          setDiscoveryStatus('fallback');
        } else {
          setOsmHospitals([]);
          setDiscoveryStatus('empty');
        }
      }
    } catch (err) {
      console.warn('Hospital discovery error:', err);
      // Try Firestore cache on any error
      const cachedHospitals = dbStore.getCollection('hospitals').filter(h => h.isOsmData);
      if (cachedHospitals.length > 0) {
        setOsmHospitals(cachedHospitals);
        setDiscoveryStatus('fallback');
      } else {
        setOsmHospitals([]);
        setDiscoveryStatus('error');
        setDiscoveryError('Hospital discovery is temporarily unavailable. Please try again.');
      }
    } finally {
      setIsSearching(false);
    }
  }, [distanceMax, userLocation]);

  // Trigger discovery on city/state change
  useEffect(() => {
    if (selectedCity) {
      runDiscovery(selectedCity, selectedState, null);
    } else if (userLocation) {
      runDiscovery(null, null, userLocation);
    } else {
      runDiscovery('Pune', 'Maharashtra', null);
    }
  }, [selectedCity, selectedState]);

  // GPS Location Detection
  const detectGPS = useCallback(() => {
    setLocationStatus('detecting');
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setLocationStatus('idle');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setMapCenter(coords);
        setLocationStatus('found');
        toast.success('📍 GPS location detected — searching nearby hospitals');
        runDiscovery(null, null, coords);
      },
      () => {
        setLocationStatus('idle');
        toast.error('GPS permission denied. Select a city manually.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [runDiscovery]);

  // Filtered + Sorted Hospitals
  const filteredHospitals = useMemo(() => {
    const norm = (s) => (s ? String(s).trim().toLowerCase() : '');
    
    return osmHospitals.filter(h => {
      // Text search: name, address, city, specializations
      if (search) {
        const q = norm(search);
        const specs = (h.specializations || []).join(' ').toLowerCase();
        if (
          !norm(h.name).includes(q) &&
          !norm(h.address).includes(q) &&
          !norm(h.city).includes(q) &&
          !norm(h.state).includes(q) &&
          !specs.includes(q)
        ) return false;
      }
      // Hospital type filter
      if (selectedType && norm(h.type) !== norm(selectedType)) return false;
      // Specialization filter
      if (selectedSpecialist) {
        const specs = (h.specializations || []).map(s => norm(s));
        if (!specs.some(s => s.includes(norm(selectedSpecialist)) || norm(selectedSpecialist).includes(s))) return false;
      }
      // Emergency only
      if (emergencyOnly && h.emergency !== true) return false;
      // 24/7 only
      if (open24x7Only && !h.open24x7 && h.emergency !== true) return false;
      // Max distance filter
      if (distanceMax && h.distance > Number(distanceMax)) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'distance') return (a.distance || 999) - (b.distance || 999);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [osmHospitals, search, selectedType, selectedSpecialist, emergencyOnly, open24x7Only, distanceMax, sortBy]);

  const locationLabel = locationStatus === 'found'
    ? (location?.formattedLocation || `${selectedCity}, ${selectedState}`)
    : selectedCity ? `${selectedCity}, ${selectedState}` : (selectedState || 'India');

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity('');
    setSelectedHospital(null);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedHospital(null);
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedType('');
    setSelectedSpecialist('');
    setEmergencyOnly(false);
    setOpen24x7Only(false);
    setDistanceMax('');
    setSortBy('distance');
    setSelectedHospital(null);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
      background: '#060c1a',
      fontFamily: 'Inter,sans-serif',
    }}>

      {/* ── LAYER 1: FULL-SCREEN MAP ─────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={12}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController
            center={mapCenter}
            hospitals={filteredHospitals}
            userLocation={userLocation}
            focusHospital={focusHospital}
          />
          <MapClickHandler onMapClick={() => setSelectedHospital(null)} />

          {/* User location marker */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userMarkerIcon}>
              <Popup>
                <div style={{ padding: 4, fontSize: 13, fontWeight: 800, color: '#059669', fontFamily: 'Outfit,sans-serif' }}>
                  📍 Your Current GPS Location
                </div>
              </Popup>
            </Marker>
          )}

          {/* Hospital markers */}
          {filteredHospitals.map(h => {
            const lat = Number(h.lat || h.latitude);
            const lng = Number(h.lng || h.longitude);
            if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;
            const isSelected = selectedHospital?.id === h.id;
            return (
              <Marker
                key={h.id}
                position={[lat, lng]}
                icon={createLeafletIcon(
                  h.emergency ? '#dc2626' : '#0e64ff',
                  h.name,
                  isSelected,
                  h.emergency === true
                )}
                eventHandlers={{
                  click: () => {
                    setSelectedHospital(h);
                    setFocusHospital(h);
                  }
                }}
              >
                <Popup maxWidth={260}>
                  <div style={{ padding: '6px 4px', fontFamily: 'Inter,sans-serif' }}>
                    <p style={{ fontSize: 14, fontWeight: 900, color: '#0f172a', margin: '0 0 3px', fontFamily: 'Outfit,sans-serif' }}>{h.name}</p>
                    <p style={{ fontSize: 11, color: '#475569', margin: '0 0 4px' }}>
                      {h.address && h.address !== 'Address not provided in OpenStreetMap' ? h.address : `${h.city || ''}, ${h.state || 'India'}`}
                    </p>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
                      {h.distance > 0 && <span style={{ fontSize: 10, color: '#10b981', fontWeight: 800 }}>{h.distance.toFixed(1)} km</span>}
                      {h.emergency && <span style={{ fontSize: 9, background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '1px 6px', borderRadius: 10, fontWeight: 800 }}>24/7 ER</span>}
                      <span style={{ fontSize: 9, background: '#f0fdf4', color: '#16a34a', border: '1px solid #86efac', padding: '1px 5px', borderRadius: 10, fontWeight: 700 }}>OSM Verified</span>
                    </div>
                    {h.phone && h.phone !== 'Not available' && <p style={{ fontSize: 11, color: '#0e64ff', margin: '0 0 4px' }}>📞 {h.phone}</p>}
                    {h.openingHours && h.openingHours !== 'Not available' && <p style={{ fontSize: 11, color: '#475569', margin: '0 0 6px' }}>🕐 {h.openingHours}</p>}
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button
                        style={{ flex: 1, background: '#0e64ff', color: 'white', border: 'none', borderRadius: 8, padding: '7px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                        onClick={() => navigate('/hospitals/' + h.id)}
                      >View Profile</button>
                      <button
                        style={{ flex: 1, background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                        onClick={() => {
                          if (userLocation && lat && lng) {
                            window.open(`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation.lat},${userLocation.lng};${lat},${lng}`, '_blank');
                          } else {
                            window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`, '_blank');
                          }
                        }}
                      >OSRM Route</button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* ── LAYER 2: FLOATING TOP COMMAND BAR ───────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 16, left: 16, right: 16, zIndex: 500,
        display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none',
      }}>
        {/* Row 1: Location pill + Search + GPS + Emergency */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', pointerEvents: 'auto' }}>
          
          {/* Location pill */}
          <div style={{
            background: 'rgba(8,15,30,0.88)', backdropFilter: 'blur(20px) saturate(1.8)',
            border: '1px solid rgba(255,255,255,0.1)', padding: '8px 14px',
            borderRadius: 20, boxShadow: '0 8px 28px rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
          }}>
            <MapPin size={14} color="var(--primary)" />
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif' }}>{locationLabel}</span>
            <button
              onClick={detectGPS}
              style={{
                background: locationStatus === 'found' ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(14,100,255,0.15)',
                color: locationStatus === 'found' ? 'white' : 'var(--primary)',
                border: 'none', borderRadius: 14, padding: '4px 10px',
                fontSize: 11, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <Locate size={11} className={locationStatus === 'detecting' ? 'animate-spin' : ''} />
              {locationStatus === 'detecting' ? 'GPS…' : locationStatus === 'found' ? 'GPS ✓' : 'Locate Me'}
            </button>
          </div>

          {/* Search bar */}
          <div style={{
            flex: 1, minWidth: 240, maxWidth: 500,
            background: 'rgba(8,15,30,0.88)', backdropFilter: 'blur(24px) saturate(2)',
            border: '1.5px solid rgba(14,100,255,0.3)', borderRadius: 22,
            padding: '6px 8px 6px 14px', boxShadow: '0 12px 36px rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <Search size={15} color="var(--primary)" />
            <input
              type="text"
              placeholder="Search by name, city, specialization…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Inter,sans-serif',
              }}
            />
            {isSearching && <RefreshCw size={13} color="var(--primary)" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />}
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                <X size={13} color="var(--text-muted)" />
              </button>
            )}
            <button
              onClick={() => setFiltersOpen(p => !p)}
              style={{
                background: filtersOpen ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                color: filtersOpen ? 'white' : 'var(--text-secondary)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16, padding: '5px 11px', fontSize: 11, fontWeight: 800,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
              }}
            >
              <SlidersHorizontal size={12} />
              Filters {(emergencyOnly || open24x7Only || selectedType || selectedSpecialist || distanceMax) ? '●' : ''}
            </button>
          </div>

          {/* 24/7 Emergency toggle */}
          <button
            onClick={() => { setEmergencyOnly(p => !p); if (!emergencyOnly) toast.error('🚨 Emergency 24/7 Only'); }}
            style={{
              background: emergencyOnly ? 'linear-gradient(135deg,#dc2626,#991b1b)' : 'rgba(220,38,38,0.12)',
              color: emergencyOnly ? 'white' : '#dc2626',
              border: `1.5px solid ${emergencyOnly ? 'rgba(255,255,255,0.3)' : 'rgba(220,38,38,0.3)'}`,
              borderRadius: 18, padding: '8px 14px', fontSize: 12, fontWeight: 900,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: emergencyOnly ? '0 8px 24px rgba(220,38,38,0.4)' : 'none',
              flexShrink: 0,
            }}
          >
            <Activity size={14} /> {emergencyOnly ? 'ER Active' : '24/7 SOS'}
          </button>

          {/* Refresh button */}
          <button
            onClick={() => runDiscovery(selectedCity, selectedState, userLocation, true)}
            disabled={isSearching}
            style={{
              background: 'rgba(16,185,129,0.12)', color: '#10b981',
              border: '1px solid rgba(16,185,129,0.3)', borderRadius: 18,
              padding: '8px 14px', fontSize: 12, fontWeight: 800,
              cursor: isSearching ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
            }}
          >
            <RefreshCw size={13} className={isSearching ? 'animate-spin' : ''} />
            {isSearching ? 'Discovering…' : 'Refresh OSM'}
          </button>
        </div>

        {/* Row 2: Expanded Filters */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              style={{
                pointerEvents: 'auto',
                background: 'rgba(8,15,30,0.92)', backdropFilter: 'blur(24px) saturate(2)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18,
                padding: '12px 16px', boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
                display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
              }}
            >
              <select value={selectedState} onChange={handleStateChange} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '7px 12px', fontSize: 12, color: 'var(--text-primary)', outline: 'none' }}>
                <option value="">All States</option>
                {INDIA_STATES?.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select value={selectedCity} onChange={handleCityChange} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '7px 12px', fontSize: 12, color: 'var(--text-primary)', outline: 'none' }}>
                <option value="">All Cities</option>
                {selectedState && CITIES_BY_STATE?.[selectedState]?.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select value={selectedType} onChange={e => setSelectedType(e.target.value)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '7px 12px', fontSize: 12, color: 'var(--text-primary)', outline: 'none' }}>
                <option value="">All Types</option>
                {HOSPITAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <select value={selectedSpecialist} onChange={e => setSelectedSpecialist(e.target.value)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '7px 12px', fontSize: 12, color: 'var(--text-primary)', outline: 'none' }}>
                <option value="">All Specializations</option>
                {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select value={distanceMax} onChange={e => setDistanceMax(e.target.value)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '7px 12px', fontSize: 12, color: 'var(--text-primary)', outline: 'none' }}>
                <option value="">Any Distance</option>
                <option value="2">Within 2 km</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="20">Within 20 km</option>
                <option value="50">Within 50 km</option>
              </select>

              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '7px 12px', fontSize: 12, color: 'var(--text-primary)', outline: 'none' }}>
                <option value="distance">Sort: Nearest First</option>
                <option value="name">Sort: Name A–Z</option>
              </select>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#f59e0b' }}>
                <input type="checkbox" checked={open24x7Only} onChange={e => setOpen24x7Only(e.target.checked)} />
                24/7 Only
              </label>

              <button onClick={resetFilters} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '7px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <X size={12} /> Reset All
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── LAYER 3: RIGHT PANEL — Hospital Cards ───────────────────────────── */}
      <div style={{
        position: 'absolute', top: 80, right: 16, bottom: 16,
        width: 370, zIndex: 500, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none',
      }}>
        {/* Panel Header */}
        <div style={{
          pointerEvents: 'auto',
          background: 'rgba(8,15,30,0.9)', backdropFilter: 'blur(20px) saturate(1.8)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '10px 14px',
          boxShadow: '0 8px 28px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 size={16} color="var(--primary)" />
            <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>
              {filteredHospitals.length} Hospital{filteredHospitals.length !== 1 ? 's' : ''} Found
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {discoveryStatus === 'success' && (
              <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 12, background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Wifi size={10} /> OSM Live
              </span>
            )}
            {discoveryStatus === 'fallback' && (
              <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 12, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <WifiOff size={10} /> Cached
              </span>
            )}
            {discoveryStatus === 'searching' && (
              <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 12, background: 'rgba(14,100,255,0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <RefreshCw size={10} style={{ animation: 'spin 1s linear infinite' }} /> Discovering…
              </span>
            )}
          </div>
        </div>

        {/* Status / Verify bar */}
        {lastVerified && (
          <div style={{
            pointerEvents: 'auto',
            background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
            borderRadius: 12, padding: '6px 12px', fontSize: 10,
            color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <CheckCircle2 size={11} color="#10b981" />
            Last verified: {new Date(lastVerified).toLocaleTimeString()} · Source: OpenStreetMap Overpass API
          </div>
        )}

        {/* Scrollable Cards */}
        <div
          style={{
            pointerEvents: 'auto', flex: 1, overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: 10,
            paddingRight: 2,
          }}
          className="custom-scrollbar"
        >
          <AnimatePresence>
            {isSearching && osmHospitals.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                  background: 'rgba(14,100,255,0.06)', border: '1px dashed rgba(14,100,255,0.2)',
                  borderRadius: 18, padding: '30px 20px', textAlign: 'center',
                }}
              >
                <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)', margin: '0 auto 12px' }} />
                <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                  Querying OpenStreetMap Overpass API
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
                  Discovering verified hospitals near {locationLabel}…
                </p>
              </motion.div>
            )}

            {!isSearching && discoveryError && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                  background: 'rgba(239,68,68,0.06)', border: '1px dashed rgba(239,68,68,0.25)',
                  borderRadius: 18, padding: '24px 20px', textAlign: 'center',
                }}
              >
                <WifiOff size={32} style={{ color: '#ef4444', margin: '0 auto 12px' }} />
                <p style={{ fontSize: 13, fontWeight: 800, color: '#ef4444', margin: '0 0 8px' }}>
                  Discovery unavailable
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 12px' }}>{discoveryError}</p>
                <button onClick={() => runDiscovery(selectedCity, selectedState, userLocation)} className="btn btn-primary btn-sm">
                  Try Again
                </button>
              </motion.div>
            )}

            {!isSearching && !discoveryError && filteredHospitals.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: 18, padding: '30px 20px', textAlign: 'center',
                }}
              >
                <Building2 size={36} style={{ opacity: 0.25, margin: '0 auto 10px' }} />
                <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                  No hospitals found in this area
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 12px' }}>
                  {search || selectedType || emergencyOnly ? 'Try clearing your filters.' : 'Try a different city or increase your search radius.'}
                </p>
                {(search || selectedType || selectedSpecialist || emergencyOnly) && (
                  <button onClick={resetFilters} className="btn btn-outline btn-sm">
                    Clear Filters
                  </button>
                )}
              </motion.div>
            )}

            {filteredHospitals.map(hospital => (
              <HospitalCard
                key={hospital.id}
                hospital={hospital}
                userLocation={userLocation}
                selected={selectedHospital?.id === hospital.id}
                onSelect={h => setSelectedHospital(h)}
                onFocus={h => setFocusHospital(h)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ── LAYER 4: INSPECTOR PANEL (floats bottom-left when hospital selected) */}
      <AnimatePresence>
        {selectedHospital && (
          <InspectorPanel
            hospital={selectedHospital}
            userLocation={userLocation}
            onClose={() => setSelectedHospital(null)}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(14,100,255,0.3); border-radius: 99px; }
        @media (max-width: 900px) {
          .hospital-right-panel {
            top: auto !important; left: 10px !important; right: 10px !important;
            bottom: 10px !important; width: auto !important; height: 260px !important;
          }
        }
      `}</style>
    </div>
  );
}
