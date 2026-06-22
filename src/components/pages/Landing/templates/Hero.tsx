import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { LuLogIn, LuCircleCheck, LuArrowRight } from 'react-icons/lu';
import { C, CUBIC } from '../constants';
import AnimatedTerminal from '../AnimatedTerminal';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    }
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        padding: '100px clamp(20px, 5vw, 72px) 60px',
        position: 'relative', zIndex: 1,
      }}
    >
      <motion.div style={{
        position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
        width: 800, height: 800,
        background: `radial-gradient(circle, rgba(20,184,160,0.07) 0%, transparent 62%)`,
        filter: 'blur(60px)',
        x: springX, y: springY,
        left: '50%', top: '50%',
        translateX: '-50%', translateY: '-50%',
      }} />

      <div
        className="hero-grid"
        style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
        >
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

          <motion.div variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: CUBIC } } }}>
            <h1 style={{ fontWeight: 900, fontSize: 'clamp(44px, 6vw, 80px)', lineHeight: 0.95, letterSpacing: '-0.045em', margin: 0, color: C.text }}>
              Your portfolio,
            </h1>
            <h1 style={{
              fontWeight: 900, fontSize: 'clamp(44px, 6vw, 80px)', lineHeight: 1.1,
              letterSpacing: '-0.045em', margin: '0 0 24px',
              background: `linear-gradient(120deg, ${C.tealLight}, ${C.blue})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              fully managed.
            </h1>
          </motion.div>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } } }}
            style={{ fontSize: 'clamp(14px, 1.5vw, 17px)', lineHeight: 1.8, color: C.textSub, maxWidth: 480, margin: '0 0 36px' }}
          >
            A three-app system — admin dashboard, REST API, and public portfolio — that lets you manage your entire professional story from one place, without ever editing code.
          </motion.p>

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
              <LuLogIn size={16} /> Open Dashboard
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
              How it works <LuArrowRight size={14} />
            </a>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, delay: 0.4 } } }}
            style={{ display: 'flex', gap: 22, marginTop: 28, flexWrap: 'wrap' }}
          >
            {['Self-hosted', 'No vendor lock-in', 'JWT secured', 'Cloudinary CDN'].map((t) => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: C.muted, fontFamily: 'monospace' }}>
                <LuCircleCheck size={12} style={{ color: C.teal, flexShrink: 0 }} /> {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: CUBIC, delay: 0.3 }}
        >
          <AnimatedTerminal />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
