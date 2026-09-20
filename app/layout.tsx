import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { RouteProgress } from '@/components/ui/route-progress';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://project.saannndec5ty.my.id'),
  title: 'Tools Collection - Curated Tools & Projects',
  description: 'A curated collection of web tools, websites and projects created and maintained by SANN404 FORUM GROUP',
  openGraph: {
    title: 'Tools Collection - Curated Tools & Projects',
    description: 'A curated collection of web tools, websites and projects created and maintained by SANN404 FORUM GROUP',
    type: 'website',
    siteName: 'Tools Collection',
    images: [
      {
        url: 'https://i.ibb.co/v6sxPmTP/file-00000000348481fa9ff18e206e8219a9.png',
        width: 1734,
        height: 907,
        alt: 'Tools Collection - SANN404 FORUM GROUP',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tools Collection - Curated Tools & Projects',
    description: 'A curated collection of web tools, websites and projects created and maintained by SANN404 FORUM GROUP',
    images: [
      {
        url: 'https://i.ibb.co/v6sxPmTP/file-00000000348481fa9ff18e206e8219a9.png',
        width: 1734,
        height: 907,
        alt: 'Tools Collection - SANN404 FORUM GROUP',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body className="antialiased bg-black text-[#ededed] min-h-screen">
        <ThemeProvider>
          <Suspense fallback={null}>
            <RouteProgress />
          </Suspense>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
