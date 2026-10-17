"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { Product } from "@/data/products";
import { Course, CourseMode } from "@/data/courses";

export interface CartItem {
  product: Product;
  quantity: number;
  mode?: CourseMode;
  itemType?: "product" | "course";
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, mode?: CourseMode) => void;
  addCourseToCart: (course: Course, mode: CourseMode) => void;
  removeFromCart: (productId: string, mode?: CourseMode) => void;
  updateQuantity: (productId: string, quantity: number, mode?: CourseMode) => void;
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

  const addToCart = useCallback((product: Product, mode?: CourseMode) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.mode === mode
      );
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prevItems, { product, quantity: 1, mode, itemType: "product" }];
    });
  }, []);

  const addCourseToCart = useCallback((course: Course, mode: CourseMode) => {
    const pricing = mode === "live" ? (course.live || course.recorded) : course.recorded;
    const selectedPrice = pricing?.price ?? course.price;

    const courseAsProduct: Product = {
      id: course.id,
      slug: course.slug,
      name: course.title,
      category: course.category || "Course",
      shortDescription: course.shortDescription,
      price: selectedPrice,
      image: course.image,
      icon: "sparkles",
      featured: false,
      enabled: course.enabled,
      href: `/courses#${course.slug}`,
    };

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === course.id && item.mode === mode
      );
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [
        ...prevItems,
        {
          product: courseAsProduct,
          quantity: 1,
          mode,
          itemType: "course",
        },
      ];
    });

    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string, mode?: CourseMode) => {
    setItems((prevItems) =>
      prevItems.filter((item) => {
        if (mode !== undefined) {
          return !(item.product.id === productId && item.mode === mode);
        }
        return item.product.id !== productId;
      })
    );
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, mode?: CourseMode) => {
    if (quantity <= 0) {
      removeFromCart(productId, mode);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => {
        const matches =
          mode !== undefined
            ? item.product.id === productId && item.mode === mode
            : item.product.id === productId;
        return matches ? { ...item, quantity } : item;
      })
    );
  }, [removeFromCart]);

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
      addCourseToCart,
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
      addCourseToCart,
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
