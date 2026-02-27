"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Minus, Plus, ChevronLeft, Check } from "lucide-react";
import { getProductById } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = getProductById(id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        컬렉션으로 돌아가기
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
          <div className="mb-2 flex gap-2">
            <Badge variant="secondary">
              {CATEGORY_LABELS[product.category]}
            </Badge>
            {product.stock <= 5 && product.stock > 0 && (
              <Badge>한정 {product.stock}개</Badge>
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
          <div className="mb-6 flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="mb-2 block text-sm text-muted">수량</label>
            <div className="inline-flex items-center rounded-lg border border-border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-foreground"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex h-10 w-12 items-center justify-center text-sm font-medium">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="flex h-10 w-10 items-center justify-center text-muted transition-colors hover:text-foreground"
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mt-auto flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1"
            >
              {added ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  장바구니에 담았습니다
                </>
              ) : (
                <>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {product.stock === 0
                    ? "품절"
                    : `장바구니에 담기 · ${formatPrice(product.price * quantity)}`}
                </>
              )}
            </Button>
            <Link href="/cart">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                장바구니 보기
              </Button>
            </Link>
          </div>

          {/* Shipping Info */}
          <div className="mt-6 rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted">
              50,000원 이상 구매 시 무료 배송 · 수작업 제품으로 1-3일 내 출고
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
