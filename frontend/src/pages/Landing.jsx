import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Building2, Brain, Ambulance, Stethoscope, Droplets, MessageSquareHeart,
  MapPin, Clock, Shield, Heart, ChevronRight, Cross, Phone, Activity,
  Star, CheckCircle, Zap, Globe, Lock, ArrowRight
} from 'lucide-react';

const FEATURES = [
  { icon: Building2, title: 'Hospital Finder', desc: 'Find nearby hospitals with real-time bed availability and ratings', color: '#0e64ff', bg: 'rgba(14,100,255,0.1)' },
  { icon: Brain, title: 'AI Recommendations', desc: 'AI scores hospitals based on distance, ICU beds, and your condition', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
  { icon: Ambulance, title: 'Ambulance Booking', desc: 'Request and track ambulances with live ETA updates', color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
  { icon: Stethoscope, title: 'Doctor Search', desc: 'Find specialists and book appointments instantly', color: '#0bbcb8', bg: 'rgba(11,188,184,0.1)' },
  { icon: Droplets, title: 'Blood Bank', desc: 'Search blood availability by type across nearby banks', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  { icon: MessageSquareHeart, title: 'AI Health Guide', desc: 'Describe symptoms and get instant AI-powered health guidance', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
];

const STEPS = [
  { num: '01', title: 'Create Your Profile', desc: 'Sign up and add your medical history, allergies, and emergency contacts in minutes.' },
  { num: '02', title: 'Search or Use SOS', desc: 'Find nearby hospitals, doctors, or press the SOS button for instant emergency help.' },
  { num: '03', title: 'Get AI Recommendations', desc: 'Our AI analyzes your condition and finds the best hospital for your specific needs.' },
];

const TESTIMONIALS = [
  { name: 'Meera Iyer', role: 'Patient, Chennai', text: 'Anti Gravity helped me find a hospital with available ICU beds during my father\'s emergency. The AI recommendation was spot on.', rating: 5 },
  { name: 'Dr. Sanjay Kumar', role: 'Cardiologist', text: 'The platform has significantly reduced patient intake time. Patients arrive knowing exactly what to expect — it\'s revolutionary.', rating: 5 },
  { name: 'Rahul Singh', role: 'Patient, Delhi', text: 'Booked an appointment with a specialist in under 2 minutes. The ambulance tracking feature gave me peace of mind during a crisis.', rating: 5 },
];

const STATS = [
  { value: '500+', label: 'Hospitals' },
  { value: '1,000+', label: 'Doctors' },
  { value: '50,000+', label: 'Patients Helped' },
  { value: '99.9%', label: 'Uptime' },
];

const FadeIn = ({ children, delay = 0, y = 20 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
};

export default function Landing() {
  return (
    <div style={{ background: '#fff', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(14,100,255,0.08)', padding: '0 48px', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#0e64ff,#0040cc)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cross size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 20, color: '#0f172a' }}>
            Anti<span style={{ background: 'linear-gradient(135deg,#0e64ff,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Gravity</span>
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/login" style={{ padding: '8px 20px', borderRadius: 9, fontSize: 14, fontWeight: 600, color: '#475569', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: 14 }}>
            Get Started <ChevronRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #f0f4ff 0%, #ffffff 50%, #f0f7ff 100%)',
        padding: '80px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.5,
          backgroundImage: 'linear-gradient(rgba(14,100,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(14,100,255,0.05) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Gradient orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,100,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 720, zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 99, background: 'rgba(14,100,255,0.08)', border: '1px solid rgba(14,100,255,0.2)', fontSize: 13, fontWeight: 600, color: '#0e64ff', marginBottom: 24 }}>
              <Zap size={13} /> AI-Powered Emergency Healthcare
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, lineHeight: 1.1, color: '#0f172a', marginBottom: 24 }}>
            Emergency Healthcare.
            <br />
            <span style={{ background: 'linear-gradient(135deg,#0e64ff,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Powered by AI.
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ fontSize: 18, color: '#64748b', lineHeight: 1.7, marginBottom: 36, maxWidth: 560, margin: '0 auto 36px' }}>
            Find hospitals, book doctors, request ambulances, and get instant AI health guidance — all from one intelligent platform.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ fontSize: 16 }}>
              Start Your Journey <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg" style={{ fontSize: 16 }}>
              Demo Login
            </Link>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{ fontSize: 13, color: '#94a3b8', marginTop: 20 }}>
            No credit card required · Free to start · Works instantly
          </motion.p>
        </div>

        {/* Floating stat cards */}
        {[
          { label: '🏥 Hospitals Nearby', val: '6 found', style: { left: '4%', top: '30%' } },
          { label: '🛏 ICU Beds Available', val: '43 beds', style: { right: '4%', top: '25%' } },
          { label: '🚑 Ambulance ETA', val: '4 min', style: { left: '6%', bottom: '30%' } },
          { label: '⭐ AI Score', val: '98/100', style: { right: '6%', bottom: '30%' } },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.15 }}
            style={{
              position: 'absolute', ...card.style,
              background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(14,100,255,0.15)', borderRadius: 14,
              padding: '10px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              display: 'none', // Hidden on small screens via CSS-in-JS workaround
            }}
            className="hidden lg:block">
            <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>{card.label}</p>
            <p style={{ fontSize: 16, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: '#0e64ff' }}>{card.val}</p>
          </motion.div>
        ))}
      </section>

      {/* Stats */}
      <section style={{ background: 'linear-gradient(135deg,#0e64ff,#7c3aed)', padding: '48px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 24, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          {STATS.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.1}>
              <p style={{ fontSize: 42, fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'white', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>{s.label}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '100px 48px', background: '#f8faff' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0e64ff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Features</span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 40, fontWeight: 900, color: '#0f172a', marginTop: 8, marginBottom: 12 }}>
              Everything healthcare, in one place
            </h2>
            <p style={{ fontSize: 17, color: '#64748b', maxWidth: 480, margin: '0 auto' }}>
              A complete emergency healthcare platform built for patients and powered by AI
            </p>
          </div>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeIn key={f.title} delay={i * 0.08}>
                <div style={{ background: 'white', borderRadius: 20, padding: 28, border: '1px solid rgba(14,100,255,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition: 'all 0.2s', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(14,100,255,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                    <Icon size={24} style={{ color: f.color }} />
                  </div>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 19, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '100px 48px' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0e64ff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>How It Works</span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 40, fontWeight: 900, color: '#0f172a', marginTop: 8 }}>Simple. Fast. Intelligent.</h2>
          </div>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 32, maxWidth: 960, margin: '0 auto' }}>
          {STEPS.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.15}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#0e64ff,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(14,100,255,0.3)' }}>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800, color: 'white' }}>{step.num}</span>
                </div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 48px', background: '#f8faff' }}>
        <FadeIn>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 48 }}>
            Trusted by patients & doctors
          </h2>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.1}>
              <div style={{ background: 'white', borderRadius: 18, padding: 24, border: '1px solid rgba(14,100,255,0.08)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" stroke="#f59e0b" />)}
                </div>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 18, fontStyle: 'italic' }}>"{t.text}"</p>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: '#94a3b8' }}>{t.role}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '100px 48px' }}>
        <FadeIn>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 48 }}>Simple Pricing</h2>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, maxWidth: 680, margin: '0 auto' }}>
          {[
            { name: 'Free', price: '₹0', period: '/forever', features: ['Find hospitals & doctors', 'Basic AI health guidance', 'Appointment booking', 'Blood bank search', '5 AI queries/day'], cta: 'Get Started Free', primary: false },
            { name: 'Premium', price: '₹299', period: '/month', features: ['Everything in Free', 'Unlimited AI queries', 'Priority ambulance booking', 'Advanced AI recommendations', 'Family profile management', '24/7 priority support'], cta: 'Start Premium', primary: true },
          ].map(plan => (
            <FadeIn key={plan.name}>
              <div style={{
                borderRadius: 20, padding: 32, textAlign: 'center',
                background: plan.primary ? 'linear-gradient(135deg,#0e64ff,#7c3aed)' : 'white',
                color: plan.primary ? 'white' : '#0f172a',
                border: plan.primary ? 'none' : '1.5px solid rgba(14,100,255,0.15)',
                boxShadow: plan.primary ? '0 20px 60px rgba(14,100,255,0.35)' : '0 2px 12px rgba(0,0,0,0.04)',
                transform: plan.primary ? 'scale(1.04)' : 'none',
              }}>
                <p style={{ fontSize: 14, fontWeight: 700, opacity: plan.primary ? 0.85 : 0.6, marginBottom: 8 }}>{plan.name}</p>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 48, fontWeight: 900, lineHeight: 1 }}>{plan.price}</p>
                <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 28 }}>{plan.period}</p>
                <ul style={{ listStyle: 'none', marginBottom: 28, textAlign: 'left' }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, marginBottom: 10, opacity: plan.primary ? 0.9 : 0.8 }}>
                      <CheckCircle size={15} style={{ color: plan.primary ? 'rgba(255,255,255,0.8)' : '#10b981', flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" style={{
                  display: 'block', padding: '12px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14,
                  background: plan.primary ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg,#0e64ff,#0040cc)',
                  color: 'white', textDecoration: 'none', border: plan.primary ? '1.5px solid rgba(255,255,255,0.3)' : 'none',
                }}>
                  {plan.cta}
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 48px', background: 'linear-gradient(135deg,#070b14,#0d1b40)', textAlign: 'center' }}>
        <FadeIn>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 40, fontWeight: 900, color: 'white', marginBottom: 16 }}>
            Ready to take control of your health?
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)', marginBottom: 36 }}>
            Join 50,000+ patients already using Anti Gravity
          </p>
          <Link to="/register" className="btn btn-primary btn-lg" style={{ fontSize: 16 }}>
            Get Started for Free <ArrowRight size={18} />
          </Link>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0a0f1a', padding: '40px 48px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#0e64ff,#0040cc)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cross size={15} color="white" />
            </div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 16, color: 'white' }}>AntiGravity</span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>© 2026 Anti Gravity Healthcare Platform. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
