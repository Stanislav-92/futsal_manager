import type { SxProps } from '@mui/material';

export const navButtonStyles: SxProps = {
  color: 'inherit',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: 2,
  px: 2.5,
  py: 0.75,
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: '#5c84c7',
  },
  '&.active': {
    backgroundColor: '#2f5fa8',
  },
};
