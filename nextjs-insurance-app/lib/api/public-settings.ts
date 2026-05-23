export interface PublicPhoneNumber {
  country: string;
  phone: string;
}

export interface PublicSocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  whatsapp?: string;
}

export interface PageHeroConfig {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaAction?: 'link' | 'geo-whatsapp';
  textColor?: string;
  overlayOpacity?: number;
}

export interface PublicCompanySettings {
  companyName?: string;
  logoUrl?: string;
  faviconUrl?: string;
  website?: string;
  email?: string;
  phoneNumbers?: PublicPhoneNumber[];
  socialMedia?: PublicSocialMedia;
  businessAddress?: string;
  pageHeroes?: Record<string, PageHeroConfig>;
}

export type PublicLegalDocType =
  | 'privacy_policy'
  | 'terms_conditions'
  | 'refund_policy'
  | 'custom';

export interface PublicLegalDoc {
  id: string;
  type: PublicLegalDocType;
  title: string;
  slug: string;
  contentHtml: string;
  version: number;
  status: 'draft' | 'published' | 'archived';
  effectiveAt?: string | null;
  publishedAt?: string | null;
  updatedBy?: string | null;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api';

export async function getPublicCompanySettings(): Promise<PublicCompanySettings | null> {
  try {
    const response = await fetch(`${API_URL}/settings/public`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as PublicCompanySettings;
  } catch (error) {
    console.error('Error loading public company settings:', error);
    return null;
  }
}

export async function getPublicLegalDocByType(
  type: PublicLegalDocType,
): Promise<PublicLegalDoc | null> {
  try {
    const response = await fetch(`${API_URL}/settings/public/legal-docs/type/${type}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as PublicLegalDoc | null;
  } catch (error) {
    console.error('Error loading public legal doc by type:', error);
    return null;
  }
}

export async function getPublicLegalDocBySlug(
  slug: string,
): Promise<PublicLegalDoc | null> {
  try {
    const response = await fetch(`${API_URL}/settings/public/legal-docs/slug/${slug}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as PublicLegalDoc | null;
  } catch (error) {
    console.error('Error loading public legal doc by slug:', error);
    return null;
  }
}
