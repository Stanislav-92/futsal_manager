import type { SxProps, Theme } from '@mui/material';

export const tableContainerSx: SxProps<Theme> = {
  border: (theme) => `1px solid ${theme.palette.divider}`,
  borderRadius: (theme) => theme.shape.borderRadius,
  overflow: 'hidden',
  '&.MuiPaper-root': {
    borderRadius: (theme) => `${theme.shape.borderRadius}px`,
  },
};

export const tableHeaderSx: SxProps<Theme> = {
  px: 3,
  py: 2,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
  backgroundColor: (theme) => theme.palette.background.paper,
};

export const tableHeadRowSx: SxProps = {
  backgroundColor: '#f8fafc',
};

export const tableHeadCellSx: SxProps = {
  fontWeight: 600,
};

export const tableBodyRowSx: SxProps = {
  '&:last-child td, &:last-child th': {
    borderBottom: 0,
  },
};
