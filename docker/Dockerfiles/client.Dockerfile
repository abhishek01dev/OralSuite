FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.26.1 --activate
WORKDIR /app

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
COPY apps/client/package.json ./apps/client/
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/ ./packages/
COPY --from=deps /app/apps/client/node_modules ./apps/client/node_modules
COPY packages/ ./packages/
COPY apps/client/ ./apps/client/
COPY tsconfig.base.json ./
RUN pnpm --filter @repo/client run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/apps/client/.next/standalone ./
COPY --from=builder /app/apps/client/.next/static ./apps/client/.next/static
COPY --from=builder /app/apps/client/public ./apps/client/public
USER nextjs
EXPOSE 3002
ENV PORT=3002
CMD ["node", "apps/client/server.js"]
