import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import usePlatformSettingsService from '../../../services/usePlatformSettingsService';
import {
  LogIn, BarChart2, Globe, LayoutDashboard, Lock, Palette, CheckCircle,
  Server, Code2, Image, Layers, ChevronDown, ChevronRight,
  ArrowRight, Shield, Eye, Briefcase, Award, GraduationCap, MessageSquare,
  Terminal, Monitor, Cloud, Zap, Database, Users, GitBranch, Activity,
  TrendingUp, Star,
} from 'lucide-react';

interface LandingProps {
  onGetStarted?: () => void;
}

const C = {
  bg: '#060608',
  surface: '#0C0D10',
  surfaceAlt: '#101318',
  surfaceElevated: '#141720',
  border: 'rgba(255,255,255,0.055)',
  borderMid: 'rgba(255,255,255,0.09)',
  borderHigh: 'rgba(255,255,255,0.14)',
  teal: '#14B8A0',
  tealLight: '#2DD4BF',
  tealDim: 'rgba(20, 184, 160, 0.08)',
  tealBorder: 'rgba(20, 184, 160, 0.22)',
  tealGlow: 'rgba(20, 184, 160, 0.4)',
  purple: '#8B5CF6',
  purpleLight: '#A78BFA',
  purpleDim: 'rgba(139, 92, 246, 0.08)',
  blue: '#3B82F6',
  blueLight: '#60A5FA',
  blueDim: 'rgba(59, 130, 246, 0.08)',
  amber: '#F59E0B',
  red: '#EF4444',
  green: '#22C55E',
  text: '#EEEEF0',
  textSub: '#9CA3AF',
  muted: '#4B5563',
};

const CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0, dur = 0.55) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: dur, ease: CUBIC, delay },
});

// ── Data ─────────────────────────────────────────────────────────────────────

const TERMINAL_LINES = [
  { t: 0, text: '$ ./portfolios-builder start', color: C.tealLight },
  { t: 600, text: '✓ Spring Boot API running on :8080', color: C.green },
  { t: 1100, text: '✓ Admin dashboard running on :5174', color: C.green },
  { t: 1600, text: '✓ Public portfolio running on :5173', color: C.green },
  { t: 2100, text: '✓ MongoDB connected', color: C.green },
  { t: 2600, text: '✓ Cloudinary CDN configured', color: C.green },
  { t: 3100, text: '✓ JWT auth active', color: C.green },
  { t: 3600, text: '→ All systems operational', color: C.tealLight },
];

const FEATURES = [
  {
    icon: LayoutDashboard, color: C.teal,
    title: 'Full-Featured CMS',
    desc: 'Manage experience, skills, projects, certifications, education, and testimonials — all from one clean admin panel without touching a line of code.',
  },
  {
    icon: Globe, color: C.blue,
    title: 'Production Portfolio',
    desc: 'Your public site is generated from dashboard data. Beautifully animated, fully responsive, SEO-optimised — you never write HTML or CSS.',
  },
  {
    icon: Palette, color: C.purple,
    title: 'Dynamic Theme Engine',
    desc: '10+ colour palettes switchable from the dashboard. Switch from indigo to emerald in one click and the public site updates instantly.',
  },
  {
    icon: BarChart2, color: C.amber,
    title: 'Real-Time Analytics',
    desc: 'Track profile views, visitor sessions, device breakdown, and resume downloads. Know exactly when a recruiter is browsing your work.',
  },
  {
    icon: Cloud, color: '#06B6D4',
    title: 'Cloudinary CDN',
    desc: 'All images are stored on Cloudinary and served via global CDN with on-the-fly optimisation — fast everywhere, always.',
  },
  {
    icon: Lock, color: C.red,
    title: 'JWT Auth + RBAC',
    desc: 'Secure login with signed JWT tokens. Role-based access control keeps the admin private while your portfolio stays fully public.',
  },
];

const CONTENT_SECTIONS = [
  { icon: Briefcase, label: 'Experience', desc: 'Role, company, dates, location, employment type, tech stack' },
  { icon: Code2, label: 'Skills', desc: 'Categorised with logo, proficiency level, and progress bars' },
  { icon: Monitor, label: 'Projects', desc: 'Images, live demo, GitHub links, descriptions, skill tags' },
  { icon: Award, label: 'Achievements', desc: 'Proof images, issuer, date, and description' },
  { icon: CheckCircle, label: 'Certifications', desc: 'Credential ID, verification URL, and expiry tracking' },
  { icon: GraduationCap, label: 'Education', desc: 'Degree, field of study, institution, grade, years' },
  { icon: Star, label: 'Testimonials', desc: 'Reviews with name, role, company, avatar, and LinkedIn' },
  { icon: MessageSquare, label: 'Contact', desc: 'Submissions land in your admin inbox — no third-party forms' },
];

const TECH_STACK = [
  { cat: 'Backend', color: C.teal, items: ['Spring Boot 3', 'Java 21', 'MongoDB', 'JWT Auth', 'Cloudinary SDK', 'REST APIs'] },
  { cat: 'Admin Frontend', color: C.purple, items: ['React 18', 'TypeScript', 'Vite 5', 'Tailwind CSS 4', 'Framer Motion', 'MUI v6'] },
  { cat: 'Public Portfolio', color: C.blue, items: ['React 18', 'TypeScript', 'Vite 5', 'Tailwind CSS 4', 'Framer Motion', 'React Router v7'] },
];

const STATS = [
  { value: '3', label: 'Applications', sub: 'Admin · API · Portfolio', icon: Layers, color: C.teal },
  { value: '9+', label: 'Content Sections', sub: 'Fully CMS-driven', icon: Database, color: C.purple },
  { value: '10+', label: 'Theme Palettes', sub: 'Live switchable', icon: Palette, color: C.blue },
  { value: '< 1s', label: 'Load Time', sub: 'Vite + Cloudinary CDN', icon: Zap, color: C.amber },
];

const ARCHITECTURE_STEPS = [
  {
    n: '01', icon: Terminal, color: C.purple,
    title: 'Admin Dashboard',
    label: 'portfolio-fe · :5174',
    desc: 'You log in here. Add content, upload images, configure your theme, manage roles, and publish everything — no code required.',
  },
  {
    n: '02', icon: Server, color: C.teal,
    title: 'REST API',
    label: 'portfolio-be · :8080',
    desc: 'Spring Boot 3 handles authentication, persists data to MongoDB, manages Cloudinary uploads, and serves structured JSON to both frontends.',
  },
  {
    n: '03', icon: Globe, color: C.blue,
    title: 'Public Portfolio',
    label: 'portfolio-main · :5173',
    desc: 'Anyone with the link sees this. Reads from the same API and renders your portfolio beautifully — no login required.',
  },
];

const FAQS = [
  {
    q: 'Is this SaaS or self-hosted?',
    a: 'Self-hosted. You deploy the Spring Boot backend, the admin frontend, and the public frontend wherever you like — VPS, cloud VM, Vercel/Railway combo. You own all data and infrastructure.',
  },
  {
    q: 'Do I need to write code to update my portfolio?',
    a: 'No. The admin dashboard is a full no-code CMS. Fill in forms, upload images, click Save. The public portfolio reflects every change immediately.',
  },
  {
    q: 'How is the dashboard protected?',
    a: 'JWT tokens are issued on login and validated on every admin API request. Role-based permissions control which sections each user can access. Password resets flow through email verification.',
  },
  {
    q: 'Can I use my own domain?',
    a: 'Yes. Point your domain\'s DNS to your deployment and configure the frontend build with your domain. Standard static hosting setup — no special configuration needed.',
  },
  {
    q: 'What database does it use?',
    a: 'MongoDB. The Spring Boot backend uses Spring Data MongoDB for persistence. Any MongoDB-compatible host works — MongoDB Atlas is the simplest cloud option.',
  },
  {
    q: 'How does theme switching work?',
    a: 'The public portfolio fetches the active colour palette from the API on load. Change the theme in the dashboard and the public site picks it up on next load — no rebuild required.',
  },
];

// ── Terminal Animation ────────────────────────────────────────────────────────

const AnimatedTerminal = () => {
  const [visible, setVisible] = useState<number[]>([]);

  useEffect(() => {
    const timers = TERMINAL_LINES.map(({ t }, i) =>
      window.setTimeout(() => setVisible(v => [...v, i]), t)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        border: `1px solid ${C.borderMid}`,
        background: C.surface,
        boxShadow: `0 32px 64px rgba(0,0,0,0.7), 0 0 0 1px ${C.teal}12`,
        fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
      }}
    >
      {/* Title bar */}
      <div style={{
        background: '#0A0B0E',
        padding: '11px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        borderBottom: `1px solid ${C.border}`,
      }}>
        {[C.red, C.amber, C.green].map((c, i) => (
          <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.85 }} />
        ))}
        <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: C.muted }}>
          terminal — portfolios-builder
        </div>
      </div>
      {/* Lines */}
      <div style={{ padding: '18px 20px', minHeight: 180 }}>
        {TERMINAL_LINES.map(({ text, color }, i) => (
          <AnimatePresence key={i}>
            {visible.includes(i) && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  fontSize: 12.5,
                  color,
                  lineHeight: 1.9,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {text}
                {i === TERMINAL_LINES.length - 1 && visible.includes(i) && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    style={{ display: 'inline-block', width: 7, height: 13, background: C.tealLight, borderRadius: 2 }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
    </div>
  );
};

// ── Dashboard Mockup ──────────────────────────────────────────────────────────

const MiniChart = ({ color }: { color: string }) => {
  const pts = [28, 45, 36, 60, 52, 78, 65, 82, 74, 91];
  const h = 40;
  const w = 120;
  const max = Math.max(...pts);
  const coords = pts
    .map((v, i) => `${(i / (pts.length - 1)) * w},${h - (v / max) * h}`)
    .join(' ');

  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`g-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polyline
        points={`0,${h} ${coords} ${w},${h}`}
        fill={`url(#g-${color})`}
        stroke="none"
      />
      <polyline
        points={coords}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

const DashboardMockup = () => (
  <div
    style={{
      borderRadius: 18,
      overflow: 'hidden',
      border: `1px solid ${C.borderMid}`,
      background: C.surface,
      boxShadow: `0 48px 96px rgba(0,0,0,0.65), 0 0 0 1px ${C.teal}10`,
    }}
  >
    {/* Title bar */}
    <div style={{
      background: '#0A0B0E',
      padding: '11px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      borderBottom: `1px solid ${C.border}`,
    }}>
      {[C.red, C.amber, C.green].map((c, i) => (
        <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.85 }} />
      ))}
      <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: C.muted, fontFamily: 'monospace' }}>
        Portfolios Builder Admin — Dashboard
      </div>
      <div style={{
        fontSize: 10,
        fontFamily: 'monospace',
        color: C.teal,
        background: `${C.teal}12`,
        border: `1px solid ${C.tealBorder}`,
        padding: '2px 8px',
        borderRadius: 6,
      }}>
        ● Live
      </div>
    </div>

    {/* Body */}
    <div style={{ display: 'flex', height: 360 }}>
      {/* Sidebar */}
      <div style={{
        width: 165,
        background: '#080A0C',
        borderRight: `1px solid ${C.border}`,
        padding: '14px 0',
        flexShrink: 0,
      }}>
        <div style={{
          padding: '0 14px 10px',
          fontSize: 9,
          fontFamily: 'monospace',
          color: C.muted,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}>
          Navigation
        </div>
        {[
          { label: 'Dashboard', active: true, icon: '◉' },
          { label: 'Experience', active: false, icon: '○' },
          { label: 'Projects', active: false, icon: '○' },
          { label: 'Skills', active: false, icon: '○' },
          { label: 'Education', active: false, icon: '○' },
          { label: 'Achievements', active: false, icon: '○' },
          { label: 'Certifications', active: false, icon: '○' },
          { label: 'Testimonials', active: false, icon: '○' },
          { label: 'Themes', active: false, icon: '○' },
        ].map(({ label, active, icon }) => (
          <div
            key={label}
            style={{
              padding: '7px 14px',
              fontSize: 11.5,
              color: active ? C.tealLight : C.muted,
              background: active ? `${C.teal}10` : 'transparent',
              borderLeft: active ? `2px solid ${C.teal}` : '2px solid transparent',
              fontFamily: 'monospace',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <span style={{ fontSize: 8, opacity: 0.7 }}>{icon}</span>
            {label}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '18px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Good morning, Admin</div>
            <div style={{ fontSize: 10, color: C.muted, fontFamily: 'monospace', marginTop: 2 }}>
              portfolio.dashboard · All systems operational
            </div>
          </div>
          <div style={{
            fontSize: 10,
            fontFamily: 'monospace',
            color: C.green,
            background: `${C.green}10`,
            border: `1px solid ${C.green}25`,
            padding: '3px 8px',
            borderRadius: 6,
          }}>
            100% complete
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            { label: 'Profile Views', val: '2,841', delta: '+12%', color: C.teal, ChartPts: true },
            { label: 'Projects', val: '14', delta: '+2', color: C.purple, ChartPts: false },
            { label: 'Skills', val: '36', delta: '↑', color: C.blue, ChartPts: false },
            { label: 'Messages', val: '9', delta: '3 new', color: C.amber, ChartPts: false },
          ].map(({ label, val, delta, color, ChartPts }) => (
            <div
              key={label}
              style={{
                background: C.surfaceAlt,
                borderRadius: 10,
                padding: '10px 12px',
                border: `1px solid ${C.border}`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color, fontFamily: 'monospace' }}>{val}</div>
              <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{label}</div>
              <div style={{
                fontSize: 9,
                color: color,
                marginTop: 3,
                fontFamily: 'monospace',
                background: `${color}10`,
                display: 'inline-block',
                padding: '1px 5px',
                borderRadius: 4,
              }}>
                {delta}
              </div>
              {ChartPts && (
                <div style={{ position: 'absolute', bottom: 6, right: 8, opacity: 0.6 }}>
                  <MiniChart color={color} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Weekly chart area */}
        <div style={{
          background: C.surfaceAlt,
          borderRadius: 10,
          padding: '12px 14px',
          border: `1px solid ${C.border}`,
        }}>
          <div style={{ fontSize: 10, color: C.textSub, marginBottom: 10, fontFamily: 'monospace', display: 'flex', justifyContent: 'space-between' }}>
            <span>Weekly Views</span>
            <span style={{ color: C.teal }}>+18% this week</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 42 }}>
            {[30, 55, 42, 70, 60, 85, 72].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  borderRadius: '3px 3px 0 0',
                  background: i === 5
                    ? C.teal
                    : `${C.teal}25`,
                  border: i === 5 ? `1px solid ${C.tealBorder}` : 'none',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: 8, color: C.muted, fontFamily: 'monospace' }}>{d}</span>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div>
          <div style={{ fontSize: 10, color: C.textSub, marginBottom: 7, fontFamily: 'monospace' }}>Recent Activity</div>
          {[
            { dot: C.teal, text: 'Profile updated · 2m ago' },
            { dot: C.amber, text: 'New contact message · 14m ago' },
            { dot: C.blue, text: 'Project "Portfolios Builder" added · 1h ago' },
            { dot: C.purple, text: 'Theme changed to Indigo · 3h ago' },
          ].map(({ dot, text }) => (
            <div key={text} style={{
              padding: '5px 10px',
              borderRadius: 6,
              background: C.surfaceAlt,
              marginBottom: 4,
              fontSize: 10,
              color: C.muted,
              border: `1px solid ${C.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: dot, flexShrink: 0 }} />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ── Sub-components ────────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p style={{
    fontSize: 10.5,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: C.teal,
    marginBottom: 12,
  }}>
    {children}
  </p>
);

const SectionTitle = ({ children, center = true }: { children: React.ReactNode; center?: boolean }) => (
  <h2 style={{
    fontWeight: 800,
    fontSize: 'clamp(24px, 3.2vw, 40px)',
    letterSpacing: '-0.03em',
    lineHeight: 1.12,
    margin: '0 0 16px',
    textAlign: center ? 'center' : 'left',
  }}>
    {children}
  </h2>
);

// ── Main ──────────────────────────────────────────────────────────────────────

const Landing: React.FC<LandingProps> = ({ onGetStarted = () => {} }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [profileMaster, setProfileMaster] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState<'loading' | 'ok' | 'down'>('loading');
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const platformSettingsService = usePlatformSettingsService();

  useEffect(() => {
    platformSettingsService.getSettings().then((res: any) => {
      const url = res?.data?.data?.bannerImageUrl;
      if (url) setBannerUrl(url);
    });

    fetch('/api/v1/health')
      .then((r) => setApiStatus(r.ok ? 'ok' : 'down'))
      .catch(() => setApiStatus('down'));

    fetch('/api/v1/public/profile-master')
      .then((r) => r.ok ? r.json() : null)
      .then((json) => { if (json?.data) setProfileMaster(json.data); })
      .catch(() => {});
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    }
  };

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      color: C.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
      overflowX: 'hidden',
    }}>

      {/* ── Grid overlay ──────────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        backgroundImage: `
          linear-gradient(${C.border} 1px, transparent 1px),
          linear-gradient(90deg, ${C.border} 1px, transparent 1px)
        `,
        backgroundSize: '72px 72px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 30%, black 20%, transparent 80%)',
      }} />

      {/* ── Navbar ────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: CUBIC }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 clamp(20px, 5vw, 72px)', height: 62,
          background: `${C.bg}E0`,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 16px ${C.tealGlow}50`,
          }}>
            <Layers size={14} color="#fff" />
          </div>
          <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.025em' }}>
            Portfolio<span style={{ color: C.teal }}>OS</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* API health badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 99,
            fontSize: 10.5, fontFamily: 'monospace', fontWeight: 600,
            background: apiStatus === 'ok' ? 'rgba(34,197,94,0.1)' : apiStatus === 'down' ? 'rgba(239,68,68,0.1)' : 'rgba(156,163,175,0.1)',
            color: apiStatus === 'ok' ? C.green : apiStatus === 'down' ? C.red : C.textSub,
            border: `1px solid ${apiStatus === 'ok' ? 'rgba(34,197,94,0.25)' : apiStatus === 'down' ? 'rgba(239,68,68,0.25)' : 'rgba(156,163,175,0.15)'}`,
          }} className="hidden-mobile">
            {apiStatus !== 'loading' && (
              <motion.span
                animate={apiStatus === 'ok' ? { opacity: [1, 0.3, 1] } : {}}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block', flexShrink: 0 }}
              />
            )}
            API {apiStatus === 'loading' ? '…' : apiStatus === 'ok' ? 'online' : 'offline'}
          </div>

          <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }} className="hidden-mobile">
            {['Features', 'How It Works', 'Tech Stack', 'FAQ'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                style={{ fontSize: 13, color: C.textSub, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.textSub; }}
              >
                {item}
              </a>
            ))}
          </nav>

          <motion.button
            onClick={onGetStarted}
            whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${C.tealGlow}` }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '9px 22px',
              borderRadius: 10,
              background: `linear-gradient(135deg, ${C.teal}, ${C.blue}80)`,
              color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
              boxShadow: `0 0 20px rgba(20,184,160,0.28)`,
            }}
          >
            <LogIn size={14} /> Login
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          padding: '100px clamp(20px, 5vw, 72px) 60px',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Parallax glow */}
        <motion.div
          style={{
            position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
            width: 800, height: 800,
            background: `radial-gradient(circle, rgba(20,184,160,0.07) 0%, transparent 62%)`,
            filter: 'blur(60px)',
            x: springX,
            y: springY,
            left: '50%', top: '50%',
            translateX: '-50%', translateY: '-50%',
          }}
        />

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="hero-grid">
          {/* Left: copy */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
          >
            {/* Eyebrow */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '5px 14px', borderRadius: 99,
                fontSize: 10.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.14em',
                color: C.teal, background: C.tealDim, border: `1px solid ${C.tealBorder}`,
                marginBottom: 28,
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: C.teal, display: 'inline-block', flexShrink: 0 }}
              />
              Full-Stack Portfolio Platform
            </motion.div>

            {/* Headline */}
            <motion.div variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: CUBIC } } }}>
              <h1 style={{ fontWeight: 900, fontSize: 'clamp(44px, 6vw, 80px)', lineHeight: 0.95, letterSpacing: '-0.045em', margin: 0, color: C.text }}>
                Your portfolio,
              </h1>
              <h1 style={{
                fontWeight: 900,
                fontSize: 'clamp(44px, 6vw, 80px)',
                lineHeight: 1.1,
                letterSpacing: '-0.045em',
                margin: '0 0 24px',
                background: `linear-gradient(120deg, ${C.tealLight}, ${C.blue})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                fully managed.
              </h1>
            </motion.div>

            {/* Sub */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } } }}
              style={{ fontSize: 'clamp(14px, 1.5vw, 17px)', lineHeight: 1.8, color: C.textSub, maxWidth: 480, margin: '0 0 36px' }}
            >
              A three-app system — admin dashboard, REST API, and public portfolio — that lets you manage your entire professional story from one place, without ever editing code.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.25 } } }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}
            >
              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.04, boxShadow: `0 0 48px rgba(20,184,160,0.6)` }}
                transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '14px 32px', borderRadius: 14,
                  background: `linear-gradient(135deg, ${C.teal}, ${C.blue}90)`,
                  color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
                  boxShadow: `0 0 28px rgba(20,184,160,0.38)`,
                }}
              >
                <LogIn size={16} /> Open Dashboard
              </motion.button>

              <a
                href="#how-it-works"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 26px', borderRadius: 14, color: C.textSub,
                  fontSize: 14, fontWeight: 600, textDecoration: 'none',
                  border: `1px solid ${C.borderMid}`, background: 'transparent',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.tealBorder; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.textSub; e.currentTarget.style.borderColor = C.borderMid; }}
              >
                How it works <ArrowRight size={14} />
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, delay: 0.4 } } }}
              style={{ display: 'flex', gap: 22, marginTop: 28, flexWrap: 'wrap' }}
            >
              {['Self-hosted', 'No vendor lock-in', 'JWT secured', 'Cloudinary CDN'].map((t) => (
                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: C.muted, fontFamily: 'monospace' }}>
                  <CheckCircle size={12} style={{ color: C.teal, flexShrink: 0 }} /> {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: terminal */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: CUBIC, delay: 0.3 }}
          >
            <AnimatedTerminal />
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <section style={{ padding: '0 clamp(20px, 5vw, 72px) 80px', position: 'relative', zIndex: 1 }}>
        <motion.div
          {...fadeUp()}
          style={{
            maxWidth: 1100, margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 1, background: C.borderMid, borderRadius: 18, overflow: 'hidden',
            border: `1px solid ${C.borderMid}`,
          }}
        >
          {STATS.map(({ value, label, sub, icon: Icon, color }) => (
            <div
              key={label}
              style={{
                background: C.surface,
                padding: '26px 28px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 10, right: 12,
                opacity: 0.06,
              }}>
                <Icon size={36} color={color} />
              </div>
              <div style={{
                fontWeight: 900,
                fontSize: 'clamp(26px, 3.5vw, 42px)',
                color,
                letterSpacing: '-0.04em',
                fontFamily: 'monospace',
              }}>
                {value}
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginTop: 4 }}>{label}</div>
              <div style={{ fontSize: 10.5, color: C.muted, marginTop: 3, fontFamily: 'monospace' }}>{sub}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Live profile snapshot (dynamic, only when data available) ── */}
      {profileMaster && (
        <section style={{ padding: '0 clamp(20px, 5vw, 72px) 80px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 36 }}>
              <SectionLabel>Live profile data</SectionLabel>
              <SectionTitle>Your portfolio, right now</SectionTitle>
              <p style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: C.textSub, maxWidth: 460, margin: '0 auto' }}>
                Content counts pulled live from the API — reflecting exactly what visitors see on your public portfolio.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp(0.1)}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 12,
              }}
            >
              {[
                { label: 'Projects', value: profileMaster.projects?.length ?? 0, icon: Monitor, color: C.teal },
                { label: 'Skills', value: profileMaster.skills?.length ?? 0, icon: Code2, color: C.purple },
                { label: 'Experience', value: profileMaster.experiences?.length ?? 0, icon: Briefcase, color: C.blue },
                { label: 'Achievements', value: profileMaster.achievements?.length ?? 0, icon: Award, color: C.amber },
                { label: 'Testimonials', value: profileMaster.testimonials?.length ?? 0, icon: Star, color: C.green },
                { label: 'Certifications', value: profileMaster.certifications?.length ?? 0, icon: CheckCircle, color: C.red },
                { label: 'Education', value: profileMaster.educations?.length ?? 0, icon: GraduationCap, color: C.tealLight },
                { label: 'Social Links', value: profileMaster.socialLinks?.length ?? 0, icon: Globe, color: C.purpleLight },
              ].map(({ label, value, icon: Icon, color }, i) => (
                <motion.div
                  key={label}
                  {...fadeUp(i * 0.05)}
                  style={{
                    padding: '20px 18px', borderRadius: 14,
                    background: C.surface, border: `1px solid ${C.border}`,
                    textAlign: 'center', position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'absolute', top: 8, right: 10, opacity: 0.06 }}>
                    <Icon size={32} color={color} />
                  </div>
                  <div style={{
                    fontWeight: 900, fontSize: 'clamp(22px, 2.8vw, 34px)',
                    color, letterSpacing: '-0.04em', fontFamily: 'monospace',
                  }}>
                    {value}
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: C.textSub, marginTop: 4 }}>{label}</div>
                </motion.div>
              ))}
            </motion.div>

            {profileMaster.profile && (
              <motion.div
                {...fadeUp(0.2)}
                style={{
                  marginTop: 20, padding: '20px 24px', borderRadius: 14,
                  background: C.surface, border: `1px solid ${C.tealBorder}`,
                  display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
                }}
              >
                {profileMaster.profile.profileImageUrl && (
                  <img
                    src={profileMaster.profile.profileImageUrl}
                    alt={profileMaster.profile.fullName}
                    style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', border: `2px solid ${C.tealBorder}` }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{profileMaster.profile.fullName}</div>
                  {profileMaster.profile.headline && (
                    <div style={{ fontSize: 12.5, color: C.textSub, marginTop: 2 }}>{profileMaster.profile.headline}</div>
                  )}
                  {profileMaster.profile.location && (
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 3, fontFamily: 'monospace' }}>{profileMaster.profile.location}</div>
                  )}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 99,
                  background: C.tealDim, border: `1px solid ${C.tealBorder}`,
                  fontSize: 11, fontFamily: 'monospace', color: C.teal, fontWeight: 600,
                }}>
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: 5, height: 5, borderRadius: '50%', background: C.teal, display: 'inline-block' }}
                  />
                  Live
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* ── Dashboard preview ─────────────────────────────────── */}
      <section style={{ padding: '20px clamp(20px, 5vw, 72px) 100px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionLabel>Admin Dashboard Preview</SectionLabel>
            <SectionTitle>Manage everything from one place</SectionTitle>
            <p style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: C.textSub, maxWidth: 500, margin: '0 auto' }}>
              A structured CMS for every section of your portfolio. Real-time analytics, activity feeds, and quick actions — all in one panel.
            </p>
          </motion.div>
          <motion.div {...fadeUp(0.15)}>
            {bannerUrl ? (
              <div style={{
                borderRadius: 18,
                overflow: 'hidden',
                border: `1px solid ${C.borderMid}`,
                boxShadow: `0 48px 96px rgba(0,0,0,0.65), 0 0 0 1px ${C.teal}10`,
              }}>
                <img
                  src={bannerUrl}
                  alt="Portfolios Builder dashboard"
                  style={{ width: '100%', display: 'block', maxHeight: 520, objectFit: 'cover' }}
                />
              </div>
            ) : (
              <DashboardMockup />
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Architecture ──────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '80px clamp(20px, 5vw, 72px)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 60 }}>
            <SectionLabel>System architecture</SectionLabel>
            <SectionTitle>Three apps, one seamless system</SectionTitle>
            <p style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: C.textSub, maxWidth: 540, margin: '0 auto' }}>
              Portfolios Builder is three distinct, independently deployable apps that work together to give you full control over your public presence.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {ARCHITECTURE_STEPS.map(({ n, icon: Icon, color, title, label, desc }, i) => (
              <motion.div key={n} {...fadeUp(i * 0.12)}>
                <div style={{
                  padding: '30px 26px', borderRadius: 18,
                  background: C.surface, border: `1px solid ${C.border}`,
                  height: '100%', position: 'relative', overflow: 'hidden',
                  transition: 'border-color 0.25s',
                }}>
                  <div style={{
                    position: 'absolute', top: 14, right: 18,
                    fontFamily: 'monospace', fontWeight: 900, fontSize: 52,
                    color: `${color}07`, lineHeight: 1,
                  }}>{n}</div>

                  <div style={{
                    width: 46, height: 46, borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${color}10`, border: `1px solid ${color}22`, color,
                    marginBottom: 18,
                  }}>
                    <Icon size={21} />
                  </div>

                  <div style={{ fontFamily: 'monospace', fontSize: 9.5, color, letterSpacing: '0.1em', marginBottom: 4, textTransform: 'uppercase' }}>
                    Step {n}
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 17, color: C.text, marginBottom: 4 }}>{title}</h3>
                  <div style={{
                    display: 'inline-flex',
                    fontFamily: 'monospace',
                    fontSize: 10,
                    color: C.muted,
                    background: C.surfaceAlt,
                    border: `1px solid ${C.border}`,
                    padding: '2px 8px',
                    borderRadius: 5,
                    marginBottom: 12,
                  }}>
                    {label}
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: C.textSub, margin: 0 }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Data flow */}
          <motion.div {...fadeUp(0.3)} style={{
            marginTop: 32, padding: '20px 24px', borderRadius: 14,
            background: C.surface, border: `1px solid ${C.border}`,
          }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10.5, color: C.muted, marginBottom: 10 }}>data flow</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontFamily: 'monospace', fontSize: 11 }}>
              {[
                { label: 'You (Admin)', color: C.purple },
                { sep: '→ login →' },
                { label: 'portfolio-fe', color: C.purple },
                { sep: '→ HTTPS →' },
                { label: 'portfolio-be API', color: C.teal },
                { sep: '→ JSON →' },
                { label: 'portfolio-main', color: C.blue },
                { sep: '→ public' },
              ].map((item, i) =>
                'sep' in item ? (
                  <span key={i} style={{ color: C.muted }}>{item.sep}</span>
                ) : (
                  <span key={i} style={{
                    padding: '3px 10px', borderRadius: 6, fontSize: 10.5,
                    background: `${item.color}10`, border: `1px solid ${item.color}22`, color: item.color,
                  }}>{item.label}</span>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section id="features" style={{
        padding: '80px clamp(20px, 5vw, 72px)',
        background: C.surface,
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionLabel>Platform capabilities</SectionLabel>
            <SectionTitle>Everything your portfolio needs</SectionTitle>
            <p style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: C.textSub, maxWidth: 480, margin: '0 auto' }}>
              From authentication to CDN-optimised images, every production concern is handled out of the box.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {FEATURES.map(({ icon: Icon, color, title, desc }, i) => (
              <motion.div
                key={title}
                {...fadeUp(i * 0.07)}
                whileHover={{ y: -4 }}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  padding: '26px 24px 28px',
                  borderRadius: 18,
                  background: C.bg,
                  border: `1px solid ${hoveredFeature === i ? `${color}35` : C.border}`,
                  cursor: 'default',
                  transition: 'border-color 0.25s, box-shadow 0.25s',
                  boxShadow: hoveredFeature === i ? `0 8px 32px ${color}0E, inset 0 0 0 1px ${color}15` : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {hoveredFeature === i && (
                  <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: `radial-gradient(ellipse at 20% 20%, ${color}06 0%, transparent 60%)`,
                  }} />
                )}
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${color}10`, border: `1px solid ${color}22`, color,
                  marginBottom: 18,
                  transition: 'box-shadow 0.25s',
                  boxShadow: hoveredFeature === i ? `0 0 18px ${color}30` : 'none',
                }}>
                  <Icon size={20} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 8, color: C.text }}>{title}</h3>
                <p style={{ fontSize: 12.5, lineHeight: 1.75, color: C.textSub, margin: 0 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content sections ──────────────────────────────────── */}
      <section style={{ padding: '80px clamp(20px, 5vw, 72px)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionLabel>What you can manage</SectionLabel>
            <SectionTitle>9 portfolio sections, fully CMS-driven</SectionTitle>
            <p style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: C.textSub, maxWidth: 500, margin: '0 auto' }}>
              Every section of your public portfolio is powered by data you enter in the dashboard — no hard-coded content anywhere.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {CONTENT_SECTIONS.map(({ icon: Icon, label, desc }, i) => (
              <motion.div key={label} {...fadeUp(i * 0.06)}>
                <motion.div
                  whileHover={{ borderColor: C.tealBorder, y: -3, background: C.surfaceAlt }}
                  style={{
                    padding: '18px 20px 20px',
                    borderRadius: 14,
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    transition: 'background 0.2s, border-color 0.2s',
                    height: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: C.tealDim, border: `1px solid ${C.tealBorder}`, color: C.teal,
                    }}>
                      <Icon size={15} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{label}</span>
                  </div>
                  <p style={{ fontSize: 11.5, lineHeight: 1.65, color: C.muted, margin: 0 }}>{desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech stack ────────────────────────────────────────── */}
      <section id="tech-stack" style={{
        padding: '80px clamp(20px, 5vw, 72px)',
        background: C.surface,
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionLabel>Technology</SectionLabel>
            <SectionTitle>Built on a modern, proven stack</SectionTitle>
            <p style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: C.textSub, maxWidth: 480, margin: '0 auto' }}>
              No experimental frameworks. Battle-tested technologies with large communities and long-term support.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {TECH_STACK.map(({ cat, color, items }, gi) => (
              <motion.div key={cat} {...fadeUp(gi * 0.1)}>
                <div style={{
                  borderRadius: 16, overflow: 'hidden',
                  border: `1px solid ${color}18`,
                  background: C.bg,
                }}>
                  <div style={{
                    padding: '14px 20px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: `${color}07`,
                    borderBottom: `1px solid ${color}12`,
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: color, boxShadow: `0 0 10px ${color}80`,
                    }} />
                    <span style={{ fontWeight: 700, fontSize: 13, color }}>{cat}</span>
                  </div>
                  <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {items.map((item) => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: C.textSub }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: `${color}55`, flexShrink: 0 }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to use ────────────────────────────────────────── */}
      <section style={{ padding: '80px clamp(20px, 5vw, 72px)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 60 }}>
            <SectionLabel>Simple process</SectionLabel>
            <SectionTitle>From zero to live portfolio in under an hour</SectionTitle>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              {
                step: '01', color: C.purple, icon: Shield,
                title: 'Login to your admin dashboard',
                bullets: [
                  'Navigate to your portfolio-fe deployment URL',
                  'Enter credentials to receive a signed JWT token',
                  'Session stays active until you sign out',
                ],
              },
              {
                step: '02', color: C.teal, icon: Database,
                title: 'Build your profile',
                bullets: [
                  'Fill in About, skills, work experience, and education',
                  'Upload profile photo and project images — all stored on Cloudinary',
                  'Add projects with live demo links, GitHub URLs, and tech tags',
                  'Create certifications with credential IDs and verification links',
                ],
              },
              {
                step: '03', color: C.blue, icon: Palette,
                title: 'Customise your theme',
                bullets: [
                  'Choose from 10+ colour palettes in the Theme settings',
                  'The public portfolio reflects the change on next page load',
                  'No CSS knowledge or rebuild required',
                ],
              },
              {
                step: '04', color: C.amber, icon: Eye,
                title: 'Share your live portfolio',
                bullets: [
                  'Your public portfolio is already live at portfolio-main\'s URL',
                  'Paste the link in job applications, LinkedIn, or your email signature',
                  'Watch visitor analytics in the dashboard Overview panel',
                ],
              },
            ].map(({ step, color, icon: Icon, title, bullets }, i) => (
              <motion.div key={step} {...fadeUp(i * 0.1)}>
                <div style={{
                  display: 'flex', gap: 32, padding: '40px 0',
                  borderBottom: i < 3 ? `1px solid ${C.border}` : undefined,
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 16,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `${color}10`, border: `1px solid ${color}22`, color,
                      boxShadow: `0 0 20px ${color}15`,
                    }}>
                      <Icon size={22} />
                    </div>
                    {i < 3 && (
                      <div style={{ width: 1, flex: 1, minHeight: 24, background: `linear-gradient(to bottom, ${color}35, transparent)` }} />
                    )}
                  </div>
                  <div style={{ flex: 1, paddingTop: 6 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 10.5, color, marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Step {step}</div>
                    <h3 style={{ fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 14 }}>{title}</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {bullets.map((b) => (
                        <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: C.textSub, lineHeight: 1.65 }}>
                          <ChevronRight size={13} style={{ color, flexShrink: 0, marginTop: 3 }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform metrics strip ─────────────────────────────── */}
      <section style={{
        padding: '0 clamp(20px, 5vw, 72px) 80px',
        position: 'relative', zIndex: 1,
      }}>
        <motion.div
          {...fadeUp()}
          style={{
            maxWidth: 1100, margin: '0 auto',
            padding: '28px 36px',
            borderRadius: 18,
            background: C.surface,
            border: `1px solid ${C.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Platform at a glance</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Portfolios Builder is production-ready, end to end</div>
          </div>
          <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap' }}>
            {[
              { icon: Activity, label: 'Uptime', val: '99.9%', color: C.green },
              { icon: GitBranch, label: 'Apps', val: '3', color: C.teal },
              { icon: TrendingUp, label: 'Load', val: '< 1s', color: C.blue },
              { icon: Users, label: 'Roles', val: 'RBAC', color: C.purple },
            ].map(({ icon: Icon, label, val, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${color}10`, border: `1px solid ${color}20`, color,
                }}>
                  <Icon size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color, fontFamily: 'monospace' }}>{val}</div>
                  <div style={{ fontSize: 10.5, color: C.muted }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '80px clamp(20px, 5vw, 72px)', background: C.surface, position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionLabel>Common questions</SectionLabel>
            <SectionTitle>Frequently asked</SectionTitle>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQS.map(({ q, a }, i) => (
              <motion.div key={i} {...fadeUp(i * 0.05)}>
                <div style={{
                  borderRadius: 12, background: C.bg,
                  border: `1px solid ${openFaq === i ? C.tealBorder : C.border}`,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                  boxShadow: openFaq === i ? `0 4px 20px ${C.teal}0A` : 'none',
                }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer',
                      color: C.text, textAlign: 'left', gap: 16,
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.5 }}>{q}</span>
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0 }}>
                      <ChevronDown size={16} style={{ color: C.teal }} />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: CUBIC }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p style={{ padding: '0 22px 20px', fontSize: 13, color: C.textSub, lineHeight: 1.8 }}>{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section style={{ padding: '60px clamp(20px, 5vw, 72px) 100px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{
            maxWidth: 700, margin: '0 auto', textAlign: 'center',
            padding: 'clamp(48px, 7vw, 80px) clamp(28px, 5vw, 72px)',
            borderRadius: 24, background: C.surface, border: `1px solid ${C.borderMid}`,
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse at 50% 0%, ${C.teal}0A 0%, transparent 65%)`,
          }} />
          <div style={{
            position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
            background: `linear-gradient(90deg, transparent, ${C.teal}55, transparent)`,
          }} />

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px', borderRadius: 99, marginBottom: 24,
            fontSize: 10.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em',
            color: C.teal, background: C.tealDim, border: `1px solid ${C.tealBorder}`,
          }}>
            Ready to get started?
          </div>

          <h2 style={{
            fontWeight: 800, fontSize: 'clamp(26px, 4vw, 42px)', letterSpacing: '-0.03em',
            lineHeight: 1.15, marginBottom: 14, position: 'relative',
          }}>
            Your professional story deserves a great home
          </h2>
          <p style={{ fontSize: 15, color: C.textSub, marginBottom: 36, position: 'relative', lineHeight: 1.75 }}>
            Log in to your admin dashboard and start building. Add your first experience entry, upload a project screenshot, and watch your public portfolio come to life — in minutes.
          </p>

          <motion.button
            onClick={onGetStarted}
            whileHover={{ scale: 1.05, boxShadow: `0 0 56px rgba(20,184,160,0.65)` }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 40px', borderRadius: 14,
              background: `linear-gradient(135deg, ${C.teal}, ${C.blue}90)`,
              color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
              boxShadow: `0 0 32px rgba(20,184,160,0.38)`, position: 'relative',
            }}
          >
            <LogIn size={17} /> Open Dashboard
          </motion.button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24, flexWrap: 'wrap' }}>
            {['No credit card required', 'Fully self-hosted', 'Open source'].map((t) => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: C.muted, fontFamily: 'monospace' }}>
                <CheckCircle size={12} style={{ color: C.teal }} /> {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '28px clamp(20px, 5vw, 72px)', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Layers size={12} color="#fff" />
            </div>
            <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: '-0.02em' }}>
              Portfolio<span style={{ color: C.teal }}>OS</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: Server, label: 'Spring Boot 3' },
              { icon: Code2, label: 'React + Vite' },
              { icon: Image, label: 'Cloudinary CDN' },
              { icon: Database, label: 'MongoDB' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.muted, fontFamily: 'monospace' }}>
                <Icon size={11} style={{ color: `${C.teal}60` }} /> {label}
              </span>
            ))}
          </div>

          <p style={{ fontFamily: 'monospace', fontSize: 11, color: C.muted, margin: 0 }}>
            Your professional story, delivered.
          </p>
        </div>
      </footer>

      <style>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
