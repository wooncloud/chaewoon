# 모노레포 전환 + NestJS 백엔드 + 전체 API 마이그레이션 + Docker 계획

## 1. 모노레포 구조 설정 (pnpm workspaces)

```
chaewoon/
├── pnpm-workspace.yaml
├── package.json              # 루트 (scripts: dev, build 등)
├── docker-compose.yml        # 전체 스택 (front + backend + db)
├── .gitignore
├── claude.md
├── chaewoon-front/           # Next.js 프론트엔드 (기존 코드 이동)
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── src/
│   └── ...
└── chaewoon-backend/         # NestJS 백엔드 (신규)
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    ├── prisma/
    │   └── schema.prisma     # DB 스키마
    └── src/
        ├── main.ts
        ├── app.module.ts
        ├── products/         # 작품 CRUD API
        ├── orders/           # 주문 CRUD API
        ├── coupons/          # 쿠폰 CRUD API
        └── common/           # 공통 (DTO, 필터, 파이프)
```

## 2. 작업 순서

### Phase A: 모노레포 구조 전환
1. 루트에 `pnpm-workspace.yaml` 생성
2. 루트 `package.json` 생성 (workspaces 스크립트)
3. `chaewoon-front/` 디렉토리 생성 후 기존 Next.js 파일 전부 이동
4. 기존 루트 `node_modules`, `package-lock.json` 정리
5. `pnpm install` 실행하여 워크스페이스 의존성 설치

### Phase B: NestJS 백엔드 생성
1. `chaewoon-backend/` 디렉토리에 NestJS 프로젝트 생성
2. Prisma 설치 + PostgreSQL 연결 설정
3. DB 스키마 설계 (Product, Order, OrderItem, Coupon, ShippingAddress)
4. Prisma migration 실행
5. Seed 데이터 생성 (기존 Mock 데이터 기반)

### Phase C: API 엔드포인트 구현
**Products API**:
- `GET /products` - 목록 (query: search, sold, published)
- `GET /products/:id` - 상세
- `POST /products` - 등록
- `PATCH /products/:id` - 수정
- `DELETE /products/:id` - 삭제
- `PATCH /products/:id/sold` - 판매 완료 처리
- `PATCH /products/:id/toggle-published` - 게시 토글
- `PATCH /products/:id/toggle-featured` - 추천 토글

**Orders API**:
- `GET /orders` - 목록 (query: status)
- `GET /orders/:id` - 상세
- `POST /orders` - 주문 생성 (+ 작품 sold 처리)
- `PATCH /orders/:id/status` - 상태 변경

**Coupons API**:
- `GET /coupons` - 목록
- `GET /coupons/validate?code=XXX&amount=YYY` - 쿠폰 검증 + 할인 계산
- `POST /coupons` - 등록
- `PATCH /coupons/:id` - 수정
- `DELETE /coupons/:id` - 삭제
- `PATCH /coupons/:id/toggle-active` - 활성 토글

**Analytics API**:
- `GET /analytics/summary` - KPI 요약 (총 매출, 주문 수, 평균 금액, 판매 수량)
- `GET /analytics/monthly-revenue` - 월별 매출
- `GET /analytics/order-status` - 주문 상태 분포
- `GET /analytics/top-products` - 인기 작품 TOP 5

### Phase D: 프론트엔드 마이그레이션
1. API 클라이언트 유틸 생성 (`src/lib/api.ts`)
2. Zustand admin store → API 호출 기반으로 교체
3. 위시리스트 스토어 유지 (클라이언트 전용 기능)
4. 모든 페이지에서 Mock 데이터/로컬 스토어 → API 호출로 전환
5. `src/data/` 디렉토리 삭제 (Mock 데이터 제거)
6. 쿠폰 검증 로직을 백엔드 API 호출로 전환

### Phase E: Docker 구성
1. `chaewoon-backend/Dockerfile` - NestJS 멀티스테이지 빌드 (node:22-alpine)
2. `chaewoon-front/Dockerfile` - Next.js standalone 빌드 (node:22-alpine)
3. `docker-compose.yml` - 3서비스 (postgres, backend, frontend)
   - `db`: PostgreSQL 16, 볼륨 마운트
   - `backend`: NestJS, DB 의존, 포트 4000
   - `frontend`: Next.js, 백엔드 의존, 포트 3000
4. `.dockerignore` 각 패키지에 설정

### Phase F: 빌드 검증 + 정리
1. 백엔드 빌드 (`pnpm --filter chaewoon-backend build`)
2. 프론트엔드 빌드 (`pnpm --filter chaewoon-front build`)
3. claude.md 업데이트
4. 커밋 & 푸시

## 3. DB 스키마 (Prisma)

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Int
  thumbnail   String   @default("")
  bodyImages  String[] @default([])
  tags        String[] @default([])
  sold        Boolean  @default(false)
  featured    Boolean  @default(false)
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  orderItems  OrderItem[]
}

model Order {
  id              String        @id @default(cuid())
  items           OrderItem[]
  subtotal        Int
  couponDiscount  Int           @default(0)
  total           Int
  couponCode      String?
  status          OrderStatus   @default(PENDING)
  shippingName    String
  shippingPhone   String
  shippingZipCode String
  shippingAddress String
  shippingDetail  String        @default("")
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

model OrderItem {
  id        String  @id @default(cuid())
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId   String
  product   Product @relation(fields: [productId], references: [id])
  productId String
  quantity  Int     @default(1)
}

model Coupon {
  id               String     @id @default(cuid())
  code             String     @unique
  description      String
  discountType     DiscountType
  discountValue    Int
  minOrderAmount   Int        @default(0)
  maxDiscountAmount Int?
  validFrom        DateTime
  validUntil       DateTime
  isActive         Boolean    @default(true)
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPING
  DELIVERED
  CANCELLED
}

enum DiscountType {
  PERCENT
  FIXED
}
```

## 4. 주의사항
- 기존 `chaewoon-admin` localStorage 데이터는 마이그레이션 후 무효화됨 (DB로 이전)
- 위시리스트(`chaewoon-wishlist`)는 여전히 localStorage 유지 (productId 기반으로 변경)
- CORS 설정 필요 (백엔드 → 프론트엔드 `localhost:3000`)
- 프론트엔드 환경변수: `NEXT_PUBLIC_API_URL=http://localhost:4000`
- 주문 생성 시 트랜잭션 처리 (주문 생성 + 작품 sold 변경을 atomic하게)
