import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Clock, Star, Bed, AlertTriangle, Navigation, Ambulance, Droplets, ChevronLeft, CheckCircle, Users, Activity, Brain, Heart, Stethoscope, ArrowRight, X } from 'lucide-react';
import { HOSPITALS, DOCTORS } from '../data/mockData';
import toast from 'react-hot-toast';

export default function HospitalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const hospital = HOSPITALS?.find(h => h.id === Number(id));
  const doctors = DOCTORS?.filter(d => d.hospitalId === hospital?.id) || [];
  
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  if (!hospital) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Hospital not found</h2>
        <button className="btn btn-primary inline-flex items-center" onClick={() => navigate('/hospitals')}>
          <ChevronLeft className="mr-2" size={18} /> Back to Hospitals
        </button>
      </div>
    );
  }

  const handleCall = () => {
    toast.success(`Calling ${hospital.phone || 'hospital'}...`);
  };

  const handleNavigate = () => {
    window.open('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(hospital.name + ' ' + hospital.address));
  };

  const openBookingModal = (doc) => {
    setSelectedDoctor(doc);
    setBookingModalOpen(true);
  };

  const handleBook = () => {
    setBookingModalOpen(false);
    toast.success('Appointment booked successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button onClick={() => navigate('/hospitals')} className="flex items-center text-primary hover:underline mb-4 font-medium">
          <ChevronLeft size={18} className="mr-1" /> Back to Hospitals
        </button>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold font-outfit text-text-primary">{hospital.name}</h1>
              {hospital.emergency && (
                <span className="badge badge-error flex items-center gap-1 bg-red-100 text-red-700">
                  <AlertTriangle size={14} /> Emergency
                </span>
              )}
            </div>
            <div className="flex items-center text-text-secondary mb-3 text-lg">
              <MapPin size={18} className="mr-1" />
              {hospital.city}, {hospital.state}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center text-yellow-500">
                <Star size={18} className="fill-current" />
                <span className="ml-1 font-bold text-text-primary">{hospital.rating}</span>
              </div>
              <span className="text-text-muted">({hospital.reviewCount || Math.floor(Math.random() * 500 + 50)} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-orange-500/10 border border-orange-500/20 text-orange-600 rounded-lg p-3 mb-8 flex items-center gap-2 text-sm">
        <span>ℹ️</span>
        <span className="font-medium">Bed counts, availability shown are simulated demo data for prototype purposes.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 border border-border">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <Building2 size={20} className="text-primary" /> About
              </h2>
              <span className="badge badge-primary">{hospital.type}</span>
            </div>
            <div className="space-y-3 text-text-secondary">
              <p className="flex items-start gap-2">
                <MapPin size={18} className="mt-0.5 flex-shrink-0 text-text-muted" />
                <span>{hospital.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={18} className="text-text-muted" />
                <span>{hospital.phone || '+91 98765 43210'}</span>
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="btn btn-primary flex-1 flex items-center justify-center" onClick={handleCall}>
                <Phone size={18} className="mr-2" /> Call
              </button>
              <button className="btn btn-outline flex-1 flex items-center justify-center" onClick={handleNavigate}>
                <Navigation size={18} className="mr-2" /> Navigate
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6 relative overflow-hidden border border-border">
            <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
              DEMO
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <Activity size={20} className="text-primary" /> Simulated Live Availability
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-bg-secondary border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center text-text-secondary">
                    <Bed size={16} className="mr-1 text-primary" /> General Beds
                  </span>
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">{hospital.beds?.general || 0}</div>
                <div className="w-full bg-border rounded-full h-1.5 mb-2 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min(100, ((hospital.beds?.general || 0) / (hospital.beds?.total || 100)) * 100)}%` }}></div>
                </div>
                <div className="text-xs text-text-muted">of ~{hospital.beds?.total || 100} total</div>
              </div>
              
              <div className="p-4 rounded-xl bg-bg-secondary border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center text-text-secondary">
                    <Activity size={16} className="mr-1 text-orange-500" /> ICU Beds
                  </span>
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">{hospital.beds?.icu || 0}</div>
                <div className="w-full bg-border rounded-full h-1.5 mb-2 overflow-hidden">
                  <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, ((hospital.beds?.icu || 0) / (hospital.icuBeds?.total || 50)) * 100)}%` }}></div>
                </div>
                <div className="text-xs text-text-muted">{hospital.beds?.icu || 0} available</div>
              </div>
              
              <div className="p-4 rounded-xl bg-bg-secondary border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center text-text-secondary">
                    <AlertTriangle size={16} className="mr-1 text-red-500" /> Emergency
                  </span>
                </div>
                <div className="text-3xl font-bold text-text-primary mb-1">{hospital.beds?.emergency || 0}</div>
                <div className="w-full bg-border rounded-full h-1.5 mb-2 overflow-hidden">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <div className="text-xs text-text-muted">Currently available</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-bg-secondary border border-border flex-1 justify-center">
                <Ambulance size={18} className="text-green-500" />
                <span className="font-medium text-text-primary">Ambulance Available</span>
                <CheckCircle size={16} className="text-green-500 ml-1" />
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-bg-secondary border border-border flex-1 justify-center">
                <Droplets size={18} className="text-red-500" />
                <span className="font-medium text-text-primary">Blood Bank</span>
                <CheckCircle size={16} className="text-green-500 ml-1" />
              </div>
            </div>
            
            <p className="text-xs text-center text-text-muted mt-4">Simulated — not real-time</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6 border border-border">
            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <Stethoscope size={20} className="text-primary" /> Specialists & Services
            </h2>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-secondary mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {hospital.specialists?.map(spec => (
                  <span key={spec} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-secondary mb-3">Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {hospital.facilities?.map(fac => (
                  <span key={fac} className="px-3 py-1 bg-bg-secondary border border-border text-text-secondary rounded-full text-sm">
                    {fac}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6 border border-border">
            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <Users size={20} className="text-primary" /> Associated Demo Doctors
            </h2>
            {doctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map(doc => (
                  <div key={doc.id} className="p-4 rounded-xl border border-border flex flex-col gap-3 bg-bg-secondary/50">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                        {doc.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-bold text-text-primary">{doc.name}</h4>
                        <p className="text-xs text-text-secondary">{doc.specialization}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="flex items-center text-yellow-500 text-xs">
                            <Star size={12} className="fill-current mr-0.5" /> {doc.rating}
                          </span>
                          <span className="text-xs text-text-muted">•</span>
                          <span className="text-xs font-medium text-primary">₹{doc.fee}</span>
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-primary btn-sm w-full mt-auto" onClick={() => openBookingModal(doc)}>
                      Book Appointment
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary italic">No demo doctor profiles for this hospital</p>
            )}
          </motion.div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-6 mb-6 border border-border">
              <h2 className="text-lg font-bold text-text-primary mb-4">Quick Actions</h2>
              <div className="flex flex-col gap-3">
                <button className="btn btn-outline justify-start flex items-center" onClick={handleCall}>
                  <Phone size={18} className="mr-3" /> Call Hospital
                </button>
                <button className="btn btn-outline justify-start flex items-center" onClick={handleNavigate}>
                  <MapPin size={18} className="mr-3" /> Navigate
                </button>
                <button className="btn btn-outline justify-start flex items-center" onClick={() => navigate('/ambulance')}>
                  <Ambulance size={18} className="mr-3 text-red-500" /> Request Ambulance
                </button>
                <button className="btn btn-outline justify-start flex items-center" onClick={() => navigate('/blood-bank')}>
                  <Droplets size={18} className="mr-3 text-red-500" /> Check Blood Bank
                </button>
                <button className="btn btn-outline justify-start flex items-center bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary" onClick={() => navigate('/ai-recommendation')}>
                  <Brain size={18} className="mr-3 text-primary" /> AI Recommendation
                </button>
                <button className="btn btn-primary justify-start flex items-center mt-2" onClick={() => document.getElementById('doctors')?.scrollIntoView({behavior: 'smooth'})}>
                  <Clock size={18} className="mr-3" /> Book Appointment
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="card p-6 mb-6 border border-border">
              <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <Clock size={20} className="text-orange-500" /> Estimated Wait Time
              </h2>
              <div className="flex items-center justify-center py-4">
                <div className="text-5xl font-outfit font-bold text-text-primary">
                  {hospital.waitTime || '15'}
                </div>
                <div className="text-lg text-text-secondary ml-2 mt-4">mins</div>
              </div>
              <p className="text-center text-sm text-text-muted">For general consultation</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card p-6 border border-border">
              <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <Heart size={20} className="text-green-500" /> Insurance Accepted
              </h2>
              <ul className="space-y-2">
                {hospital.insuranceAccepted?.map((ins, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                    <CheckCircle size={14} className="text-green-500 flex-shrink-0" /> {ins}
                  </li>
                )) || <li className="text-sm text-text-secondary">Contact hospital for details</li>}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {bookingModalOpen && selectedDoctor && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 20 }}
              className="card w-full max-w-md p-6 shadow-2xl relative border border-border"
            >
              <button 
                onClick={() => setBookingModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-bg-secondary text-text-muted transition-colors"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-bold font-outfit text-text-primary mb-4">Book Appointment</h3>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-secondary border border-border mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {selectedDoctor.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text-primary">{selectedDoctor.name}</h4>
                  <p className="text-xs text-text-secondary">{selectedDoctor.specialization}</p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-sm font-bold text-primary">₹{selectedDoctor.fee}</div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-2">Select Date</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                    <button key={day} className={`px-4 py-2 rounded-lg text-sm border whitespace-nowrap transition-colors ${i === 0 ? 'bg-primary text-white border-primary' : 'border-border text-text-secondary hover:border-primary/50 bg-bg-secondary'}`}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-text-secondary mb-2">Select Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {['10:00 AM', '11:30 AM', '01:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'].map((time, i) => (
                    <button key={time} className={`py-2 rounded-lg text-sm border transition-colors ${i === 1 ? 'bg-primary/10 border-primary text-primary font-medium' : 'border-border text-text-secondary hover:border-primary/50 bg-bg-secondary'}`}>
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary w-full py-3 text-base" onClick={handleBook}>
                Confirm Booking
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
