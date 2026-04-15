import type { SxProps } from '@mui/material';

export const scoreInputSx: SxProps = {
  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button':
    { display: 'none' },
};

export const scoreInputSlotProps = {
  htmlInput: {
    min: 0,
    style: { textAlign: 'center', width: 50, MozAppearance: 'textfield' },
  },
};
