import React from 'react';
import { motion } from 'framer-motion';
import { LuBriefcase, LuCode, LuMonitor, LuAward, LuCircleCheck, LuGraduationCap, LuStar, LuMessageSquare } from 'react-icons/lu';
import { C, fadeUp } from '../constants';
import { SectionLabel, SectionTitle } from '../SectionPrimitives';

const CONTENT_SECTIONS = [
  { icon: LuBriefcase, label: 'Experience', desc: 'Role, company, dates, location, employment type, tech stack' },
  { icon: LuCode, label: 'Skills', desc: 'Categorised with logo, proficiency level, and progress bars' },
  { icon: LuMonitor, label: 'Projects', desc: 'Images, live demo, GitHub links, descriptions, skill tags' },
  { icon: LuAward, label: 'Achievements', desc: 'Proof images, issuer, date, and description' },
  { icon: LuCircleCheck, label: 'Certifications', desc: 'Credential ID, verification URL, and expiry tracking' },
  { icon: LuGraduationCap, label: 'Education', desc: 'Degree, field of study, institution, grade, years' },
  { icon: LuStar, label: 'Testimonials', desc: 'Reviews with name, role, company, avatar, and LinkedIn' },
  { icon: LuMessageSquare, label: 'Contact', desc: 'Submissions land in your admin inbox — no third-party forms' },
];

const ContentSections = () => (
  <section style={{ padding: '80px clamp(20px, 5vw, 72px)', position: 'relative', zIndex: 1 }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 52 }}>
        <SectionLabel>What you can manage</SectionLabel>
        <SectionTitle>9 portfolio sections, fully CMS-driven</SectionTitle>
        <p style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: C.textSub, maxWidth: 500, margin: '0 auto' }}>
          Every section of your public portfolio is powered by data you enter in the dashboard — no hard-coded content anywhere.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
        {CONTENT_SECTIONS.map(({ icon: Icon, label, desc }, i) => (
          <motion.div key={label} {...fadeUp(i * 0.06)}>
            <motion.div
              whileHover={{ borderColor: C.tealBorder, y: -3, background: C.surfaceAlt }}
              style={{
                padding: '18px 20px 20px', borderRadius: 14,
                background: C.surface, border: `1px solid ${C.border}`,
                transition: 'background 0.2s, border-color 0.2s', height: '100%',
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
              <p style={{ fontSize: 11.5, lineHeight: 1.65, color: C.muted, margin: 0 }}>{desc}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ContentSections;
