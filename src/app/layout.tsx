import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Easy Stock | 台股財務資訊平台",
  description: "輕鬆查詢台股營收數據，提供直觀的圖表分析和詳細數據展示。",
  keywords: ["台股", "股票", "營收", "財務分析", "數據視覺化"],
  authors: [{ name: "Daniel" }],
  creator: "Daniel",
  openGraph: {
    title: "Easy Stock | 台股財務資訊平台",
    description: "輕鬆查詢台股營收數據，提供直觀的圖表分析和詳細數據展示。",
    type: "website",
    locale: "zh_TW",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
