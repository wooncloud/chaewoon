"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cancelOrder } from "@/lib/api";

function FailContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const message = searchParams.get("message");
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (cancelledRef.current || !orderId) return;
    cancelledRef.current = true;

    // 결제 실패 시 주문 취소 → 상품 해제
    cancelOrder(orderId).catch(() => {});
  }, [orderId]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
        <XCircle className="h-8 w-8 text-red-400" />
      </div>
      <h1 className="text-2xl font-bold">결제가 취소되었습니다</h1>
      <p className="text-center text-sm text-muted">
        {message || "결제가 완료되지 않았습니다."}
        <br />
        다시 시도하시거나 다른 작품을 둘러보세요.
      </p>
      <Link href="/products">
        <Button variant="secondary">다른 작품 보기</Button>
      </Link>
    </motion.div>
  );
}

export default function CheckoutFailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="pearl-text">처리 중...</div>
        </div>
      }
    >
      <FailContent />
    </Suspense>
  );
}
