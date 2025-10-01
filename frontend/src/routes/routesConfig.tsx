import UserLayout from '@/components/reusable/UserLayout';
import AdminLayout from '../components/reusable/AdminLayout';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminMenuPage from '../pages/admin/AdminMenuPage';
import AdminRestaurantsPage from '../pages/admin/AdminRestaurantsPage';
import CartPage from '../pages/user/CartPage';
import HomePage from '../pages/user/HomePage';
import LoginPage from '../pages/user/LoginPage';
import ManageOrderedForNamesPage from '../pages/user/ManageOrderedForNamesPage';
import RestaurantDetailPage from '../pages/user/RestaurantDetailPage';

export const routesConfig = [
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/restaurants/:id',
        element: <RestaurantDetailPage />,
      },
      {
        path: '/cart',
        element: <CartPage />,
      },
      {
        path: '/manage-names',
        element: <ManageOrderedForNamesPage />,
      },
      {
        path: '/admin/login',
        element: <AdminLoginPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboardPage />,
      },
      {
        path: 'restaurants',
        element: <AdminRestaurantsPage />,
      },
      {
        path: 'restaurants/:restaurantId/menu',
        element: <AdminMenuPage />,
      },
    ],
  },
];
