import { AppRoutes } from '@/router/app.routes';
import { AppBar, Button, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { NavLink } from 'react-router-dom';
import { navButtonStyles } from './MainNavigation.styles';
import { useState } from 'react';
import InfoDialog from './components/InfoDialog';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function MainNavigation() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div">
          {t('app.title')}
        </Typography>
        <Stack direction="row" spacing={4} sx={{ ml: 20 }}>
          <Button component={NavLink} to={AppRoutes.Dashboard} end sx={navButtonStyles}>
            {t('nav.dashboard')}
          </Button>
          <Button component={NavLink} to={AppRoutes.Statistics} sx={navButtonStyles}>
            {t('nav.statistics')}
          </Button>
          <Button component={NavLink} to={AppRoutes.Contacts} sx={navButtonStyles}>
            {t('nav.contacts')}
          </Button>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={4} sx={{ ml: 'auto', mr: '5%' }}>
          <IconButton onClick={() => setIsInfoOpen(true)} sx={{ color: 'white' }}>
            <InfoOutlinedIcon />
          </IconButton>
          <LanguageSwitcher />
        </Stack>
      </Toolbar>
      <InfoDialog open={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </AppBar>
  );
}
