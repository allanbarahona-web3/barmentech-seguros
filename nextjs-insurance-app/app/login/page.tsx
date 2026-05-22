'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { settings } = useTenant();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const companyName = settings?.companyName || "Seguros de Viaje";

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/travel_hero_panorama.webp')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo/Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-12">
              <span className="material-symbols-outlined text-4xl">shield</span>
              <span className="text-2xl font-bold font-manrope">{companyName}</span>
            </Link>
          </div>

          {/* Center Content */}
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Bienvenido de vuelta
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Accede a tu cuenta para gestionar tus cotizaciones, ver tu historial y actualizar tu información.
            </p>
            
            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-2xl text-blue-300">verified</span>
                <div>
                  <h3 className="font-semibold mb-1">Seguro y Confiable</h3>
                  <p className="text-sm text-blue-200">Tus datos están protegidos con encriptación de nivel bancario</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-2xl text-blue-300">support_agent</span>
                <div>
                  <h3 className="font-semibold mb-1">Soporte 24/7</h3>
                  <p className="text-sm text-blue-200">Nuestro equipo está siempre disponible para ayudarte</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-blue-200">
            © 2026 {companyName}. Todos los derechos reservados.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-blue-600">
              <span className="material-symbols-outlined text-3xl">shield</span>
              <span className="text-xl font-bold">{companyName}</span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Iniciar Sesión
              </h1>
              <p className="text-gray-600">
                Ingresa tus credenciales para acceder
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-500">error</span>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    mail
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="tu@email.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    lock
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">login</span>
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">science</span>
                Credenciales de prueba
              </p>
              <div className="text-xs text-blue-800 space-y-1">
                <p><strong>Admin:</strong> admin@barmentech.com / Admin123!</p>
                <p><strong>Agente:</strong> agente@barmentech.com / Admin123!</p>
                <p><strong>Cliente:</strong> cliente1@example.com / Admin123!</p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-500">o</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                ¿No tienes cuenta?{' '}
                <Link href="/register" className="text-blue-600 font-semibold hover:underline">
                  Regístrate gratis
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-gray-500 text-sm hover:text-gray-700 inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
