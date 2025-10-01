import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';
import { MdOutlineAdminPanelSettings } from "react-icons/md";


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { items } = useCart();
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <header className="sticky inset-0 bg-primary text-primary-foreground p-4 flex justify-between items-center z-10">
        <Link to="/" className="inline text-2xl font-medium text-gray-800 pl-4 rounded-2xl bg-gray-50 overflow-hidden shadow-lg">Hamro<span className='text-pink-600 bg-pink-50 pr-4 rounded-tr-2xl rounded-br-2xl pl-1'>Menu</span></Link>

        <div className='flex'>
          <Link to="/admin/dashboard">
            <Button variant="outline" className="mr-2 px-4">
              <MdOutlineAdminPanelSettings className="mr-" />
            </Button>
          </Link>

          <Link to="/cart">
            <Button variant="outline" className="mr-2">
              <FaShoppingCart className="mr-2" />
              ({totalItems})
            </Button>
          </Link>
        </div>
        {/* <Link to="/manage-names">
          <Button variant="outline">
            Manage Names
          </Button>
        </Link> */}
      </header>
      <main className="">
        {children}
      </main>
    </div>
  );
};

export default Layout;
