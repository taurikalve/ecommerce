import util from 'node:util';
import { readEnv } from '@ecommerce/utils';
import { __rootDir } from '@/lib/consts';

readEnv(__rootDir, 'development');

export const MONGO_URI = process.env.MONGO_URI!;
export const PORT = parseInt(process.env.PORT!);

// Validation
if (([MONGO_URI, PORT || undefined] as any[]).includes(undefined)) {
  console.error(
    '>process env err:',
    util.inspect(process.env, {
      showHidden: false,
      depth: null,
      colors: true,
    }),
  );
  throw new Error('invalid env');
}
