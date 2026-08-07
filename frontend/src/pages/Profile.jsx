import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Heart, Shield, Settings, Edit3, Save, Camera, X, Phone, MapPin, Droplets, Plus, Trash2, Sun, Moon, Monitor, Bell, Globe, Locate } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { USER_PROFILE, INDIA_STATES, CITIES_BY_STATE } from '../data/mockData';
import toast from 'react-hot-toast';

const TABS = ['Personal Info', 'Medical History', 'Insurance', 'Preferences'];

export default function Profile() {
  const { user } = useAuth();
  const { theme, toggleTheme, location: appLocation, changeCity, detectGpsLocation } = useApp();
  const [activeTab, setActiveTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(USER_PROFILE);
  const [notifPrefs, setNotifPrefs] = useState({ appointments: true, healthTips: true, emergencyAlerts: true });
  const [prefState, setPrefState] = useState(appLocation?.state || 'Maharashtra');
  const [prefCity, setPrefCity] = useState(appLocation?.city || 'Pune');

  const handleSave = () => {
    setEditing(false);
    toast.success('Profile updated successfully!');
  };

  const userInitial = (user?.displayName || profile.name || 'U')[0].toUpperCase();

  return (
    <div className="animate-fade-in" style={{ maxWidth: 900 }}>
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold"
            style={{ background: 'linear-gradient(135deg, #0e64ff, #7c3aed)', color: 'white', fontFamily: 'Outfit, sans-serif' }}>
            {userInitial}
          </div>
          <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-md" style={{ border: '2px solid var(--bg-card)' }}>
            <Camera size={12} color="white" />
          </button>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>{profile.name}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{profile.email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
            <span className="badge badge-primary">Patient ID: {profile.id}</span>
            <span className="badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626' }}>
              <Droplets size={11} /> {profile.bloodGroup}
            </span>
            <span className="badge badge-success">Verified</span>
          </div>
        </div>
        <div className="text-center">
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Member since</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Jan 2025</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', width: 'fit-content' }}>
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === i ? 'linear-gradient(135deg, #0e64ff, #0040cc)' : 'transparent',
              color: activeTab === i ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer', border: 'none', fontFamily: 'Inter, sans-serif'
            }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Personal Info Tab */}
      {activeTab === 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold" style={{ fontSize: 16, color: 'var(--text-primary)' }}>Personal Information</h3>
              {editing
                ? <div className="flex gap-2">
                    <button onClick={() => setEditing(false)} className="btn btn-ghost btn-sm"><X size={14} />Cancel</button>
                    <button onClick={handleSave} className="btn btn-primary btn-sm"><Save size={14} />Save</button>
                  </div>
                : <button onClick={() => setEditing(true)} className="btn btn-outline btn-sm"><Edit3 size={14} />Edit</button>
              }
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 16 }}>
              {[
                { label: 'Full Name', key: 'name', icon: User },
                { label: 'Phone', key: 'phone', icon: Phone },
                { label: 'Email', key: 'email', icon: null },
                { label: 'Age', key: 'age', icon: null },
                { label: 'Gender', key: 'gender', icon: null },
                { label: 'Blood Group', key: 'bloodGroup', icon: Droplets },
              ].map(({ label, key, icon: Icon }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</label>
                  {editing
                    ? <input className="input" value={profile[key]} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
                    : <p style={{ fontSize: 14, color: 'var(--text-primary)', padding: '11px 16px', background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--border)' }}>{profile[key]}</p>
                  }
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Address</label>
              {editing
                ? <input className="input" value={profile.address} onChange={e => setProfile(p => ({ ...p, address: e.target.value }))} />
                : <p style={{ fontSize: 14, color: 'var(--text-primary)', padding: '11px 16px', background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--border)' }}>{profile.address}</p>
              }
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="card p-6" style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.02)' }}>
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2" style={{ fontSize: 16, color: 'var(--text-primary)' }}>
              <Phone size={16} color="#dc2626" /> Emergency Contact
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
              {[
                { label: 'Name', val: profile.emergencyContact.name },
                { label: 'Relation', val: profile.emergencyContact.relation },
                { label: 'Phone', val: profile.emergencyContact.phone },
              ].map(({ label, val }) => (
                <div key={label}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Medical History Tab */}
      {activeTab === 1 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
          <div className="card p-6">
            <h3 className="font-display font-semibold mb-4" style={{ fontSize: 16, color: 'var(--text-primary)' }}>Medical Conditions</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.medicalHistory.map(c => (
                <span key={c} className="badge badge-warning" style={{ fontSize: 13, padding: '6px 14px' }}>{c}</span>
              ))}
              <button className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', cursor: 'pointer', border: '1px dashed var(--primary)', fontSize: 13 }}>
                <Plus size={12} /> Add
              </button>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-display font-semibold mb-4" style={{ fontSize: 16, color: 'var(--text-primary)' }}>Current Medications</h3>
            <div className="flex flex-col gap-2">
              {profile.currentMedications.map((med, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{med}</span>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={14} color="var(--text-muted)" /></button>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-display font-semibold mb-4" style={{ fontSize: 16, color: 'var(--text-primary)' }}>Allergies</h3>
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map(a => (
                <span key={a} className="badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626', fontSize: 13, padding: '6px 14px' }}>⚠️ {a}</span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Insurance Tab */}
      {activeTab === 2 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card p-6">
            <h3 className="font-display font-semibold mb-6" style={{ fontSize: 16, color: 'var(--text-primary)' }}>Insurance Details</h3>
            {/* Insurance Card */}
            <div style={{ background: 'linear-gradient(135deg, #0e64ff, #7c3aed)', borderRadius: 16, padding: 24, color: 'white', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ position: 'absolute', bottom: -30, left: -10, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
              <Shield size={28} style={{ marginBottom: 16, opacity: 0.8 }} />
              <p style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: 4 }}>{profile.insurance.provider}</p>
              <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>Health Insurance Policy</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <p style={{ fontSize: 11, opacity: 0.7 }}>Policy Number</p>
                  <p style={{ fontSize: 13, fontWeight: 600, fontFamily: 'monospace' }}>{profile.insurance.policyNumber}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, opacity: 0.7 }}>Valid Till</p>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{profile.insurance.validTill}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Preferences Tab */}
      {activeTab === 3 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
          <div className="card p-6">
            <h3 className="font-display font-semibold mb-4" style={{ fontSize: 16, color: 'var(--text-primary)' }}>Theme</h3>
            <div className="flex gap-3">
              {[{ label: 'Light', icon: Sun, val: 'light' }, { label: 'Dark', icon: Moon, val: 'dark' }, { label: 'System', icon: Monitor, val: 'system' }].map(t => {
                const Icon = t.icon;
                const isActive = theme === t.val;
                return (
                  <button key={t.val} onClick={toggleTheme}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all"
                    style={{ background: isActive ? 'linear-gradient(135deg,#0e64ff,#0040cc)' : 'var(--bg-primary)', color: isActive ? 'white' : 'var(--text-secondary)', border: `1.5px solid ${isActive ? '#0e64ff' : 'var(--border)'}`, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                    <Icon size={14} /> {t.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2" style={{ fontSize: 16, color: 'var(--text-primary)' }}>
              <Bell size={16} /> Notifications
            </h3>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Appointment Reminders', desc: 'Get notified before appointments', key: 'appointments' },
                { label: 'Health Tips', desc: 'Daily health tips and suggestions', key: 'healthTips' },
                { label: 'Emergency Alerts', desc: 'Blood shortage and emergency notifications', key: 'emergencyAlerts' },
              ].map(pref => (
                <div key={pref.key} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{pref.label}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pref.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifPrefs(p => ({ ...p, [pref.key]: !p[pref.key] }))}
                    style={{
                      width: 44, height: 24, borderRadius: 12, cursor: 'pointer', border: 'none', padding: 2,
                      background: notifPrefs[pref.key] ? 'linear-gradient(135deg,#0e64ff,#0040cc)' : 'var(--border)',
                      display: 'flex', alignItems: 'center',
                      justifyContent: notifPrefs[pref.key] ? 'flex-end' : 'flex-start', transition: 'all 0.2s',
                    }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Location Preferences Card */}
          <div className="card p-6 border border-primary/20 bg-primary/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base" style={{ color: 'var(--text-primary)' }}>Global Location Preference</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sets current city & state for hospitals, doctors, beds, and emergency services</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 rounded-xl bg-bg-card border border-border">
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', uppercase: 'uppercase' }}>CURRENT GLOBAL LOCATION</p>
                <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }} className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-primary" />
                  {appLocation?.formattedLocation || `${appLocation?.city}, ${appLocation?.state}`}
                </p>
              </div>

              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', uppercase: 'uppercase' }}>LOCATION SOURCE</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', marginTop: 4 }} className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${appLocation?.source === 'gps' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                  {appLocation?.source === 'gps' ? 'Browser GPS Geolocation' : 'Manual Selection'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select className="input text-xs" value={prefState} onChange={e => { setPrefState(e.target.value); setPrefCity(CITIES_BY_STATE[e.target.value]?.[0] || ''); }}>
                {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select className="input text-xs" value={prefCity} onChange={e => setPrefCity(e.target.value)}>
                {CITIES_BY_STATE[prefState]?.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <button 
                onClick={async () => {
                  await changeCity(prefCity, prefState);
                  toast.success(`Global location set to ${prefCity}, ${prefState}`);
                }}
                className="btn btn-primary text-xs flex items-center justify-center gap-1"
              >
                Apply Location
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-border/50">
              <button 
                onClick={async () => {
                  const res = await detectGpsLocation(true);
                  if (res) toast.success(`GPS Location detected: ${res.city}, ${res.state}`);
                }}
                className="btn btn-outline w-full text-xs flex items-center justify-center gap-2"
              >
                <Locate size={14} /> Detect My Current Location via GPS
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
