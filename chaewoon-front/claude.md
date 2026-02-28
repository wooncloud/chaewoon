# chaewoon-front

Next.js 16 프론트엔드. App Router + Turbopack. 다크 모드 기반 자개 공예 커머스 UI.

> 전체 아키텍처: [루트 claude.md](../claude.md)

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4, Custom CSS (pearl gradient)
- **UI Components**: CVA 기반 자체 구현 (Button, Badge, Input, Toast)
- **Animation**: Framer Motion
- **State**: Zustand (위시리스트 persist + 토스트 비persist)
- **Charts**: SVG 기반 자체 구현 (BarChart, DonutChart, MiniChart)
- **Icons**: Lucide React
- **Language**: TypeScript (strict)
- **API**: REST 호출 (`src/lib/api.ts`)
- **공유 타입**: `chaewoon-shared` 워크스페이스 패키지에서 import

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
│   ├── ui/                         # Button, Badge, Input, Toast (CVA 기반)
│   ├── layout/
│   │   ├── header.tsx              # 위시리스트 카운트 표시
│   │   ├── footer.tsx
│   │   ├── client-layout.tsx       # Admin 경로 판별 → Header/Footer 조건부 렌더링
│   │   └── toast-container.tsx     # 토스트 목록 렌더 (우상단 고정)
│   ├── product/
│   │   └── product-card.tsx        # 상품 카드 (썸네일, SOLD 오버레이, 위시리스트 하트)
│   └── admin/
│       ├── sidebar.tsx             # Admin 네비게이션
│       ├── product-form.tsx        # 작품 등록/수정 공통 폼
│       └── charts/                 # BarChart, DonutChart, MiniChart (SVG)
├── lib/
│   ├── api.ts                      # ⭐ REST API 클라이언트 + ApiError + showApiError/showSuccess
│   ├── utils.ts                    # cn(), formatPrice()
│   ├── hooks.ts                    # useIsMounted() — hydration 안전 패턴
│   ├── constants.ts                # OrderStatus 라벨, 색상, HEX, 옵션 목록
│   └── toast-store.ts             # Zustand (비persist) — 토스트 상태 관리
├── store/
│   └── wishlist.ts                 # Zustand persist — ids: string[] (ID만 저장)
├── types/
│   └── index.ts                    # chaewoon-shared에서 re-export
├── next.config.ts                  # output: "standalone" (Docker용)
├── Dockerfile
└── .env.local                      # NEXT_PUBLIC_API_URL=http://localhost:3849
```

## API 클라이언트 (`src/lib/api.ts`)

모든 백엔드 호출은 이 파일을 통해 이루어짐. 타입은 `chaewoon-shared`에서 import.

### 에러 처리
- **`ApiError`** 클래스: `statusCode`, `message`, `errors?` 필드를 가진 에러 객체. 백엔드의 `ApiErrorResponse` 형태를 파싱.
- **`showApiError(err)`**: `ApiError`이면 메시지 추출, 아니면 기본 메시지 → 빨간 토스트 표시
- **`showSuccess(msg)`**: 초록 토스트 표시
- 모든 API 페이지에서 catch → `showApiError()` / 성공 → `showSuccess()` 패턴 사용

### 주요 exports
- **에러 헬퍼**: `ApiError`, `showApiError()`, `showSuccess()`
- **Products**: `fetchProducts()`, `fetchProduct()`, `createProduct()`, `updateProduct()`, `deleteProduct()`, `markProductSold()`, `toggleProductPublished()`, `toggleProductFeatured()`
- **Orders**: `fetchOrders()`, `fetchOrder()`, `createOrder()`, `updateOrderStatus()`
- **Coupons**: `fetchCoupons()`, `validateCoupon()`, `createCoupon()`, `updateCoupon()`, `deleteCoupon()`, `toggleCouponActive()`
- **Analytics**: `fetchAnalyticsSummary()`, `fetchMonthlyRevenue()`, `fetchOrderStatusDistribution()`, `fetchTopProducts()`

## Toast 시스템

### 구성
- **`lib/toast-store.ts`**: Zustand 스토어 (persist 없음). `addToast(variant, message)` → 3초 후 자동 제거.
- **`components/ui/toast.tsx`**: CVA 기반 토스트 컴포넌트. variant: `error` (빨강) / `success` (초록) / `info` (파랑).
- **`components/layout/toast-container.tsx`**: 우상단 고정 위치에 토스트 목록 렌더. `layout.tsx`에 마운트됨.

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

`chaewoon-shared`에서 모든 타입을 re-export. 직접 타입을 정의하지 않음.

### OrderStatus (UPPERCASE)
`"PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELLED"`

### Order (플랫 shipping 필드)
shipping 정보가 중첩 객체가 아닌 플랫 필드: `shippingName`, `shippingPhone`, `shippingZipCode`, `shippingAddress`, `shippingDetail`

### Coupon
`discountType: "PERCENT" | "FIXED"` (Prisma enum과 일치)

> 타입 추가/변경 시 `chaewoon-shared/src/types.ts`를 수정할 것. `types/index.ts`는 re-export만.

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

## 작업 매뉴얼

모든 작업 완료 후 반드시 아래 절차를 수행한다.

### 1. 코드 품질 검토
- 코드 작성 전후로 로직을 재검토하여 오류를 방지
- 불필요한 변수, 사용하지 않는 임포트, 중복 코드를 제거
- 반복되는 UI 패턴이나 로직은 반드시 모듈화/컴포넌트화하여 유지보수성을 높임

### 2. 빌드 검증
- `pnpm build` (루트에서) 실행하여 shared + 프론트엔드 빌드 성공 확인

### 3. 문서 최신화
- 변경된 내용을 이 파일(`claude.md`)과 루트 `CLAUDE.md`에 반영
- 새로운 컴포넌트, 변경된 구조, 추가된 기능 등을 문서에 기록
- 삭제된 기능이나 변경된 패턴은 문서에서도 업데이트
