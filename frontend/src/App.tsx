import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/reusable/Layout';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;