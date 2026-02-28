/**
 * 백엔드 → 프론트엔드 공통 에러 응답 엔벨로프.
 * 백엔드의 글로벌 예외 필터가 이 형태로 응답을 생성하고,
 * 프론트엔드의 API 클라이언트가 이 형태로 파싱한다.
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  errors?: string[];
  timestamp: string;
}
