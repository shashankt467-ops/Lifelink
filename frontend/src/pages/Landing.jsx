import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Building2, Brain, Ambulance, Stethoscope, Droplets, MessageSquareHeart,
  MapPin, Clock, Shield, Heart, ChevronRight, Cross, Phone, Activity,
  Star, CheckCircle, Zap, Globe, Lock, ArrowRight, Sparkles, Navigation, AlertTriangle
} from 'lucide-react';

const FEATURES = [
  { icon: Building2, title: 'Spatial Hospital Finder', desc: 'Discover nearest emergency centers with live ICU bed indicators & interactive spatial maps', color: '#0e64ff', bg: 'rgba(14,100,255,0.15)' },
  { icon: Brain, title: 'AI Scoring Engine', desc: 'Multi-variable AI algorithm matching patient condition with optimal emergency facilities', color: '#7c3aed', bg: 'rgba(124,58,237,0.15)' },
  { icon: Ambulance, title: 'Dispatch Command', desc: 'Real-time telemetry ambulance dispatch with continuous GPS route optimization', color: '#dc2626', bg: 'rgba(220,38,38,0.15)' },
  { icon: Stethoscope, title: 'Specialist Network', desc: 'Direct digital link with board-certified emergency physicians & surgeons', color: '#0bbcb8', bg: 'rgba(11,188,184,0.15)' },
  { icon: Droplets, title: 'Blood Reserve Mesh', desc: 'Live unit inventory monitoring across regional blood banks and emergency repositories', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  { icon: MessageSquareHeart, title: 'AI Health Assistant', desc: '24/7 intelligent symptom assessment and immediate emergency triage recommendations', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
];

const STATS = [
  { value: '500+', label: 'Connected Hospitals' },
  { value: '1,200+', label: 'On-Call Doctors' },
  { value: '50,000+', label: 'Critical Emergencies Routed' },
  { value: '99.99%', label: 'Uptime SLA' },
];

const FadeIn = ({ children, delay = 0, y = 30 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default function Landing() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 30;
    const y = (clientY / window.innerHeight - 0.5) * 30;
    setMousePos({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        background: '#030712',
        color: '#ffffff',
        fontFamily: 'Inter, sans-serif',
        minHeight: '100vh',
        overflowX: 'hidden',
        position: 'relative',
        perspective: 1200,
      }}
    >
      {/* Background Perspective Space */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(14, 100, 255, 0.28) 0%, transparent 70%),
            radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.22) 0%, transparent 60%),
            radial-gradient(circle at 20% 50%, rgba(11, 188, 184, 0.18) 0%, transparent 50%),
            linear-gradient(rgba(14, 100, 255, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 100, 255, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 54px 54px, 54px 54px',
          pointerEvents: 'none',
          zIndex: 0,
          transform: `translate3d(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px, -100px)`,
          transition: 'transform 0.2s ease-out',
        }}
      />

      {/* Floating Header */}
      <nav
        style={{
          position: 'fixed',
          top: 24,
          left: 32,
          right: 32,
          zIndex: 100,
          background: 'rgba(9, 15, 32, 0.92)',
          border: '2px solid rgba(14, 100, 255, 0.4)',
          borderRadius: 26,
          padding: '0 32px',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.25)',
          transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 20px)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: 14,
              background: 'linear-gradient(135deg,#0e64ff,#0040cc)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(14,100,255,0.5)',
            }}
          >
            <Cross size={22} color="white" />
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 24, letterSpacing: '-0.02em', color: '#ffffff' }}>
            Life<span style={{ background: 'linear-gradient(135deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Link</span>
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/login" className="btn btn-outline btn-sm" style={{ fontSize: 13, padding: '9px 20px' }}>
            Sign In
          </Link>
          <Link to="/dashboard" className="btn btn-primary btn-sm" style={{ fontSize: 13, padding: '9px 22px' }}>
            Open Command Center <ChevronRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Main Spatial Hero Section */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          paddingTop: 160,
          paddingBottom: 100,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        {/* Floating Brand Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 20px',
            borderRadius: 99,
            background: 'rgba(14, 100, 255, 0.25)',
            border: '1.5px solid rgba(96, 165, 250, 0.5)',
            boxShadow: '0 10px 30px rgba(14,100,255,0.3)',
            marginBottom: 32,
            transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px, 30px)`,
          }}
        >
          <Sparkles size={16} color="#60a5fa" />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Spatial AI Healthcare Command Architecture
          </span>
        </motion.div>

        {/* Oversized Spatial Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-spatial-hero"
          style={{
            maxWidth: 1100,
            marginBottom: 24,
            transform: `translate3d(${mousePos.x * 0.7}px, ${mousePos.y * 0.7}px, 40px)`,
          }}
        >
          EMERGENCY HEALTHCARE. <br />
          <span style={{ background: 'linear-gradient(135deg, #0e64ff 0%, #0bbcb8 50%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            COMMANDED BY SPATIAL AI.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'var(--text-secondary)',
            maxWidth: 760,
            lineHeight: 1.6,
            marginBottom: 44,
            fontWeight: 500,
            transform: `translate3d(${mousePos.x * 0.6}px, ${mousePos.y * 0.6}px, 30px)`,
          }}
        >
          Real-time hospital bed routing, instant dispatch telemetry, and multi-variable AI medical matching in a spatial 3D navigation ecosystem.
        </motion.p>

        {/* Hero Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            flexWrap: 'wrap',
            justifyContent: 'center',
            transform: `translate3d(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px, 50px)`,
          }}
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary btn-lg"
            style={{ fontSize: 17, padding: '16px 40px', borderRadius: 22 }}
          >
            Enter Spatial Command Platform <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate('/hospitals')}
            className="btn btn-outline btn-lg"
            style={{ fontSize: 17, padding: '16px 36px', borderRadius: 22 }}
          >
            <Navigation size={18} color="#60a5fa" /> Explore Hospital Finder
          </button>
        </motion.div>

        {/* Spatial Floating Preview Console */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.4 }}
          style={{
            marginTop: 70,
            maxWidth: 1200,
            width: '100%',
            background: 'var(--bg-card)',
            border: '2.5px solid rgba(14, 100, 255, 0.45)',
            borderRadius: 36,
            padding: 36,
            boxShadow: '0 40px 120px rgba(0,0,0,0.95), 0 16px 60px rgba(14, 100, 255, 0.4)',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: `translate3d(${mousePos.x * 0.9}px, ${mousePos.y * 0.9}px, 60px) rotateX(${mousePos.y * -0.2}deg) rotateY(${mousePos.x * 0.2}deg)`,
            transition: 'transform 0.2s ease-out',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, textAlign: 'left' }}>
            <div style={{ padding: 20, borderRadius: 24, background: 'rgba(10,16,34,0.9)', border: '1.5px solid var(--border)', transform: 'translateZ(20px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Activity size={20} color="#60a5fa" />
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Live System Status</span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 900, color: '#34d399', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Operational</p>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>500+ Hospital nodes active</span>
            </div>
            <div style={{ padding: 20, borderRadius: 24, background: 'rgba(10,16,34,0.9)', border: '1.5px solid var(--border)', transform: 'translateZ(26px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Brain size={20} color="#a78bfa" />
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>AI Recommendation</span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 900, color: '#60a5fa', margin: 0, fontFamily: 'Outfit, sans-serif' }}>Active Engine</p>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Condition match score 98%</span>
            </div>
            <div style={{ padding: 20, borderRadius: 24, background: 'rgba(10,16,34,0.9)', border: '1.5px solid var(--border)', transform: 'translateZ(32px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <AlertTriangle size={20} color="#ef4444" />
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Emergency Response</span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 900, color: '#f87171', margin: 0, fontFamily: 'Outfit, sans-serif' }}>2.4 min Avg ETA</p>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Instant SOS telemetry</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid Section */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 32px 120px 32px', maxWidth: 1400, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 className="text-spatial-title" style={{ marginBottom: 16 }}>
              COMPLETE EMERGENCY HEALTHCARE ECOSYSTEM
            </h2>
            <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto' }}>
              Engineered for immediate response, precise hospital selection, and seamless clinical coordination.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 28 }}>
          {FEATURES.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.1}>
              <div
                className="card"
                style={{
                  padding: 32,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div>
                  <div
                    className="icon-elevated-3d"
                    style={{
                      width: 58, height: 58, borderRadius: 20,
                      background: f.bg, border: `1.5px solid ${f.color}60`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 24,
                    }}
                  >
                    <f.icon size={28} color={f.color} />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, fontFamily: 'Outfit, sans-serif' }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
                <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa', display: 'flex', alignItems: 'center', gap: 6 }}>
                    Active Subsystem <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* System Metrics Strip */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 32px 100px 32px', background: 'rgba(9,15,32,0.95)', borderTop: '2px solid var(--border)', borderBottom: '2px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32, textAlign: 'center' }}>
          {STATS.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.1}>
              <div>
                <p style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, color: '#60a5fa', lineHeight: 1, margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                  {s.value}
                </p>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {s.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer style={{ position: 'relative', zIndex: 1, padding: '80px 32px 60px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16, fontFamily: 'Outfit, sans-serif' }}>
            READY TO EXPERIENCE LIFELINK SPATIAL COMMAND?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 32 }}>
            Access real-time hospital finder, AI recommendations, and emergency telemetry instant services.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary btn-lg"
            style={{ fontSize: 16, padding: '15px 36px' }}
          >
            Launch Command Center Now <ArrowRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
