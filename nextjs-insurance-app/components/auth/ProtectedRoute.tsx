'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('[ProtectedRoute] State:', { loading, isAuthenticated, user: user?.email, allowedRoles });
    
    if (!loading) {
      // Not authenticated -> redirect to login
      if (!isAuthenticated) {
        console.log('[ProtectedRoute] ❌ Not authenticated, redirecting to /login');
        router.push('/login');
        return;
      }

      // Check role permissions
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        console.log('[ProtectedRoute] ❌ Unauthorized role, redirecting to /dashboard');
        // Unauthorized role -> redirect to dashboard
        router.push('/dashboard');
      } else {
        console.log('[ProtectedRoute] ✅ Access granted');
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Check role authorization
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta página</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
