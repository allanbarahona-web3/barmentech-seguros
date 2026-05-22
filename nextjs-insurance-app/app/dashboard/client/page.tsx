'use client';

// MULTI-TENANT: Force dynamic rendering para que cada request use el tenantId del JWT
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import QuoteModalHost from '@/components/home/QuoteModalHost';
import QuickQuoteWidget from '@/components/plans/QuickQuoteWidget';
import { apiClient } from '@/lib/api/client';

interface ContactRouteResponse {
  route?: {
    whatsappUrl: string | null;
  };
}

interface PublicSettingsResponse {
  socialMedia?: {
    whatsapp?: string;
  };
}

const DASHBOARD_ADVISOR_WHATSAPP_MESSAGE =
  'Hola, necesito asesoria sobre mi seguro de viaje. Vengo del dashboard de cliente.';

function withWhatsAppMessage(rawUrl: string, message: string): string {
  try {
    const url = new URL(rawUrl);
    const existingText = url.searchParams.get('text');

    if (!existingText) {
      url.searchParams.set('text', message);
    }

    return url.toString();
  } catch {
    const separator = rawUrl.includes('?') ? '&' : '?';
    return `${rawUrl}${separator}text=${encodeURIComponent(message)}`;
  }
}

function normalizeWhatsAppUrl(rawValue?: string | null): string | null {
  if (!rawValue) {
    return null;
  }

  const value = rawValue.trim();
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const digits = value.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : null;
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const [resolvingContact, setResolvingContact] = useState(false);

  const scrollToQuoteWidget = () => {
    window.dispatchEvent(new CustomEvent('scroll-to-quote'));
  };

  const handleContactAgent = async () => {
    try {
      setResolvingContact(true);
      // 1) Try geo-routed WhatsApp first
      try {
        const response = await apiClient.get<ContactRouteResponse>(
          '/settings/public/contact-route',
        );
        const resolved = response.data?.route?.whatsappUrl;

        if (resolved) {
          const urlWithMessage = withWhatsAppMessage(
            resolved,
            DASHBOARD_ADVISOR_WHATSAPP_MESSAGE,
          );
          window.open(urlWithMessage, '_blank', 'noopener,noreferrer');
          return;
        }
      } catch (error) {
        console.error('Error resolving geo WhatsApp route from dashboard:', error);
      }

      // 2) Fallback to tenant-configured WhatsApp in public settings
      try {
        const settingsResponse = await apiClient.get<PublicSettingsResponse>('/settings/public');
        const fallbackWhatsApp = normalizeWhatsAppUrl(
          settingsResponse.data?.socialMedia?.whatsapp,
        );

        if (fallbackWhatsApp) {
          const urlWithMessage = withWhatsAppMessage(
            fallbackWhatsApp,
            DASHBOARD_ADVISOR_WHATSAPP_MESSAGE,
          );
          window.open(urlWithMessage, '_blank', 'noopener,noreferrer');
          return;
        }
      } catch (error) {
        console.error('Error resolving fallback WhatsApp from dashboard:', error);
      }
    } catch (error) {
      console.error('Error resolving WhatsApp contact from client dashboard:', error);
    } finally {
      setResolvingContact(false);
    }
  };

  const stats = [
    {
      icon: 'description',
      label: 'Cotizaciones',
      value: '0',
      color: 'blue',
      description: 'Solicitudes activas'
    },
    {
      icon: 'check_circle',
      label: 'Pólizas Activas',
      value: '0',
      color: 'green',
      description: 'Seguros vigentes'
    },
    {
      icon: 'history',
      label: 'Historial',
      value: '0',
      color: 'purple',
      description: 'Viajes anteriores'
    }
  ];

  const quickActions = [
    {
      icon: 'add_circle',
      title: 'Nueva Cotización',
      description: 'Solicita un presupuesto para tu próximo viaje',
      href: '/#cotizar',
      color: 'blue'
    },
    {
      icon: 'support_agent',
      title: 'Contactar Agente',
      description: 'Habla con un experto sobre tus necesidades',
      href: '/support',
      color: 'green'
    },
    {
      icon: 'folder_open',
      title: 'Ver Documentos',
      description: 'Accede a tus pólizas y certificados',
      href: '#',
      color: 'purple'
    }
  ];

  const recentActivity = [
    {
      icon: 'person_add',
      title: 'Cuenta creada exitosamente',
      description: 'Bienvenido a nuestra plataforma',
      time: 'Hace unos momentos',
      color: 'green'
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['CLIENT']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Welcome Message */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  ¡Bienvenido de vuelta, {user?.fullName?.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-600 mt-1">
                  Aquí puedes gestionar todas tus cotizaciones y seguros de viaje
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-full bg-${stat.color}-100 flex items-center justify-center`}>
                    <span className={`material-symbols-outlined text-${stat.color}-600 text-3xl`}>
                      {stat.icon}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">bolt</span>
              Acciones Rápidas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                // Primera acción hace scroll al widget de cotización
                if (index === 0) {
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={scrollToQuoteWidget}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1 group text-left w-full"
                    >
                      <div className={`w-12 h-12 rounded-lg bg-${action.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <span className={`material-symbols-outlined text-${action.color}-600 text-2xl`}>
                          {action.icon}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                      <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                        Ir al widget
                        <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                      </div>
                    </button>
                  );
                }

                if (index === 1) {
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={handleContactAgent}
                      disabled={resolvingContact}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1 group text-left w-full disabled:opacity-70"
                    >
                      <div className={`w-12 h-12 rounded-lg bg-${action.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <span className={`material-symbols-outlined text-${action.color}-600 text-2xl`}>
                          {action.icon}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                      <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                        {resolvingContact ? 'Conectando...' : 'Ir ahora'}
                        <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                      </div>
                    </button>
                  );
                }
                
                return (
                  <Link
                    key={index}
                    href={action.href}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1 group"
                  >
                    <div className={`w-12 h-12 rounded-lg bg-${action.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <span className={`material-symbols-outlined text-${action.color}-600 text-2xl`}>
                        {action.icon}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                    <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                      Ir ahora
                      <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Widget de cotizacion para usar el flujo completo dentro del dashboard */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">calculate</span>
              Cotiza tu viaje
            </h2>
            <QuickQuoteWidget embedded />
          </div>

          {/* Recent Activity */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">notifications</span>
              Actividad Reciente
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
              {recentActivity.map((activity, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full bg-${activity.color}-100 flex items-center justify-center flex-shrink-0`}>
                      <span className={`material-symbols-outlined text-${activity.color}-600`}>
                        {activity.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State - Quotations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-blue-600 text-5xl">
                  flight_takeoff
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Comienza tu próxima aventura
              </h2>
              <p className="text-gray-600 mb-6">
                Aún no tienes cotizaciones. Solicita una ahora y recibe tu presupuesto personalizado en minutos.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  type="button"
                  onClick={scrollToQuoteWidget}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">add_circle</span>
                  Ir al widget de cotizacion
                </button>
                <button
                  type="button"
                  onClick={handleContactAgent}
                  disabled={resolvingContact}
                  className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <span className="material-symbols-outlined">support_agent</span>
                  {resolvingContact ? 'Conectando...' : 'Hablar con un Agente'}
                </button>
              </div>
            </div>
          </div>

          {/* Benefits Info Card */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-start gap-6">
              <div className="hidden md:block">
                <span className="material-symbols-outlined text-6xl opacity-90">
                  workspace_premium
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Beneficios de Cliente Registrado</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-200">check_circle</span>
                    <div>
                      <p className="font-semibold">Promociones Exclusivas</p>
                      <p className="text-sm text-emerald-100">Descuentos especiales para clientes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-200">check_circle</span>
                    <div>
                      <p className="font-semibold">Atención Prioritaria</p>
                      <p className="text-sm text-emerald-100">Soporte dedicado 24/7</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-200">check_circle</span>
                    <div>
                      <p className="font-semibold">Gestión Simplificada</p>
                      <p className="text-sm text-emerald-100">Todos tus viajes en un solo lugar</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-200">check_circle</span>
                    <div>
                      <p className="font-semibold">Historial Completo</p>
                      <p className="text-sm text-emerald-100">Acceso a todas tus pólizas anteriores</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Development Notice */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-6">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 text-3xl">
                construction
              </span>
              <div>
                <h3 className="font-bold text-blue-900 mb-2 text-lg">
                  Módulo en Desarrollo
                </h3>
                <p className="text-blue-800 mb-3">
                  Estamos trabajando para ofrecerte una experiencia completa. Próximamente podrás:
                </p>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">radio_button_checked</span>
                    Ver y gestionar tus cotizaciones en tiempo real
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">radio_button_checked</span>
                    Descargar pólizas y certificados en PDF
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">radio_button_checked</span>
                    Recibir notificaciones de vencimientos y renovaciones
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">radio_button_checked</span>
                    Administrar múltiples viajeros y beneficiarios
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de cotización integrado */}
      <QuoteModalHost />
    </ProtectedRoute>
  );
}
