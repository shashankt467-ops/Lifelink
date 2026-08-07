import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, Cross, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Reset email sent!');
    } catch { toast.error('Failed to send reset email'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-primary)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 420 }}>
        <div className="card p-8">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Cross size={16} color="white" />
            </div>
            <span className="font-display font-bold text-lg text-gradient">AntiGravity</span>
          </Link>

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>Reset Password</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Email Address</label>
                    <div className="input-group">
                      <Mail size={16} className="input-icon" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="your@email.com" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg mb-4" style={{ opacity: loading ? 0.7 : 1 }}>
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Send Reset Link'}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.1)' }}>
                  <CheckCircle size={32} color="#10b981" />
                </div>
                <h2 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>Check your email</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
                  We've sent a password reset link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <Link to="/login" className="flex items-center justify-center gap-2" style={{ color: 'var(--primary)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
            <ArrowLeft size={14} /> Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
