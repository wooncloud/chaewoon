import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="pearl-text mb-3 text-lg font-bold">채운 彩雲</h3>
            <p className="text-sm leading-relaxed text-muted">
              구름 사이로 비치는 영롱한 자개 빛깔.
              <br />
              전통 공예의 아름다움을 현대에 전합니다.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">쇼핑</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  전체 컬렉션
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=accessory"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  액세서리
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=homeware"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  생활소품
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              고객 지원
            </h4>
            <ul className="space-y-2">
              <li className="text-sm text-muted">문의: hello@chaewoon.kr</li>
              <li className="text-sm text-muted">
                운영시간: 평일 10:00 - 18:00
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-center text-xs text-muted">
            &copy; {new Date().getFullYear()} 채운(彩雲). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
