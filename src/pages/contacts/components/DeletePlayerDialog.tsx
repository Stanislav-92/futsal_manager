import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface DeletePlayerDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  playerName: string;
}

export default function DeletePlayerDialog({
  open,
  onClose,
  onConfirm,
  isPending,
  playerName,
}: DeletePlayerDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete player</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete <strong>{playerName}</strong>? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ gap: 1, px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" loading={isPending}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
