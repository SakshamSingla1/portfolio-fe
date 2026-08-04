import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiHelpCircle } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import Button from "../../atoms/Button/Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/** Generic confirm/destructive-action modal, styled to match the app's existing
 * modal language (see MessageDetailModal). Reusable anywhere a "are you sure?"
 * step is needed instead of firing an action immediately on click. */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  loading = false,
  onConfirm,
  onClose,
}) => {
  const colors = useColors();

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, loading, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 flex items-center justify-center z-[1000] bg-black/60 backdrop-blur-md px-4"
          onClick={() => !loading && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-md rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] overflow-hidden"
            style={{ backgroundColor: colors.neutral0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-6 pb-2 flex items-start gap-3">
              <div
                className="shrink-0 flex items-center justify-center rounded-xl"
                style={{
                  width: 40,
                  height: 40,
                  background: danger ? colors.error50 : `${colors.primary500}12`,
                  color: danger ? colors.error600 : colors.primary600,
                }}
              >
                {danger ? <FiAlertTriangle size={19} /> : <FiHelpCircle size={19} />}
              </div>
              <div className="min-w-0 pt-1">
                <h3 className="text-base font-bold" style={{ color: colors.neutral900 }}>
                  {title}
                </h3>
                <div className="text-sm mt-1.5 leading-relaxed" style={{ color: colors.neutral600 }}>
                  {message}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-5 mt-2">
              <Button label={cancelLabel} variant="tertiaryContained" onClick={onClose} disabled={loading} />
              <Button
                label={loading ? "Please wait…" : confirmLabel}
                variant={danger ? "primaryContained" : "primaryContained"}
                onClick={onConfirm}
                disabled={loading}
                style={danger ? { backgroundColor: colors.error600 } : undefined}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
