"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        상품 목록으로
      </Link>
      <h1 className="mb-6 text-2xl font-bold">새 상품 등록</h1>
      <ProductForm />
    </div>
  );
}
