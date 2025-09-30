import React, { createContext, useContext, useState, useEffect } from 'react';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
  orderedFor?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem, orderedFor?: string) => void;
  removeFromCart: (itemId: string, orderedFor?: string) => void;
  decreaseQuantity: (itemId: string, orderedFor?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
    setIsInitialRender(false);
  }, []);

  useEffect(() => {
    if (!isInitialRender) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isInitialRender]);

  const addToCart = (item: MenuItem, orderedFor?: string) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i._id === item._id && i.orderedFor === orderedFor);
      if (existingItem) {
        return prevItems.map((i) =>
          i._id === item._id && i.orderedFor === orderedFor ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1, orderedFor }];
      }
    });
  };

  const removeFromCart = (itemId: string, orderedFor?: string) => {
    setItems((prevItems) => prevItems.filter((item) => !(item._id === itemId && item.orderedFor === orderedFor)));
  };

  const decreaseQuantity = (itemId: string, orderedFor?: string) => {
    setItems((prevItems) => {
      return prevItems.map((i) =>
        (i._id === itemId && i.orderedFor === orderedFor) ? { ...i, quantity: i.quantity - 1 } : i
      ).filter(i => i.quantity > 0);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, decreaseQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
