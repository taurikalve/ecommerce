import type { FastifyInstance, RouteShorthandOptions } from 'fastify';
import type { Filter, Document } from 'mongodb';
import type { Product } from '@ecommerce/types';
import { langs, defaultPerPage } from '@ecommerce/consts';
import { FromSchema } from 'json-schema-to-ts';

import { isDev } from '@/lib/consts';
import { postProductSchema, productSearchSchema } from '@/lib/schemas';

export default function (
  fastify: FastifyInstance,
  opts: RouteShorthandOptions,
  done: (err?: Error) => void,
) {
  // Post
  fastify.post(
    '/',
    {
      ...opts,
      onRequest: fastify.verifyAdmin,
      schema: { body: postProductSchema },
    },
    async (req, reply) => {
      // ...
    },
  );

  // Search

  fastify.get<{
    Querystring: FromSchema<typeof productSearchSchema>;
  }>(
    '/search',
    { ...opts, schema: { querystring: productSearchSchema } },
    async (req, reply) => {
      const { lang, q, page, per_page, sort, price_min, price_max } = req.query;
      const productsDb = fastify.mongo.db!.collection<Product>('products');

      if (isDev) console.log('query:', req.query); // DEV

      try {
        const filter: Filter<Product> = {
          active: true,
          stock: { $gt: 0 }, // !
        };

        const $and: Filter<Product>['$and'] = [];

        // Query
        if (q) {
          const $regex = new RegExp(q);
          filter[`name.${lang}`] = { $regex, $options: 'gi' };
        }

        // Price
        [
          { key: 'min', val: price_min },
          { key: 'max', val: price_max },
        ].forEach(({ key, val }) => {
          if (val !== undefined) {
            $and.push({
              realPrice: key === 'min' ? { $gte: val } : { $lte: val },
            });
          }
        });

        if ($and.length) filter.$and = $and;

        // = Pipeline =
        const pipeline: Document[] = [{ $match: filter }];

        // Handle price
        if (price_min || price_max || sort?.startsWith('price')) {
          pipeline.unshift({
            $set: {
              realPrice: {
                $cond: {
                  if: { $gt: ['$price.discount', 0] },
                  then: '$price.discount',
                  else: '$price.full',
                },
              },
            },
          });
        }

        // Count all products matching filters
        const countOp = await productsDb
          .aggregate<{ total: number }>([
            ...pipeline,
            { $group: { _id: null, total: { $sum: 1 } } },
          ])
          .toArray();

        const total = countOp[0] ? countOp[0].total : 0;
        if (total === 0) return { products: [], total };

        // Sort
        if (sort)
          switch (sort) {
            case 'name':
              pipeline.push({ name: 1 });
              break;
            case 'name-r':
              pipeline.push({ name: -1 });
              break;
            case 'price':
              pipeline.push({ realPrice: 1 });
              break;
            case 'price-r':
              pipeline.push({ realPrice: -1 });
              break;
          }

        // Pagination
        const assuredPage = page || 1;
        const assuredPerPage = per_page || defaultPerPage;
        pipeline.push(
          { $skip: (assuredPage - 1) * assuredPerPage },
          { $limit: defaultPerPage },
        );

        return {
          products: await productsDb.aggregate<Product>(pipeline).toArray(),
          total,
        };
      } catch (err) {
        console.error(err);
        // if (err === 400) {
        //   reply.code(400).send({ err: 'bad req' });
        // } else {
        reply.code(500).send({ err: 'server err' });
        // }
      }
    },
  );

  // Get single
  fastify.get<{ Params: { sku: string } }>(
    '/:sku',
    { ...opts },
    async (req, reply) => {
      const { sku } = req.params;
      const productsDb = fastify.mongo.db!.collection<Product>('products');

      try {
        return productsDb.findOne({ sku });
      } catch (err) {
        reply.code(500).send({ err: 'server err' });
      }
    },
  );

  done();
}
