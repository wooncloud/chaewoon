"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, ProductCategory, Coupon, Order, OrderStatus, CartItem } from "@/types";
import { products as initialProducts } from "@/data/products";
import { coupons as initialCoupons } from "@/data/coupons";
import { orders as initialOrders } from "@/data/orders";

interface AdminState {
  products: Product[];
  coupons: Coupon[];
  orders: Order[];

  addOrder: (order: {
    items: CartItem[];
    subtotal: number;
    couponDiscount: number;
    total: number;
    couponCode?: string;
    shippingAddress: Order["shippingAddress"];
  }) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;

  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  togglePublished: (id: string) => void;
  toggleFeatured: (id: string) => void;

  addCoupon: (coupon: Omit<Coupon, "id">) => void;
  updateCoupon: (id: string, data: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponActive: (id: string) => void;

  getProductById: (id: string) => Product | undefined;
  getPublishedProducts: () => Product[];
  getFeaturedProducts: () => Product[];
  getProductsByFilter: (opts: {
    search?: string;
    category?: ProductCategory | "all";
    published?: "all" | "published" | "draft";
  }) => Product[];
}

function nextId(prefix: string, items: { id: string }[]): string {
  const maxNum = items.reduce((max, item) => {
    const match = item.id.match(new RegExp(`^${prefix}-(\\d+)$`));
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);
  return `${prefix}-${String(maxNum + 1).padStart(3, "0")}`;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      coupons: initialCoupons,
      orders: initialOrders,

      addOrder: (data) => {
        const id = nextId("ord", get().orders);
        const newOrder: Order = {
          ...data,
          id,
          status: "pending",
          createdAt: new Date().toISOString().split("T")[0],
        };
        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));
      },

      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        }));
      },

      addProduct: (data) => {
        const id = nextId("prod", get().products);
        const newProduct: Product = {
          ...data,
          id,
          createdAt: new Date().toISOString().split("T")[0],
        };
        set((state) => ({
          products: [newProduct, ...state.products],
        }));
      },

      updateProduct: (id, data) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      togglePublished: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, published: !p.published } : p
          ),
        }));
      },

      toggleFeatured: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, featured: !p.featured } : p
          ),
        }));
      },

      addCoupon: (data) => {
        const id = nextId("cpn", get().coupons);
        const newCoupon: Coupon = { ...data, id };
        set((state) => ({
          coupons: [newCoupon, ...state.coupons],
        }));
      },

      updateCoupon: (id, data) => {
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        }));
      },

      deleteCoupon: (id) => {
        set((state) => ({
          coupons: state.coupons.filter((c) => c.id !== id),
        }));
      },

      toggleCouponActive: (id) => {
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          ),
        }));
      },

      getProductById: (id) => {
        return get().products.find((p) => p.id === id);
      },

      getPublishedProducts: () => {
        return get().products.filter((p) => p.published);
      },

      getFeaturedProducts: () => {
        return get().products.filter((p) => p.featured && p.published);
      },

      getProductsByFilter: ({ search, category, published }) => {
        let result = get().products;

        if (search) {
          const q = search.toLowerCase();
          result = result.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.tags.some((t) => t.toLowerCase().includes(q))
          );
        }

        if (category && category !== "all") {
          result = result.filter((p) => p.category === category);
        }

        if (published === "published") {
          result = result.filter((p) => p.published);
        } else if (published === "draft") {
          result = result.filter((p) => !p.published);
        }

        return result;
      },
    }),
    {
      name: "chaewoon-admin",
    }
  )
);
