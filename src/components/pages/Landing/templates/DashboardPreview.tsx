import { motion } from 'framer-motion';
import { C, fadeUp } from '../constants';
import { SectionLabel, SectionTitle } from '../SectionPrimitives';
import DashboardMockup from '../DashboardMockup';

interface DashboardPreviewProps {
  bannerUrl?: string | null;
}

const DashboardPreview = ({ bannerUrl }: DashboardPreviewProps) => (
  <section style={{ padding: '80px clamp(20px, 5vw, 72px)', background: C.surface, position: 'relative', zIndex: 1, overflow: 'hidden' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
        <SectionLabel>Admin panel</SectionLabel>
        <SectionTitle>Your command centre</SectionTitle>
        <p style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: C.textSub, maxWidth: 480, margin: '0 auto' }}>
          Every section of your portfolio lives in the dashboard. Update it once — your public site reflects it instantly.
        </p>
      </motion.div>

      <motion.div {...fadeUp(0.15)} style={{ position: 'relative' }}>
        {bannerUrl ? (
          <div style={{
            borderRadius: 20, overflow: 'hidden',
            border: `1px solid ${C.borderMid}`,
            boxShadow: `0 32px 80px rgba(0,0,0,0.5)`,
          }}>
            <img
              src={bannerUrl}
              alt="Dashboard preview"
              style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: 520 }}
            />
          </div>
        ) : (
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <DashboardMockup />
          </div>
        )}

        {/* Glow beneath */}
        <div style={{
          position: 'absolute', bottom: -60, left: '10%', right: '10%', height: 120,
          background: `radial-gradient(ellipse, ${C.teal}18 0%, transparent 70%)`,
          filter: 'blur(30px)', pointerEvents: 'none',
        }} />
      </motion.div>
    </div>
  </section>
);

export default DashboardPreview;
