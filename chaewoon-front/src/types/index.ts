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
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  couponDiscount: number;
  total: number;
  couponCode: string | null;
  status: OrderStatus;
  shippingName: string;
  shippingPhone: string;
  shippingZipCode: string;
  shippingAddress: string;
  shippingDetail: string;
  createdAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";
