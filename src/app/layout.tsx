import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ultimate Contest Radar - The Most Advanced Competitive Programming Platform',
  description: 'Track contests across all platforms, get AI-powered recommendations, and master DSA with 2000+ curated problems. The ultimate ecosystem for competitive programmers.',
  keywords: [
    'competitive programming',
    'contest tracking',
    'DSA problems',
    'Codeforces',
    'LeetCode',
    'AtCoder',
    'programming contests',
    'algorithm practice',
  ],
  authors: [{ name: 'Ultimate Contest Radar Team' }],
  creator: 'Ultimate Contest Radar',
  publisher: 'Ultimate Contest Radar',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://contest-radar.com',
    title: 'Ultimate Contest Radar - The Most Advanced Competitive Programming Platform',
    description: 'Track contests across all platforms, get AI-powered recommendations, and master DSA with 2000+ curated problems.',
    siteName: 'Ultimate Contest Radar',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ultimate Contest Radar - The Most Advanced Competitive Programming Platform',
    description: 'Track contests across all platforms, get AI-powered recommendations, and master DSA with 2000+ curated problems.',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster position='top-right' richColors />
      </body>
    </html>
  );
}
