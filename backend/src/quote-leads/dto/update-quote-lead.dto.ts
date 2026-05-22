import { IsString, IsEnum, IsOptional } from 'class-validator';
import { QuoteLeadStatus } from '@prisma/client';

export class UpdateQuoteLeadDto {
  @IsOptional()
  @IsEnum(QuoteLeadStatus)
  status?: QuoteLeadStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
