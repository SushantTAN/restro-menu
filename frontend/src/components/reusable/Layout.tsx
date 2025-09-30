import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { items } = useCart();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <Link to="/" className="inline text-2xl font-medium text-gray-800 pl-4 rounded-2xl bg-gray-50 overflow-hidden shadow-lg pb-1">Hamro<span className='text-pink-600 bg-pink-50 pr-4 rounded-tr-2xl rounded-br-2xl pl-1 pb-1'>Menu</span></Link>
        <Link to="/cart">
          <Button variant="outline">
            <FaShoppingCart className="mr-2" />
            ({totalItems})
          </Button>
        </Link>
      </header>
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
