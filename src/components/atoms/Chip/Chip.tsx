import React, { type ReactNode } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { createUseStyles } from "react-jss";
import { useColors } from "../../../utils/types";

interface ChipProps {
  label: string | ReactNode;
  onDelete: () => void;
  disabled?: boolean;
}

const useStyles = createUseStyles({
  chip: (colors: any) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: "999px", // pill shape
    fontSize: "12px",
    fontWeight: 500,
    backgroundColor: colors.neutral100,
    color: colors.neutral800,
    border: `1px solid ${colors.neutral200}`,
    transition: "all 0.2s ease-in-out",
    userSelect: "none",

    "&:hover": {
      backgroundColor: colors.neutral200,
      borderColor: colors.neutral300,
    },
  }),

  label: {
    display: "inline-flex",
    alignItems: "center",
    lineHeight: 1,
  },

  deleteBtn: (colors: any) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "transparent",
    padding: 0,
    marginLeft: 2,
    cursor: "pointer",
    color: colors.neutral500,
    borderRadius: "50%",
    transition: "all 0.2s ease",

    "&:hover": {
      color: colors.error500,
      transform: "scale(1.05)",
    },

    "&:active": {
      transform: "scale(0.95)",
    },

    "&:focus-visible": {
      outline: "none",
      boxShadow: `0 0 0 2px ${colors.primary200}`,
    },
  }),
});

const Chip: React.FC<ChipProps> = ({ label, onDelete, disabled }) => {
  const colors = useColors();
  const classes = useStyles(colors);

  return (
    <div className={classes.chip}>
      <span className={classes.label}>{label}</span>
      {!disabled && <button
        type="button"
        onClick={onDelete}
        className={classes.deleteBtn}
        aria-label={`Remove ${typeof label === "string" ? label : "item"}`}
      >
        <FaTimesCircle size={14} />
      </button>}
    </div>
  );
};

export default React.memo(Chip);
