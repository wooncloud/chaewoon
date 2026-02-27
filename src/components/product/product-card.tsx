"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart";
import { CATEGORY_LABELS } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="group rounded-xl border border-border bg-card transition-all duration-300 hover:border-white/20 hover:bg-card-hover">
      <Link href={`/products/${product.id}`}>
        <div className="product-image-placeholder relative aspect-square overflow-hidden rounded-t-xl">
          <div className="flex h-full items-center justify-center">
            <span className="pearl-text text-4xl font-bold opacity-30">彩</span>
          </div>
          {product.stock <= 5 && product.stock > 0 && (
            <Badge className="absolute left-3 top-3" variant="default">
              한정 {product.stock}개
            </Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="text-sm font-medium text-white">품절</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-2">
          <Badge variant="secondary" className="text-[10px]">
            {CATEGORY_LABELS[product.category]}
          </Badge>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="mb-1 text-sm font-semibold text-foreground transition-colors group-hover:text-white">
            {product.name}
          </h3>
        </Link>

        <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-foreground">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-muted transition-all hover:bg-white/20 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="장바구니에 담기"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
