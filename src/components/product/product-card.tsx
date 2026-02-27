"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, removeItem, hasItem } = useWishlistStore();
  const isWished = hasItem(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWished) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  return (
    <div className="group rounded-xl border border-border bg-card transition-all duration-300 hover:border-white/20 hover:bg-card-hover">
      <Link href={`/products/${product.id}`}>
        <div className="product-image-placeholder relative aspect-square overflow-hidden rounded-t-xl">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="pearl-text text-4xl font-bold opacity-30">彩</span>
            </div>
          )}
          {product.sold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="text-sm font-medium text-white">SOLD</span>
            </div>
          )}
          <button
            onClick={toggleWishlist}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-black/60"
            aria-label="위시리스트"
          >
            <Heart
              className={`h-4 w-4 ${
                isWished
                  ? "fill-rose-400 text-rose-400"
                  : "text-white/70"
              }`}
            />
          </button>
        </div>
      </Link>

      <div className="p-4">
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
          {product.sold && (
            <span className="text-xs text-muted">품절</span>
          )}
        </div>
      </div>
    </div>
  );
}
