import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Post,
  UploadedFile,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { StorageService } from '../storage/storage.service';
import { FileUploadValidator } from '../common/validators/file-upload.validator';
import { SecurityLoggerService } from '../common/logger/logger.service';
import sharp from 'sharp';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  private securityLogger: SecurityLoggerService;

  constructor(
    private settingsService: SettingsService,
    private storageService: StorageService,
  ) {
    this.securityLogger = new SecurityLoggerService();
  }

  @Get()
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Put()
  @Roles(UserRole.ADMIN)
  async updateSettings(@Body() updateDto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(updateDto);
  }

  @Post('upload-logo')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    // Validación estricta de imagen
    FileUploadValidator.validateImage(file);

    // Log de seguridad
    this.securityLogger.logFileUpload(
      req.user.id,
      file.originalname,
      file.size,
      file.mimetype,
    );

    // Guardar logo en dos formatos:
    // - WebP para frontend (mejor rendimiento)
    // - PNG para máxima compatibilidad en emails
    const baseKey = this.storageService.generateUniqueKey(
      'company',
      `logo-${file.originalname}`,
    );
    const keyWithoutExt = baseKey.replace(/\.[^/.]+$/, '');
    const webpKey = `${keyWithoutExt}.webp`;
    const pngKey = `${keyWithoutExt}.png`;

    const webpBuffer = await sharp(file.buffer)
      .rotate()
      .webp({ quality: 85 })
      .toBuffer();
    const pngBuffer = await sharp(file.buffer)
      .rotate()
      .png({ compressionLevel: 9 })
      .toBuffer();

    const webpResult = await this.storageService.uploadFile(webpBuffer, webpKey, 'image/webp');
    const pngResult = await this.storageService.uploadFile(
      pngBuffer,
      pngKey,
      'image/png',
    );

    // Guardar WebP como logo principal para consumo del frontend
    await this.settingsService.updateSettings({ logoUrl: webpResult.url });

    return {
      success: true,
      logoUrl: webpResult.url,
      logoEmailUrl: pngResult.url,
    };
  }

  @Post('upload-signature')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadSignature(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    // Validación estricta de imagen
    FileUploadValidator.validateImage(file);

    // Log de seguridad
    this.securityLogger.logFileUpload(
      req.user.id,
      file.originalname,
      file.size,
      file.mimetype,
    );

    // Guardar siempre en WebP
    const key = this.storageService.generateUniqueKey('company', `signature-${file.originalname}`);
    const result = await this.storageService.uploadImageAsWebp(
      file.buffer,
      key,
    );

    // Guardar URL en la base de datos
    await this.settingsService.updateSettings({ signatureUrl: result.url });

    return {
      success: true,
      signatureUrl: result.url,
    };
  }

  @Post('upload-favicon')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFavicon(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    // Validación estricta de imagen
    FileUploadValidator.validateImage(file);

    // Log de seguridad
    this.securityLogger.logFileUpload(
      req.user.id,
      file.originalname,
      file.size,
      file.mimetype,
    );

    // Guardar siempre en WebP
    const key = this.storageService.generateUniqueKey('company', `favicon-${file.originalname}`);
    const result = await this.storageService.uploadImageAsWebp(
      file.buffer,
      key,
    );

    // Guardar URL en la base de datos
    await this.settingsService.updateSettings({ faviconUrl: result.url });

    return {
      success: true,
      faviconUrl: result.url,
    };
  }
}
