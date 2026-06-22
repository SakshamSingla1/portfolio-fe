import { motion } from 'framer-motion';
import { LuActivity, LuGitBranch, LuTrendingUp, LuUsers } from 'react-icons/lu';
import { C, fadeUp } from '../constants';

const METRICS = [
  { icon: LuActivity, label: 'Uptime', val: '99.9%', color: C.green },
  { icon: LuGitBranch, label: 'Apps', val: '3', color: C.teal },
  { icon: LuTrendingUp, label: 'Load', val: '< 1s', color: C.blue },
  { icon: LuUsers, label: 'Roles', val: 'RBAC', color: C.purple },
];

const MetricsStrip = () => (
  <section style={{ padding: '0 clamp(20px, 5vw, 72px) 80px', position: 'relative', zIndex: 1 }}>
    <motion.div
      {...fadeUp()}
      style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '28px 36px', borderRadius: 18,
        background: C.surface, border: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 24,
      }}
    >
      <div>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: C.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
          Platform at a glance
        </div>
        <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Portfolios Builder is production-ready, end to end</div>
      </div>
      <div style={{ display: 'flex', gap: 36, flexWrap: 'wrap' }}>
        {METRICS.map(({ icon: Icon, label, val, color }) => (
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
);

export default MetricsStrip;
