FROM node:22-alpine AS base
ARG PORT=3000
RUN apk update

# Install dependencies
FROM base AS deps
# Check https://github.com/nodejs/docker-node?tab=readme-ov-file#nodealpine
RUN apk add --no-cache gcompat

WORKDIR /ecommerce
# root 
COPY package.json package-lock.json* ./
# app 
COPY backend/package.json backend/package-lock.json* ./backend/

RUN npm ci

# Build source
FROM base AS builder
WORKDIR /ecommerce
COPY --from=deps /ecommerce .
COPY backend ./backend
COPY shared ./shared
RUN npm run build --workspaces

# Create production image
FROM base AS runner
WORKDIR /ecommerce
ENV NODE_ENV=production
# root
COPY --from=deps /ecommerce .
# app
COPY --from=builder /ecommerce/backend/build ./backend/build
# COPY --from=builder /ecommerce/backend/env* ./backend/
# shared
COPY --from=builder  /ecommerce/shared/utils/build ./shared/utils/build
COPY --from=builder /ecommerce/shared/utils/package.json ./shared/utils/
COPY --from=builder /ecommerce/shared/consts/build ./shared/consts/build
COPY --from=builder /ecommerce/shared/consts/package.json ./shared/consts/

RUN npm prune --omit=dev

# EXPOSE $PORT

CMD ["npm", "run", "start", "-w", "backend"]