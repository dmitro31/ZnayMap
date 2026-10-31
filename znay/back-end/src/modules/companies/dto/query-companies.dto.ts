import { CompanySource, CompanyStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
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
  @Transform(({ value }: { value: unknown }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  hasWebsite?: boolean;

  @IsOptional()
  @IsIn(COMPANY_SORT_FIELDS)
  sortBy?: CompanySortField = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}