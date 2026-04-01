import { AppRoutes } from '@/router/app.routes';
import { AppBar, Button, Stack, Toolbar, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { navButtonStyles } from './MainNavigation.styles';

export default function MainNavigation() {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div">
          Futsal Manager
        </Typography>
        <Stack direction="row" spacing={4} sx={{ ml: 20 }}>
          <Button component={NavLink} to={AppRoutes.Dashboard} end sx={navButtonStyles}>
            Dashboard
          </Button>
          <Button component={NavLink} to={AppRoutes.Statistics} sx={navButtonStyles}>
            Statistics
          </Button>
          <Button component={NavLink} to={AppRoutes.Contacts} sx={navButtonStyles}>
            Contacts
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
