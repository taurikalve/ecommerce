import { PORT } from '@/lib/env';
import util from 'node:util';

const url = new URL(`http://localhost:${PORT}/product/search`);
url.searchParams.append('lang', 'et');
url.searchParams.append('page', String(1));
// url.searchParams.append('page', 'xdf');
url.searchParams.append('per_page', String(69));

try {
  const res = await fetch(url);

  console.log(url.toString());
  console.log(
    util.inspect(await res.json(), {
      showHidden: false,
      depth: null,
      colors: true,
    }),
  );
} catch (err) {
  console.error(err);
}
