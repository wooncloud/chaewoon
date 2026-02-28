"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  ImageIcon,
  Upload,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createProduct,
  updateProduct,
  uploadImage,
  showApiError,
  toAbsoluteUrl,
} from "@/lib/api";
import { Product } from "@/types";

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    tags: product?.tags.join(", ") ?? "",
    thumbnail: product?.thumbnail ?? "",
    bodyImages: product?.bodyImages ?? ([] as string[]),
    featured: product?.featured ?? false,
    published: product?.published ?? false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingBody, setUploadingBody] = useState(false);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const bodyInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "작품명을 입력하세요.";
    if (!form.description.trim())
      newErrors.description = "작품 설명을 입력하세요.";
    if (form.price <= 0) newErrors.price = "가격은 0보다 커야 합니다.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    try {
      const { url } = await uploadImage(file);
      setForm((prev) => ({ ...prev, thumbnail: url }));
    } catch (err) {
      showApiError(err);
    } finally {
      setUploadingThumbnail(false);
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    }
  };

  const handleBodyImagesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingBody(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const { url } = await uploadImage(file);
        urls.push(url);
      }
      setForm((prev) => ({
        ...prev,
        bodyImages: [...prev.bodyImages, ...urls],
      }));
    } catch (err) {
      showApiError(err);
    } finally {
      setUploadingBody(false);
      if (bodyInputRef.current) bodyInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const bodyImages = form.bodyImages.filter((url) => url.trim() !== "");

    setSubmitting(true);

    try {
      if (isEdit && product) {
        await updateProduct(product.id, {
          name: form.name,
          description: form.description,
          price: form.price,
          tags,
          thumbnail: form.thumbnail.trim(),
          bodyImages,
          featured: form.featured,
          published: form.published,
        });
      } else {
        await createProduct({
          name: form.name,
          description: form.description,
          price: form.price,
          thumbnail: form.thumbnail.trim(),
          bodyImages,
          tags,
          sold: false,
          featured: form.featured,
          published: form.published,
        });
      }

      router.push("/admin/products");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "저장 중 오류가 발생했습니다.";
      setErrors({ submit: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {errors.submit}
        </div>
      )}

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
        <h2 className="mb-4 font-bold">이미지 관리</h2>
        <div className="space-y-4">
          {/* Thumbnail */}
          <div>
            <label className="mb-1.5 block text-sm text-muted">
              썸네일 이미지
            </label>
            <div className="flex gap-2">
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadingThumbnail}
                onClick={() => thumbnailInputRef.current?.click()}
              >
                {uploadingThumbnail ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                )}
                {uploadingThumbnail ? "업로드 중..." : "파일 선택"}
              </Button>
              {form.thumbnail && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, thumbnail: "" })}
                  className="rounded p-1.5 text-muted transition-colors hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {form.thumbnail.trim() && (
              <div className="mt-2 overflow-hidden rounded-lg border border-border">
                <img
                  src={toAbsoluteUrl(form.thumbnail)}
                  alt="썸네일 미리보기"
                  className="h-40 w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Body Images */}
          <div>
            <label className="mb-1.5 block text-sm text-muted">
              본문 이미지 ({form.bodyImages.length}장)
            </label>
            <div className="space-y-2">
              {form.bodyImages.map((url, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="mt-2.5 text-xs text-muted">{idx + 1}</span>
                  <div className="flex-1">
                    {url.trim() && (
                      <div className="overflow-hidden rounded-lg border border-border">
                        <img
                          src={toAbsoluteUrl(url)}
                          alt={`본문 이미지 ${idx + 1}`}
                          className="h-28 w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const next = [...form.bodyImages];
                        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                        setForm({ ...form, bodyImages: next });
                      }}
                      className="rounded p-1 text-muted transition-colors hover:text-white disabled:opacity-30"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === form.bodyImages.length - 1}
                      onClick={() => {
                        const next = [...form.bodyImages];
                        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                        setForm({ ...form, bodyImages: next });
                      }}
                      className="rounded p-1 text-muted transition-colors hover:text-white disabled:opacity-30"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({
                        ...form,
                        bodyImages: form.bodyImages.filter(
                          (_, i) => i !== idx,
                        ),
                      });
                    }}
                    className="mt-2 rounded p-1 text-muted transition-colors hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <input
              ref={bodyInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleBodyImagesUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadingBody}
              onClick={() => bodyInputRef.current?.click()}
              className="mt-2"
            >
              {uploadingBody ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="mr-1.5 h-3.5 w-3.5" />
              )}
              {uploadingBody ? "업로드 중..." : "이미지 추가"}
            </Button>
          </div>

          {form.thumbnail === "" && form.bodyImages.length === 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-neutral-900/50 px-3 py-2">
              <ImageIcon className="h-4 w-4 text-muted" />
              <p className="text-xs text-muted">
                이미지가 없으면 기본 플레이스홀더가 표시됩니다.
              </p>
            </div>
          )}
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
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting
            ? "저장 중..."
            : isEdit
              ? "작품 수정"
              : "작품 등록"}
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
