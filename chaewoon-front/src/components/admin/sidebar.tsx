"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tag,
  BarChart3,
  ClipboardList,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/products", label: "상품 관리", icon: Package },
  { href: "/admin/coupons", label: "쿠폰 관리", icon: Tag },
  { href: "/admin/orders", label: "주문 관리", icon: ClipboardList },
  { href: "/admin/analytics", label: "매출 통계", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const sidebar = (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
            isActive(item.href)
              ? "bg-white/10 text-foreground"
              : "text-muted hover:bg-white/5 hover:text-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}

      <div className="my-3 border-t border-border" />

      <Link
        href="/"
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        고객 사이트로
      </Link>
    </nav>
  );

  return (
    <>
      {/* 모바일 토글 버튼 */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted md:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* 모바일 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 모바일 사이드바 */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-60 border-r border-border bg-card transition-transform md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center border-b border-border px-4">
          <span className="pearl-text text-lg font-bold">채운 Admin</span>
        </div>
        {sidebar}
      </aside>

      {/* 데스크톱 사이드바 */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card md:block">
        <div className="flex h-14 items-center border-b border-border px-4">
          <span className="pearl-text text-lg font-bold">채운 Admin</span>
        </div>
        {sidebar}
      </aside>
    </>
  );
}
