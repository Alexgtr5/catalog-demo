import type { ApiErrorResponse, ProductListResponse } from '@catalog/contracts';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { createApp } from '../src/bootstrap.js';

describe('Каталог товаров (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    app = await createApp({ logger: false });
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('GET /api/v1/products отдаёт весь каталог', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/products' });
    const body = response.json<ProductListResponse>();

    expect(response.statusCode).toBe(200);
    expect(body.total).toBe(body.items.length);
    expect(body.items.length).toBeGreaterThan(0);
  });

  test('фильтр по категории сужает выдачу', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/products?category=phones' });
    const body = response.json<ProductListResponse>();

    expect(response.statusCode).toBe(200);
    expect(body.items.every((item) => item.category === 'phones')).toBe(true);
  });

  test('поиск по названию нечувствителен к регистру', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/products?search=NOVA' });
    const body = response.json<ProductListResponse>();

    expect(response.statusCode).toBe(200);
    expect(body.items.length).toBeGreaterThan(0);
    expect(body.items.every((item) => item.title.toLowerCase().includes('nova'))).toBe(true);
  });

  test('неизвестная категория отклоняется до обращения к данным', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/products?category=bogus' });

    expect(response.statusCode).toBe(400);
    expect(response.json<ApiErrorResponse>().message).toContain('Неизвестная категория товара');
  });

  test('лишний параметр запроса отклоняется', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/products?page=2' });

    expect(response.statusCode).toBe(400);
  });

  test('отсутствующий товар отдаёт 404 в общем формате ошибки', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/products/lp-99' });
    const body = response.json<ApiErrorResponse>();

    expect(response.statusCode).toBe(404);
    expect(body.error).toBe('NOT_FOUND');
    expect(body.path).toBe('/api/v1/products/lp-99');
    expect(body.requestId).toBeTruthy();
  });

  test('запрос без версии в пути не обслуживается', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/products' });

    expect(response.statusCode).toBe(404);
  });

  test('проба живости отвечает без обращения к зависимостям', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/health/live' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
  });
});
