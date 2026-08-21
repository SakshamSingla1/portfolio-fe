import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiLoader, FiChevronRight, FiStar } from "react-icons/fi";
import GlassCard from "../../atoms/GlassCard/GlassCard";
import Button from "../../atoms/Button/Button";
import { useColors, HTTP_STATUS } from "../../../utils/types";
import { useTheme } from "../../../contexts/ThemeContext";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useProfileTemplateService } from "../../../services/useProfileTemplateService";
import { useSnackbar } from "../../../hooks/useSnackBar";
import type { PortfolioTemplateOption } from "../../../utils/portfolioTemplates";
import { ClassicTemplatePreview, ModernTemplatePreview, MinimalTemplatePreview } from "./TemplatePreviews";

const PREVIEWS: Record<PortfolioTemplateOption["key"], React.FC> = {
  CLASSIC: ClassicTemplatePreview,
  MODERN: ModernTemplatePreview,
  MINIMAL: MinimalTemplatePreview,
};

interface TemplateCardProps {
  template: PortfolioTemplateOption;
  isActive: boolean;
  onApplied: (key: PortfolioTemplateOption["key"]) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, isActive, onApplied }) => {
  const colors = useColors();
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const { assignTemplateToUser } = useProfileTemplateService();
  const { showSnackbar } = useSnackbar();
  const [applying, setApplying] = useState(false);

  const Preview = PREVIEWS[template.key];

  const handleApply = async () => {
    if (isActive || applying) return;
    setApplying(true);
    try {
      const res = await assignTemplateToUser({ templateKey: template.key });
      if (res?.status === HTTP_STATUS.OK) {
        showSnackbar("success", `${template.name} template applied`);
        onApplied(template.key);
      } else {
        showSnackbar("error", "Failed to apply template");
      }
    } catch {
      showSnackbar("error", "Failed to apply template");
    } finally {
      setApplying(false);
    }
  };

  return (
    <motion.div
      className="relative h-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35 }}
    >
      <GlassCard
        hover
        className={`h-full flex flex-col ${isActive ? "ring-[3px] ring-primary-500/30" : ""}`}
        style={{
          border: `1px solid ${isActive ? colors.primary500 : isDark ? `${colors.neutral200}20` : colors.neutral200}`,
          padding: isMobile ? 14 : 18,
        }}
      >
        <div
          className="rounded-2xl overflow-hidden mb-4"
          style={{ height: 140, border: `1px solid ${colors.neutral200}` }}
        >
          <Preview />
        </div>

        <div className="flex items-center justify-between gap-2 mb-1.5">
          <h3 className="text-base font-black m-0 tracking-tight" style={{ color: colors.neutral900 }}>
            {template.name}
          </h3>
          {isActive && (
            <div className="flex items-center gap-1 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#22c55e" }} />
              <span className="text-[9px] font-black text-green-600 tracking-widest uppercase">Active</span>
            </div>
          )}
        </div>
        <p className="text-xs mb-4 flex-1" style={{ color: colors.neutral500 }}>
          {template.description}
        </p>

        <Button
          variant={isActive ? "primaryContained" : "tertiaryContained"}
          size="small"
          disabled={applying}
          onClick={handleApply}
          className="w-full"
          label={
            applying ? (
              <span className="flex items-center justify-center gap-1.5"><FiLoader className="animate-spin" size={13} /> Applying…</span>
            ) : isActive ? (
              <span className="flex items-center justify-center gap-1.5"><FiCheck size={13} /> Applied</span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">Use this template <FiChevronRight size={13} /></span>
            )
          }
        />
      </GlassCard>

      {isActive && (
        <div
          className="absolute -top-2.5 -right-2.5 flex items-center justify-center rounded-full shrink-0"
          style={{ width: 26, height: 26, background: colors.primary500, color: "#fff", boxShadow: `0 4px 12px ${colors.primary500}50` }}
        >
          <FiStar size={12} />
        </div>
      )}
    </motion.div>
  );
};

export default TemplateCard;
