import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Sparkles, Leaf, Sun, BarChart3, Download, Share2,
  ChevronDown, ChevronUp, Zap, CheckCircle2, AlertTriangle, Info,
  Layers, Play, RefreshCw, Settings2, Eye, EyeOff, Grid3x3,
  Maximize2, PanelLeftClose, PanelLeftOpen, Activity, Award,
  FlaskConical, Bed, Wind, Shield, Clock, TrendingUp, X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { lazy, Suspense } from 'react';

const Hospital3DViewer = lazy(() => import('../components/Hospital3DViewer'));

// ─── API Service ──────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function generateHospitalDesign(params) {
  const res = await fetch(`${API_URL}/api/generate-design`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Design generation failed');
  return res.json();
}

// ─── Slide-in Animations ──────────────────────────────────────────────────────
const slideRight = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, color, label, size = 72 }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={8}
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray 1.2s ease' }}
        />
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
          fill={color} fontSize={size === 72 ? 14 : 18} fontWeight="800" fontFamily="Outfit, sans-serif">
          {score}
        </text>
      </svg>
      <span style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', fontWeight: 600 }}>{label}</span>
    </div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({ icon: Icon, label, value, unit, color, trend }) {
  return (
    <motion.div
      variants={fadeUp}
      style={{
        background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '14px 16px',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}
      whileHover={{ background: 'rgba(255,255,255,0.07)' }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={18} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, color: '#64748b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{label}</p>
        <p style={{ fontSize: 18, fontWeight: 800, color: '#e2e8f0', margin: '2px 0 0', fontFamily: 'Outfit, sans-serif' }}>
          {value}<span style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8', marginLeft: 3 }}>{unit}</span>
        </p>
      </div>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TrendingUp size={12} color="#22c55e" />
          <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>{trend}</span>
        </div>
      )}
    </motion.div>
  );
}

// ─── Parameter Slider ─────────────────────────────────────────────────────────
function ParamSlider({ label, value, min, max, unit, onChange, color = '#3b82f6' }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 13, color, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
          {value}{unit}
        </span>
      </div>
      <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
        <div style={{ width: `${((value - min) / (max - min)) * 100}%`, height: '100%', borderRadius: 3, background: color, transition: 'width 0.2s' }} />
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          position: 'absolute', inset: 0, opacity: 0, width: '100%', cursor: 'pointer',
          marginTop: -6,
        }}
      />
      <style>{`input[type=range] { position: relative; }`}</style>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%', marginTop: 4, height: 4,
          WebkitAppearance: 'none', background: 'transparent', cursor: 'pointer',
          outline: 'none',
        }}
      />
    </div>
  );
}

// ─── Feature Tag ──────────────────────────────────────────────────────────────
function FeatureTag({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
        border: `1.5px solid ${active ? '#3b82f6' : 'rgba(255,255,255,0.12)'}`,
        background: active ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
        color: active ? '#93c5fd' : '#94a3b8', cursor: 'pointer',
        transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
      }}
    >
      {active ? '✓ ' : ''}{label}
    </button>
  );
}

// ─── Analysis Section ─────────────────────────────────────────────────────────
function AnalysisSection({ title, icon: Icon, color, score, points, expanded, onToggle }) {
  const good = points?.filter(p => p.type === 'positive') || [];
  const warn = points?.filter(p => p.type === 'warning') || [];
  const info_ = points?.filter(p => p.type === 'info') || [];

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)', borderRadius: 14,
      border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', padding: '14px 16px', background: 'none', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
        }}
      >
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={15} color={color} />
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>{title}</p>
        </div>
        <ScoreRing score={score} color={color} size={44} label="" />
        {expanded ? <ChevronUp size={14} color="#64748b" /> : <ChevronDown size={14} color="#64748b" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[...good.map(p => ({ ...p, icon: CheckCircle2, c: '#22c55e' })),
                ...warn.map(p => ({ ...p, icon: AlertTriangle, c: '#f59e0b' })),
                ...info_.map(p => ({ ...p, icon: Info, c: '#3b82f6' }))].map((point, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <point.icon size={13} color={point.c} style={{ marginTop: 1, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{point.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Default Analysis Data ────────────────────────────────────────────────────
function getDefaultAnalysis() {
  return {
    vastu: {
      score: 82,
      points: [
        { type: 'positive', text: 'Main entrance correctly aligned to East for positive energy flow' },
        { type: 'positive', text: 'Emergency ward placed in South-East (fire element) — optimal' },
        { type: 'warning', text: 'ICU placement could be improved — consider moving to West quadrant' },
        { type: 'info', text: 'Helipad on rooftop follows Akash (space) element principles' },
      ],
    },
    sustainability: {
      score: 78,
      points: [
        { type: 'positive', text: 'Green roof design reduces heat island effect by ~31%' },
        { type: 'positive', text: 'Optimal window-to-wall ratio (42%) for natural light' },
        { type: 'warning', text: 'Consider rainwater harvesting system for 30% water savings' },
        { type: 'info', text: 'Solar panel area on rooftop can offset ~22% of energy needs' },
      ],
    },
    structural: {
      score: 91,
      points: [
        { type: 'positive', text: 'Column grid optimized for seismic Zone III compliance' },
        { type: 'positive', text: 'Shear wall placement meets IS 1893 earthquake resistance standards' },
        { type: 'positive', text: 'Foundation load distribution is balanced across all quadrants' },
        { type: 'info', text: 'Recommend post-tensioned slabs for span > 8m in ICU & OT areas' },
      ],
    },
    compliance: {
      score: 88,
      points: [
        { type: 'positive', text: 'Minimum 2 lifts per NABH hospital accreditation guidelines' },
        { type: 'positive', text: 'Fire escape routes meet NBC 2016 Part 4 norms' },
        { type: 'warning', text: 'Ambulance bay width should be min. 6m for AIIMS standards' },
        { type: 'info', text: 'Handicap accessibility ramps meet Disability Act requirements' },
      ],
    },
  };
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function SmartHospitalDesign() {
  // Design Parameters
  const [params, setParams] = useState({
    hospital_type: 'Multi-Specialty',
    num_floors: 4,
    total_beds: 200,
    plot_area: 5000,
    vastu_compliant: true,
    green_certified: true,
    emergency_wing: true,
    icu_percentage: 15,
    operation_theatres: 4,
    features: ['Helipad', 'Pharmacy', 'Cafeteria', 'Laboratory', 'Radiology'],
  });

  const [design, setDesign] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [leftPanel, setLeftPanel] = useState(true);
  const [rightPanel, setRightPanel] = useState(true);
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' | 'metrics' | 'specs'
  const [expandedSection, setExpandedSection] = useState('vastu');
  const [analysis] = useState(getDefaultAnalysis());

  const allFeatures = ['Helipad', 'Pharmacy', 'Cafeteria', 'Laboratory', 'Radiology', 'Meditation Room', 'Library', 'Blood Bank', 'CSSD', 'Mortuary'];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateHospitalDesign(params);
      setDesign(result);
      toast.success('3D hospital design generated!', { icon: '🏗️' });
    } catch {
      // Use a rich local mock design when API unavailable
      setDesign(createMockDesign(params));
      toast.success('Demo design loaded!', { icon: '🏗️' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    const data = JSON.stringify({ params, design, analysis }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'hospital-design.json'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Design exported successfully!');
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)',
      background: '#0a0f1e', color: 'white', fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
    }}>
      {/* ── Top Header Bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 20px', background: 'rgba(15,23,42,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0,
        backdropFilter: 'blur(20px)', zIndex: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Building2 size={18} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 800, margin: 0, fontFamily: 'Outfit, sans-serif' }}>
              Smart Hospital Design Studio
            </h1>
            <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>
              AI-Powered 3D Architectural Platform
            </p>
          </div>
          {design && (
            <div style={{ marginLeft: 8 }}>
              <span style={{
                padding: '3px 10px', borderRadius: 20,
                background: 'rgba(34,197,94,0.15)', color: '#4ade80',
                fontSize: 11, fontWeight: 700, border: '1px solid rgba(34,197,94,0.3)',
              }}>
                ● Design Active
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setLeftPanel(p => !p)}
            style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', cursor: 'pointer' }}
          >
            {leftPanel ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 18px', borderRadius: 10,
              background: isGenerating ? 'rgba(59,130,246,0.4)' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              border: 'none', color: 'white', fontSize: 13, fontWeight: 700,
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
            }}
          >
            {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {isGenerating ? 'Generating…' : 'Generate Design'}
          </button>
          <button
            onClick={handleExport}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#e2e8f0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            <Download size={14} /> Export
          </button>
          <button
            onClick={() => setRightPanel(p => !p)}
            style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', cursor: 'pointer' }}
          >
            <Settings2 size={15} />
          </button>
        </div>
      </div>

      {/* ── Main 3-Panel Layout ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Left Panel: Design Parameters ── */}
        <AnimatePresence initial={false}>
          {leftPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                flexShrink: 0, background: 'rgba(15,23,42,0.95)',
                borderRight: '1px solid rgba(255,255,255,0.07)',
                overflowY: 'auto', overflowX: 'hidden',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{ padding: '16px 16px 24px', width: 280 }}>
                <p style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
                  Design Parameters
                </p>

                {/* Hospital Type */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>Hospital Type</label>
                  <select
                    value={params.hospital_type}
                    onChange={e => setParams(p => ({ ...p, hospital_type: e.target.value }))}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 10, padding: '8px 12px', color: '#e2e8f0', fontSize: 13,
                      outline: 'none', fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {['Multi-Specialty', 'Super-Specialty', 'District Hospital', 'Trauma Center', 'Children\'s Hospital', 'Women\'s Hospital'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Sliders */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 18 }}>
                  <ParamSlider
                    label="Number of Floors"
                    value={params.num_floors} min={2} max={12} unit=""
                    onChange={v => setParams(p => ({ ...p, num_floors: v }))}
                    color="#3b82f6"
                  />
                  <ParamSlider
                    label="Total Beds"
                    value={params.total_beds} min={50} max={1000} unit=""
                    onChange={v => setParams(p => ({ ...p, total_beds: v }))}
                    color="#8b5cf6"
                  />
                  <ParamSlider
                    label="Plot Area"
                    value={params.plot_area} min={1000} max={20000} unit=" m²"
                    onChange={v => setParams(p => ({ ...p, plot_area: v }))}
                    color="#06b6d4"
                  />
                  <ParamSlider
                    label="ICU Percentage"
                    value={params.icu_percentage} min={5} max={40} unit="%"
                    onChange={v => setParams(p => ({ ...p, icu_percentage: v }))}
                    color="#ef4444"
                  />
                  <ParamSlider
                    label="Operation Theatres"
                    value={params.operation_theatres} min={1} max={20} unit=""
                    onChange={v => setParams(p => ({ ...p, operation_theatres: v }))}
                    color="#8b5cf6"
                  />
                </div>

                {/* Toggle Options */}
                <p style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  Compliance & Standards
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                  {[
                    { key: 'vastu_compliant', label: '🔯 Vastu Shastra Compliant', color: '#8b5cf6' },
                    { key: 'green_certified', label: '🌿 IGBC Green Rating', color: '#10b981' },
                    { key: 'emergency_wing', label: '🚨 Dedicated Emergency Wing', color: '#ef4444' },
                  ].map(({ key, label, color }) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <div
                        onClick={() => setParams(p => ({ ...p, [key]: !p[key] }))}
                        style={{
                          width: 36, height: 20, borderRadius: 10,
                          background: params[key] ? color : 'rgba(255,255,255,0.1)',
                          position: 'relative', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0,
                        }}
                      >
                        <div style={{
                          position: 'absolute', top: 2, left: params[key] ? 18 : 2,
                          width: 16, height: 16, borderRadius: 8, background: 'white',
                          transition: 'left 0.2s',
                        }} />
                      </div>
                      <span style={{ fontSize: 12, color: '#cbd5e1' }}>{label}</span>
                    </label>
                  ))}
                </div>

                {/* Features */}
                <p style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  Facilities
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {allFeatures.map(f => (
                    <FeatureTag
                      key={f} label={f}
                      active={params.features.includes(f)}
                      onClick={() => setParams(p => ({
                        ...p,
                        features: p.features.includes(f) ? p.features.filter(x => x !== f) : [...p.features, f],
                      }))}
                    />
                  ))}
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  style={{
                    width: '100%', marginTop: 20, padding: '12px',
                    borderRadius: 12, border: 'none',
                    background: isGenerating ? 'rgba(59,130,246,0.4)' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    color: 'white', fontWeight: 800, fontSize: 14,
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    fontFamily: 'Outfit, sans-serif',
                    boxShadow: '0 6px 20px rgba(59,130,246,0.35)',
                  }}
                >
                  {isGenerating ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                  {isGenerating ? 'Generating…' : 'Generate 3D Model'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Center: 3D Viewport ── */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Suspense fallback={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#0f172a', gap: 16 }}>
              <div style={{ width: 48, height: 48, border: '3px solid rgba(59,130,246,0.3)', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p style={{ color: '#64748b', fontSize: 13 }}>Initializing 3D Engine…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          }>
            <Hospital3DViewer
              design={design}
              height="100%"
              showToolbar
            />
          </Suspense>

          {/* Empty state overlay */}
          {!design && !isGenerating && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(20px)',
                  borderRadius: 24, padding: '32px 40px', textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.1)', maxWidth: 360,
                  pointerEvents: 'auto',
                }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: 20,
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
                  border: '1px solid rgba(59,130,246,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <Building2 size={32} color="#3b82f6" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 10px', fontFamily: 'Outfit, sans-serif' }}>
                  3D Design Viewer
                </h2>
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px', lineHeight: 1.6 }}>
                  Configure parameters on the left panel and click Generate to create your 3D hospital model.
                  A demo model is currently loaded.
                </p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                  🖱 Drag to orbit · Scroll to zoom · Click room to inspect
                </p>
              </motion.div>
            </div>
          )}
        </div>

        {/* ── Right Panel: Analysis ── */}
        <AnimatePresence initial={false}>
          {rightPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                flexShrink: 0, background: 'rgba(15,23,42,0.95)',
                borderLeft: '1px solid rgba(255,255,255,0.07)',
                overflowY: 'auto', overflowX: 'hidden',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{ padding: '16px 16px 24px', width: 300 }}>
                {/* Tab Selector */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 18, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4 }}>
                  {[
                    { id: 'analysis', label: 'Analysis' },
                    { id: 'metrics',  label: 'Metrics' },
                    { id: 'specs',    label: 'Specs' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        flex: 1, padding: '6px 0', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                        background: activeTab === tab.id ? 'rgba(59,130,246,0.8)' : 'transparent',
                        color: activeTab === tab.id ? 'white' : '#64748b',
                        transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* ── Analysis Tab ── */}
                {activeTab === 'analysis' && (
                  <motion.div variants={{ visible: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="visible">
                    {/* Score Overview */}
                    <motion.div variants={fadeUp} style={{
                      background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.12))',
                      borderRadius: 16, padding: 16, marginBottom: 16,
                      border: '1px solid rgba(59,130,246,0.2)',
                    }}>
                      <p style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                        Overall Scores
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 8 }}>
                        <ScoreRing score={analysis.vastu.score}         color="#8b5cf6" label="Vastu" />
                        <ScoreRing score={analysis.sustainability.score} color="#10b981" label="Green" />
                        <ScoreRing score={analysis.structural.score}    color="#3b82f6" label="Structural" />
                        <ScoreRing score={analysis.compliance.score}    color="#f59e0b" label="Code" />
                      </div>
                    </motion.div>

                    {/* Analysis Sections */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { key: 'vastu',          title: 'Vastu Compliance',    icon: Sun,       color: '#8b5cf6', data: analysis.vastu },
                        { key: 'sustainability', title: 'Sustainability',       icon: Leaf,      color: '#10b981', data: analysis.sustainability },
                        { key: 'structural',     title: 'Structural Integrity', icon: Shield,    color: '#3b82f6', data: analysis.structural },
                        { key: 'compliance',     title: 'Code Compliance',      icon: CheckCircle2, color: '#f59e0b', data: analysis.compliance },
                      ].map(({ key, title, icon, color, data }) => (
                        <AnalysisSection
                          key={key}
                          title={title}
                          icon={icon}
                          color={color}
                          score={data.score}
                          points={data.points}
                          expanded={expandedSection === key}
                          onToggle={() => setExpandedSection(prev => prev === key ? null : key)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── Metrics Tab ── */}
                {activeTab === 'metrics' && (
                  <motion.div variants={{ visible: { transition: { staggerChildren: 0.06 } } }} initial="hidden" animate="visible"
                    style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <MetricCard icon={Bed}          label="Total Beds"          value={params.total_beds}                    unit="beds"   color="#3b82f6" trend="+12%" />
                    <MetricCard icon={Activity}     label="ICU Beds"            value={Math.round(params.total_beds * params.icu_percentage / 100)} unit="beds" color="#ef4444" />
                    <MetricCard icon={FlaskConical} label="OT Theatres"         value={params.operation_theatres}            unit="OTs"    color="#8b5cf6" />
                    <MetricCard icon={Layers}       label="Total Floors"        value={params.num_floors}                    unit="floors" color="#06b6d4" />
                    <MetricCard icon={Grid3x3}      label="Plot Area"           value={params.plot_area.toLocaleString()}    unit="m²"     color="#10b981" />
                    <MetricCard icon={Building2}    label="FAR"                 value={(params.num_floors * 0.65).toFixed(1)} unit="×"    color="#f59e0b" />
                    <MetricCard icon={Wind}         label="Natural Light"       value={42}                                   unit="%"      color="#06b6d4" trend="optimal" />
                    <MetricCard icon={Zap}          label="Energy Efficiency"   value={78}                                   unit="/100"   color="#10b981" trend="+8%" />
                    <MetricCard icon={Clock}        label="Est. Build Time"     value={Math.round(params.num_floors * 8 + 12)} unit="mo"  color="#94a3b8" />
                  </motion.div>
                )}

                {/* ── Specs Tab ── */}
                {activeTab === 'specs' && (
                  <motion.div variants={{ visible: { transition: { staggerChildren: 0.06 } } }} initial="hidden" animate="visible"
                    style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { label: 'Hospital Type',      value: params.hospital_type },
                      { label: 'Total Built-up Area', value: `${(params.plot_area * params.num_floors * 0.6).toLocaleString()} m²` },
                      { label: 'Parking Bays',       value: `${Math.round(params.total_beds * 0.3)} vehicles` },
                      { label: 'Vastu Compliant',    value: params.vastu_compliant ? '✅ Yes' : '❌ No' },
                      { label: 'IGBC Green Rating',  value: params.green_certified ? '✅ Gold Target' : '❌ No' },
                      { label: 'Emergency Wing',     value: params.emergency_wing ? '✅ Yes (24/7)' : '❌ No' },
                      { label: 'Facilities',         value: params.features.join(', ') || 'None selected' },
                      { label: 'Fire Safety',        value: 'NBC 2016 Compliant' },
                      { label: 'Seismic Zone',       value: 'Zone III (IS 1893)' },
                      { label: 'Lifts Required',     value: `${Math.max(2, Math.ceil(params.num_floors / 3))} units` },
                    ].map(({ label, value }) => (
                      <motion.div key={label} variants={fadeUp} style={{
                        borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10,
                      }}>
                        <p style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, margin: '0 0 4px', letterSpacing: '0.04em' }}>{label}</p>
                        <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>{value}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Mock Design Generator (used when backend unavailable) ────────────────────
function createMockDesign(params) {
  const floorCount = params.num_floors || 4;
  const floorTemplates = [
    {
      name: 'Ground Floor', rooms: [
        { name: 'Main Reception',     type: 'Reception',  x: 0,   z: 0,  width: 6, depth: 5, vastu_score: 85, sustainability_score: 80, occupancy: 70 },
        { name: 'Emergency Room',     type: 'Emergency',  x: -6,  z: 0,  width: 5, depth: 5, vastu_score: 72, sustainability_score: 68, occupancy: 90 },
        { name: 'Pharmacy',           type: 'Pharmacy',   x: 6,   z: 0,  width: 4, depth: 4, vastu_score: 78, sustainability_score: 75, occupancy: 50 },
        { name: 'OPD Corridor',       type: 'Corridor',   x: 0,   z: 5,  width: 8, depth: 2, vastu_score: 65, sustainability_score: 70, occupancy: 40 },
        { name: 'OPD Ward A',         type: 'Ward',       x: -5,  z: 5,  width: 4, depth: 4, vastu_score: 82, sustainability_score: 79, occupancy: 60 },
        { name: 'OPD Ward B',         type: 'Ward',       x: 5,   z: 5,  width: 4, depth: 4, vastu_score: 80, sustainability_score: 77, occupancy: 55 },
      ]
    },
    {
      name: '1st Floor', rooms: [
        { name: 'ICU Unit A',   type: 'ICU',       x: -5, z: 0, width: 5, depth: 5, vastu_score: 65, sustainability_score: 72, occupancy: 85 },
        { name: 'ICU Unit B',   type: 'ICU',       x: 5,  z: 0, width: 5, depth: 5, vastu_score: 70, sustainability_score: 68, occupancy: 75 },
        { name: 'OT-1',         type: 'Operation', x: 0,  z: 5, width: 5, depth: 5, vastu_score: 88, sustainability_score: 82, occupancy: 45 },
        { name: 'OT-2',         type: 'Operation', x: -5, z: 5, width: 4, depth: 5, vastu_score: 85, sustainability_score: 80, occupancy: 40 },
        { name: 'CSSD',         type: 'Storage',   x: 5,  z: 5, width: 3, depth: 3, vastu_score: 55, sustainability_score: 60, occupancy: 30 },
      ]
    },
    {
      name: '2nd Floor', rooms: [
        { name: 'Radiology',    type: 'Radiology',     x: -5, z: 0, width: 5, depth: 5, vastu_score: 73, sustainability_score: 70, occupancy: 50 },
        { name: 'Laboratory',   type: 'Laboratory',    x: 5,  z: 0, width: 5, depth: 5, vastu_score: 77, sustainability_score: 74, occupancy: 55 },
        { name: 'Cafeteria',    type: 'Cafeteria',     x: 0,  z: 5, width: 6, depth: 5, vastu_score: 85, sustainability_score: 82, occupancy: 65 },
        { name: 'Admin Office', type: 'Administration',x: -5, z: -4,width: 4, depth: 4, vastu_score: 80, sustainability_score: 78, occupancy: 45 },
      ]
    },
    {
      name: '3rd Floor', rooms: [
        { name: 'Private Ward A',  type: 'Ward',           x: -5, z: 0, width: 4, depth: 4, vastu_score: 90, sustainability_score: 87, occupancy: 40 },
        { name: 'Private Ward B',  type: 'Ward',           x: 5,  z: 0, width: 4, depth: 4, vastu_score: 88, sustainability_score: 85, occupancy: 35 },
        { name: 'Conference Room', type: 'Administration', x: 0,  z: 5, width: 5, depth: 4, vastu_score: 82, sustainability_score: 80, occupancy: 25 },
        { name: 'Equipment Store', type: 'Storage',        x: 0,  z: -4,width: 4, depth: 4, vastu_score: 60, sustainability_score: 65, occupancy: 20 },
      ]
    },
  ];

  return {
    floors: floorTemplates.slice(0, floorCount),
    hospital_type: params.hospital_type,
    total_beds: params.total_beds,
    plot_area: params.plot_area,
  };
}
