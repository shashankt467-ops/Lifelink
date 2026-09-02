import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Eye, EyeOff, Cross, ShieldCheck, LockKeyhole } from 'lucide-react';

const getStrength = (pwd) => {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
};

const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['#ef4444', '#f59e0b', '#0bbcb8', '#10b981'];

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const strength = getStrength(form.password);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (!agree) {
      toast.error('You must accept the Terms & Conditions and Privacy Policy to create an account');
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created successfully! Welcome to LifeLink');
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        toast.error('This email address is already registered');
      } else if (err.code === 'auth/invalid-email') {
        toast.error('Please enter a valid email address');
      } else if (err.code === 'auth/weak-password') {
        toast.error('Password should be at least 6 characters');
      } else {
        toast.error(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Account created with Google!');
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        toast.error('Google sign-in was cancelled');
      } else {
        toast.error('Google sign-in failed');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-center p-12 w-[440px] flex-shrink-0"
        style={{ background: 'linear-gradient(145deg, #070b14 0%, #0d1b40 50%, #0a1628 100%)', borderRight: '1px solid var(--border)' }}
      >
        <Link to="/" className="flex items-center gap-3 mb-12 text-decoration-none">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <Cross size={20} color="white" />
          </div>
          <span className="font-display font-bold text-xl text-white">
            Life<span style={{ color: '#60a5fa' }}>Link</span>
          </span>
        </Link>
        <h2 className="font-display font-bold text-3xl text-white mb-4">
          Join 50,000+ patients<br />using LifeLink Command
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: 15, marginBottom: 32 }}>
          Get instant access to real-time hospital finder, AI recommendations, bed availability, and emergency telemetry.
        </p>
        {[
          '🏥 Find hospitals near you in seconds',
          '🤖 Get AI-powered condition matching',
          '🚑 Request emergency ambulances with telemetry',
          '👨‍⚕️ Book specialist appointments instantly',
        ].map((f) => (
          <p key={f} style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 12 }}>
            {f}
          </p>
        ))}
      </motion.div>

      {/* Right Panel Form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
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

          <h1 className="font-display font-bold text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 15 }}>
            Create your LifeLink account to get started
          </p>

          <form onSubmit={handleRegister}>
            {/* Full Name */}
            <div className="mb-4">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                Full Name
              </label>
              <div className="input-group">
                <User size={16} className="input-icon" />
                <input
                  value={form.name}
                  onChange={set('name')}
                  className="input"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                Email Address
              </label>
              <div className="input-group">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  className="input"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                Password
              </label>
              <div className="input-group" style={{ position: 'relative' }}>
                <Lock size={16} className="input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  className="input"
                  placeholder="Min. 6 characters"
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
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1, height: 3, borderRadius: 2,
                          background: i < strength ? strengthColors[strength - 1] : 'var(--border)',
                          transition: 'all 0.3s',
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: strengthColors[strength - 1] || 'var(--text-muted)' }}>
                    {form.password ? strengthLabels[strength - 1] || 'Too short' : ''}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-5">
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                Confirm Password
              </label>
              <div className="input-group">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  className="input"
                  placeholder="Confirm password"
                  required
                  style={{ borderColor: form.confirm && form.confirm !== form.password ? '#ef4444' : undefined }}
                />
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>Passwords do not match</p>
              )}
            </div>

            {/* Mandatory Terms & Conditions Checkbox */}
            <label className="flex items-start gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                style={{ width: 18, height: 18, marginTop: 2, cursor: 'pointer', accentColor: 'var(--primary)' }}
                required
              />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                I agree to the{' '}
                <a href="#terms" onClick={(e) => { e.preventDefault(); toast('LifeLink Terms & Conditions: Emergency healthcare routing platform usage guidelines.', { icon: '📄' }); }} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}>
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a href="#privacy" onClick={(e) => { e.preventDefault(); toast('LifeLink Privacy Policy: Encrypted HIPAA compliant patient data protection.', { icon: '🔒' }); }} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}>
                  Privacy Policy
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg mb-4"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 divider" />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              or
            </span>
            <div className="flex-1 divider" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="btn btn-outline w-full btn-lg mb-6"
            style={{ gap: 10, justifyContent: 'center', background: 'rgba(255,255,255,0.04)', borderColor: 'var(--border)' }}
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

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
