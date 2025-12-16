import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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
  title: "ContestRadar - Track Codeforces Contests",
  description: "Real-time tracking of upcoming Codeforces contests. Get timely notifications and never miss your favorite competitions.",
  keywords: ["coding contests", "competitive programming", "Codeforces", "contest tracker", "div 1", "div 2", "div 3", "educational round"],
  authors: [{ name: "ContestRadar" }],
  openGraph: {
    title: "ContestRadar - Track Codeforces Contests",
    description: "Real-time Codeforces contest tracking with official API data",
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
      </body>
    </html>
  );
}
