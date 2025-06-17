import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { ref, set, get, remove, update } from 'firebase/database';
import { database } from '../firebase/config';

const CartContext = createContext({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getTotalItems: () => 0,
  getTotalPrice: () => 0
});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { currentUser } = useAuth();

  // Load cart from Firebase when user changes
  useEffect(() => {
    const loadCart = async () => {
      if (!currentUser) {
        setCartItems([]);
        return;
      }

      try {
        const cartRef = ref(database, `users/${currentUser.uid}/cart`);
        const snapshot = await get(cartRef);
        
        if (snapshot.exists()) {
          const cartData = snapshot.val();
          // Convert object to array if needed
          const items = Object.entries(cartData).map(([id, item]) => ({
            id,
            ...item
          }));
          setCartItems(items);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
      }
    };

    loadCart();
  }, [currentUser]);

  const addToCart = async (item) => {
    if (!item || !item.id || !currentUser) return;

    try {
      const cartRef = ref(database, `users/${currentUser.uid}/cart/${item.id}`);
      const snapshot = await get(cartRef);

      if (snapshot.exists()) {
        // Update quantity if item exists
        const currentItem = snapshot.val();
        const newQuantity = (currentItem.quantity || 0) + (item.quantity || 1);
        await update(cartRef, { quantity: newQuantity });
      } else {
        // Add new item
        await set(cartRef, {
          ...item,
          quantity: item.quantity || 1,
          addedAt: Date.now()
        });
      }

      // Update local state
      setCartItems(prevItems => {
        const existingItem = prevItems.find(i => i.id === item.id);
        if (existingItem) {
          return prevItems.map(i =>
            i.id === item.id 
              ? { ...i, quantity: (i.quantity || 0) + (item.quantity || 1) }
              : i
          );
        }
        return [...prevItems, { ...item, quantity: item.quantity || 1 }];
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!itemId || !currentUser) return;

    try {
      const cartRef = ref(database, `users/${currentUser.uid}/cart/${itemId}`);
      await remove(cartRef);

      // Update local state
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!itemId || quantity < 1 || !currentUser) return;

    try {
      const cartRef = ref(database, `users/${currentUser.uid}/cart/${itemId}`);
      await update(cartRef, { quantity });

      // Update local state
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    if (!currentUser) return;

    try {
      const cartRef = ref(database, `users/${currentUser.uid}/cart`);
      await remove(cartRef);
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getTotalItems = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const getTotalPrice = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);
  };

  const value = {
    cartItems: Array.isArray(cartItems) ? cartItems : [],
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider; 