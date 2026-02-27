"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "@/store/admin";
import { formatPrice } from "@/lib/utils";
import { OrderStatus } from "@/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "대기",
  confirmed: "확인",
  shipping: "배송중",
  delivered: "배송완료",
  cancelled: "취소",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  shipping: "bg-purple-500/10 text-purple-400",
  delivered: "bg-green-500/10 text-green-400",
  cancelled: "bg-red-500/10 text-red-400",
};

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipping",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const { orders, updateOrderStatus } = useAdminStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="pearl-text py-20 text-center">로딩 중...</div>;
  }

  const filtered =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">주문 관리</h1>

      {/* Status Filter */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
            statusFilter === "all"
              ? "bg-white/15 text-foreground"
              : "bg-white/5 text-muted hover:bg-white/10"
          }`}
        >
          전체 ({orders.length})
        </button>
        {STATUS_OPTIONS.map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
                statusFilter === status
                  ? "bg-white/15 text-foreground"
                  : "bg-white/5 text-muted hover:bg-white/10"
              }`}
            >
              {STATUS_LABELS[status]} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filtered.map((order) => (
          <div
            key={order.id}
            className="rounded-xl border border-border bg-card transition-colors hover:border-white/10"
          >
            {/* Order Header */}
            <button
              onClick={() =>
                setExpandedOrder(
                  expandedOrder === order.id ? null : order.id
                )
              }
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted">
                    {order.id}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[order.status]}`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="text-foreground">
                    {order.shippingAddress.name}
                  </span>
                  <span className="text-muted">{order.createdAt}</span>
                  <span className="font-medium">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-xs text-muted">
                {expandedOrder === order.id ? "접기" : "상세"}
              </span>
            </button>

            {/* Order Detail */}
            {expandedOrder === order.id && (
              <div className="border-t border-border px-4 pb-4 pt-3">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* 주문 상품 */}
                  <div>
                    <h4 className="mb-2 text-xs font-medium text-muted">
                      주문 상품
                    </h4>
                    <div className="space-y-1.5">
                      {order.items.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-foreground">
                            {item.product.name} x {item.quantity}
                          </span>
                          <span className="text-muted">
                            {formatPrice(
                              item.product.price * item.quantity
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 space-y-1 border-t border-border pt-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted">상품 금액</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      {order.couponDiscount > 0 && (
                        <div className="flex justify-between text-green-400">
                          <span>
                            쿠폰 할인
                            {order.couponCode && ` (${order.couponCode})`}
                          </span>
                          <span>
                            -{formatPrice(order.couponDiscount)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium">
                        <span>결제 금액</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 배송 정보 + 상태 변경 */}
                  <div>
                    <h4 className="mb-2 text-xs font-medium text-muted">
                      배송 정보
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-foreground">
                        {order.shippingAddress.name}
                      </p>
                      <p className="text-muted">
                        {order.shippingAddress.phone}
                      </p>
                      <p className="text-muted">
                        ({order.shippingAddress.zipCode}){" "}
                        {order.shippingAddress.address}
                        {order.shippingAddress.addressDetail &&
                          ` ${order.shippingAddress.addressDetail}`}
                      </p>
                    </div>

                    <div className="mt-4">
                      <h4 className="mb-2 text-xs font-medium text-muted">
                        주문 상태 변경
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {STATUS_OPTIONS.map((status) => (
                          <button
                            key={status}
                            onClick={() =>
                              updateOrderStatus(order.id, status)
                            }
                            className={`rounded-full px-3 py-1 text-[11px] transition-colors ${
                              order.status === status
                                ? STATUS_COLORS[status] +
                                  " ring-1 ring-white/20"
                                : "bg-white/5 text-muted hover:bg-white/10"
                            }`}
                          >
                            {STATUS_LABELS[status]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted">
            해당 상태의 주문이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
