"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, ProductCategory, Coupon } from "@/types";
import { products as initialProducts } from "@/data/products";
import { coupons as initialCoupons } from "@/data/coupons";

interface AdminState {
  products: Product[];
  coupons: Coupon[];

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
  getProductsByFilter: (opts: {
    search?: string;
    category?: ProductCategory | "all";
    published?: "all" | "published" | "draft";
  }) => Product[];
}

let productCounter = initialProducts.length;
let couponCounter = initialCoupons.length;

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      coupons: initialCoupons,

      addProduct: (data) => {
        productCounter++;
        const newProduct: Product = {
          ...data,
          id: `prod-${String(productCounter).padStart(3, "0")}`,
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
        couponCounter++;
        const newCoupon: Coupon = {
          ...data,
          id: `cpn-${String(couponCounter).padStart(3, "0")}`,
        };
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
