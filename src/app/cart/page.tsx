"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [couponInput, setCouponInput] = useState("");

  const {
    items,
    appliedCoupon,
    couponMessage,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getCouponDiscount,
    getTotal,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="pearl-text">로딩 중...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
        <ShoppingBag className="h-16 w-16 text-muted" />
        <h1 className="text-xl font-bold">장바구니가 비어있습니다</h1>
        <p className="text-sm text-muted">마음에 드는 작품을 담아보세요.</p>
        <Link href="/products">
          <Button>컬렉션 둘러보기</Button>
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const couponDiscount = getCouponDiscount();
  const total = getTotal();
  const shippingFee = subtotal >= 50000 ? 0 : 3000;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">장바구니</h1>
        <button
          onClick={clearCart}
          className="text-xs text-muted transition-colors hover:text-red-400"
        >
          전체 삭제
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Cart Items */}
        <div className="space-y-3">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="product-image-placeholder h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                  <div className="flex h-full items-center justify-center">
                    <span className="pearl-text text-lg font-bold opacity-30">
                      彩
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="text-sm font-semibold transition-colors hover:text-white"
                    >
                      {item.product.name}
                    </Link>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="ml-2 text-muted transition-colors hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="inline-flex items-center rounded-lg border border-border">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="flex h-8 w-8 items-center justify-center text-muted hover:text-foreground"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="flex h-8 w-8 items-center justify-center text-xs font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.product.stock}
                        className="flex h-8 w-8 items-center justify-center text-muted hover:text-foreground disabled:opacity-40"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <span className="text-sm font-bold">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-bold">주문 요약</h2>

          {/* Coupon */}
          <div className="mb-4">
            <label className="mb-2 flex items-center gap-1.5 text-sm text-muted">
              <Tag className="h-3.5 w-3.5" />
              쿠폰 코드
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2">
                <span className="text-xs text-green-400">
                  {appliedCoupon.description}
                </span>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-muted hover:text-red-400"
                >
                  해제
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="쿠폰 코드 입력"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="h-9 text-xs"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    applyCoupon(couponInput);
                    setCouponInput("");
                  }}
                  className="shrink-0"
                >
                  적용
                </Button>
              </div>
            )}
            {couponMessage && !appliedCoupon && (
              <p className="mt-1.5 text-xs text-red-400">{couponMessage}</p>
            )}
          </div>

          <div className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">상품 금액</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>쿠폰 할인</span>
                <span>-{formatPrice(couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted">배송비</span>
              <span>
                {shippingFee === 0 ? (
                  <span className="text-green-400">무료</span>
                ) : (
                  formatPrice(shippingFee)
                )}
              </span>
            </div>
          </div>

          <div className="mt-4 flex justify-between border-t border-border pt-4">
            <span className="font-bold">총 결제 금액</span>
            <span className="text-lg font-bold pearl-text">
              {formatPrice(total + shippingFee)}
            </span>
          </div>

          <Link href="/checkout" className="mt-4 block">
            <Button size="lg" className="w-full">
              주문하기
            </Button>
          </Link>

          <p className="mt-3 text-center text-[10px] text-muted">
            로그인 후 주문이 가능합니다
          </p>
        </div>
      </div>
    </div>
  );
}
