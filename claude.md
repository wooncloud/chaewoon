# 채운(彩雲) Commerce Platform

## 프로젝트 개요
자개 공예 브랜드 '채운(彩雲)'의 프리미엄 커머스 플랫폼.
세상에 단 하나뿐인 자개 공예 작품을 판매하는 1:1 한정 상품 모델.
다크 모드 기반 디자인, 자개 광택 그라데이션 포인트, 모바일 우선 레이아웃.

> 세부 문서: [프론트엔드](./chaewoon-front/claude.md) | [백엔드](./chaewoon-backend/claude.md)

## 아키텍처

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│  Frontend   │────▶│   Backend    │────▶│ PostgreSQL │
│  Next.js 16 │     │  NestJS 11   │     │    16      │
│  :3847      │     │  :3849       │     │  :5432     │
└─────────────┘     └──────────────┘     └────────────┘
```

- **모노레포**: pnpm workspaces
- **공유 패키지**: `chaewoon-shared/` — 공통 타입, enum, 에러 엔벨로프
- **프론트엔드**: `chaewoon-front/` — Next.js 16 (App Router, Turbopack)
- **백엔드**: `chaewoon-backend/` — NestJS 11 + Prisma ORM + PostgreSQL 16
- **인프라**: Docker (docker-compose.yml)

## 핵심 비즈니스 규칙

| 규칙 | 설명 |
|------|------|
| 단일 카테고리 | 자개 공예 작품만 판매 (카테고리 분류 없음) |
| 1:1 한정 상품 | 각 작품은 유일하며 판매 시 즉시 품절 (`sold: boolean`) |
| 재고 없음 | 수량(stock) 개념 없이 판매 여부(sold)만 관리 |
| 장바구니 없음 | 유일품 특성 → 위시리스트로 대체 |
| 바로 구매 | 상품 상세 → "바로 구매" → 결제 페이지 → 토스페이먼츠 결제 → 결제 완료 |
| 원자적 주문 | 백엔드에서 Prisma `$transaction`으로 sold 확인 + 주문 생성 + markAsSold 원자적 처리 |

## 모노레포 구조

```
chaewoon/
├── package.json              # 루트 (pnpm workspace scripts)
├── pnpm-workspace.yaml       # 워크스페이스 정의
├── docker-compose.yml        # PostgreSQL + Backend + Frontend
├── .dockerignore             # Docker 빌드 제외 (node_modules, .next, dist)
├── CLAUDE.md                 # ← 이 파일 (전체 아키텍처)
├── chaewoon-shared/          # 공유 패키지 (타입, enum, 에러 엔벨로프)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts          # barrel export
│       ├── types.ts          # Product, Order, Coupon, OrderStatus 등
│       └── error.ts          # ApiErrorResponse 인터페이스
├── chaewoon-front/           # Next.js 16 프론트엔드
│   ├── claude.md             # 프론트엔드 상세 문서
│   ├── Dockerfile
│   └── src/
└── chaewoon-backend/         # NestJS 11 백엔드
    ├── claude.md             # 백엔드 상세 문서
    ├── Dockerfile
    ├── prisma/               # Prisma 스키마 + 마이그레이션
    └── src/
```

## 포트 설정

| 서비스 | 포트 |
|--------|------|
| Frontend (Next.js) | 3847 |
| Backend (NestJS) | 3849 |
| PostgreSQL | 5432 |

## 개발 명령어

```bash
# 전체 개발 서버 (병렬)
pnpm dev

# 개별 서비스
pnpm dev:front      # 프론트엔드 (port 3847)
pnpm dev:backend    # 백엔드 (port 3849)

# 빌드 (shared → front + backend 순서)
pnpm build          # 전체 빌드
pnpm build:shared   # 공유 패키지만
pnpm build:front    # 프론트엔드만
pnpm build:backend  # 백엔드만
```

## Docker

```bash
pnpm docker:up      # 전체 서비스 기동 (DB + Backend + Frontend)
pnpm docker:up:d    # 백그라운드 실행
pnpm docker:down    # 전체 서비스 종료
pnpm docker:logs    # 로그 확인
```

서비스 3개: `db` (PostgreSQL 16), `backend` (NestJS), `frontend` (Next.js standalone).
- Docker 빌드 컨텍스트는 **모노레포 루트** (shared 패키지 접근을 위해)
- 워크스페이스 루트 설정(`pnpm-workspace.yaml` + `pnpm-lock.yaml`) 복사 후 `pnpm install --frozen-lockfile`
- 백엔드는 `pnpm deploy`로 symlink 없는 배포 번들 생성 + `prisma generate` 재실행
- 프론트엔드는 workspace 환경에서 standalone 출력이 `chaewoon-front/server.js` 경로
- DB 서비스에 `pg_isready` healthcheck 적용 → backend는 DB healthy 후 시작
- 백엔드 컨테이너 시작 시 `prisma migrate deploy`가 자동 실행됨
- 백엔드 `uploads` named volume으로 이미지 파일 영속화
- 프론트엔드에 `INTERNAL_API_URL=http://backend:3849` 환경변수 (middleware 서버사이드 호출용)
- Docker Compose에서 `TOSS_SECRET_KEY` (backend env), `NEXT_PUBLIC_TOSS_CLIENT_KEY` (frontend build arg) 전달

## 환경변수

| 변수 | 위치 | 기본값 |
|------|------|--------|
| `DATABASE_URL` | backend `.env` | `postgresql://postgres:postgres@localhost:5432/chaewoon?schema=public` |
| `PORT` | backend `.env` | `3849` |
| `CORS_ORIGIN` | backend `.env` | `http://localhost:3847` |
| `JWT_SECRET` | backend `.env` | JWT 서명 키 |
| `ADMIN_SETUP_KEY` | backend `.env` | 계정 관리 API 헤더 키 |
| `TOSS_SECRET_KEY` | backend `.env` | 토스페이먼츠 시크릿 키 |
| `DISCORD_ORDER_WEBHOOK_URL` | backend `.env` | 주문 알림 디스코드 웹훅 (선택) |
| `DISCORD_CONTACT_WEBHOOK_URL` | backend `.env` | 문의 알림 디스코드 웹훅 (선택) |
| `NEXT_PUBLIC_API_URL` | frontend `.env.local` | `http://localhost:3849` |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | frontend `.env.local` | 토스페이먼츠 클라이언트 키 |

## 공유 패키지 (`chaewoon-shared`)

프론트엔드와 백엔드가 공통으로 사용하는 타입과 인터페이스를 관리하는 워크스페이스 패키지.

### 제공하는 것
- **에러 엔벨로프**: `ApiErrorResponse` — 백엔드 예외 필터와 프론트엔드 `ApiError` 클래스가 공유
- **엔티티 타입**: `Product`, `Order`, `OrderItem`, `Coupon`
- **Enum 타입/값**: `OrderStatus`, `DiscountType` (타입) + `ORDER_STATUS_VALUES`, `DISCOUNT_TYPE_VALUES` (런타임 배열)
- **분석 타입**: `AnalyticsSummary`, `MonthlyRevenue`, `OrderStatusDist`, `TopProduct`, `CouponValidation`
- **문의 타입**: `ContactMessage`

### 타입 변경 시 규칙
1. `chaewoon-shared/src/types.ts`에서 타입 수정
2. `pnpm build:shared` 실행 (또는 `pnpm build`가 자동으로 shared 먼저 빌드)
3. 프론트엔드 `types/index.ts`는 shared에서 re-export하므로 자동 반영
4. 백엔드 DTO에서 shared의 enum 값 배열 사용 (`ORDER_STATUS_VALUES`, `DISCOUNT_TYPE_VALUES`)

## Admin 인증 체계

### 인증 플로우
```
브라우저 /admin 접근 → middleware.ts (쿠키 확인) → GET /auth/me → 인증 실패 시 /login 리다이렉트
                                                              → 인증 성공 시 Admin 페이지 렌더
```

- **JWT 기반**: httpOnly 쿠키 (`admin_token`), 24시간 유효
- **계정 잠금**: 5회 연속 실패 → 30분 잠금
- **Rate Limiting**: `@nestjs/throttler` — 전역 분당 60회, 로그인 분당 10회
- **계정 관리**: Postman으로 `X-Admin-Secret` 헤더와 함께 요청 (POST /auth/setup, PATCH /auth/password)

### Admin 전용 라우트 (AdminGuard)
- Products: POST, PATCH, DELETE (GET은 공개)
- Orders: GET, PATCH (POST /orders, POST /orders/:id/cancel, GET /orders/:id/summary는 공개)
- Coupons: 전체 CRUD (GET /coupons/validate만 공개)
- Payments: POST /payments/:id/refund (POST /payments/confirm은 공개)
- Contact: GET (POST /contact는 고객용 → 공개)
- Analytics: 전체

## 에러 처리 체계

### 백엔드 → 프론트엔드 에러 파이프라인
```
NestJS 예외 발생 → HttpExceptionFilter → ApiErrorResponse 형태로 응답
     ↓
프론트엔드 request() → ApiError throw → showApiError() → Toast 표시
```

- **백엔드**: `HttpExceptionFilter` (글로벌 예외 필터) — 모든 에러를 `ApiErrorResponse` 형태로 통일
- **프론트엔드**: `ApiError` 클래스 + `showApiError()` / `showSuccess()` 헬퍼 + Toast UI

## 자체 검토 절차 (커밋 전 필수)

### 1. 빌드 검증
- `pnpm build` 실행하여 shared/프론트/백엔드 모두 TypeScript 오류 없이 빌드되는지 확인

### 2. 데이터 일관성
- 타입(interface)에 필드 추가/변경 시, `chaewoon-shared`에서 수정하고 프론트/백엔드 모두 반영되었는지 확인
- Prisma 스키마 변경 시 마이그레이션 생성 + shared 타입 + 프론트엔드 API 클라이언트 동기화
- 프론트엔드 API 클라이언트(`api.ts`)와 백엔드 컨트롤러/DTO가 일치하는지 확인

### 3. 보안/접근 제어
- Admin API가 AdminGuard로 보호되는지 확인 (쿠키 없이 401 응답)
- 비공개(`published=false`) 상품이 고객 사이트에 노출되지 않는지 확인
- URL 직접 접근으로 비공개 리소스에 접근 불가한지 확인

### 4. 라우트/네비게이션
- 모든 Link href가 실제 존재하는 경로를 가리키는지 확인
- API 엔드포인트 URL이 프론트/백엔드 간 일치하는지 확인

### 5. 코드 품질
- 미사용 import, 변수, 함수 제거
- 반복 로직은 공통 모듈로 분리 (DRY)
- hydration 이슈: `useIsMounted` 훅으로 Zustand persist 처리

### 6. 모바일 반응형
- 작품 그리드: 모바일 1컬럼 / PC 다중 컬럼
- 테이블/폼이 모바일에서 오버플로우 없이 표시

> 이 절차를 통과한 후에만 커밋하고, claude.md를 업데이트한다.

## 작업 매뉴얼

모든 작업 완료 후 반드시 아래 절차를 수행한다.

### 1. 코드 품질 검토
- 코드 작성 전후로 로직을 재검토하여 오류를 방지
- 불필요한 변수, 사용하지 않는 임포트, 중복 코드를 제거
- 반복되는 UI 패턴이나 로직은 반드시 모듈화/컴포넌트화하여 유지보수성을 높임

### 2. 빌드 검증
- `pnpm build` 실행하여 전체 빌드 성공 확인

### 3. 문서 최신화
- 변경된 내용을 루트/프론트엔드/백엔드 모든 claude.md에 반영
- 새로운 파일, 변경된 구조, 추가된 기능 등을 문서에 기록
- 삭제된 기능이나 변경된 패턴은 문서에서도 업데이트

## 기술적 참고 사항
- Google Fonts 접근 불가 환경이므로 system-ui 폰트 사용
- shadcn/ui 레지스트리 접근 불가 → CVA 기반 자체 UI 컴포넌트 구현
- 차트 컴포넌트는 외부 라이브러리 없이 SVG로 자체 구현
- OrderStatus/DiscountType enum은 `chaewoon-shared`에서 관리 (UPPERCASE)
- 위시리스트는 ID 배열(`string[]`)만 저장, 표시 시 API에서 상품 정보 조회 (stale data 방지)
- Admin 영역과 고객 사이트는 `ClientLayout`을 통해 Header/Footer 조건부 렌더링
- 공통 타입은 `chaewoon-shared`에서 단일 소스로 관리 (프론트 `types/index.ts`는 re-export)

## 이미지 업로드 시스템

- **백엔드**: `POST /uploads` (AdminGuard, multer, 10MB, jpg/png/webp/gif)
- **저장 경로**: `./uploads/` (Docker: named volume `/app/uploads`)
- **정적 서빙**: `main.ts`의 `useStaticAssets` → `GET /uploads/:filename`
- **프론트엔드**: `uploadImage()` → FormData 전송, `toAbsoluteUrl()` → 상대 경로를 절대 URL로 변환
- **ProductForm**: 파일 선택 버튼으로 업로드 (썸네일 1장, 본문 이미지 복수)

## 디스코드 웹훅 알림

- **DiscordService** (`common/discord.service.ts`): 주문/문의 알림 전송
- 결제 확인(CONFIRMED) 시 `sendOrderNotification()` — 주문 정보 임베드 (fire-and-forget)
- 문의 접수 시 `sendContactNotification()` — 문의 내용 임베드 (fire-and-forget)
- 웹훅 URL 미설정 시 무시 (기능 비활성)
- env: `DISCORD_ORDER_WEBHOOK_URL`, `DISCORD_CONTACT_WEBHOOK_URL`

## 토스페이먼츠 결제 연동

- **결제 플로우**: 주문 생성(PENDING) → 토스 결제창 → 결제 성공 콜백 → 백엔드 결제 확인 → CONFIRMED
- **프론트엔드**: `@tosspayments/tosspayments-sdk`로 결제창 호출, `/checkout/success`에서 결제 확인, `/checkout/fail`에서 주문 취소
- **백엔드**: `POST /payments/confirm` — 토스 API로 paymentKey 검증 후 주문 확정 + 디스코드 알림
- **환불**: Admin에서 `POST /payments/:id/refund` → 토스 결제 취소 API + 주문 CANCELLED + 상품 sold 해제
- **Order 필드**: `paymentKey` (토스 결제 키), `paymentMethod` (카드/계좌이체 등), `paidAt` (결제 시각)
- **매출 집계**: Analytics에서 CONFIRMED/SHIPPING/DELIVERED 상태만 매출로 집계 (PENDING 제외)
- env: `TOSS_SECRET_KEY` (backend), `NEXT_PUBLIC_TOSS_CLIENT_KEY` (frontend)

## 문의하기 (Contact)

- **백엔드**: `POST /contact` (공개, rate limit 분당 5회) → DB 저장 + 디스코드 알림
- **백엔드**: `GET /contact` (AdminGuard) → 문의 목록 조회
- **프론트엔드**: `/contact` 페이지 (이름, 이메일, 전화번호?, 메시지)
- **프론트엔드**: `/admin/contacts` 페이지 (Admin 문의 관리 목록)
- 헤더 네비게이션에 "문의하기" 링크 포함
- Admin 사이드바에 "문의 관리" 링크 포함

## 다음 단계 (추후 고도화)
- Mac Mini 홈서버 배포 (Caddy 리버스 프록시 + SSL)