import React from 'react';
import { LuServer, LuCode, LuImage, LuDatabase } from 'react-icons/lu';
import { C } from '../constants';

const Footer = () => (
  <footer style={{ borderTop: `1px solid ${C.border}`, padding: '28px clamp(20px, 5vw, 72px)', position: 'relative', zIndex: 1 }}>
    <div style={{
      maxWidth: 1100, margin: '0 auto',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img
          src="/pb-logo.png"
          alt="Portfolios Builder"
          style={{ height: 30, width: 'auto', objectFit: 'contain', filter: 'brightness(1.5) drop-shadow(0 0 6px rgba(75,94,255,0.3))' }}
        />
      </div>

      <div style={{ display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
        {[
          { icon: LuServer, label: 'Spring Boot 3' },
          { icon: LuCode, label: 'React + Vite' },
          { icon: LuImage, label: 'Cloudinary CDN' },
          { icon: LuDatabase, label: 'MongoDB' },
        ].map(({ icon: Icon, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.muted, fontFamily: 'monospace' }}>
            <Icon size={11} style={{ color: `${C.teal}60` }} /> {label}
          </span>
        ))}
      </div>

      <p style={{ fontFamily: 'monospace', fontSize: 11, color: C.muted, margin: 0 }}>
        Your professional story, delivered.
      </p>
    </div>
  </footer>
);

export default Footer;
