import React from "react";
import { RESOURCE_STATUS } from "../../../utils/constant";
import { useColors } from "../../../utils/types";
import { FiCheckCircle, FiPauseCircle, FiSlash, FiTrash2 } from "react-icons/fi";

const PulseDot: React.FC<{ color: string }> = ({ color }) => (
  <span style={{ position: "relative", display: "inline-flex", width: 7, height: 7, flexShrink: 0 }}>
    <span style={{
      position: "absolute", inset: 0, borderRadius: "50%", background: color,
      animation: "rsPulse 2s ease-in-out infinite", opacity: 0.5,
    }} />
    <span style={{ position: "relative", display: "inline-flex", width: 7, height: 7, borderRadius: "50%", background: color }} />
    <style>{`@keyframes rsPulse { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(2.4);opacity:0} }`}</style>
  </span>
);

const STATUS_ICONS: Record<string, React.ElementType> = {
  [RESOURCE_STATUS.ACTIVE]: FiCheckCircle,
  [RESOURCE_STATUS.INACTIVE]: FiPauseCircle,
  [RESOURCE_STATUS.BLOCKED]: FiSlash,
  [RESOURCE_STATUS.DELETED]: FiTrash2,
};

const STATUS_LABELS: Record<string, string> = {
  [RESOURCE_STATUS.ACTIVE]: "Active",
  [RESOURCE_STATUS.INACTIVE]: "Inactive",
  [RESOURCE_STATUS.BLOCKED]: "Blocked",
  [RESOURCE_STATUS.DELETED]: "Deleted",
};

interface ResourceStatusProps {
  status: string;
  colourMap?: { [key: string]: string };
}

const ResourceStatus: React.FC<ResourceStatusProps> = ({ status, colourMap }) => {
  const colors = useColors();

  const STATUS_COLOR: Record<string, string> = {
    [RESOURCE_STATUS.ACTIVE]: colors.success600,
    [RESOURCE_STATUS.INACTIVE]: colors.warning600,
    [RESOURCE_STATUS.BLOCKED]: colors.error600,
    [RESOURCE_STATUS.DELETED]: colors.error500,
  };

  const STATUS_BG: Record<string, string> = {
    [RESOURCE_STATUS.ACTIVE]: `${colors.success500}15`,
    [RESOURCE_STATUS.INACTIVE]: `${colors.warning500}15`,
    [RESOURCE_STATUS.BLOCKED]: `${colors.error500}13`,
    [RESOURCE_STATUS.DELETED]: `${colors.error500}10`,
  };

  const STATUS_BORDER: Record<string, string> = {
    [RESOURCE_STATUS.ACTIVE]: `${colors.success500}35`,
    [RESOURCE_STATUS.INACTIVE]: `${colors.warning500}35`,
    [RESOURCE_STATUS.BLOCKED]: `${colors.error500}32`,
    [RESOURCE_STATUS.DELETED]: `${colors.error500}28`,
  };

  const color = colourMap ? colourMap[status] : (STATUS_COLOR[status] ?? colors.neutral500);
  const bg = colourMap ? `${colourMap[status]}14` : (STATUS_BG[status] ?? `${colors.neutral500}12`);
  const border = colourMap ? `${colourMap[status]}30` : (STATUS_BORDER[status] ?? `${colors.neutral500}25`);
  const isActive = status === RESOURCE_STATUS.ACTIVE;
  const Icon = STATUS_ICONS[status];
  const label = STATUS_LABELS[status]
    ?? (status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "—");

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      color,
      backgroundColor: bg,
      borderRadius: 99,
      padding: "3px 10px 3px 6px",
      fontSize: "11px",
      fontWeight: 650,
      letterSpacing: "0.025em",
      border: `1px solid ${border}`,
      whiteSpace: "nowrap",
      lineHeight: 1.6,
    }}>
      {isActive ? <PulseDot color={color} /> : Icon ? <Icon size={10} style={{ flexShrink: 0 }} /> : null}
      {label}
    </span>
  );
};

export default ResourceStatus;
