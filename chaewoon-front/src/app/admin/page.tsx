"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Tag,
  Eye,
  EyeOff,
  DollarSign,
  ShoppingCart,
  CheckCircle,
} from "lucide-react";
import {
  fetchAnalyticsSummary,
  fetchProducts,
  fetchOrders,
  showApiError,
} from "@/lib/api";
import { Product, Order, AnalyticsSummary } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useIsMounted } from "@/lib/hooks";

export default function AdminDashboardPage() {
  const mounted = useIsMounted();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchAnalyticsSummary(),
      fetchProducts(),
      fetchOrders(),
    ])
      .then(([s, p, o]) => {
        setSummary(s);
        setProducts(p);
        setOrders(o);
      })
      .catch(showApiError)
      .finally(() => setLoading(false));
  }, []);

  if (!mounted || loading) {
    return <div className="pearl-text py-20 text-center">로딩 중...</div>;
  }

  const publishedCount = products.filter((p) => p.published).length;
  const draftCount = products.filter((p) => !p.published).length;
  const availableCount = products.filter((p) => !p.sold && p.published).length;
  const soldCount = products.filter((p) => p.sold).length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

  const stats = [
    {
      label: "총 매출",
      value: formatPrice(summary?.totalRevenue ?? 0),
      icon: DollarSign,
      href: "/admin/analytics",
    },
    {
      label: "총 주문",
      value: `${summary?.totalOrders ?? 0}건`,
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      label: "전체 작품",
      value: String(summary?.totalProducts ?? 0),
      icon: Package,
      href: "/admin/products",
    },
    {
      label: "활성 쿠폰",
      value: String(summary?.totalCoupons ?? 0),
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
            <span className="text-2xl font-bold">{stat.value}</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* 빠른 현황 */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-bold">현황 요약</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-3.5 w-3.5 text-green-400" />
                <span className="text-muted">게시 중</span>
              </div>
              <span className="text-foreground">{publishedCount}개</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <EyeOff className="h-3.5 w-3.5 text-neutral-500" />
                <span className="text-muted">비공개</span>
              </div>
              <span className="text-foreground">{draftCount}개</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-muted">판매 가능</span>
              </div>
              <span className="text-foreground">{availableCount}개</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-muted">판매 완료</span>
              </div>
              <span className="text-foreground">{soldCount}개</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-3.5 w-3.5 text-yellow-400" />
                <span className="text-muted">처리 대기 주문</span>
              </div>
              <span className={pendingOrders > 0 ? "font-bold text-yellow-400" : "text-foreground"}>
                {pendingOrders}건
              </span>
            </div>
          </div>
        </div>

        {/* 최근 주문 */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">최근 주문</h2>
            <Link
              href="/admin/orders"
              className="text-xs text-muted hover:text-foreground"
            >
              전체 보기 &rarr;
            </Link>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <span className="text-foreground">
                    {o.shippingName}
                  </span>
                  <span className="ml-2 text-xs text-muted">
                    {new Date(o.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <span className="text-muted">{formatPrice(o.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 판매된 작품 */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-bold">판매 완료 작품</h2>
          <div className="space-y-3">
            {products
              .filter((p) => p.sold)
              .slice(0, 5)
              .map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-foreground">{p.name}</span>
                  <span className="text-purple-400">
                    {formatPrice(p.price)}
                  </span>
                </div>
              ))}
            {products.filter((p) => p.sold).length === 0 && (
              <p className="text-sm text-muted">아직 판매된 작품이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
