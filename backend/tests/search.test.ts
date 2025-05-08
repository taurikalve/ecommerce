import type { FastifyInstance } from 'fastify';
import type { Product } from '../../shared/types';
import request from 'supertest';
import buildApp from '../src/app';

describe('GET /product/search?lang=et', () => {
  let fastify: FastifyInstance;

  beforeAll(async () => {
    fastify = buildApp();
    await new Promise<void>((resolve, reject) => {
      fastify.listen((err) => {
        if (err) console.error(err), reject();
        resolve();
      });
    });
  });
  afterAll(async () => {
    await fastify.close();
  });

  test('responds with { products: [...products], total: int }', async () => {
    const res = await request(fastify.server).get('/product/search?lang=et');
    expect(res.status).toBe(200);

    // products is an array
    expect(Array.isArray(res.body.products)).toBe(true);
    // total is integer
    expect(res.body.total).toBeGreaterThanOrEqual(0);
    // all products have "sku" key
    expect(
      res.body.products.every((product: Product) => 'sku' in product),
    ).toBe(true);
  });
});
