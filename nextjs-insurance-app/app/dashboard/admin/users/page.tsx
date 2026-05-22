'use client';

// MULTI-TENANT: Force dynamic rendering para que cada request use el tenantId del JWT
export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  isActivated: boolean;
  createdAt: string;
}

export default function UsersManagementPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'ADMIN' | 'AGENT' | 'CLIENT'>('all');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/users', {
        params: filter !== 'all' ? { role: filter } : {},
      });
      setUsers(response.data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const response = await apiClient.post('/users/agents', formData);
      setSuccess(response.data.message || 'Agente creado y email enviado exitosamente');
      setFormData({ email: '', fullName: '', phone: '' });
      setShowCreateModal(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear agente');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendActivation = async (userId: string) => {
    try {
      const response = await apiClient.post(`/users/${userId}/resend-activation`);
      setSuccess(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al reenviar email');
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      await apiClient.patch(`/users/${userId}`, { isActive: !isActive });
      setSuccess(`Usuario ${!isActive ? 'activado' : 'desactivado'} exitosamente`);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  const handleDeleteUser = async (targetUser: User) => {
    if (user?.id === targetUser.id) {
      setError('No puedes eliminar tu propio usuario');
      return;
    }

    const confirmed = window.confirm(
      `Esta accion eliminara permanentemente al usuario ${targetUser.fullName} (${targetUser.email}). Esta accion no se puede deshacer. ¿Deseas continuar?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await apiClient.delete(`/users/${targetUser.id}`);
      setSuccess('Usuario eliminado permanentemente');
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const filteredUsers = users;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-2">Administra agentes, clientes y permisos</p>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
            <button
              onClick={() => setSuccess(null)}
              className="float-right text-green-700 font-bold"
            >
              ×
            </button>
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
            <button onClick={() => setError(null)} className="float-right text-red-700 font-bold">
              ×
            </button>
          </div>
        )}

        {/* Actions Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({users.length})
            </button>
            <button
              onClick={() => setFilter('ADMIN')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'ADMIN'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Admins
            </button>
            <button
              onClick={() => setFilter('AGENT')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'AGENT'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Agentes
            </button>
            <button
              onClick={() => setFilter('CLIENT')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'CLIENT'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Clientes
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
          >
            + Crear Agente
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hay usuarios para mostrar
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{u.fullName}</div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                        {u.phone && <div className="text-xs text-gray-400">{u.phone}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'AGENT'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full w-fit ${
                            u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {u.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                        {u.role === 'AGENT' && !u.isActivated && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 w-fit">
                            Pendiente activación
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {u.role === 'AGENT' && !u.isActivated && (
                          <button
                            onClick={() => handleResendActivation(u.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Reenviar email de activación"
                          >
                            📧
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleActive(u.id, u.isActive)}
                          className={`${
                            u.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
                          title={u.isActive ? 'Desactivar usuario' : 'Activar usuario'}
                        >
                          {u.isActive ? '🔒' : '🔓'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="text-red-700 hover:text-red-900"
                          title="Eliminar usuario permanentemente"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Crear Nuevo Agente</h2>
            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="agente@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono (opcional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+506 1234-5678"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                <p className="font-semibold mb-1">📧 Email de Activación</p>
                <p>
                  Se enviará automáticamente un email con un enlace de activación válido por 48
                  horas.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ email: '', fullName: '', phone: '' });
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Creando...' : 'Crear Agente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
