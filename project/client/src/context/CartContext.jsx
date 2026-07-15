import React, { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext(null);

// Simple in-memory cart: { bookId: { book, quantity, format } }
export function CartProvider({ children }) {
  const [items, setItems] = useState({});

  const addItem = (book, quantity = 1, format = "paperback") => {
    setItems((prev) => ({
      ...prev,
      [book._id]: {
        book,
        quantity: (prev[book._id]?.quantity || 0) + quantity,
        format,
      },
    }));
  };

  const updateQuantity = (bookId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) {
        const next = { ...prev };
        delete next[bookId];
        return next;
      }
      return { ...prev, [bookId]: { ...prev[bookId], quantity } };
    });
  };

  const removeItem = (bookId) => {
    setItems((prev) => {
      const next = { ...prev };
      delete next[bookId];
      return next;
    });
  };

  const clearCart = () => setItems({});

  const cartList = useMemo(() => Object.values(items), [items]);
  const total = useMemo(
    () => cartList.reduce((sum, i) => sum + i.book.price * i.quantity, 0),
    [cartList]
  );

  return (
    <CartContext.Provider value={{ items: cartList, addItem, updateQuantity, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
