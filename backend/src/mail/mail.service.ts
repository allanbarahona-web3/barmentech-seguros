import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from '../settings/settings.service';

interface EmailBrandingContext {
  settings: any;
  fromEmail: string;
  fromName: string;
  logoUrl: string | null;
  contactPhone: string;
  socialLinksHtml: string;
  website: string;
}

export interface SendActivationEmailDto {
  to: string;
  fullName: string;
  activationToken: string;
  expiryHours: number;
}

export interface SendQuotationEmailDto {
  to: string;
  clientName: string;
  quotationId: string;
  pdfUrl?: string;
  destination?: string;
  globalMaxAmount: string;
}

export interface SendWelcomeEmailDto {
  to: string;
  fullName: string;
}

export interface SendQuoteLeadNotificationEmailDto {
  destination: string;
  startDate: string;
  endDate: string;
  totalTravelers: number;
  passengerAges: string;
  wantsEmailQuote: boolean;
  email?: string;
  sourceUrl?: string;
  detectedCountry?: string | null;
  matchedBy?: string | null;
  routedPhone?: string | null;
  ip?: string;
  userAgent?: string;
}

export interface SendQuoteLeadAcknowledgementEmailDto {
  to: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalTravelers: number;
  passengerAges: string;
}

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);
  private readonly frontendUrl: string;
  private readonly companyName: string;

  constructor(
    private configService: ConfigService,
    private settingsService: SettingsService,
  ) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
    this.frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3004';
    this.companyName = this.configService.get('COMPANY_NAME') || 'Barmentech Seguros';
  }

  /**
   * Send activation email to new agent
   */
  async sendActivationEmail(data: SendActivationEmailDto): Promise<boolean> {
    try {
      const branding = await this.getBrandingContext();
      const activationLink = `${this.frontendUrl}/activate/${data.activationToken}`;
      const htmlContent = this.buildActivationEmailTemplate(data, activationLink, branding);

      const response = await this.resend.emails.send({
        from: `${branding.fromName} <${branding.fromEmail}>`,
        to: [data.to],
        subject: `Activa tu cuenta de agente - ${branding.fromName}`,
        html: htmlContent,
      });

      if (response.error) {
        this.logger.error(`Failed to send activation email to ${data.to}:`, response.error);
        throw new Error(response.error.message);
      }

      this.logger.log(`Activation email sent successfully to ${data.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send activation email to ${data.to}:`, error);
      throw error;
    }
  }

  /**
   * Send quotation email to client
   */
  async sendQuotationEmail(data: SendQuotationEmailDto): Promise<boolean> {
    try {
      const branding = await this.getBrandingContext();
      const htmlContent = this.buildQuotationEmailTemplate(data, branding);

      const response = await this.resend.emails.send({
        from: `${branding.fromName} <${branding.fromEmail}>`,
        to: [data.to],
        subject: `Tu Cotización de Seguro de Viaje - ${data.clientName}`,
        html: htmlContent,
      });

      if (response.error) {
        this.logger.error(`Failed to send quotation email to ${data.to}:`, response.error);
        throw new Error(response.error.message);
      }

      this.logger.log(`Quotation email sent successfully to ${data.to}: ${response.data?.id || 'unknown'}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send quotation email to ${data.to}:`, error);
      throw error;
    }
  }

  async sendWelcomeEmail(data: SendWelcomeEmailDto): Promise<boolean> {
    try {
      const branding = await this.getBrandingContext();

      const response = await this.resend.emails.send({
        from: `${branding.fromName} <${branding.fromEmail}>`,
        to: [data.to],
        subject: `Bienvenido a ${branding.fromName}`,
        html: this.buildWelcomeEmailTemplate(data, branding),
      });

      if (response.error) {
        this.logger.error(`Failed to send welcome email to ${data.to}:`, response.error);
        return false;
      }

      this.logger.log(`Welcome email sent successfully to ${data.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${data.to}:`, error);
      return false;
    }
  }

  async sendQuoteLeadNotificationEmail(data: SendQuoteLeadNotificationEmailDto): Promise<boolean> {
    try {
      const branding = await this.getBrandingContext();
      const adminEmail =
        branding.settings?.email ||
        this.configService.get('ADMIN_EMAIL') ||
        this.configService.get('RESEND_FROM_EMAIL');

      if (!adminEmail) {
        this.logger.warn('Skipping lead notification email: no admin email configured');
        return false;
      }

      const response = await this.resend.emails.send({
        from: `${branding.fromName} <${branding.fromEmail}>`,
        to: [adminEmail],
        subject: `Nuevo lead de cotizacion - ${data.destination}`,
        html: this.buildQuoteLeadNotificationTemplate(data, branding),
      });

      if (response.error) {
        this.logger.error('Failed to send quote lead notification email:', response.error);
        return false;
      }

      this.logger.log(`Quote lead notification email sent to ${adminEmail}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to send quote lead notification email:', error);
      return false;
    }
  }

  async sendQuoteLeadAcknowledgementEmail(data: SendQuoteLeadAcknowledgementEmailDto): Promise<boolean> {
    try {
      const branding = await this.getBrandingContext();

      const response = await this.resend.emails.send({
        from: `${branding.fromName} <${branding.fromEmail}>`,
        to: [data.to],
        subject: `Recibimos tu solicitud de cotizacion - ${branding.fromName}`,
        html: this.buildQuoteLeadAcknowledgementTemplate(data, branding),
      });

      if (response.error) {
        this.logger.error(`Failed to send lead acknowledgement email to ${data.to}:`, response.error);
        return false;
      }

      this.logger.log(`Lead acknowledgement email sent successfully to ${data.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send lead acknowledgement email to ${data.to}:`, error);
      return false;
    }
  }

  private buildActivationEmailTemplate(
    data: SendActivationEmailDto,
    activationLink: string,
    branding: EmailBrandingContext,
  ): string {
    const bodyHtml = `
      <h2 style="margin: 0 0 20px 0; color: #0f172a; font-size: 26px;">Hola ${this.escapeHtml(data.fullName)}</h2>
      <p style="margin: 0 0 16px 0; color: #334155; font-size: 16px; line-height: 1.6;">
        Tu cuenta de agente fue creada en <strong>${this.escapeHtml(branding.fromName)}</strong>.
      </p>
      <p style="margin: 0 0 24px 0; color: #334155; font-size: 16px; line-height: 1.6;">
        Para activar tu cuenta y definir tu contraseña, usa el siguiente boton:
      </p>
      <table role="presentation" style="width: 100%; margin: 20px 0 24px; border-collapse: collapse;">
        <tr>
          <td style="text-align: center;">
            <a href="${activationLink}" style="display: inline-block; padding: 14px 30px; border-radius: 10px; text-decoration: none; background-color: #2563eb; color: #ffffff; font-size: 16px; font-weight: 700;">
              Activar mi cuenta
            </a>
          </td>
        </tr>
      </table>
      <div style="margin: 0 0 22px; padding: 16px; border-radius: 8px; background: #fffbeb; border-left: 4px solid #f59e0b; color: #92400e; font-size: 14px; line-height: 1.6;">
        <strong>Importante:</strong><br/>
        Este enlace expira en ${data.expiryHours} horas y solo se puede usar una vez.
      </div>
      <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6; word-break: break-all;">
        Si el boton no abre, copia este enlace en tu navegador:<br/>
        <a href="${activationLink}" style="color: #2563eb; text-decoration: none;">${activationLink}</a>
      </p>
    `;

    return this.buildBrandedEmailLayout({
      title: 'Activacion de cuenta',
      heroTitle: 'Activacion de Cuenta',
      heroSubtitle: 'Completa la activacion de tu perfil de agente',
      bodyHtml,
      branding,
    });
  }

  private buildQuotationEmailTemplate(
    data: SendQuotationEmailDto,
    branding: EmailBrandingContext,
  ): string {
    const baseUrl = this.configService.get('BACKEND_URL') || 'http://localhost:3005';
    const downloadLink = data.pdfUrl ? `${baseUrl}${data.pdfUrl}` : null;

    const bodyHtml = `
      <h2 style="margin: 0 0 20px 0; color: #0f172a; font-size: 24px;">Hola ${this.escapeHtml(data.clientName)}</h2>
      <p style="margin: 0 0 16px 0; color: #334155; font-size: 16px; line-height: 1.6;">
        Ya tenemos lista tu cotizacion personalizada de seguro de viaje.
      </p>
      ${data.destination ? `
      <p style="margin: 0 0 12px 0; color: #334155; font-size: 16px; line-height: 1.6;">
        <strong>Destino:</strong> ${this.escapeHtml(data.destination)}
      </p>
      ` : ''}
      <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;">
        <strong>Cobertura maxima global:</strong>
        <span style="color: #2563eb; font-weight: 700;">${this.escapeHtml(data.globalMaxAmount)}</span>
      </p>
      ${downloadLink ? `
      <table role="presentation" style="width: 100%; margin: 24px 0; border-collapse: collapse;">
        <tr>
          <td style="text-align: center;">
            <a href="${downloadLink}" style="display: inline-block; padding: 14px 28px; border-radius: 10px; text-decoration: none; background-color: #2563eb; color: #ffffff; font-size: 16px; font-weight: 700;">
              Descargar cotizacion PDF
            </a>
          </td>
        </tr>
      </table>
      ` : ''}
      <div style="margin: 0 0 22px; padding: 16px; border-radius: 8px; background: #ecfeff; border-left: 4px solid #0891b2; color: #0f766e; font-size: 14px; line-height: 1.6;">
        <strong>Respaldado por Assist Card.</strong><br/>
        Si necesitas ajustar esta cotizacion, nuestro equipo te acompana durante todo el proceso.
      </div>
      <p style="margin: 0; color: #64748b; font-size: 13px;">ID de cotizacion: #${data.quotationId.substring(0, 8).toUpperCase()}</p>
    `;

    return this.buildBrandedEmailLayout({
      title: 'Cotizacion de seguro de viaje',
      heroTitle: 'Tu Cotizacion de Viaje',
      heroSubtitle: 'Resumen personalizado de cobertura',
      bodyHtml,
      branding,
    });
  }

  private getEmailCompatibleLogoUrl(logoUrl?: string | null): string | null {
    if (!logoUrl) return null;

    // Email clients frequently fail with WebP; prefer PNG sibling when possible.
    if (logoUrl.toLowerCase().endsWith('.webp')) {
      return logoUrl.replace(/\.webp$/i, '.png');
    }

    return logoUrl;
  }

  private escapeHtml(value?: string | number | null): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private buildPrimaryPhone(phoneNumbers: any): string {
    if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      return '';
    }

    const preferred =
      phoneNumbers.find((item: any) => Boolean(item?.isPrimary)) || phoneNumbers[0];

    const country = String(preferred?.country || '').trim();
    const phone = String(preferred?.phone || '').trim();

    if (!country && !phone) {
      return '';
    }

    return country && phone ? `${country}: ${phone}` : `${country}${phone}`;
  }

  private buildSocialLinksHtml(socialMedia: any): string {
    if (!socialMedia || typeof socialMedia !== 'object') {
      return '';
    }

    return Object.entries(socialMedia)
      .filter(([, url]) => Boolean(url))
      .map(([platform, url]) => {
        const href = this.escapeHtml(String(url));
        const label = this.escapeHtml(String(platform));
        return `<a href="${href}" style="color: #64748b; text-decoration: none; margin: 0 8px;">${label}</a>`;
      })
      .join(' | ');
  }

  private async getBrandingContext(): Promise<EmailBrandingContext> {
    const settings = await this.settingsService.getSettings();
    const fromEmail =
      settings.email || this.configService.get('RESEND_FROM_EMAIL') || 'onboarding@resend.dev';
    const fromName = settings.companyName || this.companyName;

    return {
      settings,
      fromEmail,
      fromName,
      logoUrl: this.getEmailCompatibleLogoUrl(settings.logoUrl),
      contactPhone: this.buildPrimaryPhone(settings.phoneNumbers),
      socialLinksHtml: this.buildSocialLinksHtml(settings.socialMedia),
      website: String(settings.website || '').trim(),
    };
  }

  private buildBrandedEmailLayout(options: {
    title: string;
    heroTitle: string;
    heroSubtitle: string;
    bodyHtml: string;
    branding: EmailBrandingContext;
  }): string {
    const { title, heroTitle, heroSubtitle, bodyHtml, branding } = options;
    const safeTitle = this.escapeHtml(title);
    const safeHeroTitle = this.escapeHtml(heroTitle);
    const safeHeroSubtitle = this.escapeHtml(heroSubtitle);
    const safeFromName = this.escapeHtml(branding.fromName);
    const safeFromEmail = this.escapeHtml(branding.settings?.email || '');
    const safePhone = this.escapeHtml(branding.contactPhone);
    const safeWebsite = this.escapeHtml(branding.website);
    const footerLine = [safeFromEmail, safePhone].filter(Boolean).join(' | ');

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f1f5f9;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 28px 20px 14px; text-align: center;">
        ${branding.logoUrl ? `<img src="${branding.logoUrl}" alt="Logo" style="max-width: 190px; width: auto; height: auto; display: inline-block;" />` : ''}
      </td>
    </tr>
    <tr>
      <td style="padding: 0 20px 30px;">
        <table role="presentation" style="width: 100%; max-width: 680px; margin: 0 auto; border-collapse: collapse; background: #ffffff; border-radius: 12px; box-shadow: 0 8px 16px rgba(15, 23, 42, 0.08); overflow: hidden;">
          <tr>
            <td style="padding: 14px 20px; text-align: center; background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">${safeHeroTitle}</h1>
              <p style="margin: 6px 0 0; color: #dbeafe; font-size: 13px;">${safeHeroSubtitle}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 20px; text-align: center; background-color: #0f172a;">
              <p style="margin: 0 0 8px; color: #ffffff; font-size: 14px;">${safeFromName}</p>
              ${footerLine ? `<p style="margin: 0; color: #ffffff; font-size: 12px;">${footerLine}</p>` : ''}
              ${safeWebsite ? `<p style="margin: 8px 0 0; color: #ffffff; font-size: 12px;"><a href="${safeWebsite}" style="color: #ffffff; text-decoration: none;">${safeWebsite}</a></p>` : ''}
              ${branding.socialLinksHtml ? `<p style="margin: 8px 0 0; color: #ffffff; font-size: 12px;">${branding.socialLinksHtml}</p>` : ''}
              <p style="margin: 14px 0 0; color: #ffffff; font-size: 11px;">Este correo fue enviado automaticamente.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  private buildWelcomeEmailTemplate(
    data: SendWelcomeEmailDto,
    branding: EmailBrandingContext,
  ): string {
    const loginLink = `${this.frontendUrl}/login`;
    const bodyHtml = `
      <h2 style="margin: 0 0 20px 0; color: #0f172a; font-size: 26px;">Bienvenido, ${this.escapeHtml(data.fullName)}</h2>
      <p style="margin: 0 0 14px; color: #334155; font-size: 16px; line-height: 1.6;">
        Gracias por registrarte en <strong>${this.escapeHtml(branding.fromName)}</strong>.
      </p>
      <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
        Ya puedes iniciar sesion y comenzar a gestionar tus cotizaciones y seguros de viaje.
      </p>
      <table role="presentation" style="width: 100%; margin: 20px 0 24px; border-collapse: collapse;">
        <tr>
          <td style="text-align: center;">
            <a href="${loginLink}" style="display: inline-block; padding: 14px 30px; border-radius: 10px; text-decoration: none; background-color: #0ea5e9; color: #ffffff; font-size: 16px; font-weight: 700;">
              Ir al panel
            </a>
          </td>
        </tr>
      </table>
      <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
        Si no realizaste este registro, responde este correo para que podamos ayudarte.
      </p>
    `;

    return this.buildBrandedEmailLayout({
      title: 'Bienvenida',
      heroTitle: 'Bienvenido a la plataforma',
      heroSubtitle: 'Tu cuenta ya esta lista para usar',
      bodyHtml,
      branding,
    });
  }

  private buildQuoteLeadNotificationTemplate(
    data: SendQuoteLeadNotificationEmailDto,
    branding: EmailBrandingContext,
  ): string {
    const bodyHtml = `
      <h2 style="margin: 0 0 18px 0; color: #0f172a; font-size: 24px;">Nuevo lead de cotizacion</h2>
      <p style="margin: 0 0 18px; color: #334155; font-size: 15px; line-height: 1.6;">
        Se registro un nuevo lead desde el formulario publico.
      </p>
      <table role="presentation" style="width: 100%; border-collapse: collapse; font-size: 14px;">
        ${this.buildLeadRow('Destino', data.destination || 'No especificado')}
        ${this.buildLeadRow('Fechas', `${data.startDate || '--'} a ${data.endDate || '--'}`)}
        ${this.buildLeadRow('Viajeros', String(data.totalTravelers || 1))}
        ${this.buildLeadRow('Edades pasajeros', data.passengerAges || 'No especificadas')}
        ${this.buildLeadRow('Solicita cotizacion por email', data.wantsEmailQuote ? 'Si' : 'No')}
        ${this.buildLeadRow('Email cliente', data.email || 'No aplica')}
        ${this.buildLeadRow('Pais detectado', data.detectedCountry || 'No detectado')}
        ${this.buildLeadRow('Regla de enrutamiento', data.matchedBy || 'N/A')}
        ${this.buildLeadRow('Telefono enrutado', data.routedPhone || 'N/A')}
        ${this.buildLeadRow('IP', data.ip || 'N/A')}
        ${this.buildLeadRow('User-Agent', data.userAgent || 'N/A')}
        ${this.buildLeadRow('Origen', data.sourceUrl || 'N/A')}
      </table>
    `;

    return this.buildBrandedEmailLayout({
      title: 'Nuevo lead de cotizacion',
      heroTitle: 'Nuevo Lead Registrado',
      heroSubtitle: 'Resumen de contacto y enrutamiento',
      bodyHtml,
      branding,
    });
  }

  private buildQuoteLeadAcknowledgementTemplate(
    data: SendQuoteLeadAcknowledgementEmailDto,
    branding: EmailBrandingContext,
  ): string {
    const bodyHtml = `
      <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 24px;">Recibimos tu solicitud</h2>
      <p style="margin: 0 0 14px; color: #334155; font-size: 15px; line-height: 1.6;">
        Gracias por cotizar con <strong>${this.escapeHtml(branding.fromName)}</strong>. Nuestro equipo revisara tu solicitud y te contactara por WhatsApp.
      </p>
      <div style="margin: 18px 0; padding: 16px; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0;">
        <p style="margin: 0 0 10px; color: #334155; font-size: 14px;"><strong>Resumen de tu solicitud:</strong></p>
        <ul style="margin: 0 0 0 18px; padding: 0; color: #334155; font-size: 14px; line-height: 1.7;">
          <li>Destino: ${this.escapeHtml(data.destination || 'No especificado')}</li>
          <li>Fechas: ${this.escapeHtml(data.startDate || '--')} a ${this.escapeHtml(data.endDate || '--')}</li>
          <li>Viajeros: ${this.escapeHtml(String(data.totalTravelers || 1))}</li>
          <li>Edades: ${this.escapeHtml(data.passengerAges || 'No especificado')}</li>
        </ul>
      </div>
      <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
        Te responderemos con prioridad para completar tu cotizacion final.
      </p>
    `;

    return this.buildBrandedEmailLayout({
      title: 'Solicitud de cotizacion recibida',
      heroTitle: 'Solicitud Recibida',
      heroSubtitle: 'Gracias por cotizar con nosotros',
      bodyHtml,
      branding,
    });
  }

  private buildLeadRow(label: string, value: string): string {
    return `
      <tr>
        <td style="padding: 10px 12px; border: 1px solid #e2e8f0; background: #f8fafc; width: 34%; font-weight: 600; color: #334155; vertical-align: top;">${this.escapeHtml(label)}</td>
        <td style="padding: 10px 12px; border: 1px solid #e2e8f0; color: #0f172a;">${this.escapeHtml(value)}</td>
      </tr>
    `;
  }
}
