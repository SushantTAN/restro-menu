import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCart, type CartItem } from '@/context/CartContext';
import React, { useState } from 'react';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';

import { QRCodeSVG } from 'qrcode.react';

const Cart: React.FC = () => {
  const { items, addToCart, decreaseQuantity, removeFromCart, clearCart } = useCart();
  const [view, setView] = useState('all'); // 'all' or 'grouped'

  const totalBill = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const groupedItems = items.reduce((acc, item) => {
    const person = item.orderedFor || 'General';
    if (!acc[person]) {
      acc[person] = [];
    }
    acc[person].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const qrData = JSON.stringify(items);


  return (
    <>
      <Card className='mb-3'>
        <CardHeader>
          <div className="flex justify-end">
            <Button variant={view === 'all' ? 'default' : 'outline'} onClick={() => setView('all')}>All Items</Button>
            <Button variant={view === 'grouped' ? 'default' : 'outline'} className="ml-2" onClick={() => setView('grouped')}>Grouped by Person</Button>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {view === 'all' && (
                <div>
                  <div className="hidden md:flex justify-between font-medium mb-2">
                    <span className="w-2/5">Item</span>
                    <span className="w-1/5 text-center">Quantity</span>
                    <span className="w-1/5 text-right">Price</span>
                    <span className="w-1/5 text-right">Actions</span>
                  </div>
                  {items?.reduce((acc, item) => {
                    const presentDataIndex = acc.findIndex(el => el._id === item._id);
                    if (presentDataIndex > -1) {
                      acc[presentDataIndex] = { ...acc[presentDataIndex], quantity: acc[presentDataIndex]?.quantity + 1 }
                    } else {
                      acc.push(item)
                    }
                    return acc;
                  }, [] as CartItem[]).map((item) => (
                    <div key={item._id + (item.orderedFor || '')} className="flex flex-wrap justify-between items-center mb-4 md:mb-2">
                      <span className="w-full md:w-2/5 mb-2 md:mb-0">
                        {item.name}
                        {/* {item.orderedFor && <p className="text-sm text-gray-500">Ordered for: {item.orderedFor}</p>} */}
                      </span>
                      <div className="w-1/2 md:w-1/5 flex items-center justify-start md:justify-center">
                        <Button variant="outline" size="sm" onClick={() => decreaseQuantity(item._id, item.orderedFor)}><FaMinus /></Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => addToCart(item, item.orderedFor)}><FaPlus /></Button>
                      </div>
                      <span className="w-1/2 md:w-1/5 text-right md:text-right">Rs {(item.price * item.quantity).toFixed(2)}</span>
                      <div className="w-full md:w-1/5 text-right mt-2 md:mt-0">
                        <Button variant="destructive" size="sm" onClick={() => removeFromCart(item._id, item.orderedFor)}><FaTrash className='' /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {view === 'grouped' && (
                <div>
                  {Object.entries(groupedItems).map(([person, items]) => (
                    <div key={person} className="mb-6">
                      <h3 className="text-lg font-bold mb-2 underline underline-offset-8">{person}</h3>
                      <div className="hidden md:flex justify-between font-medium mb-2">
                        <span className="w-2/5">Item</span>
                        <span className="w-1/5 text-center">Quantity</span>
                        <span className="w-1/5 text-right">Price</span>
                        <span className="w-1/5 text-right">Actions</span>
                      </div>
                      {items.map((item) => (
                        <div key={item._id + (item.orderedFor || '')} className="flex flex-wrap justify-between items-center mb-4 md:mb-2">
                          <span className="w-full md:w-2/5 mb-2 md:mb-0">{item.name}</span>
                          <div className="w-1/2 md:w-1/5 flex items-center justify-start md:justify-center">
                            <Button variant="outline" size="sm" onClick={() => decreaseQuantity(item._id, item.orderedFor)}><FaMinus /></Button>
                            <span className="mx-2">{item.quantity}</span>
                            <Button variant="outline" size="sm" onClick={() => addToCart(item, item.orderedFor)}><FaPlus /></Button>
                          </div>
                          <span className="w-1/2 md:w-1/5 text-right md:text-right">Rs {(item.price * item.quantity).toFixed(2)}</span>
                          <div className="w-full md:w-1/5 text-right mt-2 md:mt-0">
                            <Button variant="destructive" size="sm" onClick={() => removeFromCart(item._id, item.orderedFor)}><FaTrash className='text-red-500' /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              <hr className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>Rs {totalBill.toFixed(2)}</span>
              </div>


              <Button variant="outline" size="sm" className="mt-4" onClick={clearCart}>Clear Cart</Button>


            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <div className='flex flex-col items-center py-3 gap-2'>
          <QRCodeSVG value={qrData} />
          <p>Sacn for order</p>
        </div>
      </Card>
    </>
  );
};

export default Cart;
