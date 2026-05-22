"use client";

import { useEffect } from "react";
import { getPublicCompanySettings } from "@/lib/api/public-settings";

export default function BrandingLoader() {
  useEffect(() => {
    const loadBranding = async () => {
      const settings = await getPublicCompanySettings();
      if (!settings) return;

      if (settings.companyName) {
        document.title = `${settings.companyName} - Asistencia al Viajero`;
      }

      if (settings.faviconUrl) {
        const existing = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
        if (existing) {
          existing.href = settings.faviconUrl;
        } else {
          const link = document.createElement("link");
          link.rel = "icon";
          link.href = settings.faviconUrl;
          document.head.appendChild(link);
        }
      }
    };

    loadBranding();
  }, []);

  return null;
}
