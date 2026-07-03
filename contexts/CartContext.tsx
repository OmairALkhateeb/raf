'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, qty?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isInCart: (productId: string) => boolean;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderNotes, setOrderNotesState] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('raf-cart');
      if (saved) setItems(JSON.parse(saved));
      const savedNotes = localStorage.getItem('raf-order-notes');
      if (savedNotes) setOrderNotesState(savedNotes);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('raf-cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('raf-order-notes', orderNotes);
  }, [orderNotes]);

  const setOrderNotes = useCallback((notes: string) => {
    setOrderNotesState(notes);
  }, []);

  const addToCart = useCallback((product: Product, qty = 1, color?: string, size?: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { product, quantity: qty, selectedColor: color, selectedSize: size }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(i => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    setOrderNotesState('');
    localStorage.removeItem('raf-order-notes');
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const isInCart = (productId: string) => items.some(i => i.product.id === productId);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      itemCount, subtotal, isInCart, orderNotes, setOrderNotes,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
