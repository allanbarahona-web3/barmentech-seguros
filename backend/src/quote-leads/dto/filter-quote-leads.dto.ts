import { IsString, IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { QuoteLeadStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class FilterQuoteLeadsDto {
  @IsOptional()
  @IsEnum(QuoteLeadStatus)
  status?: QuoteLeadStatus;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  hasEmail?: string; // 'true' or 'false' as string from query params

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
