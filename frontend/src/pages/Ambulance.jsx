import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ambulance as AmbulanceIcon, Phone, MapPin, Clock, X,
  Star, AlertTriangle, CheckCircle, ChevronRight, Zap
} from 'lucide-react';
import { AMBULANCES, HOSPITALS } from '../data/mockData';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const TYPE_COLORS = {
  'Advanced Life Support': { color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
  'Basic Life Support': { color: '#0e64ff', bg: 'rgba(14,100,255,0.1)' },
  'Cardiac Ambulance': { color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
  'Neonatal Ambulance': { color: '#0bbcb8', bg: 'rgba(11,188,184,0.1)' },
  'Patient Transport': { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
};

const TRACKING_STEPS = ['Searching', 'Assigned', 'Arriving', 'Picked Up', 'At Hospital'];

const RequestModal = ({ ambulance, onClose, onBooked }) => {
  const [form, setForm] = useState({ pickup: '', hospital: '', condition: '' });
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    if (!form.pickup) { toast.error('Please enter pickup location'); return; }
    setLoading(true);
    try {
      const res = await api.ambulances.request(form.pickup, form.hospital);
      toast.success(`🚑 Ambulance ${res.data.code} dispatched! ETA: ${ambulance.eta} min`);
      onBooked(res.data);
    } catch { toast.error('No ambulances available'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }} className="modal">
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Request Ambulance</h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={18} /></button>
        </div>
        <div className="p-6">
          {/* Ambulance Info */}
          <div className="p-4 rounded-xl mb-5" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: TYPE_COLORS[ambulance.type]?.bg || 'var(--primary-light)' }}>
                <AmbulanceIcon size={18} style={{ color: TYPE_COLORS[ambulance.type]?.color || 'var(--primary)' }} />
              </div>
              <div>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{ambulance.type}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ambulance.code} · {ambulance.distance} km · ETA {ambulance.eta} min</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-5">
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Pickup Location *</label>
              <div className="input-group">
                <MapPin size={15} className="input-icon" />
                <input className="input" value={form.pickup} onChange={e => setForm(f => ({ ...f, pickup: e.target.value }))}
                  placeholder="Enter your current address…" />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Destination Hospital</label>
              <select className="input" value={form.hospital} onChange={e => setForm(f => ({ ...f, hospital: e.target.value }))}>
                <option value="">Select hospital (AI will choose nearest)</option>
                {HOSPITALS.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Patient Condition</label>
              <textarea className="input" rows={3} value={form.condition}
                onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
                placeholder="Briefly describe the emergency…" style={{ resize: 'none' }} />
            </div>
          </div>

          <button onClick={handleRequest} disabled={loading} className="btn btn-emergency w-full btn-lg">
            {loading
              ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><AmbulanceIcon size={18} /> Confirm Request</>
            }
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const TrackingView = ({ booking, onClose }) => {
  const [step] = useState(2); // 'Arriving' for demo

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="card p-6 mb-6" style={{ border: '2px solid rgba(14,100,255,0.3)', background: 'linear-gradient(135deg,rgba(14,100,255,0.03),var(--bg-card))' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <AmbulanceIcon size={18} color="white" />
          </div>
          <div>
            <p className="font-display font-bold" style={{ fontSize: 15, color: 'var(--text-primary)' }}>Ambulance En Route</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Booking ID: {booking.bookingId}</p>
          </div>
        </div>
        <div className="text-right">
          <p style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--primary)' }}>{booking.estimatedArrival} min</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>ETA</p>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="flex items-center justify-between mb-5">
        {TRACKING_STEPS.map((s, i) => (
          <div key={s} className="flex flex-col items-center" style={{ flex: 1 }}>
            <div className="flex items-center w-full">
              {i > 0 && <div style={{ flex: 1, height: 2, background: i <= step ? 'var(--primary)' : 'var(--border)', transition: 'all 0.5s' }} />}
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: i <= step ? (i === step ? 'var(--primary)' : '#10b981') : 'var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: i === step ? '0 0 0 4px rgba(14,100,255,0.2)' : 'none',
                transition: 'all 0.5s',
              }}>
                {i < step
                  ? <CheckCircle size={14} color="white" />
                  : i === step
                    ? <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    : <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--text-muted)' }} />
                }
              </div>
              {i < TRACKING_STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? '#10b981' : 'var(--border)', transition: 'all 0.5s' }} />}
            </div>
            <p style={{ fontSize: 10, color: i <= step ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: i === step ? 700 : 400, marginTop: 6, textAlign: 'center' }}>{s}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={() => toast.success('Calling driver…')} className="btn btn-outline flex-1">
          <Phone size={15} /> Call Driver
        </button>
        <button onClick={onClose} className="btn btn-ghost flex-1">Dismiss</button>
      </div>
    </motion.div>
  );
};

import { useApp } from '../context/AppContext';

export default function Ambulance() {
  const { location } = useApp();
  const [filter, setFilter] = useState('All');
  const [requesting, setRequesting] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);

  const filtered = AMBULANCES.filter(a => {
    if (filter !== 'All' && !a.type.includes(filter)) return false;
    return true;
  });

  return (
    <div className="animate-fade-in">
      {/* Emergency Banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl mb-6"
        style={{ background: 'linear-gradient(135deg,rgba(220,38,38,0.12),rgba(239,68,68,0.06))', border: '1.5px solid rgba(220,38,38,0.3)' }}>
        <AlertTriangle size={20} color="#dc2626" style={{ flexShrink: 0 }} />
        <div className="flex-1">
          <p style={{ fontSize: 14, fontWeight: 700, color: '#dc2626' }}>Need Emergency Ambulance?</p>
          <p style={{ fontSize: 13, color: '#ef4444' }}>Call the national emergency number immediately</p>
        </div>
        <a href="tel:108" className="btn btn-sm" style={{ background: '#dc2626', color: 'white', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
          📞 Call 108
        </a>
      </div>

      {/* Active Booking */}
      <AnimatePresence>
        {activeBooking && <TrackingView booking={activeBooking} onClose={() => setActiveBooking(null)} />}
      </AnimatePresence>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['All', 'Advanced', 'Basic', 'Cardiac', 'Neonatal'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="btn btn-sm whitespace-nowrap"
            style={{
              background: filter === f ? 'linear-gradient(135deg,#0e64ff,#0040cc)' : 'var(--bg-card)',
              color: filter === f ? 'white' : 'var(--text-secondary)',
              border: `1.5px solid ${filter === f ? '#0e64ff' : 'var(--border)'}`,
            }}>
            {f}
          </button>
        ))}
      </div>

      {/* Ambulance Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {filtered.map((amb, i) => {
          const typeStyle = TYPE_COLORS[amb.type] || { color: '#0e64ff', bg: 'rgba(14,100,255,0.1)' };
          return (
            <motion.div key={amb.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} whileHover={{ y: -3 }} className="card p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: typeStyle.bg }}>
                    <AmbulanceIcon size={18} style={{ color: typeStyle.color }} />
                  </div>
                  <div>
                    <p className="font-display font-bold" style={{ fontSize: 14, color: 'var(--text-primary)' }}>{amb.type}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{amb.code}</p>
                  </div>
                </div>
                <span className={`badge ${amb.status === 'Available' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 11 }}>
                  {amb.status}
                </span>
              </div>

              {/* Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{amb.distance} km away</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} style={{ color: 'var(--secondary)' }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{amb.eta} min ETA</span>
                </div>
              </div>

              {/* Hospital + Driver */}
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>
                From: <strong style={{ color: 'var(--text-secondary)' }}>{amb.hospital}</strong>
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                Driver: <strong style={{ color: 'var(--text-secondary)' }}>{amb.driver}</strong> · {amb.driverPhone}
              </p>

              {/* Equipment */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {amb.equipped.map(eq => (
                  <span key={eq} className="tag" style={{ fontSize: 10, padding: '2px 8px' }}>{eq}</span>
                ))}
              </div>

              <button onClick={() => setRequesting(amb)} disabled={amb.status !== 'Available'}
                className="btn w-full" style={{
                  background: amb.status === 'Available' ? 'linear-gradient(135deg,#dc2626,#ef4444)' : 'var(--border)',
                  color: amb.status === 'Available' ? 'white' : 'var(--text-muted)',
                  fontSize: 13,
                }}>
                <Zap size={14} />
                {amb.status === 'Available' ? 'Request Ambulance' : 'Currently Unavailable'}
              </button>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {requesting && (
          <RequestModal ambulance={requesting} onClose={() => setRequesting(null)}
            onBooked={(booking) => { setActiveBooking(booking); setRequesting(null); }} />
        )}
      </AnimatePresence>
    </div>
  );
}
