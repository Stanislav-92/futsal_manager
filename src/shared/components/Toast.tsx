import { Alert, Snackbar } from '@mui/material';

interface ToastProps {
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export default function Toast({ message, severity, onClose }: ToastProps) {
  return (
    <Snackbar
      open
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
