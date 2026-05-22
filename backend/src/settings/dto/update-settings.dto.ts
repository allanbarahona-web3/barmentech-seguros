import { IsString, IsEmail, IsUrl, IsArray, IsObject, IsOptional, IsIn } from 'class-validator';

export type LegalDocType =
  | 'privacy_policy'
  | 'terms_conditions'
  | 'refund_policy'
  | 'custom';

export type LegalDocStatus = 'draft' | 'published' | 'archived';

export interface LegalDocumentDto {
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

export interface PhoneNumberDto {
  country: string;
  phone: string;
  isPrimary?: boolean;
  regionGroup?: string;
}

export interface SocialMediaDto {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  whatsapp?: string;
}

export interface PageHeroConfigDto {
  imageUrl?: string | null;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaAction?: 'geo-whatsapp' | 'link';
  textColor?: string;
  overlayOpacity?: number | string;
}

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @IsOptional()
  @IsString()
  legalId?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL de logo inválida' })
  logoUrl?: string | null;

  @IsOptional()
  @IsUrl({}, { message: 'URL de favicon inválida' })
  faviconUrl?: string | null;

  @IsOptional()
  @IsUrl({}, { message: 'URL de firma inválida' })
  signatureUrl?: string | null;

  @IsOptional()
  @IsArray({ message: 'phoneNumbers debe ser un array' })
  phoneNumbers?: PhoneNumberDto[];

  @IsOptional()
  @IsObject({ message: 'socialMedia debe ser un objeto' })
  socialMedia?: SocialMediaDto;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  businessAddress?: string;

  @IsOptional()
  @IsString()
  legalRepName?: string;

  @IsOptional()
  @IsString()
  legalRepId?: string;

  @IsOptional()
  @IsObject({ message: 'pageHeroes debe ser un objeto' })
  pageHeroes?: Record<string, PageHeroConfigDto>;

  @IsOptional()
  @IsArray({ message: 'legalDocs debe ser un array' })
  legalDocs?: LegalDocumentDto[];
}

export class SaveLegalDocDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsIn(['privacy_policy', 'terms_conditions', 'refund_policy', 'custom'], {
    message: 'type inválido',
  })
  type: LegalDocType;

  @IsString({ message: 'title es requerido' })
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString({ message: 'contentHtml es requerido' })
  contentHtml: string;

  @IsOptional()
  @IsString()
  effectiveAt?: string;
}

export class LegalDocIdParamDto {
  @IsString({ message: 'id inválido' })
  id: string;
}

export class UpdatePageHeroDto {
  @IsString({ message: 'pageKey es requerido' })
  pageKey: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  ctaText?: string;

  @IsOptional()
  @IsString()
  ctaUrl?: string;

  @IsOptional()
  @IsIn(['geo-whatsapp', 'link'], { message: 'ctaAction inválido' })
  ctaAction?: 'geo-whatsapp' | 'link';

  @IsOptional()
  @IsString()
  textColor?: string;

  @IsOptional()
  overlayOpacity?: number | string;
}

export class UpdateBasicInfoDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @IsOptional()
  @IsString()
  legalId?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  businessAddress?: string;

  @IsOptional()
  @IsString()
  legalRepName?: string;

  @IsOptional()
  @IsString()
  legalRepId?: string;
}

export class UpdatePhonesDto {
  @IsArray({ message: 'phoneNumbers debe ser un array' })
  phoneNumbers: PhoneNumberDto[];
}

export class UpdateSocialMediaDto {
  @IsObject({ message: 'socialMedia debe ser un objeto' })
  socialMedia: SocialMediaDto;
}
