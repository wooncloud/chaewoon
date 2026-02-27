"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Star,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAdminStore } from "@/store/admin";
import { formatPrice } from "@/lib/utils";
import { useIsMounted } from "@/lib/hooks";

export default function AdminProductsPage() {
  const mounted = useIsMounted();
  const [search, setSearch] = useState("");
  const [soldFilter, setSoldFilter] = useState<"all" | "available" | "sold">(
    "all"
  );
  const [publishedFilter, setPublishedFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const {
    getProductsByFilter,
    togglePublished,
    toggleFeatured,
    deleteProduct,
  } = useAdminStore();

  if (!mounted) {
    return <div className="pearl-text py-20 text-center">로딩 중...</div>;
  }

  const filtered = getProductsByFilter({
    search,
    sold: soldFilter,
    published: publishedFilter,
  });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">작품 관리</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            작품 등록
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="작품명 또는 태그 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={soldFilter}
          onChange={(e) =>
            setSoldFilter(e.target.value as "all" | "available" | "sold")
          }
          className="h-11 rounded-lg border border-neutral-700 bg-neutral-900/50 px-3 text-sm text-white focus:border-purple-400/50 focus:outline-none"
        >
          <option value="all">전체 판매 상태</option>
          <option value="available">판매 가능</option>
          <option value="sold">판매 완료</option>
        </select>
        <select
          value={publishedFilter}
          onChange={(e) =>
            setPublishedFilter(e.target.value as "all" | "published" | "draft")
          }
          className="h-11 rounded-lg border border-neutral-700 bg-neutral-900/50 px-3 text-sm text-white focus:border-purple-400/50 focus:outline-none"
        >
          <option value="all">전체 게시 상태</option>
          <option value="published">게시 중</option>
          <option value="draft">비공개</option>
        </select>
      </div>

      <div className="text-xs text-muted mb-3">{filtered.length}개의 작품</div>

      {/* Product Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="px-4 py-3 text-left font-medium text-muted">
                작품명
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted">
                가격
              </th>
              <th className="hidden px-4 py-3 text-center font-medium text-muted sm:table-cell">
                판매
              </th>
              <th className="px-4 py-3 text-center font-medium text-muted">
                상태
              </th>
              <th className="px-4 py-3 text-center font-medium text-muted">
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr
                key={product.id}
                className="border-b border-border transition-colors hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-foreground">
                    {product.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {formatPrice(product.price)}
                </td>
                <td className="hidden px-4 py-3 text-center sm:table-cell">
                  {product.sold ? (
                    <Badge variant="secondary" className="text-[10px]">
                      판매 완료
                    </Badge>
                  ) : (
                    <Badge className="text-[10px]">판매 가능</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => togglePublished(product.id)}
                      className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] transition-colors ${
                        product.published
                          ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                          : "bg-neutral-500/10 text-neutral-400 hover:bg-neutral-500/20"
                      }`}
                      title={product.published ? "게시 중" : "비공개"}
                    >
                      {product.published ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                      <span className="hidden sm:inline">
                        {product.published ? "게시" : "비공개"}
                      </span>
                    </button>
                    <button
                      onClick={() => toggleFeatured(product.id)}
                      className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                        product.featured
                          ? "text-yellow-400 hover:bg-yellow-500/20"
                          : "text-neutral-600 hover:bg-white/10 hover:text-neutral-400"
                      }`}
                      title={product.featured ? "추천 해제" : "추천 설정"}
                    >
                      <Star
                        className="h-3 w-3"
                        fill={product.featured ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <Link
                      href={`/admin/products/edit?id=${product.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/10 hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    {deleteConfirm === product.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            deleteProduct(product.id);
                            setDeleteConfirm(null);
                          }}
                          className="rounded px-2 py-1 text-[10px] text-red-400 hover:bg-red-500/20"
                        >
                          삭제
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="rounded px-2 py-1 text-[10px] text-muted hover:bg-white/10"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted">
            조건에 맞는 작품이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
