import React from "react";
import { FiAlertTriangle, FiHelpCircle } from "react-icons/fi";
import { useColors } from "../../../utils/types";
import Button from "../../atoms/Button/Button";
import Modal from "../../atoms/Modal/Modal";

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

/** Generic confirm/destructive-action modal built on the shared `Modal` atom.
 * Reusable anywhere a "are you sure?" step is needed instead of firing an
 * action immediately on click — this is also the app's single delete
 * confirmation component (see DeleteConfirmation/DeleteConfirmPopup, now
 * retired in favor of this one). */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  danger = false,
  loading = false,
  onConfirm,
  onClose,
}) => {
  const colors = useColors();

  // Ignore backdrop/Escape/close-button dismissal while a request is in
  // flight, same as the previous implementation.
  const handleClose = () => {
    if (!loading) onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      size="sm"
      disableBackdropClose={loading}
      footer={
        <>
          <Button label={cancelLabel} variant="tertiaryContained" onClick={onClose} disabled={loading} />
          <Button
            label={confirmLabel}
            variant={danger ? "dangerContained" : "primaryContained"}
            onClick={onConfirm}
            isLoading={loading}
          />
        </>
      }
    >
      <div className="flex items-start gap-3">
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
        <div className="min-w-0 pt-1.5 text-sm leading-relaxed" style={{ color: colors.neutral600 }}>
          {message}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
