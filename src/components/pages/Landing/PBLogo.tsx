import React from 'react';

interface PBLogoProps {
  height?: number;
  iconOnly?: boolean;
  style?: React.CSSProperties;
}

const PBLogo = ({ height = 36, iconOnly = false, style }: PBLogoProps) => (
  <img
    src={iconOnly ? '/pb-logo-icon.png' : '/pb-logo.png'}
    alt="Portfolios Builder"
    style={{
      height,
      width: 'auto',
      objectFit: 'contain',
      filter: 'brightness(1.5) drop-shadow(0 0 8px rgba(75,94,255,0.35))',
      ...style,
    }}
  />
);

export default PBLogo;
