"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Heart, ChevronLeft } from "lucide-react";
import { useAdminStore } from "@/store/admin";
import { useWishlistStore } from "@/store/wishlist";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useIsMounted } from "@/lib/hooks";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const mounted = useIsMounted();
  const storeGetProductById = useAdminStore((s) => s.getProductById);
  const { addItem, removeItem, hasItem } = useWishlistStore();

  const product = mounted ? storeGetProductById(id) : undefined;

  if (!mounted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="pearl-text text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!product || !product.published) {
    notFound();
  }

  const isWished = hasItem(product.id);

  const toggleWishlist = () => {
    if (isWished) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        작품 목록으로 돌아가기
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="product-image-placeholder aspect-square overflow-hidden rounded-2xl border border-border">
            <div className="flex h-full items-center justify-center">
              <span className="pearl-text text-8xl font-bold opacity-20">
                彩
              </span>
            </div>
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col"
        >
          <div className="mb-2">
            {product.sold ? (
              <Badge variant="secondary">SOLD</Badge>
            ) : (
              <Badge>구매 가능</Badge>
            )}
          </div>

          <h1 className="mb-3 text-2xl font-bold md:text-3xl">
            {product.name}
          </h1>

          <p className="mb-6 leading-relaxed text-muted">
            {product.description}
          </p>

          <div className="mb-6">
            <span className="text-3xl font-bold">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto flex flex-col gap-3 sm:flex-row">
            {product.sold ? (
              <Button size="lg" disabled className="flex-1">
                품절된 작품입니다
              </Button>
            ) : (
              <Link href={`/checkout?product=${product.id}`} className="flex-1">
                <Button size="lg" className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  바로 구매 · {formatPrice(product.price)}
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="lg"
              onClick={toggleWishlist}
              className="sm:w-auto"
            >
              <Heart
                className={`mr-2 h-4 w-4 ${
                  isWished ? "fill-rose-400 text-rose-400" : ""
                }`}
              />
              {isWished ? "위시리스트에서 제거" : "위시리스트에 담기"}
            </Button>
          </div>

          {/* Info */}
          <div className="mt-6 rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted">
              세상에 단 하나뿐인 수공예 작품 · 수작업 제품으로 1-3일 내 출고
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
