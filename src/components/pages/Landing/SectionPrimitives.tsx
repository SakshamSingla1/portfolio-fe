import React from 'react';
import { C } from './constants';

export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    display: 'inline-block',
    fontFamily: 'monospace',
    fontSize: 10.5,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: C.teal,
    background: C.tealDim,
    border: `1px solid ${C.tealBorder}`,
    padding: '4px 12px',
    borderRadius: 99,
    marginBottom: 14,
  }}>
    {children}
  </div>
);

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{
    fontWeight: 800,
    fontSize: 'clamp(26px, 3.5vw, 40px)',
    letterSpacing: '-0.03em',
    lineHeight: 1.15,
    color: C.text,
    margin: '0 0 14px',
  }}>
    {children}
  </h2>
);
