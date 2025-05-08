# NB! Must be ran from monorepo root context
FROM node:22-alpine AS base
RUN apk update

# Install dependencies
FROM base AS deps
# Check https://github.com/nodejs/docker-node?tab=readme-ov-file#nodealpine
RUN apk add --no-cache gcompat

WORKDIR /ecommerce
# root 
COPY package.json package-lock.json* ./
# app 
COPY frontend/package.json frontend/package-lock.json* ./frontend/

RUN npm ci

# Build source code
FROM base AS builder
WORKDIR /ecommerce
COPY --from=deps /ecommerce .
COPY frontend ./frontend
COPY shared ./shared
ENV NEXT_TELEMETRY_DISABLED=1
# Necessary to avoid next.js err
RUN npm run build -w @ecommerce/consts -w @ecommerce/utils
RUN npm run build -w frontend

# Create production image
FROM base AS runner
WORKDIR /ecommerce
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /ecommerce/frontend/public ./frontend/public

# Set the correct permission for prerender cache
RUN mkdir -p frontend/.next
RUN chown nextjs:nodejs frontend/.next

# root
COPY --from=deps /ecommerce .
# app
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /ecommerce/frontend/.next/standalone \ 
  ./frontend
COPY --from=builder --chown=nextjs:nodejs /ecommerce/frontend/.next/static \
  ./frontend/.next/static
# shared
COPY --from=builder /ecommerce/shared/utils/package.json ./shared/utils/
COPY --from=builder /ecommerce/shared/utils/build ./shared/utils/build
COPY --from=builder /ecommerce/shared/consts/package.json ./shared/consts/
COPY --from=builder /ecommerce/shared/consts/build ./shared/consts/build

RUN npm prune --omit=dev

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "frontend/server.js"]