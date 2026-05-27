"use client";

import { scrollToQuoteWidget } from "@/lib/scroll-to-quote";
import ContactAdvisorButton from "@/components/common/ContactAdvisorButton";

const WHATSAPP_PRE_MESSAGE =
  "Hola, necesito informacion sobre seguros de viaje. Vengo del sitio web www.seguros.barmentech.com.";

export default function HeroCtaButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        type="button"
        onClick={scrollToQuoteWidget}
        className="inline-flex items-center justify-center bg-secondary text-white px-8 py-4 rounded-xl font-manrope font-bold hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20"
      >
        Cotizar ahora
      </button>
      <ContactAdvisorButton
        message={WHATSAPP_PRE_MESSAGE}
        className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-xl font-manrope font-bold hover:bg-white/10 transition-all disabled:opacity-70"
      />
    </div>
  );
}
