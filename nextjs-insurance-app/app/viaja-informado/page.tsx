"use client";

import { useState, useRef, useEffect } from "react";
import { scrollToQuoteWidget } from "@/lib/scroll-to-quote";
import FinalCTA from "@/components/home/FinalCTA";

export const dynamic = "force-dynamic";

interface InfoTip {
  title: string;
  content: string;
}

interface InfoCategory {
  id: string;
  icon: string;
  title: string;
  description: string;
  tips: InfoTip[];
  color: string;
}

const INFO_CATEGORIES: InfoCategory[] = [
  {
    id: "requisitos",
    icon: "description",
    title: "Requisitos y Regulaciones",
    description: "Información sobre documentación, permisos y regulaciones internacionales",
    tips: [
      {
        title: "¿Qué es ETIAS?",
        content: "Es el nuevo sistema de autorización de viaje para el Espacio Schengen (Europa). Costará aproximadamente €7, tendrá validez de 3 años y se solicitará online antes de viajar. Lanzamiento previsto entre 2024-2025.",
      },
      {
        title: "Regla 90/180 días en Europa",
        content: "En el Espacio Schengen (27 países), podés permanecer máximo 90 días en cualquier período de 180 días. Esto aplica para turistas de países exentos de visa como Costa Rica.",
      },
      {
        title: "Validez del pasaporte",
        content: "La mayoría de países requieren que tu pasaporte tenga validez mínima de 6 meses desde la fecha de entrada. Europa específicamente requiere al menos 3 meses después de tu salida prevista.",
      },
      {
        title: "ESTA para Estados Unidos",
        content: "Si viajás a USA bajo el Programa de Exención de Visa, necesitás una autorización ESTA. Cuesta $21, es válida por 2 años y debe obtenerse antes del viaje a través del sitio oficial.",
      },
      {
        title: "Vacunas según destino",
        content: "Algunos países requieren vacunas específicas. La más común es fiebre amarilla para entrar a países de África y Sudamérica. Verificá siempre los requisitos sanitarios de tu destino.",
      },
      {
        title: "Cobertura médica obligatoria",
        content: "El Espacio Schengen, Cuba y otros países pueden exigir prueba de cobertura médica internacional al ingresar. Asegurate de llevar tu voucher o certificado de asistencia.",
      },
    ],
    color: "blue",
  },
  {
    id: "costos",
    icon: "local_hospital",
    title: "Costos Médicos y Riesgos",
    description: "Información sobre gastos médicos reales y la importancia de la cobertura",
    tips: [
      {
        title: "Ambulancia en Estados Unidos",
        content: "El costo de una ambulancia en USA puede variar entre $400 y $2,500 USD, con un promedio de $1,200. Sin cobertura, este gasto es de tu bolsillo y debe pagarse de contado.",
      },
      {
        title: "Visita a emergencias",
        content: "Una simple visita a la sala de emergencias en USA cuesta entre $1,500 y $3,000 USD sin seguro. Esto solo incluye la consulta inicial, sin procedimientos adicionales.",
      },
      {
        title: "Hospitalización por día",
        content: "Estar hospitalizado en Estados Unidos puede costar más de $10,000 USD por día. Una cirugía de emergencia puede superar fácilmente los $50,000 USD.",
      },
      {
        title: "Sin cobertura = Pago inmediato",
        content: "Sin seguro o asistencia de viaje, los hospitales en USA y otros países desarrollados requieren pago de contado o garantía bancaria antes de atenderte.",
      },
      {
        title: "Comparación de costos",
        content: "Mientras en Costa Rica una consulta médica privada cuesta $50-100, en USA la misma consulta puede costar $300-500. En Europa los costos son menores pero aún significativos para turistas.",
      },
    ],
    color: "red",
  },
  {
    id: "asistencia",
    icon: "support_agent",
    title: "Cómo Funciona la Asistencia",
    description: "Guías explicativas sobre el uso de tu cobertura de viaje",
    tips: [
      {
        title: "Diferencia entre asistencia y seguro",
        content: "La asistencia al viajero tiene una central que coordina y paga directamente a proveedores (hospitales, hoteles). El seguro tradicional te reembolsa después, tenés que pagar primero.",
      },
      {
        title: "Cómo usar tu voucher",
        content: "Tu voucher o certificado de asistencia contiene números de contacto de la central 24/7. Ante cualquier emergencia, llamás primero a estos números antes de acudir al hospital.",
      },
      {
        title: "Qué hacer en una emergencia médica",
        content: "Contactá inmediatamente a la central de asistencia. Ellos te indicarán el hospital más cercano en su red, coordinarán el pago directo y te asistirán en tu idioma.",
      },
      {
        title: "Central 24/7 en tu idioma",
        content: "Las principales asistencias al viajero operan 24 horas, 7 días a la semana, con atención en español y múltiples idiomas. No estás solo en una emergencia.",
      },
      {
        title: "Qué está cubierto",
        content: "Además de cobertura médica, la asistencia incluye: asistencia legal, pérdida de equipaje, cancelación de viaje, repatriación, vuelos de familiar en emergencia, y más según tu plan.",
      },
    ],
    color: "green",
  },
  {
    id: "consejos",
    icon: "tips_and_updates",
    title: "Consejos Prácticos para Viajeros",
    description: "Recomendaciones esenciales para proteger tu viaje",
    tips: [
      {
        title: "Copias de documentos",
        content: "Llevá copias físicas y digitales de tu pasaporte, visa, voucher de asistencia y reservas. Guardá copias en tu email y en la nube para acceso desde cualquier dispositivo.",
      },
      {
        title: "Fotografiar documentos importantes",
        content: "Tomá fotos de tu pasaporte, visa, tarjetas de crédito (frente) y voucher de asistencia. Envialas a tu propio email para tener respaldo en caso de pérdida o robo.",
      },
      {
        title: "Medicamentos y recetas",
        content: "Si llevás medicamentos, incluí las recetas médicas originales y en inglés. Algunos países requieren declaración de medicamentos controlados en migración.",
      },
      {
        title: "Lista de contactos de emergencia",
        content: "Guardá en tu teléfono: números de tu asistencia al viajero, embajada/consulado de tu país, contactos de familiares, números de bloqueo de tarjetas bancarias.",
      },
      {
        title: "Pérdida de equipaje",
        content: "Si tu equipaje no llega, reportalo inmediatamente en el aeropuerto antes de salir. Pedí el reporte oficial (PIR) y contactá tu asistencia al viajero dentro de las primeras 24 horas.",
      },
      {
        title: "Avisar al banco antes de viajar",
        content: "Notificá a tu banco las fechas y países que visitarás para evitar bloqueos de tus tarjetas por \"actividad sospechosa\". Llevá al menos dos tarjetas diferentes.",
      },
    ],
    color: "amber",
  },
  {
    id: "regiones",
    icon: "public",
    title: "Información por Región",
    description: "Guías específicas según tu destino de viaje",
    tips: [
      {
        title: "Europa: ETIAS y Schengen",
        content: "Los 27 países del Espacio Schengen requieren ETIAS próximamente. La cobertura médica mínima de €30,000 es obligatoria. Recordá la regla 90/180 días para turistas.",
      },
      {
        title: "Estados Unidos: Costos médicos altos",
        content: "USA tiene los costos médicos más altos del mundo. Una emergencia simple puede arruinar tus finanzas. Asistencia al viajero es esencial, no opcional. Necesitás ESTA si aplicás al programa de exención de visa.",
      },
      {
        title: "Asia: Requisitos sanitarios",
        content: "Muchos países asiáticos tienen requisitos sanitarios específicos (vacunas, pruebas médicas). La barrera del idioma puede ser desafiante en emergencias, por eso una asistencia 24/7 en español es crucial.",
      },
      {
        title: "Sudamérica: Altitud y reciprocidad",
        content: "Ciudades como La Paz (Bolivia) y Cusco (Perú) están a gran altura, lo que puede causar mal de altura. Argentina y Chile tienen tasas de reciprocidad para algunos países. Transporte terrestre puede ser largo.",
      },
      {
        title: "Cruceros: Evacuaciones costosas",
        content: "Las evacuaciones médicas desde un crucero (helicóptero o traslado a puerto) pueden costar más de $50,000 USD. Verificá que tu asistencia cubra cruceros específicamente.",
      },
    ],
    color: "purple",
  },
];

const DID_YOU_KNOW = [
  "Algunos países como Cuba y los del Espacio Schengen pueden solicitar prueba de cobertura médica internacional al ingresar",
  "Las facturas médicas son la principal causa de bancarrota personal en Estados Unidos. Una sola emergencia puede generar deudas de por vida",
  "ETIAS será obligatorio para ciudadanos de Costa Rica, Estados Unidos, Canadá y más de 60 países para ingresar a Europa a partir de su lanzamiento",
  "Una evacuación médica aérea internacional puede costar entre $25,000 y $100,000 USD. Tu seguro médico local NO cubre esto",
  "La mayoría de seguros de salud nacionales NO cubren emergencias médicas en el extranjero. Necesitás asistencia al viajero específica",
];

export default function ViajaInformado() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setSelectedCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getColorClasses = (color: string, variant: "bg" | "text" | "border" | "hover") => {
    const colorMap: Record<string, Record<string, string>> = {
      blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", hover: "hover:bg-blue-100" },
      red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", hover: "hover:bg-red-100" },
      green: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", hover: "hover:bg-emerald-100" },
      amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", hover: "hover:bg-amber-100" },
      purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", hover: "hover:bg-purple-100" },
    };
    return colorMap[color]?.[variant] || colorMap.blue[variant];
  };

  return (
    <main className="mt-20 bg-slate-50">
      {/* Hero Section */}
      <section 
        className="relative min-h-[500px] md:min-h-[600px] flex items-end bg-cover bg-center"
        style={{
          backgroundImage: "url('/viaja_informado_hero.webp')",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 pb-12 w-full">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={scrollToQuoteWidget}
              className="bg-emerald-500 text-white hover:bg-emerald-600 px-8 py-3 rounded-lg font-semibold transition-all shadow-lg"
            >
              Cotizar mi viaje
            </button>
            <a
              href="#categorias"
              className="bg-white/90 hover:bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold transition-all shadow-lg border border-white/20"
            >
              Explorar información
            </a>
          </div>
        </div>
      </section>

      {/* Trust Message */}
      <section className="bg-white py-8 border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
            <span className="material-symbols-outlined text-4xl text-blue-600">verified</span>
            <div>
              <p className="text-lg font-bold text-slate-800">
                Información verificable y actualizada
              </p>
              <p className="text-sm text-slate-600">
                Nuestro contenido se basa en fuentes oficiales y regulaciones vigentes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categorias" className="py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="font-manrope font-bold text-3xl md:text-4xl text-slate-900 mb-4">
              Categorías de Información
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explorá nuestra base de conocimiento organizada por temas relevantes para tu viaje
            </p>
          </div>

          <div ref={categoriesRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {INFO_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className={`${getColorClasses(category.color, "bg")} ${getColorClasses(category.color, "border")} border-2 rounded-xl p-6 transition-all cursor-pointer ${getColorClasses(category.color, "hover")} ${
                  selectedCategory === category.id ? "ring-4 ring-offset-2 ring-blue-500" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCategory(selectedCategory === category.id ? null : category.id);
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`${getColorClasses(category.color, "text")} flex-shrink-0`}>
                    <span className="material-symbols-outlined text-4xl">{category.icon}</span>
                  </div>
                  <div>
                    <h3 className={`font-bold text-xl mb-2 ${getColorClasses(category.color, "text")}`}>
                      {category.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {category.description}
                    </p>
                  </div>
                </div>

                {selectedCategory === category.id && (
                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                    {category.tips.map((tip, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                        <p className={`text-sm font-bold mb-2 ${getColorClasses(category.color, "text")}`}>
                          {tip.title}
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {tip.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Did You Know Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-16">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="material-symbols-outlined text-5xl text-amber-600 mb-4">lightbulb</span>
            <h2 className="font-manrope font-bold text-3xl text-slate-900 mb-2">
              ¿Sabías que...?
            </h2>
            <p className="text-slate-600">Datos importantes que todo viajero debería conocer</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DID_YOU_KNOW.map((fact, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all border border-amber-200"
              >
                <div className="flex gap-3">
                  <span className="text-amber-600 text-2xl flex-shrink-0">💡</span>
                  <p className="text-slate-700 text-sm leading-relaxed">{fact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="bg-white py-12 border-t border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-slate-400 mt-1">info</span>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Nota Importante
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  La información presentada puede variar según el país, regulaciones vigentes 
                  y condiciones migratorias al momento del viaje. Se recomienda verificar 
                  siempre con fuentes oficiales antes de tomar decisiones de viaje.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <FinalCTA />
    </main>
  );
}
