import MainNavigation from '@/layout/MainNavigation';
import { Alert, Box, Typography } from '@mui/material';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ErrorPage() {
  const { t } = useTranslation();
  const error = useRouteError();

  let title = t('errors.somethingWrong');
  let message = t('errors.unexpected');

  if (isRouteErrorResponse(error)) {
    if (error.status === 500) {
      title = t('errors.serverError');
      message = t('errors.serverFailed');
    }

    if (error.status === 404) {
      title = t('errors.notFound');
      message = t('errors.notFoundResource');
    }
  }

  return (
    <>
      <MainNavigation />
      <Box sx={{ px: 3, py: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {title}
        </Typography>

        <Alert severity="error" sx={{ maxWidth: '300px' }}>
          {message}
        </Alert>
      </Box>
    </>
  );
}
