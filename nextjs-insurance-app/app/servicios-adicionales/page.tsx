'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { getPublicCompanySettings, PublicCompanySettings } from '@/lib/api/public-settings';

interface CoverageLevel {
  name: string;
  price: number;
  coverage: string;
  description: string;
}

interface AdditionalService {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  basePrice: number;
  pricingType: string;
  coverageLevels?: CoverageLevel[];
  iconUrl?: string;
  imageUrl?: string;
  features: string[];
}

const categoryIcons: Record<string, string> = {
  equipaje: '🧳',
  salud: '🏥',
  deportes: '⛷️',
  viaje: '✈️',
  tecnologia: '💻',
  mascotas: '🐾',
};

const categoryNames: Record<string, string> = {
  equipaje: 'Equipaje',
  salud: 'Salud',
  deportes: 'Deportes',
  viaje: 'Viaje',
  tecnologia: 'Tecnología',
  mascotas: 'Mascotas',
};

export default function ServiciosAdicionalesPage() {
  const [services, setServices] = useState<AdditionalService[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<AdditionalService | null>(null);
  const [settings, setSettings] = useState<PublicCompanySettings | null>(null);

  // Fetch settings
  useEffect(() => {
    const loadSettings = async () => {
      const data = await getPublicCompanySettings();
      setSettings(data);
    };
    loadSettings();
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== 'all' ? `?category=${selectedCategory}` : '';
      const [servicesRes, categoriesRes] = await Promise.all([
        apiClient.get(`/additional-services/public${params}`),
        apiClient.get('/additional-services/categories'),
      ]);
      setServices(servicesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services;

  const handleServiceClick = (service: AdditionalService) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const heroConfig = settings?.pageHeroes?.['additional-services'];
  const heroImageUrl = heroConfig?.imageUrl || '/adventure_sports_hero.webp';

  // Build CTA URL for geo-whatsapp action
  const getCtaHref = () => {
    if (!heroConfig?.ctaUrl) return '#';
    
    if (heroConfig.ctaAction === 'geo-whatsapp') {
      // Use WhatsApp number from settings
      const whatsappNumber = settings?.socialMedia?.whatsapp;
      if (whatsappNumber) {
        const cleanNumber = whatsappNumber.replace(/\D/g, '');
        return `https://wa.me/${cleanNumber}`;
      }
    }
    
    return heroConfig.ctaUrl;
  };

  const getCtaTarget = () => {
    if (!heroConfig?.ctaAction) return '_self';
    return heroConfig.ctaAction === 'link' ? '_self' : '_blank';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section
        className="relative min-h-[400px] flex items-center justify-center pt-24 pb-12"
        style={{
          backgroundImage: `url(${heroImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: heroConfig?.overlayOpacity ?? 0.5 }}
        ></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: heroConfig?.textColor || '#ffffff' }}
          >
            {heroConfig?.title || 'Servicios Adicionales'}
          </h1>
          <p
            className="text-xl mb-8 max-w-3xl mx-auto"
            style={{ color: heroConfig?.textColor || '#ffffff', opacity: 0.9 }}
          >
            {heroConfig?.subtitle || 'Protege tu viaje con coberturas adicionales diseñadas para cada necesidad.'}
          </p>
          {heroConfig?.ctaText && (
            <a
              href={getCtaHref()}
              target={getCtaTarget()}
              rel="noopener noreferrer"
              className="inline-block bg-emerald-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-emerald-600 transition-all shadow-lg"
            >
              {heroConfig.ctaText}
            </a>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
            }`}
          >
            🌟 Todos
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              {categoryIcons[category]} {categoryNames[category] || category}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service)}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 border-2 border-gray-100"
            >
              {service.imageUrl ? (
                <div className="h-48 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ) : null}

              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-4xl inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white/20 overflow-hidden">
                    {service.iconUrl ? (
                      <img
                        src={service.iconUrl}
                        alt={`${service.name} icon`}
                        className="h-10 w-10 object-contain"
                        loading="lazy"
                      />
                    ) : (
                      categoryIcons[service.category]
                    )}
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {categoryNames[service.category] || service.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold">{service.name}</h3>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-gray-600 mb-6 min-h-[60px]">{service.shortDescription}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-gray-500">Desde</span>
                    <span className="text-4xl font-bold text-blue-600">
                      ${service.basePrice}
                    </span>
                    <span className="text-gray-500">
                      {service.pricingType === 'per_trip'
                        ? 'USD'
                        : service.pricingType === 'percentage'
                        ? '%'
                        : '/día'}
                    </span>
                  </div>
                  {service.pricingType === 'per_trip' && (
                    <p className="text-sm text-gray-500 mt-1">Por viaje</p>
                  )}
                </div>

                {/* Features Preview */}
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <span className="text-green-500 mr-2 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {service.features.length > 3 && (
                      <li className="text-sm text-blue-600 font-medium">
                        +{service.features.length - 3} beneficios más
                      </li>
                    )}
                  </ul>
                )}

                {/* CTA Button */}
                <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No hay servicios disponibles
            </h3>
            <p className="text-gray-600">
              Intenta con otra categoría o vuelve más tarde.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            ¿Necesitas ayuda para elegir?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Nuestros agentes están listos para asesorarte y crear el paquete perfecto para tu viaje
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors inline-block"
            >
              📞 Contactar un Agente
            </a>
            <a
              href="#"
              className="bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-800 transition-colors inline-block"
            >
              💬 Chat en Vivo
            </a>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedService.imageUrl ? (
              <div className="w-full h-56 md:h-72 bg-gray-100 overflow-hidden rounded-t-2xl">
                <img
                  src={selectedService.imageUrl}
                  alt={selectedService.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            {/* Modal Header */}
            <div className={`bg-gradient-to-r from-blue-600 to-blue-500 p-6 md:p-8 text-white ${selectedService.imageUrl ? '' : 'rounded-t-2xl'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-5xl mb-3 h-14 w-14 rounded-xl bg-white/20 overflow-hidden inline-flex items-center justify-center">
                    {selectedService.iconUrl ? (
                      <img
                        src={selectedService.iconUrl}
                        alt={`${selectedService.name} icon`}
                        className="h-12 w-12 object-contain"
                      />
                    ) : (
                      categoryIcons[selectedService.category]
                    )}
                  </span>
                  <h2 className="text-3xl font-bold mb-2">{selectedService.name}</h2>
                  <p className="text-blue-100 text-lg">{selectedService.shortDescription}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
              {/* Price */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-600">Desde</span>
                  <span className="text-5xl font-bold text-blue-600">
                    ${selectedService.basePrice}
                  </span>
                  <span className="text-gray-600">
                    {selectedService.pricingType === 'per_trip'
                      ? 'USD por viaje'
                      : selectedService.pricingType === 'percentage'
                      ? '% del costo total'
                      : 'USD por día'}
                  </span>
                </div>
              </div>

              {/* Coverage Levels */}
              {selectedService.coverageLevels && selectedService.coverageLevels.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Niveles de Cobertura</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedService.coverageLevels.map((level, idx) => (
                      <div key={idx} className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50/50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900">{level.name}</h4>
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                            ${level.price}
                          </span>
                        </div>
                        <p className="text-blue-700 font-semibold mb-1">{level.coverage}</p>
                        <p className="text-sm text-gray-600">{level.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Features */}
              {selectedService.features && selectedService.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Lo que incluye esta cobertura
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedService.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start bg-green-50 rounded-lg p-3 border border-green-200"
                      >
                        <span className="text-green-600 text-xl mr-3">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors">
                  💼 Agregar a mi Cotización
                </button>
                <button className="flex-1 bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition-colors">
                  💬 Consultar con un Agente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
