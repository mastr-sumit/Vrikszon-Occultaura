"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = useCallback((product: Product) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);

  const totalPrice = useMemo(() => {
    return items.reduce((acc, item) => {
      const itemPrice = item.product.price ?? 0;
      return acc + itemPrice * item.quantity;
    }, 0);
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const contextValue = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isOpen,
      setIsOpen,
      openCart,
      closeCart,
    }),
    [
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      isOpen,
      openCart,
      closeCart,
    ]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
