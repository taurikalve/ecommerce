export type Lang = 'et' | 'en';

type LangObj<T> = { [L in Lang]: T };

type Price = {
  discount?: number;
  full: number;
};

export type SortKey = 'price' | 'price-r' | 'name' | 'name-r' | 'default';

export interface Product {
  sku: string;
  name: LangObj<string>;
  slug: LangObj<string>;
  description: LangObj<string>;
  price: Price;
  stock: number;
  active: boolean;
}
