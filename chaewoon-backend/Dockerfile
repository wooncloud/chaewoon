# ─── Stage 1: Build shared + backend ───
FROM node:20-alpine AS builder

RUN npm install -g pnpm@9

WORKDIR /app

# 워크스페이스 루트 설정
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY chaewoon-shared/package.json ./chaewoon-shared/
COPY chaewoon-backend/package.json ./chaewoon-backend/
COPY chaewoon-front/package.json ./chaewoon-front/

# 워크스페이스 의존성 설치
RUN pnpm install --frozen-lockfile

# shared 빌드
COPY chaewoon-shared/ ./chaewoon-shared/
RUN pnpm --filter chaewoon-shared build

# backend 빌드
COPY chaewoon-backend/ ./chaewoon-backend/
WORKDIR /app/chaewoon-backend
RUN npx prisma generate
RUN pnpm build && ls dist/main.js

# pnpm deploy로 symlink 없는 배포 번들 생성 + Prisma 클라이언트 재생성
WORKDIR /app
RUN pnpm --filter chaewoon-backend deploy /deploy
WORKDIR /deploy
RUN npx prisma generate

# ─── Stage 2: Production ───
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /deploy ./
COPY --from=builder /app/chaewoon-backend/dist ./dist

RUN mkdir -p /app/uploads

EXPOSE 3849

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
