"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import { fetchProducts, showApiError } from "@/lib/api";
import { Product } from "@/types";
import { useIsMounted } from "@/lib/hooks";

export default function ProductsPage() {
  const mounted = useIsMounted();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ published: "true" })
      .then(setProducts)
      .catch((err) => {
        showApiError(err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!mounted || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="pearl-text text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">작품 컬렉션</h1>
        <p className="mt-1 text-sm text-muted">
          {products.length}개의 작품
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product, i) => (
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

      {products.length === 0 && (
        <div className="py-20 text-center text-muted">
          현재 등록된 작품이 없습니다.
        </div>
      )}
    </div>
  );
}
