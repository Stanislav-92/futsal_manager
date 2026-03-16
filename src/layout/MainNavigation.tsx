import { AppBar, Button, Stack, Toolbar, Typography, type SxProps } from '@mui/material';
import { NavLink } from 'react-router-dom';

const navButtonsStyles: SxProps = {
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

export default function MainNavigation() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div">
          Futsal Manager
        </Typography>
        <Stack direction="row" spacing={4} sx={{ ml: 20 }}>
          <Button component={NavLink} to="/" end sx={navButtonsStyles}>
            Dashboard
          </Button>
          <Button component={NavLink} to="/statistics" sx={navButtonsStyles}>
            Statistics
          </Button>
          <Button component={NavLink} to="/contacts" sx={navButtonsStyles}>
            Contacts
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
