import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ContestRadar — Live coding contest radar",
  description:
    "One live schedule for Codeforces, LeetCode, CodeChef, AtCoder, and HackerRank. Free alerts, calendar feeds, and zero noise.",
  keywords: [
    "coding contests",
    "competitive programming",
    "Codeforces",
    "LeetCode",
    "CodeChef",
    "AtCoder",
    "HackerRank",
    "contest tracker",
  ],
  authors: [{ name: "ContestRadar" }],
  openGraph: {
    title: "ContestRadar — Live coding contest radar",
    description:
      "One live schedule for five platforms. Free alerts, calendar feeds, and zero noise.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
    { media: "(prefers-color-scheme: light)", color: "#f6f5f1" },
  ],
};

const THEME_INIT = `(function(){try{var t=localStorage.getItem('cr-theme');if(t!=='light'&&t!=='dark'){t='dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${instrumentSans.variable} ${plexMono.variable} min-h-screen antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
