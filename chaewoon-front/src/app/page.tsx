"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
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
    fetchProducts({ published: "true", limit: "5" })
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
      <section className="relative overflow-hidden px-6 py-10 md:py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="pearl-gradient absolute -left-32 -top-32 h-80 w-80 rounded-full blur-[100px]" />
          <div className="pearl-gradient absolute -bottom-32 -right-32 h-80 w-80 rounded-full blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-sm leading-[2] tracking-[0.06em] text-foreground/60 md:text-base md:leading-[2.2]"
          >
            구름들이 각기 모양이 다르듯
            <br className="md:hidden" />
            {" "}세상 어디에도 똑같은 결은 없기에,
            <br />
            자개의 영롱함은 오직 당신만을 위해 준비된
            <br className="md:hidden" />
            {" "}자연의 선물입니다.
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 text-base leading-[2] tracking-[0.06em] text-foreground/80 md:text-lg md:leading-[2.2]"
          >
            당신의 가장 고유한 순간을
            <br className="md:hidden" />
            {" "}특별함으로 가득{" "}
            <span className="pearl-text font-medium">채운(彩雲)</span>,
            <br />
            단 하나의 조각을 전합니다.
          </motion.h1>
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

      {/* Contact CTA */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <MessageCircle className="mx-auto mb-4 h-6 w-6 text-muted" />
          <h2 className="mb-2 text-lg font-medium">문의하기</h2>
          <p className="mb-6 text-sm leading-relaxed text-muted">
            작품에 대해 궁금한 점이나
            <br />
            주문 관련 문의가 있으시면 편하게 연락해 주세요.
          </p>
          <Link href="/contact">
            <Button variant="outline">
              문의하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
