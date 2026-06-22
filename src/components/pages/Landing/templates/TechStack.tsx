import { motion } from 'framer-motion';
import { C, fadeUp } from '../constants';
import { SectionLabel, SectionTitle } from '../SectionPrimitives';

const TECH_STACK = [
  { cat: 'Backend', color: C.teal, items: ['Spring Boot 3', 'Java 21', 'MongoDB', 'JWT Auth', 'Cloudinary SDK', 'REST APIs'] },
  { cat: 'Admin Frontend', color: C.purple, items: ['React 18', 'TypeScript', 'Vite 5', 'Tailwind CSS 4', 'Framer Motion', 'MUI v6'] },
  { cat: 'Public Portfolio', color: C.blue, items: ['React 18', 'TypeScript', 'Vite 5', 'Tailwind CSS 4', 'Framer Motion', 'React Router v7'] },
];

const TechStack = () => (
  <section id="tech-stack" style={{ padding: '80px clamp(20px, 5vw, 72px)', background: C.surface, position: 'relative', zIndex: 1 }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
        <SectionLabel>Technology</SectionLabel>
        <SectionTitle>Built on a modern, proven stack</SectionTitle>
        <p style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: C.textSub, maxWidth: 480, margin: '0 auto' }}>
          No experimental frameworks. Battle-tested technologies with large communities and long-term support.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {TECH_STACK.map(({ cat, color, items }, i) => (
          <motion.div key={cat} {...fadeUp(i * 0.1)}>
            <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${color}18`, background: C.bg }}>
              <div style={{
                padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10,
                background: `${color}07`, borderBottom: `1px solid ${color}12`,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}80` }} />
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
);

export default TechStack;
