import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, Brain, UserRound, Bed,
  Droplets, Ambulance, CalendarDays, MessageSquareHeart,
  User, ChevronLeft, ChevronRight, Activity, Cross
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { path: '/dashboard',       label: 'Dashboard',        icon: LayoutDashboard },
  { path: '/hospitals',       label: 'Nearby Hospitals', icon: Building2 },
  { path: '/ai-recommendation', label: 'AI Recommendation', icon: Brain },
  { path: '/doctors',         label: 'Doctors',          icon: UserRound },
  { path: '/beds',            label: 'Beds & ICU',       icon: Bed },
  { path: '/blood-bank',      label: 'Blood Bank',       icon: Droplets },
  { path: '/ambulance',       label: 'Ambulance',        icon: Ambulance },
  { path: '/appointments',    label: 'Appointments',     icon: CalendarDays },
  { path: '/ai-assistant',    label: 'AI Health Assistant', icon: MessageSquareHeart },
  { path: '/profile',         label: 'Profile',          icon: User },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useApp();
  const location = useLocation();

  return (
    <motion.aside
      className="sidebar"
      animate={{ width: sidebarOpen ? 260 : 72 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{ width: sidebarOpen ? 260 : 72 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'var(--border)', minHeight: 64 }}>
        <div className="flex-shrink-0 w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
          <Cross size={18} color="white" strokeWidth={2.5} />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <span className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                Anti<span className="text-gradient">Gravity</span>
              </span>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Healthcare Platform</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                style={{ flexShrink: 0, color: isActive ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)' }}
              />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'var(--sidebar-active-bg)', zIndex: -1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Emergency Button */}
      <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <NavLink to="/hospitals" className="btn btn-emergency w-full justify-center" style={{ borderRadius: 10, padding: '10px 16px', fontSize: 13 }}>
          <Activity size={16} strokeWidth={2.5} />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Emergency
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white shadow-md border flex items-center justify-center"
        style={{ borderColor: 'var(--border)', cursor: 'pointer', zIndex: 10 }}
      >
        {sidebarOpen
          ? <ChevronLeft size={12} style={{ color: 'var(--text-secondary)' }} />
          : <ChevronRight size={12} style={{ color: 'var(--text-secondary)' }} />
        }
      </button>
    </motion.aside>
  );
}
