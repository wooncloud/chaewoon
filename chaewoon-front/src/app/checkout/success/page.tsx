"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { confirmPayment, fetchOrderSummary } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [orderInfo, setOrderInfo] = useState<{
    total: number;
    items: { product: { name: string } }[];
  } | null>(null);
  const confirmedRef = useRef(false);

  useEffect(() => {
    if (confirmedRef.current) return;
    confirmedRef.current = true;

    if (!paymentKey || !orderId || !amount) {
      setErrorMessage("결제 정보가 올바르지 않습니다.");
      setStatus("error");
      return;
    }

    confirmPayment({
      paymentKey,
      orderId,
      amount: Number(amount),
    })
      .then((order) => {
        setOrderInfo({
          total: order.total,
          items: order.items,
        });
        setStatus("success");
      })
      .catch((err) => {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "결제 확인 중 오류가 발생했습니다.",
        );
        // 주문 요약이라도 가져오기 시도
        fetchOrderSummary(orderId)
          .then((summary) => {
            setOrderInfo({
              total: summary.total,
              items: summary.items.map((i) => ({
                product: { name: i.product.name },
              })),
            });
          })
          .catch(() => {});
        setStatus("error");
      });
  }, [paymentKey, orderId, amount]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
        <p className="text-muted">결제 확인 중...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold">결제 확인 실패</h1>
        <p className="text-center text-sm text-muted">
          {errorMessage}
          <br />
          문제가 지속되면 문의해주세요.
        </p>
        {orderId && (
          <p className="text-xs text-muted">
            주문 번호: {orderId.slice(0, 8)}...
          </p>
        )}
        <div className="flex gap-3">
          <Link href="/contact">
            <Button variant="outline">문의하기</Button>
          </Link>
          <Link href="/products">
            <Button variant="secondary">작품 보기</Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
        <Check className="h-8 w-8 text-green-400" />
      </div>
      <h1 className="text-2xl font-bold">결제가 완료되었습니다</h1>
      <p className="text-center text-sm text-muted">
        주문해 주셔서 감사합니다.
        <br />
        정성을 담아 준비하겠습니다.
      </p>
      {orderInfo && (
        <div className="mt-2 rounded-xl border border-border bg-card px-6 py-4 text-sm">
          <div className="space-y-1.5">
            {orderInfo.items.map((item, i) => (
              <p key={i} className="text-muted">
                {item.product.name}
              </p>
            ))}
            <p className="mt-2 border-t border-border pt-2 font-medium">
              결제 금액: {formatPrice(orderInfo.total)}
            </p>
          </div>
        </div>
      )}
      <Link href="/products">
        <Button variant="secondary">다른 작품 보기</Button>
      </Link>
    </motion.div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="pearl-text">결제 확인 중...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
