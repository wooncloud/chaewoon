# 채운(彩雲) Commerce Platform

## 프로젝트 개요
자개 공예 브랜드 '채운(彩雲)'의 프리미엄 커머스 플랫폼.
세상에 단 하나뿐인 자개 공예 작품을 판매하는 1:1 한정 상품 모델.
다크 모드 기반 디자인, 자개 광택 그라데이션 포인트, 모바일 우선 레이아웃.

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4, Custom CSS (pearl gradient)
- **UI Components**: 자체 구현 (Button, Badge, Input - CVA 기반)
- **Animation**: Framer Motion
- **State Management**: Zustand (persist middleware)
- **Charts**: SVG 기반 자체 구현 (BarChart, DonutChart, MiniChart)
- **Icons**: Lucide React
- **Language**: TypeScript (strict)

## 핵심 비즈니스 규칙
- **단일 상품 카테고리**: 자개 공예 작품 (카테고리 분류 없음)
- **1:1 한정 상품**: 각 작품은 세상에 하나뿐이며, 한 번 팔리면 즉시 품절 (`sold: boolean`)
- **재고 관리 없음**: 수량(stock) 개념 대신 판매 여부(sold)만 관리
- **장바구니 없음**: 유일품 특성상 장바구니 무의미 → 위시리스트로 대체
- **바로 구매 방식**: 상품 상세 → "바로 구매" → 결제 페이지 (직접 구매 플로우)
- **브랜딩**: "자개 공예 작품"으로 통칭 (특정 상품 유형에 제한하지 않음, 향후 확장 가능)

## 프로젝트 구조
```
src/
├── app/
│   ├── page.tsx              # 메인 (Hero + 추천 작품)
│   ├── layout.tsx            # 루트 레이아웃 (ClientLayout 래퍼)
│   ├── globals.css           # 글로벌 스타일 (다크 테마, pearl gradient)
│   ├── products/
│   │   ├── page.tsx          # 작품 목록 (반응형 그리드, 카테고리 없음)
│   │   └── [id]/page.tsx     # 작품 상세 (바로 구매, 위시리스트)
│   ├── wishlist/page.tsx     # 위시리스트 (찜 목록, 품절/삭제 상태 반영)
│   ├── checkout/page.tsx     # 주문/결제 (?product=<id> 쿼리, 쿠폰 적용)
│   └── admin/
│       ├── layout.tsx        # Admin 전용 레이아웃 (사이드바)
│       ├── page.tsx          # 대시보드 홈 (매출, 주문, 판매 현황)
│       ├── products/         # 작품 CRUD (등록/수정/삭제)
│       ├── coupons/page.tsx  # 쿠폰 CRUD
│       ├── orders/page.tsx   # 주문 관리 (상태 변경, 상세 조회)
│       └── analytics/page.tsx # 매출 통계 (KPI, 차트)
├── components/
│   ├── ui/                   # 공통 UI (Button, Badge, Input)
│   ├── layout/               # Header, Footer, ClientLayout
│   ├── product/              # ProductCard (위시리스트 하트, SOLD 오버레이)
│   └── admin/
│       ├── sidebar.tsx       # Admin 사이드바 네비게이션
│       ├── product-form.tsx  # 작품 등록/수정 폼 (카테고리/재고 없음)
│       └── charts/           # BarChart, DonutChart, MiniChart
├── lib/
│   ├── utils.ts              # 유틸 (cn, formatPrice)
│   ├── hooks.ts              # 커스텀 훅 (useIsMounted)
│   └── constants.ts          # 주문 상태 상수 (라벨, 색상, HEX)
├── store/
│   ├── wishlist.ts           # Zustand 위시리스트 스토어
│   └── admin.ts              # Zustand Admin 스토어 (작품/쿠폰/주문 CRUD, markAsSold)
├── types/index.ts            # TypeScript 타입 정의 (Product.thumbnail/bodyImages, OrderItem)
└── data/
    ├── products.ts           # Mock 작품 (8개, 자개 공예)
    ├── coupons.ts            # Mock 쿠폰 (3개) + 검증/할인 계산 로직
    └── orders.ts             # Mock 주문 (8건)
```

## 완료 상태

### Phase 1: Customer Site (MVP) ✅
1. **메인 페이지**: Hero 섹션(자개 그라데이션), 추천 작품, 브랜드 스토리
2. **작품 목록**: 반응형 그리드 (모바일 1컬럼 / PC 다중 컬럼), 카테고리 없음
3. **작품 상세**: 썸네일 + 본문 이미지 갤러리(스크롤), 바로 구매 버튼, 위시리스트 토글, 품절 표시
4. **위시리스트**: 찜한 작품 목록, 실시간 품절/삭제 상태 반영, 바로 구매 링크
5. **쿠폰 시스템**: 정률/정액 할인, 최소 주문 금액, 최대 할인 한도, 유효 기간 검증
6. **주문/결제**: 쿼리 파라미터 기반 직접 구매, 쿠폰 적용, 배송 정보 입력, 품절 재검증
7. **위시리스트 상태 유지**: Zustand persist (localStorage)

### Phase 2: Admin Dashboard ✅
1. **Admin 레이아웃**: 전용 사이드바(모바일 반응형), 고객 사이트 Header/Footer 분리 (ClientLayout)
2. **대시보드 홈**: 매출/주문/작품/쿠폰 통계 카드 + 판매 현황 (판매 가능/판매 완료)
3. **작품 관리**: 검색(작품명/태그), 판매 상태 필터, 게시 상태 필터, 테이블 뷰
4. **작품 CRUD**: 등록/수정 공통 폼(ProductForm, 썸네일/본문 이미지 URL 관리), 삭제(확인 단계 포함)
5. **게시 관리**: 게시/비공개 토글, 추천 작품 토글 (목록에서 즉시 전환)
6. **쿠폰 관리**: CRUD, 활성/비활성 토글, 인라인 등록/수정 폼

### Phase 3: Analytics & Stats ✅
1. **주문 데이터 모델**: Admin 스토어에 orders 통합, 결제 완료 시 자동 주문 저장 + markAsSold
2. **매출 통계 대시보드**: KPI 카드 4종 (총 매출, 총 주문 수, 평균 주문 금액, 총 판매 수량)
3. **차트 시각화**: 월별 매출 바 차트, 주문 상태 도넛 차트, 인기 작품 TOP 5
4. **미니 트렌드 차트**: KPI 카드 내 SVG 라인 차트
5. **주문 관리 페이지**: 주문 목록(상태 필터링), 상세 조회(아코디언), 주문 상태 변경

### 디자인 컨셉
- 다크 모드 기반 (#0a0a0f 배경)
- 자개 광택 그라데이션: rose → purple → cyan
- `.pearl-text`, `.pearl-gradient` CSS 클래스로 통일

### Mock 데이터
- 작품 8개 (자개 공예 작품, 2개 판매 완료)
- 쿠폰 3개 (WELCOME10, CHAEWOON5000, PREMIUM20)
- 주문 8건 (다양한 상태: pending, confirmed, shipping, delivered, cancelled)

## 자체 검토 절차 (커밋 전 필수)
구현 완료 시, 커밋 전에 반드시 아래 검토를 수행한다.

### 1. 빌드 검증
- `npm run build` 실행하여 TypeScript 오류, 컴파일 에러 없는지 확인

### 2. 데이터 일관성 검토
- 타입(interface)에 필드 추가/변경 시, 해당 타입을 사용하는 모든 파일에 반영되었는지 확인
- 데이터 소스가 단일인지 확인 (Single Source of Truth). 동일 데이터를 여러 곳에서 별도 관리하지 않도록 함
- 고객 사이트와 Admin이 같은 스토어를 참조하는지 확인

### 3. 보안/접근 제어
- 비공개(published=false) 상품이 고객 사이트 어디에서도 노출되지 않는지 확인 (목록, 상세, 추천 등)
- URL 직접 접근으로 비공개 리소스에 접근 불가한지 확인

### 4. 라우트/네비게이션 검증
- 모든 Link href가 실제 존재하는 경로를 가리키는지 확인
- 404 처리가 적절한지 확인

### 5. 코드 품질
- 코드 작성 전후로 로직을 재검토하여 오류를 방지
- 미사용 import, 미사용 변수, 미사용 함수 제거
- 반복 로직이 있으면 공통 컴포넌트/유틸/훅으로 분리 (DRY)
- hydration 이슈: `useIsMounted` 훅으로 Zustand persist 클라이언트 컴포넌트 처리
- 반복되는 UI 패턴이나 로직은 반드시 모듈화/컴포넌트화하여 유지보수성을 높이기

### 6. 모바일 반응형
- 작품 그리드: 모바일 1컬럼 / PC 다중 컬럼 적용 확인
- 테이블/폼이 모바일에서 오버플로우 없이 표시되는지 확인

### 7. 상태 관리 무결성
- ID 생성 시 기존 항목과 충돌하지 않는지 확인
- CRUD 작업 후 관련 UI가 모두 정상 반영되는지 확인
- 결제 시 품절 여부 재검증 (race condition 방지)

> 이 절차를 통과한 후에만 커밋하고, claude.md를 업데이트한다.

## 다음 단계 (추후 고도화)
- NextAuth.js 인증 연동 (Admin 접근 제어 포함)
- 비회원 구매 프로세스
- 실제 결제 연동 (PG사)
- 실제 상품 이미지 적용
- DB 연동 (PostgreSQL + Prisma)
- 주문 알림 시스템

## 기술적 참고 사항
- Google Fonts 접근 불가 환경이므로 system-ui 폰트 사용
- shadcn/ui 레지스트리 접근 불가로 CVA 기반 자체 UI 컴포넌트 구현
- `components.json`은 shadcn이 생성했으나 실제 사용하지 않음
- Admin 영역과 고객 사이트는 ClientLayout을 통해 Header/Footer 조건부 렌더링
- **Single Source of Truth**: Admin 스토어(useAdminStore)가 작품/쿠폰/주문의 유일한 데이터 소스
- Admin 스토어 ID 생성은 기존 항목의 최대 ID를 기반으로 하여 충돌 방지
- 작품 상세 페이지에서 published 체크하여 비공개 작품 직접 접근 차단
- 차트 컴포넌트는 외부 라이브러리 없이 SVG로 자체 구현 (BarChart, DonutChart, MiniChart)
- `useIsMounted` 훅으로 hydration 안전 패턴 중앙화 (src/lib/hooks.ts)
- 주문 상태 상수(라벨/색상/HEX) 중앙화 (src/lib/constants.ts)
- 결제 시 `getProductById`로 품절 재검증 후 `markAsSold` 호출 (race condition 방지)
- 위시리스트에서 관리자 삭제된 작품은 "삭제된 작품"으로 표시 (graceful degradation)
- **이미지 2종 타입**: `thumbnail` (카드/목록용) + `bodyImages` (상세 페이지 스크롤 갤러리)
- 이미지 없는 상품은 "彩" 플레이스홀더로 폴백 (기능 회귀 없음)
- Admin 폼에서 이미지 URL 입력, 순서 변경(↑↓), 추가/삭제 가능
