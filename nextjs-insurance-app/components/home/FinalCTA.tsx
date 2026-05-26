"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api/client";
import { scrollToQuoteWidget } from "@/lib/scroll-to-quote";

interface ContactRouteResponse {
  route?: {
    whatsappUrl: string | null;
  };
}

interface PublicSettingsResponse {
  socialMedia?: {
    whatsapp?: string;
  };
}

const ADVISOR_WHATSAPP_MESSAGE =
  "Hola, necesito asesoría sobre mi seguro de viaje. ¿Me pueden ayudar?";

function withWhatsAppMessage(rawUrl: string, message: string): string {
  try {
    const url = new URL(rawUrl);
    const existingText = url.searchParams.get("text");

    if (!existingText) {
      url.searchParams.set("text", message);
    }

    return url.toString();
  } catch {
    const separator = rawUrl.includes("?") ? "&" : "?";
    return `${rawUrl}${separator}text=${encodeURIComponent(message)}`;
  }
}

function normalizeWhatsAppUrl(rawValue?: string | null): string | null {
  if (!rawValue) {
    return null;
  }

  const value = rawValue.trim();
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export default function FinalCTA() {
  const [contactingAdvisor, setContactingAdvisor] = useState(false);

  const openWhatsAppTarget = (url: string, popup: Window | null) => {
    if (popup) {
      popup.location.href = url;
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleContactAdvisor = async () => {
    const popup = window.open("", "_blank", "noopener,noreferrer");

    try {
      setContactingAdvisor(true);
      try {
        const response = await apiClient.get<ContactRouteResponse>(
          "/settings/public/contact-route",
        );
        const resolved = response.data?.route?.whatsappUrl;

        if (resolved) {
          const urlWithMessage = withWhatsAppMessage(
            resolved,
            ADVISOR_WHATSAPP_MESSAGE,
          );
          openWhatsAppTarget(urlWithMessage, popup);
          return;
        }
      } catch (error) {
        console.error("Error resolving geo WhatsApp route from FinalCTA:", error);
      }

      const settingsResponse = await apiClient.get<PublicSettingsResponse>("/settings/public");
      const fallbackWhatsApp = normalizeWhatsAppUrl(
        settingsResponse.data?.socialMedia?.whatsapp,
      );

      if (fallbackWhatsApp) {
        const urlWithMessage = withWhatsAppMessage(
          fallbackWhatsApp,
          ADVISOR_WHATSAPP_MESSAGE,
        );
        openWhatsAppTarget(urlWithMessage, popup);
        return;
      }

      popup?.close();
    } catch (error) {
      popup?.close();
      console.error("Error resolving WhatsApp contact from FinalCTA:", error);
    } finally {
      setContactingAdvisor(false);
    }
  };

  return (
    <section className="py-24 px-6 md:px-12 max-w-[1280px] mx-auto">
      <div
        className="bg-primary rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex items-end justify-start min-h-[400px]"
        style={{
          backgroundImage: "url('/final_cta_banner.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={scrollToQuoteWidget}
              className="bg-emerald-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20"
            >
              Cotizar Mi Viaje
            </button>
            <button
              type="button"
              onClick={handleContactAdvisor}
              disabled={contactingAdvisor}
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-all disabled:opacity-70"
            >
              <span className="material-symbols-outlined">chat</span>
              {contactingAdvisor ? "Conectando..." : "Contactar asesor"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
