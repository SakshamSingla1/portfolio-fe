// src/components/organisms/DeleteConfirmPopup/DeleteConfirmPopup.tsx
import React from 'react';
import { createUseStyles } from 'react-jss';
import Button from '../../atoms/Button/Button';

interface DeleteConfirmPopupProps {
  title: string;
  onDelete: () => void;
  onCancel: () => void;
  isOpen: boolean;
  loading?: boolean;
}

const useStyles = createUseStyles({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '16px',
    color: '#1F2937',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px',
  },
});

const DeleteConfirmPopup: React.FC<DeleteConfirmPopupProps> = ({
  title,
  onDelete,
  onCancel,
  isOpen,
  loading = false,
}) => {
  const classes = useStyles();

  if (!isOpen) return null;

  return (
    <div className={classes.overlay}>
      <div className={classes.content}>
        <h3 className={classes.title}>{title}</h3>
        <p>This action cannot be undone.</p>
        <div className={classes.actions}>
          <Button
            label="Cancel"
            variant="tertiaryContained"
            onClick={onCancel}
            disabled={loading}
          />
          <Button
            label="Delete"
            variant="primaryContained"
            onClick={onDelete}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmPopup;