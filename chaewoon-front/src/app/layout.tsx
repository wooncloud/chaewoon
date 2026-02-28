import type { Metadata } from "next";
import { ClientLayout } from "@/components/layout/client-layout";
import { ToastContainer } from "@/components/layout/toast-container";
import "./globals.css";

export const metadata: Metadata = {
  title: "채운(彩雲) - 자개 공예 프리미엄 샵",
  description:
    "구름 사이로 비치는 영롱한 자개 빛깔. 전통 자개 공예의 아름다움을 현대에 전합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
        <ToastContainer />
      </body>
    </html>
  );
}
