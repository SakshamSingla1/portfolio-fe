import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuChevronDown } from 'react-icons/lu';
import { C, CUBIC, fadeUp } from '../constants';
import { SectionLabel, SectionTitle } from '../SectionPrimitives';

const FAQS = [
  {
    q: 'Is this SaaS or self-hosted?',
    a: 'Self-hosted. You deploy the Spring Boot backend, the admin frontend, and the public frontend wherever you like — VPS, cloud VM, Vercel/Railway combo. You own all data and infrastructure.',
  },
  {
    q: 'Do I need to write code to update my portfolio?',
    a: 'No. The admin dashboard is a full no-code CMS. Fill in forms, upload images, click Save. The public portfolio reflects every change immediately.',
  },
  {
    q: 'How is the dashboard protected?',
    a: 'JWT tokens are issued on login and validated on every admin API request. Role-based permissions control which sections each user can access. Password resets flow through email verification.',
  },
  {
    q: 'Can I use my own domain?',
    a: "Yes. Point your domain's DNS to your deployment and configure the frontend build with your domain. Standard static hosting setup — no special configuration needed.",
  },
  {
    q: 'What database does it use?',
    a: 'MongoDB. The Spring Boot backend uses Spring Data MongoDB for persistence. Any MongoDB-compatible host works — MongoDB Atlas is the simplest cloud option.',
  },
  {
    q: 'How does theme switching work?',
    a: 'The public portfolio fetches the active colour palette from the API on load. Change the theme in the dashboard and the public site picks it up on next load — no rebuild required.',
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" style={{ padding: '80px clamp(20px, 5vw, 72px)', background: C.surface, position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
          <SectionLabel>Common questions</SectionLabel>
          <SectionTitle>Frequently asked</SectionTitle>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAQS.map(({ q, a }, i) => (
            <motion.div key={i} {...fadeUp(i * 0.05)}>
              <div style={{
                borderRadius: 12, background: C.bg,
                border: `1px solid ${open === i ? C.tealBorder : C.border}`,
                overflow: 'hidden', transition: 'border-color 0.2s',
                boxShadow: open === i ? `0 4px 20px ${C.teal}0A` : 'none',
              }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer',
                    color: C.text, textAlign: 'left', gap: 16,
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.5 }}>{q}</span>
                  <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0 }}>
                    <LuChevronDown size={16} style={{ color: C.teal }} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
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
  );
};

export default FAQ;
