"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Coupon, Product } from "@/types";
import { validateCoupon, calculateCouponDiscount } from "@/data/coupons";

interface CartState {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  couponCode: string;
  couponMessage: string;

  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  applyCoupon: (code: string) => void;
  removeCoupon: () => void;

  getSubtotal: () => number;
  getCouponDiscount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      couponCode: "",
      couponMessage: "",

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? {
                      ...item,
                      quantity: Math.min(
                        item.quantity + quantity,
                        product.stock
                      ),
                    }
                  : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { product, quantity: Math.min(quantity, product.stock) },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.min(quantity, item.product.stock) }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null, couponCode: "", couponMessage: "" });
      },

      applyCoupon: (code) => {
        const subtotal = get().getSubtotal();
        const result = validateCoupon(code, subtotal);
        if (result.valid && result.coupon) {
          set({
            appliedCoupon: result.coupon,
            couponCode: code,
            couponMessage: result.message,
          });
        } else {
          set({
            appliedCoupon: null,
            couponCode: "",
            couponMessage: result.message,
          });
        }
      },

      removeCoupon: () => {
        set({ appliedCoupon: null, couponCode: "", couponMessage: "" });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      getCouponDiscount: () => {
        const { appliedCoupon } = get();
        if (!appliedCoupon) return 0;
        return calculateCouponDiscount(appliedCoupon, get().getSubtotal());
      },

      getTotal: () => {
        return Math.max(0, get().getSubtotal() - get().getCouponDiscount());
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "chaewoon-cart",
    }
  )
);
