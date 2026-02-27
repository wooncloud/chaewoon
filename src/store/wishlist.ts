"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

interface WishlistState {
  items: Product[];

  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  clearAll: () => void;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          if (state.items.some((item) => item.id === product.id)) {
            return state;
          }
          return { items: [...state.items, product] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      hasItem: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      clearAll: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: "chaewoon-wishlist",
    }
  )
);
