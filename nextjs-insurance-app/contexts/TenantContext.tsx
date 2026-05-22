"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { PublicCompanySettings } from '@/lib/api/public-settings';

interface TenantContextType {
  settings: PublicCompanySettings | null;
}

const TenantContext = createContext<TenantContextType>({
  settings: null,
});

export function TenantProvider({
  children,
  settings,
}: {
  children: ReactNode;
  settings: PublicCompanySettings | null;
}) {
  return (
    <TenantContext.Provider value={{ settings }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}
