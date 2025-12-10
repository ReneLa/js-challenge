# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy lockfile and package.json to install dependencies in the correct subdirectory
COPY ./frontend/package.json ./frontend/pnpm-lock.yaml ./frontend/.npmrc* ./

RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependency modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy only the necessary source files for the frontend, NOT the entire project root
COPY ./frontend .

# Copy the proto file
COPY ./backend/src/proto/user.proto ./public/proto/

RUN corepack enable pnpm && pnpm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built standalone output and public files from the builder stage
# This needs to be relative to the build context
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
