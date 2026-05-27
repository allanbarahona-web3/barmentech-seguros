"use client";

import { scrollToQuoteWidget } from "@/lib/scroll-to-quote";
import ContactAdvisorButton from "@/components/common/ContactAdvisorButton";

const ADVISOR_WHATSAPP_MESSAGE =
  "Hola, necesito asesoría sobre mi seguro de viaje. ¿Me pueden ayudar?";

export default function FinalCTA() {
  
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
            <ContactAdvisorButton
              message={ADVISOR_WHATSAPP_MESSAGE}
              className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/20 transition-all disabled:opacity-70"
              showChatIcon
            />
          </div>
        </div>
      </div>
    </section>
  );
}
