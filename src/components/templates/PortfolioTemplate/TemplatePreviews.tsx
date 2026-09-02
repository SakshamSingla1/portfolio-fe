import React from "react";
import { useColors } from "../../../utils/types";

/**
 * Small CSS-only mockups standing in for real screenshots — portfolio-fe and
 * portfolio-main are separately deployed apps, so there's no live-render path
 * for a thumbnail here. Each mockup mirrors that template's actual shell
 * layout (see portfolio-main/src/components/portfolio-templates/) closely
 * enough to convey the real visual difference between the three.
 */

const MiniBar: React.FC<{ w: string; h?: number; color: string; radius?: number }> = ({ w, h = 6, color, radius = 3 }) => (
  <div style={{ width: w, height: h, borderRadius: radius, background: color }} />
);

export const ClassicTemplatePreview: React.FC = () => {
  const colors = useColors();
  return (
    <div className="w-full h-full flex flex-col" style={{ background: colors.neutral50, padding: 10, gap: 8 }}>
      <div className="flex items-center gap-2">
        <div className="rounded-full shrink-0" style={{ width: 22, height: 22, background: colors.primary400 }} />
        <div className="flex flex-col gap-1 flex-1">
          <MiniBar w="55%" h={5} color={colors.neutral400} />
          <MiniBar w="35%" h={4} color={colors.neutral300} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 mt-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded" style={{ height: 22, background: colors.neutral0, border: `1px solid ${colors.neutral200}` }} />
        ))}
      </div>
      <div className="flex flex-col gap-1.5 mt-1">
        <div className="rounded" style={{ height: 14, background: colors.neutral0, border: `1px solid ${colors.neutral200}` }} />
        <div className="rounded" style={{ height: 14, background: colors.neutral0, border: `1px solid ${colors.neutral200}` }} />
      </div>
    </div>
  );
};

export const ModernTemplatePreview: React.FC = () => {
  const colors = useColors();
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${colors.primary600}, ${colors.primary400})`, padding: 10, gap: 6 }}
    >
      <div className="rounded-full" style={{ width: 26, height: 26, background: "rgba(255,255,255,0.35)" }} />
      <MiniBar w="60%" h={6} color="rgba(255,255,255,0.9)" />
      <MiniBar w="40%" h={4} color="rgba(255,255,255,0.55)" />
      <div className="flex gap-1.5 mt-2 w-full justify-center">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-full" style={{ width: 28, height: 12, background: "rgba(255,255,255,0.25)" }} />
        ))}
      </div>
    </div>
  );
};

export const MinimalTemplatePreview: React.FC = () => {
  const colors = useColors();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: colors.neutral0, padding: 10, gap: 5 }}>
      <MiniBar w="45%" h={5} color={colors.neutral800} />
      <MiniBar w="28%" h={3} color={colors.neutral400} />
      <div className="flex flex-col gap-1 w-full items-center mt-3">
        <MiniBar w="70%" h={2} color={colors.neutral200} />
        <MiniBar w="70%" h={2} color={colors.neutral200} />
        <MiniBar w="70%" h={2} color={colors.neutral200} />
      </div>
    </div>
  );
};

export const BoldTemplatePreview: React.FC = () => {
  const colors = useColors();
  return (
    <div className="w-full h-full flex" style={{ background: colors.neutral900 }}>
      <div className="flex-1" style={{ background: `linear-gradient(160deg, ${colors.primary600}, ${colors.accent700})` }} />
      <div className="flex-1 flex flex-col justify-center" style={{ padding: 10, gap: 6 }}>
        <MiniBar w="85%" h={9} color={colors.neutral0} radius={2} />
        <MiniBar w="60%" h={9} color={colors.neutral0} radius={2} />
        <div className="mt-2" style={{ width: "50%", height: 8, borderRadius: 3, background: colors.accent400 }} />
      </div>
    </div>
  );
};

export const TerminalTemplatePreview: React.FC = () => {
  const colors = useColors();
  return (
    <div className="w-full h-full flex flex-col" style={{ background: "#0d1117", padding: 0 }}>
      <div className="flex items-center gap-1" style={{ padding: "5px 8px", background: "#161b22", borderBottom: `1px solid ${colors.neutral800}` }}>
        <div className="rounded-full" style={{ width: 5, height: 5, background: "#ff5f56" }} />
        <div className="rounded-full" style={{ width: 5, height: 5, background: "#ffbd2e" }} />
        <div className="rounded-full" style={{ width: 5, height: 5, background: "#27c93f" }} />
      </div>
      <div className="flex flex-col justify-center flex-1" style={{ padding: 10, gap: 4, fontFamily: "monospace" }}>
        <MiniBar w="50%" h={4} color={colors.success500} />
        <MiniBar w="65%" h={4} color={colors.neutral400} />
        <MiniBar w="40%" h={4} color={colors.neutral600} />
      </div>
    </div>
  );
};

export const ElegantTemplatePreview: React.FC = () => {
  const colors = useColors();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: colors.neutral900, padding: 14, gap: 8 }}>
      <MiniBar w="38%" h={4} color={colors.neutral200} />
      <div style={{ width: 24, height: 1, background: colors.accent400 }} />
      <MiniBar w="24%" h={3} color={colors.neutral500} />
    </div>
  );
};

export const CreativeTemplatePreview: React.FC = () => {
  const colors = useColors();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden" style={{ background: colors.neutral900, padding: 10, gap: 6 }}>
      <div className="absolute rounded-full" style={{ width: 34, height: 34, top: -10, left: -8, background: colors.accent400, opacity: 0.35, filter: "blur(4px)" }} />
      <div className="absolute rounded-full" style={{ width: 28, height: 28, bottom: -8, right: -6, background: colors.primary400, opacity: 0.35, filter: "blur(4px)" }} />
      <div className="rounded-full relative" style={{ width: 24, height: 24, background: `linear-gradient(135deg, ${colors.primary400}, ${colors.accent400})` }} />
      <MiniBar w="50%" h={5} color={colors.neutral0} radius={4} />
      <div style={{ width: "34%", height: 7, borderRadius: 999, background: colors.accent500 }} />
    </div>
  );
};
