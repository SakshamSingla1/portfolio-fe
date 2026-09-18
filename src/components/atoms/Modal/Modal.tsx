import React, { type ReactNode } from "react";
import Dialog from "@mui/material/Dialog";
import { FiX } from "react-icons/fi";
import { useColors } from "../../../utils/types";

export type ModalSize = "sm" | "md" | "lg";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children: ReactNode;
  footer?: ReactNode;
  /** When true, clicking the backdrop does nothing — only the close button,
   * Escape key, or an explicit action inside the modal can close it. Useful
   * for in-progress actions (e.g. a delete request in flight) where an
   * accidental outside click shouldn't dismiss the dialog. */
  disableBackdropClose?: boolean;
}

/**
 * Shared modal primitive used across the app for anything that needs an
 * overlay dialog — confirmations, detail views, forms, etc. Wraps MUI's
 * Dialog so we keep its built-in accessibility for free (focus trap,
 * Escape-to-close, aria attributes, portal rendering) while giving every
 * caller one consistent visual treatment instead of each hand-rolling its
 * own overlay/backdrop/shadow styling.
 *
 * zIndex is deliberately fixed at 2000 — this matches the app-wide modal
 * convention (see SnackbarContext, which sets the global snackbar to
 * z-[9999] specifically so it stays above modals at this layer).
 */
const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  size = "sm",
  children,
  footer,
  disableBackdropClose = false,
}) => {
  const colors = useColors();

  const handleClose = (_event: object, reason: "backdropClick" | "escapeKeyDown") => {
    if (disableBackdropClose && reason === "backdropClick") return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={size}
      fullWidth
      sx={{ zIndex: 2000 }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(15, 23, 42, 0.6)",
          },
        },
        paper: {
          sx: {
            borderRadius: "20px",
            backgroundColor: colors.neutral0,
            boxShadow: `0 25px 60px -12px ${colors.neutral900}40, 0 0 0 1px ${colors.neutral900}0d`,
            overflow: "hidden",
            margin: "16px",
          },
        },
      }}
    >
      {title && (
        <div
          className="flex items-center justify-between gap-4 px-6 py-5 border-b"
          style={{ borderColor: colors.neutral200 }}
        >
          <h3 className="text-base font-bold" style={{ color: colors.neutral900 }}>
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 p-1.5 rounded-lg transition-colors duration-150"
            style={{ color: colors.neutral600, backgroundColor: colors.neutral100 }}
          >
            <FiX size={18} />
          </button>
        </div>
      )}

      <div className="px-6 py-5">{children}</div>

      {footer && (
        <div
          className="flex justify-end gap-3 px-6 py-4 border-t"
          style={{ borderColor: colors.neutral200 }}
        >
          {footer}
        </div>
      )}
    </Dialog>
  );
};

export default Modal;
