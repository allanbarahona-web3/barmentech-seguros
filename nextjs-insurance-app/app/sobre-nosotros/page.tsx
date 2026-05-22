"use client";

import { scrollToQuoteWidget } from "@/lib/scroll-to-quote";
import FinalCTA from "@/components/home/FinalCTA";

export const dynamic = "force-dynamic";

interface ServiceCard {
  icon: string;
  title: string;
  description: string;
}

interface ValueCard {
  icon: string;
  title: string;
  description: string;
}

const SERVICES: ServiceCard[] = [
  {
    icon: "location_on",
    title: "Cobertura Nacional",
    description: "Opciones de asistencia para viajes dentro de Costa Rica, incluyendo escapadas, turismo local, playa, montaña, tours y actividades recreativas.",
  },
  {
    icon: "public",
    title: "Cobertura Internacional",
    description: "Protección y asistencia para viajeros en múltiples destinos alrededor del mundo.",
  },
  {
    icon: "support_agent",
    title: "Atención Personalizada",
    description: "Acompañamiento antes y durante el viaje para ayudarte a elegir la opción más adecuada según tu destino y necesidades.",
  },
  {
    icon: "receipt_long",
    title: "Emisión Digital Rápida",
    description: "Entrega digital de voucher y documentación de viaje de manera rápida y sencilla.",
  },
];

const VALUES: ValueCard[] = [
  {
    icon: "verified",
    title: "Confianza",
    description: "Buscamos construir relaciones claras y transparentes con cada viajero.",
  },
  {
    icon: "favorite",
    title: "Cercanía",
    description: "Nos enfocamos en brindar atención humana y acompañamiento personalizado.",
  },
  {
    icon: "shield",
    title: "Responsabilidad",
    description: "Entendemos la importancia de viajar respaldado ante cualquier eventualidad.",
  },
  {
    icon: "lightbulb",
    title: "Innovación",
    description: "Creemos en herramientas digitales y procesos modernos para facilitar la experiencia del viajero.",
  },
];

export default function SobreNosotros() {
  return (
    <main className="mt-20 bg-slate-50">
      {/* Hero Section */}
      <section 
        className="relative min-h-[500px] md:min-h-[600px] flex items-center bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/sobre_nosotros_hero.webp')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 text-center">
          <h1 className="font-manrope font-bold text-4xl md:text-6xl mb-6">
            Viajá respaldado, estés donde estés.
          </h1>
          <p className="text-lg md:text-xl text-white mb-4 max-w-3xl mx-auto">
            Protección y asistencia para viajes dentro y fuera de Costa Rica.
          </p>
          <p className="text-base md:text-lg text-white max-w-3xl mx-auto mb-8">
            Viajar debería sentirse emocionante, no riesgoso. En Barmentech Seguros ayudamos a viajeros a contar con respaldo y asistencia antes, durante y después de cada viaje, ya sea dentro del país o alrededor del mundo.
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

      {/* Quiénes Somos */}
      <section className="bg-white py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-manrope font-bold text-3xl md:text-5xl text-slate-900 mb-6">
              Quiénes Somos
            </h2>
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
              <p>
                Somos una empresa costarricense enfocada en protección y asistencia para viajeros nacionales e internacionales.
              </p>
              <p>
                Nacimos con la idea de crear una experiencia más moderna, clara y accesible para las personas que desean viajar con mayor tranquilidad y respaldo.
              </p>
              <p>
                Entendemos que cada viaje es diferente y que contar con asistencia adecuada puede marcar una gran diferencia ante cualquier imprevisto.
              </p>
              <p>
                Por eso buscamos ofrecer atención cercana, procesos simples y acompañamiento personalizado para ayudarte a viajar con más confianza.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Qué Hacemos */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="font-manrope font-bold text-3xl md:text-5xl text-slate-900 mb-4">
              Qué Hacemos
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all border border-slate-200"
              >
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-3xl text-blue-600">
                    {service.icon}
                  </span>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuestro Respaldo */}
      <section className="bg-white py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-6">
              <span className="material-symbols-outlined text-blue-600">verified_user</span>
              <span className="text-sm font-semibold text-blue-900">Respaldo Internacional</span>
            </div>
            <h2 className="font-manrope font-bold text-3xl md:text-5xl text-slate-900 mb-6">
              Nuestro Respaldo
            </h2>
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
              <p className="font-semibold text-xl text-blue-900">
                Respaldados internacionalmente
              </p>
              <p>
                Trabajamos junto a <span className="font-bold text-blue-900">Assist Card</span>, compañía reconocida internacionalmente por su trayectoria en asistencia al viajero y cobertura global.
              </p>
              <p>
                Su red internacional de atención y soporte permite brindar respaldo ante emergencias médicas e imprevistos durante el viaje en distintos destinos alrededor del mundo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Por Qué Viajar Protegido */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-manrope font-bold text-3xl md:text-5xl text-slate-900 mb-6 text-center">
              Por Qué Viajar Protegido
            </h2>
            <p className="text-lg text-slate-700 mb-8 text-center">
              Viajar puede traer experiencias increíbles, pero también situaciones inesperadas:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Emergencias médicas",
                "Retrasos de vuelos",
                "Pérdida de equipaje",
                "Cancelaciones",
                "Accidentes",
                "Gastos imprevistos",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-4 shadow-sm border border-blue-200 flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-blue-600">check_circle</span>
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-lg text-slate-700 mt-8 text-center">
              Contar con asistencia adecuada puede ayudarte a enfrentar este tipo de situaciones con mayor tranquilidad y respaldo.
            </p>
          </div>
        </div>
      </section>

      {/* Para Todo Tipo de Viajes */}
      <section className="bg-white py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-manrope font-bold text-3xl md:text-5xl text-slate-900 mb-6">
              Para Todo Tipo de Viajes
            </h2>
            <p className="text-lg text-slate-700 mb-8">
              Ya sea para:
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                "Vacaciones internacionales",
                "Turismo dentro de Costa Rica",
                "Viajes de negocios",
                "Escapadas de fin de semana",
                "Playa",
                "Montaña",
                "Tours",
                "Viajes frecuentes",
              ].map((type, idx) => (
                <span
                  key={idx}
                  className="bg-blue-50 text-blue-900 px-4 py-2 rounded-full text-sm font-medium border border-blue-200"
                >
                  {type}
                </span>
              ))}
            </div>
            <p className="text-lg text-slate-700">
              En Barmentech Seguros buscamos ayudarte a viajar con mayor tranquilidad y confianza.
            </p>
          </div>
        </div>
      </section>

      {/* Nuestra Visión */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <span className="material-symbols-outlined text-5xl text-blue-600 mb-6">visibility</span>
            <h2 className="font-manrope font-bold text-3xl md:text-5xl text-slate-900 mb-6">
              Nuestra Visión
            </h2>
            <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
              <p>
                Queremos convertirnos en una opción confiable para viajeros que buscan protección, atención cercana y una experiencia moderna antes de cada viaje.
              </p>
              <p>
                Creemos en procesos simples, comunicación clara y acompañamiento real para quienes desean viajar con mayor seguridad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="bg-white py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="font-manrope font-bold text-3xl md:text-5xl text-slate-900 mb-4">
              Nuestros Valores
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-xl p-8 text-center hover:shadow-md transition-all border border-slate-200"
              >
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <span className="material-symbols-outlined text-3xl text-white">
                    {value.icon}
                  </span>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {value.description}
                </p>
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
