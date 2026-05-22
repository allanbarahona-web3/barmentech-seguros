import {
  Baby,
  CalendarX2,
  Dumbbell,
  HeartPulse,
  Luggage,
  PawPrint,
} from "lucide-react";

export default function TrustBadges() {
  const badges = [
    {
      icon: PawPrint,
      title: "Cobertura mascotas",
      priceFrom: "Desde $2.26 por dia",
    },
    {
      icon: HeartPulse,
      title: "Preexistentes",
      priceFrom: "Desde $56.50 por viaje",
    },
    {
      icon: Luggage,
      title: "Equipaje protegido",
      priceFrom: "Desde $19.21 por viaje",
    },
    {
      icon: Dumbbell,
      title: "Deportes",
      priceFrom: "Desde $5.65 por dia",
    },
    {
      icon: Baby,
      title: "Embarazo",
      priceFrom: "Desde $113 por viaje",
    },
    {
      icon: CalendarX2,
      title: "Cancelacion viaje",
      priceFrom: "Desde $16.95 por viaje",
    },
  ];

  return (
    <section className="bg-surface-container-low py-12 border-y border-slate-100">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center space-y-3 rounded-2xl px-3 py-2 transition-all duration-300 hover:bg-white hover:shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-800 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
                <badge.icon className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <span className="text-label-md font-label-md text-primary">
                {badge.title}
              </span>
              <span className="text-[12px] leading-tight font-extrabold text-rose-600 tracking-wide opacity-100 md:opacity-0 md:-translate-y-1 transition-all duration-300 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                {badge.priceFrom}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
