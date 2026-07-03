'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface DeliveryLocation {
  governorate: string;
  governorateAr: string;
  area?: string;
}

interface DeliveryLocationContextType {
  location: DeliveryLocation | null;
  setLocation: (location: DeliveryLocation) => void;
  clearLocation: () => void;
  displayLabel: (language: 'en' | 'ar') => string;
}

const STORAGE_KEY = 'raf-delivery-location';

const DeliveryLocationContext = createContext<DeliveryLocationContextType | undefined>(undefined);

export const DeliveryLocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocationState] = useState<DeliveryLocation | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setLocationState(JSON.parse(saved));
    } catch {}
  }, []);

  const setLocation = useCallback((loc: DeliveryLocation) => {
    setLocationState(loc);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  }, []);

  const clearLocation = useCallback(() => {
    setLocationState(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const displayLabel = useCallback(
    (language: 'en' | 'ar') => {
      if (!location) {
        return language === 'ar' ? 'حدد موقع التوصيل' : 'Set delivery location';
      }
      const gov = language === 'ar' ? location.governorateAr : location.governorate;
      if (location.area) {
        return language === 'ar' ? `${location.area}، ${gov}` : `${location.area}, ${gov}`;
      }
      return gov;
    },
    [location],
  );

  return (
    <DeliveryLocationContext.Provider value={{ location, setLocation, clearLocation, displayLabel }}>
      {children}
    </DeliveryLocationContext.Provider>
  );
};

export const useDeliveryLocation = () => {
  const ctx = useContext(DeliveryLocationContext);
  if (!ctx) throw new Error('useDeliveryLocation must be used within DeliveryLocationProvider');
  return ctx;
};
