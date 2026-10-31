import { CompanySource, CompanyStatus } from '@prisma/client';
import { IsBoolean, IsEnum, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { ToBoolean } from '../../../common/decorators/to-boolean.decorator';
import { Trim } from '../../../common/decorators/trim.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export const COMPANY_SORT_FIELDS = ['name', 'createdAt', 'updatedAt'] as const;
export type CompanySortField = (typeof COMPANY_SORT_FIELDS)[number];

export class QueryCompaniesDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Trim()
  q?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Trim()
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Trim()
  region?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @Trim()
  kvedCode?: string;

  @IsOptional()
  @IsEnum(CompanySource)
  source?: CompanySource;

  @IsOptional()
  @IsEnum(CompanyStatus)
  status?: CompanyStatus;

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  hasWebsite?: boolean;

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  hasPhone?: boolean;

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  hasEmail?: boolean;

  @IsOptional()
  @IsIn(COMPANY_SORT_FIELDS)
  sortBy?: CompanySortField = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}