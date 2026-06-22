import { motion } from 'framer-motion';
import { LuShield, LuDatabase, LuPalette, LuEye, LuChevronRight } from 'react-icons/lu';
import { C, fadeUp } from '../constants';
import { SectionLabel, SectionTitle } from '../SectionPrimitives';

const STEPS = [
  {
    step: '01', color: C.purple, icon: LuShield,
    title: 'Login to your admin dashboard',
    bullets: [
      'Navigate to your portfolio-fe deployment URL',
      'Enter credentials to receive a signed JWT token',
      'Session stays active until you sign out',
    ],
  },
  {
    step: '02', color: C.teal, icon: LuDatabase,
    title: 'Build your profile',
    bullets: [
      'Fill in About, skills, work experience, and education',
      'Upload profile photo and project images — all stored on Cloudinary',
      'Add projects with live demo links, GitHub URLs, and tech tags',
      'Create certifications with credential IDs and verification links',
    ],
  },
  {
    step: '03', color: C.blue, icon: LuPalette,
    title: 'Customise your theme',
    bullets: [
      'Choose from 10+ colour palettes in the Theme settings',
      'The public portfolio reflects the change on next page load',
      'No CSS knowledge or rebuild required',
    ],
  },
  {
    step: '04', color: C.amber, icon: LuEye,
    title: 'Share your live portfolio',
    bullets: [
      "Your public portfolio is already live at portfolio-main's URL",
      'Paste the link in job applications, LinkedIn, or your email signature',
      'Watch visitor analytics in the dashboard Overview panel',
    ],
  },
];

const HowToUse = () => (
  <section style={{ padding: '80px clamp(20px, 5vw, 72px)', position: 'relative', zIndex: 1 }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 60 }}>
        <SectionLabel>Simple process</SectionLabel>
        <SectionTitle>From zero to live portfolio in under an hour</SectionTitle>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {STEPS.map(({ step, color, icon: Icon, title, bullets }, i) => (
          <motion.div key={step} {...fadeUp(i * 0.1)}>
            <div style={{
              display: 'flex', gap: 32, padding: '40px 0',
              borderBottom: i < STEPS.length - 1 ? `1px solid ${C.border}` : undefined,
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${color}10`, border: `1px solid ${color}22`, color,
                  boxShadow: `0 0 20px ${color}15`,
                }}>
                  <Icon size={22} />
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 1, flex: 1, minHeight: 24, background: `linear-gradient(to bottom, ${color}35, transparent)` }} />
                )}
              </div>
              <div style={{ flex: 1, paddingTop: 6 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 10.5, color, marginBottom: 5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Step {step}</div>
                <h3 style={{ fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 14 }}>{title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {bullets.map((b) => (
                    <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: C.textSub, lineHeight: 1.65 }}>
                      <LuChevronRight size={13} style={{ color, flexShrink: 0, marginTop: 3 }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowToUse;
