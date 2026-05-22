import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="px-6 md:px-12 py-12 md:py-20 max-w-[1280px] mx-auto overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-headline-xl font-headline-xl text-primary">
            Viaja protegido con seguros internacionales desde Costa Rica
          </h1>
          <p className="text-body-lg font-body-lg text-neutral-600 max-w-lg">
            Protección integral diseñada para nómadas digitales y viajeros frecuentes. 
            Sin complicaciones, 100% digital y con respaldo global inmediato.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-primary text-white px-8 py-4 rounded-xl font-manrope font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
              Cotizar ahora
            </button>
            <button className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-manrope font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">chat</span>
              Hablar por WhatsApp
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-3xl"></div>
          <Image
            src="/travel_hero_panorama.webp"
            alt="Panorama de viaje internacional"
            width={600}
            height={450}
            className="relative rounded-3xl shadow-2xl w-full h-[450px] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
