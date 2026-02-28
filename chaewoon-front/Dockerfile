# ─── Stage 1: Build shared + frontend ───
FROM node:20-alpine AS builder

RUN npm install -g pnpm@9

WORKDIR /app

# 워크스페이스 루트 설정
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY chaewoon-shared/package.json ./chaewoon-shared/
COPY chaewoon-front/package.json ./chaewoon-front/
COPY chaewoon-backend/package.json ./chaewoon-backend/

# 워크스페이스 의존성 설치
RUN pnpm install --frozen-lockfile

# shared 빌드
COPY chaewoon-shared/ ./chaewoon-shared/
RUN pnpm --filter chaewoon-shared build

# frontend 빌드
COPY chaewoon-front/ ./chaewoon-front/
WORKDIR /app/chaewoon-front

ARG NEXT_PUBLIC_API_URL=http://localhost:3849
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN pnpm build

# ─── Stage 2: Production ───
FROM node:20-alpine AS runner

WORKDIR /app

# workspace 환경에서 standalone은 루트 구조를 미러링
COPY --from=builder /app/chaewoon-front/.next/standalone ./
COPY --from=builder /app/chaewoon-front/.next/static ./chaewoon-front/.next/static
COPY --from=builder /app/chaewoon-front/public ./chaewoon-front/public

EXPOSE 3847

ENV PORT=3847
ENV HOSTNAME="0.0.0.0"

CMD ["node", "chaewoon-front/server.js"]
