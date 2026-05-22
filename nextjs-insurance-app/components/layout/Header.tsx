"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getPublicCompanySettings, PublicCompanySettings } from "@/lib/api/public-settings";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [companySettings, setCompanySettings] = useState<PublicCompanySettings | null>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getPublicCompanySettings();
      setCompanySettings(settings);
    };

    loadSettings();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const companyName = companySettings?.companyName || "Seguros de Viaje";
  const logoUrl = companySettings?.logoUrl;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 h-20">
      <div className="flex justify-between items-center h-full px-6 md:px-12 max-w-[1280px] mx-auto">
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={companyName}
              width={140}
              height={44}
              className="h-10 w-auto object-contain"
              unoptimized
            />
          ) : (
            <div className="text-2xl font-bold text-blue-900 tracking-tighter font-manrope">
              {companyName}
            </div>
          )}
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className="text-blue-900 border-b-2 border-emerald-500 pb-1 font-manrope text-sm font-semibold tracking-tight"
          >
            Inicio
          </Link>
          <Link 
            href="/#coberturas" 
            className="text-slate-600 hover:text-blue-900 transition-colors font-manrope text-sm font-semibold tracking-tight"
          >
            Coberturas
          </Link>
          <Link 
            href="/plans" 
            className="text-slate-600 hover:text-blue-900 transition-colors font-manrope text-sm font-semibold tracking-tight"
          >
            Planes
          </Link>
          <Link 
            href="/servicios-adicionales" 
            className="text-slate-600 hover:text-blue-900 transition-colors font-manrope text-sm font-semibold tracking-tight"
          >
            Servicios Adicionales
          </Link>
          <Link 
            href="/#cotizar" 
            className="text-slate-600 hover:text-blue-900 transition-colors font-manrope text-sm font-semibold tracking-tight"
          >
            Cotizar
          </Link>
          <Link 
            href="/#preguntas" 
            className="text-slate-600 hover:text-blue-900 transition-colors font-manrope text-sm font-semibold tracking-tight"
          >
            Preguntas
          </Link>
          <Link 
            href="/support" 
            className="text-slate-600 hover:text-blue-900 transition-colors font-manrope text-sm font-semibold tracking-tight"
          >
            Contacto
          </Link>
        </div>

        <div className="flex gap-3 items-center">
          {isAuthenticated ? (
            <>
              {/* User Info - Desktop */}
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-blue-900">{user?.fullName}</p>
                  <p className="text-xs text-slate-500">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl font-manrope text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  Salir
                </button>
              </div>
              
              {/* Dashboard Button - Mobile */}
              <Link 
                href="/dashboard"
                className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-xl font-manrope text-sm font-semibold"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/login"
                className="hidden md:block text-blue-900 px-4 py-2 rounded-xl font-manrope text-sm font-semibold hover:bg-blue-50 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/register"
                className="bg-primary text-white px-4 py-2 rounded-xl font-manrope text-sm font-semibold active:scale-95 transition-transform hover:shadow-lg"
              >
                Registrarse
              </Link>
            </>
          )}
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="material-symbols-outlined">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="flex flex-col gap-4 p-6">
            <Link href="/" className="text-blue-900 font-manrope font-semibold">Inicio</Link>
            <Link href="/#coberturas" className="text-slate-600 font-manrope">Coberturas</Link>
            <Link href="/plans" className="text-slate-600 font-manrope">Planes</Link>
            <Link href="/servicios-adicionales" className="text-slate-600 font-manrope">Servicios Adicionales</Link>
            <Link href="/#cotizar" className="text-slate-600 font-manrope">Cotizar</Link>
            <Link href="/#preguntas" className="text-slate-600 font-manrope">Preguntas</Link>
            <Link href="/support" className="text-slate-600 font-manrope">Contacto</Link>
            
            {/* Auth buttons for mobile */}
            <div className="border-t border-slate-200 pt-4 mt-2">
              {isAuthenticated ? (
                <>
                  <p className="text-sm font-semibold text-blue-900 mb-2">{user?.fullName}</p>
                  <p className="text-xs text-slate-500 mb-3">Rol: {user?.role}</p>
                  <Link 
                    href="/dashboard"
                    className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-xl font-manrope text-sm font-semibold mb-2"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 text-white px-4 py-2 rounded-xl font-manrope text-sm font-semibold"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login"
                    className="block w-full text-center border border-blue-600 text-blue-600 px-4 py-2 rounded-xl font-manrope text-sm font-semibold mb-2"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    href="/register"
                    className="block w-full text-center bg-primary text-white px-4 py-2 rounded-xl font-manrope text-sm font-semibold"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
