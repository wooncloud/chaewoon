# chaewoon-backend

NestJS 11 백엔드 API 서버. Prisma ORM + PostgreSQL 16.

> 전체 아키텍처: [루트 claude.md](../claude.md)

## Tech Stack
- **Framework**: NestJS 11 (Express)
- **ORM**: Prisma 6 (PostgreSQL 16)
- **Validation**: class-validator + class-transformer
- **Language**: TypeScript 5 (strict)
- **공유 타입**: `chaewoon-shared` 워크스페이스 패키지에서 import

## 디렉토리 구조

```
chaewoon-backend/
├── prisma/
│   ├── schema.prisma          # DB 스키마 (Product, Order, OrderItem, Coupon)
│   ├── migrations/            # Prisma 마이그레이션
│   └── seed.ts                # 초기 데이터 (8 상품, 3 쿠폰, 8 주문)
├── src/
│   ├── main.ts                # 엔트리포인트 (CORS, ValidationPipe, HttpExceptionFilter, port)
│   ├── app.module.ts          # 루트 모듈 (4개 모듈 import)
│   ├── common/
│   │   └── http-exception.filter.ts  # 글로벌 예외 필터 (ApiErrorResponse 형태)
│   ├── prisma/
│   │   ├── prisma.service.ts  # PrismaClient 확장 (lifecycle hooks)
│   │   └── prisma.module.ts   # 글로벌 모듈 (isGlobal: true)
│   ├── products/
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   └── products.dto.ts    # CreateProductDto, UpdateProductDto
│   ├── orders/
│   │   ├── orders.module.ts
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts  # ⚠️ $transaction 사용 (원자적 주문 생성)
│   │   └── orders.dto.ts      # CreateOrderDto, UpdateOrderStatusDto
│   ├── coupons/
│   │   ├── coupons.module.ts
│   │   ├── coupons.controller.ts
│   │   ├── coupons.service.ts # validate() — 쿠폰 검증/할인 계산
│   │   └── coupons.dto.ts
│   └── analytics/
│       ├── analytics.module.ts
│       ├── analytics.controller.ts
│       └── analytics.service.ts  # KPI, 월별 매출, 주문 상태, 인기 상품
├── .env                       # DATABASE_URL, PORT=3849, CORS_ORIGIN
├── .env.example
├── Dockerfile                 # 멀티스테이지 빌드 (모노레포 루트 컨텍스트)
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json        # 빌드용 (prisma 디렉토리 제외)
└── package.json
```

## DB 스키마 (Prisma)

### Models
- **Product**: id, name, description, price(Int), thumbnail, bodyImages[], tags[], sold, featured, published, createdAt, updatedAt
- **Order**: id, items(OrderItem[]), subtotal, couponDiscount, total, couponCode?, status(OrderStatus), shipping 필드 5개, createdAt, updatedAt
- **OrderItem**: id, orderId, productId, quantity (Order/Product cascade)
- **Coupon**: id, code(unique), description, discountType(DiscountType), discountValue, minOrderAmount, maxDiscountAmount?, validFrom, validUntil, isActive, createdAt, updatedAt

### Enums
- **OrderStatus**: `PENDING | CONFIRMED | SHIPPING | DELIVERED | CANCELLED`
- **DiscountType**: `PERCENT | FIXED`
- Enum 타입과 런타임 값 배열은 `chaewoon-shared`에서 import (`OrderStatus`, `ORDER_STATUS_VALUES`, `DiscountType`, `DISCOUNT_TYPE_VALUES`)
- DTO 유효성 검사에서 `@IsIn(ORDER_STATUS_VALUES)` / `@IsIn(DISCOUNT_TYPE_VALUES)` 패턴 사용

### 주의사항
- 가격은 모두 `Int` (원 단위, 소수점 없음)
- shipping 필드는 Order 모델에 플랫하게 존재 (중첩 객체 아님): `shippingName`, `shippingPhone`, `shippingZipCode`, `shippingAddress`, `shippingDetail`
- 날짜 필드(`validFrom`, `validUntil`)는 `@IsDateString()` 사용 (`@IsString()` 아님)

## API 엔드포인트

### Products `/products`
| Method | Path | 설명 |
|--------|------|------|
| GET | `/products` | 목록 (쿼리: `search`, `sold`, `published`, `featured`) |
| GET | `/products/:id` | 상세 |
| POST | `/products` | 생성 |
| PATCH | `/products/:id` | 수정 |
| DELETE | `/products/:id` | 삭제 |
| PATCH | `/products/:id/sold` | 판매 완료 처리 |
| PATCH | `/products/:id/toggle-published` | 게시/비공개 토글 |
| PATCH | `/products/:id/toggle-featured` | 추천 토글 |

### Orders `/orders`
| Method | Path | 설명 |
|--------|------|------|
| GET | `/orders` | 목록 (쿼리: `status`) |
| GET | `/orders/:id` | 상세 (items.product include) |
| POST | `/orders` | 생성 (**$transaction**: sold 확인 → 주문 생성 → markAsSold) |
| PATCH | `/orders/:id/status` | 상태 변경 |

### Coupons `/coupons`
| Method | Path | 설명 |
|--------|------|------|
| GET | `/coupons` | 목록 |
| GET | `/coupons/validate` | 검증 (쿼리: `code`, `amount`) → `{ valid, coupon, discount, finalAmount }` |
| POST | `/coupons` | 생성 |
| PATCH | `/coupons/:id` | 수정 |
| DELETE | `/coupons/:id` | 삭제 |
| PATCH | `/coupons/:id/toggle-active` | 활성/비활성 토글 |

### Analytics `/analytics`
| Method | Path | 설명 |
|--------|------|------|
| GET | `/analytics/summary` | KPI (매출, 주문수, 평균, 판매/가용 수, 상품수, 쿠폰수) |
| GET | `/analytics/monthly-revenue` | 월별 매출 `{ key, label, revenue }[]` |
| GET | `/analytics/order-status` | 주문 상태 분포 `{ status, count }[]` |
| GET | `/analytics/top-products` | 인기 상품 (쿼리: `limit`) `{ product, orderCount, totalQuantity }[]` |

## 글로벌 예외 필터 (`common/http-exception.filter.ts`)

모든 예외를 `ApiErrorResponse` (chaewoon-shared) 형태로 통일하여 응답.

```typescript
// 응답 형태 (ApiErrorResponse):
{
  statusCode: number,
  message: string,
  errors?: string[],     // ValidationPipe 에러 시 개별 에러 목록
  timestamp: string      // ISO 8601
}
```

- `HttpException`: statusCode + message 추출
- `ValidationPipe` 에러 (message가 배열): `errors` 필드로 분리, message = "입력값을 확인해주세요."
- 알 수 없는 예외: 500 + "서버 오류가 발생했습니다." + `console.error` 로깅

## 핵심 로직

### 원자적 주문 생성 (`orders.service.ts`)
```typescript
// Prisma $transaction 내에서:
// 1. product.sold 확인 → 이미 sold면 throw
// 2. Order + OrderItem 생성
// 3. product.sold = true 업데이트
// → 동시 구매 시도의 race condition 방지
```

### 쿠폰 검증 (`coupons.service.ts`)
- isActive 확인
- 유효 기간 확인 (validFrom ~ validUntil)
- 최소 주문 금액 확인
- 할인 계산 (PERCENT: `amount * discountValue / 100`, FIXED: `discountValue`)
- maxDiscountAmount 있으면 상한 적용

## 개발 명령어

```bash
# 개발 서버
pnpm start:dev

# 빌드
pnpm build

# Prisma
pnpm prisma:generate    # 클라이언트 생성
pnpm prisma:migrate     # 개발 마이그레이션
pnpm prisma:seed        # 시드 데이터 삽입

# 프로덕션
pnpm start:prod
```

## 시드 데이터
- 상품 8개 (자개 공예 작품, 2개 판매 완료)
- 쿠폰 3개: `WELCOME10` (10%), `CHAEWOON5000` (5,000원), `PREMIUM20` (20%)
- 주문 8건 (PENDING, CONFIRMED, SHIPPING, DELIVERED, CANCELLED 다양한 상태)

## 빌드 참고
- `tsconfig.build.json`에서 `prisma/` 디렉토리를 exclude — `prisma/seed.ts`가 `rootDir` 계산에 영향을 주어 `dist/src/main.js`로 빌드되는 것을 방지
- Docker 빌드 컨텍스트는 모노레포 루트 (shared 패키지 접근을 위해)
- Docker에서 `pnpm deploy`로 symlink 없는 배포 번들 생성 + `prisma generate` 재실행
- `prisma`는 dependencies에 위치 (런타임 `prisma migrate deploy` 필요)

## 작업 매뉴얼

모든 작업 완료 후 반드시 아래 절차를 수행한다.

### 1. 코드 품질 검토
- 코드 작성 전후로 로직을 재검토하여 오류를 방지
- 불필요한 변수, 사용하지 않는 임포트, 중복 코드를 제거
- 반복되는 UI 패턴이나 로직은 반드시 모듈화/컴포넌트화하여 유지보수성을 높임

### 2. 빌드 검증
- `pnpm build` (루트에서) 실행하여 shared + 백엔드 빌드 성공 확인

### 3. 문서 최신화
- 변경된 내용을 이 파일(`claude.md`)과 루트 `CLAUDE.md`에 반영
- 새로운 모듈, 변경된 구조, 추가된 기능 등을 문서에 기록
- 삭제된 기능이나 변경된 패턴은 문서에서도 업데이트
