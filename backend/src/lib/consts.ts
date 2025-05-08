import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export const isDev = process.env.NODE_ENV === 'development';

export const __rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);
export const __certsDir = path.join(__rootDir, 'certs');
