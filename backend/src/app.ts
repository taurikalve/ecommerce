import Fastify from 'fastify';
import mongodbPlugin from '@fastify/mongodb';
import corsPlugin from '@fastify/cors';
import authPlugin from '@fastify/auth';
import jwtPlugin from '@fastify/jwt';
import cookiePlugin from '@fastify/cookie';
import multipartPlugin from '@fastify/multipart';
import { Time } from '@ecommerce/utils';

import { isDev, __certsDir } from '@/lib/consts';
import { MONGO_URI } from '@/lib/env';
import { publicKey, privateKey } from '@/lib/rsaKeys';
import auth from '@/lib/auth';

import productRoutes from '@/routes/products';

export default function buildApp() {
  const fastify = Fastify({ logger: isDev });

  // console.log('certs dir:', __certsDir);
  // console.log('dir:', import.meta.dirname);

  // General
  fastify
    .register(mongodbPlugin, {
      forceClose: true,
      url: MONGO_URI,
    })
    .register(corsPlugin, { origin: true, credentials: true })
    .register(cookiePlugin)
    .register(multipartPlugin, { limits: { fieldSize: 100_000_000 } });

  // Auth
  fastify
    .register(authPlugin)
    .register(jwtPlugin, {
      secret: { public: publicKey, private: privateKey },
      cookie: {
        cookieName: 'refreshToken',
        signed: false,
      },
      sign: {
        expiresIn: Time.toMs('7d'),
      },
    })
    .register(auth);

  // Routes
  fastify.register(productRoutes, { prefix: '/product' });

  // Dir setup
  // for (const dir of [__staticDir, __tempDir]) {
  //   fs.mkdir(dir, { recursive: true }, (err) => {
  //     if (err) throw err;
  //   });
  // }

  // Init
  // if (process.env.INIT) init(fastify.mongo.db!).then(() => process.exit(0));

  return fastify;
}
