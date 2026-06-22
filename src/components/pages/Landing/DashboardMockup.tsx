import { C } from './constants';

const DashboardMockup = () => {
  const rows = [
    { label: 'Projects', count: 12, color: C.teal },
    { label: 'Skills', count: 24, color: C.purple },
    { label: 'Experience', count: 5, color: C.blue },
    { label: 'Certifications', count: 8, color: C.amber },
  ];

  return (
    <div style={{
      borderRadius: 14,
      background: C.surface,
      border: `1px solid ${C.borderMid}`,
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
    }}>
      {/* Header bar */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: C.surfaceAlt,
      }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Dashboard</span>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 10, fontFamily: 'monospace',
          color: C.green, background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.2)',
          padding: '2px 8px', borderRadius: 99,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.green, display: 'inline-block' }} />
          online
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: C.border }}>
        {rows.map(({ label, count, color }) => (
          <div key={label} style={{ background: C.surface, padding: '16px 18px' }}>
            <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: 26, color, letterSpacing: '-0.04em' }}>{count}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 16px', borderTop: `1px solid ${C.border}`, background: C.surfaceAlt }}>
        <span style={{ fontSize: 10.5, fontFamily: 'monospace', color: C.muted }}>Last sync: just now</span>
      </div>
    </div>
  );
};

export default DashboardMockup;
