import Image from "next/image";
import QuickQuoteWidget from "@/components/plans/QuickQuoteWidget";
import BenefitsBento from "@/components/plans/BenefitsBento";
import DestinationsGrid from "@/components/plans/DestinationsGrid";
import TrustBadges from "@/components/home/TrustBadges";
import WhyInsurance from "@/components/home/WhyInsurance";
import TravelerTypes from "@/components/home/TravelerTypes";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import FinalCTA from "@/components/home/FinalCTA";
import HeroCtaButtons from "@/components/home/HeroCtaButtons";
import QuoteModalHost from "@/components/home/QuoteModalHost";

// Force dynamic rendering for tenant-specific data
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="mt-20">
      <QuoteModalHost />
      <section className="relative min-h-[500px] flex items-center overflow-hidden bg-primary py-20">
        <div className="absolute inset-0 opacity-70">
          <Image
            src="/travel_hero_panorama.webp"
            alt="Panorama de viaje con asistencia al viajero"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/24 to-transparent"></div>

        <div className="container-max mx-auto px-8 relative z-10 max-w-[1280px]">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-primary-100 font-label-md mb-6">
              <span className="w-12 h-[1px] bg-secondary-200"></span>
              EXPLORA SIN LIMITES
            </div>
            <h1 className="text-white font-headline-xl text-5xl md:text-6xl leading-tight mb-8">
              Cotiza tu cobertura internacional o nacional para cada viaje
            </h1>
            <p className="text-primary-100 font-body-lg mb-10 opacity-90">
              Calcula tu asistencia al viajero para viajes internacionales y domesticos.
              Sin planes de suscripcion, 100% digital y con respaldo inmediato.
            </p>

            <HeroCtaButtons />
          </div>
        </div>
      </section>

      <QuickQuoteWidget />
      <TrustBadges />
      <WhyInsurance />
      <BenefitsBento />
      <TravelerTypes />
      <DestinationsGrid />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
