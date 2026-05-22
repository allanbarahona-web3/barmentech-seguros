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

export interface PublicCompanySettings {
  companyName?: string;
  logoUrl?: string;
  faviconUrl?: string;
  website?: string;
  email?: string;
  phoneNumbers?: PublicPhoneNumber[];
  socialMedia?: PublicSocialMedia;
  businessAddress?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
