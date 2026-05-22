import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsPublicController {
  constructor(private readonly settingsService: SettingsService) {}

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
    };
  }
}
