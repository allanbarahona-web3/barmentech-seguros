import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { MailService } from './mail/mail.service';
import { SettingsService } from './settings/settings.service';
import { QuoteLeadsService } from './quote-leads/quote-leads.service';

interface RegisterQuoteLeadBody {
  destination?: string;
  startDate?: string;
  endDate?: string;
  totalTravelers?: number;
  passengerAges?: string;
  wantsEmailQuote?: boolean;
  email?: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailService: MailService,
    private readonly settingsService: SettingsService,
    private readonly quoteLeadsService: QuoteLeadsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('quote-leads/public-intake')
  async registerPublicQuoteLead(@Body() body: RegisterQuoteLeadBody, @Req() req: any) {
    const destination = String(body.destination || '').trim() || 'No especificado';
    const startDate = String(body.startDate || '').trim();
    const endDate = String(body.endDate || '').trim();
    const totalTravelers = Number(body.totalTravelers || 1) || 1;
    const passengerAges = String(body.passengerAges || '').trim();
    const wantsEmailQuote = Boolean(body.wantsEmailQuote);
    const email = String(body.email || '').trim();

    const countryRaw =
      req?.headers?.['x-vercel-ip-country'] ||
      req?.headers?.['cf-ipcountry'] ||
      req?.headers?.['cloudfront-viewer-country'] ||
      req?.headers?.['x-country-code'];
    const detectedCountry =
      typeof countryRaw === 'string' && countryRaw.length === 2
        ? countryRaw.toUpperCase()
        : null;

    const route = await this.settingsService.resolveWhatsAppRoute(detectedCountry);

    const xForwardedFor = req?.headers?.['x-forwarded-for'];
    const ip = Array.isArray(xForwardedFor)
      ? xForwardedFor[0]
      : typeof xForwardedFor === 'string'
        ? xForwardedFor.split(',')[0]?.trim()
        : req?.ip || '';

    const userAgentRaw = req?.headers?.['user-agent'];
    const userAgent = Array.isArray(userAgentRaw)
      ? userAgentRaw[0]
      : String(userAgentRaw || '');

    const sourceUrlRaw = req?.headers?.origin || req?.headers?.referer || '';
    const sourceUrl = Array.isArray(sourceUrlRaw) ? sourceUrlRaw[0] : String(sourceUrlRaw || '');

    // Save lead to database
    let leadSaved = false;
    try {
      await this.quoteLeadsService.create({
        destination,
        startDate,
        endDate,
        totalTravelers,
        passengerAges,
        wantsEmailQuote,
        email: wantsEmailQuote && email ? email : undefined,
        sourceUrl,
        detectedCountry: route.detectedCountry || undefined,
        routedPhone: route.phone || undefined,
        ip,
        userAgent,
      });
      leadSaved = true;
    } catch (error) {
      console.error('Error saving quote lead to database:', error);
    }

    const emailLogged = await this.mailService.sendQuoteLeadNotificationEmail({
      destination,
      startDate,
      endDate,
      totalTravelers,
      passengerAges,
      wantsEmailQuote,
      email,
      sourceUrl,
      detectedCountry: route.detectedCountry,
      matchedBy: route.matchedBy,
      routedPhone: route.phone,
      ip,
      userAgent,
    });

    let clientAckSent = false;
    if (wantsEmailQuote && email) {
      clientAckSent = await this.mailService.sendQuoteLeadAcknowledgementEmail({
        to: email,
        destination,
        startDate,
        endDate,
        totalTravelers,
        passengerAges,
      });
    }

    return {
      success: true,
      emailLogged,
      clientAckSent,
      leadSaved,
    };
  }
}
