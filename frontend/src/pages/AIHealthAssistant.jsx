import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Send, AlertTriangle, CheckCircle2, User,
  Phone, ChevronRight, MessageSquare, Shield,
  Activity, Thermometer, Brain, Heart, Wind, Pill,
  Loader2, Sparkles, X, Info
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { AI_RESPONSES } from '../data/mockData';

// ─── Constants ────────────────────────────────────────────────────────────────

const QUICK_SYMPTOMS = [
  { label: 'Fever', icon: Thermometer, color: '#f59e0b', query: 'I have a high fever' },
  { label: 'Headache', icon: Brain, color: '#8b5cf6', query: 'I am experiencing a severe headache' },
  { label: 'Chest Pain', icon: Heart, color: '#ef4444', query: 'I have chest pain' },
  { label: 'Breathing', icon: Wind, color: '#0e64ff', query: 'I am having difficulty breathing' },
  { label: 'Stomach', icon: Activity, color: '#10b981', query: 'I have stomach pain' },
  { label: 'Back Pain', icon: Pill, color: '#f97316', query: 'I am experiencing severe back pain' },
];

const SUGGESTED_QUESTIONS = [
  'What are symptoms of a heart attack?',
  'How do I manage high blood pressure?',
  'When should I go to the ER?',
  'What is the normal body temperature?',
  'How to reduce fever at home?',
  'Signs of a stroke — what to watch for?',
];

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'ai',
  text: "Hello! I'm your AI Health Assistant powered by Anti Gravity. I can help you understand symptoms, get health guidance, and know when to seek emergency care. Please remember — I'm here to assist, not replace a medical professional.\n\nHow can I help you today?",
  timestamp: new Date(),
  severity: null,
  recommendations: [],
  seekEmergency: false,
  specialist: null,
};

// ─── Stethoscope icon ─────────────────────────────────────────────────────────

function Stethoscope({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
      <circle cx="20" cy="10" r="2"/>
    </svg>
  );
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-end gap-3 mb-4"
    >
      <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0bbcb8, #0e64ff)' }}>
        <Bot size={18} color="#fff" />
      </div>
      <div style={{ padding: '12px 16px', borderRadius: 16, borderBottomLeftRadius: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.span key={i}
              style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--secondary)', display: 'block' }}
              animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Severity Badge ───────────────────────────────────────────────────────────

function SeverityBadge({ severity }) {
  const config = {
    low: { label: 'Low Severity', cls: 'badge-success', Icon: CheckCircle2 },
    moderate: { label: 'Moderate Severity', cls: 'badge-warning', Icon: AlertTriangle },
    critical: { label: 'CRITICAL — Emergency', cls: 'badge-danger', Icon: AlertTriangle },
  };
  const c = config[severity];
  if (!c) return null;
  return (
    <span className={`badge ${c.cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700 }}>
      <c.Icon size={11} />
      {c.label}
    </span>
  );
}

// ─── AI Message Bubble ────────────────────────────────────────────────────────

function AIBubble({ msg, onConsult }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 16 }}
    >
      {/* Avatar */}
      <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0bbcb8, #0e64ff)', boxShadow: '0 2px 8px rgba(11,188,184,0.35)' }}>
        <Bot size={18} color="#fff" />
      </div>

      <div style={{ flex: 1, maxWidth: '80%' }}>
        {/* Emergency Alert */}
        {msg.seekEmergency && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ marginBottom: 8, padding: '10px 14px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(239,68,68,0.08)', border: '1.5px solid #ef4444' }}
          >
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={15} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#ef4444', fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>🚨 EMERGENCY — Call 112 Immediately</p>
              <p style={{ color: '#ef4444', fontSize: 11, opacity: 0.85, marginTop: 2 }}>This condition requires immediate emergency care. Do not delay.</p>
            </div>
            <a href="tel:112" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, background: '#ef4444', color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
              <Phone size={12} />Call 112
            </a>
          </motion.div>
        )}

        {/* Bubble */}
        <div style={{ padding: '12px 16px', borderRadius: 16, borderBottomLeftRadius: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          {msg.severity && msg.severity !== 'low' && (
            <div style={{ marginBottom: 8 }}>
              <SeverityBadge severity={msg.severity} />
            </div>
          )}

          <p style={{ color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>
            {msg.text}
          </p>

          {/* Recommendations */}
          {msg.recommendations && msg.recommendations.length > 0 && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Recommendations
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {msg.recommendations.map((rec, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={14} style={{ marginTop: 2, flexShrink: 0, color: 'var(--success)' }} />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specialist chip */}
          {msg.specialist && (
            <button
              onClick={() => onConsult(msg.specialist)}
              style={{
                marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '5px 12px', borderRadius: 99, cursor: 'pointer',
                background: 'var(--primary-light)', color: 'var(--primary)',
                border: '1px solid var(--primary)', fontSize: 12, fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              <Stethoscope size={12} />
              Consult {msg.specialist}
              <ChevronRight size={12} />
            </button>
          )}
        </div>

        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, paddingLeft: 4 }}>
          {format(msg.timestamp, 'hh:mm a')}
        </p>
      </div>
    </motion.div>
  );
}

// ─── User Message Bubble ──────────────────────────────────────────────────────

function UserBubble({ msg }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 12, marginBottom: 16 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: '75%' }}>
        <div className="chat-bubble-user" style={{ padding: '12px 16px', borderRadius: 16, borderBottomRightRadius: 4, wordBreak: 'break-word' }}>
          <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{msg.text}</p>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, paddingRight: 4 }}>
          {format(msg.timestamp, 'hh:mm a')}
        </p>
      </div>
      <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', boxShadow: '0 2px 8px rgba(14,100,255,0.3)' }}>
        <User size={16} color="#fff" />
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AIHealthAssistant() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const MAX_CHARS = 500;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg = { id: `user-${Date.now()}`, role: 'user', text: trimmed, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.ai.chat(trimmed);
      if (res.success) {
        const { message, severity, recommendations, seekEmergency, specialist } = res.data;
        const aiMsg = { id: `ai-${Date.now()}`, role: 'ai', text: message, timestamp: new Date(), severity, recommendations, seekEmergency, specialist };
        setMessages(prev => [...prev, aiMsg]);
        if (seekEmergency) toast.error('⚠️ Emergency detected! Call 112 immediately.', { duration: 6000 });
      }
    } catch (err) {
      toast.error('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const handleConsult = (specialist) => {
    toast.success(`Finding ${specialist} specialists near you…`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>

      {/* ── Emergency Banner ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showEmergencyBanner && (
          <motion.div
            initial={{ y: -44, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -44, opacity: 0 }}
            style={{
              flexShrink: 0, background: 'linear-gradient(90deg, #dc2626, #ef4444)',
              padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, zIndex: 10,
            }}
          >
            <Phone size={13} color="#fff" />
            <p style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>
              🚨 For life-threatening emergencies, call <strong>112</strong> immediately — do not wait for AI advice
            </p>
            <button onClick={() => setShowEmergencyBanner(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <X size={16} color="rgba(255,255,255,0.8)" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Body Row ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Left Sidebar ──────────────────────────────────────────────────── */}
        <aside style={{ width: 260, flexShrink: 0, background: 'var(--bg-card)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Sidebar Header */}
          <div className="gradient-primary" style={{ padding: '18px 16px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="#fff" />
              </div>
              <div>
                <h2 style={{ color: '#fff', fontSize: 14, fontWeight: 700, lineHeight: 1.2, margin: 0 }}>AI Health Assistant</h2>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, margin: 0 }}>Powered by Anti Gravity</p>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '7px 10px', display: 'flex', alignItems: 'flex-start', gap: 7 }}>
              <Shield size={12} color="rgba(255,255,255,0.9)" style={{ marginTop: 1, flexShrink: 0 }} />
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, lineHeight: 1.5, margin: 0 }}>
                Not a substitute for professional medical advice
              </p>
            </div>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
            {/* Quick Symptoms */}
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              Quick Symptoms
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 18 }}>
              {QUICK_SYMPTOMS.map((s) => {
                const Icon = s.icon;
                return (
                  <motion.button key={s.label} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { setInput(s.query); inputRef.current?.focus(); }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 4px', borderRadius: 10, cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--bg-primary)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.background = `${s.color}12`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-primary)'; }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={14} color={s.color} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>{s.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <div style={{ height: 1, background: 'var(--border)', marginBottom: 14 }} />

            {/* Suggested Questions */}
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              Suggested Questions
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <motion.button key={i} whileHover={{ x: 3 }}
                  onClick={() => sendMessage(q)}
                  style={{ textAlign: 'left', padding: '7px 8px', borderRadius: 8, border: '1px solid transparent', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 7, transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.borderColor = 'rgba(14,100,255,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'transparent'; }}
                >
                  <MessageSquare size={11} style={{ marginTop: 2, color: 'var(--primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{q}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 5px var(--success)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>AI online · ~1.5s response</span>
            </div>
          </div>
        </aside>

        {/* ── Main Chat Area ─────────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Chat Topbar */}
          <div style={{ padding: '13px 22px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 7px var(--success)' }} />
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, margin: 0 }}>Medical Chat Session</h3>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, marginBottom: 0 }}>
                {messages.length - 1} message{messages.length - 1 !== 1 ? 's' : ''} · {format(new Date(), 'hh:mm a')}
              </p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={10} /> AI Active
              </span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            <AnimatePresence initial={false}>
              {messages.map((msg) =>
                msg.role === 'ai'
                  ? <AIBubble key={msg.id} msg={msg} onConsult={handleConsult} />
                  : <UserBubble key={msg.id} msg={msg} />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isLoading && <TypingIndicator />}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '14px 22px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Info size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
                Describe symptoms clearly · Press Enter to send · Shift+Enter for new line
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value.slice(0, MAX_CHARS))}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your symptoms or ask a health question…"
                  rows={2}
                  disabled={isLoading}
                  style={{
                    width: '100%', resize: 'none', padding: '11px 14px', paddingRight: 52,
                    borderRadius: 12, border: '1.5px solid var(--border)',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)',
                    fontSize: 14, lineHeight: 1.5, outline: 'none',
                    fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(14,100,255,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
                <span style={{
                  position: 'absolute', bottom: 8, right: 10, fontSize: 10,
                  color: input.length > MAX_CHARS * 0.8 ? 'var(--warning)' : 'var(--text-muted)',
                }}>
                  {input.length}/{MAX_CHARS}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="btn btn-primary"
                style={{
                  width: 46, height: 46, borderRadius: 12, padding: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  opacity: (!input.trim() || isLoading) ? 0.5 : 1,
                  cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(14,100,255,0.35)',
                }}
              >
                {isLoading ? <Loader2 size={19} className="animate-spin" /> : <Send size={19} />}
              </motion.button>
            </div>

            {/* Quick action pills */}
            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              {QUICK_SYMPTOMS.slice(0, 4).map(s => {
                const Icon = s.icon;
                return (
                  <button key={s.label} onClick={() => sendMessage(s.query)} disabled={isLoading}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 99, border: '1px solid var(--border)', background: 'var(--bg-primary)', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.color = s.color; }}}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    <Icon size={10} />{s.label}
                  </button>
                );
              })}
              <button onClick={() => setMessages([WELCOME_MESSAGE])}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 99, border: '1px dashed var(--border)', background: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                <X size={10} /> Clear Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
