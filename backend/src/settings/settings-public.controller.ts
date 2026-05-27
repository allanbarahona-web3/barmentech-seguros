import { BadRequestException, Controller, Get, Param, Req } from '@nestjs/common';
import type { Request } from 'express';
import { SettingsService } from './settings.service';
import { LegalDocType } from './dto';

const PUBLIC_LEGAL_DOC_TYPES: LegalDocType[] = [
  'privacy_policy',
  'terms_conditions',
  'refund_policy',
  'custom',
];

@Controller('settings')
export class SettingsPublicController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('public/contact-route')
  async getPublicContactRoute(@Req() req: Request) {
    const countryRaw =
      req?.headers?.['x-vercel-ip-country'] ||
      req?.headers?.['cf-ipcountry'] ||
      req?.headers?.['cloudfront-viewer-country'] ||
      req?.headers?.['x-country-code'];

    const detectedCountry =
      typeof countryRaw === 'string' && countryRaw.length === 2
        ? countryRaw.toUpperCase()
        : null;

    const route = await this.settingsService.resolveWhatsAppRoute(
      detectedCountry,
    );

    return { route };
  }

  @Get('public')
  async getPublicSettings() {
    const settings = await this.settingsService.getSettings();

    return {
      companyName: settings.companyName,
      logoUrl: settings.logoUrl,
      faviconUrl: settings.faviconUrl,
      website: settings.website,
      email: settings.email,
      phoneNumbers: settings.phoneNumbers,
      socialMedia: settings.socialMedia,
      businessAddress: settings.businessAddress,
      pageHeroes: settings.pageHeroes,
    };
  }

  @Get('public/legal-docs/type/:type')
  async getPublicLegalDocByType(@Param('type') type: string) {
    if (!PUBLIC_LEGAL_DOC_TYPES.includes(type as LegalDocType)) {
      throw new BadRequestException('Tipo de documento legal invalido');
    }

    return this.settingsService.getPublishedLegalDocByType(
      type as LegalDocType,
    );
  }

  @Get('public/legal-docs/slug/:slug')
  async getPublicLegalDocBySlug(@Param('slug') slug: string) {
    return this.settingsService.getPublishedLegalDocBySlug(slug);
  }
}
