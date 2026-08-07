import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bed, Activity, RefreshCw, Filter, Star, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { HOSPITALS } from '../data/mockData';

const getAvailColor = (pct) => pct > 30 ? '#10b981' : pct > 10 ? '#f59e0b' : '#ef4444';

const CircleGauge = ({ value, total, color, label, size = 70 }) => {
  const pct = total ? Math.min(100, Math.round((value / total) * 100)) : 0;
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const fillColor = getAvailColor(pct);
  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={7} />
          <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7}
            strokeLinecap="round" strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (pct / 100) * circ }}
            transition={{ duration: 1, ease: 'easeOut' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 16, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: fillColor, lineHeight: 1 }}>{value}</span>
          <span style={{ fontSize: 8, color: 'var(--text-muted)' }}>/ {total}</span>
        </div>
      </div>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
    </div>
  );
};

const BedCard = ({ hospital, index, onNavigate, onBook }) => {
  const genPct = Math.round((hospital.beds.general / Math.max(hospital.beds.total / 4, 1)) * 100);
  const icuPct = Math.round((hospital.beds.icu / Math.max(hospital.icuBeds.total, 1)) * 100);
  const emgPct = Math.round((hospital.beds.emergency / Math.max(hospital.beds.emergency + 10, 1)) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }} whileHover={{ y: -2 }} className="card p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center gap-2 mb-1">
            {hospital.emergency && (
              <div className="avail-dot high" />
            )}
            <h3 className="font-display font-bold" style={{ fontSize: 15, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hospital.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-primary" style={{ fontSize: 11 }}>{hospital.type}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{hospital.city}, {hospital.state}</span>
          </div>
        </div>
        <div className="text-right" style={{ flexShrink: 0 }}>
          <div className="flex items-center gap-1">
            <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{hospital.rating}</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{hospital.reviewCount?.toLocaleString()} reviews</p>
        </div>
      </div>

      {/* Demo Data Notice */}
      <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 12, padding: '4px 10px', background: 'rgba(245,158,11,0.08)', borderRadius: 8, border: '1px solid rgba(245,158,11,0.2)' }}>
        ⚠ Simulated availability — not real-time data
      </div>

      {/* Circular Gauges */}
      <div className="flex justify-around mb-5">
        <CircleGauge value={hospital.beds.general} total={Math.max(hospital.beds.total / 4, 1)} color={getAvailColor(genPct)} label="General" />
        <CircleGauge value={hospital.beds.icu} total={Math.max(hospital.icuBeds.total, 1)} color={getAvailColor(icuPct)} label="ICU" />
        <CircleGauge value={hospital.beds.emergency} total={Math.max(hospital.beds.emergency + 10, 1)} color={getAvailColor(emgPct)} label="Emergency" />
      </div>

      {/* Detail bars */}
      <div className="flex flex-col gap-3 mb-5">
        {[
          { label: 'General Beds', count: hospital.beds.general, total: Math.round(hospital.beds.total / 4), color: '#0e64ff', pct: genPct },
          { label: 'ICU Beds', count: hospital.beds.icu, total: hospital.icuBeds.total, color: '#7c3aed', pct: icuPct },
          { label: 'Emergency Beds', count: hospital.beds.emergency, total: hospital.beds.emergency + 10, color: '#dc2626', pct: emgPct },
        ].map(b => (
          <div key={b.label}>
            <div className="flex justify-between mb-1">
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{b.label}</span>
              <div className="flex items-center gap-2">
                <div className="avail-dot" style={{ background: getAvailColor(b.pct), boxShadow: `0 0 5px ${getAvailColor(b.pct)}` }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {b.count} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>of ~{b.total} total</span>
                </span>
              </div>
            </div>
            <div className="progress-bar">
              <motion.div className="progress-fill" initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, b.pct)}%` }} transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                style={{ background: `linear-gradient(90deg, ${b.color}, ${b.color}aa)` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="btn btn-outline btn-sm flex-1" style={{ fontSize: 12 }} onClick={() => onNavigate(hospital)}>
          <MapPin size={12} /> Navigate
        </button>
        <button className="btn btn-primary btn-sm flex-1" style={{ fontSize: 12 }} onClick={() => onBook(hospital)}>
          <Bed size={12} /> Book Bed
        </button>
      </div>
    </motion.div>
  );
};

import { useApp } from '../context/AppContext';
import { INDIA_STATES, CITIES_BY_STATE } from '../data/mockData';

export default function BedAvailability() {
  const { location } = useApp();
  const [filter, setFilter] = useState('all');
  const [selectedState, setSelectedState] = useState(location?.state || '');
  const [selectedCity, setSelectedCity] = useState(location?.city || '');
  const [lastUpdate] = useState('2 minutes ago');

  const cityHospitals = HOSPITALS.filter(h => {
    if (selectedState && h.state !== selectedState) return false;
    if (selectedCity && h.city !== selectedCity) return false;
    return true;
  });

  const activeHospitals = cityHospitals.length > 0 ? cityHospitals : HOSPITALS;

  const totalGeneral = activeHospitals.reduce((s, h) => s + h.beds.general, 0);
  const totalICU = activeHospitals.reduce((s, h) => s + h.beds.icu, 0);
  const totalEmergency = activeHospitals.reduce((s, h) => s + h.beds.emergency, 0);
  const withAvailability = activeHospitals.filter(h => h.beds.general + h.beds.icu > 0).length;

  const filtered = activeHospitals.filter(h => {
    if (filter === 'icu') return h.beds.icu > 0;
    if (filter === 'emergency') return h.beds.emergency > 0;
    return true;
  });

  const STATS = [
    { label: 'General Beds', value: totalGeneral, color: '#0e64ff', bg: 'rgba(14,100,255,0.08)', icon: Bed, suffix: 'available' },
    { label: 'ICU Beds', value: totalICU, color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', icon: Activity, suffix: 'available' },
    { label: 'Emergency Beds', value: totalEmergency, color: '#dc2626', bg: 'rgba(220,38,38,0.08)', icon: Activity, suffix: 'available' },
    { label: 'Hospitals', value: withAvailability, color: '#10b981', bg: 'rgba(16,185,129,0.08)', icon: Bed, suffix: 'with beds' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Live Indicator */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="avail-dot high" style={{ animation: 'sos-pulse 2s infinite' }} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Live data — Updated {lastUpdate}</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => {}}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} className="stat-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                  <Icon size={17} style={{ color: stat.color }} />
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stat.label}</p>
              </div>
              <p className="font-display font-bold" style={{ fontSize: 30, color: stat.color, lineHeight: 1 }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{stat.suffix}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[{ val: 'all', label: 'All Hospitals' }, { val: 'icu', label: 'ICU Available' }, { val: 'emergency', label: 'Emergency Available' }].map(t => (
          <button key={t.val} onClick={() => setFilter(t.val)}
            className="btn btn-sm" style={{
              background: filter === t.val ? 'linear-gradient(135deg,#0e64ff,#0040cc)' : 'var(--bg-card)',
              color: filter === t.val ? 'white' : 'var(--text-secondary)',
              border: `1.5px solid ${filter === t.val ? '#0e64ff' : 'var(--border)'}`,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Hospital Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
        {filtered.map((h, i) => (
          <BedCard 
            key={h.id} 
            hospital={h} 
            index={i}
            onNavigate={(hosp) => window.open('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(hosp.name + ' ' + hosp.address), '_blank')}
            onBook={(hosp) => toast.success(`Demo bed booking request sent to ${hosp.name}`)}
          />
        ))}
      </div>
    </div>
  );
}
