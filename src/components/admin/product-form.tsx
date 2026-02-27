"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/types";
import { useAdminStore } from "@/store/admin";

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const { addProduct, updateProduct } = useAdminStore();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    tags: product?.tags.join(", ") ?? "",
    featured: product?.featured ?? false,
    published: product?.published ?? false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "작품명을 입력하세요.";
    if (!form.description.trim())
      newErrors.description = "작품 설명을 입력하세요.";
    if (form.price <= 0) newErrors.price = "가격은 0보다 커야 합니다.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (isEdit && product) {
      updateProduct(product.id, {
        name: form.name,
        description: form.description,
        price: form.price,
        tags,
        featured: form.featured,
        published: form.published,
      });
    } else {
      addProduct({
        name: form.name,
        description: form.description,
        price: form.price,
        images: [],
        tags,
        sold: false,
        featured: form.featured,
        published: form.published,
      });
    }

    router.push("/admin/products");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 font-bold">기본 정보</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-muted">작품명 *</label>
            <Input
              placeholder="예: 자개 나비 키링"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-muted">
              작품 설명 *
            </label>
            <textarea
              placeholder="작품에 대한 상세 설명을 입력하세요."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              className="flex w-full rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-purple-400/50 focus:outline-none focus:ring-1 focus:ring-purple-400/30"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-400">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-muted">
              가격 (원) *
            </label>
            <Input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-400">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-muted">
              태그 (쉼표로 구분)
            </label>
            <Input
              placeholder="예: 나비, 선물추천"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 font-bold">게시 설정</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) =>
                setForm({ ...form, published: e.target.checked })
              }
              className="h-4 w-4 rounded border-neutral-600 bg-neutral-800 accent-purple-400"
            />
            <div>
              <span className="text-sm text-foreground">게시하기</span>
              <p className="text-xs text-muted">
                고객 사이트에 작품이 표시됩니다
              </p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                setForm({ ...form, featured: e.target.checked })
              }
              className="h-4 w-4 rounded border-neutral-600 bg-neutral-800 accent-purple-400"
            />
            <div>
              <span className="text-sm text-foreground">추천 작품</span>
              <p className="text-xs text-muted">
                메인 페이지 추천 섹션에 표시됩니다
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" size="lg">
          {isEdit ? "작품 수정" : "작품 등록"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push("/admin/products")}
        >
          취소
        </Button>
      </div>
    </form>
  );
}
