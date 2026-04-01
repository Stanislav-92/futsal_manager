import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppRoutes } from './app.routes';
import RootLayout from '@/layout/RootLayout';
import ErrorPage from '@/pages/error/ErrorPage';
import LoadingSpinner from '@/shared/components/LoadingSpinner';

const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const StatisticsPage = lazy(() => import('@/pages/statistics/StatisticsPage'));
const ContactsPage = lazy(() => import('@/pages/contacts/ContactsPage'));

export const router = createBrowserRouter([
  {
    path: AppRoutes.Dashboard,
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: AppRoutes.Statistics,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StatisticsPage />
          </Suspense>
        ),
      },
      {
        path: AppRoutes.Contacts,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ContactsPage />
          </Suspense>
        ),
      },
    ],
  },
]);
