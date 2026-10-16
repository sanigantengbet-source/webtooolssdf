import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SpotiFlow - Spotify Audio & Cover Downloader',
  description: 'High-fidelity Spotify music and artwork extractor. Download 320kbps MP3 tracks, lossless album covers, and complete track metadata with instant browser preview.',
  openGraph: {
    title: 'SpotiFlow - Spotify Audio & Cover Downloader',
    description: 'High-fidelity Spotify music and artwork extractor. Download 320kbps MP3 tracks, lossless album covers, and complete track metadata with instant browser preview.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpotiFlow - Spotify Audio & Cover Downloader',
    description: 'High-fidelity Spotify music and artwork extractor. Download 320kbps MP3 tracks, lossless album covers, and complete track metadata with instant browser preview.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className="bg-[#07090e] text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
