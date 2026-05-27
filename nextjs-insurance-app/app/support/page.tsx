"use client";

import { useState, useRef, useEffect } from "react";
import { scrollToQuoteWidget } from "@/lib/scroll-to-quote";
import FinalCTA from "@/components/home/FinalCTA";
import ContactAdvisorButton from "@/components/common/ContactAdvisorButton";

export const dynamic = "force-dynamic";

interface FAQ {
  question: string;
  answer: string;
}

interface ContactMethod {
  icon: string;
  title: string;
  description: string;
  action: {
    type: "phone" | "whatsapp" | "email";
    value: string;
    label: string;
  };
}

interface UseCase {
  icon: string;
  text: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const CONTACT_METHODS: ContactMethod[] = [
  {
    icon: "chat",
    title: "🇨🇷 WhatsApp Costa Rica",
    description: "Atención en español e inglés",
    action: {
      type: "whatsapp",
      value: "50670067572",
      label: "+506 7006-7572",
    },
  },
  {
    icon: "chat",
    title: "🇺🇸 WhatsApp USA",
    description: "Atención en español e inglés",
    action: {
      type: "whatsapp",
      value: "17863918722",
      label: "+1 (786) 391-8722",
    },
  },
  {
    icon: "chat",
    title: "🇪🇺 WhatsApp Europa",
    description: "Atención en español e inglés",
    action: {
      type: "whatsapp",
      value: "447735701311",
      label: "+44 7735 701311",
    },
  },
  {
    icon: "mail",
    title: "✉️ Email Soporte",
    description: "Atención en español e inglés (respuesta < 24hrs)",
    action: {
      type: "email",
      value: "seguros@barmentech.com",
      label: "seguros@barmentech.com",
    },
  },
];

const USE_CASES: UseCase[] = [
  {
    icon: "help",
    text: "No sabés qué plan elegir para tu destino",
  },
  {
    icon: "map",
    text: "Tenés un viaje complejo con múltiples destinos",
  },
  {
    icon: "groups",
    text: "Necesitás cotización para grupo o familia",
  },
  {
    icon: "add_circle",
    text: "Querés agregar coberturas especiales (deportes, embarazo, etc.)",
  },
  {
    icon: "description",
    text: "Tenés preguntas sobre tu póliza activa",
  },
  {
    icon: "schedule",
    text: "Necesitás corregir errores en datos (nombres, pasaporte, fechas)",
  },
];

const FAQS: FAQ[] = [
  {
    question: "¿Cuánto tarda la respuesta por WhatsApp?",
    answer: "Nuestro tiempo promedio de respuesta es menor a 2 minutos durante horario hábil (8am-8pm hora Costa Rica). Fuera de horario, respondemos al día siguiente temprano. Para emergencias 24/7, consultá tu póliza que incluye líneas directas de Assist Card.",
  },
  {
    question: "¿Puedo cambiar mi plan después de comprarlo?",
    answer: "Solo podés corregir errores en los datos (nombres mal escritos, número de pasaporte incorrecto, fechas equivocadas) ANTES de iniciar el viaje. NO se pueden agregar viajeros adicionales. Una vez iniciado el viaje, no se permiten cambios. Contactanos por WhatsApp inmediatamente si detectás algún error.",
  },
  {
    question: "¿Cómo recibo mi póliza después de pagar?",
    answer: "Tu voucher digital llega automáticamente por email inmediatamente después del pago. Revisá también tu carpeta de spam. Si no lo recibís en 5 minutos, contactanos por WhatsApp con tu número de confirmación.",
  },
  {
    question: "¿Qué hago si tengo una emergencia médica durante el viaje?",
    answer: "NO vayas directo al hospital. Primero llamá a la línea 24/7 de Assist Card que aparece en tu voucher. Ellos coordinan y autorizan todo. Si vas directo, es posible que debás pagar de tu bolsillo y luego hacer reembolso (proceso más lento).",
  },
  {
    question: "¿Puedo cotizar para viajes largos (más de 3 meses)?",
    answer: "Sí, manejamos pólizas para viajes de larga duración, nómadas digitales, estudiantes internacionales y residentes temporales. Contactanos por WhatsApp con tus fechas exactas para una cotización personalizada.",
  },
  {
    question: "¿Atienden en inglés o solo español?",
    answer: "Todos nuestros canales de atención (WhatsApp y email) atienden en español e inglés. Podés comunicarte en el idioma que te resulte más cómodo, sin importar qué canal uses.",
  },
  {
    question: "¿Puedo comprar seguro para alguien más (familiar, amigo)?",
    answer: "Sí, podés comprar y pagar el seguro para otra persona. Solo necesitás sus datos personales completos (nombre, cédula/pasaporte, fecha de nacimiento, email). El voucher se enviará al email que indiques.",
  },
  {
    question: "¿Cuánto antes del viaje debo comprar el seguro?",
    answer: "Podés comprar hasta 6 horas antes de iniciar tu viaje. Sin embargo, recomendamos hacerlo al menos 24-48 horas antes para evitar contratiempos. Algunos beneficios (como cancelación de viaje) solo aplican si comprás con anticipación.",
  },
];

const FEATURES: Feature[] = [
  {
    icon: "schedule",
    title: "Respuesta Rápida",
    description: "Tiempo promedio menor a 2 minutos por WhatsApp",
  },
  {
    icon: "verified_user",
    title: "Asesores Certificados",
    description: "Expertos en seguros internacionales de viaje",
  },
  {
    icon: "language",
    title: "Soporte Multiidioma",
    description: "Atención en español, inglés y portugués",
  },
];

const SUPPORT_ADVISOR_WHATSAPP_MESSAGE =
  "Hola, necesito apoyo para elegir o gestionar mi seguro de viaje.";

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (faqRef.current && !faqRef.current.contains(event.target as Node)) {
        setOpenFaq(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleContactClick = (method: ContactMethod) => {
    const { type, value } = method.action;
    
    if (type === "whatsapp") {
      window.open(`https://wa.me/${value}`, "_blank");
    } else if (type === "email") {
      window.location.href = `mailto:${value}`;
    } else if (type === "phone") {
      window.location.href = `tel:${value}`;
    }
  };

  return (
    <main className="mt-20 bg-slate-50">
      {/* Hero Section */}
      <section
        className="relative min-h-[500px] md:min-h-[600px] flex items-center bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/travel_hero_panorama.webp')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 text-center">
          <h1 className="font-manrope font-bold text-4xl md:text-6xl mb-6">
            ¿Necesitás ayuda?
          </h1>
          <p className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-8">
            Estamos aquí para ayudarte a elegir el plan perfecto, resolver dudas sobre tu póliza o asistirte con cualquier consulta antes y durante tu viaje.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ContactAdvisorButton
              message={SUPPORT_ADVISOR_WHATSAPP_MESSAGE}
              className="bg-emerald-500 text-white hover:bg-emerald-600 px-10 py-4 rounded-lg font-bold text-lg transition-all shadow-lg inline-flex items-center justify-center gap-2 disabled:opacity-70"
              showChatIcon
            />
            <button
              onClick={scrollToQuoteWidget}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-10 py-4 rounded-lg font-bold text-lg transition-all border-2 border-white/50 inline-flex items-center justify-center gap-2"
            >
              <span>Cotizar mi viaje</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="bg-white py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="font-manrope font-bold text-3xl md:text-5xl text-slate-900 mb-4">
              Métodos de Contacto
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Elegí el canal que prefieras según tu ubicación y necesidad
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTACT_METHODS.map((method, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleContactClick(method)}
              >
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-all">
                  <span className="material-symbols-outlined text-4xl text-blue-600">
                    {method.icon}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {method.description}
                </p>
                <p className="text-blue-600 font-semibold group-hover:underline">
                  {method.action.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When to Contact Us */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-manrope font-bold text-3xl md:text-5xl text-slate-900 mb-4">
                ¿Cuándo contactarnos?
              </h2>
              <p className="text-lg text-slate-600">
                Estamos para ayudarte en estas situaciones:
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {USE_CASES.map((useCase, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-6 flex items-start gap-4 border border-slate-200 shadow-sm"
                >
                  <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-3xl text-emerald-600">
                      {useCase.icon}
                    </span>
                  </div>
                  <p className="text-slate-700 pt-2">{useCase.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-manrope font-bold text-3xl md:text-5xl text-slate-900 mb-4">
                Preguntas Frecuentes
              </h2>
              <p className="text-lg text-slate-600">
                Respuestas rápidas a las consultas más comunes
              </p>
            </div>
            <div className="space-y-4" ref={faqRef}>
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenFaq(openFaq === idx ? null : idx);
                    }}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-100 transition-all"
                  >
                    <span className="font-semibold text-slate-900 pr-4">
                      {faq.question}
                    </span>
                    <span
                      className={`material-symbols-outlined text-2xl text-slate-600 flex-shrink-0 transition-transform ${
                        openFaq === idx ? "rotate-180" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-200 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-slate-600 mb-4">
                ¿No encontraste lo que buscabas?
              </p>
              <ContactAdvisorButton
                message={SUPPORT_ADVISOR_WHATSAPP_MESSAGE}
                className="bg-emerald-500 text-white hover:bg-emerald-600 px-8 py-3 rounded-lg font-bold transition-all shadow-lg inline-flex items-center gap-2 disabled:opacity-70"
                showChatIcon
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="text-center p-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-5xl text-blue-600">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <FinalCTA />
    </main>
  );
}
