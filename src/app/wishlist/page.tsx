"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist";
import { useAdminStore } from "@/store/admin";
import { formatPrice } from "@/lib/utils";
import { useIsMounted } from "@/lib/hooks";

export default function WishlistPage() {
  const mounted = useIsMounted();
  const { items, removeItem, clearAll } = useWishlistStore();
  const getProductById = useAdminStore((s) => s.getProductById);

  if (!mounted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="pearl-text">로딩 중...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
        <Heart className="h-16 w-16 text-muted" />
        <h1 className="text-xl font-bold">위시리스트가 비어있습니다</h1>
        <p className="text-sm text-muted">마음에 드는 작품을 담아보세요.</p>
        <Link href="/products">
          <Button>작품 둘러보기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">위시리스트</h1>
        <button
          onClick={clearAll}
          className="text-xs text-muted transition-colors hover:text-red-400"
        >
          전체 삭제
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {items.map((wishItem) => {
            const liveProduct = getProductById(wishItem.id);
            const isDeleted = !liveProduct;
            const isSold = isDeleted || (liveProduct?.sold ?? wishItem.sold);

            return (
              <motion.div
                key={wishItem.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`flex gap-4 rounded-xl border border-border bg-card p-4 ${
                  isSold ? "opacity-60" : ""
                }`}
              >
                <Link
                  href={isDeleted ? "#" : `/products/${wishItem.id}`}
                  className="product-image-placeholder h-20 w-20 shrink-0 overflow-hidden rounded-lg"
                >
                  <div className="flex h-full items-center justify-center">
                    <span className="pearl-text text-lg font-bold opacity-30">
                      彩
                    </span>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <Link
                      href={`/products/${wishItem.id}`}
                      className="text-sm font-semibold transition-colors hover:text-white"
                    >
                      {wishItem.name}
                    </Link>
                    <button
                      onClick={() => removeItem(wishItem.id)}
                      className="ml-2 text-muted transition-colors hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-sm font-bold">
                      {formatPrice(wishItem.price)}
                    </span>

                    {isSold ? (
                      <span className="text-xs text-muted">
                        {isDeleted ? "삭제된 작품" : "품절"}
                      </span>
                    ) : (
                      <Link href={`/checkout?product=${wishItem.id}`}>
                        <Button size="sm" className="h-8 text-xs">
                          <CreditCard className="mr-1.5 h-3 w-3" />
                          바로 구매
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
