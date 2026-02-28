import type {
  ApiErrorResponse,
  Product,
  Order,
  Coupon,
  AnalyticsSummary,
  MonthlyRevenue,
  OrderStatusDist,
  TopProduct,
  CouponValidation,
} from "chaewoon-shared";
import { useToastStore } from "./toast-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3849";

/** /uploads/... 같은 상대 경로를 절대 URL로 변환 */
export function toAbsoluteUrl(url: string) {
  if (!url) return url;
  return url.startsWith("/") ? `${API_URL}${url}` : url;
}

// ─── Error Handling ───

export class ApiError extends Error {
  statusCode: number;
  errors?: string[];

  constructor(res: ApiErrorResponse) {
    super(res.message);
    this.statusCode = res.statusCode;
    this.errors = res.errors;
  }
}

export function showApiError(err: unknown) {
  const message =
    err instanceof ApiError
      ? err.message
      : err instanceof Error
        ? err.message
        : "알 수 없는 오류가 발생했습니다.";
  useToastStore.getState().addToast("error", message);
}

export function showSuccess(message: string) {
  useToastStore.getState().addToast("success", message);
}

// ─── Request ───

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    // 401 응답 시 로그인 페이지로 리다이렉트 (브라우저 환경에서만)
    if (res.status === 401 && typeof window !== "undefined") {
      const isAdminPage = window.location.pathname.startsWith("/admin");
      if (isAdminPage) {
        window.location.href = "/login";
        throw new Error("인증이 만료되었습니다.");
      }
    }

    const body = await res.json().catch(() => ({
      statusCode: res.status,
      message: `API error: ${res.status}`,
      timestamp: new Date().toISOString(),
    }));
    throw new ApiError(body as ApiErrorResponse);
  }

  return res.json();
}

// ─── Auth ───

export function login(username: string, password: string) {
  return request<{ success: boolean; admin: { id: string; username: string } }>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ username, password }),
    },
  );
}

export function logout() {
  return request<{ success: boolean }>("/auth/logout", { method: "POST" });
}

export function getMe() {
  return request<{ id: string; username: string }>("/auth/me");
}

// ─── Uploads ───

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/uploads`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login";
      throw new Error("인증이 만료되었습니다.");
    }
    const body = await res.json().catch(() => ({
      statusCode: res.status,
      message: `업로드 실패: ${res.status}`,
      timestamp: new Date().toISOString(),
    }));
    throw new ApiError(body as ApiErrorResponse);
  }

  return res.json();
}

// ─── Products ───

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
  return request<Product[]>(`/products${qs ? `?${qs}` : ""}`);
}

export function fetchProduct(id: string) {
  return request<Product>(`/products/${id}`);
}

export function createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  return request<Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProduct(id: string, data: Partial<Product>) {
  return request<Product>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id: string) {
  return request<Product>(`/products/${id}`, { method: "DELETE" });
}

export function markProductSold(id: string) {
  return request<Product>(`/products/${id}/sold`, { method: "PATCH" });
}

export function toggleProductPublished(id: string) {
  return request<Product>(`/products/${id}/toggle-published`, {
    method: "PATCH",
  });
}

export function toggleProductFeatured(id: string) {
  return request<Product>(`/products/${id}/toggle-featured`, {
    method: "PATCH",
  });
}

// ─── Orders ───

export function fetchOrders(status?: string) {
  const qs = status ? `?status=${status}` : "";
  return request<Order[]>(`/orders${qs}`);
}

export function fetchOrder(id: string) {
  return request<Order>(`/orders/${id}`);
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
  return request<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateOrderStatus(id: string, status: string) {
  return request<Order>(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ─── Coupons ───

export function fetchCoupons() {
  return request<Coupon[]>("/coupons");
}

export function validateCoupon(code: string, amount: number) {
  return request<CouponValidation>(
    `/coupons/validate?code=${encodeURIComponent(code)}&amount=${amount}`,
  );
}

export function createCoupon(data: Omit<Coupon, "id" | "createdAt" | "updatedAt">) {
  return request<Coupon>("/coupons", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCoupon(id: string, data: Partial<Coupon>) {
  return request<Coupon>(`/coupons/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteCoupon(id: string) {
  return request<Coupon>(`/coupons/${id}`, { method: "DELETE" });
}

export function toggleCouponActive(id: string) {
  return request<Coupon>(`/coupons/${id}/toggle-active`, {
    method: "PATCH",
  });
}

// ─── Analytics ───

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
