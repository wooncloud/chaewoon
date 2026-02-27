import { OrderStatus } from "@/types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "대기",
  confirmed: "확인",
  shipping: "배송중",
  delivered: "배송완료",
  cancelled: "취소",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  shipping: "bg-purple-500/10 text-purple-400",
  delivered: "bg-green-500/10 text-green-400",
  cancelled: "bg-red-500/10 text-red-400",
};

export const ORDER_STATUS_HEX: Record<OrderStatus, string> = {
  pending: "#facc15",
  confirmed: "#60a5fa",
  shipping: "#a78bfa",
  delivered: "#4ade80",
  cancelled: "#f87171",
};

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipping",
  "delivered",
  "cancelled",
];
