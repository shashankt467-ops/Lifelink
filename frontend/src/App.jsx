import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import HospitalFinder from './pages/HospitalFinder';
import HospitalDetail from './pages/HospitalDetail';
import AIRecommendation from './pages/AIRecommendation';
import Doctors from './pages/Doctors';
import BedAvailability from './pages/BedAvailability';
import BloodBank from './pages/BloodBank';
import Ambulance from './pages/Ambulance';
import Appointments from './pages/Appointments';
import AIHealthAssistant from './pages/AIHealthAssistant';
import Profile from './pages/Profile';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, sans-serif' }}>Loading Anti Gravity...</p>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                boxShadow: 'var(--shadow-md)',
              },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/hospitals" element={<HospitalFinder />} />
              <Route path="/hospitals/:id" element={<HospitalDetail />} />
              <Route path="/ai-recommendation" element={<AIRecommendation />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/beds" element={<BedAvailability />} />
              <Route path="/blood-bank" element={<BloodBank />} />
              <Route path="/ambulance" element={<Ambulance />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/ai-assistant" element={<AIHealthAssistant />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
