"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { useAdminStore } from "@/store/admin";

function EditProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const id = searchParams.get("id");
  const getProductById = useAdminStore((s) => s.getProductById);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="pearl-text py-20 text-center">로딩 중...</div>;
  }

  if (!id) {
    router.push("/admin/products");
    return null;
  }

  const product = getProductById(id);
  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted">상품을 찾을 수 없습니다.</p>
        <Link
          href="/admin/products"
          className="mt-2 inline-block text-sm text-purple-400 hover:underline"
        >
          상품 목록으로 돌아가기
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
        상품 목록으로
      </Link>
      <h1 className="mb-6 text-2xl font-bold">상품 수정</h1>
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
