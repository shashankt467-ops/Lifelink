import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Building2, Brain, Ambulance, Heart, Cross, Stethoscope, Shield } from 'lucide-react';

const stats = [
  { label: 'Hospitals', value: '500+', color: '#0e64ff' },
  { label: 'Doctors', value: '1,000+', color: '#0bbcb8' },
  { label: 'Patients Helped', value: '50K+', color: '#7c3aed' },
  { label: 'Uptime', value: '99.9%', color: '#10b981' },
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
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message.includes('wrong-password') || err.message.includes('user-not-found')
        ? 'Invalid email or password' : 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Logged in with Google! 🎉');
      navigate('/dashboard');
    } catch { toast.error('Google sign-in failed'); }
    finally { setGoogleLoading(false); }
  };

  const fillDemo = () => { setEmail('demo@antigravity.health'); setPassword('demo123'); };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left Panel */}
      <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between p-12 w-[480px] flex-shrink-0"
        style={{ background: 'linear-gradient(145deg, #070b14 0%, #0d1b40 50%, #0a1628 100%)' }}>
        <div>
          <Link to="/" className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Cross size={20} color="white" />
            </div>
            <span className="font-display font-bold text-xl text-white">Anti<span style={{ color: '#60a5fa' }}>Gravity</span></span>
          </Link>
          <h2 className="font-display font-bold text-3xl text-white mb-4">Your health, powered<br />by intelligence.</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontSize: 15 }}>
            Find hospitals, book doctors, request ambulances, and get AI-powered health guidance — all from one platform.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map(s => (
            <div key={s.label} className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="font-display font-bold text-2xl" style={{ color: s.color }}>{s.value}</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>© 2026 Anti Gravity Healthcare. All rights reserved.</p>
      </motion.div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 440 }}>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Cross size={18} color="white" />
            </div>
            <span className="font-display font-bold text-xl text-gradient">AntiGravity</span>
          </div>

          <h1 className="font-display font-bold text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 15 }}>Sign in to your Anti Gravity account</p>

          {/* Demo credentials */}
          <div className="p-4 rounded-xl mb-6 flex items-start gap-3" style={{ background: 'rgba(14,100,255,0.06)', border: '1px solid rgba(14,100,255,0.2)' }}>
            <Shield size={16} style={{ color: 'var(--primary)', marginTop: 1, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginBottom: 2 }}>Demo Account</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                Email: <code>demo@antigravity.health</code> · Password: <code>demo123</code>
              </p>
              <button onClick={fillDemo} className="btn btn-sm" style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', fontSize: 12 }}>
                Fill Demo Credentials
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-4">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Email Address</label>
              <div className="input-group">
                <Mail size={16} className="input-icon" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="your@email.com" />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Password</label>
              <div className="input-group" style={{ position: 'relative' }}>
                <Lock size={16} className="input-icon" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="••••••••" style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div style={{ textAlign: 'right', marginTop: 8 }}>
                <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--primary)', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg mb-4" style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 divider" />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>or continue with</span>
            <div className="flex-1 divider" />
          </div>

          <button onClick={handleGoogle} disabled={googleLoading} className="btn btn-outline w-full btn-lg mb-6" style={{ gap: 10 }}>
            {googleLoading
              ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              : <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            }
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
