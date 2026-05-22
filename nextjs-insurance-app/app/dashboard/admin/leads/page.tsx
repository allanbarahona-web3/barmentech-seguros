"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getLeads,
  getLeadsStats,
  updateLead,
  markLeadAsContacted,
  deleteLead,
  QuoteLead,
  QuoteLeadStatus,
  FilterLeadsParams,
} from '@/lib/api/leads';
import LeadStatusBadge from '@/components/admin/LeadStatusBadge';
import LeadDetailsModal from '@/components/admin/LeadDetailsModal';

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<QuoteLead[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLead, setSelectedLead] = useState<QuoteLead | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filtros
  const [filters, setFilters] = useState<FilterLeadsParams>({
    status: undefined,
    destination: undefined,
    hasEmail: undefined,
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    loadLeads();
    loadStats();
  }, [filters]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await getLeads(filters);
      setLeads(response.leads);
      setTotal(response.total);
      setPage(response.page);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      console.error('Error loading leads:', error);
      if (error.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getLeadsStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleMarkAsContacted = async (id: string) => {
    try {
      setActionLoading(id);
      await markLeadAsContacted(id);
      await loadLeads();
      await loadStats();
    } catch (error) {
      console.error('Error marking as contacted:', error);
      alert('Error al marcar como contactado');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateStatus = async (id: string, status: QuoteLeadStatus) => {
    try {
      setActionLoading(id);
      await updateLead(id, { status });
      await loadLeads();
      await loadStats();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar estado');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este lead?')) return;

    try {
      setActionLoading(id);
      await deleteLead(id);
      await loadLeads();
      await loadStats();
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Error al eliminar lead');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (lead: QuoteLead) => {
    setSelectedLead(lead);
    setShowDetailsModal(true);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleFilterChange = (key: keyof FilterLeadsParams, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      page: 1, // Reset to page 1 when filtering
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setFilters({
      status: undefined,
      destination: undefined,
      hasEmail: undefined,
      page: 1,
      limit: 20,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Gestión de Leads</h1>
          <p className="text-slate-600 mt-1">
            Prospectos capturados desde el modal de cotización
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
              <p className="text-xs text-blue-600 mb-1">Nuevos</p>
              <p className="text-2xl font-bold text-blue-900">{stats.byStatus.new}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
              <p className="text-xs text-yellow-600 mb-1">Contactados</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.byStatus.contacted}</p>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-200 p-4">
              <p className="text-xs text-green-600 mb-1">Convertidos</p>
              <p className="text-2xl font-bold text-green-900">{stats.byStatus.converted}</p>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-600 mb-1">Descartados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.byStatus.discarded}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Estado
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="">Todos</option>
                <option value="NEW">Nuevo</option>
                <option value="CONTACTED">Contactado</option>
                <option value="CONVERTED">Convertido</option>
                <option value="DISCARDED">Descartado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Destino
              </label>
              <input
                type="text"
                value={filters.destination || ''}
                onChange={(e) => handleFilterChange('destination', e.target.value)}
                placeholder="Buscar destino..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tiene Email
              </label>
              <select
                value={filters.hasEmail || ''}
                onChange={(e) => handleFilterChange('hasEmail', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="">Todos</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <p className="text-slate-500">Cargando leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500">No se encontraron leads</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                        Fecha
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                        Destino
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                        Viajeros / Edades
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {formatDate(lead.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900 font-medium">
                          {lead.destination || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          <span className="font-medium">{lead.totalTravelers}</span>
                          {lead.passengerAges && (
                            <span className="text-xs text-slate-500 ml-2">
                              ({lead.passengerAges})
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {lead.email ? (
                            <span className="text-slate-700">{lead.email}</span>
                          ) : (
                            <span className="text-slate-400 italic">Sin email</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <LeadStatusBadge status={lead.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewDetails(lead)}
                              className="px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50 rounded-lg"
                              disabled={actionLoading === lead.id}
                            >
                              Ver
                            </button>
                            {lead.status === 'NEW' && (
                              <button
                                onClick={() => handleMarkAsContacted(lead.id)}
                                className="px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 rounded-lg"
                                disabled={actionLoading === lead.id}
                              >
                                Contactar
                              </button>
                            )}
                            <select
                              value={lead.status}
                              onChange={(e) =>
                                handleUpdateStatus(lead.id, e.target.value as QuoteLeadStatus)
                              }
                              className="px-2 py-1 text-xs border border-slate-200 rounded-lg"
                              disabled={actionLoading === lead.id}
                            >
                              <option value="NEW">Nuevo</option>
                              <option value="CONTACTED">Contactado</option>
                              <option value="CONVERTED">Convertido</option>
                              <option value="DISCARDED">Descartado</option>
                            </select>
                            <button
                              onClick={() => handleDelete(lead.id)}
                              className="px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 rounded-lg"
                              disabled={actionLoading === lead.id}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-slate-200 px-4 py-3 flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    Mostrando {(page - 1) * 20 + 1} a {Math.min(page * 20, total)} de {total} leads
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <span className="text-sm text-slate-600">
                      Página {page} de {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedLead(null);
          }}
        />
      )}
    </div>
  );
}
