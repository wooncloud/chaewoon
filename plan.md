# 이미지 시스템 구현 계획

## 현재 상태
- `Product.images: string[]` → 사용되지 않음, 모든 상품 빈 배열
- 상품 카드, 상세 페이지 모두 "彩" 플레이스홀더 표시
- Admin 폼에 이미지 관리 UI 없음

## 변경 개요

### 1. 타입 변경 (`src/types/index.ts`)
```typescript
// Before
images: string[];

// After
thumbnail: string;      // 썸네일 이미지 URL (목록, 카드에 사용)
bodyImages: string[];    // 본문 이미지 URL 목록 (상세 페이지 스크롤 갤러리)
```

### 2. Mock 데이터 업데이트 (`src/data/products.ts`)
- 각 상품에 `thumbnail`, `bodyImages` 필드 추가
- 실제 이미지 파일이 없으므로 빈 문자열 / 빈 배열 유지 (플레이스홀더 폴백 처리)

### 3. Admin 폼 이미지 관리 (`src/components/admin/product-form.tsx`)
- **"이미지 관리" 섹션** 추가 (기본 정보 섹션 아래)
- 썸네일: URL 입력 필드 1개 + 미리보기
- 본문 이미지: URL 입력 필드 동적 추가/삭제 + 미리보기 + 순서 표시
  - "이미지 추가" 버튼으로 URL 필드 추가
  - 각 필드에 삭제(X) 버튼
  - 드래그 순서 변경은 과도 → 위/아래 화살표 버튼으로 순서 변경

### 4. Admin 스토어 업데이트 (`src/store/admin.ts`)
- `addProduct`에서 `thumbnail`, `bodyImages` 필드 처리
- `updateProduct`에서 이미지 업데이트 반영 (기존 `Partial<Product>` 방식으로 자동 지원됨)
- 기존 `images` 필드 참조 제거

### 5. 상품 카드 썸네일 표시 (`src/components/product/product-card.tsx`)
- `product.thumbnail`이 있으면 `<img>` 태그로 표시
- 없으면 기존 "彩" 플레이스홀더 유지 (폴백)

### 6. 상품 상세 페이지 갤러리 (`src/app/products/[id]/page.tsx`)
- **상단**: 기존 2컬럼 레이아웃 유지 (썸네일 + 상품 정보)
  - 썸네일 영역에 `product.thumbnail` 이미지 표시
- **하단**: 본문 이미지 갤러리 섹션 추가 (상품 정보 아래)
  - `product.bodyImages`를 세로로 나열 (스크롤하며 감상)
  - 각 이미지는 넓은 너비, 적절한 간격
  - 이미지가 없으면 갤러리 섹션 자체를 숨김
  - 부드러운 Framer Motion 스크롤 애니메이션

### 7. 연관 파일 업데이트
- `src/data/orders.ts`: 주문 내 product 객체에 `thumbnail`/`bodyImages` 반영
- `src/app/page.tsx` (메인): 추천 상품 카드에 썸네일 반영 (ProductCard 사용 시 자동)
- `src/app/wishlist/page.tsx`: 위시리스트 아이템에 썸네일 표시
- `src/store/wishlist.ts`: Product 타입 변경에 따라 자동 반영

### 8. 빌드 검증 + 커밋
- `npm run build` 통과 확인
- 커밋 & 푸시

## 수정 파일 목록
| 파일 | 작업 |
|------|------|
| `src/types/index.ts` | `images` → `thumbnail` + `bodyImages` |
| `src/data/products.ts` | Mock 데이터 필드 교체 |
| `src/data/orders.ts` | 주문 내 product 필드 교체 |
| `src/store/admin.ts` | addProduct 기본값 변경 |
| `src/components/admin/product-form.tsx` | 이미지 관리 섹션 추가 |
| `src/components/product/product-card.tsx` | 썸네일 이미지 표시 |
| `src/app/products/[id]/page.tsx` | 썸네일 + 본문 갤러리 |
| `src/app/wishlist/page.tsx` | 썸네일 반영 확인 |

## 주의사항
- 실제 파일 업로드 기능은 없음 (URL 입력 방식) → 추후 고도화에서 S3/업로드 연동
- 이미지가 없는 상품은 기존 플레이스홀더로 폴백 (기능 회귀 없음)
- 위시리스트 localStorage에 저장된 기존 Product 구조와의 호환성 고려 (thumbnail 없는 경우 폴백)
