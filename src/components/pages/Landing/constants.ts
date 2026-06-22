export const C = {
  bg: '#060608',
  surface: '#0C0D10',
  surfaceAlt: '#101318',
  border: 'rgba(255,255,255,0.055)',
  borderMid: 'rgba(255,255,255,0.09)',
  teal: '#14B8A0',
  tealLight: '#2DD4BF',
  tealDim: 'rgba(20, 184, 160, 0.08)',
  tealBorder: 'rgba(20, 184, 160, 0.22)',
  tealGlow: 'rgba(20, 184, 160, 0.4)',
  purple: '#8B5CF6',
  purpleLight: '#A78BFA',
  blue: '#3B82F6',
  amber: '#F59E0B',
  red: '#EF4444',
  green: '#22C55E',
  text: '#EEEEF0',
  textSub: '#9CA3AF',
  muted: '#4B5563',
};

export const CUBIC: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUp = (delay = 0, dur = 0.55) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: dur, ease: CUBIC, delay },
});
