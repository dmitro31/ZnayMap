import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../core/database/prisma.service';
import { CompaniesService } from './companies.service';

describe('CompaniesService', () => {
  let service: CompaniesService;

  const prismaMock = {
    company: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        CompaniesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    service = moduleRef.get(CompaniesService);
  });

  it('create stores normalizedName', async () => {
    prismaMock.company.create.mockResolvedValue({ id: '1' });
    await service.create({ name: 'ТОВ «Ромашка»', source: 'MANUAL' });
    expect(prismaMock.company.create).toHaveBeenCalledWith({
      data: {
        name: 'ТОВ «Ромашка»',
        source: 'MANUAL',
        normalizedName: 'тов ромашка',
      },
    });
  });

  it('findAll returns data with pagination meta', async () => {
    prismaMock.$transaction.mockResolvedValue([25, [{ id: '1' }, { id: '2' }]]);

    const result = await service.findAll({ page: 2, limit: 10, q: 'Ромашка' });

    expect(prismaMock.company.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 10, take: 10 }),
    );
    expect(result.meta).toEqual({
      total: 25,
      page: 2,
      limit: 10,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    });
    expect(result.data).toHaveLength(2);
  });

  it('findAll builds contact presence filters', async () => {
    prismaMock.$transaction.mockResolvedValue([0, []]);

    await service.findAll({
      hasWebsite: true,
      hasPhone: true,
      hasEmail: false,
    });

    expect(prismaMock.company.count).toHaveBeenCalledWith({
      where: {
        website: { not: null },
        phone: { not: null },
        email: null,
      },
    });
  });

  it('findAll applies text and location filters', async () => {
    prismaMock.$transaction.mockResolvedValue([0, []]);

    await service.findAll({ q: 'Ромашка', city: 'Калуш', kvedCode: '62' });

    expect(prismaMock.company.count).toHaveBeenCalledWith({
      where: {
        OR: [
          { normalizedName: { contains: 'ромашка' } },
          { edrpou: { startsWith: 'Ромашка' } },
        ],
        city: { equals: 'Калуш', mode: 'insensitive' },
        kvedCode: { startsWith: '62' },
      },
    });
  });

  it('findOne throws NotFoundException when company is missing', async () => {
    prismaMock.company.findUnique.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('update recalculates normalizedName when name changes', async () => {
    prismaMock.company.update.mockResolvedValue({ id: '1' });
    await service.update('1', { name: 'Нова  Назва' });
    expect(prismaMock.company.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { name: 'Нова  Назва', normalizedName: 'нова назва' },
    });
  });

  it('update does not touch normalizedName without name', async () => {
    prismaMock.company.update.mockResolvedValue({ id: '1' });
    await service.update('1', { city: 'Київ' });
    expect(prismaMock.company.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { city: 'Київ' },
    });
  });
});