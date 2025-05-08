import { langs } from '@ecommerce/consts';
import * as lib from './schemaLib';

export const postProductSchema = lib.productSchema;

export const productSearchSchema = {
  type: 'object',
  properties: {
    q: { type: 'string' },
    page: { type: 'number' },
    sort: { type: 'string', enum: lib.sort },
    lang: { type: 'string', enum: langs },
    per_page: { type: 'number' },
    price_min: { type: 'number' },
    price_max: { type: 'number' },
  },
  required: ['lang'],
} as const;
