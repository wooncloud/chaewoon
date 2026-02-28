"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/types";
import { useIsMounted } from "@/lib/hooks";

export default function HomePage() {
  const mounted = useIsMounted();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ featured: "true", published: "true" })
      .then(setFeaturedProducts)
      .catch(() => setFeaturedProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="pearl-text text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 md:py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="pearl-gradient absolute -left-32 -top-32 h-96 w-96 rounded-full blur-3xl" />
          <div className="pearl-gradient absolute -bottom-32 -right-32 h-96 w-96 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted">
              <Sparkles className="h-3 w-3" />
              세상에 단 하나뿐인 자개 공예
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              구름 사이로 비치는
              <br />
              <span className="pearl-text">영롱한 자개 빛깔</span>
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              채운(彩雲)의 자개 공예 작품은 장인의 손끝에서 하나하나 탄생합니다.
              빛의 각도에 따라 달라지는 무지개빛 광택을 일상에 담아보세요.
              모든 작품은 세상에 단 하나뿐입니다.
            </p>

            <Link href="/products">
              <Button size="lg">
                작품 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      {!loading && featuredProducts.length > 0 && (
        <section className="px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold">최신 작품</h2>
                <p className="mt-1 text-sm text-muted">
                  채운이 새롭게 선보이는 자개 공예 작품
                </p>
              </div>
              <Link
                href="/products"
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                전체 보기 &rarr;
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Story */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold">채운의 이야기</h2>
          <p className="leading-relaxed text-muted">
            채운(彩雲)은 &lsquo;오색 구름&rsquo;이라는 뜻으로, 자개가 빛을
            받아 영롱하게 빛나는 모습을 담았습니다. 하나의 작품에 정성과
            시간을 담아 제작하기에, 모든 작품은 세상에 단 하나뿐입니다.
            한번 판매되면 다시 만들 수 없는, 당신만의 특별한 자개 공예
            작품을 만나보세요.
          </p>
        </div>
      </section>
    </div>
  );
}
