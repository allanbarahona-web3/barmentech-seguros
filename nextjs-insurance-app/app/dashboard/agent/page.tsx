'use client';

// MULTI-TENANT: Force dynamic rendering para que cada request use el tenantId del JWT
export const dynamic = 'force-dynamic';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function AgentDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['AGENT']}>
      <div className="min-h-screen bg-gray-50 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard de Agente
            </h1>
            <p className="text-gray-600 mt-2">
              Bienvenido, {user?.fullName}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Mis Cotizaciones</p>
                  <p className="text-3xl font-bold text-gray-900">3</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600">
                    description
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Enviadas</p>
                  <p className="text-3xl font-bold text-gray-900">1</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600">
                    send
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Aceptadas</p>
                  <p className="text-3xl font-bold text-gray-900">1</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-purple-600">
                    check_circle
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Acciones Rápidas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <span className="material-symbols-outlined text-blue-600">
                  add_circle
                </span>
                <span className="font-medium text-blue-900">Nueva Cotización</span>
              </button>

              <button className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <span className="material-symbols-outlined text-green-600">
                  upload_file
                </span>
                <span className="font-medium text-green-900">Subir PDF Assist Card</span>
              </button>

              <button className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <span className="material-symbols-outlined text-purple-600">
                  list
                </span>
                <span className="font-medium text-purple-900">Ver Todas</span>
              </button>
            </div>
          </div>

          {/* Recent Quotations */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Cotizaciones Recientes
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-600">
                      flight_takeoff
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Europa - 15 días</p>
                    <p className="text-sm text-gray-600">Cliente: María González</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  ENVIADA
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-600">
                      check_circle
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">USA - 10 días</p>
                    <p className="text-sm text-gray-600">Cliente: Carlos Rodríguez</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  ACEPTADA
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-600">
                      draft
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sudamérica - 14 días</p>
                    <p className="text-sm text-gray-600">Borrador</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  BORRADOR
                </span>
              </div>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 text-3xl">
                construction
              </span>
              <div>
                <h3 className="font-bold text-blue-900 mb-2">
                  Módulo en Desarrollo
                </h3>
                <p className="text-blue-800">
                  Las funcionalidades completas de cotizaciones están en desarrollo.
                  Próximamente: crear, editar, enviar cotizaciones y subir PDFs de Assist Card.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
