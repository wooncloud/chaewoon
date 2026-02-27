"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Package,
} from "lucide-react";
import { useAdminStore } from "@/store/admin";
import { formatPrice } from "@/lib/utils";
import { CATEGORY_LABELS, ProductCategory, Order } from "@/types";
import { BarChart } from "@/components/admin/charts/bar-chart";
import { MiniChart } from "@/components/admin/charts/mini-chart";
import { DonutChart } from "@/components/admin/charts/donut-chart";

function getMonthlyRevenue(orders: Order[]) {
  const months: Record<string, number> = {};
  const delivered = orders.filter(
    (o) => o.status !== "cancelled"
  );

  delivered.forEach((o) => {
    const month = o.createdAt.slice(0, 7); // YYYY-MM
    months[month] = (months[month] || 0) + o.total;
  });

  const sorted = Object.entries(months).sort(([a], [b]) => a.localeCompare(b));
  return sorted.map(([month, value]) => ({
    label: month.replace(/^\d{4}-/, "") + "월",
    value,
  }));
}

function getCategoryRevenue(orders: Order[]) {
  const cats: Record<string, number> = {};
  const delivered = orders.filter((o) => o.status !== "cancelled");

  delivered.forEach((o) => {
    o.items.forEach((item) => {
      const cat = item.product.category;
      cats[cat] = (cats[cat] || 0) + item.product.price * item.quantity;
    });
  });

  return Object.entries(cats)
    .map(([cat, value]) => ({
      label: CATEGORY_LABELS[cat as ProductCategory] || cat,
      value,
    }))
    .sort((a, b) => b.value - a.value);
}

function getTopProducts(orders: Order[]) {
  const products: Record<string, { name: string; count: number; revenue: number }> = {};
  const delivered = orders.filter((o) => o.status !== "cancelled");

  delivered.forEach((o) => {
    o.items.forEach((item) => {
      const key = item.product.id;
      if (!products[key]) {
        products[key] = { name: item.product.name, count: 0, revenue: 0 };
      }
      products[key].count += item.quantity;
      products[key].revenue += item.product.price * item.quantity;
    });
  });

  return Object.values(products)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

function getOrderStatusData(orders: Order[]) {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "대기", color: "#facc15" },
    confirmed: { label: "확인", color: "#60a5fa" },
    shipping: { label: "배송중", color: "#a78bfa" },
    delivered: { label: "배송완료", color: "#4ade80" },
    cancelled: { label: "취소", color: "#f87171" },
  };

  const counts: Record<string, number> = {};
  orders.forEach((o) => {
    counts[o.status] = (counts[o.status] || 0) + 1;
  });

  return Object.entries(statusMap)
    .filter(([key]) => (counts[key] || 0) > 0)
    .map(([key, { label, color }]) => ({
      label,
      value: counts[key] || 0,
      color,
    }));
}

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const { orders } = useAdminStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="pearl-text py-20 text-center">로딩 중...</div>;
  }

  const activeOrders = orders.filter((o) => o.status !== "cancelled");
  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = activeOrders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const totalItemsSold = activeOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );

  const monthlyRevenue = getMonthlyRevenue(orders);
  const categoryRevenue = getCategoryRevenue(orders);
  const topProducts = getTopProducts(orders);
  const orderStatusData = getOrderStatusData(orders);
  const monthlyValues = monthlyRevenue.map((m) => m.value);

  const kpis = [
    {
      label: "총 매출",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      trend: monthlyValues,
      color: "#4ade80",
    },
    {
      label: "총 주문 수",
      value: `${totalOrders}건`,
      icon: ShoppingCart,
      trend: monthlyValues.map((_, i) =>
        orders.filter(
          (o) =>
            o.status !== "cancelled" &&
            o.createdAt.slice(0, 7) === monthlyRevenue[i]?.label.replace("월", "").padStart(2, "0")
        ).length
      ),
      color: "#60a5fa",
    },
    {
      label: "평균 주문 금액",
      value: formatPrice(avgOrderValue),
      icon: TrendingUp,
      trend: [],
      color: "#c4b5fd",
    },
    {
      label: "총 판매 수량",
      value: `${totalItemsSold}개`,
      icon: Package,
      trend: [],
      color: "#f9a8d4",
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">매출 통계</h1>

      {/* KPI Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted">{kpi.label}</span>
              <kpi.icon className="h-4 w-4 text-muted" />
            </div>
            <div className="text-2xl font-bold">{kpi.value}</div>
            {kpi.trend.length > 1 && (
              <div className="mt-3">
                <MiniChart data={kpi.trend} height={32} color={kpi.color} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 월별 매출 추이 */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-bold">월별 매출</h2>
          <BarChart
            data={monthlyRevenue}
            formatValue={(v) => formatPrice(v)}
          />
        </div>

        {/* 주문 상태 분포 */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-bold">주문 상태 분포</h2>
          <DonutChart data={orderStatusData} />
        </div>

        {/* 카테고리별 매출 */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-bold">카테고리별 매출</h2>
          <BarChart
            data={categoryRevenue}
            formatValue={(v) => formatPrice(v)}
            color="from-cyan-400/80 to-blue-400/80"
          />
        </div>

        {/* 인기 상품 TOP 5 */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-bold">인기 상품 TOP 5</h2>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div
                key={p.name}
                className="flex items-center gap-3 text-sm"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-muted">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-foreground">{p.name}</div>
                  <div className="text-xs text-muted">{p.count}개 판매</div>
                </div>
                <span className="shrink-0 font-medium">
                  {formatPrice(p.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
