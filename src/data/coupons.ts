import { Coupon } from "@/types";

export const coupons: Coupon[] = [
  {
    id: "cpn-001",
    code: "WELCOME10",
    description: "신규 가입 환영 10% 할인",
    discountType: "percent",
    discountValue: 10,
    minOrderAmount: 50000,
    maxDiscountAmount: 30000,
    validFrom: "2025-01-01",
    validUntil: "2025-12-31",
    isActive: true,
  },
  {
    id: "cpn-002",
    code: "CHAEWOON5000",
    description: "채운 5,000원 할인 쿠폰",
    discountType: "fixed",
    discountValue: 5000,
    minOrderAmount: 30000,
    validFrom: "2025-01-01",
    validUntil: "2025-12-31",
    isActive: true,
  },
  {
    id: "cpn-003",
    code: "PREMIUM20",
    description: "프리미엄 20% 할인",
    discountType: "percent",
    discountValue: 20,
    minOrderAmount: 200000,
    maxDiscountAmount: 100000,
    validFrom: "2025-06-01",
    validUntil: "2025-08-31",
    isActive: true,
  },
];

export function validateCoupon(
  code: string,
  orderAmount: number
): { valid: boolean; coupon?: Coupon; message: string } {
  const coupon = coupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase()
  );

  if (!coupon) {
    return { valid: false, message: "존재하지 않는 쿠폰 코드입니다." };
  }

  if (!coupon.isActive) {
    return { valid: false, message: "비활성화된 쿠폰입니다." };
  }

  const now = new Date();
  if (now < new Date(coupon.validFrom) || now > new Date(coupon.validUntil)) {
    return { valid: false, message: "유효 기간이 지난 쿠폰입니다." };
  }

  if (orderAmount < coupon.minOrderAmount) {
    return {
      valid: false,
      message: `최소 주문 금액은 ${new Intl.NumberFormat("ko-KR").format(coupon.minOrderAmount)}원입니다.`,
    };
  }

  return { valid: true, coupon, message: "쿠폰이 적용되었습니다." };
}

export function calculateCouponDiscount(
  coupon: Coupon,
  orderAmount: number
): number {
  if (coupon.discountType === "fixed") {
    return coupon.discountValue;
  }

  const discount = Math.round(orderAmount * (coupon.discountValue / 100));
  if (coupon.maxDiscountAmount) {
    return Math.min(discount, coupon.maxDiscountAmount);
  }
  return discount;
}
