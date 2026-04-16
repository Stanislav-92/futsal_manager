import { useForm } from 'react-hook-form';
import type { PlayerContact } from '../types/player.types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { validateEmail, validatePhone, validateRequired } from '@/shared/utils/validation.utils';

type PlayerFormData = Omit<PlayerContact, 'id' | 'matches'>;

interface PlayerFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PlayerFormData) => void;
  isPending: boolean;
  defaultValues?: PlayerFormData;
  title: string;
  submitLabel: string;
}

export default function PlayerFormDialog({
  open,
  onClose,
  onSubmit,
  isPending,
  defaultValues,
  title,
  submitLabel,
}: PlayerFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PlayerFormData>({
    defaultValues,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Name"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name', {
              validate: (value) => validateRequired(value, 'Name'),
            })}
          />
          <TextField
            label="Last name"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            {...register('lastName', {
              validate: (value) => validateRequired(value, 'Last name'),
            })}
          />
          <TextField
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email', {
              validate: validateEmail,
            })}
          />
          <TextField
            label="Phone"
            error={!!errors.phone}
            helperText={errors.phone?.message}
            {...register('phone', {
              validate: validatePhone,
            })}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ gap: 1, px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" loading={isPending}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
