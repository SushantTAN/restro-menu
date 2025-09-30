import React from 'react';
import Cart from '@/components/reusable/Cart';

const CartPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <Cart />
    </div>
  );
};

export default CartPage;
