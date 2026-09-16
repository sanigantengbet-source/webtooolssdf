import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';

export const metadata: Metadata = {
  title: 'Tool Collection - Curated Tools & Projects',
  description: 'A curated collection of tools, websites, and projects with real-time Supabase management and developer-grade administrative security.',
  openGraph: {
    title: 'Tool Collection - Curated Tools & Projects',
    description: 'A curated collection of tools, websites, and projects with real-time Supabase management and developer-grade administrative security.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tool Collection - Curated Tools & Projects',
    description: 'A curated collection of tools, websites, and projects.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body className="antialiased bg-black text-[#ededed] min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
