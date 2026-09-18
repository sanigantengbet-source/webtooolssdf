import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { RouteProgress } from '@/components/ui/route-progress';

export const metadata: Metadata = {
  title: 'Tools Collection - Curated Tools & Projects',
  description: 'A curated collection of web tools, websites and projects created and maintained by SANN404 FORUM GROUP',
  openGraph: {
    title: 'Tools Collection - Curated Tools & Projects',
    description: 'A curated collection of web tools, websites and projects created and maintained by SANN404 FORUM GROUP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tools Collection - Curated Tools & Projects',
    description: 'A curated collection of web tools, websites and projects created and maintained by SANN404 FORUM GROUP',
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
