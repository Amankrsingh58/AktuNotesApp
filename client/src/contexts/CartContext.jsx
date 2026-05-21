import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('eduNotesCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart data:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('eduNotesCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (note, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems?.find(item => item?.id === note?.id);
      
      if (existingItem) {
        return prevItems?.map(item =>
          item?.id === note?.id
            ? { ...item, quantity: Math.min(item?.quantity + quantity, 10) }
            : item
        );
      }
      
      return [...prevItems, { ...note, quantity }];
    });
  };

  const removeFromCart = (noteId) => {
    setCartItems(prevItems => prevItems?.filter(item => item?.id !== noteId));
  };

  const updateQuantity = (noteId, quantity) => {
    if (quantity < 1) {
      removeFromCart(noteId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems?.map(item =>
        item?.id === noteId
          ? { ...item, quantity: Math.min(quantity, 10) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems?.reduce((total, item) => total + (item?.price * item?.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems?.reduce((count, item) => count + item?.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;