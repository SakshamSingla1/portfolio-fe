import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import usePlatformSettingsService from '../../../services/usePlatformSettingsService';
import useLandingPageService from '../../../services/useLandingPageService';
import type { LandingPageData } from '../../../services/useLandingPageService';
import { useSubscriptionPlanService, type SubscriptionPlanPublicDTO } from '../../../services/useSubscriptionPlanService';
import { getOptimizedImageUrl } from '../../../utils/helper';
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

// A light, clean palette. The brand accent hues (teal/blue/purple/amber/…)
// stay the same family the admin's icon/color picker already writes into
// content (colorKey), just shifted a shade darker than the old dark-mode
// palette so they hold contrast on white instead of on near-black.
const C = {
  bg: '#FFFFFF',
  surface: '#F6F8FA',
  surfaceAlt: '#EEF2F6',
  surfaceElevated: '#FFFFFF',
  border: 'rgba(15,23,42,0.07)',
  borderMid: 'rgba(15,23,42,0.12)',
  borderHigh: 'rgba(15,23,42,0.18)',
  teal: '#0D9488',
  tealLight: '#14B8A6',
  tealDim: 'rgba(13,148,136,0.08)',
  tealBorder: 'rgba(13,148,136,0.24)',
  tealGlow: 'rgba(13,148,136,0.32)',
  purple: '#7C3AED',
  purpleLight: '#8B5CF6',
  purpleDim: 'rgba(124,58,237,0.08)',
  blue: '#2563EB',
  blueLight: '#3B82F6',
  blueDim: 'rgba(37,99,235,0.08)',
  amber: '#D97706',
  red: '#DC2626',
  green: '#16A34A',
  text: '#0F172A',
  textSub: '#475569',
  muted: '#94A3B8',
};

const CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ── Icon + color resolution maps ─────────────────────────────────────────────
// Kept broad on purpose — the admin's Landing Management screen lets a
// SUPER_ADMIN type any of these icon/color names into a feature, step, or
// audience card, so every key here must keep working even if the current
// fallback copy below doesn't use all of them.

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Globe, Palette, BarChart2, Cloud, Lock, Shield, Database,
  Terminal, Monitor, Code2, Award, Star, CheckCircle, Zap, Users, Server,
  Image, GitBranch, Activity, Eye, TrendingUp, MessageSquare, Briefcase,
  GraduationCap, Layers, ArrowRight,
};

const COLOR_MAP: Record<string, string> = {
  teal: '#0D9488', tealLight: '#14B8A6',
  blue: '#2563EB', blueLight: '#3B82F6',
  purple: '#7C3AED', purpleLight: '#8B5CF6',
  amber: '#D97706', red: '#DC2626', green: '#16A34A',
  cyan: '#0891B2', orange: '#EA580C', pink: '#DB2777',
};

// Accepts either a bare lucide-react name ("Edit3") or the "Lu"-prefixed
// react-icons convention some admins type out of habit ("LuEdit3") — the
// Landing Management form's hint text has shown the latter, but this map
// only ever held the former, so those entries silently fell back to
// CheckCircle. Stripping the prefix before falling back fixes that without
// having to police what admins type.
const resolveIcon = (name: string): React.ElementType => {
  if (ICON_MAP[name]) return ICON_MAP[name];
  const stripped = name?.replace(/^Lu/, '');
  return (stripped && ICON_MAP[stripped]) || CheckCircle;
};

const resolveColor = (key: string): string =>
  COLOR_MAP[key] ?? '#0D9488';

const fadeUp = (delay = 0, dur = 0.55) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: dur, ease: CUBIC, delay },
});

// ── Fallback copy ────────────────────────────────────────────────────────────
// Shown only when the corresponding section has no active rows in the CMS
// (Landing Management, SUPER_ADMIN-only). Deliberately describes what a
// visitor gets to do and see — not what the platform is built with.

const FEATURES = [
  {
    icon: LayoutDashboard, color: C.teal,
    title: 'Easy-to-Use Dashboard',
    desc: 'Add your experience, skills, projects, and more through a simple, guided dashboard — no coding or design skills needed.',
  },
  {
    icon: Globe, color: C.blue,
    title: 'A Polished Public Portfolio',
    desc: 'Your portfolio is generated automatically from your details — professionally designed, mobile-friendly, and ready to share.',
  },
  {
    icon: Palette, color: C.purple,
    title: 'Dynamic Themes',
    desc: 'Choose from a range of colour themes. Switch your look anytime with a single click — your portfolio updates instantly.',
  },
  {
    icon: BarChart2, color: C.amber,
    title: 'Visitor Insights',
    desc: 'See who is viewing your portfolio — visits, popular sections, and resume downloads — so you know when a recruiter takes notice.',
  },
  {
    icon: Cloud, color: '#0891B2',
    title: 'Fast, Optimised Images',
    desc: 'Your photos and project images load quickly everywhere, automatically optimised for every device.',
  },
  {
    icon: Lock, color: C.red,
    title: 'Private & Secure',
    desc: 'Your dashboard is protected behind a secure login, while your portfolio stays public and easy to share with anyone.',
  },
];

// Ordered to match the actual flow of a generated public portfolio (see the
// portfolio-templates: About → Skills → Experience → Projects → …) rather
// than alphabetically or by data-model order, so this preview reads the same
// way a visitor's real portfolio will.
const CONTENT_SECTIONS = [
  { icon: Code2, label: 'Skills', desc: 'Categorised with logo, proficiency level, and progress bars' },
  { icon: Briefcase, label: 'Experience', desc: 'Role, company, dates, location, employment type, technologies used' },
  { icon: Monitor, label: 'Projects', desc: 'Images, live demo, GitHub links, descriptions, skill tags' },
  { icon: Award, label: 'Achievements', desc: 'Proof images, issuer, date, and description' },
  { icon: CheckCircle, label: 'Certifications', desc: 'Credential ID, verification URL, and expiry tracking' },
  { icon: GraduationCap, label: 'Education', desc: 'Degree, field of study, institution, grade, years' },
  { icon: Star, label: 'Testimonials', desc: 'Reviews with name, role, company, avatar, and LinkedIn' },
  { icon: MessageSquare, label: 'Contact', desc: 'Submissions land straight in your dashboard inbox' },
];

const STATS = [
  { value: '9+', label: 'Portfolio Sections', sub: 'Experience, skills, projects & more', icon: Layers, color: C.teal },
  { value: '10+', label: 'Colour Themes', sub: 'Switch anytime, instantly', icon: Palette, color: C.purple },
  { value: '100%', label: 'No Code', sub: 'No design skills required', icon: CheckCircle, color: C.blue },
  { value: 'Free', label: 'To Start', sub: 'No credit card required', icon: Zap, color: C.amber },
];

const HOW_TO_USE_STEPS = [
  {
    step: '01', color: C.purple, icon: Shield,
    title: 'Create your account',
    bullets: [
      'Sign up and log in to your personal dashboard',
      'Your session stays active until you log out',
      'Start on the Free plan, or upgrade anytime',
    ],
  },
  {
    step: '02', color: C.teal, icon: Database,
    title: 'Build your profile',
    bullets: [
      'Fill in your experience, skills, and education',
      'Upload a profile photo and project images',
      'Add projects with live demo links and descriptions',
      'List certifications with credentials and verification links',
    ],
  },
  {
    step: '03', color: C.blue, icon: Palette,
    title: 'Customise your look',
    bullets: [
      'Choose from a range of colour themes',
      'See your changes reflected instantly on your public page',
      'No design or coding experience needed',
    ],
  },
  {
    step: '04', color: C.amber, icon: Eye,
    title: 'Share your portfolio',
    bullets: [
      'Get a live link the moment your portfolio is ready',
      'Share it in job applications, on LinkedIn, or in your email signature',
      'Track visits and engagement right from your dashboard',
    ],
  },
];

const FAQS = [
  {
    q: 'Do I need to know how to code?',
    a: 'Not at all. Everything is managed through a simple dashboard — fill in your details, upload images, and click save. Your public portfolio reflects the change immediately.',
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. Your account is protected behind a secure login, and your data is stored securely with regular backups. Only you can edit your portfolio’s content.',
  },
  {
    q: 'Can I use my own domain?',
    a: 'Yes — you can connect your own custom domain so your portfolio lives at an address that’s uniquely yours.',
  },
  {
    q: 'Can I change my portfolio’s look later?',
    a: 'Absolutely. Switch between colour themes anytime from your dashboard — your live portfolio updates instantly, with no downtime.',
  },
  {
    q: 'What does it cost?',
    a: 'You can get started for free. Paid plans unlock extra features like deeper analytics and more customisation, so you can pick what fits.',
  },
  {
    q: 'Who can see my portfolio?',
    a: 'Your portfolio is public by default, so you can share it anywhere — with recruiters, on LinkedIn, or on your résumé. Your dashboard stays private to you.',
  },
];

// Shown only if the public plans API returns nothing (e.g. no active plans
// configured yet) — mirrors the real seeded Free/Pro/Premium tiers so the
// section never renders empty.
const PLANS = [
  {
    name: 'Free', priceMonthly: 0, priceYearly: 0, currency: 'USD', isDefault: true,
    description: 'Everything needed to get a portfolio live.',
    highlights: ['Dashboard', 'Profile', 'Experience', 'Education', 'Skills', 'Project', 'Resumes', 'Social Links'],
  },
  {
    name: 'Pro', priceMonthly: 9, priceYearly: 90, currency: 'USD', isDefault: false,
    description: 'Adds credibility and content depth to a portfolio.',
    highlights: ['Everything in Free', 'Certifications', 'Testimonials', 'Achievements', 'Custom Themes', 'Messages'],
  },
  {
    name: 'Premium', priceMonthly: 29, priceYearly: 290, currency: 'USD', isDefault: false,
    description: 'Adds growth, marketing, and integration features.',
    highlights: ['Everything in Pro', 'Visitor Analytics', 'GitHub Integration', 'Testimonial Requests', 'Notifications'],
  },
];

// ── Portfolio preview visual ──────────────────────────────────────────────────
// Replaces a prior "boot log" style visual that named backend/infra pieces.
// This shows the actual thing a visitor is being sold: a finished, live
// portfolio — not how the product itself is built.

const PortfolioPreviewCard = () => {
  const chips = [
    { icon: Briefcase, label: '12 Projects' },
    { icon: Code2, label: '18 Skills' },
    { icon: Award, label: '6 Certifications' },
  ];

  return (
    <div
      style={{
        borderRadius: 18,
        overflow: 'hidden',
        border: `1px solid ${C.borderMid}`,
        background: C.surfaceElevated,
        boxShadow: '0 32px 64px rgba(15,23,42,0.12), 0 2px 8px rgba(15,23,42,0.06)',
      }}
    >
      <div style={{
        background: C.surface,
        padding: '11px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        borderBottom: `1px solid ${C.border}`,
      }}>
        {[C.red, C.amber, C.green].map((c) => (
          <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.7 }} />
        ))}
        <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: C.muted }}>
          yourname.portfoliosbuilder.com
        </div>
      </div>

      <div style={{ padding: '32px 30px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 20, flexShrink: 0,
          }}>
            YN
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: C.text }}>Your Name</div>
            <div style={{ fontSize: 13, color: C.textSub, marginTop: 2 }}>Your Professional Title</div>
          </div>
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 10.5, fontWeight: 700, color: C.teal,
              background: C.tealDim, border: `1px solid ${C.tealBorder}`,
              padding: '4px 10px', borderRadius: 99, flexShrink: 0,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.teal, display: 'inline-block' }} />
            Live
          </motion.div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
          {chips.map(({ icon: Icon, label }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 10,
              background: C.surface, border: `1px solid ${C.border}`,
              fontSize: 12, fontWeight: 600, color: C.text,
            }}>
              <Icon size={13} style={{ color: C.teal }} /> {label}
            </div>
          ))}
        </div>

        <div style={{
          borderRadius: 12, border: `1px solid ${C.border}`,
          background: C.surface, padding: '14px 16px',
        }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
            Visitor activity
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 44 }}>
            {[28, 45, 36, 60, 52, 78, 90].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  borderRadius: '4px 4px 0 0',
                  background: i === 6 ? C.teal : `${C.teal}30`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Dashboard mockup ──────────────────────────────────────────────────────────

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
      background: C.surfaceElevated,
      boxShadow: '0 48px 96px rgba(15,23,42,0.14), 0 2px 8px rgba(15,23,42,0.06)',
    }}
  >
    <div style={{
      background: C.surface,
      padding: '11px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      borderBottom: `1px solid ${C.border}`,
    }}>
      {[C.red, C.amber, C.green].map((c) => (
        <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.7 }} />
      ))}
      <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: C.muted }}>
        Portfolios Builder — Dashboard
      </div>
      <div style={{
        fontSize: 10,
        color: C.teal,
        background: C.tealDim,
        border: `1px solid ${C.tealBorder}`,
        padding: '2px 8px',
        borderRadius: 6,
        fontWeight: 700,
      }}>
        ● Live
      </div>
    </div>

    <div style={{ display: 'flex', height: 360 }}>
      <div style={{
        width: 165,
        background: C.surface,
        borderRight: `1px solid ${C.border}`,
        padding: '14px 0',
        flexShrink: 0,
      }}>
        <div style={{
          padding: '0 14px 10px',
          fontSize: 9,
          color: C.muted,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontWeight: 700,
        }}>
          Navigation
        </div>
        {[
          { label: 'Dashboard', active: true, icon: '●' },
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
              fontWeight: active ? 700 : 500,
              color: active ? C.teal : C.textSub,
              background: active ? C.tealDim : 'transparent',
              borderLeft: active ? `2px solid ${C.teal}` : '2px solid transparent',
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

      <div style={{ flex: 1, padding: '18px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Good morning 👋</div>
            <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2 }}>
              Here's how your portfolio is doing
            </div>
          </div>
          <div style={{
            fontSize: 10,
            color: C.green,
            background: 'rgba(22,163,74,0.08)',
            border: '1px solid rgba(22,163,74,0.22)',
            padding: '3px 8px',
            borderRadius: 6,
            fontWeight: 700,
          }}>
            100% complete
          </div>
        </div>

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
                background: C.surface,
                borderRadius: 10,
                padding: '10px 12px',
                border: `1px solid ${C.border}`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 800, color }}>{val}</div>
              <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{label}</div>
              <div style={{
                fontSize: 9,
                color,
                marginTop: 3,
                background: `${color}12`,
                display: 'inline-block',
                padding: '1px 5px',
                borderRadius: 4,
                fontWeight: 700,
              }}>
                {delta}
              </div>
              {ChartPts && (
                <div style={{ position: 'absolute', bottom: 6, right: 8, opacity: 0.7 }}>
                  <MiniChart color={color} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{
          background: C.surface,
          borderRadius: 10,
          padding: '12px 14px',
          border: `1px solid ${C.border}`,
        }}>
          <div style={{ fontSize: 10, color: C.textSub, marginBottom: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
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
                  background: i === 5 ? C.teal : `${C.teal}25`,
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} style={{ flex: 1, textAlign: 'center', fontSize: 8, color: C.muted }}>{d}</span>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10, color: C.textSub, marginBottom: 7, fontWeight: 600 }}>Recent Activity</div>
          {[
            { dot: C.teal, text: 'Profile updated · 2m ago' },
            { dot: C.amber, text: 'New contact message · 14m ago' },
            { dot: C.blue, text: 'Project "Portfolios Builder" added · 1h ago' },
            { dot: C.purple, text: 'Theme changed to Indigo · 3h ago' },
          ].map(({ dot, text }) => (
            <div key={text} style={{
              padding: '5px 10px',
              borderRadius: 6,
              background: C.surface,
              marginBottom: 4,
              fontSize: 10,
              color: C.textSub,
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
    fontWeight: 700,
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
    color: C.text,
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
  const [landingData, setLandingData] = useState<LandingPageData | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlanPublicDTO[] | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const platformSettingsService = usePlatformSettingsService();
  const landingService = useLandingPageService();
  const subscriptionPlanService = useSubscriptionPlanService();

  useEffect(() => {
    platformSettingsService.getSettings().then((res: any) => {
      const url = res?.data?.data?.bannerImageUrl;
      if (url) setBannerUrl(url);
    });

    landingService.getPage().then((res: any) => {
      if (res?.data?.data) setLandingData(res.data.data);
    }).catch(() => {});

    subscriptionPlanService.getPublicPlans().then((res: any) => {
      if (res?.data?.data) setPlans(res.data.data);
    }).catch(() => {});

    fetch('/api/v1/public/profile-master')
      .then((r) => r.ok ? r.json() : null)
      .then((json) => { if (json?.data) setProfileMaster(json.data); })
      .catch(() => {});
  }, [platformSettingsService, landingService, subscriptionPlanService]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    }
  };

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // ── Backend-driven config + derived display arrays ────────────────────────
  const cfg = landingData?.config;

  const heroEyebrow = cfg?.heroEyebrow || 'Build Your Professional Portfolio';
  const heroHeadline1 = cfg?.heroHeadline1 || 'Your career story,';
  const heroHeadline2 = cfg?.heroHeadline2 || 'beautifully told.';
  const heroDescription = cfg?.heroDescription || 'Create a polished, professional portfolio in minutes. Add your experience, projects, and skills — we take care of the design, hosting, and updates.';
  const heroPrimaryCtaText = cfg?.heroPrimaryCtaText || 'Get Started Free';
  const heroSecondaryCtaText = cfg?.heroSecondaryCtaText || 'See how it works';
  const heroTrustBadges = cfg?.heroTrustBadges?.length ? cfg.heroTrustBadges : ['Free to start', 'No code required', 'Live in minutes', 'Fully customisable'];
  const ctaBadgeText = cfg?.ctaBadgeText || 'Ready to get started?';
  const ctaHeadline = cfg?.ctaHeadline || 'Your professional story deserves a great home';
  const ctaDescription = cfg?.ctaDescription || 'Sign up for free and start building. Add your first experience entry, upload a project screenshot, and watch your portfolio come to life — in minutes.';
  const ctaButtonText = cfg?.ctaButtonText || 'Get Started Free';
  const ctaTrustPoints = cfg?.ctaTrustPoints?.length ? cfg.ctaTrustPoints : ['Free to start', 'No credit card required', 'Cancel anytime'];

  const activeFeatures = landingData?.features?.filter(f => f.isActive).sort((a, b) => a.sortOrder - b.sortOrder) ?? [];
  const displayFeatures = activeFeatures.length > 0
    ? activeFeatures.map(f => ({ icon: resolveIcon(f.iconName), color: resolveColor(f.colorKey), title: f.title, desc: f.description }))
    : FEATURES;

  const activeFaqs = landingData?.faqs?.filter(f => f.isActive).sort((a, b) => a.sortOrder - b.sortOrder) ?? [];
  const displayFaqs = activeFaqs.length > 0
    ? activeFaqs.map(f => ({ q: f.question, a: f.answer }))
    : FAQS;

  const activeSteps = landingData?.steps?.filter(s => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder) ?? [];
  const displaySteps = activeSteps.length > 0
    ? activeSteps.map(s => ({ step: s.stepNumber, color: resolveColor(s.colorKey), icon: resolveIcon(s.iconName), title: s.title, bullets: s.bullets }))
    : HOW_TO_USE_STEPS;

  const activeAudience = landingData?.audienceCards?.filter(a => a.isActive).sort((a, b) => a.sortOrder - b.sortOrder) ?? [];
  const activeTestimonials = landingData?.testimonials?.filter(t => t.isActive).sort((a, b) => a.sortOrder - b.sortOrder) ?? [];

  const displayPlans = (plans && plans.length > 0 ? plans : PLANS);

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
          background: `${C.bg}E6`,
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
            boxShadow: `0 4px 14px ${C.tealGlow}`,
          }}>
            <Layers size={14} color="#fff" />
          </div>
          <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.025em', color: C.text }}>
            Portfolio<span style={{ color: C.teal }}>OS</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }} className="hidden-mobile">
            {['Features', 'How It Works', 'Pricing', 'FAQ'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                style={{ fontSize: 13, color: C.textSub, textDecoration: 'none', transition: 'color 0.2s', fontWeight: 500 }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.textSub; }}
              >
                {item}
              </a>
            ))}
          </nav>

          <motion.button
            onClick={onGetStarted}
            whileHover={{ scale: 1.04, boxShadow: `0 6px 22px ${C.tealGlow}` }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '9px 22px',
              borderRadius: 10,
              background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`,
              color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(13,148,136,0.28)',
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
        {/* Parallax glow — centering (translate -50%/-50%) lives on this static
            outer wrapper, and the framer-motion x/y spring lives alone on the
            inner element. Combining a plain translate% with motion's own x/y
            in one style object let the very first paint render without the
            centering transform (until Framer Motion's effect synced it in),
            producing a real one-time layout shift as it snapped into place. */}
        <div
          style={{
            position: 'absolute', pointerEvents: 'none',
            width: 800, height: 800,
            left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <motion.div
            style={{
              width: '100%', height: '100%', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(13,148,136,0.09) 0%, transparent 62%)',
              filter: 'blur(60px)',
              x: springX,
              y: springY,
            }}
          />
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="hero-grid">
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
                fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em',
                color: C.teal, background: C.tealDim, border: `1px solid ${C.tealBorder}`,
                marginBottom: 28,
              }}
            >
              <motion.span
                animate={{ opacity: [1, 0.25, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: C.teal, display: 'inline-block', flexShrink: 0 }}
              />
              {heroEyebrow}
            </motion.div>

            {/* Plain (non-animated) so the LCP-critical headline/description
                paint immediately instead of waiting on JS + the stagger
                entrance animation to reach opacity:1. */}
            <div>
              <h1 style={{ fontWeight: 900, fontSize: 'clamp(44px, 6vw, 80px)', lineHeight: 0.95, letterSpacing: '-0.045em', margin: 0, color: C.text }}>
                {heroHeadline1}
              </h1>
              <h1 style={{
                fontWeight: 900,
                fontSize: 'clamp(44px, 6vw, 80px)',
                lineHeight: 1.1,
                letterSpacing: '-0.045em',
                margin: '0 0 24px',
                background: `linear-gradient(120deg, ${C.teal}, ${C.blue})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {heroHeadline2}
              </h1>
            </div>

            <p style={{ fontSize: 'clamp(14px, 1.5vw, 17px)', lineHeight: 1.8, color: C.textSub, maxWidth: 480, margin: '0 0 36px' }}>
              {heroDescription}
            </p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.25 } } }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}
            >
              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.04, boxShadow: '0 10px 32px rgba(13,148,136,0.4)' }}
                transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '14px 32px', borderRadius: 14,
                  background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`,
                  color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(13,148,136,0.3)',
                }}
              >
                <LogIn size={16} /> {heroPrimaryCtaText}
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
                {heroSecondaryCtaText} <ArrowRight size={14} />
              </a>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, delay: 0.4 } } }}
              style={{ display: 'flex', gap: 22, marginTop: 28, flexWrap: 'wrap' }}
            >
              {heroTrustBadges.map((t) => (
                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: C.textSub, fontWeight: 600 }}>
                  <CheckCircle size={12} style={{ color: C.teal, flexShrink: 0 }} /> {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: CUBIC, delay: 0.3 }}
          >
            <PortfolioPreviewCard />
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
                background: C.surfaceElevated,
                padding: '26px 28px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', top: 10, right: 12,
                opacity: 0.08,
              }}>
                <Icon size={36} color={color} />
              </div>
              <div style={{
                fontWeight: 900,
                fontSize: 'clamp(26px, 3.5vw, 42px)',
                color,
                letterSpacing: '-0.04em',
              }}>
                {value}
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginTop: 4 }}>{label}</div>
              <div style={{ fontSize: 10.5, color: C.muted, marginTop: 3 }}>{sub}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Live profile snapshot (dynamic, only when data available) ── */}
      {profileMaster && (
        <section style={{ padding: '0 clamp(20px, 5vw, 72px) 80px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 36 }}>
              <SectionLabel>Live example</SectionLabel>
              <SectionTitle>A real portfolio, right now</SectionTitle>
              <p style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: C.textSub, maxWidth: 460, margin: '0 auto' }}>
                Real content counts — exactly what a visitor sees on this portfolio's public page.
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
                    background: C.surfaceElevated, border: `1px solid ${C.border}`,
                    textAlign: 'center', position: 'relative', overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'absolute', top: 8, right: 10, opacity: 0.08 }}>
                    <Icon size={32} color={color} />
                  </div>
                  <div style={{
                    fontWeight: 900, fontSize: 'clamp(22px, 2.8vw, 34px)',
                    color, letterSpacing: '-0.04em',
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
                  background: C.surfaceElevated, border: `1px solid ${C.tealBorder}`,
                  display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
                }}
              >
                {profileMaster.profile.profileImageUrl && (
                  <img
                    src={getOptimizedImageUrl(profileMaster.profile.profileImageUrl, { width: 120, height: 120 })}
                    alt={profileMaster.profile.fullName}
                    width={52}
                    height={52}
                    style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', border: `2px solid ${C.tealBorder}` }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{profileMaster.profile.fullName}</div>
                  {profileMaster.profile.headline && (
                    <div style={{ fontSize: 12.5, color: C.textSub, marginTop: 2 }}>{profileMaster.profile.headline}</div>
                  )}
                  {profileMaster.profile.location && (
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{profileMaster.profile.location}</div>
                  )}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 99,
                  background: C.tealDim, border: `1px solid ${C.tealBorder}`,
                  fontSize: 11, color: C.teal, fontWeight: 700,
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
            <SectionLabel>See it in action</SectionLabel>
            <SectionTitle>Manage everything from one place</SectionTitle>
            <p style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: C.textSub, maxWidth: 500, margin: '0 auto' }}>
              A simple, organised dashboard for every part of your portfolio — real-time insights and quick actions, all in one panel.
            </p>
          </motion.div>
          <motion.div {...fadeUp(0.15)}>
            {bannerUrl ? (
              <div style={{
                borderRadius: 18,
                overflow: 'hidden',
                border: `1px solid ${C.borderMid}`,
                boxShadow: '0 48px 96px rgba(15,23,42,0.14), 0 2px 8px rgba(15,23,42,0.06)',
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

      {/* ── Features ──────────────────────────────────────────── */}
      <section id="features" style={{
        padding: '80px clamp(20px, 5vw, 72px)',
        background: C.surface,
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionLabel>What you get</SectionLabel>
            <SectionTitle>Everything your portfolio needs</SectionTitle>
            <p style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: C.textSub, maxWidth: 480, margin: '0 auto' }}>
              From a guided dashboard to fast, polished pages, every detail is handled for you.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {displayFeatures.map(({ icon: Icon, color, title, desc }, i) => (
              <motion.div
                key={title}
                {...fadeUp(i * 0.07)}
                whileHover={{ y: -4 }}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  padding: '26px 24px 28px',
                  borderRadius: 18,
                  background: C.surfaceElevated,
                  border: `1px solid ${hoveredFeature === i ? `${color}45` : C.border}`,
                  cursor: 'default',
                  transition: 'border-color 0.25s, box-shadow 0.25s',
                  boxShadow: hoveredFeature === i ? `0 8px 32px ${color}14` : 'none',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${color}12`, border: `1px solid ${color}28`, color,
                  marginBottom: 18,
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

      {/* ── How it works ──────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '80px clamp(20px, 5vw, 72px)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 60 }}>
            <SectionLabel>Simple process</SectionLabel>
            <SectionTitle>From zero to live portfolio in under an hour</SectionTitle>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {displaySteps.map(({ step, color, icon: Icon, title, bullets }, i, arr) => (
              <motion.div key={step} {...fadeUp(i * 0.1)}>
                <div style={{
                  display: 'flex', gap: 32, padding: '40px 0',
                  borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : undefined,
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 16,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `${color}12`, border: `1px solid ${color}28`, color,
                    }}>
                      <Icon size={22} />
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{ width: 1, flex: 1, minHeight: 24, background: `linear-gradient(to bottom, ${color}40, transparent)` }} />
                    )}
                  </div>
                  <div style={{ flex: 1, paddingTop: 6 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color, marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Step {step}</div>
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

      {/* ── Content sections ──────────────────────────────────── */}
      <section style={{ padding: '80px clamp(20px, 5vw, 72px)', background: C.surface, position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionLabel>What you can manage</SectionLabel>
            <SectionTitle>9 portfolio sections, fully yours to edit</SectionTitle>
            <p style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: C.textSub, maxWidth: 500, margin: '0 auto' }}>
              Every section of your public portfolio is powered by what you enter in the dashboard.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {CONTENT_SECTIONS.map(({ icon: Icon, label, desc }, i) => (
              <motion.div key={label} {...fadeUp(i * 0.06)}>
                <motion.div
                  whileHover={{ borderColor: C.tealBorder, y: -3 }}
                  style={{
                    padding: '18px 20px 20px',
                    borderRadius: 14,
                    background: C.surfaceElevated,
                    border: `1px solid ${C.border}`,
                    transition: 'border-color 0.2s',
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
                  <p style={{ fontSize: 11.5, lineHeight: 1.65, color: C.textSub, margin: 0 }}>{desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '80px clamp(20px, 5vw, 72px)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 40 }}>
            <SectionLabel>Simple pricing</SectionLabel>
            <SectionTitle>Start free, upgrade when you're ready</SectionTitle>
            <p style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: C.textSub, maxWidth: 480, margin: '0 auto' }}>
              Every plan includes a live, hosted portfolio. Paid tiers unlock more sections and deeper insights.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.05)} style={{ display: 'flex', justifyContent: 'center', marginBottom: 44 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, padding: 4,
              borderRadius: 12, background: C.surface, border: `1px solid ${C.border}`,
            }}>
              {(['monthly', 'yearly'] as const).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  style={{
                    padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
                    fontSize: 12.5, fontWeight: 700, textTransform: 'capitalize',
                    color: billingCycle === cycle ? '#fff' : C.textSub,
                    background: billingCycle === cycle ? `linear-gradient(135deg, ${C.teal}, ${C.blue})` : 'transparent',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  {cycle === 'yearly' ? 'Yearly · save ~17%' : 'Monthly'}
                </button>
              ))}
            </div>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {displayPlans.map((plan, i) => {
              const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
              const suffix = billingCycle === 'monthly' ? '/month' : '/year';
              const currencySymbol = plan.currency === 'USD' ? '$' : `${plan.currency} `;
              const featured = plan.isDefault === false && i === 1;
              return (
                <motion.div
                  key={plan.name}
                  {...fadeUp(i * 0.08)}
                  whileHover={{ y: -4 }}
                  style={{
                    padding: '30px 26px', borderRadius: 20,
                    background: C.surfaceElevated,
                    border: `1px solid ${featured ? C.tealBorder : C.border}`,
                    boxShadow: featured ? `0 12px 40px ${C.teal}18` : 'none',
                    position: 'relative', display: 'flex', flexDirection: 'column',
                  }}
                >
                  {featured && (
                    <div style={{
                      position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                      padding: '4px 14px', borderRadius: 99,
                      background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`,
                      color: '#fff', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em',
                      boxShadow: `0 4px 14px ${C.tealGlow}`,
                    }}>
                      MOST POPULAR
                    </div>
                  )}

                  <h3 style={{ fontWeight: 800, fontSize: 18, color: C.text, marginBottom: 6 }}>{plan.name}</h3>
                  <p style={{ fontSize: 12.5, color: C.textSub, lineHeight: 1.6, marginBottom: 20, minHeight: 38 }}>
                    {plan.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                    <span style={{ fontWeight: 900, fontSize: 38, color: C.text, letterSpacing: '-0.03em' }}>
                      {price > 0 ? `${currencySymbol}${price}` : 'Free'}
                    </span>
                    {price > 0 && (
                      <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>{suffix}</span>
                    )}
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 26px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                    {plan.highlights.map((h) => (
                      <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: C.textSub }}>
                        <CheckCircle size={14} style={{ color: C.teal, flexShrink: 0, marginTop: 2 }} />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    onClick={onGetStarted}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                    style={{
                      padding: '12px 20px', borderRadius: 12, border: featured ? 'none' : `1px solid ${C.borderMid}`,
                      background: featured ? `linear-gradient(135deg, ${C.teal}, ${C.blue})` : 'transparent',
                      color: featured ? '#fff' : C.text,
                      fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    {price > 0 ? `Choose ${plan.name}` : 'Get Started Free'}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Audience cards (dynamic) ──────────────────────────── */}
      {activeAudience.length > 0 && (
        <section style={{ padding: '80px clamp(20px, 5vw, 72px)', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
              <SectionLabel>Who this is for</SectionLabel>
              <SectionTitle>Built for every professional</SectionTitle>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {activeAudience.map((aud, i) => {
                const AudIcon = resolveIcon(aud.iconName);
                const audColor = resolveColor(aud.colorKey);
                return (
                  <motion.div key={aud.id ?? i} {...fadeUp(i * 0.07)}>
                    <div style={{
                      padding: '26px 24px', borderRadius: 18,
                      background: C.surfaceElevated, border: `1px solid ${C.border}`,
                      height: '100%',
                    }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `${audColor}12`, border: `1px solid ${audColor}28`, color: audColor,
                        marginBottom: 16,
                      }}>
                        <AudIcon size={20} />
                      </div>
                      <h3 style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 8, color: C.text }}>{aud.title}</h3>
                      <p style={{ fontSize: 12.5, lineHeight: 1.75, color: C.textSub, margin: 0 }}>{aud.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials (dynamic) ────────────────────────────── */}
      {activeTestimonials.length > 0 && (
        <section style={{ padding: '80px clamp(20px, 5vw, 72px)', background: C.surface, position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
              <SectionLabel>What people say</SectionLabel>
              <SectionTitle>Trusted by professionals</SectionTitle>
            </motion.div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {activeTestimonials.map((t, i) => (
                <motion.div key={t.id ?? i} {...fadeUp(i * 0.08)}>
                  <div style={{
                    padding: '28px 26px', borderRadius: 18,
                    background: C.surfaceElevated, border: `1px solid ${C.border}`,
                    height: '100%', display: 'flex', flexDirection: 'column', gap: 16,
                  }}>
                    <div style={{ fontSize: 36, lineHeight: 1, color: `${C.teal}45`, fontFamily: 'Georgia, serif' }}>"</div>
                    <p style={{ fontSize: 13.5, lineHeight: 1.8, color: C.textSub, margin: 0, flex: 1 }}>{t.content}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {t.avatarUrl ? (
                        <img src={t.avatarUrl} alt={t.authorName} style={{
                          width: 40, height: 40, borderRadius: '50%',
                          border: `2px solid ${C.tealBorder}`, objectFit: 'cover', flexShrink: 0,
                        }} />
                      ) : (
                        <div style={{
                          width: 40, height: 40, borderRadius: '50%',
                          background: C.tealDim, border: `2px solid ${C.tealBorder}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 16, color: C.teal, fontWeight: 700, flexShrink: 0,
                        }}>
                          {t.authorName.charAt(0)}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{t.authorName}</div>
                        <div style={{ fontSize: 11.5, color: C.muted }}>
                          {t.authorRole}{t.authorCompany ? ` · ${t.authorCompany}` : ''}
                        </div>
                      </div>
                      {t.linkedinUrl && (
                        <a
                          href={t.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: C.muted, transition: 'color 0.2s', flexShrink: 0 }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = C.blue; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = C.muted; }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                            <rect x="2" y="9" width="4" height="12"/>
                            <circle cx="4" cy="4" r="2"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '80px clamp(20px, 5vw, 72px)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
            <SectionLabel>Common questions</SectionLabel>
            <SectionTitle>Frequently asked</SectionTitle>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {displayFaqs.map(({ q, a }, i) => (
              <motion.div key={i} {...fadeUp(i * 0.05)}>
                <div style={{
                  borderRadius: 12, background: C.surfaceElevated,
                  border: `1px solid ${openFaq === i ? C.tealBorder : C.border}`,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                  boxShadow: openFaq === i ? `0 4px 20px ${C.teal}12` : 'none',
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
            background: `radial-gradient(ellipse at 50% 0%, ${C.teal}10 0%, transparent 65%)`,
          }} />
          <div style={{
            position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
            background: `linear-gradient(90deg, transparent, ${C.teal}70, transparent)`,
          }} />

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px', borderRadius: 99, marginBottom: 24,
            fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
            color: C.teal, background: C.tealDim, border: `1px solid ${C.tealBorder}`,
          }}>
            {ctaBadgeText}
          </div>

          <h2 style={{
            fontWeight: 800, fontSize: 'clamp(26px, 4vw, 42px)', letterSpacing: '-0.03em',
            lineHeight: 1.15, marginBottom: 14, position: 'relative', color: C.text,
          }}>
            {ctaHeadline}
          </h2>
          <p style={{ fontSize: 15, color: C.textSub, marginBottom: 36, position: 'relative', lineHeight: 1.75 }}>
            {ctaDescription}
          </p>

          <motion.button
            onClick={onGetStarted}
            whileHover={{ scale: 1.05, boxShadow: '0 12px 36px rgba(13,148,136,0.4)' }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 40px', borderRadius: 14,
              background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`,
              color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
              boxShadow: '0 10px 28px rgba(13,148,136,0.3)', position: 'relative',
            }}
          >
            <LogIn size={17} /> {ctaButtonText}
          </motion.button>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24, flexWrap: 'wrap' }}>
            {ctaTrustPoints.map((t) => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: C.textSub, fontWeight: 600 }}>
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
            <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: '-0.02em', color: C.text }}>
              Portfolio<span style={{ color: C.teal }}>OS</span>
            </div>
          </div>

          <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>
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
