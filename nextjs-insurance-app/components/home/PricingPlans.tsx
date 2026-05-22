import Link from "next/link";

export default function PricingPlans() {
  const plans = [
    {
      badge: "Esencial",
      name: "Básico",
      price: "$35",
      period: "/semana",
      features: [
        { text: "Asistencia $50,000", included: true },
        { text: "Odontología urgencia", included: true },
        { text: "Seguro de tecnología", included: false }
      ],
      buttonText: "Seleccionar",
      buttonStyle: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
      popular: false
    },
    {
      badge: "Viajero Pro",
      name: "Plus",
      price: "$59",
      period: "/semana",
      features: [
        { text: "Asistencia $150,000", included: true, bold: true },
        { text: "Equipaje hasta $1,200", included: true },
        { text: "Cancelación incluida", included: true }
      ],
      buttonText: "Seleccionar Plus",
      buttonStyle: "bg-secondary text-white hover:brightness-110 shadow-lg shadow-emerald-500/30",
      popular: true
    },
    {
      badge: "Sin Límites",
      name: "Premium",
      price: "$95",
      period: "/semana",
      features: [
        { text: "Asistencia $500,000", included: true },
        { text: "Tech & Gear protection", included: true },
        { text: "VIP Lounge Access", included: true }
      ],
      buttonText: "Seleccionar Premium",
      buttonStyle: "bg-white text-primary hover:bg-slate-100",
      dark: true
    }
  ];

  return (
    <section id="cotizar" className="py-24 bg-surface-container">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-headline-lg font-headline-lg text-primary">
            Encuentra tu Plan Ideal
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`${
                plan.dark ? "bg-primary text-white" : "bg-white"
              } p-8 rounded-[2rem] ${
                plan.popular ? "shadow-xl ring-4 ring-emerald-500/20" : "shadow-sm"
              } relative overflow-hidden`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-6 py-2 rounded-bl-2xl text-xs font-bold uppercase tracking-tighter">
                  Más Popular
                </div>
              )}

              <h4
                className={`text-label-md font-label-md uppercase tracking-widest mb-4 ${
                  plan.dark
                    ? "text-primary-fixed-dim"
                    : plan.popular
                    ? "text-emerald-600"
                    : "text-slate-500"
                }`}
              >
                {plan.badge}
              </h4>
              <h3
                className={`text-headline-lg font-headline-lg ${
                  plan.dark ? "text-white" : "text-primary"
                }`}
              >
                {plan.name}
              </h3>

              <div className="my-6">
                <span
                  className={`text-headline-xl font-headline-xl ${
                    plan.dark ? "text-white" : "text-primary"
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-body-md ${
                    plan.dark ? "text-primary-200" : "text-slate-500"
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className={`flex items-center gap-2 text-body-sm ${
                      feature.included
                        ? plan.dark
                          ? "text-white"
                          : (feature as any).bold
                          ? "font-semibold"
                          : ""
                        : "text-slate-400 line-through"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-lg ${
                        feature.included
                          ? plan.dark
                            ? "text-emerald-400"
                            : "text-secondary"
                          : ""
                      }`}
                    >
                      {feature.included ? "check" : "close"}
                    </span>
                    {feature.text}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 rounded-2xl font-bold transition-all ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/plans"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            Ver comparación completa de planes
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
