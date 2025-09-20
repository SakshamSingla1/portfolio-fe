import { Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { type FC } from 'react';
import Button from '../../atoms/Button/Button';

interface DeleteConfirmationProps {
  open: boolean;
  title: string;
  description: string;
  onDelete: () => void;
  onCancel: () => void;
  deleteButtonText?: string;
  cancelButtonText?: string;
}

export const DeleteConfirmation: FC<DeleteConfirmationProps> = ({
  open,
  title,
  description,
  onDelete,
  onCancel,
  deleteButtonText = 'Delete',
  cancelButtonText = 'Cancel',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      className="[&_.MuiDialog-paper]:rounded-2xl [&_.MuiDialog-paper]:p-6 [&_.MuiDialog-paper]:max-w-[400px] [&_.MuiDialog-paper]:w-full"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle className="text-center text-neutral-900 font-semibold mb-4 p-0">
        {title}
      </DialogTitle>
      <DialogContent className="text-center p-0 mb-6">
        <Typography className="text-neutral-500">
          {description}
        </Typography>
      </DialogContent>
      <DialogActions className="flex justify-between p-0 mt-6">
        <Button
          variant="secondaryText"
          onClick={onCancel}
          className="w-[48%] border border-neutral-300 hover:bg-neutral-100"
        >
          {cancelButtonText}
        </Button>
        <Button
          variant="primaryContained"
          onClick={onDelete}
          className="w-[48%] bg-error-500 hover:bg-error-600"
          autoFocus
        >
          {deleteButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmation;
