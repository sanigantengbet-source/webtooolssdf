import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { RouteProgress } from '@/components/ui/route-progress';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://project.saannndec5ty.my.id'),
  title: 'SANN404 FORUM GROUP | Curated Tools Collection',
  description:
    'A centralized hub of hand-crafted web tools, utilities, automation resources, and projects built to empower modern developers and digital explorers.',
  openGraph: {
    title: 'SANN404 FORUM GROUP | Curated Tools Collection',
    description:
      'A centralized hub of hand-crafted web tools, utilities, automation resources, and projects built to empower modern developers and digital explorers.',
    url: 'https://project.saannndec5ty.my.id',
    type: 'website',
    siteName: 'Tools Collection',
    locale: 'id_ID',
    images: [
      {
        url: 'https://i.ibb.co/v6sxPmTP/file-00000000348481fa9ff18e206e8219a9.png',
        secureUrl: 'https://i.ibb.co/v6sxPmTP/file-00000000348481fa9ff18e206e8219a9.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Tools Collection - SANN404 FORUM GROUP',
      },
      {
        url: '/og-image.jpg',
        secureUrl: 'https://project.saannndec5ty.my.id/og-image.jpg',
        width: 1200,
        height: 628,
        type: 'image/jpeg',
        alt: 'Tools Collection - SANN404 FORUM GROUP',
      },
      {
        url: '/og-image.png',
        secureUrl: 'https://project.saannndec5ty.my.id/og-image.png',
        width: 1200,
        height: 628,
        type: 'image/png',
        alt: 'Tools Collection - SANN404 FORUM GROUP',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SANN404 FORUM GROUP | Curated Tools Collection',
    description:
      'A centralized hub of hand-crafted web tools, utilities, automation resources, and projects built to empower modern developers and digital explorers.',
    images: ['https://i.ibb.co/v6sxPmTP/file-00000000348481fa9ff18e206e8219a9.png'],
  },
  other: {
    image_src: 'https://i.ibb.co/v6sxPmTP/file-00000000348481fa9ff18e206e8219a9.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SANN404 FORUM GROUP | Curated Tools Collection</title>
        <meta
          name="description"
          content="A centralized hub of hand-crafted web tools, utilities, automation resources, and projects built to empower modern developers and digital explorers."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://project.saannndec5ty.my.id" />
        <meta property="og:site_name" content="Tools Collection" />
        <meta property="og:locale" content="id_ID" />
        <meta property="og:title" content="SANN404 FORUM GROUP | Curated Tools Collection" />
        <meta
          property="og:description"
          content="A centralized hub of hand-crafted web tools, utilities, automation resources, and projects built to empower modern developers and digital explorers."
        />
        <meta
          property="og:image"
          content="https://i.ibb.co/v6sxPmTP/file-00000000348481fa9ff18e206e8219a9.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://i.ibb.co/v6sxPmTP/file-00000000348481fa9ff18e206e8219a9.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="Tools Collection - SANN404 FORUM GROUP" />
        <meta property="og:image" content="https://project.saannndec5ty.my.id/og-image.jpg" />
        <meta property="og:image:secure_url" content="https://project.saannndec5ty.my.id/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="628" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SANN404 FORUM GROUP | Curated Tools Collection" />
        <meta
          name="twitter:description"
          content="A centralized hub of hand-crafted web tools, utilities, automation resources, and projects built to empower modern developers and digital explorers."
        />
        <meta
          name="twitter:image"
          content="https://i.ibb.co/v6sxPmTP/file-00000000348481fa9ff18e206e8219a9.png"
        />
        <link
          rel="image_src"
          href="https://i.ibb.co/v6sxPmTP/file-00000000348481fa9ff18e206e8219a9.png"
        />
      </head>
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
