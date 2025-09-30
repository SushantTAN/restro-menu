import React from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';

const Cart: React.FC = () => {
  const { items, addToCart, decreaseQuantity, removeFromCart, clearCart } = useCart();

  const totalBill = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <div className="hidden md:flex justify-between font-bold mb-2">
              <span className="w-2/5">Item</span>
              <span className="w-1/5 text-center">Quantity</span>
              <span className="w-1/5 text-right">Price</span>
              <span className="w-1/5 text-right">Actions</span>
            </div>
            {items.map((item) => (
              <div key={item._id} className="flex flex-wrap justify-between items-center mb-4 md:mb-2">
                <span className="w-full md:w-2/5 mb-2 md:mb-0">{item.name}</span>
                <div className="w-1/2 md:w-1/5 flex items-center justify-start md:justify-center">
                  <Button variant="outline" size="sm" onClick={() => decreaseQuantity(item._id)}><FaMinus /></Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button variant="outline" size="sm" onClick={() => addToCart(item)}><FaPlus /></Button>
                </div>
                <span className="w-1/2 md:w-1/5 text-right md:text-right">${(item.price * item.quantity).toFixed(2)}</span>
                <div className="w-full md:w-1/5 text-right mt-2 md:mt-0">
                  <Button variant="destructive" size="sm" onClick={() => removeFromCart(item._id)}><FaTrash className='text-red-500' /></Button>
                </div>
              </div>
            ))}
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${totalBill.toFixed(2)}</span>
            </div>
            <Button variant="outline" size="sm" className="mt-4" onClick={clearCart}>Clear Cart</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Cart;
