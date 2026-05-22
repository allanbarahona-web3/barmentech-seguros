"use client";

import { useEffect, useState, useRef } from "react";
import {
  DESTINATION_REGIONS,
  FREQUENT_DESTINATIONS,
} from "@/lib/quote/destinations";

interface PrefillQuickQuoteDetail {
  destination?: string;
}

interface QuickQuoteWidgetProps {
  embedded?: boolean;
}

const QUICK_DESTINATION_CARDS = [
  "Europa",
  "Asia",
  "EE.UU.",
  "Oceanía",
  "Costa Rica",
  "Sur America",
];

export default function QuickQuoteWidget({ embedded = false }: QuickQuoteWidgetProps) {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalTravelers, setTotalTravelers] = useState(1);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handlePrefill = (event: Event) => {
      const customEvent = event as CustomEvent<PrefillQuickQuoteDetail>;
      if (customEvent.detail?.destination) {
        setDestination(customEvent.detail.destination);
      }
    };

    window.addEventListener("prefill-quick-quote", handlePrefill as EventListener);
    return () => {
      window.removeEventListener("prefill-quick-quote", handlePrefill as EventListener);
    };
  }, []);

  // Handle navigation from buttons with smooth scroll and highlight animation
  useEffect(() => {
    const performScrollAndHighlight = () => {
      if (sectionRef.current) {
        // Smooth scroll with offset for fixed header
        const headerOffset = 100; // Adjust based on your header height
        const elementPosition = sectionRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });

        // Trigger highlight animation
        setIsHighlighted(true);
        setTimeout(() => setIsHighlighted(false), 2500);
      }
    };

    const handleScrollToQuote = () => {
      performScrollAndHighlight();
    };

    const handleHashChange = () => {
      if (window.location.hash === "#cotizar") {
        performScrollAndHighlight();
      }
    };

    // Check on mount if we're already at the hash
    if (window.location.hash === "#cotizar") {
      performScrollAndHighlight();
    }

    // Listen for custom event (from internal navigation)
    window.addEventListener("scroll-to-quote", handleScrollToQuote);
    // Listen for hash changes (from external links)
    window.addEventListener("hashchange", handleHashChange);
    
    return () => {
      window.removeEventListener("scroll-to-quote", handleScrollToQuote);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleOpenQuoteModal = () => {
    window.dispatchEvent(
      new CustomEvent("open-quote-modal", {
        detail: {
          destination,
          startDate,
          endDate,
          totalTravelers,
        },
      }),
    );
  };

  return (
    <section 
      ref={sectionRef}
      id={embedded ? undefined : "cotizar"}
      className={
        embedded
          ? "relative z-20 scroll-mt-24"
          : "relative -mt-16 z-20 px-8 scroll-mt-24"
      }
    >
      <div 
        className={`max-w-[1080px] mx-auto bg-white rounded-2xl shadow-xl p-8 border transition-all duration-500 ${
          isHighlighted 
            ? "border-secondary shadow-2xl shadow-secondary/30 quote-widget-highlight" 
            : "border-slate-100"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-end">
          <div className="space-y-2 lg:col-span-3">
            <label className="font-label-sm text-slate-500 uppercase tracking-wider">
              Destino
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                public
              </span>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-secondary appearance-none transition-all outline-none bg-white"
              >
                <option value="">Selecciona un destino</option>
                <optgroup label="Destinos recomendados">
                  {QUICK_DESTINATION_CARDS.map((item) => (
                    <option key={`quick-${item}`} value={item}>
                      {item}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Destinos frecuentes">
                  <option value="Otro destino">Otro destino</option>
                  {FREQUENT_DESTINATIONS.map((country) => (
                    <option key={`frequent-${country}`} value={country}>
                      {country}
                    </option>
                  ))}
                </optgroup>
                {DESTINATION_REGIONS.map((group) => (
                  <optgroup key={group.region} label={group.region}>
                    {group.countries.map((country) => (
                      <option key={`${group.region}-${country}`} value={country}>
                        {country}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 lg:col-span-4">
            <label className="font-label-sm text-slate-500 uppercase tracking-wider">
              Fechas
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:border-secondary transition-all outline-none"
              />
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:border-secondary transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label className="font-label-sm text-slate-500 uppercase tracking-wider">
              Viajeros
            </label>
            <input
              type="number"
              min={1}
              value={totalTravelers}
              onChange={(e) =>
                setTotalTravelers(Math.max(1, Number(e.target.value) || 1))
              }
              className="w-full px-3 py-3 rounded-xl border border-slate-200 focus:border-secondary transition-all outline-none"
              placeholder="Cantidad total"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenQuoteModal}
            className="lg:col-span-3 bg-secondary text-white py-3 rounded-xl font-label-md hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
          >
            Cotizar viaje
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
}
