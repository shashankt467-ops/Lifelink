import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Calendar, Clock, MapPin, X, ChevronRight,
  Stethoscope, Filter, Check, Building2, User
} from 'lucide-react';
import { DOCTORS, SPECIALIZATIONS, INDIA_STATES, CITIES_BY_STATE } from '../data/mockData';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { format, addDays } from 'date-fns';
import { useApp } from '../context/AppContext';

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={12} fill={i <= Math.round(rating) ? '#f59e0b' : 'none'}
        stroke={i <= Math.round(rating) ? '#f59e0b' : '#94a3b8'} />
    ))}
    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 2 }}>{rating}</span>
  </div>
);

const BookingModal = ({ doctor, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const handleBook = async () => {
    if (!selectedDate || !selectedSlot) { toast.error('Please select date and time'); return; }
    setLoading(true);
    try {
      await api.appointments.book({ doctorId: doctor.id, date: format(selectedDate, 'yyyy-MM-dd'), time: selectedSlot });
      toast.success(`✅ Demo appointment booked with ${doctor.name}!`);
      onClose();
    } catch { toast.error('Booking failed. Please try again.'); }
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
          {/* Doctor Info */}
          <div className="flex items-center gap-4 p-4 rounded-xl mb-6" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
            <div className="avatar" style={{ width: 52, height: 52, fontSize: 18, background: 'linear-gradient(135deg,#0e64ff,#7c3aed)', color: 'white' }}>
              {doctor.name.split(' ').pop()[0]}
            </div>
            <div>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{doctor.name}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{doctor.specialization} · {doctor.hospital}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{doctor.city}, {doctor.state}</p>
              <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>₹{doctor.consultationFee} consultation fee</p>
            </div>
          </div>
          
          <p style={{ fontSize: 11, color: '#f59e0b', textAlign: 'center', marginBottom: 12 }}>⚠ Demo doctor profile</p>

          {/* Date Picker */}
          <div className="mb-5">
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Select Date</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {days.map(day => {
                const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                return (
                  <button key={day.toString()} onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
                    style={{
                      flexShrink: 0, width: 60, padding: '10px 4px', borderRadius: 12, cursor: 'pointer',
                      background: isSelected ? 'linear-gradient(135deg,#0e64ff,#0040cc)' : 'var(--bg-primary)',
                      border: `1.5px solid ${isSelected ? '#0e64ff' : 'var(--border)'}`,
                      color: isSelected ? 'white' : 'var(--text-primary)',
                      textAlign: 'center',
                    }}>
                    <p style={{ fontSize: 11, fontWeight: 500, opacity: 0.8 }}>{format(day, 'EEE')}</p>
                    <p style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3 }}>{format(day, 'd')}</p>
                    {isToday && <p style={{ fontSize: 9, fontWeight: 600, color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--primary)' }}>Today</p>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>Select Time Slot</p>
              <div className="flex flex-wrap gap-2">
                {doctor.availableSlots.map(slot => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button key={slot} onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                        background: isSelected ? 'linear-gradient(135deg,#0e64ff,#0040cc)' : 'var(--bg-primary)',
                        border: `1.5px solid ${isSelected ? '#0e64ff' : 'var(--border)'}`,
                        color: isSelected ? 'white' : 'var(--text-primary)',
                      }}>
                      {slot}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          <button onClick={handleBook} disabled={loading || !selectedDate || !selectedSlot}
            className="btn btn-primary w-full btn-lg" style={{ opacity: !selectedDate || !selectedSlot ? 0.5 : 1 }}>
            {loading
              ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><Check size={16} /> Confirm Appointment</>
            }
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const DoctorCard = ({ doctor, index, onBook }) => {
  const initials = doctor.name.split(' ').filter(p => p !== 'Dr.').map(p => p[0]).join('').slice(0, 2);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }} whileHover={{ y: -3 }}
      className="card p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="avatar" style={{ width: 56, height: 56, fontSize: 20, fontWeight: 800, background: `hsl(${(doctor.id * 73) % 360}, 70%, 55%)`, color: 'white', flexShrink: 0 }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold" style={{ fontSize: 15, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {doctor.name}
          </h3>
          <span className="badge badge-primary" style={{ fontSize: 11, marginBottom: 4 }}>{doctor.specialization}</span>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Building2 size={10} /> {doctor.hospital}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={10} /> {doctor.city}, {doctor.state}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl mb-4" style={{ background: 'var(--bg-primary)' }} title={`Qualifications: ${doctor.qualifications?.join(', ')}`}>
        <div className="text-center">
          <p className="font-bold" style={{ fontSize: 16, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{doctor.experience}yr</p>
          <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Experience</p>
        </div>
        <div className="text-center" style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
          <p className="font-bold" style={{ fontSize: 16, color: '#f59e0b', fontFamily: 'Outfit, sans-serif' }}>{doctor.rating}</p>
          <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Rating</p>
        </div>
        <div className="text-center">
          <p className="font-bold" style={{ fontSize: 16, color: 'var(--primary)', fontFamily: 'Outfit, sans-serif' }}>₹{doctor.consultationFee}</p>
          <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Fee</p>
        </div>
      </div>

      {/* Languages */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {doctor.languages?.map(lang => (
          <span key={lang} style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
            {lang}
          </span>
        ))}
      </div>

      {/* Availability */}
      <div className="flex items-center gap-2 mb-3">
        <div className="avail-dot" style={{ background: doctor.available ? '#10b981' : '#f59e0b', boxShadow: `0 0 5px ${doctor.available ? '#10b981' : '#f59e0b'}` }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: doctor.available ? '#10b981' : '#f59e0b' }}>
          {doctor.available ? 'Available Today' : `Next: ${doctor.nextAvailable}`}
        </span>
      </div>

      {/* Time Slots */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {doctor.availableSlots.slice(0, 3).map(slot => (
          <span key={slot} style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500, background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(14,100,255,0.2)' }}>
            {slot}
          </span>
        ))}
        {doctor.availableSlots.length > 3 && (
          <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 11, color: 'var(--text-muted)', background: 'var(--border)' }}>+{doctor.availableSlots.length - 3}</span>
        )}
      </div>

      <button onClick={() => onBook(doctor)} className="btn btn-primary w-full mt-auto" style={{ fontSize: 13 }}>
        <Calendar size={14} /> Book Appointment
      </button>
      <p style={{ fontSize: 10, color: '#f59e0b', textAlign: 'center', marginTop: 8 }}>⚠ Demo doctor profile</p>
    </motion.div>
  );
};

export default function Doctors() {
  const { location } = useApp();
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [selectedState, setSelectedState] = useState(location?.state || '');
  const [selectedCity, setSelectedCity] = useState(location?.city || '');
  const [availOnly, setAvailOnly] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState(null);

  useEffect(() => {
    if (location) {
      if (location.state) setSelectedState(location.state);
      if (location.city) setSelectedCity(location.city);
    }
  }, [location]);

  const filtered = DOCTORS.filter(d => {
    if (search) {
      const tokens = search.toLowerCase().trim().split(/\s+/);
      const docStr = `${d.name} ${d.specialization} ${d.hospital} ${d.city} ${d.state}`.toLowerCase();
      const allTokensMatch = tokens.every(token => docStr.includes(token));
      if (!allTokensMatch) return false;
    }
    if (specialty && d.specialization !== specialty) return false;
    if (selectedState && d.state.toLowerCase() !== selectedState.toLowerCase()) return false;
    if (selectedCity && d.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
    if (availOnly && !d.available) return false;
    return true;
  });

  return (
    <div className="animate-fade-in">
      {/* Search + Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="input-group flex-1">
              <Search size={16} className="input-icon" />
              <input value={search} onChange={e => setSearch(e.target.value)} className="input" placeholder="Search doctors by name, hospital, or city…" />
            </div>
            <select className="input" style={{ width: 'auto', minWidth: 200 }} value={specialty} onChange={e => setSpecialty(e.target.value)}>
              <option value="">All Specializations</option>
              {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <select className="input flex-1" value={selectedState} onChange={e => { setSelectedState(e.target.value); setSelectedCity(''); }}>
              <option value="">All States</option>
              {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="input flex-1" value={selectedCity} onChange={e => setSelectedCity(e.target.value)} disabled={!selectedState}>
              <option value="">All Cities</option>
              {selectedState && CITIES_BY_STATE[selectedState]?.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap px-2">
              <input type="checkbox" checked={availOnly} onChange={e => setAvailOnly(e.target.checked)} />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Available today</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> doctors found {selectedCity ? `in ${selectedCity}` : selectedState ? `in ${selectedState}` : ''}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p style={{ fontSize: 40, marginBottom: 12 }}>👨‍⚕️</p>
          <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>No doctors found</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Try different filters</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map((d, i) => <DoctorCard key={d.id} doctor={d} index={i} onBook={setBookingDoctor} />)}
        </div>
      )}

      <AnimatePresence>
        {bookingDoctor && <BookingModal doctor={bookingDoctor} onClose={() => setBookingDoctor(null)} />}
      </AnimatePresence>
    </div>
  );
}
