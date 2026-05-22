'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ActivatePage() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [agentEmail, setAgentEmail] = useState('');

  // Password validation
  const [passwordValidation, setPasswordValidation] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSymbol: false,
  });

  useEffect(() => {
    if (!token) {
      setError('Token de activación no válido.');
      setValidating(false);
      return;
    }

    // Validate token with backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate-token/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setTokenValid(true);
          setAgentEmail(data.email || '');
        } else {
          setError(data.message || 'Token inválido o expirado.');
        }
      })
      .catch(() => {
        setError('Error al validar el token. Intenta de nuevo.');
      })
      .finally(() => {
        setValidating(false);
      });
  }, [token]);

  useEffect(() => {
    setPasswordValidation({
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const allValid = Object.values(passwordValidation).every((v) => v);
    if (!allValid) {
      setError('La contraseña no cumple con los requisitos de seguridad.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al activar la cuenta.');
      }

      // Save auth token from auto-login
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Redirect to agent dashboard
      router.push('/dashboard/agent');
    } catch (err: any) {
      setError(err.message || 'Error al activar la cuenta. Intenta de nuevo.');
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando token de activación...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <div className="bg-red-100 text-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Token Inválido</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500 mb-6">
              El enlace puede haber expirado o ya fue utilizado. Contacta al administrador para obtener un nuevo enlace.
            </p>
            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Ir a Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Activa tu Cuenta</h1>
          <p className="text-gray-600">
            Bienvenido a BarmenTech Seguros, <strong>{agentEmail}</strong>
          </p>
          <p className="text-sm text-gray-500 mt-2">Establece tu contraseña para empezar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">La contraseña debe tener:</p>
            <ul className="space-y-1 text-sm">
              <li className={passwordValidation.hasMinLength ? 'text-green-600' : 'text-gray-500'}>
                {passwordValidation.hasMinLength ? '✓' : '○'} Mínimo 8 caracteres
              </li>
              <li className={passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-500'}>
                {passwordValidation.hasUppercase ? '✓' : '○'} Al menos una mayúscula (A-Z)
              </li>
              <li className={passwordValidation.hasLowercase ? 'text-green-600' : 'text-gray-500'}>
                {passwordValidation.hasLowercase ? '✓' : '○'} Al menos una minúscula (a-z)
              </li>
              <li className={passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}>
                {passwordValidation.hasNumber ? '✓' : '○'} Al menos un número (0-9)
              </li>
              <li className={passwordValidation.hasSymbol ? 'text-green-600' : 'text-gray-500'}>
                {passwordValidation.hasSymbol ? '✓' : '○'} Al menos un símbolo (!@#$%...)
              </li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Activando...' : 'Activar Cuenta y Acceder'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
