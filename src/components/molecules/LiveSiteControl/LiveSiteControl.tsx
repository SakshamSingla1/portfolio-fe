import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiExternalLink, FiLink, FiCheck, FiPlus } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import { useSnackbar } from "../../../hooks/useSnackBar";

interface LiveSiteControlProps {
  portfolioUrl?: string | null;
  isMobile: boolean;
}

/** "View live site" quick link with copy-to-clipboard, or a nudge to add one when
 * the profile has no WEBSITE/PORTFOLIO social link set yet. Shared between the
 * Dashboard header and the Profile page header so both surface the same control. */
const LiveSiteControl: React.FC<LiveSiteControlProps> = ({ portfolioUrl, isMobile }) => {
  const colors = useColors();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [copied, setCopied] = useState(false);

  if (!portfolioUrl) {
    return (
      <button
        onClick={() => navigate("/social-links")}
        className="flex items-center gap-1.5 rounded-full transition-opacity duration-150 hover:opacity-80 shrink-0"
        style={{
          padding: "6px 12px 6px 10px",
          background: `${colors.primary600}0e`,
          border: `1px dashed ${colors.primary600}40`,
          cursor: "pointer",
        }}
      >
        <FiPlus size={11} color={colors.primary600} />
        <span className="text-[11px] font-semibold" style={{ color: colors.primary600 }}>
          {isMobile ? "Add site link" : "Add your portfolio link"}
        </span>
      </button>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      showSnackbar("success", "Link copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      showSnackbar("error", "Failed to copy link");
    }
  };

  const displayHost = portfolioUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <a
        href={portfolioUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-full transition-opacity duration-150 hover:opacity-80"
        style={{
          padding: "6px 12px 6px 10px",
          background: `${colors.primary600}14`,
          border: `1px solid ${colors.primary600}28`,
        }}
      >
        <FiExternalLink size={11} color={colors.primary600} />
        <span className="text-[11px] font-semibold truncate max-w-[140px]" style={{ color: colors.primary600 }}>
          {isMobile ? "Live site" : displayHost}
        </span>
      </a>
      <button
        onClick={handleCopy}
        aria-label="Copy portfolio link"
        className="flex items-center justify-center rounded-full transition-opacity duration-150 hover:opacity-80"
        style={{
          width: 26,
          height: 26,
          background: colors.neutral100,
          border: `1px solid ${colors.neutral300}`,
          cursor: "pointer",
        }}
      >
        {copied ? <FiCheck size={11} color={colors.success600} /> : <FiLink size={11} color={colors.neutral500} />}
      </button>
    </div>
  );
};

export default LiveSiteControl;
