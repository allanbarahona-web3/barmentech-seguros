"use client";

import { useState, useEffect } from "react";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  destination: string;
  text: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "María Rodríguez",
    location: "San José, Costa Rica",
    destination: "Europa",
    text: "Tuve una emergencia médica en España y el respaldo fue inmediato. La atención fue excelente y no tuve que pagar nada de mi bolsillo. Totalmente recomendado.",
    rating: 5,
  },
  {
    id: 2,
    name: "Carlos Méndez",
    location: "Ciudad de México, México",
    destination: "Estados Unidos",
    text: "Viajé a Miami con mi familia y mi hijo se enfermó. La asistencia 24/7 en español fue clave. Nos atendieron en menos de 2 horas en una clínica de primer nivel.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ana Solís",
    location: "Alajuela, Costa Rica",
    destination: "México",
    text: "Perdí mi maleta en Cancún y el seguro cubrió todo. El proceso de reclamo fue sencillo y recibí el reembolso en menos de 2 semanas. Súper eficiente.",
    rating: 4,
  },
  {
    id: 4,
    name: "Roberto Jiménez",
    location: "Bogotá, Colombia",
    destination: "Sudamérica",
    text: "Cancelé mi viaje a Argentina por motivos laborales y recuperé el 100% de los gastos de cancelación. No esperaba que el proceso fuera tan rápido.",
    rating: 5,
  },
  {
    id: 5,
    name: "Gabriela Vargas",
    location: "Puntarenas, Costa Rica",
    destination: "Asia",
    text: "En Tailandia tuve un accidente en moto. La evacuación médica y hospitalización fueron cubiertas completamente. Sin este seguro hubiera sido una catástrofe financiera.",
    rating: 5,
  },
  {
    id: 6,
    name: "Diego Mora",
    location: "Panamá, Panamá",
    destination: "Centroamérica",
    text: "El proceso de compra fue rápido pero cuando necesité usar el seguro en Guatemala, la línea de atención tardó un poco más de lo esperado. Aún así resolvieron mi caso.",
    rating: 3,
  },
  {
    id: 7,
    name: "Lucía Castro",
    location: "San José, Costa Rica",
    destination: "Caribe",
    text: "En República Dominicana mi esposo tuvo una reacción alérgica seria. La asistencia fue impecable, desde la llamada hasta el seguimiento post-hospitalización.",
    rating: 5,
  },
  {
    id: 8,
    name: "Fernando Salas",
    location: "Buenos Aires, Argentina",
    destination: "Europa",
    text: "Perdí mi pasaporte en Italia y la asistencia legal me ayudó con todos los trámites consulares. Sin ese apoyo hubiera sido una pesadilla.",
    rating: 5,
  },
  {
    id: 9,
    name: "Patricia Arias",
    location: "Heredia, Costa Rica",
    destination: "Estados Unidos",
    text: "Mi vuelo de regreso de Nueva York se retrasó 12 horas. El seguro cubrió hotel y comidas. Detalles que hacen la diferencia cuando viajas.",
    rating: 4,
  },
  {
    id: 10,
    name: "Andrés Ramírez",
    location: "Miami, Estados Unidos",
    destination: "Sudamérica",
    text: "Viajé a Chile y tuve que extender mi estadía por trabajo. La cobertura se extendió sin problemas con una simple llamada. Muy flexibles.",
    rating: 5,
  },
  {
    id: 11,
    name: "Sofía Vargas",
    location: "Alajuela, Costa Rica",
    destination: "Asia",
    text: "En Japón necesité medicamentos de emergencia que no encontraba. La asistencia me conectó con farmacias internacionales y gestionó todo. Increíble.",
    rating: 5,
  },
  {
    id: 12,
    name: "Manuel Ugalde",
    location: "Cartago, Costa Rica",
    destination: "Europa",
    text: "Contraté para mi luna de miel en Grecia. Aunque no tuve emergencias, la tranquilidad de viajar protegido no tiene precio. Lo volvería a contratar siempre.",
    rating: 4,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardsPerView = 4;
  const totalSlides = Math.ceil(TESTIMONIALS.length / cardsPerView);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleDotClick = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 8000);

    return () => clearInterval(interval);
  }, [currentIndex, isAnimating]);

  const visibleTestimonials = TESTIMONIALS.slice(
    currentIndex * cardsPerView,
    currentIndex * cardsPerView + cardsPerView
  );

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-max mx-auto px-8 max-w-[1280px]">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-6 border border-primary/20">
            <span className="material-symbols-outlined text-primary text-2xl">verified</span>
            <span className="text-primary-700 font-semibold text-lg">
              Más de 300 clientes satisfechos y contando
            </span>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-primary font-label-md mb-4">
            <span className="w-12 h-[1px] bg-primary"></span>
            EXPERIENCIAS REALES
            <span className="w-12 h-[1px] bg-primary"></span>
          </div>
          <h2 className="font-headline-lg text-4xl md:text-5xl text-gray-900 mb-4">
            Lo que dicen nuestros viajeros
          </h2>
          <p className="text-gray-600 font-body-lg max-w-2xl mx-auto">
            Miles de viajeros en toda América confían en nosotros para proteger sus aventuras.
            Conocé sus experiencias reales.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col ${
                  isAnimating
                    ? "opacity-0 scale-95"
                    : "opacity-100 scale-100"
                }`}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`text-lg ${
                        i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 font-body-md mb-6 flex-grow leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-semibold text-gray-900 mb-1">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    {testimonial.location}
                  </p>
                  <p className="text-xs text-primary font-medium">
                    Viajó a {testimonial.destination}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-8">
            {/* Previous Button */}
            <button
              onClick={handlePrev}
              disabled={isAnimating}
              className="p-3 rounded-full bg-primary text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110"
              aria-label="Testimonio anterior"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {[...Array(totalSlides)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  disabled={isAnimating}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Ir a página ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={isAnimating}
              className="p-3 rounded-full bg-primary text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110"
              aria-label="Siguiente testimonio"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
