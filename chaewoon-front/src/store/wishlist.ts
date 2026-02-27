"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  ids: string[];

  addId: (productId: string) => void;
  removeId: (productId: string) => void;
  hasId: (productId: string) => boolean;
  clearAll: () => void;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],

      addId: (productId) => {
        set((state) => {
          if (state.ids.includes(productId)) return state;
          return { ids: [...state.ids, productId] };
        });
      },

      removeId: (productId) => {
        set((state) => ({
          ids: state.ids.filter((id) => id !== productId),
        }));
      },

      hasId: (productId) => {
        return get().ids.includes(productId);
      },

      clearAll: () => {
        set({ ids: [] });
      },

      getCount: () => {
        return get().ids.length;
      },
    }),
    {
      name: "chaewoon-wishlist",
    }
  )
);
