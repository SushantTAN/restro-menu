import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/reusable/Layout';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes';

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";


// eslint-disable-next-line react-refresh/only-export-components
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60, // cache garbage collection (1h)
      staleTime: 1000 * 60 * 5, // data considered fresh for 5min
    },
  },
});

// 2. Create a persister that uses localStorage
const localStoragePersister = createAsyncStoragePersister({
  storage: {
    getItem: async (key: string) => {
      return localStorage.getItem(key) ?? null;
    },
    setItem: async (key: string, value: string) => {
      localStorage.setItem(key, value);
    },
    removeItem: async (key: string) => {
      localStorage.removeItem(key);
    },
  },
});

// 3. Hook up persistence
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24, // 24h
});

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