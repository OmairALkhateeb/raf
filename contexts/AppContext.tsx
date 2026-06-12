'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product } from '@/types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface CompareItem extends Product {}

interface AppContextType {
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  compareItems: CompareItem[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

  const addToRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  }, []);

  const addToCompare = useCallback((product: Product) => {
    setCompareItems(prev => {
      if (prev.some(p => p.id === product.id) || prev.length >= 4) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromCompare = useCallback((productId: string) => {
    setCompareItems(prev => prev.filter(p => p.id !== productId));
  }, []);

  const isInCompare = (productId: string) => compareItems.some(p => p.id === productId);
  const clearCompare = useCallback(() => setCompareItems([]), []);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <AppContext.Provider value={{
      recentlyViewed, addToRecentlyViewed,
      compareItems, addToCompare, removeFromCompare, isInCompare, clearCompare,
      toasts, showToast,
      quickViewProduct, setQuickViewProduct,
      isMobileMenuOpen, setMobileMenuOpen,
      isSearchOpen, setSearchOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
