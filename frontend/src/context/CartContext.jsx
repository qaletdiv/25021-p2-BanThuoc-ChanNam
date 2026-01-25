//frontend/src/context/CartContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCart } from '@/lib/cart';
import { useAuth } from '@/context/AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();


  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          const items = await fetchCart();
          setCartItems(items);
          const total = items.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(total);
        } catch (error) {
          console.error('Failed to load cart:', error);
          setCartCount(0);
          setCartItems([]);
        }
      } else {
        setCartCount(0);
        setCartItems([]);
      }
    };

    loadCart();
  }, [user]);


  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  const addToCart = async (productId, unit, quantity) => {
    if (!user) {
      router.push('/login');
      return;
    }
    

    const newCount = cartCount + quantity;
    setCartCount(newCount);
  };

  return (
    <CartContext.Provider value={{ 
      cartCount, 
      cartItems, 
      updateCartCount,
      addToCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);