import Image from "next/image";
import Link from "next/link";

export default function BenefitsBento() {
  return (
    <section className="py-24 bg-surface-container-low px-8">
      <div className="container-max mx-auto max-w-[1280px]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="max-w-xl">
            <span className="text-secondary font-label-md tracking-widest uppercase">
              Coberturas destacadas
            </span>
            <h2 className="font-headline-lg text-4xl mt-2">
              Protecciones que marcan la diferencia
            </h2>
          </div>
          <Link
            href="/servicios-adicionales"
            className="text-primary font-label-md flex items-center gap-2 hover:underline"
          >
            Ver coberturas adicionales
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Equipaje Digital */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 premium-shadow flex flex-col md:flex-row gap-8 items-center border border-slate-100">
            <div className="flex-1 space-y-4">
              <h3 className="font-headline-md text-2xl">
                Protección de Equipaje Digital
              </h3>
              <p className="text-slate-500 font-body-md">
                Cobertura especial para laptops, cámaras y dispositivos móviles. No
                pierdas tu oficina móvil mientras viajas.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-secondary font-label-sm">
                  <span className="material-symbols-outlined text-[18px]">
                    check_circle
                  </span>
                  Cobertura contra robo
                </li>
                <li className="flex items-center gap-2 text-secondary font-label-sm">
                  <span className="material-symbols-outlined text-[18px]">
                    check_circle
                  </span>
                  Sin límite de edad
                </li>
                <li className="flex items-center gap-2 text-secondary font-label-sm">
                  <span className="material-symbols-outlined text-[18px]">
                    check_circle
                  </span>
                  Hasta $1,000.00 de protección
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden">
              <Image
                src="/mobile_devices_coverage.webp"
                alt="Cobertura para equipo electronico en viaje"
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Enfermedades preexistentes */}
          <div className="bg-primary rounded-3xl p-8 text-white flex flex-col justify-between border border-white/10">
            <div className="w-full h-40 rounded-2xl overflow-hidden mb-6">
              <Image
                src="/preexisting_conditions_vertical.webp"
                alt="Asistencia para enfermedades preexistentes o cronicas"
                width={500}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="material-symbols-outlined text-4xl text-secondary-200">
              ecg_heart
            </span>
            <div>
              <h3 className="font-headline-md text-2xl mb-4">Enfermedades preexistentes o crónicas</h3>
              <p className="text-primary-100 text-sm leading-relaxed">
                Asistencia médica por complicaciones durante el viaje con coberturas
                de hasta $250,000 según plan.
              </p>
            </div>
          </div>

          {/* Cobertura Mínima */}
          <div className="bg-white rounded-3xl p-8 premium-shadow border border-slate-100 flex flex-col justify-center text-center">
            <div className="text-5xl font-bold text-primary mb-2">$150k</div>
            <p className="text-slate-500 font-label-md">Cobertura mínima recomendada</p>
          </div>

          {/* Deportes de Aventura */}
          <div className="md:col-span-2 bg-secondary-100 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3 aspect-video rounded-2xl overflow-hidden bg-white/20 backdrop-blur-md">
              <Image
                src="/adventure_sports_hero.webp"
                alt="Cobertura para deportes de aventura"
                width={300}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-neutral-900">
              <h3 className="font-headline-md text-2xl mb-2">
                Deportes de Aventura
              </h3>
              <p className="opacity-80 mb-4">
                Esquí, buceo o trekking. Tu pasión está cubierta sin importar el
                terreno.
              </p>
              <p className="text-sm font-semibold text-primary">
                Planes desde $5.65 por día y hasta $30,000 de cobertura.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
