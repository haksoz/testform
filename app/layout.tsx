import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test Form - Basit Kayıt Formu",
  description: "Ad ve Soyad kayıt formu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}

