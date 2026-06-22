import React from "react";
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import { useColors } from "../../../utils/types";

interface ActionButtonsProps {
  onEdit?: () => void;
  onView?: () => void;
  onDelete?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onView, onDelete }) => {
  const colors = useColors();

  const btnBase: React.CSSProperties = {
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    border: `1.5px solid ${colors.neutral300}`,
    background: "transparent",
    cursor: "pointer",
    transition: "all 0.18s ease",
    flexShrink: 0,
  };

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {onEdit && (
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          title="Edit"
          style={{ ...btnBase, color: colors.primary600 }}
          onMouseEnter={(e) => {
            const b = e.currentTarget;
            b.style.background = `${colors.primary500}12`;
            b.style.borderColor = colors.primary300;
            b.style.transform = "translateY(-1px)";
            b.style.boxShadow = `0 4px 8px ${colors.primary500}20`;
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget;
            b.style.background = "transparent";
            b.style.borderColor = colors.neutral200;
            b.style.transform = "translateY(0)";
            b.style.boxShadow = "none";
          }}
        >
          <FiEdit2 size={13} />
        </button>
      )}
      {onView && (
        <button
          onClick={(e) => { e.stopPropagation(); onView(); }}
          title="View details"
          style={{ ...btnBase, color: colors.neutral500 }}
          onMouseEnter={(e) => {
            const b = e.currentTarget;
            b.style.background = `${colors.neutral500}10`;
            b.style.borderColor = colors.neutral300;
            b.style.transform = "translateY(-1px)";
            b.style.boxShadow = `0 4px 8px ${colors.neutral900}08`;
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget;
            b.style.background = "transparent";
            b.style.borderColor = colors.neutral200;
            b.style.transform = "translateY(0)";
            b.style.boxShadow = "none";
          }}
        >
          <FiEye size={13} />
        </button>
      )}
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Delete"
          style={{ ...btnBase, color: colors.error500 }}
          onMouseEnter={(e) => {
            const b = e.currentTarget;
            b.style.background = colors.error50;
            b.style.borderColor = colors.error300;
            b.style.transform = "translateY(-1px)";
            b.style.boxShadow = `0 4px 8px ${colors.error500}20`;
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget;
            b.style.background = "transparent";
            b.style.borderColor = colors.neutral200;
            b.style.transform = "translateY(0)";
            b.style.boxShadow = "none";
          }}
        >
          <FiTrash2 size={13} />
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
