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
  product: Product;
  quantity: number;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
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
  couponCode?: string;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  createdAt: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled";

export interface ShippingAddress {
  name: string;
  phone: string;
  zipCode: string;
  address: string;
  addressDetail: string;
}
