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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var d = document.documentElement;
                var t = localStorage.getItem('tool-collection-theme');
                var isDark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches) || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  d.classList.add('dark');
                  d.style.colorScheme = 'dark';
                } else {
                  d.classList.remove('dark');
                  d.style.colorScheme = 'light';
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased bg-white dark:bg-black text-[#171717] dark:text-[#ededed] min-h-screen">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
