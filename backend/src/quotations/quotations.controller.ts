import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { QuotationsService } from './quotations.service';
import { CreateQuotationDto, UpdateQuotationDto } from './dto';
import { OpenAIService } from './openai.service';
import { PdfGeneratorService } from './pdf-generator.service';
import { MailService } from '../mail/mail.service';
import { StorageService } from '../storage/storage.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { FileUploadValidator } from '../common/validators/file-upload.validator';
import { SecurityLoggerService } from '../common/logger/logger.service';
import type { RequestWithUser } from '../common/types/request.types';

@Controller('quotations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuotationsController {
  private securityLogger: SecurityLoggerService;

  constructor(
    private quotationsService: QuotationsService,
    private openaiService: OpenAIService,
    private pdfGeneratorService: PdfGeneratorService,
    private mailService: MailService,
    private storageService: StorageService,
  ) {
    this.securityLogger = new SecurityLoggerService();
  }

  @Post('extract')
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  @UseInterceptors(FileInterceptor('pdf'))
  async extractFromPdf(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: RequestWithUser,
  ) {
    // Validación estricta de PDF
    FileUploadValidator.validatePdf(file);

    // Log de seguridad
    this.securityLogger.logFileUpload(
      req.user.id,
      file.originalname,
      file.size,
      file.mimetype,
    );

    try {
      // Subir PDF a Spaces primero
      const key = this.storageService.generateUniqueKey(
        'assist-card-originals',
        file.originalname,
      );
      const uploadResult = await this.storageService.uploadFile(
        file.buffer,
        key,
        file.mimetype,
      );

      // Extraer datos con OpenAI usando el buffer en memoria
      const extractedData = await this.openaiService.extractDataFromPdfBuffer(
        file.buffer,
      );

      return {
        success: true,
        data: extractedData,
        originalPdfUrl: uploadResult.url,
      };
    } catch {
      throw new BadRequestException('Failed to extract data from PDF');
    }
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  async create(@Body() createDto: CreateQuotationDto, @Request() req) {
    // El createdById viene del JWT (agente autenticado)
    return this.quotationsService.create({
      ...createDto,
      createdById: req.user.id,
    });
  }

  @Get()
  async findAll(@Request() req) {
    return this.quotationsService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const quotation = await this.quotationsService.findOne(
      id,
      req.user.id,
      req.user.role,
    );

    if (!quotation) {
      throw new NotFoundException('Quotation not found or access denied');
    }

    return quotation;
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  async update(@Param('id') id: string, @Body() updateDto: UpdateQuotationDto) {
    return this.quotationsService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  async delete(@Param('id') id: string) {
    return this.quotationsService.delete(id);
  }

  @Post(':id/generate-pdf')
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  async generatePdf(@Param('id') id: string, @Request() req) {
    const quotation = await this.quotationsService.findOne(
      id,
      req.user.id,
      req.user.role,
    );

    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }

    try {
      const pdfUrl = await this.pdfGeneratorService.generateQuotationPdf({
        quotationId: quotation.id,
        clientName: quotation.clientName,
        clientEmail: quotation.clientEmail || undefined,
        clientPhone: quotation.clientPhone || undefined,
        destination: quotation.destination || undefined,
        travelDateFrom: quotation.travelDateFrom || undefined,
        travelDateTo: quotation.travelDateTo || undefined,
        globalMaxAmount: quotation.globalMaxAmount,
        validityTerritory: quotation.validityTerritory || undefined,
        consecutiveDays: quotation.consecutiveDays || undefined,
        coverages: quotation.coverages as any[],
        createdAt: quotation.createdAt,
      });

      // Actualizar la cotización con la URL del PDF generado
      await this.quotationsService.update(id, { pdfUrl });

      return {
        success: true,
        pdfUrl,
      };
    } catch {
      throw new BadRequestException('Failed to generate PDF');
    }
  }

  @Post(':id/send-email')
  @Roles(UserRole.ADMIN, UserRole.AGENT)
  async sendEmail(@Param('id') id: string, @Request() req) {
    const quotation = await this.quotationsService.findOne(
      id,
      req.user.id,
      req.user.role,
    );

    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }

    if (!quotation.clientEmail) {
      throw new BadRequestException('Client email is required');
    }

    try {
      await this.mailService.sendQuotationEmail({
        to: quotation.clientEmail,
        clientName: quotation.clientName,
        quotationId: quotation.id,
        pdfUrl: quotation.pdfUrl || undefined,
        destination: quotation.destination || undefined,
        globalMaxAmount: quotation.globalMaxAmount,
      });

      // Actualizar estado a SENT
      await this.quotationsService.update(id, { status: 'SENT' });

      return {
        success: true,
        message: 'Email sent successfully',
      };
    } catch {
      throw new BadRequestException('Failed to send email');
    }
  }
}
