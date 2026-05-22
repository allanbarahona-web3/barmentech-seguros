'use client';

// MULTI-TENANT: Force dynamic rendering para que cada request use el tenantId del JWT
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface CoverageLevel {
  name: string;
  price: number;
  coverage: string;
  description: string;
}

interface AdditionalService {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription?: string;
  basePrice: number;
  pricingType: string;
  coverageLevels?: CoverageLevel[];
  iconUrl?: string;
  imageUrl?: string;
  isActive: boolean;
  displayOrder: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export default function AddOnsPage() {
  const [services, setServices] = useState<AdditionalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<AdditionalService | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [uploadingByService, setUploadingByService] = useState<
    Record<string, { icon: boolean; image: boolean }>
  >({});

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    shortDescription: '',
    fullDescription: '',
    basePrice: 0,
    pricingType: 'per_trip',
    isActive: true,
    displayOrder: 0,
    features: [''],
    coverageLevels: [{ name: '', price: 0, coverage: '', description: '' }],
  });

  useEffect(() => {
    fetchServices();
  }, [categoryFilter]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = categoryFilter !== 'all' ? `?category=${categoryFilter}&includeInactive=true` : '?includeInactive=true';
      const response = await apiClient.get(`/additional-services${params}`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service?: AdditionalService) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        slug: service.slug,
        category: service.category,
        shortDescription: service.shortDescription,
        fullDescription: service.fullDescription || '',
        basePrice: service.basePrice,
        pricingType: service.pricingType,
        isActive: service.isActive,
        displayOrder: service.displayOrder,
        features: service.features.length > 0 ? service.features : [''],
        coverageLevels: service.coverageLevels && service.coverageLevels.length > 0
          ? service.coverageLevels
          : [{ name: '', price: 0, coverage: '', description: '' }],
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        slug: '',
        category: '',
        shortDescription: '',
        fullDescription: '',
        basePrice: 0,
        pricingType: 'per_trip',
        isActive: true,
        displayOrder: services.length,
        features: [''],
        coverageLevels: [{ name: '', price: 0, coverage: '', description: '' }],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Clean empty features and coverage levels
      const cleanedData = {
        ...formData,
        features: formData.features.filter((f) => f.trim() !== ''),
        coverageLevels: formData.coverageLevels.filter(
          (cl) => cl.name.trim() !== '' || cl.coverage.trim() !== ''
        ),
      };

      if (editingService) {
        await apiClient.patch(`/additional-services/${editingService.id}`, cleanedData);
      } else {
        await apiClient.post('/additional-services', cleanedData);
      }

      handleCloseModal();
      fetchServices();
    } catch (error: any) {
      console.error('Error saving service:', error);
      alert(error.response?.data?.message || 'Error al guardar el servicio');
    }
  };

  const handleToggleActive = async (service: AdditionalService) => {
    try {
      await apiClient.patch(`/additional-services/${service.id}`, {
        isActive: !service.isActive,
      });
      fetchServices();
    } catch (error) {
      console.error('Error toggling service:', error);
    }
  };

  const handleDelete = async (service: AdditionalService) => {
    if (!confirm(`¿Eliminar "${service.name}"? Esta acción solo lo desactivará.`)) return;
    try {
      await apiClient.delete(`/additional-services/${service.id}`);
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const updateServiceInState = (serviceId: string, patch: Partial<AdditionalService>) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId ? { ...service, ...patch } : service,
      ),
    );

    if (editingService?.id === serviceId) {
      setEditingService({ ...editingService, ...patch });
    }
  };

  const handleAssetUpload = async (
    serviceId: string,
    assetType: 'icon' | 'image',
    file?: File,
  ) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten imágenes');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5MB');
      return;
    }

    try {
      setUploadingByService((prev) => ({
        ...prev,
        [serviceId]: {
          icon: assetType === 'icon' ? true : prev[serviceId]?.icon || false,
          image: assetType === 'image' ? true : prev[serviceId]?.image || false,
        },
      }));

      const formData = new FormData();
      formData.append(assetType, file);

      const endpoint =
        assetType === 'icon'
          ? `/additional-services/${serviceId}/upload-icon`
          : `/additional-services/${serviceId}/upload-image`;

      const response = await apiClient.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (assetType === 'icon' && response.data?.iconUrl) {
        updateServiceInState(serviceId, { iconUrl: response.data.iconUrl });
      }

      if (assetType === 'image' && response.data?.imageUrl) {
        updateServiceInState(serviceId, { imageUrl: response.data.imageUrl });
      }
    } catch (error: any) {
      console.error(`Error uploading ${assetType}:`, error);
      alert(error.response?.data?.message || `Error al cargar ${assetType}`);
    } finally {
      setUploadingByService((prev) => ({
        ...prev,
        [serviceId]: {
          icon: assetType === 'icon' ? false : prev[serviceId]?.icon || false,
          image: assetType === 'image' ? false : prev[serviceId]?.image || false,
        },
      }));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleAddFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleCoverageLevelChange = (
    index: number,
    field: keyof CoverageLevel,
    value: string | number
  ) => {
    const newLevels = [...formData.coverageLevels];
    newLevels[index] = { ...newLevels[index], [field]: value };
    setFormData({ ...formData, coverageLevels: newLevels });
  };

  const handleAddCoverageLevel = () => {
    setFormData({
      ...formData,
      coverageLevels: [
        ...formData.coverageLevels,
        { name: '', price: 0, coverage: '', description: '' },
      ],
    });
  };

  const handleRemoveCoverageLevel = (index: number) => {
    setFormData({
      ...formData,
      coverageLevels: formData.coverageLevels.filter((_, i) => i !== index),
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const categories = ['equipaje', 'salud', 'deportes', 'viaje', 'tecnologia', 'mascotas'];

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Servicios Adicionales</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Nuevo Servicio
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-4 py-2 rounded-lg transition ${
            categoryFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-lg transition capitalize ${
              categoryFilter === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className={`bg-white rounded-lg shadow p-6 border-2 ${
              service.isActive ? 'border-green-200' : 'border-gray-200'
            }`}
          >
            {service.imageUrl ? (
              <div className="w-full h-36 rounded-lg overflow-hidden mb-4 bg-gray-100">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}

            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  {service.iconUrl ? (
                    <img
                      src={service.iconUrl}
                      alt={`${service.name} icon`}
                      className="w-8 h-8 object-contain rounded"
                    />
                  ) : null}
                  {service.name}
                </h3>
                <span className="text-sm text-gray-500 capitalize">{service.category}</span>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  service.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {service.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4">{service.shortDescription}</p>

            <div className="mb-4">
              <span className="text-2xl font-bold text-blue-600">
                ${service.basePrice}
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {service.pricingType === 'per_trip' ? 'por viaje' : 'porcentaje'}
              </span>
            </div>

            {service.features && service.features.length > 0 && (
              <ul className="text-sm text-gray-600 mb-4 space-y-1">
                {service.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
                {service.features.length > 3 && (
                  <li className="text-gray-400 text-xs">
                    +{service.features.length - 3} más...
                  </li>
                )}
              </ul>
            )}

            <div className="grid grid-cols-1 gap-2 mb-4">
              <div>
                <input
                  id={`upload-icon-${service.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAssetUpload(service.id, 'icon', e.target.files?.[0])}
                />
                <label
                  htmlFor={`upload-icon-${service.id}`}
                  className="w-full inline-flex justify-center items-center px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition text-sm cursor-pointer"
                >
                  {uploadingByService[service.id]?.icon ? 'Subiendo icono...' : 'Subir / Cambiar Icono'}
                </label>
              </div>

              <div>
                <input
                  id={`upload-image-${service.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAssetUpload(service.id, 'image', e.target.files?.[0])}
                />
                <label
                  htmlFor={`upload-image-${service.id}`}
                  className="w-full inline-flex justify-center items-center px-3 py-2 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition text-sm cursor-pointer"
                >
                  {uploadingByService[service.id]?.image ? 'Subiendo imagen...' : 'Subir / Cambiar Imagen'}
                </label>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleOpenModal(service)}
                className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => handleToggleActive(service)}
                className={`flex-1 px-3 py-2 rounded-lg transition text-sm ${
                  service.isActive
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {service.isActive ? 'Desactivar' : 'Activar'}
              </button>
              <button
                onClick={() => handleDelete(service)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hay servicios adicionales. ¡Crea el primero!
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (generado automáticamente)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="capitalize">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Base *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, basePrice: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Precio
                  </label>
                  <select
                    value={formData.pricingType}
                    onChange={(e) => setFormData({ ...formData, pricingType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="per_trip">Por viaje</option>
                    <option value="percentage">Porcentaje</option>
                    <option value="per_day">Por día</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orden de Visualización
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Corta *
                </label>
                <input
                  type="text"
                  required
                  maxLength={150}
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción breve para tarjetas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Completa
                </label>
                <textarea
                  value={formData.fullDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, fullDescription: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descripción detallada opcional"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Características
                </label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Cobertura 24/7"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  + Agregar característica
                </button>
              </div>

              {/* Coverage Levels */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveles de Cobertura
                </label>
                {formData.coverageLevels.map((level, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={level.name}
                        onChange={(e) =>
                          handleCoverageLevelChange(index, 'name', e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Nombre (Ej: Básico)"
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={level.price}
                        onChange={(e) =>
                          handleCoverageLevelChange(index, 'price', parseFloat(e.target.value))
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Precio"
                      />
                      <input
                        type="text"
                        value={level.coverage}
                        onChange={(e) =>
                          handleCoverageLevelChange(index, 'coverage', e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Cobertura (Ej: USD 5,000)"
                      />
                      <input
                        type="text"
                        value={level.description}
                        onChange={(e) =>
                          handleCoverageLevelChange(index, 'description', e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Descripción"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCoverageLevel(index)}
                      className="mt-2 text-red-600 hover:text-red-700 text-sm"
                    >
                      Eliminar nivel
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddCoverageLevel}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  + Agregar nivel de cobertura
                </button>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Servicio activo</label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {editingService ? 'Guardar Cambios' : 'Crear Servicio'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
