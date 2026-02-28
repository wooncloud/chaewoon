"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { fetchProduct } from "@/lib/api";
import { Product } from "@/types";

function EditProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      router.push("/admin/products");
      return;
    }
    fetchProduct(id)
      .then(setProduct)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return <div className="pearl-text py-20 text-center">로딩 중...</div>;
  }

  if (notFound || !product) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted">작품을 찾을 수 없습니다.</p>
        <Link
          href="/admin/products"
          className="mt-2 inline-block text-sm text-purple-400 hover:underline"
        >
          작품 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        작품 목록으로
      </Link>
      <h1 className="mb-6 text-2xl font-bold">작품 수정</h1>
      <ProductForm product={product} />
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense
      fallback={
        <div className="pearl-text py-20 text-center">로딩 중...</div>
      }
    >
      <EditProductContent />
    </Suspense>
  );
}
