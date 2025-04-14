import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Easy Stock",
  description: "台股財務資訊平台",
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
