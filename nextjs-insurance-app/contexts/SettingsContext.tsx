"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getPublicCompanySettings, PublicCompanySettings } from "@/lib/api/public-settings";

interface SettingsContextType {
  settings: PublicCompanySettings | null;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PublicCompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      // Try to load from sessionStorage first
      if (typeof window !== 'undefined') {
        const cached = sessionStorage.getItem('companySettings');
        if (cached) {
          try {
            const cachedSettings = JSON.parse(cached);
            setSettings(cachedSettings);
            setLoading(false);
            
            // Update document immediately with cached data
            if (cachedSettings.companyName) {
              document.title = `${cachedSettings.companyName} - Asistencia al Viajero`;
            }
            if (cachedSettings.faviconUrl) {
              const existing = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
              if (existing) {
                existing.href = cachedSettings.faviconUrl;
              } else {
                const link = document.createElement("link");
                link.rel = "icon";
                link.href = cachedSettings.faviconUrl;
                document.head.appendChild(link);
              }
            }
            // Continue to fetch fresh data in background
          } catch {
            // Invalid cache, continue to fetch
          }
        }
      }

      // Fetch fresh data from API
      const companySettings = await getPublicCompanySettings();
      if (companySettings) {
        setSettings(companySettings);
        
        // Cache in sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('companySettings', JSON.stringify(companySettings));
        }

        // Update document title and favicon
        if (companySettings.companyName) {
          document.title = `${companySettings.companyName} - Asistencia al Viajero`;
        }

        if (companySettings.faviconUrl) {
          const existing = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
          if (existing) {
            existing.href = companySettings.faviconUrl;
          } else {
            const link = document.createElement("link");
            link.rel = "icon";
            link.href = companySettings.faviconUrl;
            document.head.appendChild(link);
          }
        }
      }
      setLoading(false);
    };

    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
