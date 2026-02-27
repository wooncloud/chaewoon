"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminStore } from "@/store/admin";
import { formatPrice } from "@/lib/utils";
import { useIsMounted } from "@/lib/hooks";
import { Coupon } from "@/types";

type CouponFormData = Omit<Coupon, "id">;

const emptyCoupon: CouponFormData = {
  code: "",
  description: "",
  discountType: "percent",
  discountValue: 0,
  minOrderAmount: 0,
  maxDiscountAmount: undefined,
  validFrom: "",
  validUntil: "",
  isActive: true,
};

export default function AdminCouponsPage() {
  const mounted = useIsMounted();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CouponFormData>(emptyCoupon);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const {
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponActive,
  } = useAdminStore();

  if (!mounted) {
    return <div className="pearl-text py-20 text-center">로딩 중...</div>;
  }

  const openNew = () => {
    setForm(emptyCoupon);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (coupon: Coupon) => {
    setForm({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscountAmount: coupon.maxDiscountAmount,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      isActive: coupon.isActive,
    });
    setEditingId(coupon.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.description) return;

    if (editingId) {
      updateCoupon(editingId, form);
    } else {
      addCoupon(form);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyCoupon);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">쿠폰 관리</h1>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          쿠폰 등록
        </Button>
      </div>

      {/* Coupon Form Modal */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">
              {editingId ? "쿠폰 수정" : "새 쿠폰 등록"}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-muted">
                  쿠폰 코드 *
                </label>
                <Input
                  placeholder="예: WELCOME10"
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value.toUpperCase() })
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-muted">
                  설명 *
                </label>
                <Input
                  placeholder="예: 신규 가입 환영 10% 할인"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm text-muted">
                  할인 유형
                </label>
                <select
                  value={form.discountType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      discountType: e.target.value as "percent" | "fixed",
                    })
                  }
                  className="flex h-11 w-full rounded-lg border border-neutral-700 bg-neutral-900/50 px-4 text-sm text-white focus:border-purple-400/50 focus:outline-none"
                >
                  <option value="percent">정률 (%)</option>
                  <option value="fixed">정액 (원)</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-muted">
                  할인 값 *
                </label>
                <Input
                  type="number"
                  min={0}
                  value={form.discountValue}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      discountValue: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-muted">
                  최소 주문 금액
                </label>
                <Input
                  type="number"
                  min={0}
                  value={form.minOrderAmount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      minOrderAmount: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm text-muted">
                  최대 할인 한도 (선택)
                </label>
                <Input
                  type="number"
                  min={0}
                  placeholder="없음"
                  value={form.maxDiscountAmount ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      maxDiscountAmount: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-muted">
                  시작일
                </label>
                <Input
                  type="date"
                  value={form.validFrom}
                  onChange={(e) =>
                    setForm({ ...form, validFrom: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-muted">
                  종료일
                </label>
                <Input
                  type="date"
                  value={form.validUntil}
                  onChange={(e) =>
                    setForm({ ...form, validUntil: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">
                {editingId ? "수정 완료" : "등록"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                취소
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Coupon List */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="px-4 py-3 text-left font-medium text-muted">
                코드
              </th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted sm:table-cell">
                설명
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted">
                할인
              </th>
              <th className="hidden px-4 py-3 text-right font-medium text-muted sm:table-cell">
                최소 주문
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
            {coupons.map((coupon) => (
              <tr
                key={coupon.id}
                className="border-b border-border transition-colors hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3">
                  <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-xs">
                    {coupon.code}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-muted sm:table-cell">
                  {coupon.description}
                </td>
                <td className="px-4 py-3 text-right">
                  {coupon.discountType === "percent"
                    ? `${coupon.discountValue}%`
                    : formatPrice(coupon.discountValue)}
                </td>
                <td className="hidden px-4 py-3 text-right text-muted sm:table-cell">
                  {formatPrice(coupon.minOrderAmount)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleCouponActive(coupon.id)}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] ${
                      coupon.isActive
                        ? "bg-green-500/10 text-green-400"
                        : "bg-neutral-500/10 text-neutral-400"
                    }`}
                  >
                    {coupon.isActive ? (
                      <ToggleRight className="h-3.5 w-3.5" />
                    ) : (
                      <ToggleLeft className="h-3.5 w-3.5" />
                    )}
                    <span className="hidden sm:inline">
                      {coupon.isActive ? "활성" : "비활성"}
                    </span>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => openEdit(coupon)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/10 hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    {deleteConfirm === coupon.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            deleteCoupon(coupon.id);
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
                        onClick={() => setDeleteConfirm(coupon.id)}
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

        {coupons.length === 0 && (
          <div className="py-12 text-center text-muted">
            등록된 쿠폰이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
