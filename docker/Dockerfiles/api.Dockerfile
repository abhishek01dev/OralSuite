FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.26.1 --activate
WORKDIR /app

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/config/package.json ./packages/config/
COPY packages/shared/package.json ./packages/shared/
COPY packages/db-mysql/package.json ./packages/db-mysql/
COPY packages/db-mongo/package.json ./packages/db-mongo/
COPY packages/auth/package.json ./packages/auth/
COPY packages/rbac/package.json ./packages/rbac/
COPY packages/cache/package.json ./packages/cache/
COPY packages/logger/package.json ./packages/logger/
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile --prod

FROM base AS builder
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/
COPY tsconfig.base.json ./
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/db-mysql exec prisma generate
RUN pnpm --filter @repo/api run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 fastify
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/ ./packages/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/db-mysql/node_modules/.prisma ./packages/db-mysql/node_modules/.prisma
USER fastify
EXPOSE 3000
CMD ["node", "apps/api/dist/server.js"]
