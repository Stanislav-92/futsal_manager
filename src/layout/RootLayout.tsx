import { Box } from '@mui/material';
import MainNavigation from './MainNavigation';
import { Outlet, useNavigation } from 'react-router-dom';

export default function RootLayout() {
  const navigation = useNavigation();

  const isLoading = navigation.state === 'loading';

  return (
    <>
      <MainNavigation />
      <Box sx={{ minHeight: '100vh', px: 3, py: 3 }}>
        {isLoading ? <p>Loading...</p> : <Outlet />}
      </Box>
    </>
  );
}
