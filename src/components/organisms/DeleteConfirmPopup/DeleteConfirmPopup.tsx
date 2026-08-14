import React from 'react';
import { createUseStyles } from 'react-jss';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(20px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '16px',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  iconBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fef2f2',
    color: '#dc2626',
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
  },
  description: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '6px',
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={classes.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => !loading && onCancel()}
        >
          <motion.div
            className={classes.content}
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={classes.header}>
              <div className={classes.iconBadge}>
                <FiAlertTriangle size={19} />
              </div>
              <div>
                <h3 className={classes.title}>{title}</h3>
                <p className={classes.description}>This action cannot be undone.</p>
              </div>
            </div>
            <div className={classes.actions}>
              <Button
                label="Cancel"
                variant="tertiaryContained"
                onClick={onCancel}
                disabled={loading}
              />
              <Button
                label="Delete"
                variant="dangerContained"
                onClick={onDelete}
                loading={loading}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmPopup;