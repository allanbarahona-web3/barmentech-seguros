import { IsNotEmpty, IsString, IsArray, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateQuotationDto {
  @IsUUID('4', { message: 'ID de creador inválido' })
  @IsNotEmpty({ message: 'ID de creador es requerido' })
  createdById: string;

  @IsOptional()
  @IsUUID('4', { message: 'ID de cliente inválido' })
  clientId?: string;

  @IsString()
  @IsNotEmpty({ message: 'Nombre del cliente es requerido' })
  clientName: string;

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

  @IsString()
  @IsNotEmpty({ message: 'Monto máximo global es requerido' })
  globalMaxAmount: string;

  @IsOptional()
  @IsString()
  validityTerritory?: string;

  @IsOptional()
  @IsString()
  consecutiveDays?: string;

  @IsArray({ message: 'Coberturas debe ser un array' })
  @IsNotEmpty({ message: 'Coberturas son requeridas' })
  coverages: any[];

  @IsOptional()
  @IsString()
  originalPdfUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
