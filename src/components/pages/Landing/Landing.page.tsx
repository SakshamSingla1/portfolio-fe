import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogIn, BarChart2, Globe, LayoutDashboard, Lock, Palette, Zap, CheckCircle,
  Server, Code2, Database, Image, Layers, RefreshCw, ChevronDown, ChevronRight,
  Star, ArrowRight, Shield, Eye, Briefcase, Award, GraduationCap, MessageSquare,
  Mail, Terminal, Monitor, Cpu, Cloud,
} from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
}

const C = {
  bg: '#080809',
  surface: '#0D0E10',
  surfaceAlt: '#111318',
  border: 'rgba(255,255,255,0.06)',
  borderMid: 'rgba(255,255,255,0.10)',
  teal: '#1ABC9C',
  tealDim: 'rgba(26, 188, 156, 0.09)',
  tealBorder: 'rgba(26, 188, 156, 0.25)',
  tealGlow: 'rgba(26, 188, 156, 0.35)',
  purple: '#8B5CF6',
  purpleDim: 'rgba(139, 92, 246, 0.09)',
  blue: '#3B82F6',
  blueDim: 'rgba(59, 130, 246, 0.09)',
  text: '#EEEEF0',
  textSub: '#A1A1AA',
  muted: '#52525B',
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as number[], delay },
});

// ── Data ────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: LayoutDashboard, color: C.teal,
    title: 'Admin Dashboard',
    desc: 'A full-featured CMS to manage every section of your portfolio — experience, skills, projects, certifications, achievements, education, and testimonials — all from one clean panel.',
  },
  {
    icon: Globe, color: C.blue,
    title: 'Public Portfolio',
    desc: 'A production-grade public site generated from your dashboard data. Visitors see a beautiful, animated, responsive portfolio — you never touch HTML or CSS.',
  },
  {
    icon: Palette, color: C.purple,
    title: 'Dynamic Theme Engine',
    desc: '10+ colour palettes configurable from the dashboard. Switch from indigo to amber to emerald in one click and the entire public site updates in real time.',
  },
  {
    icon: BarChart2, color: '#F59E0B',
    title: 'Real-Time Analytics',
    desc: 'Track profile views, visitor sessions, and traffic sources. Know exactly when a recruiter or collaborator is browsing your work.',
  },
  {
    icon: Cloud, color: '#06B6D4',
    title: 'Cloudinary CDN',
    desc: 'All images — profile photo, project screenshots, achievement proofs — are stored on Cloudinary and served via global CDN with on-the-fly optimisation.',
  },
  {
    icon: Lock, color: '#EF4444',
    title: 'JWT Authentication',
    desc: 'Secure login with signed JWT tokens. Role-based access control keeps your dashboard private while your portfolio remains fully public.',
  },
];

const CONTENT_SECTIONS = [
  { icon: Briefcase, label: 'Experience', desc: 'Work history with role, company, dates, location, employment type, and tech stack' },
  { icon: Code2, label: 'Skills', desc: 'Categorised tech skills with logo, proficiency level, and animated progress bars' },
  { icon: Monitor, label: 'Projects', desc: 'Showcased with images, live demo links, GitHub links, descriptions, and skill tags' },
  { icon: Award, label: 'Achievements', desc: 'Recognitions with proof images, issuer, date, and description' },
  { icon: CheckCircle, label: 'Certifications', desc: 'Professional credentials with credential ID, verification URL, and expiry tracking' },
  { icon: GraduationCap, label: 'Education', desc: 'Academic background with degree type, field of study, institution, and grade' },
  { icon: Star, label: 'Testimonials', desc: 'Client and colleague reviews with name, role, company, and avatar' },
  { icon: MessageSquare, label: 'Contact', desc: 'Contact form submissions land in your admin inbox — no third-party form service needed' },
];

const TECH_STACK = [
  { cat: 'Backend', color: C.teal, items: ['Spring Boot 3', 'Java 21', 'PostgreSQL', 'JPA / Hibernate', 'JWT Auth', 'Cloudinary SDK'] },
  { cat: 'Admin Frontend', color: C.purple, items: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS 4', 'Framer Motion', 'MUI v6'] },
  { cat: 'Public Portfolio', color: C.blue, items: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS 4', 'Framer Motion', 'React Router v7'] },
];

const ARCHITECTURE_STEPS = [
  {
    n: '01', icon: Terminal, color: C.purple,
    title: 'Admin Dashboard (portfolio-fe)',
    desc: 'You log in here. Add your experience, upload project screenshots, configure your theme, and publish everything. Runs on React + Vite at port 5174.',
  },
  {
    n: '02', icon: Server, color: C.teal,
    title: 'REST API (portfolio-be)',
    desc: 'A Spring Boot 3 API handles authentication, persists data to PostgreSQL, manages file uploads to Cloudinary, and serves structured JSON to both frontends.',
  },
  {
    n: '03', icon: Globe, color: C.blue,
    title: 'Public Portfolio (portfolio-main)',
    desc: 'Anyone with the link sees this. It reads from the same API and renders your portfolio beautifully — no login required. Runs at port 5173.',
  },
];

const FAQS = [
  {
    q: 'Is this a SaaS product or something I self-host?',
    a: 'Self-hosted. You deploy the Spring Boot backend, the admin frontend, and the public frontend wherever you like — VPS, cloud VM, Vercel/Railway combo. You own all the data and infrastructure.',
  },
  {
    q: 'Do I need to write any code to update my portfolio?',
    a: 'No. The admin dashboard is a full no-code CMS. You fill in forms, upload images, and click Save. The public portfolio reflects every change immediately.',
  },
  {
    q: 'How is my dashboard protected?',
    a: 'JWT tokens are issued on login and stored client-side. Every API request to admin endpoints requires a valid, signed token. Password resets flow through email verification.',
  },
  {
    q: 'Can I use my own domain for the public portfolio?',
    a: 'Yes. Point any domain\'s DNS to your deployment server and configure the frontend build with your domain. Standard static hosting setup.',
  },
  {
    q: 'What database does it use?',
    a: 'PostgreSQL. The Spring Boot backend uses JPA / Hibernate for schema management and query building. Any Postgres-compatible host works.',
  },
  {
    q: 'How does theme switching work?',
    a: 'The public portfolio fetches the active colour palette from the API on load. When you change the theme in the dashboard the public site picks it up on next load — no rebuild required.',
  },
];

const STATS = [
  { value: '3', label: 'Applications', sub: 'Admin · API · Portfolio' },
  { value: '9', label: 'Content Sections', sub: 'Fully managed via CMS' },
  { value: '10+', label: 'Theme Palettes', sub: 'Live switchable' },
  { value: '< 1s', label: 'Load Time', sub: 'Vite + Cloudinary CDN' },
];

// ── Dashboard Mockup ─────────────────────────────────────────────────────────

const DashboardMockup = () => (
  <div
    style={{
      borderRadius: 16,
      overflow: 'hidden',
      border: `1px solid ${C.borderMid}`,
      background: C.surface,
      boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px ${C.teal}15`,
    }}
  >
    {/* Title bar */}
    <div style={{ background: '#16181C', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E' }} />
      <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: C.muted, fontFamily: 'monospace' }}>
        PortfolioOS Admin — Dashboard
      </div>
    </div>
    {/* Body */}
    <div style={{ display: 'flex', height: 320 }}>
      {/* Sidebar */}
      <div style={{ width: 170, background: '#0A0B0D', borderRight: `1px solid ${C.border}`, padding: '16px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 12px 12px', fontSize: 10, fontFamily: 'monospace', color: C.muted, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Navigation</div>
        {['Overview', 'Experience', 'Projects', 'Skills', 'Certifications', 'Education', 'Achievements', 'Testimonials', 'Theme', 'Settings'].map((item, i) => (
          <div
            key={item}
            style={{
              padding: '7px 16px',
              fontSize: 12,
              color: i === 0 ? C.teal : C.muted,
              background: i === 0 ? `${C.teal}10` : 'transparent',
              borderLeft: i === 0 ? `2px solid ${C.teal}` : '2px solid transparent',
              fontFamily: 'monospace',
            }}
          >
            {item}
          </div>
        ))}
      </div>
      {/* Main area */}
      <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 16 }}>Overview</div>
        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Profile Views', val: '1,248', color: C.teal },
            { label: 'Projects', val: '12', color: C.purple },
            { label: 'Skills', val: '34', color: C.blue },
            { label: 'Messages', val: '7', color: '#F59E0B' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ background: C.surfaceAlt, borderRadius: 8, padding: '10px 12px', border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 17, fontWeight: 800, color, fontFamily: 'monospace' }}>{val}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
        {/* Recent section */}
        <div style={{ fontSize: 12, color: C.textSub, marginBottom: 10 }}>Recent Activity</div>
        {['Profile updated · 2m ago', 'New contact message · 14m ago', 'Project added · 1h ago', 'Theme changed to Indigo · 3h ago'].map((item) => (
          <div key={item} style={{ padding: '7px 10px', borderRadius: 6, background: C.surfaceAlt, marginBottom: 5, fontSize: 11, color: C.muted, border: `1px solid ${C.border}` }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Sub-components ───────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.2em', color: C.teal, marginBottom: 12 }}>
    {children}
  </p>
);

const SectionTitle = ({ children, center = true }: { children: React.ReactNode; center?: boolean }) => (
  <h2 style={{
    fontWeight: 800, fontSize: 'clamp(24px, 3.2vw, 40px)', letterSpacing: '-0.03em',
    lineHeight: 1.12, margin: '0 0 16px', textAlign: center ? 'center' : 'left',
  }}>
    {children}
  </h2>
);

// ── Main Component ───────────────────────────────────────────────────────────

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflowX: 'hidden' }}>

      {/* ── Navbar ──────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 clamp(20px, 5vw, 72px)', height: 62,
          background: `${C.bg}E8`,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: C.teal,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Layers size={14} color="#fff" />
          </div>
          <div style={{ fontWeight: 800, fontSize: 16, color: C.text, letterSpacing: '-0.02em' }}>
            Portfolio<span style={{ color: C.teal }}>OS</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
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
            whileHover={{ scale: 1.04, boxShadow: `0 0 24px ${C.tealGlow}` }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '9px 22px',
              borderRadius: 10, background: C.teal, color: '#fff',
              fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
              boxShadow: `0 0 16px rgba(26,188,156,0.30)`,
            }}
          >
            <LogIn size={14} /> Login
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '100px clamp(20px, 5vw, 72px) 60px', textAlign: 'center', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 900, height: 900, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(26,188,156,0.06) 0%, transparent 62%)`,
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <motion.div
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
          style={{ maxWidth: 860, position: 'relative', zIndex: 1 }}
        >
          {/* Eyebrow */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 99,
              fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.12em',
              color: C.teal, background: C.tealDim, border: `1px solid ${C.tealBorder}`,
              marginBottom: 32,
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: C.teal, display: 'inline-block', flexShrink: 0 }}
            />
            Full-Stack Portfolio Management Platform
          </motion.div>

          {/* Headline */}
          <motion.div variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } } }}>
            <h1 style={{ fontWeight: 900, fontSize: 'clamp(48px, 8.5vw, 104px)', lineHeight: 0.93, letterSpacing: '-0.045em', margin: 0, color: C.text }}>
              Your portfolio,
            </h1>
            <h1 style={{ fontWeight: 900, fontSize: 'clamp(48px, 8.5vw, 104px)', lineHeight: 1.05, letterSpacing: '-0.045em', margin: '0 0 28px', color: C.teal }}>
              fully managed.
            </h1>
          </motion.div>

          {/* Sub-headline */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } } }}
            style={{ fontSize: 'clamp(15px, 1.6vw, 19px)', lineHeight: 1.75, color: C.textSub, maxWidth: 560, margin: '0 auto 40px' }}
          >
            PortfolioOS is a three-app system — an admin dashboard, a REST API, and a public portfolio — that lets you manage your entire professional story from one place, without ever editing code.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.25 } } }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}
          >
            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.04, boxShadow: `0 0 52px rgba(26,188,156,0.65)` }}
              transition={{ type: 'spring', stiffness: 380, damping: 18 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '15px 34px', borderRadius: 14, background: C.teal, color: '#fff',
                fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer',
                boxShadow: `0 0 32px rgba(26,188,156,0.42)`,
              }}
            >
              <LogIn size={18} /> Open Dashboard
            </motion.button>

            <a
              href="#how-it-works"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '15px 28px', borderRadius: 14, color: C.textSub,
                fontSize: 15, fontWeight: 600, textDecoration: 'none',
                border: `1px solid ${C.borderMid}`, background: 'transparent',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.tealBorder; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = C.textSub; e.currentTarget.style.borderColor = C.borderMid; }}
            >
              How it works <ArrowRight size={15} />
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, delay: 0.4 } } }}
            style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 28, flexWrap: 'wrap' }}
          >
            {['Self-hosted', 'No vendor lock-in', 'JWT secured', 'Cloudinary CDN'].map((t) => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted, fontFamily: 'monospace' }}>
                <CheckCircle size={13} style={{ color: C.teal, flexShrink: 0 }} /> {t}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <section style={{ padding: '0 clamp(20px, 5vw, 72px) 80px' }}>
        <motion.div
          {...fadeUp()}
          style={{
            maxWidth: 1100, margin: '0 auto',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 1, background: C.borderMid, borderRadius: 16, overflow: 'hidden',
            border: `1px solid ${C.borderMid}`,
          }}
        >
          {STATS.map(({ value, label, sub }) => (
            <div key={label} style={{ background: C.surface, padding: '28px 32px', textAlign: 'center' }}>
              <div style={{ fontWeight: 900, fontSize: 'clamp(28px, 4vw, 44px)', color: C.teal, letterSpacing: '-0.04em', fontFamily: 'monospace' }}>{value}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginTop: 4 }}>{label}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 3, fontFamily: 'monospace' }}>{sub}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Dashboard preview ─────────────────────────────────── */}
      <section style={{ padding: '40px clamp(20px, 5vw, 72px) 100px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionLabel>Admin Dashboard Preview</SectionLabel>
            <SectionTitle>Manage everything from one place</SectionTitle>
            <p style={{ fontSize: 'clamp(14px, 1.3vw, 16px)', color: C.textSub, maxWidth: 520, margin: '0 auto' }}>
              The admin panel gives you a structured CMS for every section of your portfolio. No design knowledge needed.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.15)}>
            <DashboardMockup />
          </motion.div>
        </div>
      </section>

      {/* ── Architecture ──────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '80px clamp(20px, 5vw, 72px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 60 }}>
            <SectionLabel>System architecture</SectionLabel>
            <SectionTitle>Three apps, one seamless system</SectionTitle>
            <p style={{ fontSize: 'clamp(14px, 1.3vw, 16px)', color: C.textSub, maxWidth: 560, margin: '0 auto' }}>
              PortfolioOS is not a single application. It is three distinct, independently deployable apps that work together to give you full control over your public presence.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, position: 'relative' }}>
            {ARCHITECTURE_STEPS.map(({ n, icon: Icon, color, title, desc }, i) => (
              <motion.div key={n} {...fadeUp(i * 0.12)}>
                <div
                  style={{
                    padding: '32px 28px',
                    borderRadius: 18,
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Index watermark */}
                  <div style={{
                    position: 'absolute', top: 16, right: 20,
                    fontFamily: 'monospace', fontWeight: 900, fontSize: 48,
                    color: `${color}08`, lineHeight: 1,
                  }}>{n}</div>

                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `${color}12`, border: `1px solid ${color}25`,
                    marginBottom: 20, color,
                  }}>
                    <Icon size={22} />
                  </div>

                  <div style={{ fontFamily: 'monospace', fontSize: 11, color, letterSpacing: '0.08em', marginBottom: 10 }}>
                    Step {n}
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: 17, color: C.text, marginBottom: 10 }}>{title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: C.textSub }}>{desc}</p>

                  {/* Connector arrow (not on last) */}
                  {i < ARCHITECTURE_STEPS.length - 1 && (
                    <div style={{
                      display: 'none', // shown via CSS on desktop if needed
                    }} />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Flow diagram */}
          <motion.div {...fadeUp(0.3)} style={{ marginTop: 40, padding: '24px 28px', borderRadius: 14, background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: C.muted, marginBottom: 12 }}>Data flow</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontFamily: 'monospace', fontSize: 12 }}>
              {[
                { label: 'You (Admin)', color: C.purple },
                { sep: '→ login →' },
                { label: 'portfolio-fe', color: C.purple },
                { sep: '→ HTTPS →' },
                { label: 'portfolio-be (Spring Boot API)', color: C.teal },
                { sep: '→ serves data →' },
                { label: 'portfolio-main (Public Site)', color: C.blue },
                { sep: '→ viewed by' },
                { label: 'Anyone on the internet', color: '#F59E0B' },
              ].map((item, i) =>
                'sep' in item ? (
                  <span key={i} style={{ color: C.muted }}>{item.sep}</span>
                ) : (
                  <span key={i} style={{
                    padding: '4px 10px', borderRadius: 6, fontSize: 11,
                    background: `${item.color}12`, border: `1px solid ${item.color}25`, color: item.color,
                  }}>{item.label}</span>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section id="features" style={{ padding: '80px clamp(20px, 5vw, 72px)', background: C.surface }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionLabel>Platform capabilities</SectionLabel>
            <SectionTitle>Everything your portfolio needs</SectionTitle>
            <p style={{ fontSize: 'clamp(14px, 1.3vw, 16px)', color: C.textSub, maxWidth: 500, margin: '0 auto' }}>
              From authentication to CDN-optimised images, every production concern is handled out of the box.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {FEATURES.map(({ icon: Icon, color, title, desc }, i) => (
              <motion.div
                key={title}
                {...fadeUp(i * 0.07)}
                whileHover={{ y: -5 }}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  padding: '26px 26px 30px',
                  borderRadius: 18,
                  background: C.bg,
                  border: `1px solid ${hoveredFeature === i ? `${color}35` : C.border}`,
                  cursor: 'default',
                  transition: 'border-color 0.25s',
                  boxShadow: hoveredFeature === i ? `0 8px 32px ${color}10` : undefined,
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${color}12`, border: `1px solid ${color}25`, color,
                  marginBottom: 18,
                }}>
                  <Icon size={20} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: C.text }}>{title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: C.textSub }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content sections ──────────────────────────────────── */}
      <section style={{ padding: '80px clamp(20px, 5vw, 72px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionLabel>What you can manage</SectionLabel>
            <SectionTitle>9 portfolio sections, fully CMS-driven</SectionTitle>
            <p style={{ fontSize: 'clamp(14px, 1.3vw, 16px)', color: C.textSub, maxWidth: 520, margin: '0 auto' }}>
              Every section of your public portfolio is powered by data you enter in the dashboard — no hard-coded content anywhere.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {CONTENT_SECTIONS.map(({ icon: Icon, label, desc }, i) => (
              <motion.div key={label} {...fadeUp(i * 0.06)}>
                <motion.div
                  whileHover={{ borderColor: C.tealBorder, y: -3 }}
                  style={{
                    padding: '20px 20px 22px',
                    borderRadius: 14,
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    transition: 'border-color 0.2s',
                    height: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: C.tealDim, border: `1px solid ${C.tealBorder}`, color: C.teal,
                    }}>
                      <Icon size={15} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{label}</span>
                  </div>
                  <p style={{ fontSize: 12, lineHeight: 1.65, color: C.muted }}>{desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech stack ────────────────────────────────────────── */}
      <section id="tech-stack" style={{ padding: '80px clamp(20px, 5vw, 72px)', background: C.surface }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionLabel>Technology</SectionLabel>
            <SectionTitle>Built on a modern, proven stack</SectionTitle>
            <p style={{ fontSize: 'clamp(14px, 1.3vw, 16px)', color: C.textSub, maxWidth: 480, margin: '0 auto' }}>
              No experimental frameworks. The entire platform runs on battle-tested technologies with large communities and long-term support.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {TECH_STACK.map(({ cat, color, items }, gi) => (
              <motion.div key={cat} {...fadeUp(gi * 0.1)}>
                <div style={{
                  borderRadius: 16, overflow: 'hidden',
                  border: `1px solid ${color}20`, background: C.bg,
                }}>
                  <div style={{
                    padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10,
                    background: `${color}08`, borderBottom: `1px solid ${color}15`,
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: color, boxShadow: `0 0 8px ${color}`,
                    }} />
                    <span style={{ fontWeight: 700, fontSize: 13, color }}>{cat}</span>
                  </div>
                  <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {items.map((item) => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.textSub }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: `${color}60`, flexShrink: 0 }} />
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

      {/* ── How to use (detailed steps) ───────────────────────── */}
      <section style={{ padding: '80px clamp(20px, 5vw, 72px)' }}>
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
                  'Enter your admin credentials to receive a JWT token',
                  'Your session stays active until you log out',
                ],
              },
              {
                step: '02', color: C.teal, icon: Database,
                title: 'Build out your profile',
                bullets: [
                  'Fill in About, skills, work experience, and education',
                  'Upload profile photo and company/project images — all stored on Cloudinary',
                  'Add projects with live demo links, GitHub URLs, and tech tags',
                  'Create certifications with credential IDs and verification links',
                ],
              },
              {
                step: '03', color: C.blue, icon: Palette,
                title: 'Customise your theme',
                bullets: [
                  'Choose from 10+ colour palettes in the Theme settings',
                  'The public portfolio picks up the change on next page load',
                  'No CSS knowledge or rebuild required',
                ],
              },
              {
                step: '04', color: '#F59E0B', icon: Eye,
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
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 16,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `${color}12`, border: `1px solid ${color}25`, color,
                    }}>
                      <Icon size={24} />
                    </div>
                    {i < 3 && (
                      <div style={{ width: 1, flex: 1, minHeight: 24, background: `linear-gradient(to bottom, ${color}40, transparent)` }} />
                    )}
                  </div>
                  <div style={{ flex: 1, paddingTop: 8 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 11, color, marginBottom: 6, letterSpacing: '0.06em' }}>Step {step}</div>
                    <h3 style={{ fontWeight: 700, fontSize: 19, color: C.text, marginBottom: 16 }}>{title}</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {bullets.map((b) => (
                        <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: C.textSub, lineHeight: 1.6 }}>
                          <ChevronRight size={14} style={{ color, flexShrink: 0, marginTop: 3 }} />
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

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '80px clamp(20px, 5vw, 72px)', background: C.surface }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionLabel>Common questions</SectionLabel>
            <SectionTitle>Frequently asked</SectionTitle>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQS.map(({ q, a }, i) => (
              <motion.div key={i} {...fadeUp(i * 0.06)}>
                <div
                  style={{
                    borderRadius: 12, background: C.bg, border: `1px solid ${openFaq === i ? C.tealBorder : C.border}`,
                    overflow: 'hidden', transition: 'border-color 0.2s',
                  }}
                >
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
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p style={{ padding: '0 22px 20px', fontSize: 13, color: C.textSub, lineHeight: 1.75 }}>{a}</p>
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
      <section style={{ padding: '60px clamp(20px, 5vw, 72px) 100px' }}>
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
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse at 50% 0%, rgba(26,188,156,0.09) 0%, transparent 65%)`,
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
            background: `linear-gradient(90deg, transparent, ${C.teal}60, transparent)`,
          }} />

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px', borderRadius: 99, marginBottom: 24,
            fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em',
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
          <p style={{ fontSize: 15, color: C.textSub, marginBottom: 36, position: 'relative', lineHeight: 1.7 }}>
            Log in to your admin dashboard and start building. Add your first experience entry, upload a project screenshot, and watch your public portfolio come to life — in minutes.
          </p>

          <motion.button
            onClick={onGetStarted}
            whileHover={{ scale: 1.05, boxShadow: `0 0 56px rgba(26,188,156,0.68)` }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 40px', borderRadius: 14, background: C.teal, color: '#fff',
              fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer',
              boxShadow: `0 0 36px rgba(26,188,156,0.44)`, position: 'relative',
            }}
          >
            <LogIn size={18} /> Open Dashboard
          </motion.button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24, flexWrap: 'wrap' }}>
            {['No credit card required', 'Fully self-hosted', 'Open source'].map((t) => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted, fontFamily: 'monospace' }}>
                <CheckCircle size={12} style={{ color: C.teal }} /> {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '28px clamp(20px, 5vw, 72px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6, background: C.teal,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Layers size={12} color="#fff" />
            </div>
            <div style={{ fontWeight: 800, fontSize: 14, color: C.text, letterSpacing: '-0.02em' }}>
              Portfolio<span style={{ color: C.teal }}>OS</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: Server, label: 'Spring Boot API' },
              { icon: Code2, label: 'React + Vite' },
              { icon: Image, label: 'Cloudinary CDN' },
              { icon: Cpu, label: 'PostgreSQL' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.muted, fontFamily: 'monospace' }}>
                <Icon size={11} style={{ color: `${C.teal}70` }} /> {label}
              </span>
            ))}
          </div>

          <p style={{ fontFamily: 'monospace', fontSize: 11, color: C.muted, margin: 0 }}>
            Your professional story, delivered.
          </p>
        </div>
      </footer>

      {/* Inline CSS for hidden-mobile */}
      <style>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
