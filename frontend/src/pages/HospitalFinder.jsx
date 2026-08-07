import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Clock, Phone, Navigation, Star, Filter, SortAsc, 
  Activity, Locate, X, ChevronDown, Bed, AlertTriangle, Building2, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, Globe
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  HOSPITALS, INDIA_STATES, CITIES_BY_STATE, HOSPITAL_TYPES, 
  hospitalsNearLocation, CITY_COORDS 
} from '../data/mockData';
import { geocodeCity, queryOverpassHospitals } from '../services/osmDiscovery';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';

const SPECIALIZATIONS = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 
  'Dermatology', 'Gastroenterology', 'Psychiatry', 'Urology', 'General Surgery'
];

// Leaflet custom marker icons
const createLeafletIcon = (color = '#0e64ff', label = '') => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${color};
        color: white;
        padding: 4px 8px;
        border-radius: 16px;
        font-size: 11px;
        font-weight: 700;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
        transform: translate(-50%, -100%);
      ">
        <span>📍</span>
        <span>${(label || 'Hospital').split(' ')[0]}</span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

const leafletUserIcon = L.divIcon({
  className: 'custom-leaflet-user-marker',
  html: `
    <div style="
      width: 18px;
      height: 18px;
      background: #10b981;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 12px #10b981;
      transform: translate(-50%, -50%);
    "></div>
  `,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

// Helper component to auto-fit Leaflet bounds
function LeafletMapController({ center, hospitals, userLocation }) {
  const map = useMap();
  useEffect(() => {
    if (hospitals && hospitals.length > 0) {
      try {
        const points = hospitals.filter(h => h.lat && h.lng).map(h => [Number(h.lat), Number(h.lng)]);
        if (userLocation) points.push([userLocation.lat, userLocation.lng]);
        if (points.length === 1) {
          map.setView(points[0], 13);
        } else if (points.length > 1) {
          const bounds = L.latLngBounds(points);
          map.fitBounds(bounds, { padding: [35, 35], maxZoom: 14 });
        }
      } catch (err) {
        console.error('Leaflet bounds error:', err);
      }
    } else if (center) {
      map.setView([center.lat, center.lng], 11);
    }
  }, [center, hospitals, userLocation, map]);
  return null;
}

function HospitalCard({ hospital, userLocation }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card hover-effect p-5 flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 pr-2">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-xl font-bold font-outfit text-text-primary">{hospital.name}</h3>
              {hospital.isOsmData && (
                <span className="badge bg-green-500/10 text-green-600 border border-green-500/20 text-[10px] flex items-center gap-1 shrink-0 font-medium">
                  <CheckCircle2 size={10} /> OpenStreetMap Data
                </span>
              )}
            </div>
            <p className="text-text-secondary text-sm flex items-center mb-2">
              <MapPin size={14} className="mr-1 shrink-0 text-primary" />
              {hospital.address || 'Address not available'}
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="badge badge-primary flex items-center gap-1">
                <Building2 size={12} /> {hospital.type || 'Hospital'}
              </span>
              <span className="text-xs text-text-muted flex items-center">
                {hospital.city}{hospital.state ? `, ${hospital.state}` : ''}
              </span>
              {hospital.phone && hospital.phone !== 'Not available' && (
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <Phone size={11} /> {hospital.phone}
                </span>
              )}
              {hospital.emergency && (
                <span className="badge bg-red-500/10 text-red-500 border border-red-500/20 text-xs">
                  Emergency 24/7
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center text-yellow-500 mb-1">
              <Star size={16} className="fill-current" />
              <span className="ml-1 font-bold text-sm">{hospital.rating || 4.5}</span>
            </div>
            {hospital.reviewCount && (
              <span className="text-[11px] text-text-muted mb-1">({hospital.reviewCount} reviews)</span>
            )}
            {hospital.distance !== undefined && hospital.distance > 0 && (
              <span className="badge badge-outline text-xs">
                {hospital.distance.toFixed(1)} km away
              </span>
            )}
          </div>
        </div>

        {/* DEMO / SIMULATED AVAILABILITY CARD */}
        <div className="grid grid-cols-2 gap-3 mb-5 p-3.5 rounded-xl bg-bg-secondary border border-border">
          <div>
            <div className="text-[11px] text-text-muted mb-0.5 flex items-center">
              <Bed size={13} className="mr-1 text-blue-500" /> General Beds
            </div>
            <div className="text-base font-bold text-text-primary">{hospital.beds?.general || 15} available</div>
          </div>
          <div>
            <div className="text-[11px] text-text-muted mb-0.5 flex items-center">
              <AlertTriangle size={13} className="mr-1 text-amber-500" /> ICU / Emergency
            </div>
            <div className="text-base font-bold text-text-primary">{hospital.beds?.icu || 4} / {hospital.beds?.emergency || 3}</div>
          </div>
          <div className="col-span-2 pt-1 border-t border-border/50 flex justify-between items-center">
            <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
              ⓘ Simulated Availability — Hackathon Demo
            </span>
            <span className="text-[10px] text-text-muted">Hackathon Prototype</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="btn btn-outline flex-1 flex items-center justify-center gap-2 text-xs py-2" onClick={handleNavigate}>
          <Navigation size={15} /> Navigate
        </button>
        <button className="btn btn-primary flex-1 text-xs py-2" onClick={() => navigate('/hospitals/' + hospital.id)}>
          View Details
        </button>
      </div>
    </motion.div>
  );
}

export default function HospitalFinder() {
  const navigate = useNavigate();
  const { location } = useApp();
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
  const [displayCount, setDisplayCount] = useState(12);

  // Synchronize state/city when shared location context updates
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

  // Perform Dynamic Hospital Discovery via OpenStreetMap (Nominatim + Overpass API)
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

      // Query Overpass API for real healthcare facilities around coordinates
      const radiusKm = distanceMax ? Number(distanceMax) : 20;
      const fetched = await queryOverpassHospitals({
        lat: coords.lat,
        lng: coords.lng,
        radiusKm: radiusKm,
        userLocation: userLocation,
      });

      if (fetched && fetched.length > 0) {
        setOsmHospitals(fetched);
        setDiscoveryStatus('osm_success');
      } else {
        // Fallback to local 60+ India hospitals dataset
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

  const handleDetectLocation = (showToast = true) => {
    setLocationStatus('detecting');
    if (!navigator.geolocation) {
      if (showToast) toast.error('Geolocation is not supported by your browser');
      setLocationStatus('manual');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = { lat: latitude, lng: longitude };
        setUserLocation(coords);
        setLocationStatus('found');
        if (showToast) toast.success('Current location detected! Searching nearby hospitals.');
        executeOsmDiscovery(null, null, coords);
      },
      (err) => {
        setLocationStatus('manual');
        if (showToast) toast.error('Could not get location permission. Select state/city filter.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity('');
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedState('');
    setSelectedCity('');
    setSelectedType('');
    setSelectedSpecialist('');
    setEmergencyOnly(false);
    setDistanceMax('20');
    setSort('distance');
    setDisplayCount(12);
    setOsmHospitals([]);
    toast.success('Filters reset');
  };

  // Robust Normalization and Substring matching for filters
  const normalizeStr = (str) => (str ? String(str).trim().toLowerCase() : '');

  // Combined Active Dataset (OpenStreetMap Overpass or Local Dataset)
  const activeDataset = useMemo(() => {
    if (osmHospitals && osmHospitals.length > 0) {
      return osmHospitals;
    }
    return hospitals || HOSPITALS || [];
  }, [osmHospitals, hospitals]);

  const filteredHospitals = useMemo(() => {
    return activeDataset
      .filter(h => {
        // Search Filter
        if (search) {
          const q = normalizeStr(search);
          const matchName = normalizeStr(h.name).includes(q);
          const matchCity = normalizeStr(h.city).includes(q);
          const matchAddress = normalizeStr(h.address).includes(q);
          if (!matchName && !matchCity && !matchAddress) return false;
        }

        // State & City Filter (for local fallback records only)
        if (!h.isOsmData) {
          if (selectedState && h.state && normalizeStr(h.state) !== normalizeStr(selectedState)) {
            return false;
          }
          if (selectedCity && h.city && normalizeStr(h.city) !== normalizeStr(selectedCity)) {
            return false;
          }
        }

        // Hospital Type Filter
        if (selectedType && h.type && normalizeStr(h.type) !== normalizeStr(selectedType)) {
          return false;
        }

        // Specialist Filter (Only filter if hospital provides specialists tag or internal demo data)
        if (selectedSpecialist && h.specialists && Array.isArray(h.specialists) && h.specialists.length > 0) {
          const target = normalizeStr(selectedSpecialist);
          const hasSpecialist = h.specialists.some(s => {
            const spec = normalizeStr(s);
            if (spec === target || spec.includes(target) || target.includes(spec)) return true;
            const tRoot = target.slice(0, 4);
            const sRoot = spec.slice(0, 4);
            return tRoot.length >= 4 && sRoot.length >= 4 && tRoot === sRoot;
          });
          if (!hasSpecialist && !h.isOsmData) return false;
        }

        // Emergency Filter
        if (emergencyOnly && !h.emergency) return false;

        // Distance Filter
        if (distanceMax && h.distance !== undefined && h.distance > Number(distanceMax)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sort === 'distance') return (a.distance || 0) - (b.distance || 0);
        if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sort === 'beds') {
          const bedsA = (a.beds?.general || 0) + (a.beds?.icu || 0);
          const bedsB = (b.beds?.general || 0) + (b.beds?.icu || 0);
          return bedsB - bedsA;
        }
        return 0;
      });
  }, [activeDataset, search, selectedState, selectedCity, selectedType, selectedSpecialist, emergencyOnly, distanceMax, sort]);

  const visibleHospitals = useMemo(() => {
    return filteredHospitals.slice(0, displayCount);
  }, [filteredHospitals, displayCount]);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  // Map center calculation based on location -> city -> state -> filtered average -> fallback
  const mapCenter = useMemo(() => {
    if (userLocation) return userLocation;
    if (selectedCity && CITY_COORDS && CITY_COORDS[selectedCity]) {
      return CITY_COORDS[selectedCity];
    }
    if (selectedState && CITIES_BY_STATE?.[selectedState]) {
      const firstCity = CITIES_BY_STATE[selectedState][0];
      if (CITY_COORDS?.[firstCity]) return CITY_COORDS[firstCity];
    }
    if (filteredHospitals.length > 0) {
      const valid = filteredHospitals.filter(h => h.lat && h.lng);
      if (valid.length > 0) {
        const avgLat = valid.reduce((s, h) => s + Number(h.lat), 0) / valid.length;
        const avgLng = valid.reduce((s, h) => s + Number(h.lng), 0) / valid.length;
        return { lat: avgLat, lng: avgLng };
      }
    }
    return { lat: 18.5204, lng: 73.8567 }; // Default Pune
  }, [userLocation, selectedCity, selectedState, filteredHospitals]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-text-primary mb-2">Hospital Finder</h1>
          <p className="text-text-secondary">OpenStreetMap Hospital Discovery across India. Free & Zero API Keys required.</p>
        </div>
        {(search || selectedState || selectedCity || selectedType || selectedSpecialist || emergencyOnly || (distanceMax && distanceMax !== '20')) && (
          <button 
            onClick={resetFilters}
            className="btn btn-outline text-xs self-start sm:self-center flex items-center gap-1.5 text-orange-400 border-orange-400/40 hover:bg-orange-400/10 py-2 px-3"
          >
            <X size={14} /> Clear All Filters
          </button>
        )}
      </div>

      {/* Discovery Architecture Status Bar */}
      <div className="mb-6 p-3 rounded-xl bg-bg-secondary border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {discoveryStatus === 'osm_success' ? (
            <span className="flex items-center gap-1.5 text-green-500 font-semibold">
              <Globe size={14} />
              OpenStreetMap Hospital Discovery Active (Overpass API)
            </span>
          ) : discoveryStatus === 'fallback_active' ? (
            <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Offline / India Demo Hospitals Dataset Active
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-primary font-semibold">
              <RefreshCw size={14} className="animate-spin" />
              Searching OpenStreetMap...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-text-muted">
          <span>Target City: <strong className="text-text-primary">{selectedCity || selectedState || 'Pune / Pan India'}</strong></span>
          <span>&bull;</span>
          <span>Found: <strong className="text-text-primary">{filteredHospitals.length} hospitals</strong></span>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={20} />
            <input 
              type="text" 
              placeholder="Search hospitals by name, street, or city (e.g. 'Ruby Hall Pune', 'Apollo Mumbai', 'Hospital near me')..." 
              className="input pl-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {isSearchingOsm && (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-primary font-medium flex items-center gap-1 bg-bg-card px-2 py-1 rounded border border-border">
                <RefreshCw size={12} className="animate-spin" /> Searching OpenStreetMap...
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select className="input" value={selectedState} onChange={handleStateChange}>
              <option value="">All States</option>
              {INDIA_STATES?.map(state => <option key={state} value={state}>{state}</option>)}
            </select>
            
            <select className="input" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedState}>
              <option value="">All Cities</option>
              {selectedState && CITIES_BY_STATE?.[selectedState]?.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
            
            <select className="input" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="">All Hospital Types</option>
              {HOSPITAL_TYPES?.map(type => <option key={type} value={type}>{type}</option>)}
            </select>

            <select className="input" value={selectedSpecialist} onChange={(e) => setSelectedSpecialist(e.target.value)}>
              <option value="">All Specialists</option>
              {SPECIALIZATIONS.map(spec => <option key={spec} value={spec}>{spec}</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <select className="input" value={distanceMax} onChange={(e) => setDistanceMax(e.target.value)}>
              <option value="">Any Distance</option>
              <option value="5">Within 5 km</option>
              <option value="10">Within 10 km</option>
              <option value="20">Within 20 km</option>
              <option value="50">Within 50 km</option>
            </select>
            
            <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="distance">Sort by Distance</option>
              <option value="rating">Sort by Rating</option>
              <option value="beds">Sort by Available Beds</option>
            </select>
            
            <label className="flex items-center gap-2 cursor-pointer text-text-primary">
              <input 
                type="checkbox" 
                checked={emergencyOnly} 
                onChange={(e) => setEmergencyOnly(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <span>Emergency Only</span>
            </label>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleDetectLocation(true)} 
                className="btn flex-1 flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg py-2"
              >
                <Locate size={18} /> Use My Location
              </button>
              {locationStatus === 'detecting' && <span className="badge badge-outline">Detecting...</span>}
              {locationStatus === 'found' && <span className="badge badge-success bg-green-100 text-green-700">Location Set</span>}
              {locationStatus === 'manual' && <span className="badge badge-outline">Manual</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Live OpenStreetMap (Leaflet) Container */}
      <div className="card h-[420px] mb-8 relative overflow-hidden bg-bg-secondary border border-border p-1">
        <div className="w-full h-full relative rounded-xl overflow-hidden">
          <MapContainer 
            center={[mapCenter.lat, mapCenter.lng]} 
            zoom={selectedCity ? 12 : selectedState ? 8 : 6} 
            style={{ width: '100%', height: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LeafletMapController center={mapCenter} hospitals={visibleHospitals} userLocation={userLocation} />

            {/* User location marker */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={leafletUserIcon}>
                <Popup>
                  <div className="text-xs font-bold text-green-700">📍 You are here</div>
                </Popup>
              </Marker>
            )}

            {/* Filtered Hospital Markers */}
            {visibleHospitals.map(h => (
              <Marker 
                key={h.id} 
                position={[Number(h.lat), Number(h.lng)]} 
                icon={createLeafletIcon(h.emergency ? '#dc2626' : '#0e64ff', h.name)}
              >
                <Popup>
                  <div className="p-1 max-w-xs text-gray-900">
                    <h4 className="font-bold text-sm text-gray-900 mb-0.5">{h.name}</h4>
                    <p className="text-xs text-gray-600 mb-1">{h.address || `${h.city}, ${h.state}`}</p>
                    <div className="flex items-center gap-2 mb-2 text-xs">
                      <span className="text-amber-600 font-bold">★ {h.rating || 4.5}</span>
                      {h.distance !== undefined && h.distance > 0 && (
                        <span className="text-gray-500 font-semibold">{h.distance.toFixed(1)} km away</span>
                      )}
                      {h.emergency && (
                        <span className="bg-red-100 text-red-700 px-1 py-0.5 rounded font-bold text-[10px]">24/7 Emergency</span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-700 bg-gray-100 p-1.5 rounded mb-2 font-medium">
                      🛏 Beds: General {h.beds?.general || 15} | ICU {h.beds?.icu || 4}
                    </div>
                    <div className="flex gap-2 text-xs">
                      <button
                        className="bg-blue-600 text-white px-2 py-1 rounded font-medium flex-1 text-center"
                        onClick={() => navigate('/hospitals/' + h.id)}
                      >
                        View Details
                      </button>
                      <button
                        className="bg-gray-800 text-white px-2 py-1 rounded font-medium flex-1 text-center"
                        onClick={() => {
                          window.open(
                            `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation ? userLocation.lat + ',' + userLocation.lng : ''};${h.lat},${h.lng}`,
                            '_blank'
                          );
                        }}
                      >
                        Navigate
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          <div className="absolute top-2 right-2 bg-bg-card/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border shadow-md text-xs font-semibold text-text-primary z-[1000] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            OpenStreetMap Live Map
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-text-primary">
          Showing {visibleHospitals.length} of {filteredHospitals.length} hospitals {selectedCity ? `in ${selectedCity}` : selectedState ? `in ${selectedState}` : 'across India'}
        </h2>
        {discoveryStatus === 'osm_success' && (
          <span className="badge bg-green-500/10 text-green-600 border border-green-500/20 text-xs font-semibold">
            OpenStreetMap Live Discovery
          </span>
        )}
      </div>

      {/* Hospital Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AnimatePresence>
          {visibleHospitals.map(hospital => (
            <HospitalCard key={hospital.id} hospital={hospital} userLocation={userLocation} />
          ))}
        </AnimatePresence>
        
        {filteredHospitals.length === 0 && (
          <div className="col-span-full py-12 text-center card bg-bg-secondary border-dashed border-2 border-border">
            <Building2 className="mx-auto text-text-muted mb-4 opacity-50" size={48} />
            <h3 className="text-lg font-bold text-text-primary mb-2">No hospitals found</h3>
            <p className="text-text-secondary mb-4">Try adjusting your filters or search criteria</p>
            <button onClick={resetFilters} className="btn btn-outline text-xs inline-flex items-center gap-1">
              <X size={14} /> Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Load More Hospitals Pagination */}
      {filteredHospitals.length > visibleHospitals.length && (
        <div className="text-center mb-12">
          <button 
            onClick={handleLoadMore} 
            className="btn btn-primary px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform inline-flex items-center gap-2 font-bold text-sm"
          >
            <RefreshCw size={16} /> Load More Hospitals ({filteredHospitals.length - visibleHospitals.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
