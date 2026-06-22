import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LuLayoutDashboard, LuGlobe, LuPalette, LuChartBar, LuCloud, LuLock } from 'react-icons/lu';
import { C, fadeUp } from '../constants';
import { SectionLabel, SectionTitle } from '../SectionPrimitives';

const FEATURES = [
  {
    icon: LuLayoutDashboard, color: C.teal,
    title: 'Full-Featured CMS',
    desc: 'Manage experience, skills, projects, certifications, education, and testimonials — all from one clean admin panel without touching a line of code.',
  },
  {
    icon: LuGlobe, color: C.blue,
    title: 'Production Portfolio',
    desc: 'Your public site is generated from dashboard data. Beautifully animated, fully responsive, SEO-optimised — you never write HTML or CSS.',
  },
  {
    icon: LuPalette, color: C.purple,
    title: 'Dynamic Theme Engine',
    desc: '10+ colour palettes switchable from the dashboard. Switch from indigo to emerald in one click and the public site updates instantly.',
  },
  {
    icon: LuChartBar, color: C.amber,
    title: 'Real-Time Analytics',
    desc: 'Track profile views, visitor sessions, device breakdown, and resume downloads. Know exactly when a recruiter is browsing your work.',
  },
  {
    icon: LuCloud, color: '#06B6D4',
    title: 'Cloudinary CDN',
    desc: 'All images are stored on Cloudinary and served via global CDN with on-the-fly optimisation — fast everywhere, always.',
  },
  {
    icon: LuLock, color: C.red,
    title: 'JWT Auth + RBAC',
    desc: 'Secure login with signed JWT tokens. Role-based access control keeps the admin private while your portfolio stays fully public.',
  },
];

const Features = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="features" style={{ padding: '80px clamp(20px, 5vw, 72px)', background: C.surface, position: 'relative', zIndex: 1 }}>
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
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: '26px 24px 28px', borderRadius: 18, background: C.bg,
                border: `1px solid ${hovered === i ? `${color}35` : C.border}`,
                cursor: 'default', transition: 'border-color 0.25s, box-shadow 0.25s',
                boxShadow: hovered === i ? `0 8px 32px ${color}0E, inset 0 0 0 1px ${color}15` : 'none',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {hovered === i && (
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: `radial-gradient(ellipse at 20% 20%, ${color}06 0%, transparent 60%)`,
                }} />
              )}
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${color}10`, border: `1px solid ${color}22`, color,
                marginBottom: 18, transition: 'box-shadow 0.25s',
                boxShadow: hovered === i ? `0 0 18px ${color}30` : 'none',
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
  );
};

export default Features;
