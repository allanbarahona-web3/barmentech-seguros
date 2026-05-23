"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { PublicCompanySettings } from "@/lib/api/public-settings";

interface FooterProps {
  settings: PublicCompanySettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const companyName = settings?.companyName || "Seguros de Viaje";
  const logoUrl = settings?.logoUrl;
  const mainPhone = useMemo(() => {
    return settings?.phoneNumbers?.[0]?.phone || "+506 4000-0000";
  }, [settings]);
  const email = settings?.email || "info@seguros.cr";
  const address = settings?.businessAddress || "Escazú Village, San José";
  const socialMedia = settings?.socialMedia || {};

  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-16">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={companyName}
                width={170}
                height={52}
                className="h-12 w-auto object-contain"
                unoptimized
              />
            ) : (
              <span className="text-xl font-bold text-blue-900 tracking-tighter font-manrope">
                {companyName}
              </span>
            )}
            <p className="text-body-sm text-slate-500">
              Líderes en asistencia al viajero con sede en San José, Costa Rica.
            </p>
            <div className="flex gap-4">
              {socialMedia.facebook && (
                <a href={socialMedia.facebook} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-900 transition-colors">
                  <span className="material-symbols-outlined">share</span>
                </a>
              )}
              {socialMedia.instagram && (
                <a href={socialMedia.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-900 transition-colors">
                  <span className="material-symbols-outlined">photo_camera</span>
                </a>
              )}
              {socialMedia.linkedin && (
                <a href={socialMedia.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-900 transition-colors">
                  <span className="material-symbols-outlined">business_center</span>
                </a>
              )}
            </div>
          </div>

          <div>
            <h5 className="font-manrope font-bold text-primary mb-6">Empresa</h5>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li>
                <Link href="/sobre-nosotros" className="hover:text-blue-800 transition-all">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/nuestro-respaldo" className="hover:text-blue-800 transition-all">
                  Nuestro Respaldo
                </Link>
              </li>
              <li>
                <Link href="/viaja-informado" className="hover:text-blue-800 transition-all">
                  Viaja Informado
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-manrope font-bold text-primary mb-6">Soporte</h5>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li>
                <Link href="/support" className="hover:text-blue-800 transition-all">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-blue-800 transition-all">
                  Reportar Siniestro
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-blue-800 transition-all">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-manrope font-bold text-primary mb-6">Contacto</h5>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">call</span>
                {mainPhone}
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">mail</span>
                {email}
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">location_on</span>
                {address}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-slate-200 gap-6">
          <p className="text-sm text-slate-500 font-manrope">
            © 2026 {companyName}. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/legal/privacidad" className="text-xs text-slate-400 hover:underline">
              Política de Privacidad
            </Link>
            <Link href="/legal/terminos" className="text-xs text-slate-400 hover:underline">
              Términos y Condiciones
            </Link>
            <Link href="/support" className="text-xs text-slate-400 hover:underline">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
