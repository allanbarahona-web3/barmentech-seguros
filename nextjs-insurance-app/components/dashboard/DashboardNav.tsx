'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardNav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex justify-between items-center h-16 px-6 max-w-[1920px] mx-auto">
        {/* Logo/Brand */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            {/* Logo dinámico - se cargará desde configuración de empresa */}
            <span className="text-xl font-bold text-blue-900 tracking-tight font-manrope">
              Dashboard <span className="text-sm font-normal text-gray-500">Admin</span>
            </span>
          </Link>

          {/* Navigation Links based on role */}
          <div className="hidden md:flex items-center gap-1">
            {user?.role === 'ADMIN' && (
              <>
                <Link
                  href="/dashboard/admin"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard/admin') && pathname === '/dashboard/admin'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm mr-1 align-middle">dashboard</span>
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/admin/leads"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard/admin/leads')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm mr-1 align-middle">leaderboard</span>
                  Leads
                </Link>
                <Link
                  href="/dashboard/admin/users"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard/admin/users')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm mr-1 align-middle">group</span>
                  Usuarios
                </Link>
                <Link
                  href="/dashboard/admin/add-ons"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard/admin/add-ons')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm mr-1 align-middle">shield</span>
                  Servicios Adicionales
                </Link>
                <Link
                  href="/dashboard/admin/company"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard/admin/company')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm mr-1 align-middle">business</span>
                  Empresa
                </Link>
              </>
            )}

            {user?.role === 'AGENT' && (
              <>
                <Link
                  href="/dashboard/agent"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard/agent')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm mr-1 align-middle">dashboard</span>
                  Dashboard
                </Link>
              </>
            )}

            {user?.role === 'CLIENT' && (
              <>
                <Link
                  href="/dashboard/client"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard/client')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm mr-1 align-middle">dashboard</span>
                  Mi Dashboard
                </Link>
              </>
            )}
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          {/* Back to Public Site Link - More prominent */}
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            <span className="hidden sm:inline">Ir al Inicio</span>
          </Link>

          {/* User Info */}
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="hidden md:inline">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
