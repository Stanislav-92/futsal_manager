import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import type React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel: string;
  confirmColor?: 'error' | 'primary' | 'warning';
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  confirmColor = 'error',
  isPending,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>

      <DialogActions sx={{ gap: 1, px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color={confirmColor} variant="contained" loading={isPending}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
