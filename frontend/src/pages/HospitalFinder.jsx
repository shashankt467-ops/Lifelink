import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Phone, Navigation, Activity, Locate, X,
  AlertTriangle, Building2, RefreshCw, Globe, SlidersHorizontal,
  ExternalLink, Compass, Wifi, WifiOff, CheckCircle2, Bed, Stethoscope
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { INDIA_STATES, CITIES_BY_STATE, CITY_COORDS } from '../data/mockData';
import { geocodeCity, queryOverpassHospitals, calcDistanceKm } from '../services/osmDiscovery';
import { dbStore } from '../services/firestore/db';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';

const HOSPITAL_TYPES = ['Hospital', 'Specialty Clinic', 'Nursing Home', 'Medical College'];
const SPECIALIZATIONS = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology',
  'Dermatology', 'Gastroenterology', 'Psychiatry', 'Urology', 'General Surgery',
  'Emergency Medicine', 'General Emergency Care',
];

const display = (val, fallback = 'Not available') => {
  if (val === null || val === undefined || val === '' || val === 'Not available') return fallback;
  return val;
};

// ─── Compact 3D Spatial Hospital Marker Icon ─────────────────────────────────
const createCompactSpatialIcon = (selected = false, isEmergency = false, label = '') =>
  L.divIcon({
    className: 'spatial-marker-wrapper',
    html: `
      <div style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -100%) ${selected ? 'translateY(-8px) scale(1.22)' : 'scale(1)'};
        transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        cursor: pointer;
        z-index: ${selected ? 1000 : 100};
      ">
        {/* Compact 3D Marker Pin */}
        <div style="
          width: ${selected ? '36px' : '30px'};
          height: ${selected ? '36px' : '30px'};
          border-radius: 50%;
          background: ${selected
            ? 'linear-gradient(135deg, #0e64ff 0%, #7c3aed 100%)'
            : isEmergency
              ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)'
              : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'};
          border: ${selected
            ? '2.5px solid #ffffff'
            : isEmergency
              ? '2px solid rgba(255,255,255,0.9)'
              : '2px solid rgba(255,255,255,0.7)'};
          box-shadow: ${selected
            ? '0 10px 25px rgba(14,100,255,0.7), 0 0 0 4px rgba(14,100,255,0.3)'
            : isEmergency
              ? '0 6px 18px rgba(220,38,38,0.6)'
              : '0 6px 16px rgba(0,0,0,0.5)'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${selected ? '18px' : '15px'};
          color: white;
        ">
          ${isEmergency ? '🚨' : '🏥'}
        </div>

        {/* Stem */}
        <div style="
          width: 2px;
          height: 8px;
          background: ${isEmergency ? '#dc2626' : '#0e64ff'};
          box-shadow: 0 0 6px ${isEmergency ? '#dc2626' : '#0e64ff'};
        "></div>

        {/* Ground 3D Drop Shadow */}
        <div style="
          width: 16px;
          height: 5px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 50%;
          filter: blur(2px);
          transform: translateY(-2px);
        "></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

// ─── Compact Cluster Marker Icon ──────────────────────────────────────────────
const createClusterIcon = (count = 2) =>
  L.divIcon({
    className: 'spatial-cluster-wrapper',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(-50%, -50%);
        cursor: pointer;
      ">
        <div style="
          background: linear-gradient(135deg, #0e64ff 0%, #0040cc 100%);
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 800;
          font-family: Outfit, sans-serif;
          border: 2px solid #ffffff;
          box-shadow: 0 8px 24px rgba(14,100,255,0.6), 0 0 0 4px rgba(14,100,255,0.25);
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        ">
          <span style="font-size: 13px;">🏥</span>
          <span>${count} Hospitals</span>
        </div>
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
      <style>@keyframes usr-ping{0%{transform:scale(0.5);opacity:1}100%{transform:scale(1.6);opacity:0}}</style>
    </div>
  `,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

// ─── Map Controller with Smooth Fly-To Animation ─────────────────────────────
function MapController({ center, hospitals, userLocation, focusHospital }) {
  const map = useMap();
  const lastFocusId = useRef(null);

  useEffect(() => {
    if (focusHospital && (focusHospital.lat || focusHospital.latitude)) {
      const lat = Number(focusHospital.lat || focusHospital.latitude);
      const lng = Number(focusHospital.lng || focusHospital.longitude);
      if (!isNaN(lat) && !isNaN(lng) && lastFocusId.current !== focusHospital.id) {
        lastFocusId.current = focusHospital.id;
        map.flyTo([lat, lng], 15, { animate: true, duration: 0.8 });
      }
      return;
    }
    if (hospitals && hospitals.length > 0) {
      const points = hospitals
        .filter(h => (h.lat || h.latitude) && (h.lng || h.longitude))
        .map(h => [Number(h.lat || h.latitude), Number(h.lng || h.longitude)]);
      if (userLocation) points.push([userLocation.lat, userLocation.lng]);
      if (points.length === 1) {
        map.flyTo(points[0], 14, { animate: true, duration: 0.8 });
      } else if (points.length > 1) {
        try { map.fitBounds(L.latLngBounds(points), { padding: [60, 60], maxZoom: 14 }); } catch (_) {}
      }
    } else if (center) {
      map.flyTo([center.lat, center.lng], 12, { animate: true, duration: 0.8 });
    }
  }, [center, hospitals, userLocation, focusHospital, map]);

  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: onMapClick });
  return null;
}

// ─── Compact Spatial Hospital Card (Right Sidebar List) ──────────────────────
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { onSelect(hospital); onFocus(hospital); }}
      style={{
        background: selected
          ? 'linear-gradient(135deg, rgba(14,100,255,0.2) 0%, rgba(124,58,237,0.14) 100%)'
          : hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 16,
        border: selected
          ? '1.5px solid rgba(14,100,255,0.65)'
          : hovered ? '1px solid rgba(14,100,255,0.3)' : '1px solid rgba(255,255,255,0.08)',
        padding: '12px 14px',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: selected
          ? '0 12px 30px rgba(14,100,255,0.25)'
          : hovered ? '0 8px 20px rgba(0,0,0,0.15)' : 'none',
        transition: 'all 0.25s ease',
      }}
    >
      {selected && (
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: 3.5,
          background: 'linear-gradient(180deg,#0e64ff,#7c3aed)',
          boxShadow: '0 0 10px #0e64ff',
          borderRadius: '4px 0 0 4px',
        }} />
      )}

      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit,sans-serif', margin: 0, lineHeight: 1.2 }}>
              {hospital.name}
            </h3>
            {isEmergency && (
              <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 20, background: 'rgba(220,38,38,0.15)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.3)', flexShrink: 0 }}>
                24/7 ER
              </span>
            )}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            <MapPin size={10} color="var(--primary)" style={{ flexShrink: 0 }} />
            {hospital.address && hospital.address !== 'Address not provided in OpenStreetMap'
              ? hospital.address
              : `${hospital.city || ''}, ${hospital.state || 'India'}`}
          </p>
        </div>
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: isEmergency ? 'rgba(220,38,38,0.12)' : 'rgba(14,100,255,0.1)',
          border: `1px solid ${isEmergency ? 'rgba(220,38,38,0.25)' : 'rgba(14,100,255,0.2)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isEmergency ? <AlertTriangle size={16} color="#dc2626" /> : <Building2 size={16} color="var(--primary)" />}
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: 'rgba(14,100,255,0.1)', color: 'var(--primary)', border: '1px solid rgba(14,100,255,0.15)' }}>
          {hospital.type || 'Healthcare Facility'}
        </span>
        {dist > 0 && (
          <span style={{ fontSize: 10, fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Compass size={10} /> {dist.toFixed(1)} km away
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={handleDirections}
          style={{
            flex: 1, padding: '7px 0', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)',
            color: 'var(--text-primary)', fontSize: 11, fontWeight: 800,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}
        >
          <Navigation size={11} /> Directions
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); navigate('/hospitals/' + hospital.id); }}
          style={{
            flex: 1, padding: '7px 0', borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg,var(--primary),#0040cc)',
            color: 'white', fontSize: 11, fontWeight: 800,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            boxShadow: '0 4px 12px rgba(14,100,255,0.3)',
          }}
        >
          <ExternalLink size={11} /> Details
        </button>
      </div>
    </motion.div>
  );
}

// ─── Compact Spatial Floating Card (Selected Hospital Inspector) ─────────────
function CompactSpatialInspector({ hospital, userLocation, onClose }) {
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
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute', bottom: 20, left: 20, zIndex: 1200,
        maxWidth: 380, width: 'calc(100% - 400px)',
        background: 'rgba(8,15,30,0.95)',
        backdropFilter: 'blur(28px) saturate(2)',
        WebkitBackdropFilter: 'blur(28px) saturate(2)',
        borderRadius: 20, border: '1.5px solid rgba(14,100,255,0.4)',
        padding: '16px 18px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
            <h2 style={{ fontSize: 16, fontWeight: 900, margin: 0, fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>
              {hospital.name}
            </h2>
            {isEmergency && (
              <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 20, background: 'rgba(220,38,38,0.15)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.3)' }}>
                24/7 ER
              </span>
            )}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={11} color="var(--primary)" />
            {hospital.address && hospital.address !== 'Address not provided in OpenStreetMap'
              ? hospital.address
              : `${hospital.city || ''}, ${hospital.state || 'India'}`}
          </p>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 5, cursor: 'pointer', flexShrink: 0 }}>
          <X size={14} color="var(--text-muted)" />
        </button>
      </div>

      {/* Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
        {[
          { label: 'Distance', val: hospital.distance > 0 ? `${hospital.distance.toFixed(1)} km away` : 'Not available' },
          { label: 'Opening Hours', val: display(hospital.openingHours) },
          { label: 'Phone', val: display(hospital.phone) },
          { label: 'Facility Type', val: display(hospital.type) },
          { label: 'Beds', val: hospital.beds?.total && hospital.beds.total !== 'Availability not provided' ? `${hospital.beds.total} total` : 'Availability not provided' },
          { label: 'Emergency Status', val: isEmergency ? '✓ 24/7 ER Ready' : 'Not available' },
        ].map(({ label, val }) => (
          <div key={label} style={{ padding: '6px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>{label}</p>
            <p style={{ fontSize: 11, fontWeight: 600, color: val.includes('Not available') || val.includes('not provided') ? 'var(--text-muted)' : 'var(--text-primary)', margin: '1px 0 0', fontStyle: val.includes('Not available') || val.includes('not provided') ? 'italic' : 'normal' }}>{val}</p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleDirections} style={{ flex: 1, padding: '9px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <Navigation size={13} /> OSRM Route
        </button>
        {hospital.phone && hospital.phone !== 'Not available' && (
          <button onClick={() => window.open(`tel:${hospital.phone}`)} style={{ flex: 1, padding: '9px', borderRadius: 10, border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)', color: '#10b981', fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Phone size={13} /> Call
          </button>
        )}
        <button onClick={() => navigate('/hospitals/' + hospital.id)} style={{ flex: 1, padding: '9px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,var(--primary),#0040cc)', color: 'white', fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, boxShadow: '0 4px 12px rgba(14,100,255,0.35)' }}>
          <ExternalLink size={13} /> View Details
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

  // Filter state
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
  const [discoveryStatus, setDiscoveryStatus] = useState('idle');
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

  // Run Overpass discovery
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
          setDiscoveryError('Location geocoding failed.');
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
        if (isRefresh) toast.success(`Refreshed — ${withDist.length} hospitals discovered via OpenStreetMap`);
      } else {
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
      if (selectedType && norm(h.type) !== norm(selectedType)) return false;
      if (selectedSpecialist) {
        const specs = (h.specializations || []).map(s => norm(s));
        if (!specs.some(s => s.includes(norm(selectedSpecialist)) || norm(selectedSpecialist).includes(s))) return false;
      }
      if (emergencyOnly && h.emergency !== true) return false;
      if (open24x7Only && !h.open24x7 && h.emergency !== true) return false;
      if (distanceMax && h.distance > Number(distanceMax)) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'distance') return (a.distance || 999) - (b.distance || 999);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [osmHospitals, search, selectedType, selectedSpecialist, emergencyOnly, open24x7Only, distanceMax, sortBy]);

  // ─── Spatial Distance Group Clustering ──────────────────────────────────────
  // Groups nearby markers within 0.03 lat/lng grid buckets into compact cluster pills
  const { clusteredItems, individualItems } = useMemo(() => {
    const clusters = [];
    const unclustered = [];
    const bucketSize = 0.035;

    const grid = new Map();

    filteredHospitals.forEach(h => {
      const lat = Number(h.lat || h.latitude);
      const lng = Number(h.lng || h.longitude);
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;

      const key = `${Math.floor(lat / bucketSize)}_${Math.floor(lng / bucketSize)}`;
      if (!grid.has(key)) {
        grid.set(key, []);
      }
      grid.get(key).push(h);
    });

    grid.forEach((items) => {
      if (items.length >= 3) {
        const avgLat = items.reduce((sum, item) => sum + Number(item.lat || item.latitude), 0) / items.length;
        const avgLng = items.reduce((sum, item) => sum + Number(item.lng || item.longitude), 0) / items.length;
        clusters.push({
          id: `cluster-${items[0].id}`,
          count: items.length,
          lat: avgLat,
          lng: avgLng,
          items,
        });
      } else {
        items.forEach(item => unclustered.push(item));
      }
    });

    return { clusteredItems: clusters, individualItems: unclustered };
  }, [filteredHospitals]);

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

      {/* ── LAYER 1: CLEAN REAL INTERACTIVE MAP (ZERO CANVAS OVERLAY) ─────────── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <MapContainer
          center={[mapCenter.lat, mapCenter.lng]}
          zoom={12}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController
            center={mapCenter}
            hospitals={filteredHospitals}
            userLocation={userLocation}
            focusHospital={focusHospital}
          />
          <MapClickHandler onMapClick={() => setSelectedHospital(null)} />

          {/* User location pin */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userMarkerIcon}>
              <Popup>
                <div style={{ padding: 4, fontSize: 13, fontWeight: 800, color: '#059669', fontFamily: 'Outfit,sans-serif' }}>
                  📍 Your GPS Location
                </div>
              </Popup>
            </Marker>
          )}

          {/* Cluster Markers */}
          {clusteredItems.map(c => (
            <Marker
              key={c.id}
              position={[c.lat, c.lng]}
              icon={createClusterIcon(c.count)}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                  setFocusHospital(c.items[0]);
                  setMapCenter({ lat: c.lat, lng: c.lng });
                }
              }}
            />
          ))}

          {/* Individual Compact Spatial Hospital Pins */}
          {individualItems.map(h => {
            const lat = Number(h.lat || h.latitude);
            const lng = Number(h.lng || h.longitude);
            if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;
            const isSelected = selectedHospital?.id === h.id;
            return (
              <Marker
                key={h.id}
                position={[lat, lng]}
                icon={createCompactSpatialIcon(
                  isSelected,
                  h.emergency === true,
                  h.name
                )}
                eventHandlers={{
                  click: (e) => {
                    e.originalEvent.stopPropagation();
                    setSelectedHospital(h);
                    setFocusHospital(h);
                  }
                }}
              >
                <Popup maxWidth={240}>
                  <div style={{ padding: '4px 2px', fontFamily: 'Inter,sans-serif' }}>
                    <p style={{ fontSize: 13, fontWeight: 900, color: '#0f172a', margin: '0 0 2px', fontFamily: 'Outfit,sans-serif' }}>{h.name}</p>
                    <p style={{ fontSize: 11, color: '#475569', margin: '0 0 4px' }}>
                      {h.address && h.address !== 'Address not provided in OpenStreetMap' ? h.address : `${h.city || ''}, ${h.state || 'India'}`}
                    </p>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
                      {h.distance > 0 && <span style={{ fontSize: 10, color: '#10b981', fontWeight: 800 }}>{h.distance.toFixed(1)} km</span>}
                      {h.emergency && <span style={{ fontSize: 9, background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '1px 5px', borderRadius: 10, fontWeight: 800 }}>24/7 ER</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button
                        style={{ flex: 1, background: '#0e64ff', color: 'white', border: 'none', borderRadius: 6, padding: '6px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                        onClick={() => navigate('/hospitals/' + h.id)}
                      >View Details</button>
                      <button
                        style={{ flex: 1, background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
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

      {/* ── LAYER 2: FLOATING TOP COMMAND CONTROLS ──────────────────────────── */}
      <div style={{
        position: 'absolute', top: 16, left: 16, right: 16, zIndex: 500,
        display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', pointerEvents: 'auto' }}>
          
          {/* Location Chip */}
          <div style={{
            background: 'rgba(8,15,30,0.92)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)', padding: '7px 14px',
            borderRadius: 20, boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
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
            flex: 1, minWidth: 240, maxWidth: 480,
            background: 'rgba(8,15,30,0.92)', backdropFilter: 'blur(24px)',
            border: '1.5px solid rgba(14,100,255,0.3)', borderRadius: 22,
            padding: '6px 8px 6px 14px', boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <Search size={15} color="var(--primary)" />
            <input
              type="text"
              placeholder="Search by hospital name, city, specialization…"
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

          {/* 24/7 ER Toggle */}
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

          {/* Refresh OSM button */}
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

        {/* Expanded Filters */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              style={{
                pointerEvents: 'auto',
                background: 'rgba(8,15,30,0.95)', backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18,
                padding: '12px 16px', boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
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

              <button onClick={resetFilters} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '7px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                <X size={12} /> Reset
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── LAYER 3: RIGHT PANEL — Compact Hospital Cards List ──────────────── */}
      <div style={{
        position: 'absolute', top: 76, right: 16, bottom: 16,
        width: 350, zIndex: 500, display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none',
      }}>
        {/* Header */}
        <div style={{
          pointerEvents: 'auto',
          background: 'rgba(8,15,30,0.92)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, padding: '10px 14px',
          boxShadow: '0 8px 28px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 size={16} color="var(--primary)" />
            <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)' }}>
              {filteredHospitals.length} Hospital{filteredHospitals.length !== 1 ? 's' : ''} Discovered
            </span>
          </div>
          {discoveryStatus === 'success' && (
            <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 12, background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Wifi size={10} /> OSM Live
            </span>
          )}
        </div>

        {/* List */}
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
                  background: 'rgba(14,100,255,0.06)', border: '1px dashed rgba(14,100,255,0.25)',
                  borderRadius: 16, padding: '24px 16px', textAlign: 'center',
                }}
              >
                <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)', margin: '0 auto 10px' }} />
                <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 2px' }}>
                  Discovering OpenStreetMap Hospitals
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
                  Querying Overpass API around {locationLabel}…
                </p>
              </motion.div>
            )}

            {!isSearching && filteredHospitals.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)',
                  borderRadius: 16, padding: '24px 16px', textAlign: 'center',
                }}
              >
                <Building2 size={32} style={{ opacity: 0.3, margin: '0 auto 8px' }} />
                <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                  No hospitals found in this area
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 10px' }}>
                  Try clearing your search query or selecting another city.
                </p>
                {search && (
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

      {/* ── LAYER 4: COMPACT SPATIAL INSPECTOR PANEL (Selected Hospital) ────── */}
      <AnimatePresence>
        {selectedHospital && (
          <CompactSpatialInspector
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(14,100,255,0.3); border-radius: 99px; }
      `}</style>
    </div>
  );
}
