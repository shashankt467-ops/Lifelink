import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, MapPin, Clock, Phone, X, AlertTriangle, Building2 } from 'lucide-react';
import { BLOOD_BANKS } from '../data/mockData';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const RequestModal = ({ bank, bloodType, onClose }) => {
  const [form, setForm] = useState({ name: '', contact: '', units: 1, urgency: 'normal' });
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    if (!form.name || !form.contact) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      await api.bloodBank.requestBlood(bank.id, bloodType, form.units);
      toast.success(`Blood request submitted! ${bank.name} will contact you shortly.`);
      onClose();
    } catch { toast.error('Request failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }} className="modal">
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Request Blood</h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={18} /></button>
        </div>
        <div className="p-6">
          <div className="p-4 rounded-xl mb-5" style={{ background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.1)' }}>
                <Droplets size={18} color="#dc2626" />
              </div>
              <div>
                <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{bloodType} Blood — {bank.name}</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{bank.inventory[bloodType]} units available</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 mb-5">
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Patient Name</label>
              <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name of patient" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Contact Number</label>
              <input className="input" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Units Required</label>
              <input type="number" min={1} max={10} className="input" value={form.units} onChange={e => setForm(f => ({ ...f, units: Number(e.target.value) }))} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Urgency</label>
              <select className="input" value={form.urgency} onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))}>
                <option value="normal">Normal (Within 24 hrs)</option>
                <option value="urgent">Urgent (Within 4 hrs)</option>
                <option value="critical">Critical (Immediately)</option>
              </select>
            </div>
          </div>
          <button onClick={handleRequest} disabled={loading} className="btn w-full btn-lg"
            style={{ background: 'linear-gradient(135deg,#dc2626,#ef4444)', color: 'white' }}>
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Droplets size={16} /> Submit Blood Request</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

import { useApp } from '../context/AppContext';

export default function BloodBank() {
  const { location } = useApp();
  const [selectedType, setSelectedType] = useState('');
  const [requestBank, setRequestBank] = useState(null);

  const cityBanks = BLOOD_BANKS.filter(b => {
    if (location?.city && b.city.toLowerCase() === location.city.toLowerCase()) return true;
    if (location?.state && b.state.toLowerCase() === location.state.toLowerCase()) return true;
    return false;
  });

  const activeBanks = cityBanks.length > 0 ? cityBanks : BLOOD_BANKS;

  const filtered = activeBanks.filter(b => !selectedType || (b.inventory[selectedType] && b.inventory[selectedType] > 0));

  return (
    <div className="animate-fade-in">
      {/* Emergency Alert */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-4 rounded-xl mb-6"
        style={{ background: 'rgba(220,38,38,0.06)', border: '1.5px solid rgba(220,38,38,0.25)' }}>
        <AlertTriangle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
        <div className="flex-1">
          <p style={{ fontSize: 14, fontWeight: 700, color: '#dc2626' }}>⚠️ O- Blood Critically Low in your area</p>
          <p style={{ fontSize: 12, color: '#ef4444' }}>Only 15 units available. If you can donate, please visit the nearest blood bank.</p>
        </div>
        <button className="btn btn-sm" style={{ background: '#dc2626', color: 'white', flexShrink: 0, fontSize: 12 }}>
          Donate Now
        </button>
      </motion.div>

      {/* Blood Type Selector */}
      <div className="card p-5 mb-6">
        <p className="font-display font-semibold mb-4" style={{ fontSize: 15, color: 'var(--text-primary)' }}>
          <Droplets size={16} style={{ display: 'inline', marginRight: 6, color: '#dc2626' }} />
          Select Blood Type to Search
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {BLOOD_TYPES.map(bt => {
            const isSelected = selectedType === bt;
            const totalUnits = BLOOD_BANKS.reduce((s, b) => s + (b.inventory[bt] || 0), 0);
            return (
              <button key={bt} onClick={() => setSelectedType(isSelected ? '' : bt)}
                style={{
                  padding: '14px 8px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                  background: isSelected ? 'linear-gradient(135deg,#dc2626,#ef4444)' : 'var(--bg-primary)',
                  border: `2px solid ${isSelected ? '#dc2626' : totalUnits === 0 ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
                  transition: 'all 0.2s',
                }}>
                <Droplets size={16} style={{ color: isSelected ? 'white' : '#dc2626', margin: '0 auto 4px' }} />
                <p style={{ fontSize: 16, fontWeight: 800, color: isSelected ? 'white' : 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>{bt}</p>
                <p style={{ fontSize: 10, color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)', marginTop: 3 }}>
                  {totalUnits} units
                </p>
              </button>
            );
          })}
        </div>
        {selectedType && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12 }}>
            Showing {filtered.length} blood bank{filtered.length !== 1 ? 's' : ''} with <strong style={{ color: '#dc2626' }}>{selectedType}</strong> available
          </motion.p>
        )}
      </div>

      {/* Blood Bank Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {filtered.map((bank, i) => {
          const units = selectedType ? bank.inventory[selectedType] : null;
          return (
            <motion.div key={bank.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} whileHover={{ y: -3 }} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold mb-1" style={{ fontSize: 15, color: 'var(--text-primary)' }}>{bank.name}</h3>
                  {bank.hospital !== 'Standalone' && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Building2 size={11} /> {bank.hospital}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {bank.open24x7
                    ? <span className="badge badge-success" style={{ fontSize: 10 }}>24×7 Open</span>
                    : <span className="badge badge-warning" style={{ fontSize: 10 }}>Limited Hours</span>
                  }
                </div>
              </div>

              {/* Info Row */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{bank.distance} km</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} style={{ color: 'var(--secondary)' }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{bank.eta} min</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone size={12} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{bank.phone}</span>
                </div>
              </div>

              {/* Selected Blood Type Units */}
              {selectedType && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-3 rounded-xl mb-4"
                  style={{ background: units > 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${units > 0 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                  <Droplets size={20} color={units > 0 ? '#10b981' : '#ef4444'} />
                  <div>
                    <p style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: units > 0 ? '#10b981' : '#ef4444', lineHeight: 1 }}>
                      {units} units
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{selectedType} available</p>
                  </div>
                </motion.div>
              )}

              {/* All Blood Types Mini Grid */}
              {!selectedType && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginBottom: 16 }}>
                  {BLOOD_TYPES.map(bt => (
                    <div key={bt} style={{ textAlign: 'center', padding: '4px', borderRadius: 6, background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#dc2626' }}>{bt}</p>
                      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{bank.inventory[bt]}</p>
                    </div>
                  ))}
                </div>
              )}

              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 12 }}>
                Updated {bank.lastUpdated}
              </p>

              <div className="flex gap-2">
                <button onClick={() => toast.success(`Calling ${bank.name}…`)} className="btn btn-outline btn-sm flex-1" style={{ fontSize: 12 }}>
                  <Phone size={12} /> Call
                </button>
                <button onClick={() => setRequestBank(bank)} className="btn btn-sm flex-1" style={{ fontSize: 12, background: 'linear-gradient(135deg,#dc2626,#ef4444)', color: 'white' }}>
                  <Droplets size={12} /> Request
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {requestBank && <RequestModal bank={requestBank} bloodType={selectedType || 'O+'} onClose={() => setRequestBank(null)} />}
      </AnimatePresence>
    </div>
  );
}
