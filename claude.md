# 채운(彩雲) Commerce Platform

## 프로젝트 개요
자개 공예 브랜드 '채운(彩雲)'의 프리미엄 커머스 플랫폼.
다크 모드 기반 디자인, 자개 광택 그라데이션 포인트, 모바일 우선 레이아웃.

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4, Custom CSS (pearl gradient)
- **UI Components**: 자체 구현 (Button, Badge, Input - CVA 기반)
- **Animation**: Framer Motion
- **State Management**: Zustand (persist middleware)
- **Icons**: Lucide React
- **Language**: TypeScript (strict)

## 프로젝트 구조
```
src/
├── app/
│   ├── page.tsx              # 메인 (Hero + 추천 상품)
│   ├── layout.tsx            # 루트 레이아웃 (ClientLayout 래퍼)
│   ├── globals.css           # 글로벌 스타일 (다크 테마, pearl gradient)
│   ├── products/
│   │   ├── page.tsx          # 상품 목록 (카테고리 필터, 반응형 그리드)
│   │   └── [id]/page.tsx     # 상품 상세
│   ├── cart/page.tsx         # 장바구니
│   ├── checkout/page.tsx     # 주문/결제
│   └── admin/                # Admin Dashboard (Phase 2)
│       ├── layout.tsx        # Admin 전용 레이아웃 (사이드바)
│       ├── page.tsx          # 대시보드 홈 (통계, 재고 현황)
│       ├── products/
│       │   ├── page.tsx      # 상품 관리 목록 (검색, 필터, 상태 토글)
│       │   ├── new/page.tsx  # 상품 등록
│       │   └── edit/page.tsx # 상품 수정
│       └── coupons/page.tsx  # 쿠폰 관리 (CRUD, 활성/비활성)
├── components/
│   ├── ui/                   # 공통 UI (Button, Badge, Input)
│   ├── layout/               # Header, Footer, ClientLayout
│   ├── product/              # ProductCard
│   └── admin/                # Sidebar, ProductForm
├── lib/utils.ts              # 유틸 (cn, formatPrice)
├── store/
│   ├── cart.ts               # Zustand 장바구니 스토어
│   └── admin.ts              # Zustand Admin 스토어 (상품/쿠폰 CRUD)
├── types/index.ts            # TypeScript 타입 정의
└── data/
    ├── products.ts           # Mock 상품 데이터 (8개)
    └── coupons.ts            # 쿠폰 데이터 + 검증/할인 계산 로직
```

## 완료 상태

### Phase 1: Customer Site (MVP) ✅
1. **메인 페이지**: Hero 섹션(자개 그라데이션), 추천 상품, 브랜드 스토리
2. **상품 목록**: 카테고리 필터링, 모바일 1컬럼 / PC 다중 컬럼 반응형 그리드
3. **상품 상세**: 이미지, 상세 설명, 수량 선택, 장바구니 담기
4. **장바구니**: 상품 추가/수량 변경/삭제, 쿠폰 코드 적용, 주문 요약
5. **쿠폰 시스템**: 정률/정액 할인, 최소 주문 금액, 최대 할인 한도, 유효 기간 검증
6. **주문/결제**: 배송 정보 입력, 결제 요약, 주문 완료 화면
7. **장바구니 상태 유지**: Zustand persist (localStorage)

### Phase 2: Admin Dashboard ✅
1. **Admin 레이아웃**: 전용 사이드바(모바일 반응형), 고객 사이트 Header/Footer 분리 (ClientLayout)
2. **대시보드 홈**: 상품 수, 게시/비공개 수, 활성 쿠폰 수 통계 카드 + 최근 상품/재고 현황
3. **상품 관리**: 검색(상품명/태그), 카테고리 필터, 게시 상태 필터, 테이블 뷰
4. **상품 CRUD**: 등록/수정 공통 폼(ProductForm), 삭제(확인 단계 포함)
5. **게시 관리**: 게시/비공개 토글, 추천 상품 토글 (목록에서 즉시 전환)
6. **쿠폰 관리**: CRUD, 활성/비활성 토글, 인라인 등록/수정 폼
7. **Product.published 필드**: 고객 사이트에서 published=true인 상품만 노출

### 디자인 컨셉
- 다크 모드 기반 (#0a0a0f 배경)
- 자개 광택 그라데이션: rose → purple → cyan
- `.pearl-text`, `.pearl-gradient` CSS 클래스로 통일

### Mock 데이터
- 상품 8개 (액세서리, 생활소품, 문구, 예술작품)
- 쿠폰 3개 (WELCOME10, CHAEWOON5000, PREMIUM20)

## 다음 단계
- **Phase 3**: Analytics & Stats (매출 데이터 시각화)
- **추후 고도화**: NextAuth.js 인증 연동, 비회원 구매, 실제 결제 연동(PG사), 실제 이미지 적용, DB 연동

## 기술적 참고 사항
- Google Fonts 접근 불가 환경이므로 system-ui 폰트 사용
- shadcn/ui 레지스트리 접근 불가로 CVA 기반 자체 UI 컴포넌트 구현
- `components.json`은 shadcn이 생성했으나 실제 사용하지 않음
- Admin 영역과 고객 사이트는 ClientLayout을 통해 Header/Footer 조건부 렌더링
- Admin 스토어(admin.ts)는 localStorage로 persist하여 상품/쿠폰 CRUD 상태 유지
