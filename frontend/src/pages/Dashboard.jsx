import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AlertTriangle, Hospital, UserCheck, Ambulance, Droplets,
  MapPin, Clock, Star, Phone, Navigation, X, ChevronRight,
  Brain, Calendar, Activity, Stethoscope, Wind, Thermometer,
  Heart, Zap, Shield, Bot, ArrowRight, Sparkles, CheckCircle,
  TrendingUp, Bell, Search, MessageSquare, Bed, Locate, Globe, RefreshCw
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  HOSPITALS,
  DOCTORS,
  AMBULANCES,
  BLOOD_BANKS,
  NOTIFICATIONS,
  HEALTH_TIPS,
  INDIA_STATES,
  CITIES_BY_STATE,
  hospitalsNearLocation,
} from '../data/mockData';

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const modalOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const modalPanel = {
  hidden: { opacity: 0, scale: 0.94, y: 32 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.94, y: 32, transition: { duration: 0.2 } },
};

// Change Location Modal Component
function ChangeLocationModal({ isOpen, onClose, currentLocation, onChangeCity, onDetectGps }) {
  const [selectedState, setSelectedState] = useState(currentLocation?.state || 'Maharashtra');
  const [selectedCity, setSelectedCity] = useState(currentLocation?.city || 'Pune');
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (currentLocation) {
      setSelectedState(currentLocation.state || 'Maharashtra');
      setSelectedCity(currentLocation.city || 'Pune');
    }
  }, [currentLocation]);

  const handleStateChange = (e) => {
    const st = e.target.value;
    setSelectedState(st);
    const cities = CITIES_BY_STATE[st] || [];
    setSelectedCity(cities[0] || '');
  };

  const handleApply = async () => {
    if (!selectedCity) {
      toast.error('Please select a city');
      return;
    }
    await onChangeCity(selectedCity, selectedState);
    toast.success(`Location set to ${selectedCity}, ${selectedState}`);
    onClose();
  };

  const handleGpsClick = async () => {
    setIsDetecting(true);
    const res = await onDetectGps(true);
    setIsDetecting(false);
    if (res) {
      toast.success(`Location detected: ${res.city}, ${res.state}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalOverlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
        >
          <motion.div
            variants={modalPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-card)', borderRadius: 24, width: '100%', maxWidth: 460,
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0e64ff, #0040cc)',
              padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <MapPin size={22} color="white" />
                </div>
                <div>
                  <h2 style={{ color: 'white', fontSize: 18, fontWeight: 800, margin: 0 }}>Change Location</h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: 0 }}>Set application-wide city & state</p>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 32, height: 32, borderRadius: '50%', border: 'none',
                  background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
                  SELECT STATE
                </label>
                <select 
                  className="input" 
                  value={selectedState} 
                  onChange={handleStateChange}
                  style={{ width: '100%' }}
                >
                  {INDIA_STATES?.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
                  SELECT CITY
                </label>
                <select 
                  className="input" 
                  value={selectedCity} 
                  onChange={(e) => setSelectedCity(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {CITIES_BY_STATE[selectedState]?.map(ct => (
                    <option key={ct} value={ct}>{ct}</option>
                  ))}
                </select>
              </div>

              <div style={{ margin: '8px 0', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleGpsClick}
                  disabled={isDetecting}
                  style={{ width: '100%', fontSize: 13, gap: 8, justifyContent: 'center' }}
                >
                  <Locate size={16} className={isDetecting ? 'animate-spin' : ''} />
                  {isDetecting ? 'Detecting Location...' : 'Use My Current Location (GPS)'}
                </button>
              </div>

              <div className="flex gap-3 mt-2">
                <button 
                  className="btn btn-ghost flex-1" 
                  onClick={onClose} 
                  style={{ fontSize: 13 }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary flex-1" 
                  onClick={handleApply}
                  style={{ fontSize: 13 }}
                >
                  Apply Location
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Quick Stat Card Component
function StatCard({ icon: Icon, label, value, color, bg, index, subtitle }) {
  return (
    <motion.div
      className="stat-card"
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -6, z: 20, rotateX: -2, rotateY: 2, boxShadow: 'var(--shadow-3d-md)' }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ cursor: 'default', transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      <div className="flex items-center gap-4" style={{ transform: 'translateZ(15px)' }}>
        <div
          className="flex items-center justify-center rounded-2xl"
          style={{
            width: 54, height: 54, background: bg, flexShrink: 0,
            boxShadow: `0 8px 20px ${color}35`, transform: 'translateZ(20px)'
          }}
        >
          <Icon size={26} color={color} />
        </div>
        <div style={{ transform: 'translateZ(10px)' }}>
          <p style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, fontFamily: 'Outfit, sans-serif' }}>
            {value}
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>{label}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-3" style={{ fontSize: 11, color: 'var(--text-muted)', transform: 'translateZ(8px)' }}>
        <TrendingUp size={12} color="var(--success)" />
        <span>{subtitle || 'Updated for current city'}</span>
      </div>
    </motion.div>
  );
}

// Hospital Card Compact Component
function HospitalCardCompact({ hospital, index, onNavigate, onCall, onViewDetails }) {
  return (
    <motion.div
      className="card flex flex-col justify-between p-5"
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -5, z: 20, boxShadow: 'var(--shadow-3d-md)' }}
      style={{ position: 'relative', overflow: 'hidden', transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      <div style={{ transform: 'translateZ(10px)' }}>
        {hospital.emergency && (
          <div
            className="badge badge-danger"
            style={{ position: 'absolute', top: 14, right: 14, fontSize: 10, fontWeight: 800, transform: 'translateZ(15px)' }}
          >
            24/7 EMERGENCY
          </div>
        )}
        <div className="flex items-start gap-3">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 46, height: 46, background: 'var(--primary-light)', flexShrink: 0, transform: 'translateZ(15px)', boxShadow: '0 4px 14px rgba(14,100,255,0.2)' }}
          >
            <Hospital size={22} color="var(--primary)" />
          </div>
          <div style={{ flex: 1, minWidth: 0, transform: 'translateZ(10px)' }}>
            <h4 style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', marginBottom: 2, fontFamily: 'Outfit, sans-serif' }}>{hospital.name}</h4>
            <span className="badge badge-primary" style={{ fontSize: 10 }}>{hospital.type}</span>
            <div className="flex items-center gap-3 mt-2" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              <span className="flex items-center gap-1"><MapPin size={11} color="var(--primary)" /> {hospital.distance ? `${hospital.distance.toFixed(1)} km` : 'Nearby'}</span>
              <span className="flex items-center gap-1"><Star size={11} color="#f59e0b" fill="#f59e0b" /> {hospital.rating || 4.5}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          <Bed size={13} color="var(--success)" />
          <span>
            <span style={{ color: 'var(--success)', fontWeight: 700 }}>{hospital.beds?.general || 15}</span> General &middot;{' '}
            <span style={{ color: 'var(--warning)', fontWeight: 700 }}>{hospital.beds?.icu || 4}</span> ICU
          </span>
        </div>
      </div>
      <div className="flex gap-2 mt-4" style={{ transform: 'translateZ(15px)' }}>
        <button className="btn btn-outline btn-sm" style={{ flex: 1, fontSize: 11 }} onClick={() => onNavigate(hospital)}>
          <Navigation size={12} /> Navigate
        </button>
        <button className="btn btn-primary btn-sm" style={{ flex: 1, fontSize: 11 }} onClick={() => onViewDetails(hospital)}>
          View Details
        </button>
      </div>
    </motion.div>
  );
}

// Doctor Card Compact Component
function DoctorCardCompact({ doctor, index, onBook }) {
  return (
    <motion.div
      className="card flex flex-col justify-between p-5"
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -5, z: 20, boxShadow: 'var(--shadow-3d-md)' }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      <div style={{ transform: 'translateZ(10px)' }}>
        <div className="flex items-start gap-3">
          <img
            src={doctor.image}
            alt={doctor.name}
            style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid white', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', transform: 'translateZ(15px)' }}
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0e64ff&color=fff`; }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{doctor.name}</h4>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>{doctor.specialization}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1" style={{ fontSize: 11 }}>
                <Star size={10} color="#f59e0b" fill="#f59e0b" />
                <span style={{ fontWeight: 700 }}>{doctor.rating}</span>
              </div>
              <span
                className={doctor.available ? 'badge badge-success' : 'badge badge-warning'}
                style={{ fontSize: 10 }}
              >
                {doctor.available ? 'Available Today' : 'Busy'}
              </span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
          🏥 {doctor.hospital} &middot; {doctor.experience} yrs exp
        </div>
      </div>
      <button
        className="btn btn-primary btn-sm"
        style={{ width: '100%', marginTop: 12, fontSize: 12, transform: 'translateZ(15px)' }}
        onClick={() => onBook(doctor)}
      >
        <Calendar size={12} />
        {doctor.available ? `Book \u20B9${doctor.consultationFee}` : `Next: ${doctor.nextAvailable}`}
      </button>
    </motion.div>
  );
}

// Quick Action Button Component
function QuickAction({ icon: Icon, label, gradient, onClick, index }) {
  return (
    <motion.button
      className="card"
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -6, z: 24, boxShadow: 'var(--shadow-3d-md)' }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 22,
        cursor: 'pointer', border: '1.5px solid var(--border)', transformStyle: 'preserve-3d', perspective: 1000,
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 18, background: gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)', transform: 'translateZ(20px)',
      }}>
        <Icon size={24} color="white" />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center', lineHeight: 1.3, transform: 'translateZ(10px)', fontFamily: 'Outfit, sans-serif' }}>{label}</span>
    </motion.button>
  );
}

// SOS Emergency Modal Component
function SOSModal({ isOpen, onClose, nearbyHospitals, currentLocation }) {
  const displayHospitals = nearbyHospitals?.length > 0 ? nearbyHospitals.slice(0, 4) : HOSPITALS.slice(0, 4);
  const nearestAmbulance = AMBULANCES.find(a => a.status === 'Available');

  const handleCallAmbulance = () => {
    toast.success('Ambulance dispatched! ETA: 4 minutes', { duration: 5000 });
    setTimeout(() => onClose(), 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalOverlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
        >
          <motion.div
            variants={modalPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-card)', borderRadius: 24, width: '100%', maxWidth: 520,
              maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #dc2626, #991b1b)',
              padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <AlertTriangle size={22} color="white" />
                </motion.div>
                <div>
                  <h2 style={{ color: 'white', fontSize: 18, fontWeight: 800, margin: 0 }}>Emergency SOS</h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: 0 }}>
                    Emergency Services near {currentLocation?.city || 'you'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 32, height: 32, borderRadius: '50%', border: 'none',
                  background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Ambulance CTA */}
            <div style={{ padding: '16px 24px', background: 'rgba(220,38,38,0.06)', borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
                    {nearestAmbulance?.type || 'Advanced Life Support Ambulance'}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                    ETA: <strong style={{ color: 'var(--success)' }}>{nearestAmbulance?.eta || 4} min</strong> &middot; {currentLocation?.city || 'Local Area'}
                  </p>
                </div>
                <button className="btn btn-emergency" style={{ fontSize: 13, gap: 6, flexShrink: 0 }} onClick={handleCallAmbulance}>
                  <Phone size={14} /> Call Ambulance
                </button>
              </div>
            </div>

            {/* Hospital List */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '16px 24px' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Emergency Hospitals in {currentLocation?.city || 'your area'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {displayHospitals.slice(0, 4).map((hospital) => (
                  <div key={hospital.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: 14,
                    background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hospital.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                        {hospital.city} &middot; {hospital.distance ? `${hospital.distance.toFixed(1)} km` : 'Nearby'}
                      </p>
                    </div>
                    <div className="flex gap-2" style={{ flexShrink: 0 }}>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: 11, padding: '5px 10px' }}
                        onClick={() => toast.info(`Calling ${hospital.name}...`)}
                      >
                        <Phone size={11} />
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: 11, padding: '5px 10px' }}
                        onClick={() => { window.open(`https://www.openstreetmap.org/?mlat=${hospital.lat}&mlon=${hospital.lng}#map=16/${hospital.lat}/${hospital.lng}`, '_blank'); onClose(); }}
                      >
                        <Navigation size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
              <button
                className="btn btn-outline"
                style={{ flex: 1, fontSize: 13 }}
                onClick={() => toast.info('Calling 112...')}
              >
                <Phone size={14} /> Call 112
              </button>
              <button
                className="btn btn-outline"
                style={{ flex: 1, fontSize: 13 }}
                onClick={() => toast.info('Calling 108 Ambulance...')}
              >
                <Ambulance size={14} /> Dial 108
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const { user } = useAuth();
  const { location, changeCity, detectGpsLocation, weather } = useApp();
  const navigate = useNavigate();

  const [sosOpen, setSosOpen] = useState(false);
  const [changeLocationOpen, setChangeLocationOpen] = useState(false);
  const [tipIndex] = useState(() => Math.floor(Math.random() * HEALTH_TIPS.length));
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Compute location-specific hospital list & counts
  const nearbyHospitals = useMemo(() => {
    if (!location) return HOSPITALS.slice(0, 6);
    const cityNorm = (location.city || '').toLowerCase();
    const cityMatches = HOSPITALS.filter(h => h.city.toLowerCase() === cityNorm);
    if (cityMatches.length > 0) return cityMatches;
    
    // Fallback: sort HOSPITALS by distance from current coordinates
    return hospitalsNearLocation(location.lat, location.lng, HOSPITALS);
  }, [location]);

  // Compute location-specific doctor list & counts
  const nearbyDoctors = useMemo(() => {
    if (!location) return DOCTORS.slice(0, 4);
    const cityNorm = (location.city || '').toLowerCase();
    const cityDocs = DOCTORS.filter(d => d.city.toLowerCase() === cityNorm);
    if (cityDocs.length > 0) return cityDocs;
    
    const stateNorm = (location.state || '').toLowerCase();
    const stateDocs = DOCTORS.filter(d => d.state.toLowerCase() === stateNorm);
    if (stateDocs.length > 0) return stateDocs;

    return DOCTORS.slice(0, 4);
  }, [location]);

  // Compute location-specific ambulance & blood bank counts
  const nearbyAmbulancesCount = useMemo(() => {
    const cityNorm = (location?.city || '').toLowerCase();
    const count = AMBULANCES.filter(a => (a.city || '').toLowerCase() === cityNorm || (a.state || '').toLowerCase() === (location?.state || '').toLowerCase()).length;
    return count > 0 ? count : (nearbyHospitals.length > 0 ? Math.min(nearbyHospitals.length + 1, 8) : 4);
  }, [location, nearbyHospitals]);

  const nearbyBloodBanksCount = useMemo(() => {
    const cityNorm = (location?.city || '').toLowerCase();
    const count = BLOOD_BANKS.filter(b => (b.city || '').toLowerCase() === cityNorm || (b.state || '').toLowerCase() === (location?.state || '').toLowerCase()).length;
    return count > 0 ? count : (nearbyHospitals.length > 0 ? Math.min(nearbyHospitals.length, 6) : 3);
  }, [location, nearbyHospitals]);

  const getGreeting = () => {
    const h = currentTime.getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  const formattedDate = currentTime.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const quickStats = [
    { 
      icon: Hospital,  
      label: 'Nearby Hospitals',      
      value: nearbyHospitals.length, 
      color: '#0e64ff', 
      bg: '#e8f0ff',
      subtitle: `Found in ${location?.city || 'your area'}` 
    },
    { 
      icon: UserCheck, 
      label: 'Available Doctors',    
      value: nearbyDoctors.length,     
      color: '#10b981', 
      bg: '#d1fae5',
      subtitle: `Demo profiles in ${location?.city || 'city'}`
    },
    { 
      icon: Ambulance, 
      label: 'Ambulances Ready',     
      value: nearbyAmbulancesCount,  
      color: '#f59e0b', 
      bg: '#fef3c7',
      subtitle: 'Simulated Availability'
    },
    { 
      icon: Droplets,  
      label: 'Blood Banks',          
      value: nearbyBloodBanksCount, 
      color: '#ef4444', 
      bg: '#fee2e2',
      subtitle: `Available in ${location?.city || 'region'}`
    },
  ];

  const aiSuggestions = [
    { icon: '🩺', label: 'Schedule annual checkup',       action: () => navigate('/appointments') },
    { icon: '❤️', label: 'Monitor blood pressure',         action: () => navigate('/ai-assistant') },
    { icon: '📅', label: 'Book follow-up appointment',    action: () => navigate('/doctors') },
    { icon: '💊', label: 'Medication reminder set',       action: () => toast.success('Reminder set for 8 PM!') },
  ];

  const quickActions = [
    { icon: Hospital,    label: 'Find Hospital',      gradient: 'linear-gradient(135deg,#0e64ff,#0040cc)', path: '/hospitals' },
    { icon: Stethoscope, label: 'Book Doctor',        gradient: 'linear-gradient(135deg,#10b981,#059669)', path: '/doctors' },
    { icon: Ambulance,   label: 'Request Ambulance',  gradient: 'linear-gradient(135deg,#dc2626,#991b1b)', path: '/ambulance' },
    { icon: Droplets,    label: 'Blood Bank',         gradient: 'linear-gradient(135deg,#ef4444,#dc2626)', path: '/blood-bank' },
    { icon: Calendar,    label: 'My Appointments',    gradient: 'linear-gradient(135deg,#7c3aed,#5b21b6)', path: '/appointments' },
    { icon: Bot,         label: 'AI Assistant',       gradient: 'linear-gradient(135deg,#0bbcb8,#0891b2)', path: '/ai-assistant' },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 4px' }}>
      <SOSModal 
        isOpen={sosOpen} 
        onClose={() => setSosOpen(false)} 
        nearbyHospitals={nearbyHospitals}
        currentLocation={location}
      />

      <ChangeLocationModal 
        isOpen={changeLocationOpen}
        onClose={() => setChangeLocationOpen(false)}
        currentLocation={location}
        onChangeCity={changeCity}
        onDetectGps={detectGpsLocation}
      />

      <motion.div variants={staggerContainer} initial="hidden" animate="visible">

        {/* Welcome Banner */}
        <motion.div variants={fadeUp} custom={0} style={{ marginBottom: 24 }}>
          <div style={{
            borderRadius: 24,
            background: 'linear-gradient(135deg, #0e64ff 0%, #0040cc 50%, #7c3aed 100%)',
            padding: '28px 32px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
            <div style={{ position: 'absolute', bottom: -60, right: 80, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ fontSize: 22 }}>👋</span>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: 500 }}>{getGreeting()}</p>
                </div>
                <h1 style={{ color: 'white', fontSize: 32, fontWeight: 800, margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                  {displayName}!
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 6 }}>
                  {formattedDate}
                </p>
                
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <div style={{
                    display: 'flex', itemsCenter: 'center', gap: 6,
                    background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                    borderRadius: 20, padding: '5px 14px', fontSize: 12, color: 'white',
                  }}>
                    <CheckCircle size={13} color="#4ade80" />
                    All systems operational
                  </div>
                  
                  {/* Clickable Location Chip */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChangeLocationOpen(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)',
                      borderRadius: 20, padding: '5px 14px', fontSize: 12, color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    <MapPin size={13} />
                    {location?.formattedLocation || `${location?.city}, ${location?.state}`}
                    <ChevronRight size={13} />
                  </motion.button>
                </div>
              </div>

              {/* SOS Pulsing Button */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ position: 'relative' }}>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    style={{
                      position: 'absolute', inset: -12, borderRadius: '50%',
                      background: '#ff3333', zIndex: 0,
                    }}
                  />
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
                    style={{
                      position: 'absolute', inset: -6, borderRadius: '50%',
                      background: '#ff5555', zIndex: 0,
                    }}
                  />
                  <motion.button
                    className="sos-button"
                    onClick={() => setSosOpen(true)}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ position: 'relative', zIndex: 1 }}
                  >
                    <AlertTriangle size={22} />
                    SOS
                  </motion.button>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 500 }}>Emergency</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Row */}
        <motion.div
          variants={staggerContainer}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}
        >
          {quickStats.map((s, i) => (
            <StatCard key={s.label} {...s} index={i} />
          ))}
        </motion.div>

        {/* AI Suggestions + Weather/Health Tip */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }} className="db-two-col">

          {/* AI Suggestions */}
          <motion.div variants={fadeUp} custom={1}>
            <div className="card" style={{ height: '100%' }}>
              <div className="flex items-center gap-3 mb-4">
                <div style={{
                  width: 40, height: 40, borderRadius: 13,
                  background: 'linear-gradient(135deg,#0bbcb8,#0891b2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Sparkles size={18} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>AI Health Suggestions</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Personalized for {location?.city || 'you'}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {aiSuggestions.map((s, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={s.action}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '11px 14px', borderRadius: 12, border: '1px solid var(--border)',
                      background: 'var(--bg-primary)', cursor: 'pointer', width: '100%',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                      <span style={{ fontSize: 18 }}>{s.icon}</span>
                      {s.label}
                    </span>
                    <ChevronRight size={15} color="var(--text-muted)" />
                  </motion.button>
                ))}
              </div>
              <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 12, background: 'var(--primary-light)', border: '1px solid rgba(14,100,255,0.1)' }}>
                <p style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 500 }}>
                  <Brain size={13} style={{ display: 'inline', marginRight: 5 }} />
                  AI analyzed conditions in {location?.city || 'your area'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Weather + Health Tip */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <motion.div variants={fadeUp} custom={2}>
              <div style={{
                borderRadius: 20, padding: 22,
                background: 'linear-gradient(135deg, rgba(14,100,255,0.08), rgba(11,188,184,0.08))',
                border: '1px solid rgba(14,100,255,0.12)',
                backdropFilter: 'blur(10px)',
              }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={13} color="var(--primary)" />
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {weather?.city ? `${weather.city}, ${weather.state}` : `${location?.city}, ${location?.state}`}
                      </p>
                    </div>
                    <div className="flex items-end gap-2">
                      <span style={{ fontSize: 44, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, fontFamily: 'Outfit, sans-serif' }}>
                        {weather?.temp !== undefined ? weather.temp : 26}&deg;
                      </span>
                      <span style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 5 }}>C</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 500 }}>
                      {weather?.condition || 'Partly Cloudy'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 52, lineHeight: 1 }}>{weather?.icon || '⛅'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <span>💧 Humidity: 68%</span>
                      <span>💨 Wind: 12 km/h</span>
                      <span>☀️ UV Index: Moderate</span>
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex', gap: 8, marginTop: 14,
                  padding: '9px 12px', borderRadius: 11,
                  background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                }}>
                  <AlertTriangle size={13} color="var(--warning)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    Weather updated for {location?.city || 'current location'}. Stay hydrated.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={3}>
              <div style={{
                borderRadius: 20, padding: 22,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ position: 'absolute', bottom: -30, left: 40, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div className="flex items-center gap-2 mb-3" style={{ position: 'relative' }}>
                  <Heart size={16} color="white" fill="rgba(255,255,255,0.4)" />
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Today's Health Tip
                  </p>
                </div>
                <p style={{ fontSize: 14, color: 'white', fontWeight: 600, lineHeight: 1.6, position: 'relative', margin: 0 }}>
                  {HEALTH_TIPS[tipIndex]}
                </p>
                <button
                  onClick={() => toast.success('Health reminder set!')}
                  style={{
                    marginTop: 14, background: 'rgba(255,255,255,0.2)', border: 'none',
                    borderRadius: 10, padding: '7px 16px', color: 'white', fontSize: 12,
                    fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                    position: 'relative',
                  }}
                >
                  <Bell size={13} /> Set Reminder
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Nearby Hospitals */}
        <motion.div variants={fadeUp} custom={2} style={{ marginBottom: 24 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                Hospitals in {location?.city || 'Your Area'}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                Showing hospitals in {location?.city || 'current city'} &middot; {location?.state || 'India'}
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/hospitals')} style={{ fontSize: 13, color: 'var(--primary)' }}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <motion.div
            variants={staggerContainer}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}
          >
            {nearbyHospitals.slice(0, 3).map((h, i) => (
              <HospitalCardCompact
                key={h.id}
                hospital={h}
                index={i}
                onNavigate={(hosp) => window.open(`https://www.openstreetmap.org/?mlat=${hosp.lat}&mlon=${hosp.lng}#map=16/${hosp.lat}/${hosp.lng}`, '_blank')}
                onCall={(phone) => toast.success(`Calling ${phone}`)}
                onViewDetails={(hosp) => navigate('/hospitals/' + hosp.id)}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Available Doctors */}
        <motion.div variants={fadeUp} custom={3} style={{ marginBottom: 24 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                Available Doctors in {location?.city || 'Your Area'}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                Demo Doctor Profiles for {location?.city || 'current location'}
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/doctors')} style={{ fontSize: 13, color: 'var(--primary)' }}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <motion.div
            variants={staggerContainer}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}
          >
            {nearbyDoctors.slice(0, 3).map((d, i) => (
              <DoctorCardCompact
                key={d.id}
                doctor={d}
                index={i}
                onBook={(doc) => {
                  toast.success(`Booked demo appointment with ${doc.name}`);
                  navigate('/appointments');
                }}
              />
            ))}
          </motion.div>
        </motion.div>



        {/* Quick Actions Grid */}
        <motion.div variants={fadeUp} custom={4} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            {quickActions.map((qa, i) => (
              <QuickAction
                key={qa.label}
                {...qa}
                index={i}
                onClick={() => navigate(qa.path)}
              />
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
