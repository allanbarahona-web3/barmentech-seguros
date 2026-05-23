"use client";

import Link from "next/link";
import Image from "next/image";
import { PublicCompanySettings } from "@/lib/api/public-settings";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

interface FooterProps {
  settings: PublicCompanySettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const companyName = settings?.companyName || "Seguros de Viaje";
  const logoUrl = settings?.logoUrl;
  const phoneNumbers = settings?.phoneNumbers || [];
  const email = settings?.email || "info@seguros.cr";
  const address = settings?.businessAddress || "Escazú Village, San José";
  const socialMedia = settings?.socialMedia || {};

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Column 1: Company Info */}
          <div className="space-y-6">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={companyName}
                width={180}
                height={54}
                className="h-12 w-auto object-contain brightness-0 invert"
                unoptimized
              />
            ) : (
              <span className="text-xl font-bold tracking-tight font-manrope">
                {companyName}
              </span>
            )}
            <p className="text-slate-300 text-sm leading-relaxed">
              Líderes en asistencia al viajero con cobertura internacional. Protegemos tu tranquilidad en cada destino.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h5 className="font-manrope font-bold text-base mb-5 text-white">Navegación</h5>
            <ul className="space-y-3">
              <li>
                <Link href="/sobre-nosotros" className="text-slate-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 text-sm">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/nuestro-respaldo" className="text-slate-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 text-sm">
                  Nuestro Respaldo
                </Link>
              </li>
              <li>
                <Link href="/viaja-informado" className="text-slate-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 text-sm">
                  Viaja Informado
                </Link>
              </li>
              <li>
                <Link href="/servicios-adicionales" className="text-slate-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 text-sm">
                  Servicios Adicionales
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-slate-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Phone Numbers */}
          <div>
            <h5 className="font-manrope font-bold text-base mb-5 text-white">Teléfonos</h5>
            <ul className="space-y-4">
              {phoneNumbers.length > 0 && phoneNumbers.filter((phone) => phone?.phone && phone.phone.trim() !== '').length > 0 ? (
                phoneNumbers
                  .filter((phone) => phone?.phone && phone.phone.trim() !== '')
                  .map((phone, index) => (
                    <li key={index}>
                      <div className="flex items-start gap-2 group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-blue-600 transition-colors mt-0.5">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <a href={`tel:${phone.phone}`} className="text-slate-200 hover:text-white font-medium block transition-colors text-sm">
                            {phone.phone}
                          </a>
                          {phone.country && phone.country.trim() && (
                            <span className="text-xs text-slate-400 block mt-0.5">{phone.country}</span>
                          )}
                          <a 
                            href={`https://wa.me/${phone.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 mt-1 transition-colors"
                          >
                            <MessageCircle className="w-3 h-3" />
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </li>
                  ))
              ) : (
                <li>
                  <div className="flex items-start gap-2 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-blue-600 transition-colors mt-0.5">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <a href="tel:+50670067572" className="text-slate-200 hover:text-white font-medium block transition-colors text-sm">
                        +506 7006 7572
                      </a>
                      <span className="text-xs text-slate-400 block mt-0.5">Costa Rica</span>
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Email, Address & Social */}
          <div>
            <h5 className="font-manrope font-bold text-base mb-5 text-white">Ubicación</h5>
            <ul className="space-y-4">
              
              {/* Email */}
              <li>
                <div className="flex items-start gap-2 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-blue-600 transition-colors mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <a href={`mailto:${email}`} className="text-slate-200 hover:text-white font-medium block transition-colors break-all text-sm">
                      {email}
                    </a>
                    <span className="text-xs text-slate-400 block mt-0.5">Escríbenos</span>
                  </div>
                </div>
              </li>

              {/* Address */}
              <li>
                <div className="flex items-start gap-2 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-blue-600 transition-colors mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-slate-200 block leading-relaxed text-sm">{address}</span>
                    <span className="text-xs text-slate-400 block mt-0.5">Oficinas principales</span>
                  </div>
                </div>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <span className="text-xs text-slate-400 font-medium block mb-3">Síguenos:</span>
              <div className="flex gap-2">
                {socialMedia.facebook && (
                  <a 
                    href={socialMedia.facebook} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-9 h-9 rounded-full bg-slate-700/50 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Facebook"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {socialMedia.instagram && (
                  <a 
                    href={socialMedia.instagram} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-9 h-9 rounded-full bg-slate-700/50 hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="Instagram"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {socialMedia.linkedin && (
                  <a 
                    href={socialMedia.linkedin} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-9 h-9 rounded-full bg-slate-700/50 hover:bg-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700/50">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Barmentech Seguros | Barmentech Web Designs
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/legal/privacidad" className="text-slate-400 hover:text-white transition-colors">
                Privacidad
              </Link>
              <Link href="/legal/terminos" className="text-slate-400 hover:text-white transition-colors">
                Términos
              </Link>
              <Link href="/support" className="text-slate-400 hover:text-white transition-colors">
                Soporte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
