import { NextRequest, NextResponse } from "next/server";

// middleware는 서버사이드 실행 → Docker 내부에서는 컨테이너명으로 접근해야 함
const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3849";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin 경로 접근 시 인증 확인
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 백엔드에 토큰 유효성 확인
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Cookie: `admin_token=${token}` },
      });

      if (!res.ok) {
        const response = NextResponse.redirect(
          new URL("/login", request.url),
        );
        response.cookies.delete("admin_token");
        return response;
      }
    } catch {
      // 백엔드 연결 실패 시에도 접근 차단
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  // /login 경로에서 이미 인증된 경우 /admin으로 리다이렉트
  if (pathname === "/login") {
    const token = request.cookies.get("admin_token")?.value;

    if (token) {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Cookie: `admin_token=${token}` },
        });

        if (res.ok) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      } catch {
        // 검증 실패 시 로그인 페이지 유지
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
