const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3849";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `API error: ${res.status}`);
  }

  return res.json();
}

// ─── Products ───

export interface ApiProduct {
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

export function fetchProducts(params?: {
  search?: string;
  sold?: string;
  published?: string;
  featured?: string;
}) {
  const q = new URLSearchParams();
  if (params?.search) q.set("search", params.search);
  if (params?.sold) q.set("sold", params.sold);
  if (params?.published) q.set("published", params.published);
  if (params?.featured) q.set("featured", params.featured);
  const qs = q.toString();
  return request<ApiProduct[]>(`/products${qs ? `?${qs}` : ""}`);
}

export function fetchProduct(id: string) {
  return request<ApiProduct>(`/products/${id}`);
}

export function createProduct(data: Omit<ApiProduct, "id" | "createdAt" | "updatedAt">) {
  return request<ApiProduct>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProduct(id: string, data: Partial<ApiProduct>) {
  return request<ApiProduct>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id: string) {
  return request<ApiProduct>(`/products/${id}`, { method: "DELETE" });
}

export function markProductSold(id: string) {
  return request<ApiProduct>(`/products/${id}/sold`, { method: "PATCH" });
}

export function toggleProductPublished(id: string) {
  return request<ApiProduct>(`/products/${id}/toggle-published`, {
    method: "PATCH",
  });
}

export function toggleProductFeatured(id: string) {
  return request<ApiProduct>(`/products/${id}/toggle-featured`, {
    method: "PATCH",
  });
}

// ─── Orders ───

export interface ApiOrder {
  id: string;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    product: ApiProduct;
  }>;
  subtotal: number;
  couponDiscount: number;
  total: number;
  couponCode: string | null;
  status: string;
  shippingName: string;
  shippingPhone: string;
  shippingZipCode: string;
  shippingAddress: string;
  shippingDetail: string;
  createdAt: string;
  updatedAt: string;
}

export function fetchOrders(status?: string) {
  const qs = status ? `?status=${status}` : "";
  return request<ApiOrder[]>(`/orders${qs}`);
}

export function fetchOrder(id: string) {
  return request<ApiOrder>(`/orders/${id}`);
}

export function createOrder(data: {
  productId: string;
  subtotal: number;
  couponDiscount?: number;
  total: number;
  couponCode?: string;
  shippingName: string;
  shippingPhone: string;
  shippingZipCode: string;
  shippingAddress: string;
  shippingDetail?: string;
}) {
  return request<ApiOrder>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateOrderStatus(id: string, status: string) {
  return request<ApiOrder>(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ─── Coupons ───

export interface ApiCoupon {
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
  createdAt: string;
  updatedAt: string;
}

export interface CouponValidation {
  valid: boolean;
  coupon: ApiCoupon;
  discount: number;
  finalAmount: number;
}

export function fetchCoupons() {
  return request<ApiCoupon[]>("/coupons");
}

export function validateCoupon(code: string, amount: number) {
  return request<CouponValidation>(
    `/coupons/validate?code=${encodeURIComponent(code)}&amount=${amount}`,
  );
}

export function createCoupon(data: Omit<ApiCoupon, "id" | "createdAt" | "updatedAt">) {
  return request<ApiCoupon>("/coupons", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCoupon(id: string, data: Partial<ApiCoupon>) {
  return request<ApiCoupon>(`/coupons/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteCoupon(id: string) {
  return request<ApiCoupon>(`/coupons/${id}`, { method: "DELETE" });
}

export function toggleCouponActive(id: string) {
  return request<ApiCoupon>(`/coupons/${id}/toggle-active`, {
    method: "PATCH",
  });
}

// ─── Analytics ───

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
  product: ApiProduct;
  orderCount: number;
  totalQuantity: number;
}

export function fetchAnalyticsSummary() {
  return request<AnalyticsSummary>("/analytics/summary");
}

export function fetchMonthlyRevenue() {
  return request<MonthlyRevenue[]>("/analytics/monthly-revenue");
}

export function fetchOrderStatusDistribution() {
  return request<OrderStatusDist[]>("/analytics/order-status");
}

export function fetchTopProducts(limit = 5) {
  return request<TopProduct[]>(`/analytics/top-products?limit=${limit}`);
}
