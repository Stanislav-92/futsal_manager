import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { validateMatchDate } from '@/shared/utils/date.utils';

export interface CreateMatchFormData {
  date: dayjs.Dayjs | null;
}

interface CreateMatchDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMatchFormData) => void;
  isPending: boolean;
}

export default function CreateMatchDialog({
  open,
  onClose,
  onSubmit,
  isPending,
}: CreateMatchDialogProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateMatchFormData>();

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Create match</DialogTitle>

        <DialogContent>
          <Controller
            name="date"
            control={control}
            defaultValue={null}
            rules={{
              required: 'Date is required',
              validate: validateMatchDate,
            }}
            render={({ field }) => (
              <DatePicker
                label="Select date"
                format="DD/MM/YYYY"
                minDate={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { mt: 1 },
                    error: !!errors.date,
                    helperText: errors.date?.message,
                  },
                }}
                {...field}
              />
            )}
          />
        </DialogContent>

        <DialogActions sx={{ gap: 1, px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="contained" loading={isPending} onClick={handleSubmit(onSubmit)}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
