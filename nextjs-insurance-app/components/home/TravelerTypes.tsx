"use client";

import { scrollToQuoteWidget } from "@/lib/scroll-to-quote";

const COVERAGE_PROFILES = [
  {
    title: "Familias",
    icon: "family_restroom",
    coverages: [
      "Asistencia medica internacional por accidente o enfermedad no preexistente.",
      "Acompanamiento de menores y traslado de familiar cuando aplica por evento medico.",
      "Asistencia en embarazo para emergencias de viaje, segun edad gestacional y plan.",
      "Soporte por demora o extravio de equipaje y asistencia por documentos.",
    ],
  },
  {
    title: "Viajero individual",
    icon: "person",
    coverages: [
      "Asistencia medica 24/7 con coordinacion internacional en destino.",
      "Repatriacion sanitaria y traslados de emergencia cuando son requeridos.",
      "Accidentes personales, incluyendo cobertura por muerte accidental.",
      "Asistencia legal y adelanto para fianzas ante accidentes cubiertos.",
    ],
  },
  {
    title: "Estudiantes",
    icon: "school",
    coverages: [
      "Asistencia medica internacional para imprevistos durante la estadia academica.",
      "Atencion por especialistas y medicamentos de asistencia ambulatoria segun tope.",
      "Asistencia por robo o extravio de documentos de viaje.",
      "Respaldo ante interrupcion de viaje o regreso anticipado por emergencia.",
    ],
  },
  {
    title: "Grupos",
    icon: "groups",
    coverages: [
      "Cobertura para incidentes medicos en itinerarios compartidos.",
      "Practica de deportes recreativos, sujeta a alcances del plan contratado.",
      "Asistencia ante demoras de viaje y contingencias operativas del trayecto.",
      "Asistencia legal coordinada frente a eventos con terceros.",
    ],
  },
  {
    title: "Negocios",
    icon: "business_center",
    highlight: false,
    coverages: [
      "Asistencia medica y repatriacion para continuidad del viaje laboral.",
      "Respaldo por cancelacion o interrupcion de viaje por eventos cubiertos.",
      "Accidentes personales con cobertura por muerte accidental e invalidez total permanente.",
      "Responsabilidad civil y soporte legal ante eventos con terceros.",
    ],
  },
  {
    title: "Complementario",
    icon: "verified",
    highlight: true,
    coverages: [
      "Muerte accidental 24 hs: hasta USD 60,000.",
      "Invalidez total y permanente: hasta USD 40,000.",
      "Responsabilidad maxima por accidente con mas de un titular: hasta USD 2,500,000.",
      "Cancelacion o interrupcion por fuerza mayor: hasta USD 500 y hasta USD 25,000 por evento multiple.",
    ],
  },
];

export default function TravelerTypes() {
  return (
    <section id="coberturas" className="py-24 bg-white scroll-mt-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <p className="font-label-md text-secondary uppercase tracking-wider">Coberturas reales por perfil</p>
          <h2 className="text-headline-lg font-headline-lg text-primary">
            Elige tu viaje con coberturas clave, no con promesas genericas
          </h2>
          <p className="text-body-md font-body-md text-neutral-600 leading-relaxed">
            Estas coberturas reflejan beneficios reales del producto para que identifiques rapido
            el respaldo que necesitas antes de cotizar.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COVERAGE_PROFILES.map((profile, index) => (
            <article
              key={profile.title}
              className={`rounded-3xl border p-7 premium-shadow premium-shadow-hover transition-all ${
                profile.highlight
                  ? "md:col-span-2 lg:col-span-3 border-secondary/30 bg-gradient-to-r from-emerald-50 to-white"
                  : "border-slate-200 bg-white"
              } ${index === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              {profile.highlight && (
                <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-semibold mb-4">
                  Cobertura complementaria
                </span>
              )}
              <div className="flex items-center gap-3 mb-5">
                <span className={`material-symbols-outlined text-3xl ${profile.highlight ? "text-emerald-600" : "text-secondary"}`}>
                  {profile.icon}
                </span>
                <h3 className="text-xl text-primary font-semibold">{profile.title}</h3>
              </div>
              <ul className="space-y-3">
                {profile.coverages.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-slate-700 text-sm leading-relaxed">
                    <span className="material-symbols-outlined text-secondary text-lg mt-0.5">check_circle</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 text-sm text-slate-700">
          Coberturas, topes, edades y condiciones sujetos al plan contratado y condiciones generales vigentes.
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={scrollToQuoteWidget}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-white font-label-md shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all cursor-pointer"
          >
            Cotizar mi cobertura
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
}
