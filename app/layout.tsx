import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ContestRadar - Track Coding Contests",
  description: "Real-time tracking of upcoming contests from Codeforces, LeetCode, CodeChef, AtCoder, and HackerRank.",
  keywords: ["coding contests", "competitive programming", "Codeforces", "LeetCode", "CodeChef", "AtCoder", "HackerRank", "contest tracker"],
  authors: [{ name: "ContestRadar" }],
  openGraph: {
    title: "ContestRadar - Track Coding Contests",
    description: "Real-time multi-platform contest tracking from official and normalized APIs",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-950`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
