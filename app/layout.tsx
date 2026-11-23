import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UniManage",
  description: "Õpilasesinduse juhatuse haldus",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="et"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <nav className="mx-auto w-full max-w-5xl px-4 py-3">
            <Link href="/" className="text-sm font-medium hover:underline">
              ← Avaleht
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
