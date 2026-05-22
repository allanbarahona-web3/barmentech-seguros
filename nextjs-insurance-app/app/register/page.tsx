'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { settings } = useTenant();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`;~]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('La contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales');
      return;
    }

    setLoading(true);

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const companyName = settings?.companyName || "Seguros de Viaje";

  const benefits = [
    {
      icon: 'notifications_active',
      title: 'Promociones Exclusivas',
      description: 'Recibe notificaciones de descuentos especiales y ofertas personalizadas según tu perfil de viaje'
    },
    {
      icon: 'speed',
      title: 'Cotizaciones en Tiempo Real',
      description: 'Accede a tus cotizaciones al instante, revisa coberturas y descarga documentos cuando lo necesites'
    },
    {
      icon: 'history',
      title: 'Historial Completo',
      description: 'Consulta todas tus pólizas anteriores, renovaciones y mantén un registro ordenado de tus viajes'
    },
    {
      icon: 'support_agent',
      title: 'Atención Prioritaria',
      description: 'Como cliente registrado, tendrás soporte prioritario y un agente dedicado para tus consultas'
    },
    {
      icon: 'auto_awesome',
      title: 'Recomendaciones Personalizadas',
      description: 'Recibe sugerencias de coberturas y servicios adicionales adaptados a tus destinos frecuentes'
    },
    {
      icon: 'folder_shared',
      title: 'Gestión Simplificada',
      description: 'Administra múltiples viajeros, actualiza información y modifica coberturas desde un solo lugar'
    }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/travel_hero_panorama.webp')] bg-cover bg-center opacity-15"></div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full overflow-y-auto">
          {/* Logo/Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-12">
              <span className="material-symbols-outlined text-4xl">shield</span>
              <span className="text-2xl font-bold font-manrope">{companyName}</span>
            </Link>
          </div>

          {/* Center Content */}
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              ¿Por qué crear una cuenta?
            </h2>
            <p className="text-lg text-emerald-100 mb-8">
              Únete a nuestra comunidad de viajeros y disfruta de beneficios exclusivos
            </p>
            
            {/* Benefits Grid */}
            <div className="grid grid-cols-1 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <span className="material-symbols-outlined text-2xl text-emerald-300 flex-shrink-0">
                    {benefit.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-emerald-100">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-emerald-200 mt-8">
            © 2026 {companyName}. Todos los derechos reservados.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-emerald-600">
              <span className="material-symbols-outlined text-3xl">shield</span>
              <span className="text-xl font-bold">{companyName}</span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Crear Cuenta
              </h1>
              <p className="text-gray-600">
                Regístrate gratis y comienza a disfrutar de los beneficios
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

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    person
                  </span>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Juan Pérez"
                    disabled={loading}
                  />
                </div>
              </div>

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
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="tu@email.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    phone
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="+506 1234-5678"
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
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                <p className="text-xs text-gray-500 mt-1.5">
                  Mínimo 8 caracteres, mayúsculas, minúsculas, números y símbolos
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    lock_reset
                  </span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3.5 rounded-lg font-semibold hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">person_add</span>
                    Crear Cuenta Gratis
                  </>
                )}
              </button>
            </form>

            {/* Terms */}
            <p className="mt-4 text-xs text-center text-gray-500">
              Al registrarte, aceptas nuestros{' '}
              <Link href="/legal/terminos-y-condiciones" className="text-emerald-600 hover:underline">
                Términos y Condiciones
              </Link>{' '}
              y{' '}
              <Link href="/legal/politica-de-privacidad" className="text-emerald-600 hover:underline">
                Política de Privacidad
              </Link>
            </p>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-500">o</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-emerald-600 font-semibold hover:underline">
                  Inicia sesión
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
