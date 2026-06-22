import { motion } from 'framer-motion';
import { LuMonitor, LuCode, LuBriefcase, LuAward, LuStar, LuCircleCheck, LuGraduationCap, LuGlobe } from 'react-icons/lu';
import { C, fadeUp } from '../constants';
import { SectionLabel, SectionTitle } from '../SectionPrimitives';

interface ProfileSnapshotProps {
  profileMaster: any;
}

const getMetrics = (pm: any) => [
  { label: 'Projects', value: pm.projects?.length ?? 0, icon: LuMonitor, color: C.teal },
  { label: 'Skills', value: pm.skills?.length ?? 0, icon: LuCode, color: C.purple },
  { label: 'Experience', value: pm.experiences?.length ?? 0, icon: LuBriefcase, color: C.blue },
  { label: 'Achievements', value: pm.achievements?.length ?? 0, icon: LuAward, color: C.amber },
  { label: 'Testimonials', value: pm.testimonials?.length ?? 0, icon: LuStar, color: C.green },
  { label: 'Certifications', value: pm.certifications?.length ?? 0, icon: LuCircleCheck, color: C.red },
  { label: 'Education', value: pm.educations?.length ?? 0, icon: LuGraduationCap, color: C.tealLight },
  { label: 'Social Links', value: pm.socialLinks?.length ?? 0, icon: LuGlobe, color: C.purpleLight },
];

const ProfileSnapshot = ({ profileMaster }: ProfileSnapshotProps) => (
  <section style={{ padding: '0 clamp(20px, 5vw, 72px) 80px', position: 'relative', zIndex: 1 }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <motion.div {...fadeUp()} style={{ textAlign: 'center', marginBottom: 36 }}>
        <SectionLabel>Live profile data</SectionLabel>
        <SectionTitle>Your portfolio, right now</SectionTitle>
        <p style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', color: C.textSub, maxWidth: 460, margin: '0 auto' }}>
          Content counts pulled live from the API — reflecting exactly what visitors see on your public portfolio.
        </p>
      </motion.div>

      <motion.div
        {...fadeUp(0.1)}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}
      >
        {getMetrics(profileMaster).map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            {...fadeUp(i * 0.05)}
            style={{
              padding: '20px 18px', borderRadius: 14,
              background: C.surface, border: `1px solid ${C.border}`,
              textAlign: 'center', position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 8, right: 10, opacity: 0.06 }}>
              <Icon size={32} color={color} />
            </div>
            <div style={{ fontWeight: 900, fontSize: 'clamp(22px, 2.8vw, 34px)', color, letterSpacing: '-0.04em', fontFamily: 'monospace' }}>
              {value}
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: C.textSub, marginTop: 4 }}>{label}</div>
          </motion.div>
        ))}
      </motion.div>

      {profileMaster.profile && (
        <motion.div
          {...fadeUp(0.2)}
          style={{
            marginTop: 20, padding: '20px 24px', borderRadius: 14,
            background: C.surface, border: `1px solid ${C.tealBorder}`,
            display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
          }}
        >
          {profileMaster.profile.profileImageUrl && (
            <img
              src={profileMaster.profile.profileImageUrl}
              alt={profileMaster.profile.fullName}
              style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', border: `2px solid ${C.tealBorder}` }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{profileMaster.profile.fullName}</div>
            {profileMaster.profile.headline && (
              <div style={{ fontSize: 12.5, color: C.textSub, marginTop: 2 }}>{profileMaster.profile.headline}</div>
            )}
            {profileMaster.profile.location && (
              <div style={{ fontSize: 11, color: C.muted, marginTop: 3, fontFamily: 'monospace' }}>{profileMaster.profile.location}</div>
            )}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 99,
            background: C.tealDim, border: `1px solid ${C.tealBorder}`,
            fontSize: 11, fontFamily: 'monospace', color: C.teal, fontWeight: 600,
          }}>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 5, height: 5, borderRadius: '50%', background: C.teal, display: 'inline-block' }}
            />
            Live
          </div>
        </motion.div>
      )}
    </div>
  </section>
);

export default ProfileSnapshot;
