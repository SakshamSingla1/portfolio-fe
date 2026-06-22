import React from 'react';
import { motion } from 'framer-motion';
import { LuLogIn, LuCircleCheck } from 'react-icons/lu';
import { C } from '../constants';

interface CTAProps {
  onGetStarted: () => void;
}

const CTA = ({ onGetStarted }: CTAProps) => (
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
        <LuLogIn size={17} /> Open Dashboard
      </motion.button>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24, flexWrap: 'wrap' }}>
        {['No credit card required', 'Fully self-hosted', 'Open source'].map((t) => (
          <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: C.muted, fontFamily: 'monospace' }}>
            <LuCircleCheck size={12} style={{ color: C.teal }} /> {t}
          </span>
        ))}
      </div>
    </motion.div>
  </section>
);

export default CTA;
