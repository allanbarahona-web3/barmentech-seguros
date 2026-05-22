import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdateSettingsDto,
  UpdateBasicInfoDto,
  UpdatePhonesDto,
  UpdateSocialMediaDto,
  LegalDocType,
  LegalDocStatus,
  SaveLegalDocDto,
} from './dto';

export interface PhoneNumber {
  country: string;
  phone: string;
  isPrimary?: boolean;
  regionGroup?: string;
  language?: string;
  label?: string;
}

export interface ContactRouteResult {
  whatsappUrl: string | null;
  phone: string | null;
  matchedBy: 'americas-primary' | 'europe' | 'fallback-primary' | 'fallback-first' | 'none';
  detectedCountry: string | null;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  whatsapp?: string;
}

export interface PageHeroConfig {
  imageUrl?: string | null;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaAction?: 'geo-whatsapp' | 'link';
  textColor?: string;
}

export interface LegalDocument {
  id: string;
  type: LegalDocType;
  title: string;
  slug: string;
  contentHtml: string;
  version: number;
  status: LegalDocStatus;
  effectiveAt?: string | null;
  publishedAt?: string | null;
  updatedBy?: string | null;
  updatedAt: string;
}

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  private isMissingLegalDocsColumnError(error: any): boolean {
    return (
      error?.code === 'P2022' &&
      String(error?.meta?.driverAdapterError?.cause?.column || '').includes(
        'company_settings.legal_docs',
      )
    );
  }

  private getSettingsBaseSelect() {
    return {
      id: true,
      companyName: true,
      legalId: true,
      logoUrl: true,
      faviconUrl: true,
      signatureUrl: true,
      pageHeroes: true,
      website: true,
      email: true,
      phoneNumbers: true,
      socialMedia: true,
      businessAddress: true,
      legalRepName: true,
      legalRepId: true,
      createdAt: true,
      updatedAt: true,
    } as const;
  }

  private async getSettingsWithoutLegalDocs() {
    const baseSelect = this.getSettingsBaseSelect();

    let settings = await this.prisma.companySettings.findFirst({
      select: baseSelect,
    });

    if (!settings) {
      settings = await this.prisma.companySettings.create({
        data: {
          companyName: 'Barmentech Seguros',
          phoneNumbers: [],
          socialMedia: {},
          pageHeroes: {},
        },
        select: baseSelect,
      });
    }

    return {
      ...settings,
      legalDocs: [],
    };
  }

  private static readonly LEGAL_DOC_TYPES: LegalDocType[] = [
    'privacy_policy',
    'terms_conditions',
    'refund_policy',
    'custom',
  ];

  private static readonly EUROPE_ISO_CODES = new Set([
    'AL', 'AD', 'AM', 'AT', 'AZ', 'BA', 'BE', 'BG', 'BY', 'CH', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FO', 'FR',
    'GB', 'GE', 'GI', 'GR', 'HR', 'HU', 'IE', 'IS', 'IT', 'LI', 'LT', 'LU', 'LV', 'MC', 'MD', 'ME', 'MK', 'MT', 'NL',
    'NO', 'PL', 'PT', 'RO', 'RS', 'RU', 'SE', 'SI', 'SK', 'SM', 'TR', 'UA', 'UK', 'VA',
  ]);

  private static readonly AMERICAS_ISO_CODES = new Set([
    'AG', 'AI', 'AR', 'AW', 'BB', 'BL', 'BM', 'BO', 'BQ', 'BR', 'BS', 'BZ', 'CA', 'CL', 'CO', 'CR', 'CU', 'CW', 'DM',
    'DO', 'EC', 'FK', 'GD', 'GF', 'GL', 'GP', 'GT', 'GY', 'HN', 'HT', 'JM', 'KN', 'KY', 'LC', 'MF', 'MQ', 'MS', 'MX',
    'NI', 'PA', 'PE', 'PM', 'PR', 'PY', 'SR', 'SV', 'SX', 'TC', 'TT', 'US', 'UY', 'VC', 'VE', 'VG', 'VI',
  ]);

  private normalizeText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  private sanitizePhone(value?: string): string {
    return (value || '').replace(/\D/g, '');
  }

  private sanitizeLegalHtml(value?: string): string {
    const raw = String(value || '');
    // Sanitización mínima de scripts/event handlers para MVP
    return raw
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/on[a-z]+\s*=\s*"[^"]*"/gi, '')
      .replace(/on[a-z]+\s*=\s*'[^']*'/gi, '')
      .replace(/javascript:/gi, '')
      .trim();
  }

  private sanitizeSlug(value?: string): string {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private ensureLegalDocType(type: string): LegalDocType {
    if (!SettingsService.LEGAL_DOC_TYPES.includes(type as LegalDocType)) {
      throw new Error('Tipo de documento legal inválido');
    }
    return type as LegalDocType;
  }

  private getLegalDocsFromSettings(settings: any): LegalDocument[] {
    const raw = Array.isArray(settings?.legalDocs) ? settings.legalDocs : [];
    return raw
      .map((item: any) => ({
        id: String(item?.id || ''),
        type: (item?.type || 'custom') as LegalDocType,
        title: String(item?.title || ''),
        slug: String(item?.slug || ''),
        contentHtml: String(item?.contentHtml || ''),
        version: Number(item?.version || 1),
        status: (item?.status || 'draft') as LegalDocStatus,
        effectiveAt: item?.effectiveAt ? String(item.effectiveAt) : null,
        publishedAt: item?.publishedAt ? String(item.publishedAt) : null,
        updatedBy: item?.updatedBy ? String(item.updatedBy) : null,
        updatedAt: String(item?.updatedAt || new Date().toISOString()),
      }))
      .filter((item: LegalDocument) => item.id && item.type && item.title);
  }

  private buildDefaultTitle(type: LegalDocType): string {
    switch (type) {
      case 'privacy_policy':
        return 'Política de Privacidad';
      case 'terms_conditions':
        return 'Términos y Condiciones';
      case 'refund_policy':
        return 'Política de Reembolso';
      default:
        return 'Documento Legal';
    }
  }

  private buildDefaultSlug(type: LegalDocType): string {
    switch (type) {
      case 'privacy_policy':
        return 'privacidad';
      case 'terms_conditions':
        return 'terminos';
      case 'refund_policy':
        return 'reembolso';
      default:
        return 'documento-legal';
    }
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private markdownToHtml(markdown: string): string {
    const normalized = String(markdown || '').replace(/\r\n/g, '\n').trim();
    if (!normalized) {
      return '';
    }

    const blocks = normalized
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => {
        const lines = block.split('\n').map((line) => line.trim());
        const first = lines[0] || '';

        if (first.startsWith('### ')) {
          return `<h3>${this.escapeHtml(first.replace(/^###\s+/, ''))}</h3>`;
        }
        if (first.startsWith('## ')) {
          return `<h2>${this.escapeHtml(first.replace(/^##\s+/, ''))}</h2>`;
        }
        if (first.startsWith('# ')) {
          return `<h1>${this.escapeHtml(first.replace(/^#\s+/, ''))}</h1>`;
        }

        if (lines.every((line) => /^[-*]\s+/.test(line))) {
          const items = lines
            .map((line) => line.replace(/^[-*]\s+/, '').trim())
            .map((item) => `<li>${this.escapeHtml(item)}</li>`)
            .join('');
          return `<ul>${items}</ul>`;
        }

        const paragraph = lines
          .map((line) => this.escapeHtml(line))
          .join('<br/>');
        return `<p>${paragraph}</p>`;
      });

    return blocks.join('\n');
  }

  private getMarkdownPathByType(type: LegalDocType): string | null {
    const base = resolve(process.cwd(), '..', 'nextjs-insurance-app');
    if (type === 'privacy_policy') {
      return resolve(base, 'Politicas de Privacidad.md');
    }
    if (type === 'terms_conditions') {
      return resolve(base, 'Terminos y Condiciones Generales.md');
    }
    return null;
  }

  private buildWhatsAppUrl(phone?: string): string | null {
    const digits = this.sanitizePhone(phone);
    return digits ? `https://wa.me/${digits}` : null;
  }

  private isEuropeByCountryName(country?: string): boolean {
    const normalized = this.normalizeText(country || '');
    if (!normalized) {
      return false;
    }

    const europeanNames = [
      'europa', 'europe', 'espana', 'francia', 'alemania', 'italia', 'portugal', 'reino unido',
      'united kingdom', 'uk', 'paises bajos', 'belgica', 'suiza', 'austria', 'suecia', 'noruega',
      'dinamarca', 'finlandia', 'irlanda', 'polonia', 'grecia', 'republica checa', 'hungri',
      'rumania', 'ucrania', 'rusia', 'serbia', 'croacia', 'eslovaquia', 'eslovenia', 'lituania',
      'letonia', 'estonia', 'islandia', 'malta', 'luxemburgo', 'andorra', 'monaco',
    ];

    return europeanNames.some((name) => normalized.includes(name));
  }

  private pickPrimaryPhone(phones: PhoneNumber[]): PhoneNumber | null {
    if (phones.length === 0) {
      return null;
    }

    const explicitPrimary = phones.find((p) => p.isPrimary === true);
    return explicitPrimary || phones[0];
  }

  private pickEuropePhone(phones: PhoneNumber[]): PhoneNumber | null {
    const byRegion = phones.find((p) => this.normalizeText(p.regionGroup || '') === 'europe');
    if (byRegion) {
      return byRegion;
    }

    const byCountryName = phones.find((p) => this.isEuropeByCountryName(p.country));
    if (byCountryName) {
      return byCountryName;
    }

    return null;
  }

  async resolveWhatsAppRoute(detectedCountry: string | null): Promise<ContactRouteResult> {
    const settings = await this.getSettings();
    const rawPhones = ((settings.phoneNumbers || []) as any[]) || [];
    const phones = rawPhones
      .map((p) => ({
        country: String(p?.country || ''),
        phone: String(p?.phone || ''),
        isPrimary: p?.isPrimary === true,
        regionGroup: typeof p?.regionGroup === 'string' ? p.regionGroup : undefined,
        language: typeof p?.language === 'string' ? p.language : undefined,
        label: typeof p?.label === 'string' ? p.label : undefined,
      }))
      .filter((p) => this.sanitizePhone(p.phone).length > 0);

    const primaryPhone = this.pickPrimaryPhone(phones);
    const europePhone = this.pickEuropePhone(phones);
    const countryCode = (detectedCountry || '').trim().toUpperCase();

    if (countryCode && SettingsService.AMERICAS_ISO_CODES.has(countryCode) && primaryPhone) {
      return {
        whatsappUrl: this.buildWhatsAppUrl(primaryPhone.phone),
        phone: this.sanitizePhone(primaryPhone.phone),
        matchedBy: 'americas-primary',
        detectedCountry: countryCode,
      };
    }

    if (countryCode && SettingsService.EUROPE_ISO_CODES.has(countryCode) && europePhone) {
      return {
        whatsappUrl: this.buildWhatsAppUrl(europePhone.phone),
        phone: this.sanitizePhone(europePhone.phone),
        matchedBy: 'europe',
        detectedCountry: countryCode,
      };
    }

    if (primaryPhone) {
      return {
        whatsappUrl: this.buildWhatsAppUrl(primaryPhone.phone),
        phone: this.sanitizePhone(primaryPhone.phone),
        matchedBy: 'fallback-primary',
        detectedCountry: countryCode || null,
      };
    }

    if (europePhone) {
      return {
        whatsappUrl: this.buildWhatsAppUrl(europePhone.phone),
        phone: this.sanitizePhone(europePhone.phone),
        matchedBy: 'fallback-first',
        detectedCountry: countryCode || null,
      };
    }

    const socialWhatsapp = this.buildWhatsAppUrl((settings.socialMedia as SocialMedia | null)?.whatsapp);
    if (socialWhatsapp) {
      return {
        whatsappUrl: socialWhatsapp,
        phone: this.sanitizePhone((settings.socialMedia as SocialMedia | null)?.whatsapp),
        matchedBy: 'fallback-first',
        detectedCountry: countryCode || null,
      };
    }

    return {
      whatsappUrl: null,
      phone: null,
      matchedBy: 'none',
      detectedCountry: countryCode || null,
    };
  }

  async getSettings() {
    try {
      // Siempre debe haber un solo registro de settings
      let settings = await this.prisma.companySettings.findFirst();

      if (!settings) {
        // Crear settings por defecto si no existe
        settings = await this.prisma.companySettings.create({
          data: {
            companyName: 'Barmentech Seguros',
            phoneNumbers: [],
            socialMedia: {},
            pageHeroes: {},
          },
        });
      }

      return settings;
    } catch (error: any) {
      if (this.isMissingLegalDocsColumnError(error)) {
        // Compatibilidad temporal para entornos donde aún no se aplicó la migración legal_docs
        return this.getSettingsWithoutLegalDocs();
      }

      throw error;
    }
  }

  async updateSettings(data: UpdateSettingsDto) {
    const existing = await this.getSettings();
    
    // Convertir tipos correctamente para Prisma
    const updateData: any = { ...data };
    if (data.phoneNumbers) {
      updateData.phoneNumbers = data.phoneNumbers as any;
    }
    if (data.socialMedia) {
      updateData.socialMedia = data.socialMedia as any;
    }
    if (data.pageHeroes) {
      const existingPageHeroes = (existing.pageHeroes || {}) as Record<string, PageHeroConfig>;
      const incomingPageHeroes = data.pageHeroes as Record<string, PageHeroConfig>;
      const mergedPageHeroes: Record<string, PageHeroConfig> = {
        ...existingPageHeroes,
      };

      for (const [pageKey, heroPatch] of Object.entries(incomingPageHeroes)) {
        mergedPageHeroes[pageKey] = {
          ...(existingPageHeroes[pageKey] || {}),
          ...(heroPatch || {}),
        };
      }

      updateData.pageHeroes = mergedPageHeroes as any;
    }
    
    return this.prisma.companySettings.update({
      where: { id: existing.id },
      data: updateData,
    });
  }

  async updateBasicInfo(data: UpdateBasicInfoDto) {
    return this.updateSettings({
      companyName: data.companyName,
      email: data.email,
      legalId: data.legalId,
      website: data.website,
      businessAddress: data.businessAddress,
      legalRepName: data.legalRepName,
      legalRepId: data.legalRepId,
    });
  }

  async updatePhones(data: UpdatePhonesDto) {
    const normalizedPhones = (data.phoneNumbers || [])
      .map((phone) => ({
        country: String(phone.country || '').trim(),
        phone: String(phone.phone || '').trim(),
        isPrimary: phone.isPrimary === true,
        regionGroup: phone.regionGroup ? String(phone.regionGroup).trim() : undefined,
      }))
      .filter((phone) => phone.phone !== '');

    if (normalizedPhones.length > 0 && !normalizedPhones.some((phone) => phone.isPrimary)) {
      normalizedPhones[0].isPrimary = true;
    }

    return this.updateSettings({
      phoneNumbers: normalizedPhones,
    });
  }

  async updateSocialMedia(data: UpdateSocialMediaDto) {
    return this.updateSettings({
      socialMedia: {
        facebook: data.socialMedia?.facebook,
        instagram: data.socialMedia?.instagram,
        twitter: data.socialMedia?.twitter,
        linkedin: data.socialMedia?.linkedin,
        whatsapp: data.socialMedia?.whatsapp,
      },
    });
  }

  // Helper para obtener un teléfono específico por país
  async getPhoneByCountry(country: string): Promise<PhoneNumber | null> {
    const settings = await this.getSettings();
    const phones = (settings.phoneNumbers as any) as PhoneNumber[];
    return phones.find(p => p.country.toLowerCase() === country.toLowerCase()) || null;
  }

  async updatePageHero(pageKey: string, patch: Partial<PageHeroConfig>) {
    const settings = await this.getSettings();
    const currentPageHeroes = (settings.pageHeroes || {}) as Record<string, PageHeroConfig>;
    const currentHero = currentPageHeroes[pageKey] || {};

    return this.prisma.companySettings.update({
      where: { id: settings.id },
      data: {
        pageHeroes: {
          ...currentPageHeroes,
          [pageKey]: {
            ...currentHero,
            ...patch,
          },
        } as any,
      },
    });
  }

  async listLegalDocs() {
    const settings = await this.getSettings();
    const docs = this.getLegalDocsFromSettings(settings);
    return docs.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type.localeCompare(b.type);
      }
      return b.version - a.version;
    });
  }

  async getPublishedLegalDocByType(type: LegalDocType): Promise<LegalDocument | null> {
    const settings = await this.getSettings();
    const docs = this.getLegalDocsFromSettings(settings);

    const published = docs
      .filter((doc) => doc.type === type && doc.status === 'published')
      .sort((a, b) => b.version - a.version);

    return published[0] || null;
  }

  async getPublishedLegalDocBySlug(slug: string): Promise<LegalDocument | null> {
    const normalizedSlug = this.sanitizeSlug(slug);
    const settings = await this.getSettings();
    const docs = this.getLegalDocsFromSettings(settings);

    const published = docs
      .filter((doc) => this.sanitizeSlug(doc.slug) === normalizedSlug && doc.status === 'published')
      .sort((a, b) => b.version - a.version);

    return published[0] || null;
  }

  async saveLegalDocDraft(payload: SaveLegalDocDto, actorUserId?: string) {
    const settings = await this.getSettings();
    const docs = this.getLegalDocsFromSettings(settings);
    const nowIso = new Date().toISOString();
    const type = this.ensureLegalDocType(payload.type);

    const normalizedTitle = String(payload.title || '').trim() || this.buildDefaultTitle(type);
    const normalizedSlug =
      this.sanitizeSlug(payload.slug) || this.buildDefaultSlug(type);
    const sanitizedHtml = this.sanitizeLegalHtml(payload.contentHtml);

    if (!sanitizedHtml) {
      throw new Error('El contenido del documento legal no puede estar vacío');
    }

    let updatedDocs = docs;

    if (payload.id) {
      const index = docs.findIndex((doc) => doc.id === payload.id);
      if (index === -1) {
        throw new Error('Documento legal no encontrado');
      }

      const current = docs[index];
      const nextVersion = current.version + 1;

      updatedDocs = [
        ...docs.slice(0, index),
        {
          ...current,
          type,
          title: normalizedTitle,
          slug: normalizedSlug,
          contentHtml: sanitizedHtml,
          version: nextVersion,
          status: 'draft',
          effectiveAt: payload.effectiveAt || null,
          updatedBy: actorUserId || null,
          updatedAt: nowIso,
        },
        ...docs.slice(index + 1),
      ];
    } else {
      updatedDocs = [
        ...docs,
        {
          id: randomUUID(),
          
          type,
          title: normalizedTitle,
          slug: normalizedSlug,
          contentHtml: sanitizedHtml,
          version: 1,
          status: 'draft',
          effectiveAt: payload.effectiveAt || null,
          publishedAt: null,
          updatedBy: actorUserId || null,
          updatedAt: nowIso,
        },
      ];
    }

    const saved = await this.prisma.companySettings.update({
      where: { id: settings.id },
      data: {
        legalDocs: updatedDocs as any,
      },
    });

    return this.getLegalDocsFromSettings(saved);
  }

  async publishLegalDoc(id: string, actorUserId?: string) {
    const settings = await this.getSettings();
    const docs = this.getLegalDocsFromSettings(settings);
    const target = docs.find((doc) => doc.id === id);

    if (!target) {
      throw new Error('Documento legal no encontrado');
    }

    const nowIso = new Date().toISOString();

    const updatedDocs = docs.map((doc) => {
      if (doc.type !== target.type) {
        return doc;
      }

      if (doc.id === id) {
        return {
          ...doc,
          status: 'published' as LegalDocStatus,
          publishedAt: nowIso,
          updatedBy: actorUserId || null,
          updatedAt: nowIso,
        };
      }

      if (doc.status === 'published') {
        return {
          ...doc,
          status: 'archived' as LegalDocStatus,
          updatedBy: actorUserId || null,
          updatedAt: nowIso,
        };
      }

      return doc;
    });

    const saved = await this.prisma.companySettings.update({
      where: { id: settings.id },
      data: {
        legalDocs: updatedDocs as any,
      },
    });

    return this.getLegalDocsFromSettings(saved);
  }

  async archiveLegalDoc(id: string, actorUserId?: string) {
    const settings = await this.getSettings();
    const docs = this.getLegalDocsFromSettings(settings);
    const nowIso = new Date().toISOString();

    let found = false;
    const updatedDocs = docs.map((doc) => {
      if (doc.id !== id) {
        return doc;
      }

      found = true;
      return {
        ...doc,
        status: 'archived' as LegalDocStatus,
        updatedBy: actorUserId || null,
        updatedAt: nowIso,
      };
    });

    if (!found) {
      throw new Error('Documento legal no encontrado');
    }

    const saved = await this.prisma.companySettings.update({
      where: { id: settings.id },
      data: {
        legalDocs: updatedDocs as any,
      },
    });

    return this.getLegalDocsFromSettings(saved);
  }

  async deleteLegalDoc(id: string) {
    const settings = await this.getSettings();
    const docs = this.getLegalDocsFromSettings(settings);

    const updatedDocs = docs.filter((doc) => doc.id !== id);
    if (updatedDocs.length === docs.length) {
      throw new Error('Documento legal no encontrado');
    }

    const saved = await this.prisma.companySettings.update({
      where: { id: settings.id },
      data: {
        legalDocs: updatedDocs as any,
      },
    });

    return this.getLegalDocsFromSettings(saved);
  }

  async bootstrapLegalDocsFromMarkdown(actorUserId?: string, force = false) {
    const settings = await this.getSettings();
    const docs = this.getLegalDocsFromSettings(settings);

    const targetTypes: LegalDocType[] = ['privacy_policy', 'terms_conditions'];
    let updatedDocs = [...docs];
    const nowIso = new Date().toISOString();

    for (const type of targetTypes) {
      const existsPublished = updatedDocs.some(
        (doc) => doc.type === type && doc.status === 'published',
      );

      if (existsPublished && !force) {
        continue;
      }

      const mdPath = this.getMarkdownPathByType(type);
      if (!mdPath) {
        continue;
      }

      let markdown = '';
      try {
        markdown = await fs.readFile(mdPath, 'utf8');
      } catch {
        continue;
      }

      const contentHtml = this.markdownToHtml(markdown);
      if (!contentHtml) {
        continue;
      }

      const baseTitle = this.buildDefaultTitle(type);
      const baseSlug = this.buildDefaultSlug(type);
      const maxVersion = updatedDocs
        .filter((doc) => doc.type === type)
        .reduce((acc, doc) => Math.max(acc, Number(doc.version || 0)), 0);

      // Archivar cualquier published anterior del mismo tipo
      updatedDocs = updatedDocs.map((doc) => {
        if (doc.type === type && doc.status === 'published') {
          return {
            ...doc,
            status: 'archived' as LegalDocStatus,
            updatedBy: actorUserId || null,
            updatedAt: nowIso,
          };
        }
        return doc;
      });

      updatedDocs.push({
        id: randomUUID(),
        type,
        title: baseTitle,
        slug: baseSlug,
        contentHtml,
        version: maxVersion + 1,
        status: 'published',
        effectiveAt: nowIso,
        publishedAt: nowIso,
        updatedBy: actorUserId || null,
        updatedAt: nowIso,
      });
    }

    const saved = await this.prisma.companySettings.update({
      where: { id: settings.id },
      data: {
        legalDocs: updatedDocs as any,
      },
    });

    return this.getLegalDocsFromSettings(saved);
  }
}
