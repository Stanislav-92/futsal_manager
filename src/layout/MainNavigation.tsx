import { AppRoutes } from '@/router/app.routes';
import { AppBar, Button, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { NavLink } from 'react-router-dom';
import { navButtonStyles } from './MainNavigation.styles';
import { useState } from 'react';
import InfoDialog from './components/InfoDialog';

export default function MainNavigation() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

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
        <IconButton
          onClick={() => setIsInfoOpen(true)}
          sx={{ color: 'white', ml: 'auto', mr: '5%' }}
        >
          <InfoOutlinedIcon />
        </IconButton>
      </Toolbar>
      <InfoDialog open={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </AppBar>
  );
}
