import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { C } from './constants';

const LINES = [
  { prompt: '$', cmd: 'git clone portfolio-be && cd portfolio-be', delay: 0 },
  { prompt: '$', cmd: 'mvn spring-boot:run', delay: 700 },
  { prompt: '>', out: 'Spring Boot 3 started on :8080', color: C.green, delay: 1600 },
  { prompt: '$', cmd: 'cd ../portfolio-fe && npm run dev', delay: 2500 },
  { prompt: '>', out: 'Admin dashboard running on :5174', color: C.purple, delay: 3400 },
  { prompt: '$', cmd: 'cd ../portfolio-main && npm run dev', delay: 4300 },
  { prompt: '>', out: 'Public portfolio live on :5173', color: C.teal, delay: 5200 },
  { prompt: '✓', out: 'All three apps online.', color: C.teal, delay: 6100 },
];

const TerminalLine = ({
  line,
  visible,
}: {
  line: (typeof LINES)[0];
  visible: boolean;
}) => {
  if (!visible) return null;
  const isOutput = 'out' in line;
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        gap: 8,
        fontSize: 12,
        fontFamily: 'monospace',
        lineHeight: 1.7,
        color: isOutput ? (line as { out: string; color?: string }).color ?? C.textSub : C.textSub,
      }}
    >
      <span style={{ color: isOutput ? (line as { out: string; color?: string }).color ?? C.teal : C.teal, flexShrink: 0 }}>
        {line.prompt}
      </span>
      <span style={{ color: isOutput ? 'inherit' : C.text }}>
        {'cmd' in line ? line.cmd : (line as { out: string }).out}
      </span>
    </motion.div>
  );
};

const AnimatedTerminal = () => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timers = LINES.map((line, i) =>
      setTimeout(() => setVisibleCount(i + 1), line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      borderRadius: 16,
      background: C.surface,
      border: `1px solid ${C.borderMid}`,
      overflow: 'hidden',
      boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px ${C.border}`,
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '12px 16px',
        borderBottom: `1px solid ${C.border}`,
        background: C.surfaceAlt,
      }}>
        {['#EF4444', '#F59E0B', '#22C55E'].map((c) => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
        ))}
        <span style={{ marginLeft: 8, fontSize: 11, fontFamily: 'monospace', color: C.muted }}>
          terminal — portfolios-builder
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 20px 24px', minHeight: 220, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {LINES.map((line, i) => (
          <TerminalLine key={i} line={line} visible={i < visibleCount} />
        ))}
        {visibleCount < LINES.length && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ fontSize: 14, color: C.teal, fontFamily: 'monospace', lineHeight: 1.7 }}
          >
            _
          </motion.span>
        )}
      </div>
    </div>
  );
};

export default AnimatedTerminal;
