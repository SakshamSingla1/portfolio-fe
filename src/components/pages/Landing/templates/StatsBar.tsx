import { motion } from 'framer-motion';
import { LuLayers, LuDatabase, LuPalette, LuZap } from 'react-icons/lu';
import { C, fadeUp } from '../constants';

const STATS = [
  { value: '3', label: 'Applications', sub: 'Admin · API · Portfolio', icon: LuLayers, color: C.teal },
  { value: '9+', label: 'Content Sections', sub: 'Fully CMS-driven', icon: LuDatabase, color: C.purple },
  { value: '10+', label: 'Theme Palettes', sub: 'Live switchable', icon: LuPalette, color: C.blue },
  { value: '< 1s', label: 'Load Time', sub: 'Vite + Cloudinary CDN', icon: LuZap, color: C.amber },
];

const StatsBar = () => (
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
        <div key={label} style={{
          background: C.surface, padding: '26px 28px',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 10, right: 12, opacity: 0.06 }}>
            <Icon size={36} color={color} />
          </div>
          <div style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 42px)', color, letterSpacing: '-0.04em', fontFamily: 'monospace' }}>
            {value}
          </div>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.text, marginTop: 4 }}>{label}</div>
          <div style={{ fontSize: 10.5, color: C.muted, marginTop: 3, fontFamily: 'monospace' }}>{sub}</div>
        </div>
      ))}
    </motion.div>
  </section>
);

export default StatsBar;
