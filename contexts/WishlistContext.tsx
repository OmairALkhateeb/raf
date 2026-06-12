'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('raf-wishlist');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('raf-wishlist', JSON.stringify(items));
  }, [items]);

  const addToWishlist = useCallback((product: Product) => {
    setItems(prev => prev.some(p => p.id === product.id) ? prev : [...prev, product]);
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setItems(prev => prev.filter(p => p.id !== productId));
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    setItems(prev =>
      prev.some(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  }, []);

  const isInWishlist = (productId: string) => items.some(p => p.id === productId);

  return (
    <WishlistContext.Provider value={{
      items, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, count: items.length,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
