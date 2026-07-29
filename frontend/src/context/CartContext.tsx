import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../lib/api';
import { useAuth } from './AuthContext';

export interface CartItem {
  productid: number;
  productname: string;
  chefname: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (productid: number, quantity?: number) => Promise<void>;
  removeFromCart: (productid: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    try {
      const items = await fetchApi('/get-cart');
      if (Array.isArray(items)) {
        setCartItems(items);
      }
    } catch (e) {
      console.warn('Failed to fetch cart:', e);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (productid: number, quantity = 1) => {
    if (!isAuthenticated) {
      alert('Please login to add items to your cart.');
      return;
    }
    await fetchApi('/add-to-cart', {
      method: 'POST',
      body: JSON.stringify({ productid, quantity }),
    });
    await refreshCart();
  };

  const removeFromCart = async (productid: number) => {
    if (!isAuthenticated) return;
    await fetchApi(`/remove-from-cart/${productid}`, {
      method: 'DELETE',
    });
    await refreshCart();
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
