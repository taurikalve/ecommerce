import buildApp from '@/app';
import { __certsDir } from '@/lib/consts';
import { PORT } from '@/lib/env';

const fastify = buildApp();

fastify.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) throw err;
  console.log(`server listening on`, PORT);
});
