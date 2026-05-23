"use client";

import { useState } from 'react';
import { QuoteLead } from '@/lib/api/leads';

interface LeadDetailsModalProps {
  lead: QuoteLead;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadDetailsModal({ lead, isOpen, onClose }: LeadDetailsModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-[90]">
      <div
        className="absolute inset-0 bg-slate-950/60"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">Detalle del Lead</h3>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-600 text-2xl"
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <div className="space-y-6">
              {/* Información del viaje */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Información del Viaje</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Destino</p>
                    <p className="text-sm font-medium text-slate-800">{lead.destination || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Viajeros</p>
                    <p className="text-sm font-medium text-slate-800">{lead.totalTravelers}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Fecha Inicio</p>
                    <p className="text-sm font-medium text-slate-800">{lead.startDate || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Fecha Fin</p>
                    <p className="text-sm font-medium text-slate-800">{lead.endDate || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-slate-500">Edades de Pasajeros</p>
                    <p className="text-sm font-medium text-slate-800">{lead.passengerAges || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Información de contacto */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Información de Contacto</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm font-medium text-slate-800">{lead.email || 'No proporcionado'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Quiere Cotización por Email</p>
                    <p className="text-sm font-medium text-slate-800">{lead.wantsEmailQuote ? 'Sí' : 'No'}</p>
                  </div>
                </div>
              </div>

              {/* Metadata de captura */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Metadata de Captura</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">País Detectado</p>
                    <p className="text-sm font-medium text-slate-800">{lead.detectedCountry || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Teléfono Enrutado</p>
                    <p className="text-sm font-medium text-slate-800">{lead.routedPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">IP</p>
                    <p className="text-xs font-medium text-slate-800 font-mono">{lead.ip || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Fecha de Captura</p>
                    <p className="text-sm font-medium text-slate-800">{formatDate(lead.createdAt)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-slate-500">URL Origen</p>
                    <p className="text-sm font-medium text-slate-800 truncate">{lead.sourceUrl || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-slate-500">User Agent</p>
                    <p className="text-xs text-slate-600 break-words">{lead.userAgent || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Seguimiento */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Seguimiento</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Contactado Por</p>
                    <p className="text-sm font-medium text-slate-800">
                      {lead.contactedBy?.fullName || 'No contactado aún'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Fecha de Contacto</p>
                    <p className="text-sm font-medium text-slate-800">{formatDate(lead.contactedAt)}</p>
                  </div>
                  {lead.notes && (
                    <div className="md:col-span-2">
                      <p className="text-xs text-slate-500">Notas</p>
                      <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{lead.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
