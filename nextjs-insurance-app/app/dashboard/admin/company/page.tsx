'use client';

// MULTI-TENANT: Force dynamic rendering para que cada request use el tenantId del JWT
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface PhoneNumber {
  country: string;
  phone: string;
  isPrimary?: boolean;
  regionGroup?: string;
}

interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  whatsapp?: string;
}

interface PageHeroConfig {
  imageUrl?: string | null;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaAction?: 'geo-whatsapp' | 'link';
  textColor?: string;
  overlayOpacity?: number;
}

// Lista de países para el selector
const COUNTRIES = [
  'Costa Rica',
  'Panamá',
  'Nicaragua',
  'Honduras',
  'Guatemala',
  'El Salvador',
  'Belice',
  'México',
  'Estados Unidos',
  'Canadá',
  'Argentina',
  'Bolivia',
  'Brasil',
  'Chile',
  'Colombia',
  'Ecuador',
  'Paraguay',
  'Perú',
  'Uruguay',
  'Venezuela',
  'Cuba',
  'República Dominicana',
  'Puerto Rico',
  'Jamaica',
  'Haití',
  'España',
  'Francia',
  'Alemania',
  'Italia',
  'Portugal',
  'Reino Unido',
  'Países Bajos',
  'Bélgica',
  'Suiza',
  'Austria',
  'Suecia',
  'Noruega',
  'Dinamarca',
  'Finlandia',
  'Irlanda',
  'Polonia',
  'Grecia',
  'República Checa',
  'Hungría',
  'Rumania',
  'Rusia',
  'Ucrania',
  'China',
  'Japón',
  'Corea del Sur',
  'India',
  'Tailandia',
  'Vietnam',
  'Singapur',
  'Malasia',
  'Filipinas',
  'Indonesia',
  'Australia',
  'Nueva Zelanda',
  'Sudáfrica',
  'Egipto',
  'Marruecos',
  'Kenia',
  'Nigeria',
  'Israel',
  'Emiratos Árabes Unidos',
  'Arabia Saudita',
  'Turquía',
].sort();

interface CompanySettings {
  id: string;
  companyName: string;
  legalId?: string;
  logoUrl?: string;
  faviconUrl?: string;
  signatureUrl?: string;
  website?: string;
  email?: string;
  phoneNumbers: PhoneNumber[];
  socialMedia: SocialMedia;
  pageHeroes?: Record<string, PageHeroConfig>;
  businessAddress?: string;
  legalRepName?: string;
  legalRepId?: string;
}

type LegalDocType = 'privacy_policy' | 'terms_conditions' | 'refund_policy' | 'custom';

interface LegalDocument {
  id: string;
  type: LegalDocType;
  title: string;
  slug: string;
  contentHtml: string;
  version: number;
  status: 'draft' | 'published' | 'archived';
  effectiveAt?: string | null;
  publishedAt?: string | null;
  updatedAt: string;
}

const LEGAL_DOC_TYPE_OPTIONS: Array<{ value: LegalDocType; label: string; defaultTitle: string; defaultSlug: string }> = [
  { value: 'privacy_policy', label: 'Política de Privacidad', defaultTitle: 'Política de Privacidad', defaultSlug: 'privacidad' },
  { value: 'terms_conditions', label: 'Términos y Condiciones', defaultTitle: 'Términos y Condiciones', defaultSlug: 'terminos' },
  { value: 'refund_policy', label: 'Política de Reembolso', defaultTitle: 'Política de Reembolso', defaultSlug: 'reembolso' },
  { value: 'custom', label: 'Documento Personalizado', defaultTitle: 'Documento Legal', defaultSlug: 'documento-legal' },
];

export default function CompanySettingsPage() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingBasicInfo, setSavingBasicInfo] = useState(false);
  const [savingPhones, setSavingPhones] = useState(false);
  const [savingSocialMedia, setSavingSocialMedia] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingSignature, setUploadingSignature] = useState(false);
  const [uploadingAdditionalServicesHero, setUploadingAdditionalServicesHero] = useState(false);
  const [savingAdditionalServicesHero, setSavingAdditionalServicesHero] = useState(false);
  const [savedSnapshots, setSavedSnapshots] = useState({
    basicInfo: '',
    hero: '',
    phones: '',
    socialMedia: '',
  });
  const [legalDocs, setLegalDocs] = useState<LegalDocument[]>([]);
  const [loadingLegalDocs, setLoadingLegalDocs] = useState(false);
  const [savingLegalDoc, setSavingLegalDoc] = useState(false);
  const [publishingLegalDoc, setPublishingLegalDoc] = useState(false);
  const [deletingLegalDoc, setDeletingLegalDoc] = useState(false);
  const [bootstrappingLegalDocs, setBootstrappingLegalDocs] = useState(false);
  const [legalDocId, setLegalDocId] = useState<string | null>(null);
  const [legalDocType, setLegalDocType] = useState<LegalDocType>('privacy_policy');
  const [legalDocTitle, setLegalDocTitle] = useState('Política de Privacidad');
  const [legalDocSlug, setLegalDocSlug] = useState('privacidad');
  const [legalDocContent, setLegalDocContent] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    companyName: '',
    legalId: '',
    website: '',
    email: '',
    businessAddress: '',
    legalRepName: '',
    legalRepId: '',
    additionalServicesHeroTitle: '',
    additionalServicesHeroSubtitle: '',
    additionalServicesHeroCtaText: '',
    additionalServicesHeroCtaUrl: '',
    additionalServicesHeroCtaAction: 'geo-whatsapp' as 'geo-whatsapp' | 'link',
    additionalServicesHeroTextColor: '#ffffff',
    additionalServicesHeroOverlayOpacity: 0.45,
    phoneNumbers: [{ country: '', phone: '', isPrimary: true, regionGroup: '' }] as PhoneNumber[],
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
      whatsapp: '',
    } as SocialMedia,
  });

  useEffect(() => {
    fetchSettings();
    fetchLegalDocs();
  }, []);

  const fetchLegalDocs = async () => {
    try {
      setLoadingLegalDocs(true);
      const response = await apiClient.get('/settings/legal-docs');
      const docs = (response.data || []) as LegalDocument[];
      setLegalDocs(docs);

      if (!legalDocId && docs.length > 0) {
        const preferred =
          docs.find((doc) => doc.type === 'privacy_policy' && doc.status === 'published') ||
          docs.find((doc) => doc.type === 'privacy_policy') ||
          docs[0];

        if (preferred) {
          selectLegalDoc(preferred);
        }
      }
    } catch (error) {
      console.error('Error loading legal docs:', error);
    } finally {
      setLoadingLegalDocs(false);
    }
  };

  const selectLegalDoc = (doc: LegalDocument) => {
    setLegalDocId(doc.id);
    setLegalDocType(doc.type);
    setLegalDocTitle(doc.title || '');
    setLegalDocSlug(doc.slug || '');
    setLegalDocContent(doc.contentHtml || '');
  };

  const resetLegalDocFormByType = (type: LegalDocType) => {
    const option = LEGAL_DOC_TYPE_OPTIONS.find((item) => item.value === type);
    setLegalDocId(null);
    setLegalDocType(type);
    setLegalDocTitle(option?.defaultTitle || 'Documento Legal');
    setLegalDocSlug(option?.defaultSlug || 'documento-legal');
    setLegalDocContent('');
  };

  const handleSaveLegalDocDraft = async () => {
    if (!legalDocTitle.trim()) {
      alert('El título del documento es requerido');
      return;
    }
    if (!legalDocContent.trim()) {
      alert('El contenido del documento es requerido');
      return;
    }

    try {
      setSavingLegalDoc(true);
      const payload = {
        id: legalDocId || undefined,
        type: legalDocType,
        title: legalDocTitle,
        slug: legalDocSlug,
        contentHtml: legalDocContent,
      };

      if (legalDocId) {
        await apiClient.put(`/settings/legal-docs/${legalDocId}`, payload);
      } else {
        await apiClient.post('/settings/legal-docs', payload);
      }

      alert('✅ Documento legal guardado como borrador');
      await fetchLegalDocs();
    } catch (error: any) {
      console.error('Error saving legal doc draft:', error);
      alert(error.response?.data?.message || 'Error al guardar el documento legal');
    } finally {
      setSavingLegalDoc(false);
    }
  };

  const handlePublishLegalDoc = async () => {
    if (!legalDocId) {
      alert('Guarda primero el borrador para poder publicarlo');
      return;
    }

    try {
      setPublishingLegalDoc(true);
      await apiClient.post(`/settings/legal-docs/${legalDocId}/publish`);
      alert('✅ Documento legal publicado');
      await fetchLegalDocs();
    } catch (error: any) {
      console.error('Error publishing legal doc:', error);
      alert(error.response?.data?.message || 'Error al publicar el documento legal');
    } finally {
      setPublishingLegalDoc(false);
    }
  };

  const handleDeleteLegalDoc = async () => {
    if (!legalDocId) {
      alert('Selecciona un documento para eliminar');
      return;
    }

    const confirmed = confirm(
      '¿Seguro que deseas eliminar este documento legal? Esta acción no se puede deshacer.',
    );
    if (!confirmed) {
      return;
    }

    try {
      setDeletingLegalDoc(true);
      await apiClient.delete(`/settings/legal-docs/${legalDocId}`);
      alert('✅ Documento legal eliminado');

      resetLegalDocFormByType('privacy_policy');
      await fetchLegalDocs();
    } catch (error: any) {
      console.error('Error deleting legal doc:', error);
      alert(error.response?.data?.message || 'Error al eliminar el documento legal');
    } finally {
      setDeletingLegalDoc(false);
    }
  };

  const handleBootstrapLegalDocs = async () => {
    try {
      setBootstrappingLegalDocs(true);
      await apiClient.post('/settings/legal-docs/bootstrap-from-md');
      alert('✅ Carga inicial desde .md completada');
      await fetchLegalDocs();
    } catch (error: any) {
      console.error('Error bootstrapping legal docs:', error);
      alert(error.response?.data?.message || 'Error al cargar documentos iniciales');
    } finally {
      setBootstrappingLegalDocs(false);
    }
  };

  const getBasicInfoSnapshot = (data: typeof formData) =>
    JSON.stringify({
      companyName: (data.companyName || '').trim(),
      legalId: (data.legalId || '').trim(),
      website: (data.website || '').trim(),
      email: (data.email || '').trim(),
      businessAddress: (data.businessAddress || '').trim(),
      legalRepName: (data.legalRepName || '').trim(),
      legalRepId: (data.legalRepId || '').trim(),
    });

  const getHeroSnapshot = (data: typeof formData) =>
    JSON.stringify({
      title: (data.additionalServicesHeroTitle || '').trim(),
      subtitle: (data.additionalServicesHeroSubtitle || '').trim(),
      ctaText: (data.additionalServicesHeroCtaText || '').trim(),
      ctaUrl: (data.additionalServicesHeroCtaUrl || '').trim(),
      ctaAction: data.additionalServicesHeroCtaAction || 'geo-whatsapp',
      textColor: (data.additionalServicesHeroTextColor || '').trim().toLowerCase(),
      overlayOpacity: Number(data.additionalServicesHeroOverlayOpacity || 0),
    });

  const getPhonesSnapshot = (data: typeof formData) =>
    JSON.stringify(
      data.phoneNumbers
        .map((p) => ({
          country: (p.country || '').trim(),
          phone: (p.phone || '').trim(),
          isPrimary: p.isPrimary === true,
          regionGroup: (p.regionGroup || '').trim().toUpperCase(),
        }))
        .filter((p) => p.phone !== ''),
    );

  const getSocialMediaSnapshot = (data: typeof formData) =>
    JSON.stringify({
      facebook: (data.socialMedia.facebook || '').trim(),
      instagram: (data.socialMedia.instagram || '').trim(),
      twitter: (data.socialMedia.twitter || '').trim(),
      linkedin: (data.socialMedia.linkedin || '').trim(),
      whatsapp: (data.socialMedia.whatsapp || '').trim(),
    });

  const renderSectionStatusBadge = (isDirty: boolean) => (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full border ${
        isDirty
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
      }`}
    >
      {isDirty ? 'Cambios pendientes' : 'Sin cambios'}
    </span>
  );

  const basicInfoDirty = getBasicInfoSnapshot(formData) !== savedSnapshots.basicInfo;
  const heroDirty = getHeroSnapshot(formData) !== savedSnapshots.hero;
  const phonesDirty = getPhonesSnapshot(formData) !== savedSnapshots.phones;
  const socialMediaDirty = getSocialMediaSnapshot(formData) !== savedSnapshots.socialMedia;

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/settings');
      setSettings(response.data);
      
      console.log('📥 Datos cargados desde el servidor:', response.data);
      
      const nextFormData: typeof formData = {
        companyName: response.data.companyName || '',
        legalId: response.data.legalId || '',
        website: response.data.website || '',
        email: response.data.email || '',
        businessAddress: response.data.businessAddress || '',
        legalRepName: response.data.legalRepName || '',
        legalRepId: response.data.legalRepId || '',
        additionalServicesHeroTitle: response.data.pageHeroes?.['additional-services']?.title || '',
        additionalServicesHeroSubtitle: response.data.pageHeroes?.['additional-services']?.subtitle || '',
        additionalServicesHeroCtaText: response.data.pageHeroes?.['additional-services']?.ctaText || '',
        additionalServicesHeroCtaUrl: response.data.pageHeroes?.['additional-services']?.ctaUrl || '',
        additionalServicesHeroCtaAction:
          response.data.pageHeroes?.['additional-services']?.ctaAction === 'link' ? 'link' : 'geo-whatsapp',
        additionalServicesHeroTextColor:
          response.data.pageHeroes?.['additional-services']?.textColor === 'dark'
            ? '#0f172a'
            : response.data.pageHeroes?.['additional-services']?.textColor === 'light'
              ? '#ffffff'
              : response.data.pageHeroes?.['additional-services']?.textColor || '#ffffff',
        additionalServicesHeroOverlayOpacity:
          typeof response.data.pageHeroes?.['additional-services']?.overlayOpacity === 'number'
            ? Math.max(0, Math.min(1, response.data.pageHeroes['additional-services'].overlayOpacity as number))
            : 0.45,
        phoneNumbers: response.data.phoneNumbers?.length > 0 
          ? response.data.phoneNumbers.map((p: PhoneNumber, index: number) => ({
              country: p.country || '',
              phone: p.phone || '',
              isPrimary: p.isPrimary === true || index === 0,
              regionGroup: p.regionGroup || '',
            }))
          : [{ country: '', phone: '', isPrimary: true, regionGroup: '' }],
        socialMedia: {
          facebook: response.data.socialMedia?.facebook || '',
          instagram: response.data.socialMedia?.instagram || '',
          twitter: response.data.socialMedia?.twitter || '',
          linkedin: response.data.socialMedia?.linkedin || '',
          whatsapp: response.data.socialMedia?.whatsapp || '',
        },
      };

      // Populate form
      setFormData(nextFormData);
      setSavedSnapshots({
        basicInfo: getBasicInfoSnapshot(nextFormData),
        hero: getHeroSnapshot(nextFormData),
        phones: getPhonesSnapshot(nextFormData),
        socialMedia: getSocialMediaSnapshot(nextFormData),
      });
      
      console.log('📝 Formulario poblado con datos');
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBasicInfo = async () => {
    try {
      setSavingBasicInfo(true);
      await apiClient.put('/settings/basic-info', {
        companyName: formData.companyName,
        legalId: formData.legalId,
        website: formData.website,
        email: formData.email,
        businessAddress: formData.businessAddress,
        legalRepName: formData.legalRepName,
        legalRepId: formData.legalRepId,
      });

      alert('✅ Información básica guardada');
      fetchSettings();
    } catch (error: any) {
      console.error('❌ Error saving basic info:', error);
      console.error('Detalles del error:', error.response?.data);
      alert(error.response?.data?.message || 'Error al guardar la información básica');
    } finally {
      setSavingBasicInfo(false);
    }
  };

  const handleSavePhones = async () => {
    try {
      setSavingPhones(true);

      const cleanedPhoneNumbers = formData.phoneNumbers
        .map((p) => ({
          country: (p.country || '').trim(),
          phone: (p.phone || '').trim(),
          isPrimary: p.isPrimary === true,
          regionGroup: (p.regionGroup || '').trim() || undefined,
        }))
        .filter((p) => p.phone !== '');

      if (cleanedPhoneNumbers.length > 0 && !cleanedPhoneNumbers.some((p) => p.isPrimary)) {
        cleanedPhoneNumbers[0].isPrimary = true;
      }

      await apiClient.put('/settings/phones', {
        phoneNumbers: cleanedPhoneNumbers,
      });

      alert('✅ Teléfonos guardados');
      fetchSettings();
    } catch (error: any) {
      console.error('❌ Error saving phones:', error);
      console.error('Detalles del error:', error.response?.data);
      alert(error.response?.data?.message || 'Error al guardar los teléfonos');
    } finally {
      setSavingPhones(false);
    }
  };

  const handleSaveSocialMedia = async () => {
    try {
      setSavingSocialMedia(true);

      await apiClient.put('/settings/social-media', {
        socialMedia: {
          facebook: formData.socialMedia.facebook,
          instagram: formData.socialMedia.instagram,
          twitter: formData.socialMedia.twitter,
          linkedin: formData.socialMedia.linkedin,
          whatsapp: formData.socialMedia.whatsapp,
        },
      });

      alert('✅ Redes sociales guardadas');
      fetchSettings();
    } catch (error: any) {
      console.error('❌ Error saving social media:', error);
      console.error('Detalles del error:', error.response?.data);
      alert(error.response?.data?.message || 'Error al guardar redes sociales');
    } finally {
      setSavingSocialMedia(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image
    if (!file.type.startsWith('image/')) {
      alert('❌ Solo se permiten imágenes');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('❌ El logo no debe exceder 5MB');
      return;
    }

    try {
      setUploadingLogo(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/settings/upload-logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('✅ Logo cargado exitosamente');
      fetchSettings();
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      alert(error.response?.data?.message || 'Error al cargar el logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image
    if (!file.type.startsWith('image/')) {
      alert('❌ Solo se permiten imágenes');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('❌ La firma no debe exceder 5MB');
      return;
    }

    try {
      setUploadingSignature(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/settings/upload-signature', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('✅ Firma cargada exitosamente');
      fetchSettings();
    } catch (error: any) {
      console.error('Error uploading signature:', error);
      alert(error.response?.data?.message || 'Error al cargar la firma');
    } finally {
      setUploadingSignature(false);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image
    if (!file.type.startsWith('image/')) {
      alert('❌ Solo se permiten imágenes');
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      alert('❌ El favicon no debe exceder 1MB');
      return;
    }

    try {
      setUploadingFavicon(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/settings/upload-favicon', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('✅ Favicon cargado exitosamente');
      fetchSettings();
    } catch (error: any) {
      console.error('Error uploading favicon:', error);
      alert(error.response?.data?.message || 'Error al cargar el favicon');
    } finally {
      setUploadingFavicon(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!confirm('¿Estás seguro de eliminar el logo? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setUploadingLogo(true);
      await apiClient.delete('/settings/delete-logo');
      alert('✅ Logo eliminado exitosamente');
      fetchSettings();
    } catch (error: any) {
      console.error('Error deleting logo:', error);
      alert(error.response?.data?.message || 'Error al eliminar el logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleDeleteFavicon = async () => {
    if (!confirm('¿Estás seguro de eliminar el favicon? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setUploadingFavicon(true);
      await apiClient.delete('/settings/delete-favicon');
      alert('✅ Favicon eliminado exitosamente');
      fetchSettings();
    } catch (error: any) {
      console.error('Error deleting favicon:', error);
      alert(error.response?.data?.message || 'Error al eliminar el favicon');
    } finally {
      setUploadingFavicon(false);
    }
  };

  const handleDeleteSignature = async () => {
    if (!confirm('¿Estás seguro de eliminar la firma? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setUploadingSignature(true);
      await apiClient.delete('/settings/delete-signature');
      alert('✅ Firma eliminada exitosamente');
      fetchSettings();
    } catch (error: any) {
      console.error('Error deleting signature:', error);
      alert(error.response?.data?.message || 'Error al eliminar la firma');
    } finally {
      setUploadingSignature(false);
    }
  };

  const handleAdditionalServicesHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('❌ Solo se permiten imágenes');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('❌ La imagen del hero no debe exceder 5MB');
      return;
    }

    try {
      setUploadingAdditionalServicesHero(true);
      const payload = new FormData();
      payload.append('file', file);
      payload.append('pageKey', 'additional-services');

      await apiClient.post('/settings/upload-page-hero-image', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('✅ Hero de Servicios Adicionales cargado exitosamente');
      fetchSettings();
    } catch (error: any) {
      console.error('Error uploading additional services hero:', error);
      alert(error.response?.data?.message || 'Error al cargar la imagen del hero');
    } finally {
      setUploadingAdditionalServicesHero(false);
    }
  };

  const handleDeleteAdditionalServicesHero = async () => {
    if (!confirm('¿Estás seguro de eliminar la imagen del hero de Servicios Adicionales?')) {
      return;
    }

    try {
      setUploadingAdditionalServicesHero(true);
      await apiClient.delete('/settings/delete-page-hero-image?pageKey=additional-services');
      alert('✅ Imagen del hero eliminada exitosamente');
      fetchSettings();
    } catch (error: any) {
      console.error('Error deleting additional services hero:', error);
      alert(error.response?.data?.message || 'Error al eliminar la imagen del hero');
    } finally {
      setUploadingAdditionalServicesHero(false);
    }
  };

  const handleSaveAdditionalServicesHeroConfig = async () => {
    try {
      setSavingAdditionalServicesHero(true);

      await apiClient.put('/settings/page-hero', {
        pageKey: 'additional-services',
        title: formData.additionalServicesHeroTitle,
        subtitle: formData.additionalServicesHeroSubtitle,
        ctaText: formData.additionalServicesHeroCtaText,
        ctaUrl: formData.additionalServicesHeroCtaUrl || '',
        ctaAction: formData.additionalServicesHeroCtaAction,
        textColor: formData.additionalServicesHeroTextColor,
        overlayOpacity: Number(formData.additionalServicesHeroOverlayOpacity || 0),
      });

      alert('✅ Configuración del hero guardada exitosamente');
      fetchSettings();
    } catch (error: any) {
      console.error('Error saving additional services hero config:', error);
      alert(error.response?.data?.message || 'Error al guardar la configuración del hero');
    } finally {
      setSavingAdditionalServicesHero(false);
    }
  };

  const addPhoneNumber = () => {
    setFormData({
      ...formData,
      phoneNumbers: [...formData.phoneNumbers, { country: '', phone: '', isPrimary: false, regionGroup: '' }],
    });
  };

  const removePhoneNumber = (index: number) => {
    const updated = formData.phoneNumbers.filter((_, i) => i !== index);
    setFormData({ ...formData, phoneNumbers: updated });
  };

  const updatePhoneNumber = (index: number, field: 'country' | 'phone' | 'regionGroup', value: string) => {
    const updated = [...formData.phoneNumbers];
    updated[index][field] = value;
    setFormData({ ...formData, phoneNumbers: updated });
  };

  const setPrimaryPhoneNumber = (index: number) => {
    const updated = formData.phoneNumbers.map((phone, i) => ({
      ...phone,
      isPrimary: i === index,
    }));
    setFormData({ ...formData, phoneNumbers: updated });
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <div className="p-6 flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración de Empresa</h1>
        <p className="text-gray-600 mt-2">
          Administra la información de BarmenTech Seguros que se mostrará en el sitio web, emails y documentos.
        </p>
      </div>

      <div className="space-y-8">
        {/* Información Básica */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">business</span>
              Información Básica
            </h2>
            {renderSectionStatusBadge(basicInfoDirty)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Empresa *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cédula Jurídica
              </label>
              <input
                type="text"
                value={formData.legalId}
                onChange={(e) => setFormData({ ...formData, legalId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="3-101-123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sitio Web
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.tuempresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Corporativo
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="info@tuempresa.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección Comercial
              </label>
              <textarea
                value={formData.businessAddress}
                onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Dirección completa de la empresa"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSaveBasicInfo}
              disabled={savingBasicInfo || !basicInfoDirty}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {savingBasicInfo ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">save</span>
                  Guardar Información Básica
                </>
              )}
            </button>
          </div>
        </div>

        {/* Logo, Favicon y Firma */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">image</span>
            Logo, Favicon y Firma Digital
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Logo de la Empresa
              </label>
              
              {settings?.logoUrl ? (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <img
                    src={settings.logoUrl}
                    alt="Logo actual"
                    className="max-h-48 mx-auto object-contain"
                  />
                  <p className="text-xs text-gray-500 text-center mt-2">Logo actual</p>
                </div>
              ) : (
                <div className="mb-4 p-4 bg-yellow-50 rounded-lg border-2 border-dashed border-yellow-300">
                  <div className="flex flex-col items-center justify-center text-yellow-700">
                    <span className="material-symbols-outlined text-3xl mb-2">image</span>
                    <p className="text-xs font-medium">Sin logo configurado</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg border-2 border-blue-200 hover:bg-blue-100 transition-colors">
                    <span className="material-symbols-outlined text-sm">upload</span>
                    <span className="font-medium text-sm">
                      {uploadingLogo ? 'Subiendo...' : 'Seleccionar'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={uploadingLogo}
                  />
                </label>
                {settings?.logoUrl && (
                  <button
                    onClick={handleDeleteLogo}
                    disabled={uploadingLogo}
                    className="px-3 py-3 bg-red-50 text-red-600 rounded-lg border-2 border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                    title="Eliminar logo"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, WEBP. Máx 5MB. Recomendado: 500x500px
              </p>
            </div>

            {/* Favicon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Favicon (Ícono del sitio)
              </label>
              
              {settings?.faviconUrl ? (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <img
                    src={settings.faviconUrl}
                    alt="Favicon actual"
                    className="max-h-48 mx-auto object-contain"
                  />
                  <p className="text-xs text-gray-500 text-center mt-2">Favicon actual</p>
                </div>
              ) : (
                <div className="mb-4 p-4 bg-yellow-50 rounded-lg border-2 border-dashed border-yellow-300">
                  <div className="flex flex-col items-center justify-center text-yellow-700">
                    <span className="material-symbols-outlined text-3xl mb-2">tab</span>
                    <p className="text-xs font-medium">Sin favicon configurado</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg border-2 border-blue-200 hover:bg-blue-100 transition-colors">
                    <span className="material-symbols-outlined text-sm">upload</span>
                    <span className="font-medium text-sm">
                      {uploadingFavicon ? 'Subiendo...' : 'Seleccionar'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFaviconUpload}
                    className="hidden"
                    disabled={uploadingFavicon}
                  />
                </label>
                {settings?.faviconUrl && (
                  <button
                    onClick={handleDeleteFavicon}
                    disabled={uploadingFavicon}
                    className="px-3 py-3 bg-red-50 text-red-600 rounded-lg border-2 border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                    title="Eliminar favicon"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                ICO, PNG, JPG o WEBP. Máx 1MB. Recomendado: 32x32px o 64x64px
              </p>
            </div>

            {/* Firma */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Firma Digital
              </label>
              
              {settings?.signatureUrl ? (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <img
                    src={settings.signatureUrl}
                    alt="Firma actual"
                    className="max-h-48 mx-auto object-contain"
                  />
                  <p className="text-xs text-gray-500 text-center mt-2">Firma actual</p>
                </div>
              ) : (
                <div className="mb-4 p-4 bg-yellow-50 rounded-lg border-2 border-dashed border-yellow-300">
                  <div className="flex flex-col items-center justify-center text-yellow-700">
                    <span className="material-symbols-outlined text-3xl mb-2">draw</span>
                    <p className="text-xs font-medium">Sin firma configurada</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg border-2 border-blue-200 hover:bg-blue-100 transition-colors">
                    <span className="material-symbols-outlined text-sm">upload</span>
                    <span className="font-medium text-sm">
                      {uploadingSignature ? 'Subiendo...' : 'Seleccionar'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="hidden"
                    disabled={uploadingSignature}
                  />
                </label>
                {settings?.signatureUrl && (
                  <button
                    onClick={handleDeleteSignature}
                    disabled={uploadingSignature}
                    className="px-3 py-3 bg-red-50 text-red-600 rounded-lg border-2 border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                    title="Eliminar firma"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Para emails, cotizaciones y PDFs. Fondo transparente recomendado.
              </p>
            </div>
          </div>
        </div>

        {/* Hero por Página: Servicios Adicionales */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">view_carousel</span>
              Hero - Servicios Adicionales
            </h2>
            {renderSectionStatusBadge(heroDirty)}
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Corresponde a la página pública <strong>/servicios-adicionales</strong>. Esta configuración no afecta otras páginas.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Imagen Hero (ancho completo)
              </label>

              {settings?.pageHeroes?.['additional-services']?.imageUrl ? (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <img
                    src={settings.pageHeroes['additional-services'].imageUrl || ''}
                    alt="Hero actual de Servicios Adicionales"
                    className="w-full h-40 object-cover rounded"
                  />
                  <p className="text-xs text-gray-500 text-center mt-2">Hero actual</p>
                </div>
              ) : (
                <div className="mb-4 p-4 bg-yellow-50 rounded-lg border-2 border-dashed border-yellow-300">
                  <div className="flex flex-col items-center justify-center text-yellow-700">
                    <span className="material-symbols-outlined text-3xl mb-2">landscape</span>
                    <p className="text-xs font-medium">Sin imagen de hero configurada</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg border-2 border-blue-200 hover:bg-blue-100 transition-colors">
                    <span className="material-symbols-outlined text-sm">upload</span>
                    <span className="font-medium text-sm">
                      {uploadingAdditionalServicesHero ? 'Subiendo...' : 'Cargar/Reemplazar'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAdditionalServicesHeroUpload}
                    className="hidden"
                    disabled={uploadingAdditionalServicesHero}
                  />
                </label>
                {settings?.pageHeroes?.['additional-services']?.imageUrl && (
                  <button
                    type="button"
                    onClick={handleDeleteAdditionalServicesHero}
                    disabled={uploadingAdditionalServicesHero}
                    className="px-3 py-3 bg-red-50 text-red-600 rounded-lg border-2 border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                    title="Eliminar imagen hero"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Se almacena en WebP automáticamente. Recomendado: 2560x1000px (mínimo 1920x750px), máximo 5MB.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Hero
                </label>
                <input
                  type="text"
                  value={formData.additionalServicesHeroTitle}
                  onChange={(e) => setFormData({ ...formData, additionalServicesHeroTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Servicios Adicionales"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtítulo del Hero
                </label>
                <textarea
                  value={formData.additionalServicesHeroSubtitle}
                  onChange={(e) => setFormData({ ...formData, additionalServicesHeroSubtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Protege tu viaje con coberturas adicionales diseñadas para cada necesidad."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color del Texto del Hero
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.additionalServicesHeroTextColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          additionalServicesHeroTextColor: e.target.value,
                        })
                      }
                      className="h-11 w-16 p-1 border border-gray-300 rounded-lg cursor-pointer bg-white"
                      title="Selecciona un color"
                    />
                    <input
                      type="text"
                      value={formData.additionalServicesHeroTextColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          additionalServicesHeroTextColor: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intensidad del Azul (Transparencia)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round((formData.additionalServicesHeroOverlayOpacity || 0) * 100)}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          additionalServicesHeroOverlayOpacity: Number(e.target.value) / 100,
                        })
                      }
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>0% (sin azul)</span>
                      <span className="font-semibold">
                        {Math.round((formData.additionalServicesHeroOverlayOpacity || 0) * 100)}%
                      </span>
                      <span>100% (azul fuerte)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto del Botón (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.additionalServicesHeroCtaText}
                    onChange={(e) => setFormData({ ...formData, additionalServicesHeroCtaText: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Cotizar ahora"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Acción del Botón
                  </label>
                  <select
                    value={formData.additionalServicesHeroCtaAction}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additionalServicesHeroCtaAction: e.target.value as 'geo-whatsapp' | 'link',
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="geo-whatsapp">WhatsApp geolocalizado</option>
                    <option value="link">Enlace personalizado</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    WhatsApp geolocalizado usa la regla por país. Enlace personalizado abre la URL configurada.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL del Botón (opcional)
                  </label>
                  <input
                    type="url"
                    value={formData.additionalServicesHeroCtaUrl}
                    onChange={(e) => setFormData({ ...formData, additionalServicesHeroCtaUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={formData.additionalServicesHeroCtaAction === 'link' ? 'https://example.com' : 'https://wa.me/70067572'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Si eliges WhatsApp geolocalizado, esta URL se usa solo como fallback opcional.
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSaveAdditionalServicesHeroConfig}
              disabled={savingAdditionalServicesHero || !heroDirty}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {savingAdditionalServicesHero ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando Hero...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">save</span>
                  Guardar Hero de esta Página
                </>
              )}
            </button>
          </div>
        </div>

        {/* Teléfonos */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">phone</span>
                Teléfonos de Contacto
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Enrutamiento automático: América completa usa el número principal. Europa usa el número marcado como región Europa.
              </p>
            </div>
            {renderSectionStatusBadge(phonesDirty)}
            <button
              type="button"
              onClick={addPhoneNumber}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Agregar Teléfono
            </button>
          </div>

          <div className="space-y-4">
            {formData.phoneNumbers.map((phone, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start border border-gray-200 rounded-lg p-4">
                <div className="flex-1">
                  <select
                    value={phone.country}
                    onChange={(e) => updatePhoneNumber(index, 'country', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Seleccionar país...</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <input
                    type="tel"
                    value={phone.phone}
                    onChange={(e) => updatePhoneNumber(index, 'phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+506 8888-8888"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formato internacional con código de país: +506 1234-5678
                  </p>
                </div>
                <div>
                  <select
                    value={phone.regionGroup || ''}
                    onChange={(e) => updatePhoneNumber(index, 'regionGroup', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Auto por país</option>
                    <option value="AMERICAS">Américas</option>
                    <option value="EUROPE">Europa</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Europa permite número dedicado.</p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    id={`primary-phone-${index}`}
                    type="radio"
                    name="primary-phone"
                    checked={phone.isPrimary === true}
                    onChange={() => setPrimaryPhoneNumber(index)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor={`primary-phone-${index}`} className="text-sm text-gray-700 font-medium">
                    Número principal
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => removePhoneNumber(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSavePhones}
              disabled={savingPhones || !phonesDirty}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {savingPhones ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">save</span>
                  Guardar Teléfonos
                </>
              )}
            </button>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">share</span>
              Redes Sociales
            </h2>
            {renderSectionStatusBadge(socialMediaDirty)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook
              </label>
              <input
                type="url"
                value={formData.socialMedia.facebook}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialMedia: { ...formData.socialMedia, facebook: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://facebook.com/tuempresa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={formData.socialMedia.instagram}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialMedia: { ...formData.socialMedia, instagram: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://instagram.com/tuempresa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter
              </label>
              <input
                type="url"
                value={formData.socialMedia.twitter}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialMedia: { ...formData.socialMedia, twitter: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://twitter.com/tuempresa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.socialMedia.linkedin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialMedia: { ...formData.socialMedia, linkedin: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://linkedin.com/company/tuempresa"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Business
              </label>
              <input
                type="tel"
                value={formData.socialMedia.whatsapp}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialMedia: { ...formData.socialMedia, whatsapp: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+506 8888-8888"
              />
              <p className="text-xs text-gray-500 mt-1">
                Usa formato internacional para enlaces directos (ej: +506 1234-5678 para Costa Rica)
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSaveSocialMedia}
              disabled={savingSocialMedia || !socialMediaDirty}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {savingSocialMedia ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">save</span>
                  Guardar Redes Sociales
                </>
              )}
            </button>
          </div>
        </div>

        {/* Documentos Legales */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">gavel</span>
              Documentos Legales
            </h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-slate-50 text-slate-700 border-slate-200">
              Privacidad / Términos / Reembolso / Custom
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 border border-gray-200 rounded-lg p-4">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo para nuevo documento</label>
                <select
                  value={legalDocType}
                  onChange={(e) => resetLegalDocFormByType(e.target.value as LegalDocType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  {LEGAL_DOC_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => resetLegalDocFormByType(legalDocType)}
                  className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Nuevo borrador de este tipo
                </button>
                <button
                  type="button"
                  onClick={handleBootstrapLegalDocs}
                  disabled={bootstrappingLegalDocs}
                  className="mt-2 w-full px-3 py-2 text-sm border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 disabled:opacity-50"
                >
                  {bootstrappingLegalDocs ? 'Cargando...' : 'Cargar inicial desde .md'}
                </button>
              </div>

              <div className="max-h-80 overflow-auto space-y-2">
                {loadingLegalDocs ? (
                  <p className="text-sm text-gray-500">Cargando documentos...</p>
                ) : legalDocs.length === 0 ? (
                  <p className="text-sm text-gray-500">No hay documentos legales creados.</p>
                ) : (
                  legalDocs.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => selectLegalDoc(doc)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        legalDocId === doc.id
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <p className="text-sm font-semibold text-gray-900">{doc.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{doc.type} · v{doc.version}</p>
                      <p className="text-xs mt-1">
                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            doc.status === 'published'
                              ? 'bg-emerald-100 text-emerald-700'
                              : doc.status === 'archived'
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-2 border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <input
                    type="text"
                    value={legalDocTitle}
                    onChange={(e) => setLegalDocTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Título del documento"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug público</label>
                  <input
                    type="text"
                    value={legalDocSlug}
                    onChange={(e) => setLegalDocSlug(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="ejemplo-politica"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contenido (HTML permitido)</label>
                <textarea
                  value={legalDocContent}
                  onChange={(e) => setLegalDocContent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  rows={16}
                  placeholder="Pega aquí el contenido legal"
                />
              </div>

              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={handleDeleteLegalDoc}
                  disabled={deletingLegalDoc || !legalDocId}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {deletingLegalDoc ? 'Eliminando...' : 'Eliminar'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveLegalDocDraft}
                  disabled={savingLegalDoc}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
                >
                  {savingLegalDoc ? 'Guardando...' : 'Guardar borrador'}
                </button>
                <button
                  type="button"
                  onClick={handlePublishLegalDoc}
                  disabled={publishingLegalDoc || !legalDocId}
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  {publishingLegalDoc ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={fetchSettings}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Recargar Datos
          </button>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
