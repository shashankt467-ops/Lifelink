import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, MapPin, Clock, Bed, Star, CheckCircle, AlertTriangle, Sparkles, ChevronDown, Locate, X, Navigation, Building2, Activity, Phone, CheckCircle2, ChevronUp
} from 'lucide-react';
import { HOSPITALS, MEDICAL_CONDITIONS, SPECIALIZATIONS, CITY_COORDS, INDIA_STATES, CITIES_BY_STATE } from '../data/mockData';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const URGENCY_OPTIONS = [
  { value: 'normal', label: 'Normal', desc: 'Routine or non-urgent', color: '#0e64ff', bg: 'rgba(14,100,255,0.08)', border: 'rgba(14,100,255,0.3)', emoji: '🟢' },
  { value: 'urgent', label: 'Urgent', desc: 'Needs attention soon', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', emoji: '🟡' },
  { value: 'critical', label: 'Critical', desc: 'Life-threatening emergency', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.3)', emoji: '🔴' },
];

const ReasonChip = ({ text }) => (
  <div className="flex items-center gap-2" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
    <CheckCircle2 size={14} color="#10b981" style={{ flexShrink: 0 }} />
    {text}
  </div>
);

const scoreHospital = (hospital, userLat, userLng, condition, specialist, urgency) => {
  let dist = hospital.distance;
  if (userLat && userLng) {
    const R = 6371;
    const dLat = ((hospital.lat - userLat) * Math.PI) / 180;
    const dLon = ((hospital.lng - userLng) * Math.PI) / 180;
    const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
      Math.cos(userLat*Math.PI/180)*Math.cos(hospital.lat*Math.PI/180)*
      Math.sin(dLon/2)*Math.sin(dLon/2);
    dist = parseFloat((6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1));
  }
  const eta = Math.round((dist / 30) * 60);
  
  let score = 0;
  score += Math.max(0, 25 - dist * 1.5);
  score += (hospital.beds.icu / Math.max(hospital.icuBeds?.total || 10, 1)) * 20;
  score += Math.min(15, (hospital.beds.general + hospital.beds.icu) / 5);
  if (hospital.emergency) score += 15;
  score += (hospital.rating / 5) * 15;
  score += Math.max(0, 10 - hospital.waitTime / 6);
  if (specialist && hospital.specialists.some(s => s.toLowerCase().includes(specialist.toLowerCase()))) score += 12;
  if (urgency === 'critical') { score = dist < 5 ? score * 1.3 : score * 0.7; }
  if (urgency === 'urgent') { score = score * (hospital.emergency ? 1.15 : 0.9); }
  
  const reasons = [];
  if (dist < 5) reasons.push(`✓ Only ${dist}km away (${eta} min ETA)`);
  if (hospital.beds.icu > 5) reasons.push(`✓ ${hospital.beds.icu} ICU beds available (simulated)`);
  if (hospital.emergency) reasons.push('✓ 24/7 Emergency department');
  if (hospital.rating >= 4.7) reasons.push(`✓ Highly rated: ${hospital.rating}/5`);
  if (hospital.waitTime < 25) reasons.push(`✓ Short wait (~${hospital.waitTime} min)`);
  if (specialist && hospital.specialists.some(s => s.toLowerCase().includes(specialist.toLowerCase()))) 
    reasons.push(`✓ ${specialist} available`);
  if (reasons.length === 0) reasons.push(`✓ ${dist}km away, ${eta} min ETA`);
  
  return { ...hospital, aiScore: Math.min(99, Math.round(score)), distance: dist, eta, reasons };
};

const TopCard = ({ hospital, rank }) => {
  const navigate = useNavigate();
  const color = rank === 0 ? '#f59e0b' : rank === 1 ? '#94a3b8' : '#cd7c3a';
  const label = rank === 0 ? '🏆 AI Recommended #1' : rank === 1 ? '🥈 Runner Up #2' : '🥉 Alternative #' + (rank + 1);
  const score = hospital.aiScore || hospital.score;
  const ringColor = score >= 90 ? '#10b981' : score >= 75 ? '#0e64ff' : '#f59e0b';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.15 }}
      className="card p-5 mb-4"
      style={rank === 0 ? { border: '2px solid rgba(245,158,11,0.4)', background: 'linear-gradient(135deg, rgba(245,158,11,0.03), var(--bg-card))' } : {}}>

      <div className="flex items-start gap-4">
        {/* Score Ring */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div style={{ position: 'relative', width: 72, height: 72 }}>
            <svg width={72} height={72} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={36} cy={36} r={28} fill="none" stroke="var(--border)" strokeWidth={7} />
              <motion.circle cx={36} cy={36} r={28} fill="none" stroke={ringColor} strokeWidth={7}
                strokeLinecap="round" strokeDasharray={175.9}
                initial={{ strokeDashoffset: 175.9 }}
                animate={{ strokeDashoffset: 175.9 - (score / 100) * 175.9 }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: rank * 0.15 + 0.3 }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: ringColor, lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>/ 100</span>
            </div>
          </div>
          <span style={{ fontSize: 10, fontWeight: 600, color }}>AI Score</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span style={{ fontSize: 11, fontWeight: 700, color, padding: '2px 8px', background: `${color}15`, borderRadius: 6, border: `1px solid ${color}30` }}>
              {label}
            </span>
          </div>
          <h3 className="font-display font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{hospital.name}</h3>
          <div className="flex items-center gap-3 mb-3">
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {hospital.distance} km</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>⏱ {hospital.eta} min ETA</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>🛏 {hospital.beds.general + hospital.beds.icu} beds free</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>🏙 {hospital.city}, {hospital.state}</span>
          </div>
          <div className="mb-2">
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Why this hospital?</span>
          </div>
          <div className="flex flex-col gap-1.5 mb-4">
            {(hospital.reasons || []).slice(0,4).map((r, i) => (
              <ReasonChip key={i} text={r} />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`, '_blank')} className="btn btn-outline btn-sm">
              <Navigation size={12} /> Navigate
            </button>
            <button onClick={() => navigate('/doctors')} className="btn btn-primary btn-sm">
              <Phone size={12} /> Book Appointment
            </button>
            {rank === 0 && (
              <button className="btn btn-emergency btn-sm">
                <Activity size={12} /> Go Now
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AlgoAccordion = () => {
  const [open, setOpen] = useState(false);
  const factors = [
    { label: 'Distance (25%)', desc: 'Closer hospitals score higher to minimize response time' },
    { label: 'ICU Availability (20%)', desc: 'Proportion of available ICU beds vs total capacity' },
    { label: 'Bed Availability (15%)', desc: 'Total free beds across general, ICU, and emergency' },
    { label: 'Emergency Services (15%)', desc: 'Whether the hospital has 24/7 emergency departments' },
    { label: 'Patient Rating (15%)', desc: 'Community ratings and reviews from past patients' },
    { label: 'Wait Time (10%)', desc: 'Estimated waiting time adjusted for urgency level' },
  ];
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4"
        style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <div className="flex items-center gap-2">
          <Brain size={16} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>How does AI scoring work?</span>
        </div>
        {open ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
            <div className="px-4 pb-4">
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
                Our AI algorithm scores hospitals based on 6 weighted factors to find your best match:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 10 }}>
                {factors.map(f => (
                  <div key={f.label} className="p-3 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', marginBottom: 3 }}>{f.label}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { useApp } from '../context/AppContext';

export default function AIRecommendation() {
  const { location } = useApp();
  const [form, setForm] = useState({ condition: '', specialist: '', urgency: 'normal' });
  const [userLocation, setUserLocation] = useState(location ? { lat: location.lat, lng: location.lng } : null);
  const [selectedCity, setSelectedCity] = useState(location?.city || '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [locationStatus, setLocationStatus] = useState(location?.source === 'gps' ? 'success' : 'idle');

  const handleGetLocation = () => {
    setLocationStatus('loading');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setLocationStatus('success');
          setSelectedCity('');
        },
        error => {
          toast.error('Could not get location.');
          setLocationStatus('error');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
      setLocationStatus('error');
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    if (city && CITY_COORDS && CITY_COORDS[city]) {
      setUserLocation(CITY_COORDS[city]);
      setLocationStatus('idle');
    } else {
      setUserLocation(null);
    }
  };

  const handleGetRecommendation = async (e) => {
    e.preventDefault();
    if (!form.condition) { toast.error('Please select a medical condition'); return; }
    setLoading(true);
    setResults(null);
    await new Promise(r => setTimeout(r, 1500)); // simulate AI
    const userLat = userLocation?.lat;
    const userLng = userLocation?.lng;
    const scored = HOSPITALS
      .map(h => scoreHospital(h, userLat, userLng, form.condition, form.specialist, form.urgency))
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 5);
    setResults(scored);
    setLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 24, alignItems: 'start' }}
        className="flex-col md:grid-cols-none">

        {/* Left: Form */}
        <div className="card p-6 sticky top-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
              <Brain size={20} color="white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>AI Recommendation</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Find your best hospital match</p>
            </div>
          </div>

          <form onSubmit={handleGetRecommendation}>
            {/* Location Section */}
            <div className="mb-4">
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                Your Location
              </label>
              <div className="flex flex-col gap-2 mb-2">
                <button type="button" onClick={handleGetLocation} className="btn btn-outline flex items-center justify-center gap-2" style={{ padding: '8px 12px' }}>
                  <Locate size={14} /> Detect My Location
                </button>
                <div className="text-center" style={{ fontSize: 12, color: 'var(--text-muted)' }}>OR</div>
                <select className="input" value={selectedCity} onChange={e => handleCitySelect(e.target.value)}>
                  <option value="">Select a city...</option>
                  {CITY_COORDS && Object.keys(CITY_COORDS).map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {locationStatus === 'loading' && 'Detecting location...'}
                {locationStatus === 'success' && <span className="text-green-500">✓ Using GPS location</span>}
                {selectedCity && <span className="text-blue-500">Using: {selectedCity}</span>}
                {!userLocation && locationStatus !== 'loading' && 'No location set'}
              </div>
            </div>

            {/* Medical Condition */}
            <div className="mb-4">
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                Medical Condition / Emergency
              </label>
              <select className="input" value={form.condition}
                onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}>
                <option value="">Select condition…</option>
                {MEDICAL_CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Specialist */}
            <div className="mb-5">
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                Required Specialist (optional)
              </label>
              <select className="input" value={form.specialist}
                onChange={e => setForm(f => ({ ...f, specialist: e.target.value }))}>
                <option value="">Any specialist</option>
                {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Urgency */}
            <div className="mb-6">
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                Urgency Level
              </label>
              <div className="flex flex-col gap-2">
                {URGENCY_OPTIONS.map(opt => (
                  <label key={opt.value} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                    style={{
                      background: form.urgency === opt.value ? opt.bg : 'var(--bg-primary)',
                      border: `1.5px solid ${form.urgency === opt.value ? opt.border : 'var(--border)'}`,
                    }}>
                    <input type="radio" name="urgency" value={opt.value} checked={form.urgency === opt.value}
                      onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))} style={{ display: 'none' }} />
                    <span style={{ fontSize: 16 }}>{opt.emoji}</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: form.urgency === opt.value ? opt.color : 'var(--text-primary)' }}>{opt.label}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing…</>
                : <><Sparkles size={16} /> Get AI Recommendation</>
              }
            </button>
          </form>
        </div>

        {/* Right: Results */}
        <div>
          {!results && !loading && (
            <div className="card p-12 text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(168,85,247,0.1))' }}>
                <Brain size={40} style={{ color: '#7c3aed' }} />
              </div>
              <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>AI-Powered Hospital Matching</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 360, margin: '0 auto', lineHeight: 1.7 }}>
                Select your condition and urgency level. Our AI will analyze 6 factors across all nearby hospitals to find your best match.
              </p>
            </div>
          )}

          {loading && (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                <Brain size={28} color="white" className="animate-pulse" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>AI is analyzing hospitals…</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
                Evaluating distance, bed availability, ICU capacity, ratings, and specialist availability
              </p>
              <div className="flex flex-col gap-2 max-w-xs mx-auto">
                {['Fetching hospital data…', 'Calculating distance scores…', 'Evaluating bed availability…', 'Computing final rankings…'].map((s, i) => (
                  <motion.div key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.35 }}
                    className="flex items-center gap-2 text-left p-2 rounded-lg"
                    style={{ background: 'var(--bg-primary)', fontSize: 13 }}>
                    <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin flex-shrink-0" />
                    <span style={{ color: 'var(--text-secondary)' }}>{s}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {results && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} style={{ color: '#f59e0b' }} />
                <h2 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                  AI Recommendations — {results.length} hospitals ranked
                </h2>
              </div>
              {results.slice(0, 5).map((h, i) => <TopCard key={h.id} hospital={h} rank={i} />)}
              <div className="mt-6">
                <AlgoAccordion />
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 24 }}>
                ⚠ Demo data — For presentation purposes only
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
