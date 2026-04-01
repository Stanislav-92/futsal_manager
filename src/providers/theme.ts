import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#5c84c7',
      dark: '#2f5fa8',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
    divider: '#e2e4e8',
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
});
