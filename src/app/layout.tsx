import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "社团通 - 社团招新智能匹配平台",
  description: "AI 对话 + 结构化浏览，帮助新生发现并加入适合的社团",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col selection:bg-indigo-100 selection:text-indigo-700">
        <Navbar />
        <main className="flex-1">
          <div className="w-full px-6 md:px-12 py-4 md:py-6">{children}</div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
