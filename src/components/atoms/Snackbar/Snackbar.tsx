import { Alert, Snackbar as MuiSnackbar, AlertColor } from '@mui/material';

interface SnackbarProps {
    open: boolean;
    message: string;
    severity: AlertColor;
    onClose: () => void;
    autoHideDuration?: number;
}

export const Snackbar: React.FC<SnackbarProps> = ({
    open,
    message,
    severity = 'info',
    onClose,
    autoHideDuration = 3000,
}) => {
    return (
        <MuiSnackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </MuiSnackbar>
    );
};