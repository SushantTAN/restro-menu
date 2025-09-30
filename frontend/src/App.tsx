import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/reusable/Layout';
import HomePage from './pages/user/HomePage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminRestaurantsPage from './pages/admin/AdminRestaurantsPage';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import LoginPage from './pages/user/LoginPage';
import RestaurantDetailPage from './pages/user/RestaurantDetailPage';
import CartPage from './pages/user/CartPage';
import { CartProvider } from './context/CartContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/restaurants" element={<AdminRestaurantsPage />} />
              <Route path="/admin/restaurants/:restaurantId/menu" element={<AdminMenuPage />} />
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;