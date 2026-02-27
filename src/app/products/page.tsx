"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAdminStore } from "@/store/admin";
import { ProductCard } from "@/components/product/product-card";
import { CATEGORY_LABELS, ProductCategory } from "@/types";

function ProductListContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") as ProductCategory | null;
  const [mounted, setMounted] = useState(false);
  const getPublishedProducts = useAdminStore((s) => s.getPublishedProducts);

  useEffect(() => {
    setMounted(true);
  }, []);

  const published = mounted ? getPublishedProducts() : [];
  const filtered = category
    ? published.filter((p) => p.category === category)
    : published;

  const categories = Object.entries(CATEGORY_LABELS) as [
    ProductCategory,
    string,
  ][];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">
          {category ? CATEGORY_LABELS[category] : "전체 컬렉션"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {filtered.length}개의 작품
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        <a
          href="/products"
          className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
            !category
              ? "bg-white/15 text-foreground"
              : "bg-white/5 text-muted hover:bg-white/10"
          }`}
        >
          전체
        </a>
        {categories.map(([key, label]) => (
          <a
            key={key}
            href={`/products?category=${key}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
              category === key
                ? "bg-white/15 text-foreground"
                : "bg-white/5 text-muted hover:bg-white/10"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Product Grid: 모바일 1컬럼 / PC 다중 컬럼 */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-muted">
          해당 카테고리에 상품이 없습니다.
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="pearl-text text-lg">로딩 중...</div>
        </div>
      }
    >
      <ProductListContent />
    </Suspense>
  );
}
