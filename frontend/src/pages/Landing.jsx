import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Building2, Brain, Ambulance, Stethoscope, Droplets, MessageSquareHeart,
  Shield, Heart, ChevronRight, Cross, Activity, Star, CheckCircle,
  ArrowRight, Sparkles, Navigation, AlertTriangle, Globe, Compass
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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouse = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 35;
      const y = (e.clientY / window.innerHeight - 0.5) * 35;
      setMousePos({ x, y });
    };
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
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
      {/* ── LAYER 1: OVERSIZED BACKGROUND STROKE TYPOGRAPHY ── */}
      <div
        className="bg-text-hero"
        style={{
          top: 140,
          left: '50%',
          transform: `translate3d(calc(-50% + ${mousePos.x * 0.4}px), ${mousePos.y * 0.4 - scrollY * 0.15}px, -150px)`,
        }}
      >
        HEALTHCARE
      </div>

      <div
        className="bg-text-hero bg-text-glow"
        style={{
          top: 380,
          left: '50%',
          transform: `translate3d(calc(-50% + ${mousePos.x * -0.5}px), ${mousePos.y * -0.5 - scrollY * 0.25}px, -200px)`,
          fontSize: 'clamp(3.5rem, 11vw, 9rem)',
        }}
      >
        SPATIAL COMMAND
      </div>

      {/* Atmospheric Spatial Ambient Space */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 50% 10%, rgba(14, 100, 255, 0.3) 0%, transparent 65%),
            radial-gradient(circle at 85% 85%, rgba(124, 58, 237, 0.25) 0%, transparent 55%),
            radial-gradient(circle at 15% 55%, rgba(11, 188, 184, 0.2) 0%, transparent 50%),
            linear-gradient(rgba(14, 100, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 100, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 54px 54px, 54px 54px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Floating Spatial Nav */}
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
          transform: `translate3d(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px, 20px)`,
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

      {/* ── SECTION 1: SPATIAL HERO WITH OVERLAPPING DEPTH ── */}
      <section
        style={{
          position: 'relative',
          zIndex: 3,
          paddingTop: 180,
          paddingBottom: 120,
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
            padding: '8px 22px',
            borderRadius: 99,
            background: 'rgba(14, 100, 255, 0.25)',
            border: '1.5px solid rgba(96, 165, 250, 0.5)',
            boxShadow: '0 10px 30px rgba(14,100,255,0.35)',
            marginBottom: 28,
            transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 30px)`,
          }}
        >
          <Sparkles size={16} color="#60a5fa" />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Spatial AI Healthcare Ecosystem
          </span>
        </motion.div>

        {/* Foreground Title overlapping 3D Scene */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="text-spatial-hero"
          style={{
            maxWidth: 1100,
            marginBottom: 24,
            transform: `translate3d(${mousePos.x * 0.6}px, ${mousePos.y * 0.6}px, 40px)`,
            position: 'relative',
            zIndex: 4,
          }}
        >
          EMERGENCY CARE. <br />
          <span style={{ background: 'linear-gradient(135deg, #0e64ff 0%, #0bbcb8 50%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            REIMAGINED IN 3D.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2 }}
          style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'var(--text-secondary)',
            maxWidth: 780,
            lineHeight: 1.6,
            marginBottom: 44,
            fontWeight: 500,
            position: 'relative',
            zIndex: 4,
            transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px, 30px)`,
          }}
        >
          Real-time hospital bed routing, instant dispatch telemetry, and multi-variable AI medical matching in an interactive spatial 3D command environment.
        </motion.p>

        {/* Hero Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            flexWrap: 'wrap',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 4,
            transform: `translate3d(${mousePos.x * 0.7}px, ${mousePos.y * 0.7}px, 50px)`,
          }}
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary btn-lg"
            style={{ fontSize: 17, padding: '16px 40px', borderRadius: 22 }}
          >
            Enter Spatial Command Center <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate('/hospitals')}
            className="btn btn-outline btn-lg"
            style={{ fontSize: 17, padding: '16px 36px', borderRadius: 22 }}
          >
            <Navigation size={18} color="#60a5fa" /> Explore Hospital Finder
          </button>
        </motion.div>
      </section>

      {/* ── SECTION 2: SCROLL-DRIVEN FEATURE CAPABILITIES ── */}
      <section style={{ position: 'relative', zIndex: 3, padding: '120px 32px 140px 32px', maxWidth: 1400, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 70 }}>
            <h2 className="text-spatial-title" style={{ marginBottom: 16 }}>
              COMPLETE HEALTHCARE SUBSYSTEMS
            </h2>
            <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto' }}>
              Engineered for immediate emergency response, precise hospital routing, and live clinical telemetry.
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
                  background: 'rgba(9, 15, 32, 0.92)',
                  border: '2px solid rgba(14, 100, 255, 0.3)',
                  backdropFilter: 'blur(20px)',
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
                    Active Spatial Node <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: SYSTEM METRICS STRIP ── */}
      <section style={{ position: 'relative', zIndex: 3, padding: '80px 32px 100px 32px', background: 'rgba(8,14,30,0.95)', borderTop: '2px solid var(--border)', borderBottom: '2px solid var(--border)' }}>
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
      <footer style={{ position: 'relative', zIndex: 3, padding: '100px 32px 60px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 740, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16, fontFamily: 'Outfit, sans-serif' }}>
            READY TO COMMAND LIFELINK IN 3D?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 36 }}>
            Access real-time hospital discovery, AI condition matching, and emergency dispatch telemetry.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary btn-lg"
            style={{ fontSize: 17, padding: '16px 40px', borderRadius: 22 }}
          >
            Launch Command Center <ArrowRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
