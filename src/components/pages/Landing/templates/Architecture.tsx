import { motion } from 'framer-motion';
import { LuTerminal, LuServer, LuGlobe } from 'react-icons/lu';
import { C, fadeUp } from '../constants';
import { SectionLabel, SectionTitle } from '../SectionPrimitives';

const ARCHITECTURE_STEPS = [
  {
    n: '01', icon: LuTerminal, color: C.purple,
    title: 'Admin Dashboard',
    label: 'portfolio-fe · :5174',
    desc: 'You log in here. Add content, upload images, configure your theme, manage roles, and publish everything — no code required.',
  },
  {
    n: '02', icon: LuServer, color: C.teal,
    title: 'REST API',
    label: 'portfolio-be · :8080',
    desc: 'Spring Boot 3 handles authentication, persists data to MongoDB, manages Cloudinary uploads, and serves structured JSON to both frontends.',
  },
  {
    n: '03', icon: LuGlobe, color: C.blue,
    title: 'Public Portfolio',
    label: 'portfolio-main · :5173',
    desc: 'Anyone with the link sees this. Reads from the same API and renders your portfolio beautifully — no login required.',
  },
];

type FlowItem = { label: string; color: string } | { sep: string };

const DATA_FLOW: FlowItem[] = [
  { label: 'You (Admin)', color: C.purple },
  { sep: '→ login →' },
  { label: 'portfolio-fe', color: C.purple },
  { sep: '→ HTTPS →' },
  { label: 'portfolio-be API', color: C.teal },
  { sep: '→ JSON →' },
  { label: 'portfolio-main', color: C.blue },
  { sep: '→ public' },
];

const Architecture = () => (
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
                display: 'inline-flex', fontFamily: 'monospace', fontSize: 10, color: C.muted,
                background: C.surfaceAlt, border: `1px solid ${C.border}`,
                padding: '2px 8px', borderRadius: 5, marginBottom: 12,
              }}>
                {label}
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.75, color: C.textSub, margin: 0 }}>{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div {...fadeUp(0.3)} style={{
        marginTop: 32, padding: '20px 24px', borderRadius: 14,
        background: C.surface, border: `1px solid ${C.border}`,
      }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10.5, color: C.muted, marginBottom: 10 }}>data flow</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontFamily: 'monospace', fontSize: 11 }}>
          {DATA_FLOW.map((item, i) =>
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
);

export default Architecture;
