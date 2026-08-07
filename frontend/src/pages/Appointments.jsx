import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Plus, X, Check, Clock, MapPin, User,
  CheckCircle, XCircle, Calendar, Filter
} from 'lucide-react';
import { APPOINTMENTS, DOCTORS } from '../data/mockData';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { format, addDays, parseISO } from 'date-fns';

const STATUS_CONFIG = {
  Confirmed: { color: '#0e64ff', bg: 'rgba(14,100,255,0.1)', icon: CheckCircle },
  Completed: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle },
  Cancelled: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: XCircle },
};

import { useApp } from '../context/AppContext';

const BookModal = ({ onClose, onBooked }) => {
  const { location } = useApp();
  const [form, setForm] = useState({ doctorId: '', date: null, slot: '' });
  const [loading, setLoading] = useState(false);
  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  // Prioritize current city doctors in dropdown
  const availableDoctors = DOCTORS.filter(d => d.available).sort((a, b) => {
    const aMatch = location?.city && a.city.toLowerCase() === location.city.toLowerCase();
    const bMatch = location?.city && b.city.toLowerCase() === location.city.toLowerCase();
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  const doctor = DOCTORS.find(d => d.id === Number(form.doctorId));

  const handleBook = async () => {
    if (!form.doctorId || !form.date || !form.slot) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const res = await api.appointments.book({ doctorId: Number(form.doctorId), date: format(form.date, 'yyyy-MM-dd'), time: form.slot });
      toast.success('✅ Appointment booked successfully!');
      onBooked(res.data);
      onClose();
    } catch { toast.error('Booking failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }} className="modal">
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Book Appointment</h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={18} /></button>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Select Doctor</label>
            <select className="input" value={form.doctorId} onChange={e => setForm(f => ({ ...f, doctorId: e.target.value, slot: '' }))}>
              <option value="">Choose a doctor…</option>
              {availableDoctors.map(d => (
                <option key={d.id} value={d.id}>{d.name} — {d.specialization} ({d.city})</option>
              ))}
            </select>
          </div>

          {form.doctorId && (
            <>
              <div className="mb-4">
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Select Date</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {days.map(day => {
                    const isSelected = form.date && format(day, 'yyyy-MM-dd') === format(form.date, 'yyyy-MM-dd');
                    return (
                      <button key={day.toString()} onClick={() => setForm(f => ({ ...f, date: day, slot: '' }))}
                        style={{
                          flexShrink: 0, width: 58, padding: '8px 4px', borderRadius: 10, cursor: 'pointer',
                          background: isSelected ? 'linear-gradient(135deg,#0e64ff,#0040cc)' : 'var(--bg-primary)',
                          border: `1.5px solid ${isSelected ? '#0e64ff' : 'var(--border)'}`,
                          color: isSelected ? 'white' : 'var(--text-primary)', textAlign: 'center',
                        }}>
                        <p style={{ fontSize: 10, opacity: 0.8 }}>{format(day, 'EEE')}</p>
                        <p style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>{format(day, 'd')}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {form.date && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5">
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Select Time</label>
                  <div className="flex flex-wrap gap-2">
                    {(doctor?.availableSlots || []).map(slot => (
                      <button key={slot} onClick={() => setForm(f => ({ ...f, slot }))}
                        style={{
                          padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                          background: form.slot === slot ? 'linear-gradient(135deg,#0e64ff,#0040cc)' : 'var(--bg-primary)',
                          border: `1.5px solid ${form.slot === slot ? '#0e64ff' : 'var(--border)'}`,
                          color: form.slot === slot ? 'white' : 'var(--text-primary)',
                        }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}

          <button onClick={handleBook} disabled={loading || !form.doctorId || !form.date || !form.slot}
            className="btn btn-primary w-full btn-lg" style={{ opacity: !form.doctorId || !form.date || !form.slot ? 0.5 : 1 }}>
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Check size={16} /> Confirm Booking</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AppointmentCard = ({ appointment, onCancel }) => {
  const cfg = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.Confirmed;
  const StatusIcon = cfg.icon;
  let dateStr = appointment.date;
  try { dateStr = format(parseISO(appointment.date), 'EEE, MMM d yyyy'); } catch {}

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      layout className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display font-bold" style={{ fontSize: 15, color: 'var(--text-primary)', marginBottom: 2 }}>
            {appointment.doctorName}
          </h3>
          <div className="flex items-center gap-2">
            <span className="badge badge-primary" style={{ fontSize: 11 }}>{appointment.specialization}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{appointment.hospital}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: cfg.bg }}>
          <StatusIcon size={12} style={{ color: cfg.color }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color }}>{appointment.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 rounded-xl mb-4" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex items-center gap-2">
          <Calendar size={13} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{dateStr}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={13} style={{ color: 'var(--secondary)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{appointment.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <User size={13} style={{ color: '#f59e0b' }} />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Token #{appointment.tokenNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>₹{appointment.fee}</span>
        </div>
      </div>

      {appointment.notes && (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontStyle: 'italic' }}>📝 {appointment.notes}</p>
      )}

      <div className="flex gap-2">
        {appointment.status === 'Confirmed' && (
          <button onClick={() => onCancel(appointment.id)}
            className="btn btn-sm" style={{ fontSize: 12, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
            <X size={12} /> Cancel
          </button>
        )}
        {appointment.status === 'Completed' && (
          <button className="btn btn-primary btn-sm" style={{ fontSize: 12 }}>
            <CalendarDays size={12} /> Book Follow-up
          </button>
        )}
        <button className="btn btn-ghost btn-sm ml-auto" style={{ fontSize: 12 }}>View Details</button>
      </div>
    </motion.div>
  );
};

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [tab, setTab] = useState('All');
  const [showBook, setShowBook] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.appointments.getAll().then(res => { setAppointments(res.data); setLoading(false); });
  }, []);

  const stats = {
    Total: appointments.length,
    Upcoming: appointments.filter(a => a.status === 'Confirmed').length,
    Completed: appointments.filter(a => a.status === 'Completed').length,
    Cancelled: appointments.filter(a => a.status === 'Cancelled').length,
  };

  const filtered = tab === 'All' ? appointments : appointments.filter(a => a.status === tab);

  const handleCancel = async (id) => {
    await api.appointments.cancel(id);
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
    toast.success('Appointment cancelled');
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div />
        <button onClick={() => setShowBook(true)} className="btn btn-primary">
          <Plus size={16} /> Book Appointment
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {Object.entries(stats).map(([label, val], i) => {
          const colors = ['var(--primary)', '#10b981', '#10b981', '#ef4444'];
          return (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }} className="stat-card text-center">
              <p className="font-display font-bold" style={{ fontSize: 28, color: colors[i], lineHeight: 1 }}>{val}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['All', 'Confirmed', 'Completed', 'Cancelled'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="btn btn-sm"
            style={{
              background: tab === t ? 'linear-gradient(135deg,#0e64ff,#0040cc)' : 'var(--bg-card)',
              color: tab === t ? 'white' : 'var(--text-secondary)',
              border: `1.5px solid ${tab === t ? '#0e64ff' : 'var(--border)'}`,
            }}>
            {t}
            {t !== 'All' && <span style={{ marginLeft: 4, fontSize: 11, opacity: 0.8 }}>({stats[t] || 0})</span>}
          </button>
        ))}
      </div>

      {/* Appointment List */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1,2,3].map(i => <div key={i} className="card p-5"><div className="skeleton" style={{ height: 100, borderRadius: 8 }} /></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <p style={{ fontSize: 48, marginBottom: 12 }}>📅</p>
          <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>No appointments found</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>Book your first appointment with a specialist</p>
          <button onClick={() => setShowBook(true)} className="btn btn-primary mx-auto">
            <Plus size={16} /> Book Appointment
          </button>
        </div>
      ) : (
        <motion.div layout className="flex flex-col gap-4">
          <AnimatePresence>
            {filtered.map(a => <AppointmentCard key={a.id} appointment={a} onCancel={handleCancel} />)}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {showBook && (
          <BookModal
            onClose={() => setShowBook(false)}
            onBooked={(appt) => setAppointments(prev => [appt, ...prev])}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
