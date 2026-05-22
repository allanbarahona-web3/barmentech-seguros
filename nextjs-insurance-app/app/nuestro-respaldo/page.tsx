"use client";

import { scrollToQuoteWidget } from "@/lib/scroll-to-quote";
import FinalCTA from "@/components/home/FinalCTA";

export const dynamic = "force-dynamic";

interface Stat {
  icon: string;
  value: string;
  label: string;
}

interface Feature {
  icon: string;
  title: string;
}

const STATS: Stat[] = [
  {
    icon: "public",
    value: "190+",
    label: "Países con cobertura",
  },
  {
    icon: "schedule",
    value: "24/7/365",
    label: "Atención permanente",
  },
  {
    icon: "calendar_today",
    value: "1972",
    label: "Fundada en Suiza",
  },
  {
    icon: "groups",
    value: "Millones",
    label: "De viajeros asistidos",
  },
];

const INFRASTRUCTURE: Feature[] = [
  {
    icon: "business",
    title: "Centros regionales de asistencia",
  },
  {
    icon: "translate",
    title: "Coordinadores multilingües especializados",
  },
  {
    icon: "support_agent",
    title: "Atención permanente 24/7",
  },
  {
    icon: "network_check",
    title: "Red internacional de prestadores calificados",
  },
];

export default function NuestroRespaldo() {
  return (
    <main className="mt-20 bg-slate-50">
      {/* Hero Section */}
      <section 
        className="relative min-h-[500px] md:min-h-[600px] flex items-center bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/respaldo_internacional_hero.webp')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span className="text-sm font-medium">Respaldo Internacional</span>
          </div>
          <h1 className="font-manrope font-bold text-4xl md:text-6xl mb-6">
            Respaldados Internacionalmente
          </h1>
          <p className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-8">
            Trabajamos junto a Assist Card para brindarte protección y asistencia global las 24 horas del día, los 365 días del año.
          </p>
          <button
            onClick={scrollToQuoteWidget}
            className="bg-emerald-500 text-white hover:bg-emerald-600 px-10 py-4 rounded-lg font-bold text-lg transition-all shadow-lg inline-flex items-center gap-2"
          >
            <span>Cotizar mi viaje</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl text-blue-600">
                    {stat.icon}
                  </span>
                </div>
                <p className="font-manrope font-bold text-3xl text-blue-900 mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-600">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Assist Card */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-10 md:p-12 shadow-lg border border-slate-200">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 bg-blue-50 px-5 py-3 rounded-full mb-6">
                  <span className="material-symbols-outlined text-blue-600">shield</span>
                  <span className="font-bold text-blue-900">Assist Card</span>
                </div>
                <h2 className="font-manrope font-bold text-3xl md:text-4xl text-slate-900 mb-6">
                  Más de 50 años de experiencia
                </h2>
              </div>
              
              <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
                <p>
                  En <span className="font-bold text-blue-900">Barmentech Seguros</span> trabajamos junto a <span className="font-bold text-blue-900">Assist Card</span>, compañía fundada en Suiza en 1972 y reconocida internacionalmente por su trayectoria en asistencia al viajero y cobertura global.
                </p>
                <p>
                  Actualmente, Assist Card brinda atención y soporte en <span className="font-bold text-blue-900">más de 190 países</span>, ofreciendo asistencia las <span className="font-bold text-emerald-600">24 horas del día, los 365 días del año</span>.
                </p>
                <p>
                  Gracias a este respaldo internacional, en Barmentech Seguros podemos ofrecer soluciones de asistencia y cobertura para viajeros nacionales e internacionales con soporte global y atención especializada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="bg-white py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="font-manrope font-bold text-3xl md:text-5xl text-slate-900 mb-4">
              Infraestructura Internacional
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Una red global de atención y soporte para viajeros en todo el mundo
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {INFRASTRUCTURE.map((feature, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 flex items-start gap-4 border border-blue-200"
              >
                <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl text-white">
                    {feature.icon}
                  </span>
                </div>
                <p className="text-lg font-semibold text-slate-900 pt-3">
                  {feature.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Types of Trips */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-manrope font-bold text-3xl md:text-5xl text-slate-900 mb-6">
              Cobertura para Todo Tipo de Viajes
            </h2>
            <p className="text-lg text-slate-700 mb-8">
              Ya sea para:
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                "Vacaciones internacionales",
                "Turismo dentro de Costa Rica",
                "Viajes de negocios",
                "Escapadas de fin de semana",
                "Playa",
                "Montaña",
                "Tours",
                "Aventura",
                "Viajes frecuentes",
              ].map((type, idx) => (
                <span
                  key={idx}
                  className="bg-white text-slate-700 px-5 py-3 rounded-full text-sm font-medium shadow-sm border border-slate-200 hover:shadow-md transition-all"
                >
                  {type}
                </span>
              ))}
            </div>
            <p className="text-lg text-slate-700">
              Contar con asistencia adecuada puede ayudarte a viajar con mayor tranquilidad y respaldo ante cualquier imprevisto.
            </p>
          </div>
        </div>
      </section>

      {/* 24/7 Assistance */}
      <section className="bg-white py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-10 md:p-12 border border-emerald-200">
              <div className="text-center mb-8">
                <div className="bg-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="material-symbols-outlined text-5xl text-white">
                    schedule
                  </span>
                </div>
                <h2 className="font-manrope font-bold text-3xl md:text-4xl text-slate-900 mb-6">
                  Asistencia Global 24/7
                </h2>
              </div>
              
              <div className="space-y-6 text-lg text-slate-700 leading-relaxed text-center">
                <p>
                  La asistencia al viajero no debería depender del horario ni del país donde te encontrés.
                </p>
                <p className="font-semibold text-emerald-900">
                  Por eso, Assist Card mantiene atención permanente las 24 horas del día, permitiendo gestionar emergencias médicas y diferentes situaciones relacionadas con el viaje desde múltiples destinos alrededor del mundo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <span className="material-symbols-outlined text-6xl text-blue-600 mb-6">flight_takeoff</span>
            <h2 className="font-manrope font-bold text-3xl md:text-5xl text-slate-900 mb-6">
              Viajá con Mayor Tranquilidad
            </h2>
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
              <p>
                En Barmentech Seguros creemos que viajar protegido significa viajar con mayor confianza, respaldo y preparación ante cualquier eventualidad.
              </p>
              <p className="font-semibold text-blue-900">
                Por eso trabajamos junto a una compañía con experiencia internacional y presencia global para ayudarte a disfrutar cada viaje con mayor tranquilidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <FinalCTA />
    </main>
  );
}
