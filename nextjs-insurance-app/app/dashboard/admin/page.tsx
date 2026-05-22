'use client';

// MULTI-TENANT: Force dynamic rendering para que cada request use el tenantId del JWT
export const dynamic = 'force-dynamic';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-gray-50 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard de Administrador
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
                  <p className="text-sm text-gray-600 mb-1">Total Usuarios</p>
                  <p className="text-3xl font-bold text-gray-900">4</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600">
                    group
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cotizaciones</p>
                  <p className="text-3xl font-bold text-gray-900">3</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600">
                    description
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Servicios Adicionales</p>
                  <p className="text-3xl font-bold text-gray-900">7</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-purple-600">
                    add_circle
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions / Navigation */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Módulos Administrativos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/dashboard/admin/users"
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <span className="material-symbols-outlined text-blue-600">
                  group
                </span>
                <div>
                  <div className="font-medium text-blue-900">Gestión de Usuarios</div>
                  <div className="text-sm text-blue-700">Crear y administrar usuarios</div>
                </div>
              </Link>

              <Link
                href="/dashboard/admin/add-ons"
                className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <span className="material-symbols-outlined text-green-600">
                  shield
                </span>
                <div>
                  <div className="font-medium text-green-900">Servicios Adicionales</div>
                  <div className="text-sm text-green-700">Gestionar add-ons y coberturas</div>
                </div>
              </Link>

              <Link
                href="/dashboard/admin/company"
                className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <span className="material-symbols-outlined text-purple-600">
                  business
                </span>
                <div>
                  <div className="font-medium text-purple-900">Configuración Empresa</div>
                  <div className="text-sm text-purple-700">Logo, datos, redes sociales</div>
                </div>
              </Link>

              <button className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors opacity-50 cursor-not-allowed">
                <span className="material-symbols-outlined text-orange-600">
                  description
                </span>
                <div>
                  <div className="font-medium text-orange-900">Cotizaciones</div>
                  <div className="text-sm text-orange-700">Próximamente</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors opacity-50 cursor-not-allowed">
                <span className="material-symbols-outlined text-red-600">
                  analytics
                </span>
                <div>
                  <div className="font-medium text-red-900">Reportes</div>
                  <div className="text-sm text-red-700">Próximamente</div>
                </div>
              </button>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 text-3xl">
                info
              </span>
              <div>
                <h3 className="font-bold text-blue-900 mb-2">
                  Sistema en Desarrollo Activo
                </h3>
                <p className="text-blue-800">
                  Los módulos de Usuarios, Servicios Adicionales y Configuración de Empresa ya están disponibles. 
                  Próximamente: gestión de cotizaciones y reportes analíticos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
