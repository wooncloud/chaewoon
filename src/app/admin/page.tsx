"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Tag, Eye, EyeOff } from "lucide-react";
import { useAdminStore } from "@/store/admin";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { products, coupons } = useAdminStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="pearl-text py-20 text-center">로딩 중...</div>;
  }

  const publishedCount = products.filter((p) => p.published).length;
  const draftCount = products.filter((p) => !p.published).length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const activeCoupons = coupons.filter((c) => c.isActive).length;

  const stats = [
    {
      label: "전체 상품",
      value: products.length,
      icon: Package,
      href: "/admin/products",
    },
    {
      label: "게시 중",
      value: publishedCount,
      icon: Eye,
      href: "/admin/products",
    },
    {
      label: "비공개",
      value: draftCount,
      icon: EyeOff,
      href: "/admin/products",
    },
    {
      label: "활성 쿠폰",
      value: activeCoupons,
      icon: Tag,
      href: "/admin/coupons",
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">대시보드</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-white/20"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted">{stat.label}</span>
              <stat.icon className="h-4 w-4 text-muted" />
            </div>
            <span className="text-3xl font-bold">{stat.value}</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* 최근 등록 상품 */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">최근 등록 상품</h2>
            <Link
              href="/admin/products"
              className="text-xs text-muted hover:text-foreground"
            >
              전체 보기 &rarr;
            </Link>
          </div>
          <div className="space-y-3">
            {products.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${p.published ? "bg-green-400" : "bg-neutral-500"}`}
                  />
                  <span className="text-foreground">{p.name}</span>
                </div>
                <span className="text-muted">{formatPrice(p.price)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 재고 현황 */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-bold">재고 현황</h2>
          <div className="mb-4 text-sm text-muted">
            총 재고: <span className="text-foreground">{totalStock}개</span>
          </div>
          <div className="space-y-3">
            {products
              .filter((p) => p.stock <= 5)
              .sort((a, b) => a.stock - b.stock)
              .slice(0, 5)
              .map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-foreground">{p.name}</span>
                  <span
                    className={
                      p.stock === 0
                        ? "font-bold text-red-400"
                        : "text-yellow-400"
                    }
                  >
                    {p.stock === 0 ? "품절" : `${p.stock}개`}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
