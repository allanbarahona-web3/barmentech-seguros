"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function DestinationsGrid() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const destinations = [
    {
      name: "Europa",
      teaser: "ETIAS y requisitos Schengen desde 2027.",
      fact:
        "A partir de 2027, muchos viajeros latinoamericanos deberan tramitar ETIAS para ingresar al Espacio Schengen, incluso si hoy no requieren visa. En varios paises europeos tambien pueden solicitar seguro de viaje valido, cobertura medica minima de EUR 30,000, fondos para la estadia y tiquete de salida.",
      note: "La atencion medica privada puede superar EUR 500 a EUR 3,000 segun pais y emergencia.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA2x_LlrIxyXShL-D_rAobzsV8gP1GvC1zkwMSH2F522skftY7v07ZTGulmcn9v66LDKxTAP-eCBXesA6ykXlKjHh4KQc5sjp49Ln2h5tf_2Cf3fKKLduNciV2HVcBlb7jKAcnfafIVC3kg9FsfxY5bKVvZe85gP7i4YpMSt40_MNPI9NGGDaiDZ5ebRD_lnxABlwV-okNKBdGU4nl6QWrcjb0Qy6XjM3-M74_4HCGF7r_3YO7krg3LZSHVyy_rvBUk_k3LFyM2Ktpu",
      ctaLabel: "Cotiza hoy",
    },
    {
      name: "Asia",
      teaser: "Barrera idiomatica y pagos medicos inmediatos.",
      fact:
        "En destinos como Japon, Corea del Sur, China o Tailandia, gran parte de la atencion medica privada funciona en ingles o idioma local. Algunos hospitales exigen pago inmediato antes de atender y las ambulancias privadas pueden ser costosas.",
      note: "Una consulta privada para turistas en Japon puede superar USD 100 a USD 300.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCrwH_2Su7T1qyecKoepBnyoemX2UjEGljb1cQIGwgs4HRMzDpSCf3rTn50yEGC4hHEJIGgi50wUm4ScT5b40SwoiM65I89h2Ks4nejARMf1wvNqp7PXGVAUH4qld47xfbzwsvC_3cFiW6153l7GpYkendTI9RLN7BQuIDUQT8B-LxrdHBcjaZ4Jfwy7-5SIt7DUFG7D5Irmc-g90x-LOS_h7YEC5cPFNfo5Vi0nCWRPc-2Sl3yBD0cDUQ8Y1Us9m9fl_PsvHOXqKJG",
      ctaLabel: "Cotiza hoy",
    },
    {
      name: "EE.UU.",
      teaser: "Uno de los sistemas medicos mas caros del mundo.",
      fact:
        "Estados Unidos tiene uno de los sistemas medicos mas costosos para turistas internacionales. Una consulta puede costar USD 150-500, sala de emergencias USD 1,000-5,000+, ambulancia USD 500-2,000 y hospitalizacion miles de dolares por dia.",
      note: "Una emergencia menor puede convertirse rapidamente en un gasto muy alto sin asistencia.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBo683sBGHSHuhGlgoyBU4bDSNTKRILpGAJTHq6sBLMDMZLsJ6G5IzHY4jjkule7EntTsgqq1HwQOxEcg8U2LuZKqmOMTejTQhTQpOvZu-foYb_5QC1sMrCtYWixwog-oxOWllibsXENHE3d_tQJnW-SS5MbZsrMTnFPcdLBv0vjgVi7PUTmssgWsNs7b4M5dzIWoLl2L4yhKlP5XlKcwxPOHNFnuUaZboNueF_oC_Oxh_HTvkOBX-o8GjlY-K4fyEYPci0hS0zZxZE",
      ctaLabel: "Cotiza hoy",
    },
    {
      name: "Oceanía",
      teaser: "Rescates y traslados costosos en zonas remotas.",
      fact:
        "Australia y Nueva Zelanda tienen grandes distancias entre ciudades y muchas zonas naturales alejadas. En algunos casos, los rescates requieren transporte aereo y varias excursiones solicitan cobertura especifica.",
      note: "Las evacuaciones medicas en actividades maritimas o de aventura pueden costar miles de dolares.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCkPW4anTkHHo4xsHrg84jz6q8mdIh_dZDL_Rfi-CFvvoYPGJU38Nmnt-GG8qx474dKW_j-dVhi5Q_tCNpz8aTYcK_MD2zbccuFXR3I7OjVr-dvH_m6dWrkL1EwEzOnx8LQsxQ6Pz9_pX2Sljbwy1d8RNQze0cz2Zvb3xQfLTxV-3b8DkSQbKv2W1_f-LiGCAMCleVVfL8RyoYnULizhv_Zqu_xFzQR3xN6D8xGs3YXSXSnNM1c5qzjZxZh2zQFD5CSSwJlk5xli--_",
      ctaLabel: "Cotiza hoy",
    },
    {
      name: "Costa Rica",
      teaser: "Aventura y cobertura especial no siempre incluida.",
      fact:
        "Costa Rica es un destino fuerte en turismo de aventura: canopy, surf, rafting, buceo, senderismo y volcanes. Muchas actividades no estan cubiertas automaticamente por seguros basicos y pueden requerir cobertura adicional.",
      note: "Ademas de aventura, muchos viajeros tambien buscan asistencia medica, equipaje y cancelaciones.",
      image:
        "https://images.unsplash.com/photo-1518182170546-07661fd94144?auto=format&fit=crop&w=1200&q=80",
      ctaLabel: "Cotiza hoy",
    },
    {
      name: "Sur America",
      teaser: "Demoras, equipaje y asistencia urbana 24/7.",
      fact:
        "En ciudades grandes de Sudamerica, los cambios climaticos pueden afectar vuelos y las reprogramaciones son relativamente frecuentes. La perdida de equipaje y robos menores tambien impactan a muchos turistas.",
      note: "La asistencia puede apoyar con demoras, equipaje, atencion medica y soporte 24/7.",
      image:
        "https://images.unsplash.com/photo-1612294037637-ec328d0e075e?auto=format&fit=crop&w=1200&q=80",
      ctaLabel: "Cotiza hoy",
    },
  ];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }
    };

    if (selectedIndex !== null) {
      window.addEventListener("keydown", onKeyDown);
      document.body.classList.add("overflow-hidden");
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("overflow-hidden");
    };
  }, [selectedIndex]);

  const handleQuoteByDestination = (destination: string) => {
    window.dispatchEvent(new CustomEvent("prefill-quick-quote", { detail: { destination } }));
    document.getElementById("cotizar")?.scrollIntoView({ behavior: "smooth", block: "center" });
    setSelectedIndex(null);
  };

  const selectedDestination = selectedIndex !== null ? destinations[selectedIndex] : null;

  return (
    <>
      <section id="sabias-que" className="py-24 bg-surface-bright px-8">
        <div className="container-max mx-auto max-w-[1280px]">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-4xl mb-4">Lo que debes saber antes de viajar</h2>
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-2 text-amber-800 font-semibold text-sm">
              <span className="material-symbols-outlined text-base">tips_and_updates</span>
              Haz click sobre una ficha para abrir un dato clave del destino.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {destinations.map((destination, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg text-left"
                aria-label={`Abrir facto de ${destination.name}`}
              >
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                <div className="absolute top-4 left-4 right-4 text-white">
                  <p className="text-xs font-semibold bg-black/35 rounded-lg px-2.5 py-1.5 inline-block backdrop-blur-sm">
                    {destination.teaser}
                  </p>
                </div>

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h4 className="font-headline-md text-xl">{destination.name}</h4>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedDestination && (
        <div
          className="fixed inset-0 z-[70] bg-black/60 p-4 flex items-center justify-center"
          onClick={() => setSelectedIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="destination-fact-title"
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute top-3 right-3 z-20 rounded-full bg-black/45 text-white w-9 h-9 hover:bg-black/60"
              aria-label="Cerrar"
            >
              ×
            </button>

            <div className="relative h-44 md:h-56">
              <Image
                src={selectedDestination.image}
                alt={selectedDestination.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <h3
                id="destination-fact-title"
                className="absolute bottom-4 left-4 right-12 text-white text-2xl font-bold"
              >
                {selectedDestination.name}
              </h3>
            </div>

            <div className="p-5 md:p-6 overflow-y-auto max-h-[calc(90vh-11rem)] md:max-h-[calc(90vh-14rem)] space-y-4">
              <p className="text-slate-700 text-base leading-7">{selectedDestination.fact}</p>
              <p className="text-slate-600 text-sm leading-6 bg-slate-50 rounded-xl px-4 py-3">
                {selectedDestination.note}
              </p>

              <button
                type="button"
                onClick={() => handleQuoteByDestination(selectedDestination.name)}
                className="w-full md:w-auto inline-flex items-center justify-center rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-white hover:brightness-110"
              >
                {selectedDestination.ctaLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
