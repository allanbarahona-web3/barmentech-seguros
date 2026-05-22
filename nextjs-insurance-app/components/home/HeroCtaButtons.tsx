"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api/client";
import { scrollToQuoteWidget } from "@/lib/scroll-to-quote";

interface ContactRouteResponse {
  route?: {
    whatsappUrl: string | null;
  };
}

const WHATSAPP_PRE_MESSAGE =
  "Hola, necesito informacion sobre seguros de viaje. Vengo del sitio web www.seguros.barmentech.com.";

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

export default function HeroCtaButtons() {
  const [resolvingContact, setResolvingContact] = useState(false);

  const handleAdvisorClick = async () => {
    try {
      setResolvingContact(true);
      const response = await apiClient.get<ContactRouteResponse>(
        "/settings/public/contact-route",
      );
      const resolved = response.data?.route?.whatsappUrl;

      if (resolved) {
        const urlWithMessage = withWhatsAppMessage(resolved, WHATSAPP_PRE_MESSAGE);
        window.open(urlWithMessage, "_blank", "noopener,noreferrer");
        return;
      }
    } catch (error) {
      console.error("Error resolving geo WhatsApp contact:", error);
    } finally {
      setResolvingContact(false);
    }

    window.location.href = "/support";
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        type="button"
        onClick={scrollToQuoteWidget}
        className="inline-flex items-center justify-center bg-secondary text-white px-8 py-4 rounded-xl font-manrope font-bold hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20"
      >
        Cotizar ahora
      </button>
      <button
        type="button"
        onClick={handleAdvisorClick}
        disabled={resolvingContact}
        className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl font-manrope font-bold hover:bg-white/10 transition-all disabled:opacity-70"
      >
        {resolvingContact ? "Conectando..." : "Hablar con un asesor"}
      </button>
    </div>
  );
}
