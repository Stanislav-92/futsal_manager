import MainNavigation from '@/layout/MainNavigation';
import { Alert, Box, Typography } from '@mui/material';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();

  let title = 'Something went wrong';
  let message = 'An unexpected error occurred.';

  if (isRouteErrorResponse(error)) {
    if (error.status === 500) {
      title = 'Server error';
      message = 'Something failed on the server.';
    }

    if (error.status === 404) {
      title = 'Not found!';
      message = 'Could not find resource or page.';
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
