# eCommerce

### WIP!

eCommerce platform built on:

- TypeScript
- Node.js -> Fastify
- React -> Next.js
- MongoDB
- Docker
- npm workspaces

Made for POSIX-compliant systems.
Adjust mongodb connection strings in `.env*` files as required, by default:

- `dev`: _Running on host for development and testing._ MongoDB running on `localhost:27017` without authentication
- `test`: _Testing Docker containers locally._ MongoDB container on `mongo-net`.

Production adjust as necessary, be default assumes the proxy will be **Traefik**, with an independent MongoDB container.
