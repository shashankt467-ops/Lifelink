import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Sun, Moon, Search, Menu, X,
  LogOut, User, Settings, ChevronDown, MapPin, Locate
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { INDIA_STATES, CITIES_BY_STATE } from '../../data/mockData';
import toast from 'react-hot-toast';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/hospitals': 'Nearby Hospitals',
  '/ai-recommendation': 'AI Recommendation',
  '/doctors': 'Find Doctors',
  '/beds': 'Bed & ICU Availability',
  '/blood-bank': 'Blood Bank',
  '/ambulance': 'Ambulance Services',
  '/appointments': 'My Appointments',
  '/hospital-design': '3D Hospital Design Studio',
  '/ai-assistant': 'AI Health Assistant',
  '/profile': 'My Profile',
};

// Global Location Change Modal for Header
function TopBarLocationModal({ isOpen, onClose, currentLocation, onChangeCity, onDetectGps }) {
  const [selectedState, setSelectedState] = useState(currentLocation?.state || 'Maharashtra');
  const [selectedCity, setSelectedCity] = useState(currentLocation?.city || 'Pune');
  const [isDetecting, setIsDetecting] = useState(false);

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
    toast.success(`Location updated to ${selectedCity}, ${selectedState}`);
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
        <div 
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="card p-6 w-full max-w-md bg-bg-card shadow-2xl border border-border rounded-2xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-text-primary">Change Global Location</h3>
                  <p className="text-xs text-text-muted">Updates location across all pages</p>
                </div>
              </div>
              <button onClick={onClose} className="btn btn-ghost btn-icon p-1.5"><X size={16} /></button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1.5 block">STATE</label>
                <select className="input w-full" value={selectedState} onChange={handleStateChange}>
                  {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted mb-1.5 block">CITY</label>
                <select className="input w-full" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
                  {CITIES_BY_STATE[selectedState]?.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="pt-2 border-t border-border">
                <button 
                  onClick={handleGpsClick} 
                  disabled={isDetecting}
                  className="btn btn-outline w-full py-2.5 text-xs flex items-center justify-center gap-2"
                >
                  <Locate size={15} className={isDetecting ? 'animate-spin' : ''} />
                  {isDetecting ? 'Detecting GPS Location...' : 'Use My Location (GPS)'}
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={onClose} className="btn btn-ghost flex-1 text-xs py-2">Cancel</button>
                <button onClick={handleApply} className="btn btn-primary flex-1 text-xs py-2">Apply Location</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function TopBar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, notifications, setSidebarOpen, sidebarOpen, location: appLocation, changeCity, detectGpsLocation } = useApp();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const title = PAGE_TITLES[location.pathname] || 'Anti Gravity';

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed');
    }
  };

  const userInitial = user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <header className="topbar">
      <TopBarLocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        currentLocation={appLocation}
        onChangeCity={changeCity}
        onDetectGps={detectGpsLocation}
      />

      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          className="btn btn-ghost btn-icon lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {title}
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Subtle Header Location Indicator */}
        <button
          onClick={() => setShowLocationModal(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-bg-secondary text-xs font-semibold text-text-primary hover:bg-bg-card-hover transition-all"
          title="Click to change global application location"
        >
          <MapPin size={13} className="text-primary" />
          <span>{appLocation?.formattedLocation || `${appLocation?.city}, ${appLocation?.state}`}</span>
          <ChevronDown size={12} className="text-text-muted" />
        </button>

        {/* Theme Toggle */}
        <button
          className="btn btn-ghost btn-icon"
          onClick={toggleTheme}
          title="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="btn btn-ghost btn-icon relative"
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute right-0 top-12 w-80 card shadow-lg z-50"
              style={{ padding: 0, overflow: 'hidden' }}
            >
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Notifications</span>
                <button onClick={() => setShowNotifications(false)} className="btn btn-ghost btn-icon" style={{ padding: '4px' }}>
                  <X size={14} />
                </button>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border)', maxHeight: 320, overflowY: 'auto' }}>
                {[
                  { title: 'Appointment Tomorrow', msg: 'Dr. Aarav Mehta at 10:00 AM', time: '1h ago', color: 'var(--primary)', unread: true },
                  { title: 'Blood Alert', msg: 'O- critically low in your city', time: '3h ago', color: 'var(--danger)', unread: true },
                  { title: 'Health Tip', msg: 'Stay hydrated today!', time: '6h ago', color: 'var(--success)', unread: false },
                ].map((n, i) => (
                  <div key={i} className="p-4 flex gap-3" style={{ background: n.unread ? 'var(--primary-light)' : 'transparent' }}>
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: n.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{n.msg}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all"
            style={{ background: showUserMenu ? 'var(--bg-card-hover)' : 'transparent' }}
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
          >
            <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
              {user?.photoURL
                ? <img src={user.photoURL} alt={userInitial} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                : userInitial
              }
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {user?.displayName || 'User'}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Patient</p>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          {showUserMenu && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 top-14 w-52 card z-50"
              style={{ padding: 8 }}
            >
              <div className="px-3 py-2 mb-1">
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{user?.displayName || 'User'}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</p>
              </div>
              <div className="divider" style={{ margin: '8px 0' }} />
              <Link to="/profile" onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <User size={15} /> Profile
              </Link>
              <Link to="/profile" onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Settings size={15} /> Settings
              </Link>
              <div className="divider" style={{ margin: '8px 0' }} />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
                style={{ color: '#ef4444', background: 'transparent', cursor: 'pointer', border: 'none', textAlign: 'left' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={15} /> Log Out
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
