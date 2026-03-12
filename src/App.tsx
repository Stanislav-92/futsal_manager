import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import RootLayout from '@/layout/RootLayout';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import StatisticsPage from '@/pages/statistics/StatisticsPage';
import ContactsPage from '@/pages/contacts/ContactsPage';
import ErrorPage from './pages/error/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'statistics', element: <StatisticsPage /> },
      { path: 'contacts', element: <ContactsPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
