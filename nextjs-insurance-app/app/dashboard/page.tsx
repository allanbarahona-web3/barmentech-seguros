'use client';

// MULTI-TENANT: Force dynamic rendering para que cada request use el tenantId del JWT
export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Redirect based on role
      switch (user.role) {
        case 'ADMIN':
          router.push('/dashboard/admin');
          break;
        case 'AGENT':
          router.push('/dashboard/agent');
          break;
        case 'CLIENT':
          router.push('/dashboard/client');
          break;
        default:
          break;
      }
    }
  }, [user, router]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Redirigiendo a tu dashboard...</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
