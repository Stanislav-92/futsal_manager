import type { SxProps, Theme } from '@mui/material';

export const gridSize = { xs: 12, sm: 6 };

export const chartContainerSx: SxProps<Theme> = {
  p: 3,
  border: (theme) => `1px solid ${theme.palette.divider}`,
  borderRadius: (theme) => `${theme.shape.borderRadius}px`,
};
