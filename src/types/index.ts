export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: ProductCategory;
  tags: string[];
  stock: number;
  featured: boolean;
  createdAt: string;
}

export type ProductCategory =
  | "accessory"
  | "homeware"
  | "stationery"
  | "art"
  | "custom";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  accessory: "액세서리",
  homeware: "생활소품",
  stationery: "문구",
  art: "예술작품",
  custom: "맞춤제작",
};

export interface CartItem {
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
  items: CartItem[];
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
