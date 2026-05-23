import {
  IsString,
  IsInt,
  IsBoolean,
  IsEmail,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateQuoteLeadDto {
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
  @IsInt()
  @Min(1)
  totalTravelers?: number;

  @IsOptional()
  @IsString()
  passengerAges?: string;

  @IsOptional()
  @IsBoolean()
  wantsEmailQuote?: boolean;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  sourceUrl?: string;

  @IsOptional()
  @IsString()
  detectedCountry?: string;

  @IsOptional()
  @IsString()
  routedPhone?: string;

  @IsOptional()
  @IsString()
  ip?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}
