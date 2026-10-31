import { CompanySource, CompanyStatus } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
} from 'class-validator';
import { Trim } from '../../../common/decorators/trim.decorator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Trim()
  name: string;

  @IsOptional()
  @Matches(/^(\d{8}|\d{10})$/, {
    message: 'edrpou must contain 8 or 10 digits',
  })
  @Trim()
  edrpou?: string;

  @IsOptional()
  @IsEnum(CompanyStatus)
  status?: CompanyStatus;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Trim()
  region?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Trim()
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Trim()
  address?: string;

  @IsOptional()
  @Matches(/^\d{2}(\.\d{1,2})?$/, {
    message: 'kvedCode must look like 62 or 62.01',
  })
  @Trim()
  kvedCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Trim()
  kvedName?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  @Trim()
  website?: string;

  @IsOptional()
  @Matches(/^\+?[0-9()\-\s]{7,20}$/, { message: 'phone is not valid' })
  @Trim()
  phone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  @Trim()
  email?: string;

  @IsEnum(CompanySource)
  source: CompanySource;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Trim()
  sourceId?: string;

  @IsOptional()
  @IsISO8601()
  sourceUpdatedAt?: string;
}