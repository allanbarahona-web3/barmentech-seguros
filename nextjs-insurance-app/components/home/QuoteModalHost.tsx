"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import {
  openWhatsAppTarget,
  resolveAdvisorWhatsAppUrl,
  withWhatsAppMessage,
} from "@/lib/contact-advisor";

interface QuotePayload {
  destination: string;
  startDate: string;
  endDate: string;
  totalTravelers: number;
  passengerAges: string;
  wantsEmailQuote: boolean;
  email: string;
}

interface QuoteModalOpenDetail {
  destination?: string;
  startDate?: string;
  endDate?: string;
  totalTravelers?: number;
}

interface RegisterLeadResponse {
  success: boolean;
  emailLogged?: boolean;
}

const DEFAULT_QUOTE_PAYLOAD: QuotePayload = {
  destination: "",
  startDate: "",
  endDate: "",
  totalTravelers: 1,
  passengerAges: "",
  wantsEmailQuote: false,
  email: "",
};

function formatDate(value: string): string {
  if (!value) {
    return "No especificada";
  }

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function buildQuoteMessage(data: QuotePayload): string {
  return [
    "Hola, necesito informacion para cotizar un seguro de viaje.",
    `Origen: www.seguros.barmentech.com`,
    `Destino: ${data.destination || "No especificado"}`,
    `Fecha inicio: ${formatDate(data.startDate)}`,
    `Fecha fin: ${formatDate(data.endDate)}`,
    `Cantidad viajeros: ${data.totalTravelers || 1}`,
    `Edades pasajeros: ${data.passengerAges || "No especificadas"}`,
    `Desea cotizacion por email: ${data.wantsEmailQuote ? "Si" : "No"}`,
    data.wantsEmailQuote
      ? `Email: ${data.email || "No especificado"}`
      : "Email: No aplica",
  ].join("\n");
}

export default function QuoteModalHost() {
  const [isOpen, setIsOpen] = useState(false);
  const [resolvingContact, setResolvingContact] = useState(false);
  const [form, setForm] = useState<QuotePayload>(DEFAULT_QUOTE_PAYLOAD);
  const [agesFieldShake, setAgesFieldShake] = useState(false);

  useEffect(() => {
    const openModal = (event: Event) => {
      const customEvent = event as CustomEvent<QuoteModalOpenDetail>;
      const detail = customEvent.detail || {};

      setForm((prev) => ({
        destination: detail.destination ?? prev.destination,
        startDate: detail.startDate ?? prev.startDate,
        endDate: detail.endDate ?? prev.endDate,
        totalTravelers: detail.totalTravelers ?? prev.totalTravelers,
        passengerAges: "",
        wantsEmailQuote: false,
        email: "",
      }));
      setIsOpen(true);
      
      // Trigger shake animation to draw attention to ages field
      setTimeout(() => setAgesFieldShake(true), 300);
      setTimeout(() => setAgesFieldShake(false), 1300);
    };

    window.addEventListener("open-quote-modal", openModal as EventListener);
    return () => {
      window.removeEventListener("open-quote-modal", openModal as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen]);

  const handleContactAdvisor = async () => {
    const message = buildQuoteMessage(form);
    const popup = window.open("", "_blank", "noopener,noreferrer");

    // Intentamos registrar el lead por correo interno sin bloquear el flujo de WhatsApp.
    try {
      await apiClient.post<RegisterLeadResponse>('/quote-leads/public-intake', {
        destination: form.destination,
        startDate: form.startDate,
        endDate: form.endDate,
        totalTravelers: form.totalTravelers,
        passengerAges: form.passengerAges,
        wantsEmailQuote: form.wantsEmailQuote,
        email: form.email,
      });
    } catch (error) {
      console.error('Error registering quote lead by email:', error);
    }

    try {
      setResolvingContact(true);
      const resolved = await resolveAdvisorWhatsAppUrl(apiClient);

      if (resolved) {
        const withMessage = withWhatsAppMessage(resolved, message);
        openWhatsAppTarget(withMessage, popup);
        setIsOpen(false);
        return;
      }

      popup?.close();
    } catch (error) {
      popup?.close();
      console.error("Error resolving quote contact route:", error);
    } finally {
      setResolvingContact(false);
    }

    window.location.href = "/support";
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80]">
      <div
        className="absolute inset-0 bg-slate-950/60"
        onClick={() => setIsOpen(false)}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200">
          <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-slate-100">
            <h3 className="text-xl md:text-2xl font-bold text-primary">Cotiza tu viaje</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-600"
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </div>

          <div className="p-5 md:p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Destino</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {form.destination || "No especificado"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Fechas</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {form.startDate ? formatDate(form.startDate) : "--"} - {" "}
                  {form.endDate ? formatDate(form.endDate) : "--"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Viajeros</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {form.totalTravelers || 1}
                </p>
              </div>
            </div>

            <div className={agesFieldShake ? "quote-modal-ages-shake" : ""}>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <span className="material-symbols-outlined text-2xl text-primary quote-modal-pulse-icon">
                  group
                </span>
                Edades de los pasajeros
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.passengerAges}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, passengerAges: e.target.value }))
                  }
                  placeholder="Ej: 34, 29, 8, 5 (obligatorio)"
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors ${
                    form.passengerAges.trim()
                      ? "border-slate-200 focus:border-secondary"
                      : "border-primary/40 focus:border-primary"
                  }`}
                />
              </div>
              <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1">
                <span>💡</span>
                <span>Las edades determinan el precio exacto del seguro</span>
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-100 p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.wantsEmailQuote}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      wantsEmailQuote: e.target.checked,
                      email: e.target.checked ? prev.email : "",
                    }))
                  }
                  className="h-5 w-5 rounded border-slate-300 mt-0.5 cursor-pointer"
                  id="email-quote-checkbox"
                />
                <label htmlFor="email-quote-checkbox" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">✉️</span>
                    <span className="text-sm font-bold text-slate-800">
                      ¡Recibí tu cotización detallada por email!
                    </span>
                    <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                      RECOMENDADO
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Incluye comparativa de planes, consejos de viaje y podés consultarla cuando quieras
                  </p>
                </label>
              </div>
            </div>

            {form.wantsEmailQuote && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="correo@ejemplo.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-secondary outline-none"
                />
              </div>
            )}

            <p className="text-xs text-slate-500">
              Al continuar te conectaremos por WhatsApp con un asesor segun tu region.
            </p>
          </div>

          <div className="px-5 md:px-6 pb-6 flex flex-col-reverse md:flex-row md:justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleContactAdvisor}
              disabled={resolvingContact || !form.passengerAges.trim()}
              className="px-5 py-3 rounded-xl bg-secondary text-white font-semibold hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              title={!form.passengerAges.trim() ? "Completá las edades de los pasajeros para continuar" : ""}
            >
              {resolvingContact ? "Enviando..." : "Enviar a cotizar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
