import type { SortKey } from '@ecommerce/types';

export const sort: SortKey[] = ['price', 'price-r', 'name', 'name-r'];

export const priceSchema = {
  type: 'object',
  properties: {
    full: { type: 'number' },
    discount: { type: 'number' },
  },
  required: ['full'],
  additionalProperties: false,
} as const;

export const langStringSchema = {
  type: 'object',
  properties: {
    et: { type: 'string' },
    en: { type: 'string' },
  },
  required: ['et', 'en'],
  additionalProperties: false,
} as const;

export const productSchema = {
  type: 'object',
  properties: {
    sku: { type: 'string' },
    name: langStringSchema,
    slug: langStringSchema,
    description: langStringSchema,
    price: priceSchema,
    active: { type: 'boolean' },
    stock: { type: 'number' },
  },
  required: ['sku', 'name', 'slug', 'description', 'price', 'active'],
  additionalProperties: false,
} as const;
