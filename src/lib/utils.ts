import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(price) + "원";
}

export function calculateDiscountedPrice(
  price: number,
  discountPercent: number
): number {
  return Math.round(price * (1 - discountPercent / 100));
}
