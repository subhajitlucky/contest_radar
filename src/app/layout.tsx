import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { Toaster } from 'sonner';

import PWARegister from '@/components/pwa/pwa-register';

// Primary font for UI and body text
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// Monospace font for code and technical content
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Inter font for better readability
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  weight: 'variable',
});

// JetBrains Mono for coding sections
const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
});

// Space Grotesk for headings and branding
const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
  weight: 'variable',
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

  // PWA Manifest
  manifest: '/manifest.json',

  // PWA Icons
  icons: {
    icon: [
      { url: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
      { url: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/icons/icon-152x152.png',
      },
    ],
  },

  // PWA Meta Tags
  applicationName: 'Contest Radar',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Contest Radar',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        {/* PWA Meta Tags */}
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Contest Radar' />
        <meta name='application-name' content='Contest Radar' />
        <meta name='msapplication-TileColor' content='#3B82F6' />
        <meta name='msapplication-config' content='none' />

        {/* Microsoft Tiles */}
        <meta name='msapplication-TileImage' content='/icons/icon-144x144.png' />
        <meta name='msapplication-square70x70logo' content='/icons/icon-72x72.png' />
        <meta name='msapplication-square150x150logo' content='/icons/icon-152x152.png' />
        <meta name='msapplication-wide310x150logo' content='/icons/icon-384x384.png' />
        <meta name='msapplication-square310x310logo' content='/icons/icon-512x512.png' />

        {/* Apple Touch Icons */}
        <link rel='apple-touch-icon' sizes='152x152' href='/icons/icon-152x152.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/icons/icon-192x192.png' />
        <link rel='apple-touch-icon' sizes='167x167' href='/icons/icon-152x152.png' />

        {/* Favicons */}
        <link rel='icon' type='image/png' sizes='32x32' href='/icons/icon-72x72.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/icons/icon-72x72.png' />
        <link rel='shortcut icon' href='/icons/icon-72x72.png' />

        {/* Splash Screens for iOS */}
        <link rel='apple-touch-startup-image' href='/icons/icon-512x512.png' />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} antialiased`}>
        {children}
        <Toaster position='top-right' richColors />

        {/* PWA Service Worker Registration */}
        <PWARegister />
      </body>
    </html>
  );
}
