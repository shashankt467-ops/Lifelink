import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Cross, ShieldCheck, LockKeyhole } from 'lucide-react';

const stats = [
  { label: 'Hospitals Network', value: '500+', color: '#0e64ff' },
  { label: 'Board Doctors', value: '1,200+', color: '#0bbcb8' },
  { label: 'Emergencies Routed', value: '50,000+', color: '#7c3aed' },
  { label: 'System SLA', value: '99.99%', color: '#10b981' },
];

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password', { id: 'auth-error' });
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back to LifeLink', { id: 'auth-success' });
      navigate('/dashboard');
    } catch (err) {
      console.error("EMAIL LOGIN ERROR:", {
        code: err.code,
        message: err.message,
        name: err.name,
      });

      let msg = 'Authentication failed. Please try again.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Invalid email format';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many failed login attempts. Please try again later.';
      } else if (err.message) {
        msg = `Login Error [${err.code || 'UNKNOWN'}]: ${err.message}`;
      }
      toast.error(msg, { id: 'auth-error', duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (e) => {
    if (e) e.preventDefault();
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res?.user) {
        toast.success(`Authenticated with Google! Welcome ${res.user.displayName || res.user.email}`, { id: 'google-auth-success' });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("GOOGLE AUTH ERROR:", {
        code: err.code,
        message: err.message,
        name: err.name,
      });

      let errorMsg = 'Google sign-in failed.';
      if (err.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Google sign-in was cancelled.';
      } else if (err.code === 'auth/popup-blocked') {
        errorMsg = 'Google sign-in popup was blocked by browser. Please allow popups.';
      } else if (err.code === 'auth/invalid-api-key' || err.code === 'auth/api-key-not-valid') {
        errorMsg = 'Firebase Auth API key is invalid or unconfigured. Check VITE_FIREBASE_API_KEY in .env';
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMsg = `Domain (${window.location.hostname}) is not authorized in Firebase Console -> Auth -> Settings -> Authorized domains.`;
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMsg = 'Google Sign-In is not enabled in Firebase Console -> Auth -> Sign-in method.';
      } else if (err.message) {
        errorMsg = `Google sign-in error [${err.code || 'UNKNOWN'}]: ${err.message}`;
      }

      toast.error(errorMsg, { id: 'google-auth-error', duration: 6000 });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left Branding Panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between p-12 w-[480px] flex-shrink-0"
        style={{ background: 'linear-gradient(145deg, #070b14 0%, #0d1b40 50%, #0a1628 100%)', borderRight: '1px solid var(--border)' }}
      >
        <div>
          <Link to="/" className="flex items-center gap-3 mb-16 text-decoration-none">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <Cross size={20} color="white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">
              Life<span style={{ color: '#60a5fa' }}>Link</span>
            </span>
          </Link>
          <h2 className="font-display font-bold text-3xl text-white mb-4">
            Secure Healthcare Command Access
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: 15 }}>
            Access real-time hospital bed routing, instant dispatch telemetry, and multi-variable AI medical matching.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="p-4 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <p className="font-display font-bold text-2xl" style={{ color: s.color }}>{s.value}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
          <ShieldCheck size={14} color="#10b981" />
          <span>Encrypted HIPAA Compliant Authentication</span>
        </div>
      </motion.div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 440 }}
        >
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Cross size={18} color="white" />
            </div>
            <span className="font-display font-bold text-xl text-white">
              Life<span style={{ color: '#60a5fa' }}>Link</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>
              Sign In
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
              Enter your credentials to access your LifeLink account
            </p>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="btn btn-outline w-full btn-lg mb-6"
            style={{ gap: 10, justifyContent: 'center', background: 'rgba(255,255,255,0.04)', borderColor: 'var(--border)', cursor: 'pointer' }}
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 divider" />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              or sign in with email
            </span>
            <div className="flex-1 divider" />
          </div>

          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="mb-4">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                Email Address
              </label>
              <div className="input-group">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                Password
              </label>
              <div className="input-group" style={{ position: 'relative' }}>
                <Lock size={16} className="input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                  style={{ paddingRight: 44 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div style={{ textAlign: 'right', marginTop: 8 }}>
                <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--primary)', textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg mb-6"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Privacy Security Note */}
          <div
            className="p-3.5 rounded-xl mb-6 flex items-center gap-2.5"
            style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
          >
            <LockKeyhole size={16} color="#10b981" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              Your session is protected with end-to-end medical encryption and strict patient privacy controls.
            </p>
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
