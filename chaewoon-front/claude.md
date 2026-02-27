# chaewoon-front

Next.js 16 프론트엔드. App Router + Turbopack. 다크 모드 기반 자개 공예 커머스 UI.

> 전체 아키텍처: [루트 claude.md](../claude.md)

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4, Custom CSS (pearl gradient)
- **UI Components**: CVA 기반 자체 구현 (Button, Badge, Input)
- **Animation**: Framer Motion
- **State**: Zustand (위시리스트 ID 저장 only, persist middleware)
- **Charts**: SVG 기반 자체 구현 (BarChart, DonutChart, MiniChart)
- **Icons**: Lucide React
- **Language**: TypeScript (strict)
- **API**: REST 호출 (`src/lib/api.ts`)

## 디렉토리 구조

```
chaewoon-front/src/
├── app/
│   ├── page.tsx                    # 메인 (Hero + 추천 작품)
│   ├── layout.tsx                  # 루트 레이아웃 (ClientLayout 래퍼)
│   ├── globals.css                 # 다크 테마, pearl gradient
│   ├── products/
│   │   ├── page.tsx                # 작품 목록 (published만 표시)
│   │   └── [id]/page.tsx           # 작품 상세 (썸네일 + 본문 갤러리, 바로 구매)
│   ├── wishlist/page.tsx           # 위시리스트 (ID 기반, API에서 상품 정보 조회)
│   ├── checkout/page.tsx           # 주문/결제 (쿼리 ?product=<id>, 쿠폰 적용)
│   └── admin/
│       ├── layout.tsx              # Admin 사이드바 레이아웃
│       ├── page.tsx                # 대시보드 (KPI + 현황 + 최근 주문/판매)
│       ├── products/
│       │   ├── page.tsx            # 작품 목록 (검색, 필터, 게시/추천 토글)
│       │   ├── new/page.tsx        # 작품 등록
│       │   └── edit/page.tsx       # 작품 수정 (?id=<id>)
│       ├── orders/page.tsx         # 주문 관리 (상태 필터, 상세 아코디언, 상태 변경)
│       ├── coupons/page.tsx        # 쿠폰 CRUD (인라인 폼, 활성 토글)
│       └── analytics/page.tsx      # 매출 통계 (KPI, 차트)
├── components/
│   ├── ui/                         # Button, Badge, Input (CVA 기반)
│   ├── layout/
│   │   ├── header.tsx              # 위시리스트 카운트 표시
│   │   ├── footer.tsx
│   │   └── client-layout.tsx       # Admin 경로 판별 → Header/Footer 조건부 렌더링
│   ├── product/
│   │   └── product-card.tsx        # 상품 카드 (썸네일, SOLD 오버레이, 위시리스트 하트)
│   └── admin/
│       ├── sidebar.tsx             # Admin 네비게이션
│       ├── product-form.tsx        # 작품 등록/수정 공통 폼
│       └── charts/                 # BarChart, DonutChart, MiniChart (SVG)
├── lib/
│   ├── api.ts                      # ⭐ REST API 클라이언트 (모든 백엔드 호출)
│   ├── utils.ts                    # cn(), formatPrice()
│   ├── hooks.ts                    # useIsMounted() — hydration 안전 패턴
│   └── constants.ts                # OrderStatus 라벨, 색상, HEX, 옵션 목록
├── store/
│   └── wishlist.ts                 # Zustand persist — ids: string[] (ID만 저장)
├── types/
│   └── index.ts                    # Product, Order, OrderItem, Coupon, OrderStatus 타입
├── next.config.ts                  # output: "standalone" (Docker용)
├── Dockerfile
└── .env.local                      # NEXT_PUBLIC_API_URL=http://localhost:3849
```

## API 클라이언트 (`src/lib/api.ts`)

모든 백엔드 호출은 이 파일을 통해 이루어짐. **Zustand admin store는 삭제됨** — 모든 데이터는 백엔드 API에서 조회.

### 주요 exports
- **타입**: `ApiProduct`, `ApiOrder`, `ApiCoupon`, `CouponValidation`, `AnalyticsSummary`, `MonthlyRevenue`, `OrderStatusDist`, `TopProduct`
- **Products**: `fetchProducts()`, `fetchProduct()`, `createProduct()`, `updateProduct()`, `deleteProduct()`, `markProductSold()`, `toggleProductPublished()`, `toggleProductFeatured()`
- **Orders**: `fetchOrders()`, `fetchOrder()`, `createOrder()`, `updateOrderStatus()`
- **Coupons**: `fetchCoupons()`, `validateCoupon()`, `createCoupon()`, `updateCoupon()`, `deleteCoupon()`, `toggleCouponActive()`
- **Analytics**: `fetchAnalyticsSummary()`, `fetchMonthlyRevenue()`, `fetchOrderStatusDistribution()`, `fetchTopProducts()`

## 상태 관리 주의사항

### 위시리스트 (`store/wishlist.ts`)
- `ids: string[]` — 상품 ID만 저장 (full Product 객체 아님)
- `addId(id)`, `removeId(id)`, `hasId(id)`, `clearAll()`, `getCount()`
- Zustand persist (localStorage)로 브라우저 간 유지
- 표시 시 각 ID에 대해 `fetchProduct()` 호출 → stale data 방지

### Hydration 안전 패턴
- `useIsMounted()` 훅 사용: Zustand persist가 서버/클라이언트 불일치를 일으키므로, `mounted`가 `true`일 때만 스토어 값 사용

## 이미지 시스템
- **thumbnail**: 카드/목록에 표시되는 대표 이미지 (1장)
- **bodyImages**: 상세 페이지에서 스크롤하며 볼 수 있는 갤러리 이미지 (복수)
- 이미지 없는 상품은 "彩" 플레이스홀더로 표시
- Admin 폼에서 URL 입력, 미리보기, 순서 변경(↑↓), 추가/삭제 가능

## 타입 정의 (`types/index.ts`)

### OrderStatus (UPPERCASE)
`"PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELLED"`

### Order (플랫 shipping 필드)
shipping 정보가 중첩 객체가 아닌 플랫 필드: `shippingName`, `shippingPhone`, `shippingZipCode`, `shippingAddress`, `shippingDetail`

### Coupon
`discountType: "PERCENT" | "FIXED"` (Prisma enum과 일치)

## 디자인 컨셉
- 다크 모드 기반 (`#0a0a0f` 배경)
- 자개 광택 그라데이션: rose → purple → cyan
- `.pearl-text`, `.pearl-gradient` CSS 클래스
- 모바일 우선 반응형 레이아웃

## 개발 명령어

```bash
pnpm dev          # 개발 서버 (port 3847, Turbopack)
pnpm build        # 프로덕션 빌드 (standalone output)
pnpm lint         # ESLint
```
