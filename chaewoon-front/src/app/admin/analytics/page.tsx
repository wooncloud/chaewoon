"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Package,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ORDER_STATUS_HEX } from "@/lib/constants";
import { OrderStatus } from "@/types";
import { useIsMounted } from "@/lib/hooks";
import { BarChart } from "@/components/admin/charts/bar-chart";
import { MiniChart } from "@/components/admin/charts/mini-chart";
import { DonutChart } from "@/components/admin/charts/donut-chart";
import {
  fetchAnalyticsSummary,
  fetchMonthlyRevenue,
  fetchOrderStatusDistribution,
  fetchTopProducts,
  AnalyticsSummary,
  MonthlyRevenue,
  OrderStatusDist,
  TopProduct,
} from "@/lib/api";

export default function AnalyticsPage() {
  const mounted = useIsMounted();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusDist[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchAnalyticsSummary(),
      fetchMonthlyRevenue(),
      fetchOrderStatusDistribution(),
      fetchTopProducts(5),
    ])
      .then(([s, mr, os, tp]) => {
        setSummary(s);
        setMonthlyRevenue(mr);
        setOrderStatusData(os);
        setTopProducts(tp);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!mounted || loading || !summary) {
    return <div className="pearl-text py-20 text-center">로딩 중...</div>;
  }

  const monthlyValues = monthlyRevenue.map((m) => m.revenue);

  const kpis = [
    {
      label: "총 매출",
      value: formatPrice(summary.totalRevenue),
      icon: DollarSign,
      trend: monthlyValues,
      color: "#4ade80",
    },
    {
      label: "총 주문 수",
      value: `${summary.totalOrders}건`,
      icon: ShoppingCart,
      trend: [] as number[],
      color: "#60a5fa",
    },
    {
      label: "평균 주문 금액",
      value: formatPrice(summary.avgOrderAmount),
      icon: TrendingUp,
      trend: [] as number[],
      color: "#c4b5fd",
    },
    {
      label: "판매된 작품",
      value: `${summary.totalSold}개`,
      icon: Package,
      trend: [] as number[],
      color: "#f9a8d4",
    },
  ];

  const barChartData = monthlyRevenue.map((m) => ({
    key: m.key,
    label: m.label,
    value: m.revenue,
  }));

  const donutData = orderStatusData.map((d) => ({
    label: ORDER_STATUS_LABELS[d.status as OrderStatus] || d.status,
    value: d.count,
    color: ORDER_STATUS_HEX[d.status as OrderStatus] || "#888",
  }));

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
            data={barChartData}
            formatValue={(v) => formatPrice(v)}
          />
        </div>

        {/* 주문 상태 분포 */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 font-bold">주문 상태 분포</h2>
          <DonutChart data={donutData} />
        </div>

        {/* 인기 작품 TOP 5 */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <h2 className="mb-4 font-bold">인기 작품 TOP 5</h2>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div
                key={p.product.id}
                className="flex items-center gap-3 text-sm"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-muted">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-foreground">{p.product.name}</div>
                  <div className="text-xs text-muted">{p.totalQuantity}개 판매</div>
                </div>
                <span className="shrink-0 font-medium">
                  {formatPrice(p.product.price * p.totalQuantity)}
                </span>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="text-sm text-muted">데이터가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
