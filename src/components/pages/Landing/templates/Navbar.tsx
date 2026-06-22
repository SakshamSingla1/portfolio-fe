import { motion } from 'framer-motion';
import { LuLogIn } from 'react-icons/lu';
import { C, CUBIC } from '../constants';

interface NavbarProps {
  onGetStarted: () => void;
  apiStatus: 'loading' | 'ok' | 'down';
}

const Navbar = ({ onGetStarted, apiStatus }: NavbarProps) => (
  <motion.nav
    initial={{ y: -60, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: CUBIC }}
    style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(20px, 5vw, 72px)', height: 62,
      background: `${C.bg}E0`,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: `1px solid ${C.border}`,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <img
        src="/pb-logo.png"
        alt="Portfolios Builder"
        style={{ height: 36, width: 'auto', objectFit: 'contain', filter: 'brightness(1.5) drop-shadow(0 0 8px rgba(75,94,255,0.35))' }}
      />
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <div
        className="hidden-mobile"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 99,
          fontSize: 10.5, fontFamily: 'monospace', fontWeight: 600,
          background: apiStatus === 'ok' ? 'rgba(34,197,94,0.1)' : apiStatus === 'down' ? 'rgba(239,68,68,0.1)' : 'rgba(156,163,175,0.1)',
          color: apiStatus === 'ok' ? C.green : apiStatus === 'down' ? C.red : C.textSub,
          border: `1px solid ${apiStatus === 'ok' ? 'rgba(34,197,94,0.25)' : apiStatus === 'down' ? 'rgba(239,68,68,0.25)' : 'rgba(156,163,175,0.15)'}`,
        }}
      >
        {apiStatus !== 'loading' && (
          <motion.span
            animate={apiStatus === 'ok' ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block', flexShrink: 0 }}
          />
        )}
        API {apiStatus === 'loading' ? '…' : apiStatus === 'ok' ? 'online' : 'offline'}
      </div>

      <nav className="hidden-mobile" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {['Features', 'How It Works', 'Tech Stack', 'FAQ'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
            style={{ fontSize: 13, color: C.textSub, textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.textSub; }}
          >
            {item}
          </a>
        ))}
      </nav>

      <motion.button
        onClick={onGetStarted}
        whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${C.tealGlow}` }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '9px 22px',
          borderRadius: 10,
          background: `linear-gradient(135deg, ${C.teal}, ${C.blue}80)`,
          color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
          boxShadow: `0 0 20px rgba(20,184,160,0.28)`,
        }}
      >
        <LuLogIn size={14} /> Login
      </motion.button>
    </div>
  </motion.nav>
);

export default Navbar;
