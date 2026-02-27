"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, CreditCard, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { ShippingAddress } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>({
    name: "",
    phone: "",
    zipCode: "",
    address: "",
    addressDetail: "",
  });

  const { items, appliedCoupon, getSubtotal, getCouponDiscount, getTotal, clearCart } =
    useCartStore();

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

  if (items.length === 0 && !orderComplete) {
    router.push("/cart");
    return null;
  }

  if (orderComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <Check className="h-8 w-8 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold">주문이 완료되었습니다</h1>
        <p className="text-center text-sm text-muted">
          주문해 주셔서 감사합니다.
          <br />
          정성을 담아 준비하겠습니다.
        </p>
        <Link href="/products">
          <Button variant="secondary">계속 쇼핑하기</Button>
        </Link>
      </motion.div>
    );
  }

  const subtotal = getSubtotal();
  const couponDiscount = getCouponDiscount();
  const total = getTotal();
  const shippingFee = subtotal >= 50000 ? 0 : 3000;

  const isFormValid =
    address.name.trim() &&
    address.phone.trim() &&
    address.zipCode.trim() &&
    address.address.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    // 결제 처리 시뮬레이션
    await new Promise((r) => setTimeout(r, 1500));

    clearCart();
    setOrderComplete(true);
    setIsSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/cart"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        장바구니로 돌아가기
      </Link>

      <h1 className="mb-6 text-2xl font-bold">주문/결제</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Shipping Address Form */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-4 text-lg font-bold">배송 정보</h2>
              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-sm text-muted">
                    받는 분 *
                  </label>
                  <Input
                    placeholder="이름"
                    value={address.name}
                    onChange={(e) =>
                      setAddress({ ...address, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-muted">
                    연락처 *
                  </label>
                  <Input
                    placeholder="010-0000-0000"
                    value={address.phone}
                    onChange={(e) =>
                      setAddress({ ...address, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-muted">
                    우편번호 *
                  </label>
                  <Input
                    placeholder="우편번호"
                    value={address.zipCode}
                    onChange={(e) =>
                      setAddress({ ...address, zipCode: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-muted">
                    주소 *
                  </label>
                  <Input
                    placeholder="기본 주소"
                    value={address.address}
                    onChange={(e) =>
                      setAddress({ ...address, address: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-muted">
                    상세 주소
                  </label>
                  <Input
                    placeholder="상세 주소 (선택)"
                    value={address.addressDetail}
                    onChange={(e) =>
                      setAddress({
                        ...address,
                        addressDetail: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Order Items Summary */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-4 text-lg font-bold">주문 상품</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="h-fit rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-lg font-bold">결제 정보</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">상품 금액</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>쿠폰 할인 ({appliedCoupon?.description})</span>
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

            <Button
              type="submit"
              size="lg"
              className="mt-4 w-full"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                "결제 처리 중..."
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {formatPrice(total + shippingFee)} 결제하기
                </>
              )}
            </Button>

            <p className="mt-3 text-center text-[10px] text-muted">
              주문 시 이용약관에 동의한 것으로 간주됩니다
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
