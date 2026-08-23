import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Phone, Clock, Star, Bed, AlertTriangle, Navigation, Ambulance,
  Droplets, ChevronLeft, CheckCircle, Users, Activity, Brain, Heart,
  Stethoscope, ArrowRight, X, Globe, Shield, RefreshCw, Car, Accessibility
} from 'lucide-react';
import { hospitalsService, doctorsService, appointmentsService } from '../services/firestore/services';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

export default function HospitalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { location: userLocation } = useApp();

  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  useEffect(() => {
    const allHospitals = hospitalsService.getHospitals();
    const found = allHospitals.find(h => String(h.id) === String(id) || String(h.osmId) === String(id));
    
    if (found) {
      setHospital(found);
      const docList = doctorsService.getDoctorsByHospital(found.id);
      setDoctors(docList);
    }
    setLoading(false);

    const unsub = hospitalsService.subscribeHospitals((list) => {
      const updated = list.find(h => String(h.id) === String(id) || String(h.osmId) === String(id));
      if (updated) {
        setHospital(updated);
        setDoctors(doctorsService.getDoctorsByHospital(updated.id));
      }
    });

    return () => unsub();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-muted)' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 16px auto', color: '#60a5fa' }} />
        <p style={{ fontSize: 16, fontWeight: 700 }}>Loading Verified Hospital Details...</p>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Hospital record not found</h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>The requested hospital is not registered in the system or local map cache.</p>
        <button className="btn btn-primary" onClick={() => navigate('/hospitals')}>
          <ChevronLeft size={18} /> Back to Hospital Finder
        </button>
      </div>
    );
  }

  const handleCall = () => {
    if (hospital.phone && hospital.phone !== 'Not available') {
      window.open(`tel:${hospital.phone}`);
    } else {
      toast.info('Phone contact not listed in OpenStreetMap directory.');
    }
  };

  const handleNavigateDirections = () => {
    const lat = hospital.latitude || hospital.lat;
    const lng = hospital.longitude || hospital.lng;
    if (userLocation && userLocation.lat && userLocation.lng && lat && lng) {
      const osrmUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation.lat}%2C${userLocation.lng}%3B${lat}%2C${lng}`;
      window.open(osrmUrl, '_blank');
    } else if (lat && lng) {
      window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`, '_blank');
    } else {
      toast.error('Coordinates not available for navigation');
    }
  };

  const handleBookAppointment = () => {
    if (!selectedDoctor || !bookingDate || !bookingTime) {
      toast.error('Please select date and time slot');
      return;
    }
    appointmentsService.createAppointment({
      patientId: 'user-default',
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialization: selectedDoctor.specialization,
      hospital: hospital.name,
      appointmentDate: bookingDate,
      appointmentTime: bookingTime,
      type: 'Emergency Consultation',
      fee: selectedDoctor.consultationFee || 750,
    });
    toast.success(`✅ Appointment booked with ${selectedDoctor.name}!`);
    setBookingModalOpen(false);
  };

  const lat = hospital.latitude || hospital.lat;
  const lng = hospital.longitude || hospital.lng;

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto', paddingBottom: 60 }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/hospitals')}
        className="btn btn-ghost btn-sm mb-4"
        style={{ color: '#60a5fa', gap: 6 }}
      >
        <ChevronLeft size={16} /> Back to Hospital Finder
      </button>

      {/* Header Spatial Card */}
      <div className="card p-6 mb-6" style={{ background: 'var(--bg-card)', border: '2px solid var(--border)' }}>
        <div className="flex items-start justify-between flex-wrap gap-4" style={{ transform: 'translateZ(12px)' }}>
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 style={{ fontSize: 32, fontWeight: 900, fontFamily: 'Outfit, sans-serif', margin: 0 }}>{hospital.name}</h1>
              <span className="badge badge-primary">{hospital.type || 'Hospital'}</span>
              {hospital.emergency === true && (
                <span className="badge badge-danger">
                  <AlertTriangle size={12} /> 24/7 Emergency Center
                </span>
              )}
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
              <MapPin size={14} color="#60a5fa" />
              {hospital.address} &middot; {hospital.city}, {hospital.state}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="btn btn-outline" onClick={handleCall}>
              <Phone size={16} /> {hospital.phone && hospital.phone !== 'Not available' ? hospital.phone : 'Call Hospital'}
            </button>
            <button className="btn btn-primary" onClick={handleNavigateDirections}>
              <Navigation size={16} /> Get OSRM Directions
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }} className="db-two-col">
        {/* Left Column: Details & Verified Data */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Metadata Card */}
          <div className="card p-6">
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, fontFamily: 'Outfit, sans-serif' }}>Verified Directory Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Phone Contact</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>{hospital.phone || 'Not available'}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Official Website</p>
                {hospital.website && hospital.website !== 'Not available' ? (
                  <a href={hospital.website} target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 600, color: '#60a5fa', wordBreak: 'break-all' }}>
                    {hospital.website}
                  </a>
                ) : (
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>Not available</p>
                )}
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Opening Hours</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>{hospital.openingHours || 'Not available'}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Data Source</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#60a5fa', marginTop: 4 }}>{hospital.source || 'OpenStreetMap Directory'}</p>
              </div>
            </div>
          </div>

          {/* Available Facilities & Features */}
          <div className="card p-6">
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, fontFamily: 'Outfit, sans-serif' }}>Facilities & Amenities</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
              <div style={{ padding: 12, borderRadius: 14, background: 'rgba(10,16,34,0.8)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Accessibility size={18} color={hospital.wheelchairAccessible === true ? '#34d399' : '#94a3b8'} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, margin: 0 }}>Wheelchair Access</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{hospital.wheelchairAccessible === true ? 'Yes' : 'Not available'}</p>
                </div>
              </div>
              <div style={{ padding: 12, borderRadius: 14, background: 'rgba(10,16,34,0.8)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Car size={18} color={hospital.parkingAvailable === true ? '#34d399' : '#94a3b8'} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, margin: 0 }}>Parking Facility</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{hospital.parkingAvailable === true ? 'Yes' : 'Not available'}</p>
                </div>
              </div>
              <div style={{ padding: 12, borderRadius: 14, background: 'rgba(10,16,34,0.8)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Droplets size={18} color={hospital.bloodBankAvailable === true ? '#34d399' : '#94a3b8'} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, margin: 0 }}>Blood Bank</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{hospital.bloodBankAvailable === true ? 'Yes' : 'Not available'}</p>
                </div>
              </div>
              <div style={{ padding: 12, borderRadius: 14, background: 'rgba(10,16,34,0.8)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Ambulance size={18} color={hospital.ambulanceAvailable === true ? '#34d399' : '#94a3b8'} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, margin: 0 }}>Ambulance Unit</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{hospital.ambulanceAvailable === true ? 'Yes' : 'Not available'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Associated Doctors Section */}
          <div className="card p-6">
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, fontFamily: 'Outfit, sans-serif' }}>Medical Specialists On Call</h3>
            {doctors.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                {doctors.map((doc) => (
                  <div key={doc.id} style={{ padding: 16, borderRadius: 16, background: 'rgba(10,16,34,0.85)', border: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>{doc.name}</h4>
                    <span className="badge badge-primary" style={{ fontSize: 10, marginTop: 4 }}>{doc.specialization}</span>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{doc.qualification} &middot; {doc.experience} yrs exp</p>
                    <button
                      className="btn btn-primary btn-sm w-full mt-3"
                      onClick={() => { setSelectedDoctor(doc); setBookingModalOpen(true); }}
                    >
                      Book Appointment
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>No doctor profiles currently linked to this hospital in database.</p>
            )}
          </div>
        </div>

        {/* Right Column: Location & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Quick Actions Panel */}
          <div className="card p-6">
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14, fontFamily: 'Outfit, sans-serif' }}>Quick Emergency Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn btn-primary w-full" onClick={handleNavigateDirections}>
                <Navigation size={16} /> Get OSRM Route
              </button>
              <button className="btn btn-outline w-full" onClick={handleCall}>
                <Phone size={16} /> Contact Directory
              </button>
              <button className="btn btn-outline w-full" onClick={() => navigate('/ambulance')}>
                <Ambulance size={16} /> Dispatch Ambulance
              </button>
              <button className="btn btn-outline w-full" onClick={() => navigate('/blood-bank')}>
                <Droplets size={16} /> Request Blood Unit
              </button>
            </div>
          </div>

          {/* Map Preview Location Card */}
          <div className="card p-6">
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, fontFamily: 'Outfit, sans-serif' }}>OpenStreetMap Coordinates</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Latitude: <span style={{ fontWeight: 700, color: '#60a5fa' }}>{lat}</span></p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Longitude: <span style={{ fontWeight: 700, color: '#60a5fa' }}>{lng}</span></p>
            {hospital.sourceUrl && (
              <a href={hospital.sourceUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm w-full mt-4" style={{ fontSize: 12, color: '#60a5fa' }}>
                <Globe size={14} /> View on OpenStreetMap.org
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Appointment Booking Modal */}
      <AnimatePresence>
        {bookingModalOpen && selectedDoctor && (
          <div className="modal-overlay" onClick={() => setBookingModalOpen(false)}>
            <div className="modal p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-4 border-b mb-4" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Book Consultation</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{selectedDoctor.name} ({selectedDoctor.specialization})</p>
                </div>
                <button onClick={() => setBookingModalOpen(false)} className="btn btn-ghost btn-icon"><X size={16} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>SELECT DATE</label>
                  <input type="date" className="input" value={bookingDate} onChange={e => setBookingDate(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>SELECT TIME SLOT</label>
                  <select className="input" value={bookingTime} onChange={e => setBookingTime(e.target.value)}>
                    <option value="">Select Time Slot</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>

                <div className="flex gap-3 mt-4">
                  <button onClick={() => setBookingModalOpen(false)} className="btn btn-ghost flex-1">Cancel</button>
                  <button onClick={handleBookAppointment} className="btn btn-primary flex-1">Confirm Booking</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
