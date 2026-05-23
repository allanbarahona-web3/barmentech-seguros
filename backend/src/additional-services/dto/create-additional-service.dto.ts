import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';

export class CoverageLevelDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  coverage: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateAdditionalServiceDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  category: string;

  @IsString()
  shortDescription: string;

  @IsOptional()
  @IsString()
  fullDescription?: string;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsOptional()
  @IsString()
  pricingType?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CoverageLevelDto)
  coverageLevels?: CoverageLevelDto[];

  @IsOptional()
  @IsString()
  iconUrl?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];
}
