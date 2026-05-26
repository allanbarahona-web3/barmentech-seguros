"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api/client";

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

const FAQ_WHATSAPP_PRE_MESSAGE =
  "Hola, quiero saber mas sobre coberturas, limites y restricciones de Assist Card para mi viaje.";

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

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [resolvingContact, setResolvingContact] = useState(false);

  const openWhatsAppTarget = (url: string, popup: Window | null) => {
    if (popup) {
      popup.location.href = url;
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const faqs = [
    {
      question: "¿Con cuanto tiempo de anticipacion debo adquirir mi seguro de viaje?",
      answer:
        "Puedes adquirirlo hasta 6 horas antes de tu vuelo para que tenga efecto cuando salgas del pais. Te recomendamos emitirlo con anticipacion para revisar bien coberturas, topes y restricciones."
    },
    {
      question: "¿Este seguro solo aplica para viajes internacionales o tambien para viajes locales en Costa Rica?",
      answer:
        "Si, tambien puede aplicar para viajes locales en Costa Rica, segun el producto y modalidad que emitas. Al cotizar te mostramos la opcion correcta para viaje internacional o nacional."
    },
    {
      question: "¿La asistencia cubre enfermedades preexistentes?",
      answer:
        "Si, existen opciones para urgencias por enfermedades preexistentes segun plan y tope contratado. No aplica para chequeos, controles de rutina o tratamientos programados."
    },
    {
      question: "¿Que cubre cancelacion e interrupcion de viaje?",
      answer:
        "Cubre gastos no recuperables por eventos contemplados en condiciones generales, como enfermedad o fuerza mayor. Los montos cambian segun el adicional y el plan emitido."
    },
    {
      question: "¿Que pasa si mi equipaje se demora, se pierde o se dana?",
      answer:
        "Hay coberturas para demora, extravio y danos con topes por bulto y condiciones de activacion. En algunos casos se requiere reporte del transportista (como PIR) y aviso oportuno."
    },
    {
      question: "¿Como aplican coberturas especiales como embarazo y deportes?",
      answer:
        "Son adicionales con limites especificos de edad, semanas de gestacion y tipo de actividad deportiva. Siempre debes revisar alcances, topes y restricciones antes de emitir."
    }
  ];

  const handleLearnMore = async () => {
    const popup = window.open("", "_blank", "noopener,noreferrer");

    try {
      setResolvingContact(true);
      try {
        const response = await apiClient.get<ContactRouteResponse>(
          "/settings/public/contact-route",
        );
        const resolved = response.data?.route?.whatsappUrl;

        if (resolved) {
          const urlWithMessage = withWhatsAppMessage(
            resolved,
            FAQ_WHATSAPP_PRE_MESSAGE,
          );
          openWhatsAppTarget(urlWithMessage, popup);
          return;
        }
      } catch (error) {
        console.error("Error resolving geo WhatsApp route from FAQ:", error);
      }

      const settingsResponse = await apiClient.get<PublicSettingsResponse>("/settings/public");
      const fallbackWhatsApp = normalizeWhatsAppUrl(
        settingsResponse.data?.socialMedia?.whatsapp,
      );

      if (fallbackWhatsApp) {
        const urlWithMessage = withWhatsAppMessage(
          fallbackWhatsApp,
          FAQ_WHATSAPP_PRE_MESSAGE,
        );
        openWhatsAppTarget(urlWithMessage, popup);
        return;
      }

      popup?.close();
    } catch (error) {
      popup?.close();
      console.error("Error resolving WhatsApp contact from FAQ:", error);
    } finally {
      setResolvingContact(false);
    }
  };

  return (
    <section id="preguntas" className="py-24 bg-surface-dim/20">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <h2 className="text-headline-lg font-headline-lg text-primary text-center mb-12">
          Preguntas Frecuentes
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h4 className="font-manrope font-bold text-primary">
                  {faq.question}
                </h4>
                <span
                  className={`material-symbols-outlined transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </span>
              </div>

              {openIndex === index && (
                <p className="mt-4 text-body-sm text-neutral-600">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-6 md:p-7 text-center">
          <p className="text-primary font-semibold text-lg">
            ¿Quieres saber mas segun tu destino, edad o tipo de viaje?
          </p>
          <p className="text-slate-600 mt-2 text-sm md:text-base">
            Nuestro equipo te orienta por WhatsApp para elegir la cobertura ideal con Assist Card.
          </p>
          <button
            type="button"
            onClick={handleLearnMore}
            disabled={resolvingContact}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 text-white font-label-md hover:brightness-110 transition-all disabled:opacity-70"
          >
            {resolvingContact ? "Conectando..." : "Quiero saber mas"}
            <span className="material-symbols-outlined">chat</span>
          </button>
        </div>
      </div>
    </section>
  );
}
