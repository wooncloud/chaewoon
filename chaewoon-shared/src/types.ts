// ─── Enums ───

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

export type DiscountType = "PERCENT" | "FIXED";

export const ORDER_STATUS_VALUES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "DELIVERED",
  "CANCELLED",
];

export const DISCOUNT_TYPE_VALUES: DiscountType[] = ["PERCENT", "FIXED"];

// ─── Entity Types (API 응답 기준) ───

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  thumbnail: string;
  bodyImages: string[];
  tags: string[];
  sold: boolean;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  couponDiscount: number;
  total: number;
  couponCode: string | null;
  status: OrderStatus;
  paymentKey: string | null;
  paymentMethod: string | null;
  paidAt: string | null;
  shippingName: string;
  shippingPhone: string;
  shippingZipCode: string;
  shippingAddress: string;
  shippingDetail: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Analytics Types ───

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  avgOrderAmount: number;
  totalSold: number;
  totalAvailable: number;
  totalProducts: number;
  totalCoupons: number;
}

export interface MonthlyRevenue {
  key: string;
  label: string;
  revenue: number;
}

export interface OrderStatusDist {
  status: string;
  count: number;
}

export interface TopProduct {
  product: Product;
  orderCount: number;
  totalQuantity: number;
}

export interface CouponValidation {
  valid: boolean;
  coupon: Coupon;
  discount: number;
  finalAmount: number;
}

// ─── Contact ───

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}
