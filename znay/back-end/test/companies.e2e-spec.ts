import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/app.setup';

describe('Companies (e2e)', () => {
  let app: INestApplication<App>;
  let companyId: string;

  const edrpou = String(Math.floor(10000000 + Math.random() * 89999999));
  const payload = {
    name: 'ТОВ «Е2Е Тест»',
    edrpou,
    status: 'ACTIVE',
    region: 'Івано-Франківська область',
    city: 'Івано-Франківськ',
    kvedCode: '62.01',
    website: 'https://e2e-test.example.com',
    source: 'MANUAL',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    if (companyId) {
      await request(app.getHttpServer()).delete(
        `/api/v1/companies/${companyId}`,
      );
    }
    await app.close();
  });

  it('POST creates a company', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/companies')
      .send(payload)
      .expect(201);

    companyId = res.body.id;
    expect(res.body.normalizedName).toBe('тов е2е тест');
  });

  it('POST rejects invalid payload', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/companies')
      .send({ name: '', unknown: 1 })
      .expect(400);

    expect(res.body.statusCode).toBe(400);
  });

  it('POST rejects duplicate edrpou', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/companies')
      .send(payload)
      .expect(409);
  });

  it('GET /companies searches with filters', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/companies')
      .query({ q: 'е2е тест', city: 'івано-франківськ', hasWebsite: true })
      .expect(200);

    expect(res.body.meta.total).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].id).toBe(companyId);
  });

  it('GET /companies/:id returns company', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/companies/${companyId}`)
      .expect(200);

    expect(res.body.edrpou).toBe(edrpou);
  });

  it('GET /companies/:id rejects invalid uuid', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/companies/not-a-uuid')
      .expect(400);
  });

  it('PATCH updates company', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/companies/${companyId}`)
      .send({ city: 'Київ' })
      .expect(200);

    expect(res.body.city).toBe('Київ');
  });

  it('DELETE removes company', async () => {
    await request(app.getHttpServer())
      .delete(`/api/v1/companies/${companyId}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/api/v1/companies/${companyId}`)
      .expect(404);

    companyId = '';
  });
});