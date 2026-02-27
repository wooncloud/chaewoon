import { OrderStatus } from "@/types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "대기",
  CONFIRMED: "확인",
  SHIPPING: "배송중",
  DELIVERED: "배송완료",
  CANCELLED: "취소",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400",
  CONFIRMED: "bg-blue-500/10 text-blue-400",
  SHIPPING: "bg-purple-500/10 text-purple-400",
  DELIVERED: "bg-green-500/10 text-green-400",
  CANCELLED: "bg-red-500/10 text-red-400",
};

export const ORDER_STATUS_HEX: Record<OrderStatus, string> = {
  PENDING: "#facc15",
  CONFIRMED: "#60a5fa",
  SHIPPING: "#a78bfa",
  DELIVERED: "#4ade80",
  CANCELLED: "#f87171",
};

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "DELIVERED",
  "CANCELLED",
];
