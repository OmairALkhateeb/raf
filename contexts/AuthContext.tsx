'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { mockUser } from '@/data/mockUser';

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  /** True until the persisted session has been read from localStorage. */
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (data: RegisterInput) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'raf-auth-user';

// Simulates network latency so loading states feel real — no backend involved.
const fakeDelay = () => new Promise(resolve => setTimeout(resolve, 900));

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {}
    setIsAuthLoading(false);
  }, []);

  const persist = (next: User | null) => {
    setUser(next);
    try {
      if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    await fakeDelay();
    persist({ ...mockUser, email: email.trim() || mockUser.email });
    return { success: true };
  }, []);

  const register = useCallback(async (data: RegisterInput): Promise<AuthResult> => {
    await fakeDelay();
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: data.name.trim() || mockUser.name,
      email: data.email.trim() || mockUser.email,
      phone: data.phone.trim(),
      avatar: mockUser.avatar,
      addresses: [],
      orders: [],
    };
    persist(newUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    persist(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, isAuthLoading, login, register, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
