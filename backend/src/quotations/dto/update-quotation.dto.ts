import { IsString, IsArray, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { QuotationStatus } from '@prisma/client';

export class UpdateQuotationDto {
  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsString()
  clientEmail?: string;

  @IsOptional()
  @IsString()
  clientPhone?: string;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Fecha de inicio inválida' })
  travelDateFrom?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Fecha de fin inválida' })
  travelDateTo?: string;

  @IsOptional()
  @IsString()
  globalMaxAmount?: string;

  @IsOptional()
  @IsString()
  validityTerritory?: string;

  @IsOptional()
  @IsString()
  consecutiveDays?: string;

  @IsOptional()
  @IsArray()
  coverages?: any[];

  @IsOptional()
  @IsString()
  pdfUrl?: string;

  @IsOptional()
  @IsString()
  originalPdfUrl?: string;

  @IsOptional()
  @IsEnum(QuotationStatus, { message: 'Estado inválido' })
  status?: QuotationStatus;
}
