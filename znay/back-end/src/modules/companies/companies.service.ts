import { Injectable, NotFoundException } from '@nestjs/common';
import { Company, Prisma } from '@prisma/client';
import { normalizeName } from '../../common/utils/normalize-name.util';
import { PrismaService } from '../../core/database/prisma.service';
import { PaginatedResult } from '../../interfaces/paginated-result.interface';
import { CreateCompanyDto } from './dto/create-company.dto';
import { QueryCompaniesDto } from './dto/query-companies.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCompanyDto): Promise<Company> {
    return this.prisma.company.create({
      data: { ...dto, normalizedName: normalizeName(dto.name) },
    });
  }

  async findAll(query: QueryCompaniesDto): Promise<PaginatedResult<Company>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sortBy = query.sortBy ?? 'createdAt';
    const order = query.order ?? 'desc';
    const where = this.buildWhere(query);

    const [total, data] = await this.prisma.$transaction([
      this.prisma.company.count({ where }),
      this.prisma.company.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company ${id} not found`);
    }
    return company;
  }

  update(id: string, dto: UpdateCompanyDto): Promise<Company> {
    const data: Prisma.CompanyUpdateInput = {
      ...dto,
      ...(dto.name ? { normalizedName: normalizeName(dto.name) } : {}),
    };
    return this.prisma.company.update({ where: { id }, data });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.company.delete({ where: { id } });
  }

  private buildWhere(query: QueryCompaniesDto): Prisma.CompanyWhereInput {
    const {
      q,
      city,
      region,
      kvedCode,
      source,
      status,
      hasWebsite,
      hasPhone,
      hasEmail,
    } = query;
    const where: Prisma.CompanyWhereInput = {};

    if (q) {
      where.OR = [
        { normalizedName: { contains: normalizeName(q) } },
        { edrpou: { startsWith: q } },
      ];
    }
    if (city) where.city = { equals: city, mode: 'insensitive' };
    if (region) where.region = { equals: region, mode: 'insensitive' };
    if (kvedCode) where.kvedCode = { startsWith: kvedCode };
    if (source) where.source = source;
    if (status) where.status = status;
    if (hasWebsite !== undefined) where.website = this.presence(hasWebsite);
    if (hasPhone !== undefined) where.phone = this.presence(hasPhone);
    if (hasEmail !== undefined) where.email = this.presence(hasEmail);

    return where;
  }

  private presence(present: boolean): { not: null } | null {
    return present ? { not: null } : null;
  }
}