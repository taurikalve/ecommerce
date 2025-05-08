import fp from 'fastify-plugin';

export default fp(function (fastify, opts, done) {
  fastify
    .decorate('verifyRefresh', async (req, reply) => {
      try {
        await req.jwtVerify({ onlyCookie: true });
      } catch {
        return reply.code(401).send({ err: 'unauthorized' });
      }
    })
    .decorate('verifyUser', async (req, reply) => {
      try {
        const { status } = await req.jwtVerify<AccessToken>();
        if (status < 2) throw 'status';
      } catch {
        return reply.code(401).send({ err: 'unauthorized' });
      }
    })
    .decorate('verifyAdmin', async (req, reply) => {
      try {
        const { status } = await req.jwtVerify<AccessToken>();
        if (status < 3) throw 'not admin';
      } catch {
        return reply.code(401).send({ err: 'unauthorized' });
      }
    })
    .decorate('verifySocket', async (req, reply) => {
      try {
        const token = req.headers['sec-websocket-protocol'];
        if (!token) throw 'no token';
        const { status } = fastify.jwt.verify<AccessToken>(token);
        if (status < 3) throw 'not admin';
      } catch {
        return reply.code(401).send({ err: 'unauthorized' });
      }
    });

  done();
});
