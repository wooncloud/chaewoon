"use client";

import { useState, useEffect, useCallback } from "react";
import { useIsMounted } from "@/lib/hooks";
import { formatPrice } from "@/lib/utils";
import { OrderStatus } from "@/types";
import {
  ORDER_STATUS_LABELS as STATUS_LABELS,
  ORDER_STATUS_COLORS as STATUS_COLORS,
  ORDER_STATUS_OPTIONS as STATUS_OPTIONS,
} from "@/lib/constants";
import {
  fetchOrders,
  updateOrderStatus,
  ApiOrder,
} from "@/lib/api";

export default function AdminOrdersPage() {
  const mounted = useIsMounted();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(() => {
    const status = statusFilter === "all" ? undefined : statusFilter;
    fetchOrders(status)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // We need all orders for count display, so also load them
  const [allOrders, setAllOrders] = useState<ApiOrder[]>([]);
  useEffect(() => {
    fetchOrders().then(setAllOrders).catch(() => setAllOrders([]));
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    loadOrders();
    // also refresh counts
    fetchOrders().then(setAllOrders).catch(() => {});
  };

  if (!mounted || loading) {
    return <div className="pearl-text py-20 text-center">로딩 중...</div>;
  }

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
          전체 ({allOrders.length})
        </button>
        {STATUS_OPTIONS.map((status) => {
          const count = allOrders.filter((o) => o.status === status).length;
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
        {orders.map((order) => (
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
                    {order.id.slice(0, 8)}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[order.status as OrderStatus]}`}
                  >
                    {STATUS_LABELS[order.status as OrderStatus]}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="text-foreground">
                    {order.shippingName}
                  </span>
                  <span className="text-muted">
                    {new Date(order.createdAt).toLocaleDateString("ko-KR")}
                  </span>
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
                          key={item.id}
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
                        {order.shippingName}
                      </p>
                      <p className="text-muted">
                        {order.shippingPhone}
                      </p>
                      <p className="text-muted">
                        ({order.shippingZipCode}){" "}
                        {order.shippingAddress}
                        {order.shippingDetail &&
                          ` ${order.shippingDetail}`}
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
                              handleStatusChange(order.id, status)
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

        {orders.length === 0 && (
          <div className="py-12 text-center text-muted">
            해당 상태의 주문이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
