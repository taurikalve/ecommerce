import {
  FastifyPluginCallback,
  FastifyRequest,
  FastifyReply,
  HookHandlerDoneFunction,
} from 'fastify';
import { VerifyPayloadType } from '@fastify/jwt';
import { FastifyMongoObject } from '@fastify/mongodb';
import { Db } from 'mongodb';
// import { FastifyJwtNamespace } from '@fastify/jwt';
// import { FastifyCookie } from '@fastify/cookie';

declare module 'fastify' {
  interface FastifyInstance {
    // verifyAccess: (
    //   request: FastifyRequest,
    //   reply: FastifyReply,
    //   done: HookHandlerDoneFunction,
    // ) => void;
    verifyUser: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<unknown>;
    verifyRefresh: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<unknown>;
    verifyAdmin: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<unknown>;
    verifySocket: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<unknown>;
  }
}
