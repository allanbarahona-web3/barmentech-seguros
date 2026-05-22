import Image from "next/image";
import VideoCallModalCTA from "@/components/home/VideoCallModalCTA";

export default function WhyInsurance() {
  return (
    <section id="por-que-cotizar" className="py-24 px-6 md:px-12 max-w-[1280px] mx-auto">
      <div className="flex flex-col md:flex-row gap-16 items-center">
        <div className="w-full md:w-1/2">
          <Image
            src="/why-insurance-combined.webp"
            alt="Escenarios de viaje y asistencia medica"
            width={600}
            height={400}
            className="rounded-3xl shadow-lg h-[400px] w-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-headline-lg font-headline-lg text-primary">
            ¿Por que cotizar asistencia al viajero?
          </h2>
          <p className="text-body-md font-body-md text-neutral-600 leading-relaxed">
            Un imprevisto medico en el extranjero puede costar hasta 10 veces mas que tu viaje completo.
            Cotizar antes de viajar te permite elegir la cobertura adecuada para tu destino y dias.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary">check_circle</span>
              <span className="text-body-md font-medium text-primary">
                Servicio de videollamada medica para valoracion en tu idioma.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary">check_circle</span>
              <span className="text-body-md font-medium text-primary">
                Red hospitalaria global en más de 190 países.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary">check_circle</span>
              <span className="text-body-md font-medium text-primary">
                Repatriación sanitaria y traslado de familiares.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary">check_circle</span>
              <span className="text-body-md font-medium text-primary">
                Compensación por retrasos y cancelación de vuelos.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary">check_circle</span>
              <span className="text-body-md font-medium text-primary">
                Coberturas clave como preexistentes, equipaje protegido y asistencia por embarazo en viaje.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-emerald-700 font-label-md uppercase tracking-wider mb-2">
              Servicio destacado
            </p>
            <h3 className="text-xl md:text-2xl text-primary font-semibold">
              ¿Quieres saber mas de nuestro servicio de videollamada medica con Assist Card?
            </h3>
            <p className="text-slate-600 mt-2">
              Conoce como funciona la valoracion medica en tu idioma durante el viaje.
            </p>
          </div>

          <VideoCallModalCTA />
        </div>
      </div>
    </section>
  );
}
