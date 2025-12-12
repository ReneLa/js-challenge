FROM node:22-alpine AS builder

RUN npm install -g pnpm@10.14.0
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY prisma ./prisma
RUN pnpm prisma generate

COPY src ./src
COPY tsconfig.json ./
RUN pnpm build

# Copy the docs and proto directories to dist after build
RUN mkdir -p dist/docs && cp -r src/docs/*.yaml dist/docs/
RUN mkdir -p dist/proto && cp -r src/proto/*.proto dist/proto/

FROM node:22-alpine AS production

RUN npm install -g pnpm@10.14.0
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile && \
    pnpm prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD sh -c "pnpm prisma migrate deploy && node dist/app.js"
